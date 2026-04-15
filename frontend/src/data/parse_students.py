import pdfplumber
import json
import os
import re

pdf_path = r'C:\Users\91790\Desktop\MST\DESKTOP\JPEG\Student List.pdf'
output_path = os.path.join(os.path.dirname(__file__), 'students.json')

def clean_name_overflow(name, batch):
    if not batch:
        return name
    
    # Remove digits (2023, etc) from the batch string
    # Also strip extra whitespace
    overflow = re.sub(r'\d+', '', batch).strip()
    
    if overflow:
        # Merge name parts. Usually the overflow happens mid-word or immediately after,
        # so joining without an extra space is generally more accurate for PDFs.
        return f"{name.strip()}{overflow}".strip()
    
    return name.strip()

students = {}
uid_pattern = re.compile(r'^23[A-Z]{3}\d{5}$')

print(f"Starting extraction from {pdf_path}...")

with pdfplumber.open(pdf_path) as pdf:
    total_pages = len(pdf.pages)
    for i, page in enumerate(pdf.pages):
        table = page.extract_table()
        if not table:
            continue
        
        # Skip header row if it exists on every page or just the first
        # Usually headers are 'S.No.', 'UID', etc.
        for row in table:
            if not row or len(row) < 4:
                continue
            
            uid = (row[1] or "").strip()
            name = (row[2] or "").strip()
            batch = (row[3] or "").strip()
            
            if uid_pattern.match(uid):
                full_name = clean_name_overflow(name, batch)
                # Keep the first name found if duplicate UIDs (standard)
                if uid not in students:
                    students[uid] = full_name
        
        if (i + 1) % 10 == 0 or i + 1 == total_pages:
            print(f"Processed {i + 1}/{total_pages} pages...")

print(f"\nExtraction complete. Total unique students found: {len(students)}")

# Verification samples
samples = ["23BCS10005", "23BCS10091", "23BCS10092", "23BET10003"]
print("\nVerification Samples:")
for sid in samples:
    print(f"  {sid}: {students.get(sid, 'NOT FOUND')}")

with open(output_path, 'w') as f:
    json.dump(students, f, indent=2)

print(f"\nFinal dataset saved to {output_path}")
