const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_live_YOUR_SECRET_KEY_HERE'); // Replace with your Stripe secret key

exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
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
            res.status(400).send({ error: 'Missing required fields' });
            return;
        }
        
        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `DigiTech Academy Course: ${courseId}`,
                        description: `${registrationData.trainingMode === 'self-study' ? 'Online Self-Study' : 'Class-Based Instructor-Led'}`
                    },
                    unit_amount: amount
                },
                quantity: 1
            }],
            mode: 'payment',
            customer_email: customerEmail,
            success_url: `https://digitech-globals-academy.web.app/academy/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://digitech-globals-academy.web.app/academy/payment.html?course=${courseId}&amount=${amount/100}&email=${customerEmail}`,
            metadata: {
                courseId: courseId,
                customerName: customerName,
                registrationData: JSON.stringify(registrationData)
            }
        });
        
        res.status(200).send({ id: session.id });
        
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).send({ error: error.message });
    }
});

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = 'whsec_YOUR_WEBHOOK_SECRET'; // Get from Stripe Dashboard
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // Save order to Firestore
        const registrationData = JSON.parse(session.metadata.registrationData);
        
        await admin.firestore().collection('orders').add({
            ...registrationData,
            stripeSessionId: session.id,
            stripePaymentIntent: session.payment_intent,
            amountPaid: session.amount_total / 100,
            currency: session.currency,
            paymentStatus: 'completed',
            paidAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        // Send confirmation email (add email service here)
        console.log('Payment successful for:', registrationData.email);
    }
    
    res.status(200).send({ received: true });
});
