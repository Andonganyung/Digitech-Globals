# Complete Pricing System Test

## What Should Work (End-to-End):

### Test Flow:
1. Visit course page (e.g., python-it.html)
2. See price: $119
3. Click "Enroll Now"
4. URL should be: register.html?course=python-it
5. See two pricing cards:
   - Self-Study: $119
   - Instructor-Led: $1,895
6. Select option and fill form
7. Submit → Goes to payment.html
8. Shows correct price
9. Calls Firebase Function
10. Creates Stripe checkout with correct amount

## Current Status Check:

### Files That Must Be Correct:
- [x] js/course-pricing.js - Has all course prices
- [x] academy/register.html - Has pricing cards HTML
- [x] academy/js/register-direct.js - Updates prices via JavaScript
- [x] academy/payment.html - Uses Firebase Function
- [x] functions/index.js - Firebase Function deployed
- [x] All 27 course pages - Enroll buttons have ?course= parameter

### What I Need to Verify:
1. register.html pricing cards are visible
2. JavaScript actually runs and updates prices
3. No CSS hiding the cards
4. Scripts load in correct order
5. Everything works when you click Enroll from a course page
