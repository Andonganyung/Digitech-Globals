# 🚀 Dynamic Pricing Setup - START HERE

## What's the Goal?

Make sure each course charges its **correct individual price** when students enroll, instead of the fixed $99/$1,195 pricing.

**Example:**
- AZ-900 Self-Study should charge **$79** (not $99)
- Security+ Instructor-Led should charge **$2,295** (not $1,195)
- Python Self-Study should charge **$119** (not $99)

---

## 📋 What I've Prepared For You

I've created all the files you need:

✅ **`functions/index.js`** - Firebase Function for dynamic Stripe checkout  
✅ **`functions/package.json`** - Dependencies configuration  
✅ **`deploy-functions.bat`** - Automated deployment script  
✅ **`FIREBASE-FUNCTIONS-DEPLOYMENT-STEPS.md`** - Detailed manual steps  
✅ **`academy/payment-dynamic.html.backup`** - Updated payment code  

---

## 🎯 Quick Start (2 Options)

### Option A: Automated (Easiest) ⭐ RECOMMENDED

1. **Get your Stripe Secret Key:**
   - Go to: https://dashboard.stripe.com/apikeys
   - Find "Secret key" (starts with `sk_live_...`)
   - Click "Reveal live key token"
   - **Copy it!**

2. **Run the deployment script:**
   - Double-click: `deploy-functions.bat`
   - Follow the prompts
   - Paste your Stripe secret key when asked
   - Wait for deployment (2-3 minutes)

3. **Copy the function URL:**
   - At the end, you'll see a URL like:
     ```
     https://us-central1-digitech-globals-academy.cloudfunctions.net/createCheckoutSession
     ```
   - **Copy this entire URL!**

4. **Send me the URL** and I'll update payment.html

---

### Option B: Manual (Step-by-Step)

Follow the guide in: `FIREBASE-FUNCTIONS-DEPLOYMENT-STEPS.md`

---

## ⚠️ Important Notes

### Firebase Blaze Plan Required

Firebase Functions require the **Blaze (Pay-as-you-go) plan**.

**Don't worry!** 
- ✅ Generous free tier (2 million function calls/month)
- ✅ Your site will likely cost $0-5/month
- ✅ Only pay for what you use

**To upgrade:**
1. Go to: https://console.firebase.google.com/project/digitech-globals-academy/overview
2. Click "Upgrade to Blaze"
3. Add billing info

---

## 🧪 How It Works

### Current Flow (Payment Links - Fixed Pricing):
```
Course Page → Register → Payment → Stripe Payment Link ($99 or $1,195)
                                    ❌ Always same price
```

### New Flow (Firebase Functions - Dynamic Pricing):
```
Course Page → Register → Payment → Firebase Function → Stripe Checkout
                                         ↓
                                    Reads course price
                                    from course-pricing.js
                                         ↓
                                    ✅ Correct price!
```

---

## 📊 Price Comparison

### Example Courses:

| Course | Current (Fixed) | Correct Price | Status |
|--------|----------------|---------------|--------|
| AZ-900 Self-Study | $99 | $79 | ❌ Wrong |
| AZ-900 Instructor-Led | $1,195 | $895 | ❌ Wrong |
| Security+ Self-Study | $99 | $179 | ❌ Wrong |
| Security+ Instructor-Led | $1,195 | $2,295 | ❌ Wrong |
| Python Self-Study | $99 | $119 | ❌ Wrong |

**After implementing Firebase Functions:** All prices will be ✅ **Correct!**

---

## 🚨 Troubleshooting

### "Firebase CLI not found"
**Solution:**
```bash
npm install -g firebase-tools
```

### "Not authorized"
**Solution:**
```bash
firebase login
```

### "Billing account required"
**Solution:** Upgrade to Blaze plan (see above)

### "Stripe secret not configured"
**Solution:**
```bash
firebase functions:config:set stripe.secret="sk_live_YOUR_KEY"
```

---

## ✅ Deployment Checklist

Before you start:
- [ ] Node.js installed (check: `node --version`)
- [ ] Stripe Secret Key ready
- [ ] Firebase Blaze plan activated (if not, upgrade first)
- [ ] 15-20 minutes available

During deployment:
- [ ] Run `deploy-functions.bat` OR follow manual steps
- [ ] Enter Stripe secret key when prompted
- [ ] Wait for deployment to complete
- [ ] Copy the function URL from output

After deployment:
- [ ] Send me the function URL
- [ ] I'll update payment.html
- [ ] Test a course enrollment
- [ ] Verify correct pricing

---

## 📞 Need Help?

If you encounter any issues:
1. Check `FIREBASE-FUNCTIONS-DEPLOYMENT-STEPS.md` for detailed steps
2. Share the error message with me
3. I'll help you troubleshoot!

---

## 🎯 Next Action

**Choose one:**

1. **Easy Way:** Double-click `deploy-functions.bat` and follow prompts
2. **Manual Way:** Open `FIREBASE-FUNCTIONS-DEPLOYMENT-STEPS.md` and follow steps

**Then:** Send me the function URL when deployment is complete!

---

**Ready to fix those prices? Let's go!** 🚀
