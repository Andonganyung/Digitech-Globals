const {onRequest} = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const {defineSecret} = require('firebase-functions/params');

// Initialize Firebase Admin
admin.initializeApp();

// Define Stripe secret as a secret parameter
const stripeSecret = defineSecret('STRIPE_SECRET_KEY');

/**
 * Create Stripe Checkout Session for Course Payment
 * Supports dynamic pricing per course
 */
exports.createCheckoutSession = onRequest(
    {secrets: [stripeSecret], cors: true},
    async (req, res) => {
        // Initialize Stripe with secret
        const stripe = require('stripe')(stripeSecret.value());
        
        // Handle preflight request
        if (req.method === 'OPTIONS') {
            res.status(204).send('');
            return;
        }
        
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }
        
        try {
            const { amount, courseId, customerEmail, customerName, registrationData } = req.body;
            
            // Validate inputs
            if (!amount || !courseId || !customerEmail) {
                res.status(400).send({ error: 'Missing required fields: amount, courseId, or customerEmail' });
                return;
            }
            
            // Validate amount is positive
            if (amount <= 0) {
                res.status(400).send({ error: 'Amount must be greater than 0' });
                return;
            }
            
            console.log(`Creating checkout session for course: ${courseId}, amount: $${amount/100}`);
            
            // Create Stripe Checkout Session with dynamic pricing
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `DigiTech Academy - ${courseId}`,
                            description: `${registrationData.trainingMode === 'self-study' ? 'Online Self-Study' : 'Class-Based Instructor-Led Training'}`,
                            images: ['https://digitechglobals.com/images/dg-logo.png']
                        },
                        unit_amount: Math.round(amount) // Amount in cents
                    },
                    quantity: 1
                }],
                mode: 'payment',
                customer_email: customerEmail,
                success_url: `https://digitech-globals-academy.web.app/academy/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `https://digitech-globals-academy.web.app/academy/payment.html?course=${courseId}&amount=${amount/100}&email=${customerEmail}`,
                metadata: {
                    courseId: courseId,
                    customerName: customerName || '',
                    customerEmail: customerEmail,
                    trainingMode: registrationData.trainingMode,
                    registrationData: JSON.stringify(registrationData)
                }
            });
            
            console.log(`Checkout session created: ${session.id}`);
            res.status(200).send({ id: session.id, url: session.url });
            
        } catch (error) {
            console.error('Stripe checkout error:', error);
            res.status(500).send({ error: error.message });
        }
    }
);

/**
 * Stripe Webhook Handler
 * Processes successful payments and saves orders to Firestore
 */
exports.stripeWebhook = onRequest(
    {secrets: [stripeSecret]},
    async (req, res) => {
        // Initialize Stripe with secret
        const stripe = require('stripe')(stripeSecret.value());
        const sig = req.headers['stripe-signature'];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_YOUR_WEBHOOK_SECRET';
        
        let event;
        
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        
        // Handle the checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            
            try {
                // Parse registration data from metadata
                const registrationData = JSON.parse(session.metadata.registrationData);
                
                // Save order to Firestore
                const orderRef = await admin.firestore().collection('orders').add({
                    ...registrationData,
                    courseId: session.metadata.courseId,
                    stripeSessionId: session.id,
                    stripePaymentIntent: session.payment_intent,
                    amountPaid: session.amount_total / 100,
                    currency: session.currency,
                    paymentStatus: 'completed',
                    paidAt: admin.firestore.FieldValue.serverTimestamp(),
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });
                
                console.log(`Order saved: ${orderRef.id} for ${registrationData.email}`);
                
                // TODO: Send confirmation email
                // You can integrate SendGrid, Mailgun, or Firebase Email Extension here
                
            } catch (error) {
                console.error('Error processing webhook:', error);
            }
        }
        
        res.status(200).send({ received: true });
    }
);
