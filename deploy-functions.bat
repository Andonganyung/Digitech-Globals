@echo off
echo ========================================
echo DigiTech Globals - Firebase Functions Deployment
echo ========================================
echo.

echo Step 1: Checking Firebase CLI installation...
where firebase >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Firebase CLI not found!
    echo.
    echo Installing Firebase CLI...
    npm install -g firebase-tools
    echo.
)

echo Step 2: Checking if logged in to Firebase...
firebase projects:list >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Not logged in. Opening browser to login...
    firebase login
)

echo.
echo Step 3: Installing function dependencies...
cd functions
call npm install
cd ..

echo.
echo Step 4: Checking Stripe secret configuration...
firebase functions:config:get stripe.secret >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo IMPORTANT: Stripe Secret Key Required
    echo ========================================
    echo.
    echo Please enter your Stripe Secret Key.
    echo You can find it at: https://dashboard.stripe.com/apikeys
    echo.
    echo The key starts with: sk_live_ or sk_test_
    echo.
    set /p STRIPE_KEY="Enter Stripe Secret Key: "
    firebase functions:config:set stripe.secret="%STRIPE_KEY%"
)

echo.
echo Step 5: Deploying functions to Firebase...
firebase deploy --only functions

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo IMPORTANT: Copy the function URL from above output!
echo It looks like: https://us-central1-....cloudfunctions.net/createCheckoutSession
echo.
echo Send this URL to complete the payment integration.
echo.
pause
