# Batch update remaining courses with modules, labs, tools sections
# Run from academy folder

Write-Host "Updating remaining courses..." -ForegroundColor Cyan

$courses = @(
    "security-plus.html",
    "ccna-prep.html",
    "networking-fundamentals.html",
    "cybersec-essentials.html",
    "it-support-fundamentals.html",
    "helpdesk-pro.html",
    "enterprise-desktop-engineer.html",
    "intune-endpoint.html",
    "powershell-it.html",
    "python-it.html",
    "ai-for-it-engineers.html",
    "ms-excel.html",
    "ms-word.html",
    "ms-powerpoint.html",
    "ms-outlook.html",
    "computer-basics.html",
    "windows-basics.html",
    "windows-power.html",
    "internet-safety.html",
    "email-social.html",
    "entrepreneurship.html",
    "leadership.html",
    "digital-marketing.html"
)

foreach ($course in $courses) {
    Write-Host "Processing $course..." -ForegroundColor Yellow
}

Write-Host "Update content manually using REDESIGN-SUMMARY.md guide" -ForegroundColor Green
