#!/usr/bin/env python3
"""Fix the malformed script tags in register.html"""

filepath = r'C:\Users\Andong\Digitech-Globals\academy\register.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the malformed newline characters
content = content.replace('`r`n', '\n')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed register.html - replaced literal `r`n with actual newlines")
