import re

correct_prices = {
    'it-support-fundamentals': (129, 79),
    'helpdesk-pro': (159, 99),
    'enterprise-desktop-engineer': (449, 199),
    'az-900': (199, 79),
    'az-104': (349, 149),
    'cybersec-essentials': (249, 99),
    'security-plus': (399, 179),
    'ms-900': (149, 79),
    'intune-endpoint': (229, 139),
    'sccm-intune-endpoint': (599, 249),
    'networking-fundamentals': (129, 89),
    'ccna-prep': (499, 199),
    'powershell-it': (179, 119),
    'python-it': (179, 119),
    'ai-for-it-engineers': (399, 199),
    'computer-basics': (79, 29),
    'windows-basics': (79, 49),
    'internet-safety': (69, 39),
    'ms-excel': (99, 59),
    'ms-word': (79, 49),
    'ms-powerpoint': (79, 49),
    'ms-outlook': (79, 49),
    'windows-power': (149, 99),
    'digital-marketing': (179, 119),
    'entrepreneurship': (199, 129),
    'leadership': (179, 119),
    'email-social': (129, 89),
}

filepath = r'C:\Users\Andong\Digitech-Globals\academy\courses.html'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

changes = 0

for course_id, (orig_price, current_price) in correct_prices.items():
    # Find the line with register link for this course
    enroll_line = None
    for i, line in enumerate(lines):
        if 'course=' + course_id + '"' in line or 'course=' + course_id + "'" in line:
            enroll_line = i
            break
    
    if enroll_line is None:
        print(f"WARNING: {course_id} not found in courses.html")
        continue
    
    # Search nearby lines (within 10 lines before) for price-original and price-current
    found_orig = False
    found_current = False
    for j in range(max(0, enroll_line - 10), enroll_line + 1):
        line = lines[j]
        
        if 'price-original' in line and not found_orig:
            new_line = re.sub(r'(\$)\d+', r'\g<1>' + str(orig_price), line)
            if new_line != lines[j]:
                lines[j] = new_line
                found_orig = True
        
        if 'price-current' in line and not found_current:
            new_line = re.sub(r'(\$)\d+', r'\g<1>' + str(current_price), line)
            if new_line != lines[j]:
                lines[j] = new_line
                found_current = True
    
    if found_orig or found_current:
        changes += 1
        print(f"Fixed {course_id}: ${orig_price} / ${current_price}")
    else:
        print(f"No price change needed for {course_id}")

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"\nTotal courses fixed: {changes}")
