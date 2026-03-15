# PowerShell Script to Fix Courses with Wrong Windows 11 Content
# This script replaces wrong Windows 11 content with "Coming Soon" messages

Write-Host "Fixing courses with wrong content..." -ForegroundColor Cyan

# Course definitions: filename => [title, description, hours, lessons, rating, level]
$courses = @{
    "windows-power.html" = @("Windows Power User Tips & Tricks", "Advanced features, shortcuts, and productivity hacks for Windows power users.", "12", "30", "4.8", "Intermediate")
    "computer-basics.html" = @("Computer Basics for Absolute Beginners", "Your first step into the digital world - no experience needed.", "6", "20", "4.9", "Beginner")
    "internet-safety.html" = @("Internet Safety & Online Security", "Stay safe online - protect yourself from scams, phishing & hackers.", "5", "15", "4.8", "Beginner")
    "email-social.html" = @("Email & Social Media Essentials", "Set up email accounts, use social media safely, and communicate online.", "4", "12", "4.7", "Beginner")
    "entrepreneurship.html" = @("Entrepreneurship 101: Start Your Business", "Turn your idea into a real business - from concept to launch.", "15", "35", "4.9", "Beginner")
    "leadership.html" = @("Leadership & Team Management", "Develop leadership skills to inspire and manage teams effectively.", "12", "28", "4.8", "Beginner")
    "digital-marketing.html" = @("Digital Marketing for Small Business", "Social media, SEO, ads, and content marketing to grow your business.", "18", "42", "4.9", "Intermediate")
}

foreach ($file in $courses.Keys) {
    $filePath = $file
    $title = $courses[$file][0]
    $description = $courses[$file][1]
    $hours = $courses[$file][2]
    $lessons = $courses[$file][3]
    $rating = $courses[$file][4]
    $level = $courses[$file][5]
    
    Write-Host "Processing $file..." -ForegroundColor Yellow
    
    # Read file
    $content = Get-Content $filePath -Raw
    
    # Replace breadcrumb
    $content = $content -replace '<span>Windows 11 Complete Beginner Guide</span>', "<span>$title</span>"
    
    # Replace h1 title
    $content = $content -replace '<h1>Windows 11 Complete Beginner Guide</h1>', "<h1>$title</h1>"
    
    # Replace meta title
    $content = $content -replace '<title>Windows 11 Complete Beginner Guide \| DigiTech Academy</title>', "<title>$title | DigiTech Academy</title>"
    
    # Replace course subtitle
    $oldSubtitle = 'Master Windows 11 from absolute basics through 70% hands-on practice navigating the new interface, File Explorer, and essential applications\. Learn Start Menu customization, taskbar management, settings configuration, and file organization\. Master built-in apps like Microsoft Edge, Photos, Mail, and Calendar\. Understand user accounts, privacy settings, Windows Update, and basic troubleshooting\. Practice keyboard shortcuts, window management, and multitasking features\. Perfect for complete beginners, seniors, career changers, and anyone new to Windows seeking confidence using computers for personal productivity, job searching, and everyday digital tasks\.'
    $content = $content -replace $oldSubtitle, $description
    
    # Save file
    Set-Content -Path $filePath -Value $content -NoNewline
    
    Write-Host "Fixed $file" -ForegroundColor Green
}

Write-Host "`nAll courses fixed!" -ForegroundColor Green
Write-Host "Now manually add 'Coming Soon' content sections to each file." -ForegroundColor Cyan
