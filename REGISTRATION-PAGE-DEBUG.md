# Registration Page Debug Guide

## Issue: Pricing cards not showing

If you can't see the Self-Study and Instructor-Led pricing cards on the registration page, follow these steps:

### Step 1: Verify the URL

When you click "Enroll Now" from a course page, the URL should look like:
```
academy/register.html?course=it-support-fundamentals
```

**If the URL is just `register.html` without `?course=...`:**
- The enroll button is missing the course parameter
- Let me know which course page you're testing

### Step 2: Check Browser Console

1. Open the registration page
2. Press **F12** to open Developer Tools
3. Click the **Console** tab
4. Look for any red error messages

**Common errors to look for:**
- "getCoursePricing is not a function"
- "Cannot read property of undefined"
- Any 404 errors for JavaScript files

### Step 3: Verify Files are Loading

In the Console tab, type:
```javascript
typeof getCoursePricing
```

**Expected result:** Should show `"function"`  
**If it shows `"undefined"`:** The course-pricing.js file isn't loading

### Step 4: Check if Elements Exist

In the Console, type:
```javascript
document.getElementById('selfStudyPrice')
```

**Expected:** Should show an HTML element  
**If null:** The pricing section isn't in the HTML

### Step 5: Manual Test

Try accessing the registration page directly with a course parameter:
```
http://localhost/academy/register.html?course=python-it
```
or
```
file:///C:/Users/Andong/Digitech-Globals/academy/register.html?course=python-it
```

### Possible Causes:

1. **Browser Cache:** The old register.html is cached
   - **Fix:** Hard refresh (Ctrl+Shift+R or Ctrl+F5)

2. **File Path Issue:** JavaScript files not loading
   - **Fix:** Check browser console for 404 errors

3. **JavaScript Error:** Script failing before updating prices
   - **Fix:** Check console for errors

4. **Wrong File:** Viewing an old version of register.html
   - **Fix:** Verify you're in the correct directory

### Quick Fix Test:

Save this as `test-register.html` in the academy folder:

```html
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
<h1>Registration Pricing Test</h1>
<p>Self-Study: <span id="selfStudyPrice">$99</span></p>
<p>Instructor-Led: <span id="instructorLedPrice">$1,195</span></p>

<script src="../js/course-pricing.js"></script>
<script>
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('course') || 'python-it';
const pricing = getCoursePricing(courseId);
document.getElementById('selfStudyPrice').textContent = '$' + pricing.selfStudy;
document.getElementById('instructorLedPrice').textContent = '$' + pricing.instructorLed;
alert('Course: ' + courseId + ', Self-Study: $' + pricing.selfStudy + ', Instructor-Led: $' + pricing.instructorLed);
</script>
</body>
</html>
```

Then open: `test-register.html?course=python-it`

If this shows correct prices ($119 / $1,895), then register.html has an issue.
If this ALSO doesn't work, then course-pricing.js isn't loading.

### What to Share:

Please share:
1. The exact URL you're visiting
2. Any error messages from browser console (F12)
3. Screenshot of what you see
4. Result of the test-register.html test

This will help me identify the exact issue!
