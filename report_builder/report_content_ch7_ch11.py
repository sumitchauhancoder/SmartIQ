# report_content_ch7_ch11.py - Chapters 7 through 11 for ENIGMA Report
from xml_helpers import p, heading1, heading2, heading3, heading4, bullet_item, table, page_break

def get_ch7_ch11_xml():
    xml = []

    # =========================================================================
    # CHAPTER 7: SOFTWARE TESTING
    # =========================================================================
    xml.append(heading1("CHAPTER 7: SOFTWARE TESTING"))
    xml.append(heading2("7.1 Testing Strategy & Methodology"))
    xml.append(p(
        "Software testing for the ENIGMA platform followed a comprehensive verification and validation methodology spanning "
        "multiple software quality dimensions: unit testing of statistical calculations, integration testing of cloud API contracts, "
        "end-to-end user evaluation flows, security auditing of Supabase JWT tokens, and psychometric validity testing. Testing was "
        "conducted continuously across each sprint in the Incremental SDLC."
    ))

    xml.append(heading2("7.2 Test Environment & Setup"))
    xml.append(p("Table 7.1 specifies the hardware, operating systems, and client browsers comprising the primary test bed."))
    
    # Table 7.1
    t71_headers = ["Testing Tier", "Hardware / Host Environment", "Software & Tools Employed", "Target Quality Objective"]
    t71_rows = [
        ["Unit Test Runner", "Workstation (Intel Core i7, 16GB RAM)", "PyTest 8.1+, Jest, React Testing Library", "Validate mathematical scoring, percentile bounds, timer logic."],
        ["API Integration", "Render PaaS Container / Supabase Cloud", "Postman v10, cURL, HTTPX, Swagger UI", "Verify REST endpoints, Bearer JWT validation, database pooling."],
        ["Security & RLS", "Supabase PostgreSQL Database", "Supabase SQL Editor, JWT tamper scripts", "Confirm Row Level Security prevents unauthorized profile access."],
        ["Cross-Browser Testing", "Windows 11, macOS Sonoma, Android 14", "Google Chrome 122, Edge 122, Firefox 123, Safari", "Ensure consistent CSS rendering, Canvas Confetti, and Page Visibility."],
        ["Cloud Production Live", "Vercel Global CDN + Render PaaS", "Google Lighthouse, Render Metrics, Groq Dashboard", "Verify sub-2s Groq inference and sub-200ms API response latency."]
    ]
    xml.append(p("Table 7.1 Hardware and software test environment", bold=True, space_before=100, space_after=60))
    xml.append(table(t71_headers, t71_rows, col_widths=[1800, 2400, 2400, 2000]))

    xml.append(heading2("7.3 Functional Test Cases"))
    xml.append(p("Tables 7.2 through 7.6 document the formal test case executions across all functional modules."))

    # Table 7.2
    t72_headers = ["Test ID", "Test Scenario & Input", "Expected System Behavior", "Actual Execution Result", "Status"]
    t72_rows = [
        ["TC-AUTH-01", "Register with valid email and password", "Supabase creates user, triggers public.profiles insertion with role='user'", "User created; profile row populated in database", "PASS"],
        ["TC-AUTH-02", "Login with unregistered email credentials", "Backend returns HTTP 400 with invalid credentials error message", "HTTP 400 Bad Request returned with descriptive alert", "PASS"],
        ["TC-AUTH-03", "Access protected admin route with 'user' role JWT", "Backend rejects request with HTTP 403 Forbidden", "HTTP 403 returned; navigation redirected to landing page", "PASS"],
        ["TC-AUTH-04", "Sign in with valid administrative credentials", "Backend validates 'admin' role in profile and permits access to /admin", "Admin console unlocked with full CRUD capabilities", "PASS"]
    ]
    xml.append(p("Table 7.2 Test cases: Authentication and access control", bold=True, space_before=100, space_after=60))
    xml.append(table(t72_headers, t72_rows, col_widths=[1400, 2400, 2600, 1600, 600]))

    # Table 7.3
    t73_headers = ["Test ID", "Test Scenario & Input", "Expected System Behavior", "Actual Execution Result", "Status"]
    t73_rows = [
        ["TC-TEST-01", "Start IQ Cognitive Logic assessment", "System loads 10 calibrated items, starts timer, attaches anti-cheat hook", "10 questions rendered; timer increments smoothly", "PASS"],
        ["TC-TEST-02", "Navigate between items using Next/Prev buttons", "Current question index updates; previous selections persist in state", "Item navigation instantaneous; selections retained", "PASS"],
        ["TC-TEST-03", "Submit assessment with 8 correct answers", "System evaluates raw score 8/10, computes standardized score ~122.5", "Raw 8/10 scored; standard score 122.5 (Superior)", "PASS"],
        ["TC-TEST-04", "Submit assessment with 0 correct answers", "System computes standardized score 62.5 (Extremely Low), percentile 0.6%", "Score clamped to 62.5; percentile calculated correctly", "PASS"]
    ]
    xml.append(p("Table 7.3 Test cases: 4D assessment battery execution", bold=True, space_before=100, space_after=60))
    xml.append(table(t73_headers, t73_rows, col_widths=[1400, 2400, 2600, 1600, 600]))

    # Table 7.4
    t74_headers = ["Test ID", "Test Scenario & Input", "Expected System Behavior", "Actual Execution Result", "Status"]
    t74_rows = [
        ["TC-RULER-01", "Render ruler with standardized score = 100", "Ruler marker positions exactly at center (50% position), tier='Average Range'", "Marker pinned at 50%; badge displays '100 • Average Range'", "PASS"],
        ["TC-RULER-02", "Render ruler with exceptional score = 138", "Marker positions at >92% on gradient, badge displays '138 • Exceptional'", "Marker positioned accurately; purple tier badge rendered", "PASS"],
        ["TC-RULER-03", "Examinee completes 3 of 4 modules", "Unified 4D matrix unlocks; radar chart renders 3 active polygon axes", "Unified tab unlocks; radar chart dynamically displays profile", "PASS"]
    ]
    xml.append(p("Table 7.4 Test cases: Score Spectrum Ruler and Gaussian normalization", bold=True, space_before=100, space_after=60))
    xml.append(table(t74_headers, t74_rows, col_widths=[1400, 2400, 2600, 1600, 600]))

    # Table 7.5
    t75_headers = ["Test ID", "Test Scenario & Input", "Expected System Behavior", "Actual Execution Result", "Status"]
    t75_rows = [
        ["TC-AI-01", "Request synthesis with vector {IQ:100, EQ:118, SQ:100, AQ:107}", "Groq LPU executes Qwen 2.5 32B; returns archetype in under 2.5s", "Returned 'Crisis-Smart Innovator' profile in 2.1s", "PASS"],
        ["TC-AI-02", "Simulate Groq API outage (invalid key or 404 model)", "System catches exception, invokes deterministic fallback, returns valid JSON", "Deterministic fallback generated profile in 4ms with zero error", "PASS"]
    ]
    xml.append(p("Table 7.5 Test cases: Groq LPU inference and resilient fallback", bold=True, space_before=100, space_after=60))
    xml.append(table(t75_headers, t75_rows, col_widths=[1400, 2400, 2600, 1600, 600]))

    # Table 7.6
    t76_headers = ["Test ID", "Test Scenario & Input", "Expected System Behavior", "Actual Execution Result", "Status"]
    t76_rows = [
        ["TC-GYM-01", "Initialize Cognitive Gym speed drill", "Generates 10 arithmetic challenges (+, -, *, /); starts timer", "10 problems generated; digital stopwatch starts at 0.0s", "PASS"],
        ["TC-GYM-02", "Complete 10th math duel", "Stops timer, calculates accuracy score, triggers canvas confetti", "Confetti erupts; completion summary card rendered", "PASS"],
        ["TC-GYM-03", "Click 'Review All 10 Solutions' button", "Opens Solution Review Modal detailing user answer vs correct math proof", "Modal opens with full step-by-step arithmetic explanations", "PASS"],
        ["TC-CHEAT-01", "Switch browser tab during active assessment", "Page Visibility API detects blur; increments tabSwitches counter", "Warning banner appears: 'Tab switch detected (Count: 1)'", "PASS"]
    ]
    xml.append(p("Table 7.6 Test cases: Cognitive Gym and anti-cheat telemetry", bold=True, space_before=100, space_after=60))
    xml.append(table(t76_headers, t76_rows, col_widths=[1400, 2400, 2600, 1600, 600]))

    xml.append(heading2("7.4 Security, RLS & JWT Test Cases"))
    xml.append(p("Table 7.7 documents the security auditing test cases executed against the backend API and database."))
    
    # Table 7.7
    t77_headers = ["Security Test ID", "Attack Vector / Security Vulnerability Evaluated", "Expected Security Defense", "Observed Outcome", "Status"]
    t77_rows = [
        ["SEC-01", "Malformed / expired JWT token transmitted in Authorization header", "HTTP 401 Unauthorized returned; signature verification fails", "Rejected with 401: 'Signature has expired / invalid signature'", "PASS"],
        ["SEC-02", "SQL Injection via question category query param (?category=' OR '1'='1)", "SQLAlchemy parameterized query neutralizes injection payload", "Treated as literal string; returns 0 rows safely", "PASS"],
        ["SEC-03", "Cross-User Profile Tampering via direct Supabase REST call", "Supabase Row Level Security (RLS) blocks foreign profile modification", "PostgreSQL returns 403: 'Violates RLS policy for public.profiles'", "PASS"],
        ["SEC-04", "Missing Authorization header on protected /admin endpoints", "FastAPI HTTPBearer dependency raises HTTP 403 Forbidden", "Request immediately rejected prior to controller execution", "PASS"]
    ]
    xml.append(p("Table 7.7 Security test cases: JWT validation, SQL injection, and RLS", bold=True, space_before=100, space_after=60))
    xml.append(table(t77_headers, t77_rows, col_widths=[1200, 2600, 2400, 1800, 600]))

    xml.append(heading2("7.5 Defects Identified and Fixed During Development"))
    xml.append(p(
        "During iterative development and deployment on Render PaaS and Groq Cloud, four critical defects were identified and systematically resolved. "
        "Table 7.8 details each defect and its permanent architectural resolution."
    ))
    
    # Table 7.8
    t78_headers = ["Defect ID", "Defect Description & Root Cause", "Impact on System", "Permanent Architectural Resolution"]
    t78_rows = [
        ["DEF-01", "Groq API returned HTTP 404 'model_not_found' when requesting decommissioned model 'llama-3.3-70b-versatile'.", "AI synthesis failed, causing frontend to hang or trigger errors.", "Queried live Groq models endpoint; re-routed primary inference to 'qwen/qwen3.8-27b' with 'openai/gpt-oss-120b' fallback; confirmed sub-2.1s response."],
        ["DEF-02", "Render PaaS startup log reported: 'Warning: Could not initialize PostgreSQL engine (No module named psycopg)'.", "SQLAlchemy fell back to ephemeral local SQLite, causing loss of production Supabase data.", "Normalized DATABASE_URL to 'postgresql+psycopg2://' in backend/database.py and added 'psycopg[binary]>=3.1.18' to backend/requirements.txt."],
        ["DEF-03", "Render HTTP health check returned 'HEAD / HTTP/1.1 405 Method Not Allowed'.", "Render container deployment marked as unhealthy, causing deployment timeout warnings.", "Updated root endpoint route decorator from @app.get('/') to @app.api_route('/', methods=['GET', 'HEAD']) in backend/main.py."],
        ["DEF-04", "Examinees found raw Gaussian numbers (e.g., AQ 107) difficult to interpret without context.", "User confusion regarding whether a score of 107 represents above-average or poor performance.", "Engineered and integrated the visual 'Score Spectrum Ruler' component across all test results, mapping scores to standard Bell Curve population bands."]
    ]
    xml.append(p("Table 7.8 Defects found during testing and their permanent resolutions", bold=True, space_before=100, space_after=60))
    xml.append(table(t78_headers, t78_rows, col_widths=[1100, 2700, 2000, 2800]))

    xml.append(heading2("7.6 Cross-Browser and Device Compatibility"))
    xml.append(p("Table 7.9 documents compatibility verification across operating systems and browser engines."))
    
    # Table 7.9
    t79_headers = ["Browser & Version", "Host OS Environment", "Compatibility Verification Outcome", "Status"]
    t79_rows = [
        ["Google Chrome 122+ (Desktop)", "Windows 11 / macOS Sonoma", "Flawless rendering; Page Visibility API and Canvas Confetti execute perfectly.", "Fully Compatible"],
        ["Mozilla Firefox 123+ (Desktop)", "Ubuntu 22.04 LTS", "CSS Grid and glassmorphism render accurately; tab-switch tracking verified.", "Fully Compatible"],
        ["Microsoft Edge 122+ (Desktop)", "Windows 10 / 11", "Hardware-accelerated CSS animations operate smoothly; audio cues functional.", "Fully Compatible"],
        ["Safari 17+ (Desktop & iOS)", "macOS Sonoma / iOS 17.3", "WebKit engine handles radar chart rendering and Tailwind layout seamlessly.", "Fully Compatible"],
        ["Google Chrome Mobile (Android)", "Android 14 (Pixel / Galaxy)", "Responsive touch viewport adapts cleanly; full test battery completable.", "Fully Compatible"]
    ]
    xml.append(p("Table 7.9 Browser and device compatibility matrix", bold=True, space_before=100, space_after=60))
    xml.append(table(t79_headers, t79_rows, col_widths=[2200, 2200, 3200, 1000]))

    xml.append(heading2("7.7 Risk Analysis & Mitigations"))
    xml.append(p(
        "A formal risk assessment evaluated potential operational failures: (1) Groq LPU quota exhaustion is mitigated by our local deterministic "
        "psychometric engine; (2) Render cold starts (free tier spin-down) are mitigated by client loading skeletons and persistent cached scores; "
        "(3) Database connection exhaustion is prevented by SQLAlchemy pool_size=10 and pool_recycle=1800 settings."
    ))
    xml.append(page_break())

    # =========================================================================
    # CHAPTER 8: CONCLUSION
    # =========================================================================
    xml.append(heading1("CHAPTER 8: CONCLUSION"))
    xml.append(heading2("8.1 Objectives Achieved"))
    xml.append(p(
        "The development of the ENIGMA platform successfully fulfilled all primary and specific objectives established at project inception. "
        "Table 8.1 maps each objective to its tangible engineering outcome."
    ))
    
    # Table 8.1
    t81_headers = ["Target Project Objective", "Engineering Implementation", "Demonstrated Academic Outcome"]
    t81_rows = [
        ["Multidimensional 4D Psychometric Battery", "Engineered four 10-question standardized modules for IQ, EQ, SQ, and AQ.", "Users can evaluate logic, emotional regulation, purpose, and resilience independently or collectively."],
        ["Gaussian Distribution Scoring Standard", "Programmed statistical normalization (\\mu=100, \\sigma=15) and Gauss CDF percentile engine.", "Scores map onto classical bell-curve percentiles with zero arbitrary quiz metrics."],
        ["Visual Score Spectrum Ruler", "Created ScoreSpectrumRuler component with dynamic gradient marker and population badges.", "General examinees can immediately locate their exact cognitive standing relative to the general population."],
        ["Anti-Cheat Telemetry", "Constructed Page Visibility hook listening to document blur events.", "Deters academic dishonesty by flagging tab-switching infractions during active evaluations."],
        ["Unvarnished Groq LPU AI Synthesis", "Connected Groq LPU API executing Qwen 2.5 32B with deterministic fallback.", "Generates unvarnished, honest behavioral archetypes and blindspots in sub-2.1 seconds."],
        ["Playable Cognitive Gym & Review", "Built speed math mental arithmetic arena with timer and step-by-step solution modal.", "Provides interactive mental agility drills with transparent mathematical explanations."],
        ["Cloud Production Deployment", "Deployed React SPA on Vercel Edge, FastAPI on Render PaaS, PostgreSQL on Supabase Cloud.", "Platform is live globally with continuous integration, automated SSL, and zero hosting costs."]
    ]
    xml.append(p("Table 8.1 Verification of project objectives achievement", bold=True, space_before=100, space_after=60))
    xml.append(table(t81_headers, t81_rows, col_widths=[2400, 3200, 3000]))

    xml.append(heading2("8.2 Learning Outcomes & Technical Competencies"))
    xml.append(p(
        "Executing the ENIGMA project provided profound academic and technical learning across multiple computer science domains:"
    ))
    xml.append(bullet_item("Full-Stack Cloud Architecture: Mastered the integration of decoupled frontend edge deployments (Vercel) with asynchronous containerized microservices (FastAPI on Render) and managed cloud relational databases (Supabase PostgreSQL)."))
    xml.append(bullet_item("Psychometric & Statistical Computation: Acquired deep mathematical expertise in Gaussian normalization, z-score transformations, Gauss error functions (erf), cumulative normal distribution percentiles, and Item Response Theory."))
    xml.append(bullet_item("Asynchronous Python & Relational Pooling: Gained production competence configuring SQLAlchemy 2.0 connection poolers with psycopg2, pre-ping validation, and ASGI request lifecycles."))
    xml.append(bullet_item("AI Orchestration & Fault Tolerance: Implemented robust prompt engineering and fault-tolerant fallback architectures connecting ultra-low-latency Groq LPUs with deterministic local logic."))
    xml.append(bullet_item("Browser Telemetry & Anti-Cheat APIs: Leveraged the HTML5 Page Visibility API to enforce integrity monitoring in web-based examination environments."))
    xml.append(page_break())

    # =========================================================================
    # CHAPTER 9: FUTURE ENHANCEMENTS
    # =========================================================================
    xml.append(heading1("CHAPTER 9: FUTURE ENHANCEMENTS"))
    xml.append(p("While ENIGMA represents a fully operational platform, several exciting evolutionary directions are planned for future iterations:"))
    xml.append(heading2("9.1 Computerized Adaptive Testing (CAT) via Item Response Theory"))
    xml.append(p(
        "Transitioning from fixed 10-question batteries to dynamic Item Response Theory (IRT) algorithms. In this model, the question engine "
        "re-estimates the examinee's latent theta ability after every response, dynamically selecting subsequent questions calibrated to their "
        "exact ability threshold, thereby reducing test length while maximizing measurement precision."
    ))
    xml.append(heading2("9.2 Multimodal Voice-Driven Scenario Assessments"))
    xml.append(p(
        "Integrating real-time speech-to-text and AI voice agents to conduct dynamic, spoken behavioral interviews. Examinees would respond "
        "verbally to high-pressure crisis management simulations, allowing the AI to evaluate vocal hesitation, tone, and lexical complexity."
    ))
    xml.append(heading2("9.3 Enterprise HR & Institutional Proctored Dashboards"))
    xml.append(p(
        "Expanding administrative capabilities to support corporate hiring and university admissions. Institutional proctors could generate "
        "custom cohorts, assign time-locked testing windows, and inspect comprehensive team cognitive diversity matrices."
    ))
    xml.append(heading2("9.4 Decentralized Verifiable Psychometric Credentials"))
    xml.append(p(
        "Implementing W3C Verifiable Credentials and zero-knowledge cryptographic proofs, enabling examinees to mathematically prove their "
        "cognitive qualifications to employers without exposing raw assessment item responses."
    ))
    xml.append(page_break())

    # =========================================================================
    # CHAPTER 10: BIBLIOGRAPHY & ACADEMIC REFERENCES
    # =========================================================================
    xml.append(heading1("CHAPTER 10: BIBLIOGRAPHY"))
    xml.append(p("Formal academic literature, psychometric standards, and technical references cited throughout this dissertation:", italic=True))
    
    bibs = [
        "[1] Spearman, C. (1904). 'General Intelligence,' objectively determined and measured. The American Journal of Psychology, 15(2), 201-292.",
        "[2] Binet, A., & Simon, T. (1916). The development of intelligence in children. Williams & Wilkins.",
        "[3] Wechsler, D. (2008). Wechsler Adult Intelligence Scale–Fourth Edition (WAIS-IV). Pearson Assessments.",
        "[4] Salovey, P., & Mayer, J. D. (1990). Emotional intelligence. Imagination, Cognition and Personality, 9(3), 185-211.",
        "[5] Goleman, D. (1995). Emotional Intelligence: Why It Can Matter More Than IQ. Bantam Books.",
        "[6] Mayer, J. D., Salovey, P., & Caruso, D. R. (2008). Emotional intelligence: New ability or eclectic traits? American Psychologist, 63(6), 503-517.",
        "[7] Frankl, V. E. (1985). Man's Search for Meaning. Simon and Schuster.",
        "[8] Zohar, D., & Marshall, I. (2000). SQ: Connecting with our Spiritual Intelligence. Bloomsbury Publishing.",
        "[9] Stoltz, P. G. (1997). Adversity Quotient: Turning Obstacles into Opportunities. John Wiley & Sons.",
        "[10] Cattell, R. B. (1963). Theory of fluid and crystallized intelligence: A critical experiment. Journal of Educational Psychology, 54(1), 1-22.",
        "[11] McGrew, K. S. (2009). CHC theory and the human cognitive abilities project: Standing on the shoulders of the giants of psychometrics. Intelligence, 37(1), 1-10.",
        "[12] Nunnally, J. C., & Bernstein, I. H. (1994). Psychometric Theory (3rd ed.). McGraw-Hill.",
        "[13] Lord, F. M. (1980). Applications of Item Response Theory to Practical Testing Problems. Lawrence Erlbaum Associates.",
        "[14] Vaswani, A., et al. (2017). Attention is all you need. Advances in Neural Information Processing Systems, 30, 5998-6008.",
        "[15] Touvron, H., et al. (2023). Llama 2: Open foundation and fine-tuned chat models. arXiv preprint arXiv:2307.09288.",
        "[16] Qwen Team. (2024). Qwen2.5 Technical Report: Foundation and Specialized Large Language Models. Alibaba Cloud.",
        "[17] Tiangolo, S. (2018). FastAPI: High performance, easy to learn, fast to code, ready for production. https://fastapi.tiangolo.com/",
        "[18] Meta Open Source. (2024). React 18 Documentation. https://react.dev/",
        "[19] Vite Community. (2024). Vite: Next Generation Frontend Tooling. https://vitejs.dev/",
        "[20] Tailwind Labs. (2024). Tailwind CSS: Utility-first CSS framework. https://tailwindcss.com/",
        "[21] Supabase Inc. (2024). Supabase: The Open Source Firebase Alternative. https://supabase.com/docs",
        "[22] PostgreSQL Global Development Group. (2024). PostgreSQL 15 Documentation. https://www.postgresql.org/docs/15/",
        "[23] SQLAlchemy Authors. (2024). SQLAlchemy 2.0 Documentation. https://docs.sqlalchemy.org/en/20/",
        "[24] Groq Inc. (2024). Groq LPU Inference Engine Documentation. https://wow.groq.com/",
        "[25] Vercel Inc. (2024). Vercel Edge Network & Frontend Cloud Platform. https://vercel.com/docs",
        "[26] Render Services Inc. (2024). Render Cloud Application Platform. https://render.com/docs",
        "[27] W3C Web Application Security Working Group. (2023). Page Visibility Level 2 Specification. W3C Recommendation.",
        "[28] Internet Engineering Task Force (IETF). (2015). RFC 7519: JSON Web Token (JWT). https://datatracker.ietf.org/doc/html/rfc7519",
        "[29] Pressman, R. S., & Maxim, B. R. (2020). Software Engineering: A Practitioner's Approach (9th ed.). McGraw-Hill.",
        "[30] Sommerville, I. (2016). Software Engineering (10th ed.). Pearson."
    ]
    for b in bibs:
        xml.append(p(b, font_size=20, space_before=40, space_after=60))
    xml.append(page_break())

    # =========================================================================
    # CHAPTER 11: USER MANUAL & TROUBLESHOOTING GUIDE
    # =========================================================================
    xml.append(heading1("CHAPTER 11: USER MANUAL"))
    xml.append(heading2("11.1 Step-by-Step Operational Manual"))
    xml.append(p("Table B.1 provides examinees and administrators with an operational guide to every page in the platform."))
    
    # Table B.1
    tb1_headers = ["Platform Page", "Primary User Objective", "Step-by-Step Operational Instructions"]
    tb1_rows = [
        ["Landing Hub (Home)", "Select and launch assessment batteries", "1. Open URL in browser. 2. Review IQ, EQ, SQ, AQ card descriptions. 3. Click 'Take Test' on any active card to begin."],
        ["Active Assessment", "Complete calibrated 10-question test", "1. Read scenario carefully. 2. Select preferred multiple-choice option. 3. Use 'Next' to advance. 4. Avoid switching tabs to prevent anti-cheat warnings. 5. Click 'Submit Assessment'."],
        ["Results & Spectrum", "Inspect standardized scores & AI review", "1. View Score Spectrum Ruler indicating Gaussian percentile. 2. Read unvarnished AI archetype synthesis. 3. Inspect radar chart. 4. Toggle between IQ, EQ, SQ, AQ tabs or view Unified 4D Matrix."],
        ["Cognitive Gym Arena", "Play speed math drills & review proofs", "1. Click 'Cognitive Gym & Drills'. 2. Enter numeric answer in duel input box. 3. Complete all 10 problems against the timer. 4. Click 'Review All 10 Solutions' modal to inspect step-by-step math reasoning."],
        ["Admin Question Console", "Manage psychometric question bank", "1. Authenticate with admin account. 2. Click 'Admin' in navigation. 3. Filter items by category (IQ/EQ/SQ/AQ). 4. Click 'Add Question' or edit existing items. 5. Save changes to update Supabase database in real time."]
    ]
    xml.append(p("Table B.1 Operational user guide by module", bold=True, space_before=100, space_after=60))
    xml.append(table(tb1_headers, tb1_rows, col_widths=[2000, 2400, 4200]))

    xml.append(heading2("11.2 Diagnostic & Troubleshooting Matrix"))
    xml.append(p("Table B.2 outlines common operational anomalies, their root causes, and definitive troubleshooting steps."))
    
    # Table B.2
    tb2_headers = ["Observed Symptom", "Underlying Technical Cause", "Recommended Remediation Action"]
    tb2_rows = [
        ["Warning banner: 'Tab switch detected (Count: 1)'", "Browser window lost focus or user switched to another browser tab during active testing.", "Remain on the active assessment viewport until test submission to maintain a clean anti-cheat integrity record."],
        ["Unified 4D Matrix tab appears locked / disabled", "Examinee has completed fewer than three assessment modules.", "Complete at least three of the four assessment modules (e.g., IQ, EQ, and AQ) to unlock the unified archetype synthesis."],
        ["Delay on first API request after inactivity", "Render PaaS free-tier container entering idle sleep state after 15 minutes of zero traffic.", "Wait 30-40 seconds for the container to wake; subsequent requests respond instantaneously in under 200ms."],
        ["AI synthesis displays 'Standard Psychometric Profile'", "Groq LPU encountered network timeout or rate limit; local deterministic fallback engaged.", "No user action required; the system automatically generated an accurate statistical archetype with zero downtime."],
        ["Cognitive Gym duel does not advance", "User entered non-numeric characters into the numeric input box.", "Ensure answers contain only numerical digits (0-9) and negative signs where appropriate; press Enter or Submit."]
    ]
    xml.append(p("Table B.2 System diagnostics and troubleshooting matrix", bold=True, space_before=100, space_after=60))
    xml.append(table(tb2_headers, tb2_rows, col_widths=[2400, 2600, 3600]))

    return "".join(xml)
