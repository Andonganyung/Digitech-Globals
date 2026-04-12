import re

with open(r'C:\Users\Andong\Digitech-Globals\academy\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

for m in re.finditer(r'price-current..>(\$\d+)', content):
    start = max(0, m.start()-300)
    chunk = content[start:m.end()+100]
    cid = re.search(r'id=([a-z0-9-]+)', chunk)
    course = cid.group(1) if cid else "unknown"
    print("Price: " + m.group(1) + ", Course: " + course + ", pos: " + str(m.start()))
