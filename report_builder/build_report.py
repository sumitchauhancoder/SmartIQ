# build_report.py - Assembles and packages ENIGMA_Project_Report.docx
import os
import sys
import zipfile
import re

sys.path.append(r'd:\SmartIQ\report_builder')
from report_content_front import get_front_matter_xml
from report_content_ch1_ch3 import get_ch1_ch3_xml
from report_content_ch4_ch5 import get_ch4_ch5_xml
from report_content_ch6 import get_ch6_xml
from report_content_ch7_ch11 import get_ch7_ch11_xml

def build_docx():
    unpack_dir = r'd:\SmartIQ\docx_unpack'
    doc_xml_path = os.path.join(unpack_dir, 'word', 'document.xml')
    output_docx_path = r'd:\SmartIQ\ENIGMA_Project_Report.docx'

    # Read original document.xml to extract root opening tag and sectPr
    with open(doc_xml_path, 'r', encoding='utf-8') as f:
        orig_xml = f.read()

    body_idx = orig_xml.find('<w:body>')
    if body_idx == -1:
        raise ValueError("Could not find <w:body> in original document.xml")
    
    root_header = orig_xml[:body_idx + len('<w:body>')]

    sectPr_idx = orig_xml.rfind('<w:sectPr')
    sectPr_end = orig_xml.rfind('</w:sectPr>') + len('</w:sectPr>')
    sectPr_xml = orig_xml[sectPr_idx:sectPr_end]

    print("Gathering XML components...")
    front = get_front_matter_xml()
    ch1_3 = get_ch1_ch3_xml()
    ch4_5 = get_ch4_ch5_xml()
    ch6 = get_ch6_xml()
    ch7_11 = get_ch7_ch11_xml()

    print(f"Front matter: {len(front)} bytes")
    print(f"Chapters 1-3: {len(ch1_3)} bytes")
    print(f"Chapters 4-5: {len(ch4_5)} bytes")
    print(f"Chapter 6:    {len(ch6)} bytes")
    print(f"Chapters 7-11:{len(ch7_11)} bytes")

    full_body_xml = front + ch1_3 + ch4_5 + ch6 + ch7_11 + sectPr_xml
    new_doc_xml = root_header + full_body_xml + '</w:body></w:document>'

    # Write new document.xml
    with open(doc_xml_path, 'w', encoding='utf-8') as f:
        f.write(new_doc_xml)
    print(f"Wrote updated document.xml ({len(new_doc_xml)} bytes).")

    # Create zip docx
    print(f"Packaging {output_docx_path}...")
    with zipfile.ZipFile(output_docx_path, 'w', zipfile.ZIP_DEFLATED) as z_out:
        for root, dirs, files in os.walk(unpack_dir):
            for file in files:
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, unpack_dir)
                z_out.write(abs_path, rel_path)

    stat = os.stat(output_docx_path)
    print(f"Successfully created {output_docx_path} ({stat.st_size} bytes, {stat.st_size / 1024 / 1024:.2f} MB).")

    # Analytics on document
    text = re.sub(r'<[^<]+?>', ' ', full_body_xml)
    words = text.split()
    tables = full_body_xml.count('<w:tbl>')
    page_breaks = full_body_xml.count('w:br')
    print(f"Total Words: {len(words)}")
    print(f"Total Tables: {tables}")
    print(f"Hard Page Breaks: {page_breaks}")
    print(f"Estimated Pages in Word: ~{int(len(words)/220) + tables + page_breaks // 2}")

if __name__ == '__main__':
    build_docx()
