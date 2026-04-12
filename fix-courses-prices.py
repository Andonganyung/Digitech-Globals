import re

# Correct prices from course-pricing.js (selfStudy prices)
correct_prices = {
    'it-support-fundamentals': 79,
    'helpdesk-pro': 99,
    'enterprise-desktop-engineer': 199,
    'az-900': 79,
    'az-104': 149,
    'cybersec-essentials': 99,
    'security-plus': 179,
    'ms-900': 79,
    'intune-endpoint': 139,
    'sccm-intune-endpoint': 249,
    'networking-fundamentals': 89,
    'ccna-prep': 199,
    'powershell-it': 119,
    'python-it': 119,
    'ai-for-it-engineers': 199,
    'computer-basics': 29,
    'windows-basics': 49,
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

# Calculate original prices (roughly 2x or reasonable markup)
def calc_original(price):
    if price <= 39:
        return int(price * 2.2 / 10) * 10 - 1  # e.g. 29 -> 69
    elif price <= 99:
        return int(price * 1.8 / 10) * 10 - 1  # e.g. 79 -> 129
    elif price <= 149:
        return int(price * 1.7 / 10) * 10 - 1  # e.g. 119 -> 199
    else:
        return int(price * 1.6 / 10) * 10 - 1  # e.g. 199 -> 319

# Use the original prices from the individual course detail pages instead
original_prices = {
    'it-support-fundamentals': 129,
    'helpdesk-pro': 159,
    'enterprise-desktop-engineer': 449,
    'az-900': 199,
    'az-104': 349,
    'cybersec-essentials': 249,
    'security-plus': 399,
    'ms-900': 149,
    'intune-endpoint': 229,
    'sccm-intune-endpoint': 599,
    'networking-fundamentals': 129,
    'ccna-prep': 499,
    'powershell-it': 179,
    'python-it': 179,
    'ai-for-it-engineers': 399,
    'computer-basics': 79,
    'windows-basics': 79,
    'internet-safety': 69,
    'ms-excel': 99,
    'ms-word': 79,
    'ms-powerpoint': 79,
    'ms-outlook': 79,
    'windows-power': 149,
    'digital-marketing': 179,
    'entrepreneurship': 199,
    'leadership': 179,
    'email-social': 129,
}

# Read courses.html
with open(r'C:\Users\Andong\Digitech-Globals\academy\courses.html', 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

# For each course, find its block and update prices
for course_id, price in correct_prices.items():
    orig = original_prices.get(course_id, calc_original(price))
    
    # Pattern: find the course block by register link, then find price spans nearby
    # We look for the register link and work backwards/forwards to find prices
    pattern = rf'(register\.html\?course={re.escape(course_id)}.*?price-original">\$)\d+(</span>\s*<span class="price-current">\$)\d+'
    
    def replacer(m):
        return f'{m.group(1)}{orig}{m.group(2)}{price}'
    
    new_content = re.sub(pattern, replacer, content, flags=re.DOTALL)
    if new_content != content:
        changes += 1
        print(f'Updated {course_id}: ${orig} -> ${price}')
        content = new_content
    else:
        # Try reverse order - price might come before the register link
        pattern2 = rf'(price-original">\$)\d+(</span>\s*<span class="price-current">\$)\d+(.*?register\.html\?course={re.escape(course_id)})'
        
        def replacer2(m):
            return f'{m.group(1)}{orig}{m.group(2)}{price}{m.group(3)}'
        
        new_content = re.sub(pattern2, replacer2, content, flags=re.DOTALL, count=1)
        if new_content != content:
            changes += 1
            print(f'Updated {course_id}: ${orig} -> ${price}')
            content = new_content
        else:
            print(f'WARNING: Could not find {course_id} in courses.html')

# Write updated file
with open(r'C:\Users\Andong\Digitech-Globals\academy\courses.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\nTotal courses updated: {changes}')
