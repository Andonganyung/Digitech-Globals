import re

with open(r'C:\Users\Andong\Digitech-Globals\academy\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("File length:", len(content))

# Find all price-current occurrences
matches = list(re.finditer(r'price-current', content))
print("price-current occurrences:", len(matches))

for m in matches:
    chunk = content[m.start():m.start()+40]
    print("  Found at", m.start(), ":", repr(chunk))

# Find all price-original occurrences
matches2 = list(re.finditer(r'price-original', content))
print("price-original occurrences:", len(matches2))

for m in matches2:
    chunk = content[m.start():m.start()+40]
    print("  Found at", m.start(), ":", repr(chunk))
