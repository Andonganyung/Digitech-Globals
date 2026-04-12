#!/usr/bin/env python3
"""Fix all Enroll Now buttons - Version 2"""

import os

academy_dir = r'C:\Users\Andong\Digitech-Globals\academy'

# Course IDs
COURSES = [
    'ai-for-it-engineers', 'az-104', 'az-900', 'ccna-prep', 'computer-basics',
    'cybersec-essentials', 'digital-marketing', 'email-social',
    'enterprise-desktop-engineer', 'entrepreneurship', 'helpdesk-pro',
    'internet-safety', 'intune-endpoint', 'leadership', 'ms-900', 'ms-excel',
    'ms-outlook', 'ms-powerpoint', 'ms-word', 'networking-fundamentals',
    'powershell-it', 'python-it', 'sccm-intune-endpoint', 'security-plus',
    'windows-basics', 'windows-power'
]

updated = 0

for course_id in COURSES:
    filepath = os.path.join(academy_dir, f'{course_id}.html')
    
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find and replace the specific pattern
    old_pattern = 'href="register.html" class="btn btn-primary btn-block btn-lg"><i class="fas fa-rocket"></i> Enroll Now</a>'
    new_pattern = f'href="register.html?course={course_id}" class="btn btn-primary btn-block btn-lg"><i class="fas fa-rocket"></i> Enroll Now</a>'
    
    if old_pattern in content:
        content = content.replace(old_pattern, new_pattern)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        updated += 1
        print(f"Fixed {course_id}")

print(f"\nTotal updated: {updated} courses")
