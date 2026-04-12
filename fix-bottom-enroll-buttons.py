#!/usr/bin/env python3
"""Fix the bottom Enroll Now buttons that are missing ?course= parameter"""

import os
import re

academy_dir = r'C:\Users\Andong\Digitech-Globals\academy'

COURSES = [
    'ai-for-it-engineers', 'az-104', 'az-900', 'ccna-prep', 'computer-basics',
    'cybersec-essentials', 'digital-marketing', 'email-social',
    'enterprise-desktop-engineer', 'entrepreneurship', 'helpdesk-pro',
    'internet-safety', 'intune-endpoint', 'it-support-fundamentals',
    'leadership', 'ms-900', 'ms-excel', 'ms-outlook', 'ms-powerpoint',
    'ms-word', 'networking-fundamentals', 'powershell-it', 'python-it',
    'sccm-intune-endpoint', 'security-plus', 'windows-basics', 'windows-power'
]

updated = 0

for course_id in COURSES:
    filepath = os.path.join(academy_dir, f'{course_id}.html')
    
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Fix ALL occurrences of register.html without parameters
    # Use regex to replace href="register.html" with href="register.html?course=COURSE_ID"
    # But only if it doesn't already have ?course=
    content = re.sub(
        r'href="register\.html"',
        f'href="register.html?course={course_id}"',
        content
    )
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        # Count how many were fixed
        count = original.count('href="register.html"')
        updated += 1
        print(f'Fixed {course_id}: {count} button(s)')

print(f'\nTotal: Updated {updated} course pages')
print('All Enroll Now buttons now include ?course= parameter')
