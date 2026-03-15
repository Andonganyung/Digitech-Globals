# Google Search Console Setup Guide

## Step 1: Create Google Search Console Account

1. Go to: https://search.google.com/search-console
2. Sign in with the SAME Google account you used for Analytics
3. Click "Start Now" or "Add Property"

## Step 2: Add Your Property

**Choose:** URL prefix (recommended)

**Enter:**
```
https://andonganyung.github.io
```

Click "Continue"

## Step 3: Verify Ownership

You'll see multiple verification methods. Choose the EASIEST one:

### OPTION A: HTML Tag (Recommended - Fastest)

1. Google will show you a meta tag like:
```html
<meta name="google-site-verification" content="ABC123XYZ..." />
```

2. **Copy that entire tag**

3. **SEND IT TO ME** and I'll add it to your blog pages

4. After I add it, click "Verify" in Search Console

### OPTION B: Google Analytics (Even Easier!)

1. Select "Google Analytics"
2. Since you already have GA set up with the SAME account
3. Click "Verify"
4. **DONE!** No code needed!

**TRY OPTION B FIRST - It's instant!**

## Step 4: Submit Sitemap

After verification:

1. Click "Sitemaps" in left menu
2. Enter: `sitemap.xml`
3. Click "Submit"

**Your sitemap URL:**
```
https://andonganyung.github.io/Digitech-Globals/sitemap.xml
```

## Step 5: Submit Individual Blog URLs

Click "URL Inspection" at top

Submit these URLs for immediate indexing:

```
https://andonganyung.github.io/Digitech-Globals/blog/
https://andonganyung.github.io/Digitech-Globals/blog/azure-certification-roadmap-2026.html
https://andonganyung.github.io/Digitech-Globals/blog/powershell-automation-scripts-every-admin-needs.html
```

For each URL:
1. Paste URL
2. Press Enter
3. Click "Request Indexing"
4. Wait 1-2 minutes
5. Repeat for next URL

## Step 6: Set Up Email Alerts

1. Click Settings (gear icon)
2. Click "Users and Permissions"
3. Verify your email is added
4. Enable notifications for:
   - Critical issues
   - Manual actions
   - New messages

## Expected Timeline

- **Within 24 hours:** Google starts crawling your site
- **Within 3-7 days:** Pages appear in Google search
- **Within 2 weeks:** Full indexing complete
- **Within 30 days:** Start seeing search traffic

## What You'll See in Search Console

### Performance Report
- Total clicks from Google
- Total impressions (how many times you appeared in search)
- Average position
- Click-through rate (CTR)

### Coverage Report
- How many pages are indexed
- Any errors or warnings
- Pages excluded from search

### Links Report
- Who's linking to your site (backlinks)
- Your most linked pages
- Internal link structure

## Monitoring Schedule

**Weekly (Every Monday):**
- Check Performance report
- See which keywords are bringing traffic
- Identify top-performing content

**Monthly (First of month):**
- Review Coverage report
- Fix any errors
- Submit new content for indexing

## Troubleshooting

**If verification fails:**
1. Make sure meta tag is in `<head>` section
2. Clear browser cache and try again
3. Wait 24 hours and retry
4. Try Google Analytics verification method instead

**If sitemap not found:**
1. Verify URL: https://andonganyung.github.io/Digitech-Globals/sitemap.xml
2. Check it opens in browser
3. Wait 24-48 hours after submission

## Next Steps After Setup

1. Monitor weekly reports
2. Track keyword rankings
3. Identify content gaps
4. Optimize low-performing pages
5. Submit new blog posts immediately after publishing

---

**SEND ME YOUR VERIFICATION TAG (if using HTML tag method) AND I'LL ADD IT TO YOUR SITE!**

Otherwise, use Google Analytics verification - it's instant!
