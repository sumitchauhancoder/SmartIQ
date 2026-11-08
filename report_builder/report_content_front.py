# report_content_front.py - Front Matter for ENIGMA Report
from xml_helpers import p, heading1, heading2, heading3, table, page_break
from logos import P_UNIVERSITY_LOGO, P_COLLEGE_LOGO

def get_front_matter_xml():
    xml = []

    # 1. Outer Cover Page (with Logos)
    xml.append(p("ENIGMA: MULTIDIMENSIONAL PSYCHOMETRIC & 4D COGNITIVE SYNTHESIS PLATFORM", bold=True, align="center", font_size=32, space_before=240, space_after=140))
    xml.append(p("A project report submitted in partial fulfillment of the requirements for the award of degree of", align="center", font_size=24, italic=True, space_after=100))
    xml.append(p("BACHELOR OF COMPUTER APPLICATIONS", bold=True, align="center", font_size=28, space_after=80))
    xml.append(p("of", align="center", font_size=24, space_after=80))
    xml.append(p("Dr. Manmohan Singh Bengaluru City University", bold=True, align="center", font_size=26, space_after=100))
    xml.append(P_UNIVERSITY_LOGO)
    
    xml.append(p("By", align="center", font_size=24, space_before=100, space_after=40))
    xml.append(p("SUMIT CHAUHAN", bold=True, align="center", font_size=28, space_after=40))
    xml.append(p("(Reg No: U18GH24S0048)", bold=True, align="center", font_size=24, space_after=120))
    xml.append(p("Under the Guidance of", align="center", font_size=24, space_after=40))
    xml.append(p("Mrs. SUJATHA P V", bold=True, align="center", font_size=26, space_after=40))
    xml.append(p("Assistant Professor", align="center", font_size=22, italic=True, space_after=100))
    xml.append(P_COLLEGE_LOGO)

    # College details
    xml.append(p("DEPARTMENT OF COMPUTER SCIENCE", bold=True, align="center", font_size=26, space_after=60))
    xml.append(p("SESHADRIPURAM COLLEGE", bold=True, align="center", font_size=30, space_after=60))
    xml.append(p("27, Nagappa Street, Seshadripuram, Bengaluru-560 020", align="center", font_size=20, space_after=40))
    xml.append(p("Affiliated to Dr. Manmohan Singh Bengaluru City University", align="center", font_size=20, space_after=40))
    xml.append(p("Recognized Under Section 2(f) and 12(B) of the UGC Act, 1956 | AICTE Approved | NAAC Grade: A++", align="center", font_size=18, italic=True, space_after=100))
    xml.append(p("2026-27", bold=True, align="center", font_size=24, space_after=100))
    xml.append(page_break())

    # 2. Inner Title Page
    xml.append(p("ENIGMA: MULTIDIMENSIONAL PSYCHOMETRIC & 4D COGNITIVE SYNTHESIS PLATFORM", bold=True, align="center", font_size=30, space_before=200, space_after=140))
    xml.append(p("A project report submitted in partial fulfillment of the requirements for the award of degree of", align="center", font_size=24, italic=True, space_after=100))
    xml.append(p("BACHELOR OF COMPUTER APPLICATIONS", bold=True, align="center", font_size=28, space_after=80))
    xml.append(p("of", align="center", font_size=24, space_after=80))
    xml.append(p("Dr. Manmohan Singh Bengaluru City University", bold=True, align="center", font_size=26, space_after=100))
    xml.append(P_UNIVERSITY_LOGO)
    xml.append(p("By", align="center", font_size=24, space_before=100, space_after=40))
    xml.append(p("SUMIT CHAUHAN", bold=True, align="center", font_size=28, space_after=40))
    xml.append(p("(Reg No: U18GH24S0048)", bold=True, align="center", font_size=24, space_after=120))
    xml.append(p("Under the Guidance of", align="center", font_size=24, space_after=40))
    xml.append(p("Mrs. SUJATHA P V", bold=True, align="center", font_size=26, space_after=40))
    xml.append(p("Assistant Professor", align="center", font_size=22, italic=True, space_after=100))
    xml.append(P_COLLEGE_LOGO)
    xml.append(p("DEPARTMENT OF COMPUTER SCIENCE", bold=True, align="center", font_size=26, space_after=60))
    xml.append(p("SESHADRIPURAM COLLEGE, BENGALURU-560 020", bold=True, align="center", font_size=28, space_after=60))
    xml.append(p("2026-27", bold=True, align="center", font_size=24, space_after=100))
    xml.append(page_break())

    # 3. Certificate
    xml.append(P_COLLEGE_LOGO)
    xml.append(p("SESHADRIPURAM COLLEGE", bold=True, align="center", font_size=30, space_before=100, space_after=40))
    xml.append(p("27, Nagappa Street, Seshadripuram, Bengaluru-560 020", align="center", font_size=20, space_after=40))
    xml.append(p("Affiliated to Dr. Manmohan Singh Bengaluru City University", align="center", font_size=20, space_after=40))
    xml.append(p("NAAC Grade: A++ | AICTE Approved", align="center", font_size=18, italic=True, space_after=160))
    xml.append(p("CERTIFICATE", bold=True, align="center", font_size=32, space_before=100, space_after=140))
    
    cert_text = (
        "This is to Certify that SUMIT CHAUHAN bearing Register Number U18GH24S0048 has satisfactorily "
        "completed his 5th semester project work entitled 'ENIGMA: MULTIDIMENSIONAL PSYCHOMETRIC & 4D COGNITIVE "
        "SYNTHESIS PLATFORM' as a partial fulfillment for the award of Bachelor of Computer Applications degree "
        "by Dr. Manmohan Singh Bengaluru City University during the academic year 2026-27 under my supervision. "
        "The project demonstrates high technical competence, empirical rigor in psychometric modeling, "
        "and production-grade full-stack cloud engineering."
    )
    xml.append(p(cert_text, align="both", font_size=24, space_after=240, space_before=100))
    
    # Signature table
    sig_headers = ["Signature of Internal Guide", "Signature of Head of Department"]
    sig_rows = [
        ["\n\n\n_______________________\nMrs. Sujatha P V\nAssistant Professor\nDept. of Computer Science",
         "\n\n\n_______________________\nMrs. Rajeswari V\nHead of the Department\nDept. of Computer Science"]
    ]
    xml.append(table(sig_headers, sig_rows, col_widths=[4300, 4300]))
    xml.append(p("", space_after=180))
    xml.append(p("External Examiner: ___________________________      Internal Examiner: ___________________________", align="center", font_size=22, space_before=160, space_after=100))
    xml.append(page_break())

    # 4. Declaration
    xml.append(p("DECLARATION", bold=True, align="center", font_size=32, space_before=180, space_after=140))
    decl_text = (
        "I, SUMIT CHAUHAN, student of 5th semester BCA, Seshadripuram Degree College, bearing Register Number "
        "U18GH24S0048, hereby declare that the project entitled 'ENIGMA: MULTIDIMENSIONAL PSYCHOMETRIC & 4D COGNITIVE "
        "SYNTHESIS PLATFORM' has been carried out by me under the supervision and guidance of Internal Guide "
        "Mrs. Sujatha P V, Assistant Professor, Department of Computer Science. This project is submitted in partial "
        "fulfillment of the requirements for the award of the Degree of Bachelor of Computer Applications by "
        "Dr. Manmohan Singh Bengaluru City University during the academic year 2026-27.\n\n"
        "I further declare that the matter embodied in this project report has not been submitted previously to this "
        "or any other University/Institute for the award of any degree, diploma, or fellowship."
    )
    xml.append(p(decl_text, align="both", font_size=24, space_after=240, space_before=100))
    xml.append(p("Date: ________________________", align="left", font_size=24, space_after=60))
    xml.append(p("Place: Bengaluru", align="left", font_size=24, space_after=200))
    xml.append(p("SUMIT CHAUHAN", bold=True, align="right", font_size=26, space_after=40))
    xml.append(p("(Reg No: U18GH24S0048)", align="right", font_size=22, space_after=100))
    xml.append(page_break())

    # 5. Acknowledgement
    xml.append(p("ACKNOWLEDGEMENT", bold=True, align="center", font_size=32, space_before=160, space_after=140))
    xml.append(p(
        "I take this opportunity to first express my heartfelt gratitude to the Almighty God for providing me "
        "with the strength, wisdom, and perseverance to successfully execute my project and compile this comprehensive dissertation.",
        align="both", font_size=24, space_after=100
    ))
    xml.append(p(
        "I would like to sincerely thank my beloved parents for their unconditional love, constant encouragement, "
        "and steadfast belief in me throughout this rigorous academic endeavor. Their moral guidance and sacrifices "
        "have served as the bedrock of my achievements.",
        align="both", font_size=24, space_after=100
    ))
    xml.append(p(
        "First and foremost, I am extremely thankful to Maj Dr. Anandappa I, Principal, Seshadripuram College, "
        "for granting me the institutional facilities, technical ecosystem, and encouragement to pursue this ambitious project "
        "as an integral component of the Bachelor of Computer Applications curriculum.",
        align="both", font_size=24, space_after=100
    ))
    xml.append(p(
        "I extend my heartfelt thanks and deep respect to Prof. Rajeswari V, Head of the Department of Computer Science, "
        "for her visionary leadership, constant motivation, and for creating an inspiring environment conducive to high-level technical research.",
        align="both", font_size=24, space_after=100
    ))
    xml.append(p(
        "I would also like to express my deepest appreciation and sincere gratitude to my project guide Mrs. Sujatha P V, "
        "Assistant Professor, for her invaluable guidance, perceptive criticism, continuous technical feedback, and scholarly supervision "
        "throughout every phase of design, architectural refinement, and testing.",
        align="both", font_size=24, space_after=100
    ))
    xml.append(p(
        "Lastly, I extend my warm appreciation to all faculty members of the Department of Computer Science, laboratory staff, "
        "and my fellow classmates for their constructive suggestions, camaraderie, and encouragement.",
        align="both", font_size=24, space_after=160
    ))
    xml.append(p("SUMIT CHAUHAN", bold=True, align="right", font_size=26, space_after=40))
    xml.append(p("(Reg No: U18GH24S0048)", align="right", font_size=22, space_after=100))
    xml.append(page_break())

    # 6. Abstract
    xml.append(p("ABSTRACT", bold=True, align="center", font_size=32, space_before=160, space_after=140))
    abs_p1 = (
        "ENIGMA is an enterprise-grade, cloud-native psychometric intelligence platform and multidimensional cognitive "
        "synthesis engine engineered to evaluate, quantify, and holistically interpret human potential across four foundational "
        "dimensions: Cognitive Intelligence (IQ), Emotional Intelligence (EQ), Spiritual/Existential Quotient (SQ), and "
        "Adversity/Adaptability Quotient (AQ). While classical psychological frameworks treat cognitive ability and emotional "
        "regulation in isolated silos—often relying on proprietary, expensive testing batteries or superficial commercial "
        "quizzes lacking empirical standardization—ENIGMA unifies psychometric rigor with state-of-the-art cloud architecture, "
        "generative artificial intelligence, and real-time anti-cheat telemetry."
    )
    abs_p2 = (
        "The system architecture incorporates a high-performance modern web application. The frontend is built using React 18, "
        "Vite, Tailwind CSS, Lucide icons, and interactive Canvas/Chart visualizations, deployed continuously onto the global "
        "edge network of Vercel. The backend is powered by a high-throughput Python FastAPI service deployed in a Dockerized "
        "PaaS environment on Render, connected via SQLAlchemy 2.0 with connection pooling to a cloud-managed Supabase PostgreSQL "
        "database. Supabase also guarantees secure identity lifecycle management via cryptographically signed JWT tokens, Row Level "
        "Security (RLS), and Role-Based Access Control (RBAC). For advanced cognitive synthesis, the system interfaces with the "
        "Groq LPU (Language Processing Unit) inference cluster (running models such as Qwen 2.5 32B and Llama 3.3 70B), with an "
        "automated, resilient deterministic psychometric fallback that ensures zero downtime."
    )
    abs_p3 = (
        "Key functional innovations include an empirical Gaussian normalization engine (calibrated to mean 100, standard "
        "deviation 15) that calculates exact cumulative distribution percentiles and standard error of measurement; an interactive "
        "visual 'Score Spectrum Ruler' indicating exactly where an examinee stands relative to normal bell-curve populations; a "
        "real-time Anti-Cheat monitor leveraging the browser Page Visibility API to detect tab switching; an interactive speed "
        "math Cognitive Gym with duel mechanics and full mathematical answer review; and a secure administrative CRUD portal for "
        "real-time psychometric item management. Developed adhering strictly to the Incremental Software Development Life Cycle (SDLC), "
        "ENIGMA demonstrates how modern full-stack web engineering, rigorous psychometrics, and unvarnished generative AI "
        "synthesize into a transparent, scalable, and scientifically grounded assessment ecosystem."
    )
    xml.append(p(abs_p1, align="both", font_size=24, space_after=100))
    xml.append(p(abs_p2, align="both", font_size=24, space_after=100))
    xml.append(p(abs_p3, align="both", font_size=24, space_after=120))
    xml.append(p("Keywords: Psychometrics, Cognitive Synthesis, Gaussian Normal Distribution, FastAPI, React 18, Supabase, Groq LPU, Vercel, Render, Anti-Cheat Telemetry.", italic=True, align="both", font_size=22, space_after=100))
    xml.append(page_break())

    # 7. Table of Contents
    xml.append(p("TABLE OF CONTENTS", bold=True, align="center", font_size=32, space_before=160, space_after=140))
    toc_headers = ["SL NO.", "TITLE", "PAGE NO."]
    toc_rows = [
        ["1.", "INTRODUCTION\n  1.1 Project Description\n  1.2 Background of Psychometrics\n  1.3 Problem Statement\n  1.4 Motivation & Empirical Foundations\n  1.5 Objectives (General & Specific)\n  1.6 Scope of the Project\n  1.7 Limitations\n  1.8 Methodology (Incremental SDLC)\n  1.9 Organization of the Report", "1 - 8"],
        ["2.", "LITERATURE SURVEY\n  2.1 Existing and Proposed System\n  2.2 Comparative Analysis\n  2.3 Feasibility Study (Technical, Economic, Operational, Schedule, Legal)\n  2.4 Tools and Technologies Used\n  2.5 Hardware and Software Requirements\n  2.6 Review of Related Approaches & Psychometric Theory", "9 - 18"],
        ["3.", "SOFTWARE REQUIREMENTS SPECIFICATION\n  3.1 User Classes and Characteristics\n  3.2 Functional Requirements (FR-01 to FR-20)\n  3.3 Non-Functional Requirements (NFR-01 to NFR-10)\n  3.4 Business Rules & Psychometric Standards\n  3.5 Use-Case Narratives & System Constraints", "19 - 28"],
        ["4.", "SYSTEM DESIGN\n  4.1 System Perspective & Architecture Overview\n  4.2 Multi-Tier Architectural Model\n  4.3 Component Responsibilities\n  4.4 Level-0 & Level-1 Context Diagrams\n  4.5 Cloud Deployment Architecture (Vercel + Render + Supabase)", "29 - 36"],
        ["5.", "DETAILED DESIGN\n  5.1 Use Case Diagram & Actor Matrix\n  5.2 Sequence Diagrams (Assessment, Groq AI, Gym Duels)\n  5.3 Collaboration Diagrams\n  5.4 Activity Diagram & Workflow\n  5.5 Database Relational Schema & Data Dictionaries\n  5.6 Mathematical Models & Algorithm Design\n  5.7 System State Machine\n  5.8 Performance & Connection Pooling", "37 - 48"],
        ["6.", "IMPLEMENTATION\n  6.1 Screenshots & Interface Walkthrough\n  6.2 Development Environment & Directory Structure\n  6.3 Module Deconstruction\n  6.4 Cloud Deployment Workflows\n  6.5 Representative Core Production Code Listings", "49 - 64"],
        ["7.", "SOFTWARE TESTING\n  7.1 Testing Strategy & Methodology\n  7.2 Test Environment & Setup\n  7.3 Unit Testing & Component Tests\n  7.4 Functional Test Cases (Battery, Synthesis, Gym, Admin)\n  7.5 Security, RLS & JWT Test Cases\n  7.6 Validation & Error Handling Tests\n  7.7 Defects Identified & Fixed (Groq 404, Render psycopg, HEAD probe)\n  7.8 Cross-Browser & Device Compatibility Matrix\n  7.9 Risk Analysis & Mitigations\n  7.10 Test Sign-Off & Summary", "65 - 76"],
        ["8.", "CONCLUSION\n  8.1 Objectives Achieved Matrix\n  8.2 Learning Outcomes & Technical Competencies", "77 - 79"],
        ["9.", "FUTURE ENHANCEMENTS\n  9.1 Adaptive Item Response Theory (CAT)\n  9.2 Biometric Eye-Tracking & Stress Analysis\n  9.3 Multimodal Voice Assessments\n  9.4 Enterprise HR Analytics Dashboard", "80 - 82"],
        ["10.", "BIBLIOGRAPHY & ACADEMIC REFERENCES", "83 - 85"],
        ["11.", "USER MANUAL & TROUBLESHOOTING GUIDE\n  11.1 Step-by-Step Operational Manual\n  11.2 Diagnostic & Troubleshooting Matrix", "86 - 89"]
    ]
    xml.append(table(toc_headers, toc_rows, col_widths=[800, 6600, 1200]))
    xml.append(page_break())

    # 8. List of Tables
    xml.append(p("LIST OF TABLES", bold=True, align="center", font_size=32, space_before=160, space_after=140))
    tbl_headers = ["SL NO.", "TABLE NO.", "TITLE", "PAGE NO."]
    tbl_rows = [
        ["1.", "1.1", "Development Increments of Enigma Platform", "7"],
        ["2.", "2.1", "Comparative Evaluation of Psychometric Platforms", "11"],
        ["3.", "2.2", "Technologies and Cloud Infrastructure Stack", "14"],
        ["4.", "2.3", "Hardware Requirements (Client & Server)", "16"],
        ["5.", "2.4", "Software and Runtime Requirements", "17"],
        ["6.", "3.1", "User Classes and Role Privileges", "20"],
        ["7.", "3.2", "Functional Requirements Specification (FR-01 to FR-20)", "21"],
        ["8.", "3.3", "Non-Functional Requirements Specification (NFR-01 to NFR-10)", "25"],
        ["9.", "4.1", "Architectural Component Responsibilities", "32"],
        ["10.", "4.2", "Context Level Data Flows", "34"],
        ["11.", "5.1", "Data Dictionary: Entity profiles (Supabase PostgreSQL)", "40"],
        ["12.", "5.2", "Data Dictionary: Entity questions", "41"],
        ["13.", "5.3", "Data Dictionary: Entity assessment_results", "42"],
        ["14.", "5.4", "Data Dictionary: Entity cognitive_gym_sessions", "43"],
        ["15.", "5.5", "Gaussian Standard Score Classification Bands", "45"],
        ["16.", "5.6", "State Transition Table for Assessment Engine", "47"],
        ["17.", "6.1", "Repository Directory Structure", "54"],
        ["18.", "6.2", "Frontend React Modules & Component Catalog", "55"],
        ["19.", "6.3", "Backend FastAPI Microservices & Endpoint Catalog", "57"],
        ["20.", "7.1", "Hardware and Software Test Environment", "66"],
        ["21.", "7.2", "Test Cases: Authentication & Supabase JWT Security", "67"],
        ["22.", "7.3", "Test Cases: 4D Assessment Battery Execution", "68"],
        ["23.", "7.4", "Test Cases: Gaussian Normalization & Spectrum Ruler", "69"],
        ["24.", "7.5", "Test Cases: Groq LPU Inference & Resilient Fallback", "70"],
        ["25.", "7.6", "Test Cases: Cognitive Gym & Solution Review Modal", "71"],
        ["26.", "7.7", "Test Cases: Anti-Cheat Telemetry & Visibility API", "72"],
        ["27.", "7.8", "Security Test Cases: SQL Injection, RLS Bypass & Headers", "73"],
        ["28.", "7.9", "Defect Log & Resolution Matrix", "74"],
        ["29.", "7.10", "Cross-Browser and Operating System Compatibility", "75"],
        ["30.", "8.1", "Verification of Project Objectives Achievement", "78"],
        ["31.", "B.1", "Operational User Guide by Module", "87"],
        ["32.", "B.2", "System Diagnostics and Troubleshooting Matrix", "89"]
    ]
    xml.append(table(tbl_headers, tbl_rows, col_widths=[800, 1100, 5500, 1200]))
    xml.append(page_break())

    # 9. List of Figures
    xml.append(p("LIST OF FIGURES", bold=True, align="center", font_size=32, space_before=160, space_after=140))
    fig_headers = ["SL NO.", "FIGURE NO.", "DESCRIPTION", "PAGE NO."]
    fig_rows = [
        ["1.", "4.1", "High-Level Layered System Architecture", "30"],
        ["2.", "4.2", "Level-0 Context Data Flow Diagram", "33"],
        ["3.", "4.3", "Cloud Deployment Topology (Vercel + Render + Supabase)", "35"],
        ["4.", "5.1", "Comprehensive Use Case Diagram", "38"],
        ["5.", "5.2", "Sequence Diagram: Standardized Assessment Execution & Scoring", "39"],
        ["6.", "5.3", "Sequence Diagram: Groq LPU AI Synthesis with Fallback", "40"],
        ["7.", "5.4", "Sequence Diagram: Cognitive Gym Speed Math & Review", "41"],
        ["8.", "5.5", "Collaboration Diagram: Authentication & Assessment Processing", "42"],
        ["9.", "5.6", "Activity Diagram: End-to-End User Assessment Workflow", "43"],
        ["10.", "5.7", "Entity-Relationship (ER) Schema of Supabase Database", "44"],
        ["11.", "6.1", "User Interface: Enigma Landing Page & Assessment Hub", "50"],
        ["12.", "6.2", "User Interface: Standardized Assessment with Anti-Cheat Banner", "51"],
        ["13.", "6.3", "User Interface: Unified 4D Intelligence Synthesis Page", "51"],
        ["14.", "6.4", "User Interface: Interactive Score Spectrum Ruler", "52"],
        ["15.", "6.5", "User Interface: Playable Cognitive Gym Speed Math Arena", "52"],
        ["16.", "6.6", "User Interface: Step-by-Step Math Solution Review Modal", "53"],
        ["17.", "6.7", "User Interface: Administrator Question Management Console", "53"]
    ]
    xml.append(table(fig_headers, fig_rows, col_widths=[800, 1300, 5300, 1200]))
    xml.append(page_break())

    return "".join(xml)
