import re
import os

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

base = r'C:\Users\Andong\Digitech-Globals'
files_to_check = []

# Collect all HTML files
for root, dirs, files in os.walk(os.path.join(base, 'academy')):
    for f in files:
        if f.endswith('.html'):
            files_to_check.append(os.path.join(root, f))

# Also check root pricing.html and index.html
for f in ['pricing.html', 'index.html']:
    fp = os.path.join(base, f)
    if os.path.exists(fp):
        files_to_check.append(fp)

mismatches = []

for filepath in files_to_check:
    fname = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check course detail pages (filename matches course id)
    course_id = fname.replace('.html', '')
    if course_id in correct_prices:
        # Find price-current on this page
        for m in re.finditer(r'price-current["\s>]+\$(\d+)', content):
            page_price = int(m.group(1))
            if page_price != correct_prices[course_id]:
                mismatches.append({
                    'file': filepath,
                    'course': course_id,
                    'shown': page_price,
                    'correct': correct_prices[course_id],
                    'context': 'course detail page'
                })
    
    # Check catalog pages (courses.html, index.html) - match by register/enroll link
    for cid, price in correct_prices.items():
        # Find enroll links with course parameter
        pattern = rf'course={re.escape(cid)}["\s]'
        if re.search(pattern, content):
            # Find nearest price-current before or after
            for link_m in re.finditer(pattern, content):
                # Search backwards for price
                search_start = max(0, link_m.start() - 500)
                search_end = min(len(content), link_m.end() + 500)
                chunk = content[search_start:search_end]
                price_matches = list(re.finditer(r'price-current["\s>]+\$(\d+)', chunk))
                for pm in price_matches:
                    page_price = int(pm.group(1))
                    if page_price != price and fname not in [cid + '.html']:
                        mismatches.append({
                            'file': filepath,
                            'course': cid,
                            'shown': page_price,
                            'correct': price,
                            'context': 'catalog/listing'
                        })

if mismatches:
    print("PRICE MISMATCHES FOUND:")
    seen = set()
    for m in mismatches:
        key = (m['file'], m['course'], m['shown'])
        if key not in seen:
            seen.add(key)
            print(f"  {os.path.relpath(m['file'], base)} - {m['course']}: shows ${m['shown']}, should be ${m['correct']} ({m['context']})")
    print(f"\nTotal mismatches: {len(seen)}")
else:
    print("ALL PRICES MATCH! No mismatches found.")
