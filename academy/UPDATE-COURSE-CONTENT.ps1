# PowerShell Script to Update Course Content with Correct Information
# This replaces generic Windows 11 content with course-specific content

Write-Host "Updating course content..." -ForegroundColor Cyan

# Define course-specific content
$courseContent = @{
    "windows-power.html" = @{
        intro = "Master advanced Windows features and productivity techniques. This course transforms you from basic user to power user with shortcuts, hidden features, and efficiency hacks."
        skills = @(
            @{title="Advanced Keyboard Shortcuts"; desc="Master Windows key combinations, Alt+Tab tricks, and custom hotkeys for lightning-fast navigation and multitasking."},
            @{title="PowerToys & Utilities"; desc="Install and configure Microsoft PowerToys - FancyZones, PowerRename, Quick Launcher, and color picker for enhanced productivity."},
            @{title="Command Line Mastery"; desc="Use Command Prompt and PowerShell for advanced tasks, batch automation, and system administration commands."},
            @{title="Registry Tweaks & Customization"; desc="Safely edit Windows Registry to unlock hidden features, customize behavior, and optimize system performance."},
            @{title="Task Scheduler & Automation"; desc="Automate repetitive tasks with Task Scheduler, create custom shortcuts, and build efficiency workflows."},
            @{title="Advanced Troubleshooting"; desc="Use Event Viewer, Performance Monitor, Resource Monitor, and system tools to diagnose and fix complex issues."}
        )
        audience = "Experienced Windows users, IT professionals, system administrators, and anyone wanting to maximize Windows productivity and efficiency."
    }
    
    "computer-basics.html" = @{
        intro = "Your first step into the digital world! This course teaches absolute beginners how computers work, from turning it on to basic tasks. No experience needed - we start from zero."
        skills = @(
            @{title="Computer Hardware Basics"; desc="Understand monitor, keyboard, mouse, CPU, RAM, storage. Learn to connect devices and identify computer parts."},
            @{title="Using Mouse & Keyboard"; desc="Master clicking, double-clicking, right-click menus, drag-and-drop, typing basics, and keyboard shortcuts."},
            @{title="Files & Folders Fundamentals"; desc="Create folders, save files, organize documents, understand file types, and navigate folder structures confidently."},
            @{title="Internet Basics"; desc="Open web browsers, use search engines like Google, navigate websites, and understand URLs and bookmarks."},
            @{title="Email Essentials"; desc="Set up email accounts, send and receive emails, attach files, organize inbox, and manage contacts safely."},
            @{title="Basic Software Usage"; desc="Open and close programs, use word processors for basic documents, and understand software installation basics."}
        )
        audience = "Complete beginners, seniors new to technology, students, anyone needing basic digital literacy for work or personal use."
    }
    
    "internet-safety.html" = @{
        intro = "Stay safe online! Learn to protect yourself from scams, phishing attacks, identity theft, and cyber threats. Essential knowledge for anyone using the internet."
        skills = @(
            @{title="Recognizing Scams & Phishing"; desc="Identify fake emails, suspicious links, phishing websites, and common online scams before they steal your information."},
            @{title="Strong Password Management"; desc="Create unbreakable passwords, use password managers, enable two-factor authentication, and protect your accounts."},
            @{title="Safe Browsing Practices"; desc="Verify website security (HTTPS), avoid malicious downloads, use ad blockers, and browse privately when needed."},
            @{title="Social Media Privacy"; desc="Control privacy settings on Facebook, Instagram, Twitter, LinkedIn. Understand what to share and what to keep private."},
            @{title="Protecting Personal Information"; desc="Safeguard social security numbers, credit cards, banking details, and prevent identity theft online."},
            @{title="Malware & Virus Prevention"; desc="Recognize malware, use antivirus software, avoid ransomware, and recover from security incidents safely."}
        )
        audience = "Anyone using internet, seniors concerned about scams, parents protecting families, small business owners, online shoppers."
    }
    
    "email-social.html" = @{
        intro = "Master email and social media for personal and professional communication. Set up accounts, communicate effectively, and stay connected safely online."
        skills = @(
            @{title="Gmail & Email Setup"; desc="Create Gmail account, organize inbox with labels and filters, use search effectively, and manage multiple email accounts."},
            @{title="Professional Email Etiquette"; desc="Write clear subject lines, format professional emails, use CC/BCC correctly, and respond appropriately in business contexts."},
            @{title="Facebook Fundamentals"; desc="Set up profile, add friends, post updates, share photos, join groups, and control privacy settings for family connections."},
            @{title="LinkedIn for Professionals"; desc="Create compelling profile, connect with colleagues, share professional content, and use LinkedIn for job searching and networking."},
            @{title="Twitter & Instagram Basics"; desc="Tweet effectively, use hashtags, follow interests, post Instagram photos, create stories, and engage with communities."},
            @{title="Video Calls & Zoom"; desc="Set up Zoom, Google Meet, or Skype for video calls with family, friends, or remote work meetings."}
        )
        audience = "Beginners to social media, professionals building online presence, job seekers, anyone wanting to stay connected with family and friends."
    }
    
    "entrepreneurship.html" = @{
        intro = "Turn your business idea into reality! This comprehensive course guides you from concept to launch, covering business planning, funding, marketing, and operations."
        skills = @(
            @{title="Business Idea Validation"; desc="Identify market needs, validate your idea with research, analyze competition, and determine if your concept is viable and profitable."},
            @{title="Business Plan Creation"; desc="Write executive summary, market analysis, financial projections, and operational plans that attract investors and guide your startup."},
            @{title="Legal Structure & Registration"; desc="Choose between LLC, sole proprietorship, or corporation. Register business, obtain EIN, and understand legal requirements."},
            @{title="Funding & Financial Management"; desc="Bootstrap vs. investors, create budgets, manage cash flow, understand profit/loss statements, and secure startup capital."},
            @{title="Marketing & Customer Acquisition"; desc="Develop marketing strategy, build brand identity, use social media, and acquire first customers cost-effectively."},
            @{title="Operations & Scaling"; desc="Set up business processes, hire team members, manage growth, and scale operations while maintaining quality and culture."}
        )
        audience = "Aspiring entrepreneurs, side hustlers, small business owners, anyone with business ideas wanting structured guidance from concept to launch."
    }
    
    "leadership.html" = @{
        intro = "Develop essential leadership skills to inspire teams, drive results, and advance your career. Learn proven techniques from team management to strategic thinking."
        skills = @(
            @{title="Leadership Styles & Approaches"; desc="Understand different leadership styles - transformational, servant, situational. Discover your natural style and when to adapt."},
            @{title="Team Building & Motivation"; desc="Build high-performing teams, motivate individuals with different personalities, and create collaborative culture that drives results."},
            @{title="Effective Communication"; desc="Master active listening, deliver clear instructions, provide constructive feedback, and communicate vision that inspires action."},
            @{title="Conflict Resolution"; desc="Handle team conflicts professionally, mediate disputes, address performance issues, and turn disagreements into growth opportunities."},
            @{title="Decision Making & Problem Solving"; desc="Make tough decisions under pressure, analyze problems systematically, involve team input, and take calculated risks confidently."},
            @{title="Delegation & Empowerment"; desc="Delegate tasks effectively, empower team members with autonomy, develop future leaders, and avoid micromanagement pitfalls."}
        )
        audience = "New managers, team leads, supervisors, aspiring leaders, project managers, anyone stepping into leadership roles or wanting to improve management skills."
    }
    
    "digital-marketing.html" = @{
        intro = "Grow your business online with modern digital marketing strategies. Master social media, SEO, paid ads, content marketing, and analytics to attract customers and increase sales."
        skills = @(
            @{title="Social Media Marketing"; desc="Create engaging content for Facebook, Instagram, LinkedIn, Twitter. Build followers, increase engagement, and convert social audiences to customers."},
            @{title="Google SEO & Local Search"; desc="Optimize website for Google search, rank higher with keywords, improve Google Business Profile, and attract local customers searching online."},
            @{title="Facebook & Instagram Ads"; desc="Create targeted ad campaigns, set budgets, design compelling ads, retarget website visitors, and measure ROI on social advertising."},
            @{title="Email Marketing Campaigns"; desc="Build email lists, create newsletters, automate sequences, write compelling subject lines, and drive sales through email marketing."},
            @{title="Content Marketing Strategy"; desc="Blog for traffic, create videos, develop lead magnets, repurpose content across channels, and establish thought leadership."},
            @{title="Analytics & Performance Tracking"; desc="Use Google Analytics, track conversions, understand metrics, A/B test campaigns, and make data-driven marketing decisions."}
        )
        audience = "Small business owners, marketers, entrepreneurs, freelancers, anyone wanting to market products/services online and grow digital presence cost-effectively."
    }
}

Write-Host "Course content definitions loaded." -ForegroundColor Green
Write-Host "Note: Run manual file edits to replace content sections." -ForegroundColor Yellow
Write-Host "Content data is ready for:" -ForegroundColor Cyan
$courseContent.Keys | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
