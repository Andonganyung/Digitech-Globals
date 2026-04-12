#!/usr/bin/env python3
"""Find course pages missing ?course= parameter in their enroll buttons"""

import re
import os
import glob

academy_dir = r'C:\Users\Andong\Digitech-Globals\academy'
os.chdir(academy_dir)

# Get all course HTML files
all_files = glob.glob('*.html')

# Filter to only course detail pages
exclude = ['index.html', 'courses.html', 'register.html', 'payment.html', 
           'dashboard.html', 'plans.html', 'login.html', 'certificates.html',
           'checkout.html', 'payment-success.html', 'verify-certificate.html',
           'coming-soon.html', 'course-detail.html']

course_files = [f for f in all_files if f not in exclude and not f.startswith('admin') and not f.startswith('candidate')]

print("=" * 70)
print("CHECKING ENROLL BUTTONS FOR COURSE PARAMETER")
print("=" * 70)

missing_courses = []
correct_courses = []

for filename in sorted(course_files):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if file has an enroll button
    if 'register.html' in content:
        # Check if it has ?course= parameter
        if re.search(r'register\.html\?course=', content):
            correct_courses.append(filename.replace('.html', ''))
        else:
            missing_courses.append(filename.replace('.html', ''))

print(f"\nTotal course pages: {len(course_files)}")
print(f"With correct ?course= parameter: {len(correct_courses)}")
print(f"MISSING ?course= parameter: {len(missing_courses)}")

if missing_courses:
    print("\nCOURSES MISSING ?course= PARAMETER:")
    print("-" * 70)
    for course in missing_courses:
        print(f"  - {course}")
        print(f"    Fix: Change 'register.html' to 'register.html?course={course}'")

print("=" * 70)
