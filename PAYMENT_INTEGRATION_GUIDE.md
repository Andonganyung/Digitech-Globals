# Complete Stripe Payment Integration Guide

Your Stripe account is ready! Here's how to enable live payments in 10 minutes.

## Your Stripe Account
- Dashboard: https://dashboard.stripe.com/acct_1TLPcpDJaxA7K4rB
- Publishable Key: `pk_live_51TLPcpDJaxA7K4rB...` ✅ (Already added)
- Secret Key: Get from dashboard (keep private)

## Quick Setup - Option 1: Payment Links (EASIEST - 5 min)

### Step 1: Create Products in Stripe

1. Go to: https://dashboard.stripe.com/products
2. Click "**+ Add product**"
3. Create these products:

**Product 1: Self-Study Courses**
- Name: `DigiTech Academy - Online Self-Study`
- Description: `Self-paced online learning`
- Price: One-time, $99 (you'll adjust per course)
- Click Save

**Product 2: Instructor-Led Courses**
- Name: `DigiTech Academy - Instructor-Led Training`
- Description: `Live training with instructor support`
- Price: One-time, $1,195 (you'll adjust per course)
- Click Save

### Step 2: Create Payment Links

For each product:
1. Click on the product
2. Click "**Create payment link**"
3. Set success URL: `https://digitech-globals-academy.web.app/academy/payment-success.html`
4. Copy the payment link (looks like: `https://buy.stripe.com/...`)

### Step 3: Update payment.html

Replace lines in `academy/payment.html`:
```javascript
// Add at top:
const PAYMENT_LINKS = {
    'self-study': 'https://buy.stripe.com/YOUR_SELF_STUDY_LINK',
    'instructor-led': 'https://buy.stripe.com/YOUR_INSTRUCTOR_LED_LINK'
};

// In card payment section:
const registrationData = JSON.parse(sessionStorage.getItem('pendingRegistration'));
const paymentLink = registrationData.trainingMode === 'self-study' 
    ? PAYMENT_LINKS['self-study']
    : PAYMENT_LINKS['instructor-led'];

window.location.href = paymentLink + `?prefilled_email=${email}`;
```

✅ **DONE! Payments will work immediately.**

---

## Advanced Setup - Option 2: Full Checkout API (20 min)

Better for custom pricing per course.

### Step 1: Get Secret Key

1. Go to: https://dashboard.stripe.com/apikeys
2. Find "**Secret key**" (starts with `sk_live_...`)
3. Click "Reveal live key token"
4. Copy it

### Step 2: Set Up Firebase Functions

```bash
cd C:\Users\Andong\Digitech-Globals
firebase init functions
cd functions
npm install stripe
```

### Step 3: Add Secret to Firebase

```bash
firebase functions:config:set stripe.secret="sk_live_YOUR_SECRET_KEY_HERE"
```

### Step 4: Deploy Function

The function code is already in `functions/stripe-checkout.js`.

```bash
firebase deploy --only functions
```

### Step 5: Update payment.html

Replace the API URL with your function URL:
```javascript
const response = await fetch('https://us-central1-digitech-globals-academy.cloudfunctions.net/createCheckoutSession', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        amount: Math.round(amount * 100),
        courseId,
        customerEmail: email,
        customerName: registrationData.firstName + ' ' + registrationData.lastName
    })
});
```

---

## Verify Payments

### Test Card (in Test Mode)
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

### View Payments
- Dashboard: https://dashboard.stripe.com/payments
- Customers: https://dashboard.stripe.com/customers
- Reports: https://dashboard.stripe.com/reports

---

## Security Checklist

✅ Never commit secret key to git
✅ Use environment variables for keys
✅ Enable webhook signature verification
✅ Set up email notifications
✅ Add fraud detection rules in Stripe

---

## Which Option Should You Use?

**Use Option 1 (Payment Links)** if:
- You want it working in 5 minutes
- You have fixed pricing per training mode
- You don't need complex customization

**Use Option 2 (Full API)** if:
- You want different pricing per course
- You need custom receipt/invoice generation
- You want subscription/installment plans later

**Recommendation:** Start with Option 1, migrate to Option 2 later if needed.

---

## Need Help?

Email me the payment links from Step 2 and I'll integrate them immediately.
