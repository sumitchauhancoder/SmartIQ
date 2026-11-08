# xml_helpers.py - OpenXML generation helpers for ENIGMA Report
import html

W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

def escape_xml(s):
    if s is None:
        return ''
    return html.escape(str(s), quote=True)

def p(text, style=None, bold=False, italic=False, align=None, space_after=120, space_before=60, font_size=24, font_family='Times New Roman'):
    escaped = escape_xml(text)
    p_pr = []
    if style:
        p_pr.append(f'<w:pStyle w:val="{style}"/>')
    
    p_bdr = ''
    tabs = ''
    jc = f'<w:jc w:val="{align}"/>' if align else '<w:jc w:val="both"/>'
    spacing = f'<w:spacing w:before="{space_before}" w:after="{space_after}" w:line="360" w:lineRule="auto"/>'
    p_pr.extend([jc, spacing])
    
    # Run formatting
    r_pr = [
        f'<w:rFonts w:ascii="{font_family}" w:hAnsi="{font_family}" w:cs="{font_family}"/>',
        f'<w:sz w:val="{font_size}"/>',
        f'<w:szCs w:val="{font_size}"/>'
    ]
    if bold:
        r_pr.append('<w:b/><w:bCs/>')
    if italic:
        r_pr.append('<w:i/><w:iCs/>')
        
    p_pr_xml = f'<w:pPr>{"".join(p_pr)}</w:pPr>' if p_pr else ''
    r_pr_xml = f'<w:rPr>{"".join(r_pr)}</w:rPr>'
    
    return f'<w:p>{p_pr_xml}<w:r>{r_pr_xml}<w:t xml:space="preserve">{escaped}</w:t></w:r></w:p>'

def heading1(text):
    # Heading 1: 16pt (sz 32), Bold, Times New Roman, Space Before 280, After 140
    return f'''<w:p>
        <w:pPr>
            <w:pStyle w:val="Heading1"/>
            <w:spacing w:before="280" w:after="140"/>
            <w:jc w:val="left"/>
            <w:rPr>
                <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
                <w:b/><w:bCs/>
                <w:sz w:val="32"/><w:szCs w:val="32"/>
            </w:rPr>
        </w:pPr>
        <w:r>
            <w:rPr>
                <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
                <w:b/><w:bCs/>
                <w:sz w:val="32"/><w:szCs w:val="32"/>
            </w:rPr>
            <w:t>{escape_xml(text)}</w:t>
        </w:r>
    </w:p>'''

def heading2(text):
    # Heading 2: 13pt (sz 26), Bold, Times New Roman, Space Before 220, After 100
    return f'''<w:p>
        <w:pPr>
            <w:pStyle w:val="Heading2"/>
            <w:spacing w:before="220" w:after="100"/>
            <w:jc w:val="left"/>
            <w:rPr>
                <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
                <w:b/><w:bCs/>
                <w:sz w:val="26"/><w:szCs w:val="26"/>
            </w:rPr>
        </w:pPr>
        <w:r>
            <w:rPr>
                <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
                <w:b/><w:bCs/>
                <w:sz w:val="26"/><w:szCs w:val="26"/>
            </w:rPr>
            <w:t>{escape_xml(text)}</w:t>
        </w:r>
    </w:p>'''

def heading3(text):
    # Heading 3: 12pt (sz 24), Bold, Times New Roman, Space Before 160, After 80
    return f'''<w:p>
        <w:pPr>
            <w:pStyle w:val="Heading3"/>
            <w:spacing w:before="160" w:after="80"/>
            <w:jc w:val="left"/>
            <w:rPr>
                <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
                <w:b/><w:bCs/>
                <w:sz w:val="24"/><w:szCs w:val="24"/>
            </w:rPr>
        </w:pPr>
        <w:r>
            <w:rPr>
                <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
                <w:b/><w:bCs/>
                <w:sz w:val="24"/><w:szCs w:val="24"/>
            </w:rPr>
            <w:t>{escape_xml(text)}</w:t>
        </w:r>
    </w:p>'''

def heading4(text):
    # Heading 4: 12pt (sz 24), Bold Italic
    return f'''<w:p>
        <w:pPr>
            <w:spacing w:before="120" w:after="60"/>
            <w:jc w:val="left"/>
            <w:rPr>
                <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
                <w:b/><w:bCs/><w:i/><w:iCs/>
                <w:sz w:val="24"/><w:szCs w:val="24"/>
            </w:rPr>
        </w:pPr>
        <w:r>
            <w:rPr>
                <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
                <w:b/><w:bCs/><w:i/><w:iCs/>
                <w:sz w:val="24"/><w:szCs w:val="24"/>
            </w:rPr>
            <w:t>{escape_xml(text)}</w:t>
        </w:r>
    </w:p>'''

def bullet_item(text):
    return f'''<w:p>
        <w:pPr>
            <w:pStyle w:val="ListParagraph"/>
            <w:spacing w:before="40" w:after="60" w:line="320" w:lineRule="auto"/>
            <w:ind w:left="720" w:hanging="360"/>
            <w:jc w:val="both"/>
            <w:rPr>
                <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
                <w:sz w:val="24"/><w:szCs w:val="24"/>
            </w:rPr>
        </w:pPr>
        <w:r>
            <w:rPr>
                <w:rFonts w:ascii="Symbol" w:hAnsi="Symbol"/>
                <w:sz w:val="24"/>
            </w:rPr>
            <w:t>&#183;  </w:t>
        </w:r>
        <w:r>
            <w:rPr>
                <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
                <w:sz w:val="24"/><w:szCs w:val="24"/>
            </w:rPr>
            <w:t>{escape_xml(text)}</w:t>
        </w:r>
    </w:p>'''

