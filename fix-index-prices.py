with open(r'C:\Users\Andong\Digitech-Globals\academy\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix intune-endpoint price: $89 -> $139
# The third price-current is the intune one at position ~19690
old = 'price-current">$89</span>'
new = 'price-current">$139</span>'

# Only replace the one near intune-endpoint
idx = content.find('intune-endpoint')
if idx > 0:
    # Find the price-current before it (searching backwards from intune link)
    price_idx = content.rfind(old, 0, idx)
    if price_idx > 0:
        content = content[:price_idx] + new + content[price_idx+len(old):]
        print("Fixed intune-endpoint price from $89 to $139")
    else:
        print("Could not find $89 price near intune-endpoint")
else:
    print("intune-endpoint not found")

with open(r'C:\Users\Andong\Digitech-Globals\academy\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
