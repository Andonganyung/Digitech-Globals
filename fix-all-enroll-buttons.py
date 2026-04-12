#!/usr/bin/env python3
"""Fix all Enroll Now buttons to include ?course= parameter"""

import re
import os

academy_dir = r'C:\Users\Andong\Digitech-Globals\academy'

# List of actual course pages (excluding templates and system pages)
COURSE_IDS = [
    'ai-for-it-engineers',
    'az-104',
    'az-900',
    'ccna-prep',
    'computer-basics',
    'cybersec-essentials',
    'digital-marketing',
    'email-social',
    'enterprise-desktop-engineer',
    'entrepreneurship',
    'helpdesk-pro',
    'internet-safety',
    'intune-endpoint',
    'it-support-fundamentals',
    'leadership',
    'ms-900',
    'ms-excel',
    'ms-outlook',
    'ms-powerpoint',
    'ms-word',
    'networking-fundamentals',
    'powershell-it',
    'python-it',
    'sccm-intune-endpoint',
    'security-plus',
    'windows-basics',
    'windows-power',
]

updated_count = 0

for course_id in COURSE_IDS:
    filepath = os.path.join(academy_dir, f'{course_id}.html')
    
    if not os.path.exists(filepath):
        print(f"WARNING: {filepath} not found")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix the enroll button: register.html" -> register.html?course=COURSE_ID"
    # Pattern: href="register.html"
    content = re.sub(
        r'href="register\.html"',
        f'href="register.html?course={course_id}"',
        content
    )
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        updated_count += 1
        print(f"✓ Fixed: {course_id}.html")

print("\n" + "=" * 70)
print(f"COMPLETE: Updated {updated_count} course pages")
print("=" * 70)
print("\nAll 'Enroll Now' buttons now include ?course= parameter")
print("Registration page will now show correct prices for each course!")