def code_block(code_text):
    lines = code_text.strip().split('\n')
    xml_lines = []
    for line in lines:
        escaped = escape_xml(line)
        xml_lines.append(f'''<w:p>
            <w:pPr>
                <w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/>
                <w:ind w:left="400"/>
                <w:jc w:val="left"/>
                <w:rPr>
                    <w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/>
                    <w:sz w:val="18"/><w:szCs w:val="18"/>
                </w:rPr>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/>
                    <w:sz w:val="18"/><w:szCs w:val="18"/>
                </w:rPr>
                <w:t xml:space="preserve">{escaped}</w:t>
            </w:r>
        </w:p>''')
    return '\n'.join(xml_lines)

def page_break():
    return '''<w:p>
        <w:r>
            <w:br w:type="page"/>
        </w:r>
    </w:p>'''

def table(headers, rows, col_widths=None):
    # Total width ~ 8600 dxa (standard margins)
    num_cols = len(headers)
    if not col_widths:
        w_per_col = int(8600 / num_cols)
        col_widths = [w_per_col] * num_cols
    else:
        # scale to ~ 8600
        tot = sum(col_widths)
        col_widths = [int(w * 8600 / tot) for w in col_widths]

    grid_xml = ''.join([f'<w:gridCol w:w="{w}"/>' for w in col_widths])

    # Header Row
    tr_header_cells = []
    for idx, h in enumerate(headers):
        w = col_widths[idx]
        tr_header_cells.append(f'''<w:tc>
            <w:tcPr>
                <w:tcW w:w="{w}" w:type="dxa"/>
                <w:shd w:val="clear" w:color="auto" w:fill="EBF0F5"/>
                <w:tcMar><w:top w:w="120" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/><w:left w:w="140" w:type="dxa"/><w:right w:w="140" w:type="dxa"/></w:tcMar>
            </w:tcPr>
            <w:p>
                <w:pPr>
                    <w:spacing w:before="60" w:after="60"/>
                    <w:jc w:val="left"/>
                    <w:rPr>
                        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
                        <w:b/><w:bCs/>
                        <w:sz w:val="22"/><w:szCs w:val="22"/>
                    </w:rPr>
                </w:pPr>
                <w:r>
                    <w:rPr>
                        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
                        <w:b/><w:bCs/>
                        <w:sz w:val="22"/><w:szCs w:val="22"/>
                    </w:rPr>
                    <w:t>{escape_xml(h)}</w:t>
                </w:r>
            </w:p>
        </w:tc>''')

    tr_header_xml = f'''<w:tr>
        <w:trPr><w:tblHeader/></w:trPr>
        {''.join(tr_header_cells)}
    </w:tr>'''

    # Data Rows
    row_xmls = []
    for r_idx, row in enumerate(rows):
        tc_cells = []
        # alternate row background subtle zebra striping
        shd_fill = "F9FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, cell in enumerate(row):
            w = col_widths[c_idx] if c_idx < len(col_widths) else 1000
            tc_cells.append(f'''<w:tc>
                <w:tcPr>
                    <w:tcW w:w="{w}" w:type="dxa"/>
                    <w:shd w:val="clear" w:color="auto" w:fill="{shd_fill}"/>
                    <w:tcMar><w:top w:w="100" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:left w:w="140" w:type="dxa"/><w:right w:w="140" w:type="dxa"/></w:tcMar>
                </w:tcPr>
                <w:p>
                    <w:pPr>
                        <w:spacing w:before="40" w:after="40" w:line="280" w:lineRule="auto"/>
                        <w:jc w:val="left"/>
                        <w:rPr>
                            <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
                            <w:sz w:val="20"/><w:szCs w:val="20"/>
                        </w:rPr>
                    </w:pPr>
                    <w:r>
                        <w:rPr>
                            <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
                            <w:sz w:val="20"/><w:szCs w:val="20"/>
                        </w:rPr>
                        <w:t>{escape_xml(cell)}</w:t>
                    </w:r>
                </w:p>
            </w:tc>''')
        row_xmls.append(f'<w:tr>{"".join(tc_cells)}</w:tr>')

    tbl_xml = f'''<w:tbl>
        <w:tblPr>
            <w:tblW w:w="8600" w:type="dxa"/>
            <w:tblBorders>
                <w:top w:val="single" w:sz="6" w:space="0" w:color="B0C4DE"/>
                <w:left w:val="single" w:sz="6" w:space="0" w:color="B0C4DE"/>
                <w:bottom w:val="single" w:sz="6" w:space="0" w:color="B0C4DE"/>
                <w:right w:val="single" w:sz="6" w:space="0" w:color="B0C4DE"/>
                <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E0E6ED"/>
                <w:insideV w:val="single" w:sz="4" w:space="0" w:color="E0E6ED"/>
            </w:tblBorders>
            <w:tblCellMar>
                <w:top w:w="100" w:type="dxa"/>
                <w:left w:w="140" w:type="dxa"/>
                <w:bottom w:w="100" w:type="dxa"/>
                <w:right w:w="140" w:type="dxa"/>
            </w:tblCellMar>
            <w:jc w:val="center"/>
        </w:tblPr>
        <w:tblGrid>{grid_xml}</w:tblGrid>
        {tr_header_xml}
        {''.join(row_xmls)}
    </w:tbl>'''

    return tbl_xml
