#!/usr/bin/env python3
"""Check all course prices to find mismatches"""

import re
import os

# Expected prices from course-pricing.js
EXPECTED_PRICES = {
    'enterprise-desktop-engineer': 199,
    'sccm-intune-endpoint': 249,
    'az-104': 149,
    'security-plus': 179,
    'ccna-prep': 199,
    'ai-for-it-engineers': 199,
    'intune-endpoint': 139,
    'python-it': 119,
    'powershell-it': 119,
    'az-900': 79,
    'ms-900': 79,
    'cybersec-essentials': 99,
    'networking-fundamentals': 89,
    'computer-basics': 29,
    'windows-basics': 49,
    'it-support-fundamentals': 79,
    'helpdesk-pro': 99,
    'internet-safety': 39,
    'ms-excel': 59,
    'ms-word': 49,
    'ms-powerpoint': 49,
    'ms-outlook': 49,
    'windows-power': 99,
    'digital-marketing': 119,
    'entrepreneurship': 129,
    'leadership': 119,
    'email-social': 89,
}

academy_dir = r'C:\Users\Andong\Digitech-Globals\academy'

print("=" * 70)
print("COURSE PRICE VERIFICATION REPORT")
print("=" * 70)

matches = []
mismatches = []

for course_id, expected_price in sorted(EXPECTED_PRICES.items()):
    filepath = os.path.join(academy_dir, f'{course_id}.html')
    
    if not os.path.exists(filepath):
        print(f"WARNING: {course_id}.html not found")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find price-current
    match = re.search(r'<div class="price-current">\$(\d+)</div>', content)
    
    if match:
        actual_price = int(match.group(1))
        
        if actual_price == expected_price:
            matches.append((course_id, actual_price))
        else:
            mismatches.append((course_id, actual_price, expected_price))
    else:
        print(f"WARNING: No price found in {course_id}.html")

print(f"\nTotal courses checked: {len(EXPECTED_PRICES)}")
print(f"Matching: {len(matches)}")
print(f"Mismatches: {len(mismatches)}")

if mismatches:
    print("\nMISMATCHES FOUND:")
    print("-" * 70)
    for course_id, actual, expected in mismatches:
        print(f"{course_id:35} Website: ${actual:3}  Expected: ${expected:3}")

if matches:
    print("\nCORRECT PRICES:")
    print("-" * 70)
    for course_id, price in matches[:5]:  # Show first 5
        print(f"{course_id:35} ${price}")
    if len(matches) > 5:
        print(f"... and {len(matches) - 5} more")

print("=" * 70)
