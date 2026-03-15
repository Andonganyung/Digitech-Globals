# Course Detail Page Template

Use this template to create detailed pages for all Academy courses.

## Steps to Create a New Course Detail Page:

1. **Duplicate** `it-support-fundamentals.html` or `enterprise-desktop-engineer.html`
2. **Rename** to match the course ID (e.g., `az-900.html`, `ccna-prep.html`)
3. **Update** the following sections:

---

## Required Content Sections:

### 1. Head Section
- Update `<title>` with course name
- Update `<meta name="description">` with course summary

### 2. Breadcrumb
- Update course name in breadcrumb

### 3. Header Section
- **Badges**: Choose from `badge-new`, `badge-bestseller`, `badge-popular`
- **Level Badge**: Choose from `Beginner`, `Intermediate`, `Advanced`
- **Course Title** (H1)
- **Course Subtitle** (max 120 words) - Include practical focus, outcomes, and target progression

### 4. Course Stats
- Hours
- Lessons
- Rating
- Enrollment numbers

### 5. Key Skills (6 items)
Each skill must include:
- **Skill Title**
- **Description** (1-2 sentences, hands-on focused)

**Formula**: 70% practical/hands-on + 30% theory

### 6. Target Audience (4 personas)
Format: `<i class="fas fa-[icon]"></i><span>[description]</span>`

Examples:
- Career changers
- Current professionals seeking advancement
- Certification seekers
- Students/graduates

### 7. Career Outcomes (4-5 roles)
Each role includes:
- **Icon** (use fas icons)
- **Job Title**
- **Salary Range** (research current market rates)

### 8. Sidebar Content
- **Price** (original and discounted)
- **CTA Buttons**: "Enroll Now" + "Or Get All-Access Pass"
- **Course Includes** (8 standard items)
- **Prerequisites** (3-4 items)

---

## Course IDs to Create:

### IT Support (3 courses)
- ✅ `it-support-fundamentals.html` (DONE)
- ❌ `helpdesk-pro.html` (TODO)
- ✅ `enterprise-desktop-engineer.html` (DONE)

### Cloud Computing (2 courses)
- ❌ `az-900.html` (TODO)
- ❌ `az-104.html` (TODO)

### Cybersecurity (2 courses)
- ❌ `cybersec-essentials.html` (TODO)
- ❌ `security-plus.html` (TODO)

### Microsoft 365 (2 courses)
- ❌ `ms-900.html` (TODO)
- ❌ `intune-endpoint.html` (TODO)

### Networking (2 courses)
- ❌ `networking-fundamentals.html` (TODO)
- ❌ `ccna-prep.html` (TODO)

### Automation (2 courses)
- ❌ `powershell-it.html` (TODO)
- ❌ `python-it.html` (TODO)

### Microsoft Office (3 courses)
- ❌ `ms-word.html` (TODO)
- ❌ `ms-excel.html` (TODO)
- ❌ `ms-powerpoint.html` (TODO)

---

## After Creating Each Detail Page:

### Update courses.html:
Replace single "Enroll" button with dual buttons:

```html
<div class="course-buttons">
    <a href="../contact.html" class="btn btn-primary btn-sm">Enroll</a>
    <a href="[course-id].html" class="btn btn-outline btn-sm">Learn More</a>
</div>
```

---

## Content Writing Guidelines:

### Description (120 words max)
- Start with outcome/benefit
- Include hands-on percentage (70% labs)
- Mention prerequisites/career path
- End with ideal student profile

### Key Skills
- Be specific and practical
- Focus on tools/technologies
- Include real-world applications
- Use action verbs (Master, Build, Configure, Deploy)

### Target Audience
- 4 specific personas
- Include current role → desired role progression
- Mention certifications where relevant

### Career Outcomes
- Research current salary ranges (Glassdoor, Indeed, PayScale)
- Include 4-5 realistic job titles
- Use region-adjusted salaries (US average)

---

## Quality Checklist:

- [ ] 120-word description
- [ ] 6 practical key skills
- [ ] 4 target audience personas
- [ ] 4-5 career outcomes with salaries
- [ ] Both "Enroll" and "Learn More" buttons
- [ ] Correct course stats (hours, lessons, rating)
- [ ] Appropriate badges (Bestseller, Popular, New)
- [ ] Prerequisites listed
- [ ] All navigation links working

---

## Priority Order:

Create in this order for maximum impact:

1. Azure Fundamentals (AZ-900) - Bestseller
2. Cybersecurity Essentials - Popular  
3. Intune & Endpoint Management - Bestseller
4. Excel Fundamentals - Popular
5. CCNA Preparation - High value
6. CompTIA Security+ - High demand
7. PowerShell for IT - Popular
8. Remaining courses as needed

---

**Template Version**: 1.0  
**Last Updated**: 2026-03-15
