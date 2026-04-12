# Course Prices Updated - Summary Report

## Status: COMPLETED

All individual course pages have been updated to match the market prices from `course-pricing.js`.

---

## What Was Updated

### 18 Courses Updated:

| Course | Old Price | New Price | Status |
|--------|-----------|-----------|--------|
| windows-power | $29 | $99 | UPDATED |
| windows-basics | $19 | $49 | UPDATED |
| python-it | $99 | $119 | UPDATED |
| powershell-it | $69 | $119 | UPDATED |
| networking-fundamentals | $59 | $89 | UPDATED |
| ms-word | $29 | $49 | UPDATED |
| ms-powerpoint | $25 | $49 | UPDATED |
| ms-outlook | $22 | $49 | UPDATED |
| ms-excel | $49 | $59 | UPDATED |
| ms-900 | $59 | $79 | UPDATED |
| leadership | $29 | $119 | UPDATED |
| it-support-fundamentals | $49 | $79 | UPDATED |
| intune-endpoint | $89 | $139 | UPDATED |
| internet-safety | $29 | $39 | UPDATED |
| helpdesk-pro | $69 | $99 | UPDATED |
| entrepreneurship | $29 | $129 | UPDATED |
| email-social | $29 | $89 | UPDATED |
| digital-marketing | $29 | $119 | UPDATED |

### Courses Already Correct (No Changes):

| Course | Price | Status |
|--------|-------|--------|
| enterprise-desktop-engineer | $199 | CORRECT |
| security-plus | $179 | CORRECT |
| sccm-intune-endpoint | $249 | CORRECT |
| az-900 | $79 | CORRECT |
| az-104 | $149 | CORRECT |
| ccna-prep | $199 | CORRECT |
| ai-for-it-engineers | $199 | CORRECT |
| cybersec-essentials | $99 | CORRECT |
| computer-basics | $29 | CORRECT |

---

## Complete Price List (Self-Study)

All prices now match between:
- Individual course pages (e.g., `az-900.html`)
- Registration system (`course-pricing.js`)
- Payment system (will use dynamic pricing)

### Sorted by Price:

| Price | Course |
|-------|--------|
| $29 | computer-basics |
| $39 | internet-safety |
| $49 | windows-basics, ms-word, ms-powerpoint, ms-outlook |
| $59 | ms-excel |
| $79 | az-900, ms-900, it-support-fundamentals |
| $89 | networking-fundamentals, email-social |
| $99 | windows-power, helpdesk-pro, cybersec-essentials |
| $119 | python-it, powershell-it, leadership, digital-marketing |
| $129 | entrepreneurship |
| $139 | intune-endpoint |
| $149 | az-104 |
| $179 | security-plus |
| $199 | enterprise-desktop-engineer, ccna-prep, ai-for-it-engineers |
| $249 | sccm-intune-endpoint |

---

## Instructor-Led Pricing

All instructor-led prices remain in `course-pricing.js`:

| Course | Self-Study | Instructor-Led |
|--------|------------|----------------|
| computer-basics | $29 | $495 |
| internet-safety | $39 | $495 |
| windows-basics | $49 | $695 |
| ms-word | $49 | $595 |
| ms-powerpoint | $49 | $595 |
| ms-outlook | $49 | $595 |
| ms-excel | $59 | $695 |
| az-900 | $79 | $895 |
| ms-900 | $79 | $895 |
| it-support-fundamentals | $79 | $995 |
| networking-fundamentals | $89 | $1,095 |
| email-social | $89 | $1,095 |
| windows-power | $99 | $1,195 |
| helpdesk-pro | $99 | $1,195 |
| cybersec-essentials | $99 | $1,195 |
| python-it | $119 | $1,895 |
| powershell-it | $119 | $1,995 |
| leadership | $119 | $1,495 |
| digital-marketing | $119 | $1,495 |
| entrepreneurship | $129 | $1,595 |
| intune-endpoint | $139 | $1,995 |
| az-104 | $149 | $2,495 |
| security-plus | $179 | $2,295 |
| enterprise-desktop-engineer | $199 | $2,495 |
| ccna-prep | $199 | $2,695 |
| ai-for-it-engineers | $199 | $2,195 |
| sccm-intune-endpoint | $249 | $2,795 |

---

## Files Modified

### Individual Course Pages (18 files):
- `academy/windows-power.html`
- `academy/windows-basics.html`
- `academy/python-it.html`
- `academy/powershell-it.html`
- `academy/networking-fundamentals.html`
- `academy/ms-word.html`
- `academy/ms-powerpoint.html`
- `academy/ms-outlook.html`
- `academy/ms-excel.html`
- `academy/ms-900.html`
- `academy/leadership.html`
- `academy/it-support-fundamentals.html`
- `academy/intune-endpoint.html`
- `academy/internet-safety.html`
- `academy/helpdesk-pro.html`
- `academy/entrepreneurship.html`
- `academy/email-social.html`
- `academy/digital-marketing.html`

### Unchanged Files:
- `js/course-pricing.js` (source of truth for pricing)
- All course pages that already had correct prices

---

## Next Steps for Full Price Sync

### Optional: Update Course Catalog

The following pages may still show old prices and can be updated if needed:

1. **`academy/courses.html`** - Main course catalog page
2. **`academy/index.html`** - Academy homepage featured courses

These can be updated manually or wait until Firebase Functions are deployed (which will handle dynamic pricing automatically).

---

## Verification

To verify prices are correct:

1. Visit any course page (e.g., `academy/python-it.html`)
2. Check the "price-current" shows: **$119**
3. Click "Enroll Now" → Register
4. Select "Self-Study" option
5. Verify price shown matches: **$119**

---

## Payment Integration Status

- Individual course prices: UPDATED
- course-pricing.js: UNCHANGED (source of truth)
- Payment system: Ready for Firebase Functions deployment
- Stripe integration: Will use dynamic pricing from course-pricing.js

---

**Last Updated:** April 12, 2026
**Status:** ALL COURSE PAGES UPDATED - PRICES NOW MATCH
