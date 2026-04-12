#!/usr/bin/env python3
import os

academy_dir = r'C:\Users\Andong\Digitech-Globals\academy'

# Fix enterprise-desktop-engineer
file1 = os.path.join(academy_dir, 'enterprise-desktop-engineer.html')
with open(file1, 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('href="register.html"', 'href="register.html?course=enterprise-desktop-engineer"')
with open(file1, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed enterprise-desktop-engineer.html')

# Fix sccm-intune-endpoint
file2 = os.path.join(academy_dir, 'sccm-intune-endpoint.html')
with open(file2, 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('href="register.html"', 'href="register.html?course=sccm-intune-endpoint"')
with open(file2, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed sccm-intune-endpoint.html')
