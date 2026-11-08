# export_markdown.py - Exports clean Markdown version of the report
import xml.etree.ElementTree as ET

def export_md():
    with open(r'd:\SmartIQ\docx_unpack\word\document.xml', 'r', encoding='utf-8') as f:
        xml_str = f.read()

    tree = ET.fromstring(xml_str)
    body = tree.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}body')

    lines = []
    for elem in body:
        tag = elem.tag.split('}')[-1]
        if tag == 'p':
            p_style = ''
            pPr = elem.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}pPr')
            if pPr is not None:
                s_elem = pPr.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}pStyle')
                if s_elem is not None:
                    p_style = s_elem.attrib.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val', '')
            
            text = ''.join(elem.itertext()).strip()
            if not text:
                has_page_break = any(
                    br.attrib.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}type') == 'page'
                    for br in elem.findall('.//{http://schemas.openxmlformats.org/wordprocessingml/2006/main}br')
                )
                if has_page_break:
                    lines.append('\n---\n')
                continue
                
            if p_style == 'Heading1':
                lines.append(f'\n# {text}\n')
            elif p_style == 'Heading2':
                lines.append(f'\n## {text}\n')
            elif p_style == 'Heading3':
                lines.append(f'\n### {text}\n')
            elif p_style == 'ListParagraph':
                lines.append(f'- {text}')
            elif 'Courier New' in ET.tostring(elem, encoding='unicode'):
                lines.append(f'```\n{text}\n```')
            else:
                lines.append(f'{text}\n')
                
        elif tag == 'tbl':
            rows = elem.findall('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}tr')
            table_lines = []
            for r_idx, r in enumerate(rows):
                cells = r.findall('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}tc')
                cell_texts = [' '.join(''.join(c.itertext()).split()) for c in cells]
                table_lines.append('| ' + ' | '.join(cell_texts) + ' |')
                if r_idx == 0:
                    table_lines.append('| ' + ' | '.join(['---'] * len(cells)) + ' |')
            lines.append('\n' + '\n'.join(table_lines) + '\n')

    md_content = '\n'.join(lines)
    with open(r'd:\SmartIQ\ENIGMA_PROJECT_REPORT.md', 'w', encoding='utf-8') as mf:
        mf.write(md_content)

    print(f'Created d:\\SmartIQ\\ENIGMA_PROJECT_REPORT.md ({len(md_content)} characters, {len(md_content.split())} words).')

if __name__ == '__main__':
    export_md()
