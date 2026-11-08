# report_content_ch4_ch5.py - Chapters 4 and 5 for ENIGMA Report
from xml_helpers import p, heading1, heading2, heading3, heading4, bullet_item, table, page_break

def get_ch4_ch5_xml():
    xml = []

    # =========================================================================
    # CHAPTER 4: SYSTEM DESIGN
    # =========================================================================
    xml.append(heading1("CHAPTER 4: SYSTEM DESIGN"))
    xml.append(heading2("4.1 System Perspective & Architecture Overview"))
    xml.append(p(
        "ENIGMA is structured as an enterprise-grade, cloud-native distributed web application employing a decoupled, multi-tier "
        "micro-service architecture. Traditional monolithic psychometric systems bundle user interface rendering, database transactions, "
        "and psychometric computations into a single server process, creating fragile single-points-of-failure and scaling bottlenecks. "
        "In contrast, ENIGMA separates concerns across five distinct architectural layers: the Presentation Layer (Vercel Edge SPA), "
        "the Secure API Gateway (FastAPI with JWT guard), the Psychometric Computation Engine (Python statistical algorithms), the "
        "Artificial Intelligence Reasoning Layer (Groq LPU cluster), and the Persistence & Security Tier (Supabase PostgreSQL with RLS)."
    ))
    xml.append(p(
        "Figure 4.1 illustrates the high-level layered system architecture of the ENIGMA platform, showing unidirectional data contracts "
        "and bidirectional cryptographic verification boundaries."
    ))
    
    # ASCII Architecture Diagram
    arch_diagram = (
        "+-----------------------------------------------------------------------------------+\n"
        "|                         PRESENTATION LAYER (Vercel Global Edge)                   |\n"
        "|  React 18 Single Page App | Vite Bundler | Tailwind CSS Cyber Theme | Chart.js      |\n"
        "|  ScoreSpectrumRuler.jsx   | CognitiveGym.jsx | TestRunner.jsx | Results.jsx       |\n"
        "+-----------------------------------------+-----------------------------------------+\n"
        "                                          | HTTPS / REST (JSON + Supabase Bearer JWT)\n"
        "                                          v\n"
        "+-----------------------------------------------------------------------------------+\n"
        "|                        APPLICATION GATEWAY & MICROSERVICES (Render)               |\n"
        "|  FastAPI (Python 3.10+) | Uvicorn ASGI Worker | Pydantic Request Validation       |\n"
        "|  Auth Bearer Guard      | Anti-Cheat Telemetry | Dynamic Question Engine          |\n"
        "+-------------------+-------------------------------------+-------------------------+\n"
        "                    |                                     | SQLAlchemy 2.0 Pool\n"
        "                    v                                     v (psycopg2-binary)\n"
        "+---------------------------------------+   +---------------------------------------+\n"
        "|     AI REASONING LAYER (Groq LPU)     |   |   PERSISTENCE & SECURITY (Supabase)   |\n"
        "|  Qwen 2.5 32B / Llama 3.3 70B Engine  |   |   Managed PostgreSQL 15 Database      |\n"
        "|  Sub-200ms Inference Latency          |   |   Row Level Security (RLS) Policies   |\n"
        "|  Unvarnished Psychometric Diagnostics |   |   profiles | questions | results      |\n"
        "+---------------------------------------+   +---------------------------------------+"
    )
    xml.append(p("Figure 4.1 High-Level Layered System Architecture of ENIGMA", bold=True, align="center", space_before=100, space_after=60))
    xml.append(p(arch_diagram, font_family="Courier New", font_size=16, space_after=140))

    xml.append(heading2("4.2 Multi-Tier Architectural Model"))
    xml.append(p(
        "1. Presentation Layer (Vercel Edge): Implemented as a high-performance Single Page Application (SPA) leveraging React 18 and "
        "Vite. This layer handles user interactions, manages local reactive state (such as question navigation and active selections), "
        "tracks anti-cheat visibility events, renders interactive bell curves on the Score Spectrum Ruler, and communicates asynchronously "
        "with backend APIs via secure HTTPS fetch calls.",
        italic=True
    ))
    xml.append(p(
        "2. Application Gateway & Microservices (Render PaaS): Built using FastAPI and Uvicorn. This layer acts as the centralized controller, "
        "enforcing CORS security, decoding and validating incoming Supabase JWT tokens, managing route dispatching, and hosting mathematical "
        "psychometric calculations.",
        italic=True
    ))
    xml.append(p(
        "3. Psychometric Computation Engine: An isolated algorithmic core within FastAPI that normalizes raw test scores into standardized "
        "Gaussian distributions (mean=100, standard deviation=15), computes cumulative normal distribution percentiles, derives standard "
        "error of measurement (SEM), and calculates multi-factor radar vectors.",
        italic=True
    ))
    xml.append(p(
        "4. AI Reasoning Layer (Groq LPU): Integrates the Groq Cloud Language Processing Unit to execute advanced large language models "
        "(such as Qwen 2.5 32B and Llama 3.3 70B) in under 2 seconds. The AI synthesizes multi-dimensional score vectors into honest, "
        "unvarnished behavioral archetypes, identifying critical cognitive blindspots.",
        italic=True
    ))
    xml.append(p(
        "5. Persistence & Data Security Tier (Supabase Cloud): Provides an enterprise PostgreSQL 15 relational database cluster equipped with "
        "connection poolers (port 6543/5432). Supabase Auth manages user registration and cryptographically signed JWT issuance, while Row Level "
        "Security (RLS) ensures that users can access only their own psychometric records.",
        italic=True
    ))

    xml.append(heading2("4.3 Component Responsibilities"))
    xml.append(p("Table 4.1 delineates the specific software components comprising the system and their exact architectural responsibilities."))
    
    # Table 4.1
    t41_headers = ["Component Name", "Hosting Tier", "Technology", "Architectural Responsibilities"]
    t41_rows = [
        ["React SPA Client", "Vercel Edge", "React 18 / Vite", "Renders user interface, captures test responses, tracks visibility blur events."],
        ["ScoreSpectrumRuler", "Vercel Edge", "React / Tailwind", "Visualizes user percentile and score relative to Gaussian bell curve standard."],
        ["CognitiveGymArena", "Vercel Edge", "React / Canvas", "Runs 10 randomized speed math challenges, tracks elapsed time and accuracy."],
        ["SolutionReviewModal", "Vercel Edge", "React Component", "Displays comprehensive step-by-step mathematical proofs for gym problems."],
        ["FastAPI Controller", "Render PaaS", "FastAPI / Uvicorn", "Central API router, handles request routing, schema validation, and health probes."],
        ["JWT Auth Guard", "Render PaaS", "PyJWT / Supabase", "Validates Bearer tokens, extracts user IDs, and enforces RBAC admin roles."],
        ["Scoring Service", "Render PaaS", "Python Math / NumPy", "Executes Gaussian normalization, calculates percentiles and reliability indices."],
        ["Groq AI Client", "Groq Cloud", "Groq LPU SDK", "Performs real-time cognitive archetype synthesis and qualitative diagnosis."],
        ["Deterministic Fallback", "Render PaaS", "Python Logic", "Generates structured psychometric synthesis locally if external AI is offline."],
        ["Supabase PostgreSQL", "Supabase Cloud", "PostgreSQL 15 / RLS", "Stores user profiles, question banks, assessment results, and gym records."]
    ]
    xml.append(p("Table 4.1 Architectural component responsibilities", bold=True, space_before=100, space_after=60))
    xml.append(table(t41_headers, t41_rows, col_widths=[1800, 1400, 1800, 3600]))

    xml.append(heading2("4.4 Level-0 & Level-1 Context Diagrams"))
    xml.append(p(
        "Figure 4.2 illustrates the Level-0 Context Diagram of the ENIGMA platform, detailing the primary boundary interactions "
        "between external actors (Examinee and Administrator) and the central system."
    ))
    
    context_diagram = (
        "                    +--------------------------------------------+\n"
        "                    |                 EXAMINEE                   |\n"
        "                    +---------------------+----------------------+\n"
        "                                          | 1. Takes 4D Assessments / Gym\n"
        "                                          | 2. Receives Scores & AI Review\n"
        "                                          v\n"
        "+--------------------------------------------------------------------------------+\n"
        "|                    ENIGMA 4D PSYCHOMETRIC SYNTHESIS PLATFORM                   |\n"
        "|                                                                                |\n"
        "|  * Page Visibility Anti-Cheat  * Gaussian Scoring  * Score Spectrum Ruler      |\n"
        "|  * Groq LPU Synthesis Engine   * Cognitive Gym     * Supabase RLS Security     |\n"
        "+-------------------+------------------------------------+-----------------------+\n"
        "                    ^                                    ^\n"
        "                    | 3. Manage Questions / Auth Logs    | 4. Evaluates Integrity\n"
        "                    | 4. Full CRUD Operations            |    and System Health\n"
        "                    +---------------------+--------------+\n"
        "                                          |\n"
        "                    +---------------------+----------------------+\n"
        "                    |           SYSTEM ADMINISTRATOR             |\n"
        "                    +--------------------------------------------+"
    )
    xml.append(p("Figure 4.2 Level-0 Context Data Flow Diagram", bold=True, align="center", space_before=100, space_after=60))
    xml.append(p(context_diagram, font_family="Courier New", font_size=16, space_after=140))

    xml.append(p("Table 4.2 describes the major information flows traversing system boundaries at the context level."))
    
    # Table 4.2
    t42_headers = ["Flow ID", "Originating Node", "Destination Node", "Data Payload Description", "Protocol"]
    t42_rows = [
        ["DF-01", "Examinee", "Frontend SPA", "Registration credentials, assessment answer choices, gym inputs", "HTTPS UI Event"],
        ["DF-02", "Frontend SPA", "Anti-Cheat Hook", "Page blur / tab-switch timestamps and visibility change flags", "HTML5 DOM Event"],
        ["DF-03", "Frontend SPA", "FastAPI Backend", "User answer vector, assessment metadata, Supabase JWT token", "HTTPS / JSON REST"],
        ["DF-04", "FastAPI Backend", "Scoring Engine", "Raw score items for Gaussian transformation and percentile calculation", "Internal IPC"],
        ["DF-05", "FastAPI Backend", "Groq LPU Cloud", "Standardized 4D score vector for unvarnished archetype synthesis", "HTTPS / REST (TLS)"],
        ["DF-06", "FastAPI Backend", "Supabase Database", "Assessment records, score distributions, and updated profile statistics", "PostgreSQL Pool"],
        ["DF-07", "FastAPI Backend", "Frontend SPA", "Standardized scores, percentile ranks, ruler metadata, AI synthesis JSON", "HTTPS / JSON REST"],
        ["DF-08", "Administrator", "FastAPI Backend", "New question additions, item modifications, category updates, JWT token", "HTTPS / JSON REST"]
    ]
    xml.append(p("Table 4.2 Major data flows at the context level", bold=True, space_before=100, space_after=60))
    xml.append(table(t42_headers, t42_rows, col_widths=[1000, 1600, 1600, 3200, 1200]))

    xml.append(heading2("4.5 Cloud Deployment Architecture (Vercel + Render + Supabase)"))
    xml.append(p(
        "To achieve enterprise reliability, high availability, and geographic edge acceleration, ENIGMA is deployed across a tri-cloud topology:"
    ))
    xml.append(bullet_item("Vercel Global Edge Network: The React 18 production build is hosted on Vercel's global Content Delivery Network (CDN). Every static asset, JavaScript bundle, and image is cached across hundreds of edge locations worldwide, guaranteeing sub-50ms Time-To-First-Byte (TTFB) and automatic atomic rollbacks on Git commits."))
    xml.append(bullet_item("Render PaaS Cloud: The FastAPI microservice backend is containerized and hosted on Render's managed platform (https://smartiq-9ilb.onrender.com). It runs behind an automated Nginx reverse proxy with automated TLS/SSL certification, executing high-concurrency Uvicorn workers."))
    xml.append(bullet_item("Supabase Managed Database Cluster: The relational database tier is hosted on Supabase Cloud in a secure AWS region. Supabase provides fully managed PostgreSQL 15, connection pooling via PgBouncer on port 6543/5432, automated backups, and encrypted storage at rest."))
    xml.append(page_break())

    # =========================================================================
    # CHAPTER 5: DETAILED DESIGN
    # =========================================================================
    xml.append(heading1("CHAPTER 5: DETAILED DESIGN"))
    xml.append(heading2("5.1 Use Case Diagram & Actor Matrix"))
    xml.append(p(
        "The detailed functional design of ENIGMA models all system behaviors across two primary actors: the Examinee and the Administrator. "
        "Figure 5.1 depicts the formal Use Case Diagram illustrating the boundary interactions and use-case inclusions."
    ))
    
    uc_diagram = (
        "  +--------------------------------------------------------------------------------+\n"
        "  |                               ENIGMA USE CASES                                 |\n"
        "  |                                                                                |\n"
        "  |   [Register & Login (Supabase Auth)] <-------+                                 |\n"
        "  |                         ^                    |                                 |\n"
        "  |                         | <<includes>>       |                                 |\n"
        "  |   [Select 4D Assessment Module]              |                                 |\n"
        "  |   [Answer Calibrated Questions]              +--- (Examinee)                   |\n"
        "  |   [Monitor Anti-Cheat Telemetry]             |                                 |\n"
        "  |   [View Score Spectrum Ruler]                |                                 |\n"
        "  |   [Generate Groq AI Synthesis] <-------------+                                 |\n"
        "  |   [Play Cognitive Gym Speed Math] <----------+                                 |\n"
        "  |   [Review Step-by-Step Math Solutions] <-----+                                 |\n"
        "  |                                                                                |\n"
        "  |   [Authenticate Admin Credentials] <---------+                                 |\n"
        "  |   [View Question Bank by Category]           |                                 |\n"
        "  |   [Create / Edit / Delete Test Items] <------+--- (Administrator)              |\n"
        "  |   [Audit Anti-Cheat Integrity Flags] <-------+                                 |\n"
        "  +--------------------------------------------------------------------------------+"
    )
    xml.append(p("Figure 5.1 Comprehensive Use Case Diagram of ENIGMA", bold=True, align="center", space_before=100, space_after=60))
    xml.append(p(uc_diagram, font_family="Courier New", font_size=16, space_after=140))

    xml.append(heading2("5.2 Sequence Diagrams"))
    xml.append(heading3("5.2.1 Sequence of Standardized Assessment Execution & Scoring"))
    xml.append(p(
        "Figure 5.2 illustrates the synchronous and asynchronous messaging sequence during assessment initialization, anti-cheat tracking, "
        "and score normalization."
    ))
    
    seq1_diagram = (
        "Examinee           Frontend SPA            FastAPI Backend         Supabase DB\n"
        "   |                     |                        |                     |\n"
        "   |--- 1. Start Test -->|                        |                     |\n"
        "   |                     |--- 2. GET /questions ->|                     |\n"
        "   |                     |                        |--- 3. Query Active >|\n"
        "   |                     |                        |<-- 4. 10 Questions -|\n"
        "   |                     |<-- 5. Render Items ----|                     |\n"
        "   |=== 6. Answer Items =|                        |                     |\n"
        "   |    (Track Blur)     |                        |                     |\n"
        "   |--- 7. Submit Test ->|                        |                     |\n"
        "   |                     |--- 8. POST /submit --->|                     |\n"
        "   |                     |   (Answers + BlurCount)|                     |\n"
        "   |                     |                        |=== 9. Gaussian Calc |\n"
        "   |                     |                        |--- 10. Save Result >|\n"
        "   |                     |                        |<-- 11. Saved OK ----|\n"
        "   |                     |<-- 12. Score & Percent-|                     |\n"
        "   |<-- 13. Render Ruler-|                        |                     |"
    )
    xml.append(p("Figure 5.2 Sequence Diagram: Assessment Execution and Scoring", bold=True, align="center", space_before=100, space_after=60))
    xml.append(p(seq1_diagram, font_family="Courier New", font_size=16, space_after=140))

    xml.append(heading3("5.2.2 Sequence of Groq LPU AI Synthesis with Resilient Fallback"))
    xml.append(p(
        "Figure 5.3 shows the execution loop for AI cognitive synthesis. If Groq LPU encounters network timeouts, rate limit quotas, "
        "or service exceptions, the system automatically intercepts the fault and triggers the local deterministic psychometric engine."
    ))
    
    seq2_diagram = (
        "Frontend SPA            FastAPI Backend             Groq LPU Cloud          Local Fallback\n"
        "     |                         |                           |                       |\n"
        "     |--- 1. POST /synthesize >|                           |                       |\n"
        "     |    (4D Score Vector)    |--- 2. ChatCompletion ---->|                       |\n"
        "     |                         |    (Qwen 2.5 32B Prompt)  |                       |\n"
        "     |                         |                           |                       |\n"
        "     |                         |  [Case A: Success < 2s]   |                       |\n"
        "     |                         |<-- 3a. Return JSON Profile|                       |\n"
        "     |                         |                           |                       |\n"
        "     |                         |  [Case B: Error / Timeout]|                       |\n"
        "     |                         |--X 3b. 404 / 429 / Timeout                        |\n"
        "     |                         |--------------------------------- 4. Run Fallback >|\n"
        "     |                         |<-------------------------------- 5. Local Profile-|\n"
        "     |<-- 6. Archetype JSON ---|                                                   |"
    )
    xml.append(p("Figure 5.3 Sequence Diagram: Groq LPU AI Synthesis with Fallback", bold=True, align="center", space_before=100, space_after=60))
    xml.append(p(seq2_diagram, font_family="Courier New", font_size=16, space_after=140))

    xml.append(heading2("5.3 Database Relational Schema & Data Dictionaries"))
    xml.append(p(
        "The persistence layer is modeled in Supabase PostgreSQL across four core relational tables: profiles, questions, "
        "assessment_results, and cognitive_gym_sessions. Tables 5.1 through 5.4 present the complete data dictionary specifications."
    ))
    
    # Table 5.1
    t51_headers = ["Column Name", "Data Type", "Constraints", "Description"]
    t51_rows = [
        ["id", "UUID", "PRIMARY KEY, FK (auth.users.id)", "Unique user identity managed by Supabase Auth engine."],
        ["email", "VARCHAR(255)", "NOT NULL, UNIQUE", "Examinee email address used for credential authentication."],
        ["display_name", "VARCHAR(100)", "NULLABLE", "User chosen pseudonym or academic name displayed on report cards."],
        ["role", "VARCHAR(20)", "NOT NULL, DEFAULT 'user'", "Role-Based Access Control attribute ('user' or 'admin')."],
        ["created_at", "TIMESTAMPTZ", "DEFAULT NOW()", "Timestamp indicating user profile registration date."]
    ]
    xml.append(p("Table 5.1 Data Dictionary: Entity profiles (Supabase PostgreSQL)", bold=True, space_before=100, space_after=60))
    xml.append(table(t51_headers, t51_rows, col_widths=[1800, 1600, 2200, 3000]))

    # Table 5.2
    t52_headers = ["Column Name", "Data Type", "Constraints", "Description"]
    t52_rows = [
        ["id", "SERIAL", "PRIMARY KEY", "Auto-incrementing integer identifying each calibrated test item."],
        ["category", "VARCHAR(20)", "NOT NULL, CHECK (IQ,EQ,SQ,AQ)", "Psychometric assessment dimension to which the question belongs."],
        ["question_text", "TEXT", "NOT NULL", "The psychometric item prompt, scenario, or mathematical problem."],
        ["options", "JSONB", "NOT NULL", "Array of multiple-choice strings presented to examinees."],
        ["correct_option", "INTEGER", "NOT NULL", "Zero-indexed integer pointing to the validated correct answer key."],
        ["difficulty", "VARCHAR(20)", "DEFAULT 'medium'", "Psychometric calibration rating ('easy', 'medium', 'hard')."],
        ["created_at", "TIMESTAMPTZ", "DEFAULT NOW()", "Timestamp recording question bank ingestion date."]
    ]
    xml.append(p("Table 5.2 Data Dictionary: Entity questions", bold=True, space_before=100, space_after=60))
    xml.append(table(t52_headers, t52_rows, col_widths=[1600, 1600, 2400, 3000]))

    # Table 5.3
    t53_headers = ["Column Name", "Data Type", "Constraints", "Description"]
    t53_rows = [
        ["id", "SERIAL", "PRIMARY KEY", "Unique auto-incrementing identifier for each completed evaluation."],
        ["user_id", "UUID", "FK (profiles.id), ON DELETE CASCADE", "Foreign key linking assessment to the authenticated examinee profile."],
        ["category", "VARCHAR(20)", "NOT NULL", "Assessment dimension evaluated in this evaluation session."],
        ["raw_score", "INTEGER", "NOT NULL", "Raw count of correct answers (0 through 10)."],
        ["standardized_score", "FLOAT", "NOT NULL", "Gaussian normalized score calibrated to mean 100, std dev 15."],
        ["percentile", "FLOAT", "NOT NULL", "Calculated cumulative distribution percentile (0.1% to 99.9%)."],
        ["tab_switches", "INTEGER", "DEFAULT 0", "Count of anti-cheat Page Visibility blur infractions recorded."],
        ["completed_at", "TIMESTAMPTZ", "DEFAULT NOW()", "Timestamp marking final test submission and scoring."]
    ]
    xml.append(p("Table 5.3 Data Dictionary: Entity assessment_results", bold=True, space_before=100, space_after=60))
    xml.append(table(t53_headers, t53_rows, col_widths=[1800, 1600, 2400, 2800]))

    # Table 5.4
    t54_headers = ["Column Name", "Data Type", "Constraints", "Description"]
    t54_rows = [
        ["id", "SERIAL", "PRIMARY KEY", "Identifier for each Cognitive Gym speed drill session."],
        ["user_id", "UUID", "FK (profiles.id), NULLABLE", "User profile ID (or NULL for guest/anonymous drill players)."],
        ["accuracy_score", "INTEGER", "NOT NULL", "Number of arithmetic duels answered correctly out of 10."],
        ["elapsed_seconds", "FLOAT", "NOT NULL", "Total time in seconds elapsed to complete the speed challenge."],
        ["completed_at", "TIMESTAMPTZ", "DEFAULT NOW()", "Timestamp marking completion of the speed duel session."]
    ]
    xml.append(p("Table 5.4 Data Dictionary: Entity cognitive_gym_sessions", bold=True, space_before=100, space_after=60))
    xml.append(table(t54_headers, t54_rows, col_widths=[1800, 1600, 2400, 2800]))

    xml.append(heading2("5.4 Mathematical Models & Algorithm Design"))
    xml.append(heading3("Algorithm 1: Gaussian Normalization & Percentile Derivation"))
    xml.append(p(
        "Standardized psychometric instruments mandate that raw scores be normalized against an empirical Gaussian distribution. "
        "Let X represent the raw score (where 0 <= X <= N, with N=10), mu_raw be the empirical mean of the uncalibrated test population, "
        "and sigma_raw be the sample standard deviation. The standardized score Z is formulated as:\n"
        "Z = (X - mu_raw) / sigma_raw\n\n"
        "To map this standardized z-score onto the clinical IQ standard (with target mean mu_standard = 100 and standard deviation sigma_standard = 15):\n"
        "Standardized_Score = mu_standard + (Z * sigma_standard)\n\n"
        "The cumulative percentile rank P(X) is derived using the cumulative distribution function (CDF) of the standard normal distribution:\n"
        "P(X) = Phi(Z) * 100 = [ 0.5 * (1 + erf( Z / sqrt(2) )) ] * 100\n"
        "where erf(u) denotes the Gauss error function. Table 5.5 outlines the formal classification bands."
    ))
    
    # Table 5.5
    t55_headers = ["Standardized Score Range", "Classification Band", "Theoretical Population Distribution", "Percentile Range"]
    t55_rows = [
        ["130 and Above", "Very Superior / Exceptional", "2.2% of General Population", "98th to 99.9th Percentile"],
        ["120 - 129", "Superior / High Ability", "6.7% of General Population", "91st to 97th Percentile"],
        ["110 - 119", "High Average", "16.1% of General Population", "75th to 90th Percentile"],
        ["90 - 109", "Average / Normal Range", "50.0% of General Population", "25th to 74th Percentile"],
        ["80 - 89", "Low Average", "16.1% of General Population", "9th to 24th Percentile"],
        ["70 - 79", "Borderline / Developmental", "6.7% of General Population", "3rd to 8th Percentile"],
        ["Below 70", "Extremely Low / Remedial", "2.2% of General Population", "< 3rd Percentile"]
    ]
    xml.append(p("Table 5.5 Gaussian standard score classification bands", bold=True, space_before=100, space_after=60))
    xml.append(table(t55_headers, t55_rows, col_widths=[2000, 2600, 2400, 1600]))

    xml.append(heading3("Algorithm 2: Resilient Groq LPU Psychometric Synthesis"))
    xml.append(p(
        "Algorithm 2 defines the fault-tolerant AI synthesis pipeline. To eliminate external dependency failures, the system wraps "
        "Groq API calls in strict try-catch handlers with automated deterministic fallback:\n\n"
        "1. Construct system prompt enforcing JSON schema: { archetype: str, summary: str, strengths: list, blindspots: list }.\n"
        "2. Transmit standardized 4D vector { IQ, EQ, SQ, AQ } to Groq client using model 'qwen/qwen3.8-27b' (fallback 'llama-3.3-70b-versatile').\n"
        "3. Await response with a 5.0-second timeout.\n"
        "4. If HTTP 200 and valid JSON: parse and return diagnostic payload.\n"
        "5. If HTTP error (404 model_not_found, 429 rate_limit, 500 server_error) or network timeout:\n"
        "   a. Log exception with stack trace.\n"
        "   b. Invoke generate_deterministic_profile(IQ, EQ, SQ, AQ).\n"
        "   c. Select archetype algorithmically based on vector centroid and quadrant max.\n"
        "   d. Return validated JSON payload with zero client-perceived downtime."
    ))

    xml.append(heading3("Algorithm 3: Anti-Cheat Page Visibility Telemetry"))
    xml.append(p(
        "Algorithm 3 monitors active test session integrity using the HTML5 Page Visibility API:\n\n"
        "1. Upon test component mount, attach event listener: document.addEventListener('visibilitychange', handleVisibilityChange).\n"
        "2. When document.hidden == true (user switches tabs, minimizes window, or opens developer tools):\n"
        "   a. Increment local infraction counter: tab_switches = tab_switches + 1.\n"
        "   b. Record timestamp of blur event.\n"
        "3. When document.hidden == false (user returns to test):\n"
        "   a. Trigger warning toast / banner alerting user that window blur was detected.\n"
        "4. Upon final submission, bundle tab_switches counter into POST payload.\n"
        "5. If tab_switches >= 2: flag assessment record as 'Integrity Suspect' in Supabase."
    ))

    xml.append(heading3("Algorithm 4: Cognitive Gym Speed Math Duel Generator"))
    xml.append(p(
        "Algorithm 4 generates 10 mental arithmetic challenges dynamically across addition, subtraction, multiplication, and integer division:\n\n"
        "1. Initialize challenge list C = [].\n"
        "2. For i from 1 to 10:\n"
        "   a. Select operator op uniformly from { '+', '-', '*', '/' }.\n"
        "   b. If op == '+': generate a in [10, 99], b in [10, 99], answer = a + b, explanation = f'{a} + {b} = {answer}'.\n"
        "   c. If op == '-': generate a in [20, 99], b in [10, a], answer = a - b, explanation = f'{a} - {b} = {answer}'.\n"
        "   d. If op == '*': generate a in [6, 19], b in [3, 12], answer = a * b, explanation = f'Breakdown: {a} * {b} = {answer}'.\n"
        "   e. If op == '/': generate b in [3, 12], quotient in [4, 15], a = b * quotient, answer = quotient, explanation = f'{a} / {b} = {answer}'.\n"
        "   f. Append { problem: f'{a} {op} {b}', correct_answer: answer, explanation: explanation } to C.\n"
        "3. Return challenge list C to client."
    ))
    xml.append(page_break())

    return "".join(xml)
