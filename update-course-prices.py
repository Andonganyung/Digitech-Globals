#!/usr/bin/env python3
"""
Update course HTML files to match prices from course-pricing.js
"""

import re
import os

# Price mapping from course-pricing.js (self-study prices)
course_prices = {
    'windows-power.html': {'old': 29, 'new': 99, 'original_old': 79, 'original_new': 149},
    'windows-basics.html': {'old': 19, 'new': 49, 'original_old': 49, 'original_new': 79},
    'python-it.html': {'old': 99, 'new': 119, 'original_old': 249, 'original_new': 179},
    'powershell-it.html': {'old': 69, 'new': 119, 'original_old': 179, 'original_new': 179},
    'networking-fundamentals.html': {'old': 59, 'new': 89, 'original_old': 149, 'original_new': 129},
    'ms-word.html': {'old': 29, 'new': 49, 'original_old': 79, 'original_new': 79},
    'ms-powerpoint.html': {'old': 25, 'new': 49, 'original_old': 69, 'original_new': 79},
    'ms-outlook.html': {'old': 22, 'new': 49, 'original_old': 59, 'original_new': 79},
    'ms-excel.html': {'old': 49, 'new': 59, 'original_old': 99, 'original_new': 99},
    'ms-900.html': {'old': 59, 'new': 79, 'original_old': 129, 'original_new': 149},
    'leadership.html': {'old': 29, 'new': 119, 'original_old': 79, 'original_new': 179},
    'it-support-fundamentals.html': {'old': 49, 'new': 79, 'original_old': 149, 'original_new': 129},
    'intune-endpoint.html': {'old': 89, 'new': 139, 'original_old': 229, 'original_new': 229},
    'internet-safety.html': {'old': 29, 'new': 39, 'original_old': 79, 'original_new': 69},
    'helpdesk-pro.html': {'old': 69, 'new': 99, 'original_old': 159, 'original_new': 159},
    'entrepreneurship.html': {'old': 29, 'new': 129, 'original_old': 79, 'original_new': 199},
    'email-social.html': {'old': 29, 'new': 89, 'original_old': 79, 'original_new': 129},
    'digital-marketing.html': {'old': 29, 'new': 119, 'original_old': 79, 'original_new': 179},
}

academy_dir = r'C:\Users\Andong\Digitech-Globals\academy'

updated_files = []
errors = []

for filename, prices in course_prices.items():
    filepath = os.path.join(academy_dir, filename)
    
    if not os.path.exists(filepath):
        errors.append(f"{filename}: File not found")
        continue
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Update price-original
        content = content.replace(
            f'<div class="price-original">${prices["original_old"]}</div>',
            f'<div class="price-original">${prices["original_new"]}</div>'
        )
        
        # Update price-current
        content = content.replace(
            f'<div class="price-current">${prices["old"]}</div>',
            f'<div class="price-current">${prices["new"]}</div>'
        )
        
        # Calculate new savings
        savings = prices["original_new"] - prices["new"]
        percent = round((savings / prices["original_new"]) * 100)
        
        # Update price-save (find and replace the line)
        save_pattern = r'<div class="price-save">Save \$\d+ \(\d+% off\)</div>'
        save_replacement = f'<div class="price-save">Save ${savings} ({percent}% off)</div>'
        content = re.sub(save_pattern, save_replacement, content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            updated_files.append(f"{filename}: ${prices['old']} → ${prices['new']}")
        else:
            errors.append(f"{filename}: No changes made (pattern not found)")
            
    except Exception as e:
        errors.append(f"{filename}: Error - {str(e)}")

print("=" * 60)
print("COURSE PRICE UPDATE REPORT")
print("=" * 60)
print(f"\nTotal courses to update: {len(course_prices)}")
print(f"Successfully updated: {len(updated_files)}")
print(f"Errors: {len(errors)}")

if updated_files:
    print("\n✅ UPDATED FILES:")
    for item in updated_files:
        print(f"  {item}")

if errors:
    print("\n❌ ERRORS:")
    for error in errors:
        print(f"  {error}")

print("\n" + "=" * 60)
print("Update complete!")
print("=" * 60)
