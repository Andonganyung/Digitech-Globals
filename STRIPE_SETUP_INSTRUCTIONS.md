# Stripe Payment Setup Instructions

## CRITICAL: Payment System is Currently NOT Processing Real Payments

The current setup is a demo and WILL NOT charge customers. You MUST complete this setup before accepting real orders.

## Step 1: Get Stripe API Keys

1. Go to https://dashboard.stripe.com/register
2. Create a Stripe account
3. Get your API keys:
   - **Publishable Key** (starts with `pk_live_...`)
   - **Secret Key** (starts with `sk_live_...`)

## Step 2: Update Payment Page

Edit `academy/payment.html` line 89:
```javascript
const stripe = Stripe('pk_live_YOUR_ACTUAL_KEY_HERE');
```
Replace with YOUR publishable key.

## Step 3: Setup Backend (Choose ONE option)

### Option A: Use Stripe Payment Links (EASIEST - No coding)

1. In Stripe Dashboard, go to Products
2. Create a product for each course with pricing
3. Create Payment Links
4. Replace the payment button to redirect to Stripe Payment Link
5. Set success_url to: `https://digitech-globals-academy.web.app/academy/payment-success.html?session_id={CHECKOUT_SESSION_ID}`

### Option B: Deploy Firebase Functions (Recommended)

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize functions: `firebase init functions`
4. Copy `functions/stripe-checkout.js` content to `functions/index.js`
5. Install Stripe: `cd functions && npm install stripe`
6. Add secret key to Firebase config:
   ```
   firebase functions:config:set stripe.secret="sk_live_YOUR_SECRET_KEY"
   ```
7. Deploy: `firebase deploy --only functions`
8. Update payment.html API endpoint to your function URL

### Option C: Use External Backend (Node.js/Express)

Deploy the provided `stripe-checkout.js` to Heroku, Vercel, or AWS Lambda.

## Step 4: Setup Webhook (For order confirmation)

1. In Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `https://YOUR_BACKEND_URL/webhook`
3. Select events: `checkout.session.completed`
4. Copy webhook secret (starts with `whsec_...`)
5. Add to your backend configuration

## Step 5: Test Before Launch

1. Use Stripe test mode first
2. Test card: 4242 4242 4242 4242
3. Verify orders save to Firestore
4. Verify emails are sent
5. Test receipt downloads

## Step 6: Go Live

1. Switch to live API keys
2. Remove test mode indicators
3. Set up proper email notifications
4. Monitor Stripe Dashboard for payments

## Security Notes

- NEVER expose secret keys in frontend code
- Always validate payments server-side
- Use HTTPS only
- Set up Firestore security rules properly

## Current Status: ⚠️ DEMO MODE - NOT PROCESSING REAL PAYMENTS

**Action Required:** Complete steps above before accepting customer payments.
