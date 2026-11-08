# report_content_ch1_ch3.py - Chapters 1, 2, and 3 for ENIGMA Report
from xml_helpers import p, heading1, heading2, heading3, heading4, bullet_item, table, page_break

def get_ch1_ch3_xml():
    xml = []

    # =========================================================================
    # CHAPTER 1: INTRODUCTION
    # =========================================================================
    xml.append(heading1("CHAPTER 1: INTRODUCTION"))
    xml.append(heading2("1.1 Project Description"))
    
    xml.append(heading3("1.1.1 Background of Psychometric Testing"))
    xml.append(p(
        "Psychometrics is the scientific discipline dedicated to the construction, calibration, and behavioral validation of "
        "measurement instruments designed to quantify intangible psychological constructs. Historically originating from the pioneering "
        "investigations of Francis Galton, Alfred Binet, and Charles Spearman in the late nineteenth and early twentieth centuries, "
        "psychometric evaluation initially concentrated almost exclusively on the quantification of general cognitive ability, known "
        "in classical psychological literature as the 'g-factor' (General Intelligence). Instruments such as the Stanford-Binet Intelligence "
        "Scale and David Wechsler's adult intelligence scales established empirical standards by standardizing cognitive performance against "
        "a theoretical Gaussian normal distribution with a calibrated mean (mu = 100) and standard deviation (sigma = 15)."
    ))
    xml.append(p(
        "As organizational psychology and neuroscience matured across the twentieth century, clinical researchers recognized that "
        "unidimensional cognitive ability represents only a singular facet of complex human performance and adaptability. In the 1990s, "
        "Peter Salovey, John Mayer, and Daniel Goleman formulated the construct of Emotional Intelligence (EQ), demonstrating that affective "
        "self-regulation, empathetic perspective-taking, and interpersonal attunement exert equal or greater predictive validity over career "
        "longevity and leadership efficacy than raw logic alone. Concurrently, existential psychologists led by Viktor Frankl and Danah Zohar "
        "postulated the Spiritual/Existential Quotient (SQ), measuring deep teleological purpose, holistic value alignment, and ethical integrity. "
        "Most recently, Dr. Paul Stoltz introduced the Adversity Quotient (AQ), quantifying how resiliently an individual responds to acute crises, "
        "technological disruption, and ambiguous challenges."
    ))

    xml.append(heading3("1.1.2 Problem Statement & Gaps in Standardized Testing"))
    xml.append(p(
        "Despite decades of empirical psychometric evolution, existing assessment tools available to students, professionals, and academic "
        "institutions suffer from profound structural limitations that divide the industry into two dysfunctional extremes:"
    ))
    xml.append(bullet_item("Proprietary Paywalled Testing Batteries: Certified assessments (such as the WAIS-IV, MSCEIT, or Bar-On EQ-i) are heavily monetized, gated behind expensive institutional licenses, require manual administration by certified clinical psychologists, and provide dense numerical scoring summaries that are incomprehensible to general examinees without costly interpretive debriefs."))
    xml.append(bullet_item("Superficial Internet Quizzes: The open web is dominated by uncalibrated, pop-psychology quizzes lacking construct validity, item reliability, anti-cheat security, or statistical normalization. These quizzes assign arbitrary numbers without reference to empirical population distributions and fail to offer actionable cognitive insights."))
    xml.append(bullet_item("Siloed Unidimensionality: No existing accessible digital platform unifies the four critical pillars of human intellect—IQ, EQ, SQ, and AQ—into a single synchronized matrix capable of analyzing cross-dimensional behavioral trade-offs."))
    xml.append(bullet_item("Absence of Nuanced, Honest AI Synthesis: Traditional reports produce canned, static text templates that flatter examinees rather than providing rigorous, unvarnished diagnostic feedback on cognitive vulnerabilities, blindspots, and developmental pathways."))

    xml.append(heading3("1.1.3 Motivation & Empirical Foundations"))
    xml.append(p(
        "The driving motivation behind the ENIGMA platform is the democratization of enterprise-grade, multidimensional psychometric evaluation. "
        "By fusing modern full-stack web engineering with high-throughput cloud infrastructure and generative Artificial Intelligence, ENIGMA "
        "proves that a publication-grade, statistically sound, 4-dimensional assessment battery can be delivered globally with zero licensing "
        "cost to examinees. The project demonstrates that modern browser APIs (such as Page Visibility for cheat deterrence) combined with "
        "ultra-low latency Language Processing Units (Groq LPU) can synthesize complex psychometric vectors into honest, actionable cognitive "
        "profiles in real time."
    ))

    xml.append(heading3("1.1.4 Objectives of the Project"))
    xml.append(p("The technical and academic objectives of the ENIGMA project are divided into general and specific targets:", italic=True))
    xml.append(p("Main Objective:", bold=True))
    xml.append(p(
        "To architect, implement, calibrate, and deploy a secure, cloud-native, multidimensional psychometric testing platform that evaluates "
        "IQ, EQ, SQ, and AQ through standardized calibrated batteries, applies empirical Gaussian distribution mapping, detects active test-taking "
        "anomalies via anti-cheat telemetry, and synthesizes honest multi-factor cognitive archetypes using Groq-accelerated AI models with a resilient "
        "local psychometric fallback engine."
    ))
    xml.append(p("Specific Objectives:", bold=True))
    xml.append(bullet_item("To construct four calibrated 10-question standardized assessment modules evaluating logical abstraction (IQ), emotional regulation (EQ), existential purpose (SQ), and crisis resilience (AQ)."))
    xml.append(bullet_item("To formulate and code an empirical Gaussian normalization engine adhering to mu=100 and sigma=15, computing exact cumulative percentile ranks and standard error of measurement."))
    xml.append(bullet_item("To engineer an interactive visual 'Score Spectrum Ruler' mapped to normal bell-curve population bands (from Extremely Low to Exceptional) providing intuitive self-location."))
    xml.append(bullet_item("To construct a real-time anti-cheat telemetry hook utilizing the HTML5 Page Visibility API to monitor and record tab-switching infractions during active evaluations."))
    xml.append(bullet_item("To integrate high-speed inference via the Groq LPU executing Qwen 2.5 32B and Llama 3.3 70B models for unvarnished diagnostic synthesis, backed by a deterministic algorithmic fallback."))
    xml.append(bullet_item("To develop a playable 'Cognitive Gym' featuring 10 randomized speed math mental arithmetic duels, immediate timing metrics, and a comprehensive mathematical answer review modal."))
    xml.append(bullet_item("To deploy the full-stack architecture onto production cloud infrastructure: React 18 on Vercel Edge, FastAPI on Render PaaS, and PostgreSQL with Row Level Security on Supabase Cloud."))

    xml.append(heading3("1.1.5 Scope of the Project"))
    xml.append(p("Included within System Scope:", bold=True))
    xml.append(bullet_item("Complete responsive user interface with neon cyber-aesthetic dark mode, interactive progress indicators, and dynamic score distribution visuals."))
    xml.append(bullet_item("Authentication lifecycle management via Supabase Auth (Email/Password registration, session persistence, JWT token distribution, and RBAC profile roles)."))
    xml.append(bullet_item("Complete 4D assessment runner with state persistence across page refreshes, timed responses, and anti-cheat tracking."))
    xml.append(bullet_item("Unified 4D synthesis dashboard featuring radar charts, multi-dimensional archetype labels, percentile mapping, and unvarnished diagnostic feedback."))
    xml.append(bullet_item("Playable Cognitive Gym speed arithmetic arena with step-by-step mathematical reasoning review."))
    xml.append(bullet_item("Role-Based Access Control (RBAC) Admin console enabling question CRUD operations across IQ, EQ, SQ, and AQ."))
    xml.append(p("Excluded from System Scope:", bold=True))
    xml.append(bullet_item("Native desktop application wrapper (Electron was evaluated and rejected to maintain zero-install web accessibility)."))
    xml.append(bullet_item("Invasive biometric monitoring (webcam facial expression analysis was excluded due to user privacy and ethical data governance standards)."))
    xml.append(bullet_item("Direct high-stakes clinical psychodiagnosis (ENIGMA is an educational and developmental self-discovery platform, not a certified clinical psychiatric diagnostic tool)."))

    xml.append(heading3("1.1.6 Limitations"))
    xml.append(p(
        "As an academic research and engineering platform, ENIGMA operates under defined operational boundaries. The system relies on "
        "the free and standard developer tiers of Supabase PostgreSQL, Render PaaS, and Groq LPU. Free-tier cloud infrastructure introduces "
        "occasional cold-start latencies on Render if idle, and Groq API calls are subject to rate-limiting thresholds (which ENIGMA mitigates "
        "via its deterministic local psychometric fallback). Speech-to-text input is subject to browser Web Speech API availability. Furthermore, "
        "while the anti-cheat telemetry reliably tracks window and tab blur events, it cannot prevent physical secondary device utilization."
    ))

    xml.append(heading3("1.1.7 Methodology"))
    xml.append(p(
        "The project was executed strictly adhering to the Incremental Software Development Life Cycle (SDLC). The architecture was decomposed "
        "into discrete, functional increments, with each sprint delivering an independently testable, hardened module. Table 1.1 delineates "
        "the development progression across all seven milestones."
    ))
    
    # Table 1.1
    t1_headers = ["Increment", "Milestone & Focus Area", "Key Technical Deliverables", "Verification Outcome"]
    t1_rows = [
        ["Increment 1", "Core Infrastructure & Schema Design", "FastAPI backend boilerplate, Supabase PostgreSQL schema, Dockerfile setup", "Backend starts locally; database tables migrate successfully."],
        ["Increment 2", "Authentication & RBAC Security", "Supabase Auth integration, JWT Bearer verification guard, profiles table RLS", "Users register and sign in; routes strictly guarded by JWT."],
        ["Increment 3", "Psychometric Test Engine & Anti-Cheat", "4D assessment runner, Page Visibility API hook, anti-cheat tab-blur counter", "10-question tests run smoothly; tab-switching triggers infractions."],
        ["Increment 4", "Gaussian Normalization & Spectrum Ruler", "Statistical scoring algorithm (mu=100, sigma=15), Percentile formula, React ruler", "Scores map accurately onto Gaussian bell-curve bands."],
        ["Increment 5", "Groq LPU Synthesis & AI Fallback", "Groq API client integration, Qwen 2.5 32B prompt engineering, deterministic fallback", "Sub-2s psychometric synthesis; fallback operates when offline."],
        ["Increment 6", "Cognitive Gym & Answer Review", "Mental arithmetic speed generator, real-time timer, solution modal", "Examinees duel speed math; review shows full math proofs."],
        ["Increment 7", "Cloud Production Deployment", "Vercel edge deployment, Render PaaS backend setup, psycopg2 pooling fix", "System live on production URLs; continuous integration verified."]
    ]
    xml.append(p("Table 1.1 Development increments of Enigma", bold=True, space_before=100, space_after=60))
    xml.append(table(t1_headers, t1_rows, col_widths=[1100, 2400, 3100, 2000]))

    xml.append(heading3("1.1.8 Organization of the Report"))
    xml.append(p(
        "The remainder of this dissertation is organized as follows: Chapter 2 presents a rigorous literature survey, feasibility analysis, "
        "and technology stack review. Chapter 3 provides the formal Software Requirements Specification (SRS) detailing functional and non-functional "
        "requirements. Chapter 4 delineates high-level system architecture, context data flows, and cloud topology. Chapter 5 details low-level "
        "design, database schemas, sequence diagrams, and formal psychometric algorithms. Chapter 6 documents implementation, screenshots, and "
        "production source code listings. Chapter 7 outlines comprehensive software testing and verification matrices. Chapter 8 concludes the report, "
        "and Chapter 9 outlines future research trajectories, followed by Bibliography and the Operational User Manual."
    ))
    xml.append(page_break())

    # =========================================================================
    # CHAPTER 2: LITERATURE SURVEY
    # =========================================================================
    xml.append(heading1("CHAPTER 2: LITERATURE SURVEY"))
    xml.append(heading2("2.1 Existing and Proposed System"))
    
    xml.append(heading3("2.1.1 Classical Psychometric Systems"))
    xml.append(p(
        "Modern psychometric measurement rests upon established clinical and occupational testing frameworks. However, an analysis of the "
        "current technological landscape reveals substantial structural shortcomings across existing platforms:"
    ))
    xml.append(p(
        "1. Classical Clinical Batteries (WAIS-IV, Stanford-Binet, MSCEIT): These tests represent gold-standard psychometric instruments. "
        "However, they are commercially restricted, physically proctored, paper-or-tablet bound, and prohibitively expensive. Administration "
        "requires a licensed psychologist, making population-level or student self-assessment impossible.",
        italic=True
    ))
    xml.append(p(
        "2. Corporate Personality and Aptitude Platforms (Hogan, SHL, Predictive Index): While digitized, these enterprise systems focus exclusively "
        "on hiring screening, require corporate sponsorship, and withhold granular diagnostic data from the candidate, providing only generic summary classifications.",
        italic=True
    ))
    xml.append(p(
        "3. Open Web Quizzes (123test, Psychology Today Quizzes, Buzzfeed Aptitude): These public tests are free but lack scientific normalization, "
        "rely on uncalibrated raw percentages, feature no anti-cheat deterrence, and lack holistic cross-dimensional cognitive synthesis.",
        italic=True
    ))

    xml.append(heading3("2.1.2 Proposed System: ENIGMA"))
    xml.append(p(
        "The proposed ENIGMA platform bridges the divide between clinical scientific rigor and democratized cloud-native accessibility. "
        "ENIGMA standardizes human capability across four interdependent dimensions: Cognitive Logic (IQ), Emotional Regulation (EQ), "
        "Existential Resilience (SQ), and Crisis Adaptability (AQ). It applies rigorous Gaussian distribution statistics (mean=100, standard deviation=15) "
        "to compute standardized scores, standard error of measurement (SEM), and exact population percentiles. It secures integrity through real-time "
        "Page Visibility anti-cheat telemetry, delivers deep qualitative behavioral synthesis via Groq-accelerated LLMs, and reinforces mental agility "
        "through an interactive Cognitive Gym."
    ))

    # Table 2.1
    t2_headers = ["Evaluation Metric", "Clinical Batteries (WAIS/MSCEIT)", "Corporate Screening (SHL/Hogan)", "Free Web Quizzes", "Proposed System (ENIGMA)"]
    t2_rows = [
        ["Cost to Examinee", "High (\\$300 - \\$1,500)", "High (Enterprise Billing)", "Free (Ad-Supported)", "100% Free & Open-Access"],
        ["Dimensions Evaluated", "Single (IQ or EQ only)", "Job-Specific Aptitude", "Unidimensional Pop Quizzes", "Holistic 4D (IQ + EQ + SQ + AQ)"],
        ["Psychometric Normalization", "Gaussian Standard (\\mu=100, \\sigma=15)", "Percentile Norming", "None (Arbitrary Raw Points)", "Standard Gaussian (\\mu=100, \\sigma=15)"],
        ["Visual Spectrum Ruler", "Static Percentile Tables", "Corporate Radar Sliders", "None / Basic Bar Graph", "Interactive Dynamic Spectrum Ruler"],
        ["AI Diagnostic Synthesis", "Manual Human Clinician", "Pre-written Templated Text", "Generic Canned Responses", "Real-Time Groq LLM Synthesis"],
        ["Anti-Cheat Monitoring", "In-Person Human Proctor", "Restricted Browser Lock", "None", "HTML5 Page Visibility Telemetry"],
        ["Cognitive Gym & Review", "None (Static Test)", "None", "None", "Interactive Speed Math Duels + Review"],
        ["Deployment Architecture", "Desktop / Physical Binder", "Proprietary Enterprise Cloud", "Traditional Shared Web Host", "Vercel Edge + Render + Supabase"]
    ]
    xml.append(p("Table 2.1 Comparison of existing psychometric systems with Enigma", bold=True, space_before=100, space_after=60))
    xml.append(table(t2_headers, t2_rows, col_widths=[1400, 1800, 1800, 1600, 2000]))

    xml.append(heading2("2.2 Feasibility Study"))
    xml.append(p(
        "Prior to engineering the system, an exhaustive feasibility investigation was performed evaluating technical, economic, "
        "operational, schedule, and legal dimensions."
    ))
    xml.append(heading3("2.2.1 Technical Feasibility"))
    xml.append(p(
        "The chosen technological stack is fully production-ready, open-source, and extensively documented. React 18 with Vite guarantees "
        "lightning-fast client-side hydration, hot module replacement, and optimal DOM manipulation. FastAPI delivers asynchronous, non-blocking "
        "request handling in Python with automatic OpenAPI generation. Supabase provides a fully managed PostgreSQL database equipped with "
        "connection poolers and Row Level Security. Groq Cloud LPU provides ultra-fast inference with time-to-first-token under 200 milliseconds. "
        "The project is technically highly feasible."
    ))

    xml.append(heading3("2.2.2 Economic Feasibility"))
    xml.append(p(
        "The economic footprint of ENIGMA is virtually zero during research and development. The architecture strategically leverages the generous "
        "free tiers of cloud providers: Vercel (free global edge deployment), Render (free web service container hosting), Supabase (free managed "
        "PostgreSQL database and auth engine), and Groq Cloud (free developer tier with high token throughput). No expensive proprietary software "
        "licenses or dedicated hardware servers were required, establishing outstanding economic feasibility."
    ))

    xml.append(heading3("2.2.3 Operational Feasibility"))
    xml.append(p(
        "Operationally, ENIGMA requires no client installation; examinees access the platform directly from any standard modern web browser "
        "(Google Chrome, Mozilla Firefox, Microsoft Edge, Safari) across desktop and mobile devices. The user interface adheres to contemporary "
        "human-computer interaction (HCI) standards, featuring accessible contrast ratios, intuitive card layouts, and self-explanatory "
        "instructions, ensuring that non-technical examinees can navigate tests effortlessly."
    ))

    xml.append(heading3("2.2.4 Schedule Feasibility"))
    xml.append(p(
        "The project timeline was planned across the 5th semester of the BCA program, spanning 16 academic weeks. Adopting the Incremental SDLC "
        "allowed rapid iteration across 7 planned milestones. Each milestone was completed, verified, and integrated within its allotted timebox, "
        "ensuring that the project met all submission deadlines comfortably."
    ))

    xml.append(heading3("2.2.5 Legal, Ethical and Privacy Considerations"))
    xml.append(p(
        "Psychometric evaluation involves sensitive psychological data. ENIGMA complies with data privacy principles: passwords are never stored "
        "in plaintext (Supabase Auth uses bcrypt hashing), database tables enforce Row Level Security (RLS) preventing users from reading each other's "
        "test scores, API secret keys are securely managed via environment variables and excluded from version control, and no personally identifiable "
        "biometric data (such as video feeds) is captured."
    ))

    xml.append(heading2("2.3 Tools and Technologies Used"))
    xml.append(p(
        "Table 2.2 provides a comprehensive overview of the full-stack technology ecosystem powering the ENIGMA platform."
    ))
    
    # Table 2.2
    t22_headers = ["Layer / Architectural Tier", "Technology Selected", "Version", "Primary Architectural Role"]
    t22_rows = [
        ["Frontend UI Framework", "React.js", "18.3.1", "Component-driven client interface and reactive state tree"],
        ["Build Tool & Dev Server", "Vite", "5.4.2", "Ultra-fast ESM bundler, asset optimization, and live HMR"],
        ["CSS & Styling", "Tailwind CSS", "3.4.1", "Utility-first responsive design, custom glassmorphism & cyber-theme"],
        ["Icons & Visual Assets", "Lucide React", "0.344.0", "Accessible, lightweight SVG vector iconography"],
        ["Charts & Visuals", "Chart.js & React-Chartjs-2", "4.4.2", "Dynamic multi-axis radar charts and performance distributions"],
        ["Celebration Visuals", "Canvas Confetti", "1.9.2", "High-performance canvas particle rendering upon test completion"],
        ["Backend REST Framework", "FastAPI (Python)", "0.110.0+", "Asynchronous RESTful microservice API and request validation"],
        ["ASGI Server", "Uvicorn", "0.28.0+", "High-throughput asynchronous web server worker for Python"],
        ["ORM & Database Layer", "SQLAlchemy", "2.0.28+", "Enterprise relational mapping with PostgreSQL connection pooling"],
        ["Database Driver", "psycopg2-binary", "2.9.9+", "High-performance C-optimized PostgreSQL database adapter"],
        ["Database & Auth Provider", "Supabase", "Cloud 2026", "Cloud-managed PostgreSQL 15, Auth engine & Row Level Security"],
        ["AI Inference Engine", "Groq LPU (Qwen 2.5 32B)", "Groq SDK 0.18+", "Ultra-low-latency generative psychometric synthesis"],
        ["Frontend Edge Cloud", "Vercel", "Production", "Global edge CDN deployment with automated GitHub CI/CD"],
        ["Backend Container Cloud", "Render", "Production", "Dockerized Python runtime with health monitoring and SSL termination"]
    ]
    xml.append(p("Table 2.2 Technologies and cloud infrastructure stack", bold=True, space_before=100, space_after=60))
    xml.append(table(t22_headers, t22_rows, col_widths=[2000, 2200, 1400, 3000]))

    xml.append(heading2("2.4 Hardware and Software Requirements"))
    xml.append(heading3("2.4.1 Hardware Requirements"))
    xml.append(p("Table 2.3 outlines the minimum and recommended hardware specifications for both client examinees and developer workstations."))
    
    # Table 2.3
    t23_headers = ["Component", "Minimum Client Requirement", "Recommended Client Specification", "Developer Workstation Specification"]
    t23_rows = [
        ["Processor (CPU)", "Dual-core 1.8 GHz x86/ARM", "Quad-core 2.4 GHz Intel i5 / AMD Ryzen 5", "6-core 3.2 GHz Intel Core i7 / AMD Ryzen 7"],
        ["Random Access Memory", "2.0 GB RAM", "4.0 GB RAM or higher", "16.0 GB DDR4/DDR5 RAM"],
        ["Storage Space", "200 MB free disk space", "500 MB free disk space", "50 GB free SSD storage"],
        ["Display Resolution", "1280 x 720 (HD)", "1920 x 1080 (Full HD)", "1920 x 1080 or 4K dual display"],
        ["Network Connectivity", "512 Kbps broadband", "2.0 Mbps stable broadband", "10.0 Mbps high-speed internet"]
    ]
    xml.append(p("Table 2.3 Hardware requirements", bold=True, space_before=100, space_after=60))
    xml.append(table(t23_headers, t23_rows, col_widths=[2000, 2200, 2200, 2200]))

    xml.append(heading3("2.4.2 Software Requirements"))
    xml.append(p("Table 2.4 details the software prerequisites across client, runtime, and development environments."))
    
    # Table 2.4
    t24_headers = ["Software Entity", "Supported Version / Specification", "Purpose in Ecosystem"]
    t24_rows = [
        ["Operating System (Client)", "Windows 10/11, macOS 12+, Ubuntu 22.04+, Android 11+, iOS 15+", "Host operating system running client web browser"],
        ["Web Browser", "Google Chrome 110+, Edge 110+, Firefox 115+, Safari 16+", "Execution environment for React SPA and Page Visibility API"],
        ["Python Runtime", "Python 3.10.x to 3.12.x", "Runtime environment for FastAPI backend microservices"],
        ["Node.js & npm", "Node.js v18.x or v20.x LTS, npm v9+", "Build toolchain and package manager for React/Vite"],
        ["PostgreSQL Engine", "PostgreSQL 15.x (Supabase Cloud)", "Relational storage engine for profiles, tests, and questions"],
        ["Version Control", "Git 2.40+ & GitHub", "Distributed source code repository and Vercel/Render CI/CD hooks"],
        ["Development IDE", "Visual Studio Code 1.88+", "Primary code editing, debugging, and terminal environment"]
    ]
    xml.append(p("Table 2.4 Software and runtime requirements", bold=True, space_before=100, space_after=60))
    xml.append(table(t24_headers, t24_rows, col_widths=[2400, 2800, 3400]))

    xml.append(heading2("2.5 Review of Related Approaches & Psychometric Theory"))
    xml.append(p(
        "To ground ENIGMA firmly in scientific methodology, four core psychological models were investigated and integrated into its scoring architecture:"
    ))
    xml.append(bullet_item("Cattell-Horn-Carroll (CHC) Theory: Formulates human intelligence into broad cognitive abilities, distinguishing Fluid Intelligence (Gf) — novel logical abstraction and matrix pattern reasoning — from Crystallized Intelligence (Gc). ENIGMA's IQ battery tests Gf via non-verbal and deductive syllogisms."))
    xml.append(bullet_item("Mayer-Salovey-Caruso Emotional Intelligence Model: Emphasizes four branches: perceiving emotions, using emotions to facilitate thought, understanding emotional language, and managing emotions. ENIGMA's EQ module simulates complex workplace social friction."))
    xml.append(bullet_item("Zohar-Marshall Spiritual Quotient Model: Measures existential reflection, value-congruent decision-making, and ethical consistency under high-stakes dilemmas."))
    xml.append(bullet_item("Stoltz Adversity Response Model: Formulates the CORE framework (Control, Ownership, Reach, Endurance), which ENIGMA translates into crisis management assessment scenarios."))
    xml.append(page_break())

    # =========================================================================
    # CHAPTER 3: SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
    # =========================================================================
    xml.append(heading1("CHAPTER 3: SOFTWARE REQUIREMENTS SPECIFICATION"))
    xml.append(heading2("3.1 User Classes and Characteristics"))
    xml.append(p("Table 3.1 outlines the primary user classes interacting with the ENIGMA platform and their operational privileges."))
    
    # Table 3.1
    t31_headers = ["User Class", "Description and Target Persona", "Access Privileges in System"]
    t31_rows = [
        ["Guest / Anonymous Examinee", "Public web visitors seeking rapid cognitive self-assessment without persistent storage.", "Can take 4D assessments, view real-time score ruler, play Cognitive Gym; results stored in browser localStorage only."],
        ["Registered Examinee (User)", "Authenticated students and professionals maintaining longitudinal assessment records.", "Full access to 4D battery, persistent cloud synchronization to Supabase, unified multi-dimensional synthesis, full history."],
        ["System Administrator (Admin)", "Institutional proctors and psychometricians managing question banks and monitoring telemetry.", "All Examinee privileges PLUS full access to Admin Question CRUD Console, test item editing, and system integrity logs."]
    ]
    xml.append(p("Table 3.1 User classes and role privileges", bold=True, space_before=100, space_after=60))
    xml.append(table(t31_headers, t31_rows, col_widths=[2200, 3200, 3200]))

    xml.append(heading2("3.2 Functional Requirements"))
    xml.append(p("Table 3.2 enumerates the twenty formal functional requirements (FR-01 through FR-20) governing system behavior."))
    
    # Table 3.2
    t32_headers = ["Req ID", "Functional Requirement Description", "Priority", "Target Module"]
    t32_rows = [
        ["FR-01", "The system shall allow new users to register securely using email and password, creating an authenticated Supabase identity.", "High", "Auth Service"],
        ["FR-02", "The system shall automatically create an associated profile entry in public.profiles with default role 'user' upon registration.", "High", "Database Trigger"],
        ["FR-03", "The system shall allow registered users to authenticate and receive a cryptographically signed JWT bearer token.", "High", "Auth Service"],
        ["FR-04", "The system shall provide an interactive landing dashboard showcasing all four assessment dimensions (IQ, EQ, SQ, AQ) with live completion statuses.", "High", "Landing Module"],
        ["FR-05", "The system shall serve 10 calibrated multiple-choice questions for each active dimension, enforcing single-choice selection per item.", "High", "Test Engine"],
        ["FR-06", "The system shall maintain an active response timer and track elapsed seconds per assessment item.", "Medium", "Test Engine"],
        ["FR-07", "The system shall implement an anti-cheat listener monitoring document.visibilitychange and record tab-switching blur events.", "High", "Anti-Cheat Hook"],
        ["FR-08", "The system shall display prominent warning banners whenever anti-cheat integrity violations exceed zero.", "Medium", "Test Engine"],
        ["FR-09", "The system shall compute raw scores upon test submission, cross-referencing user answers against database answer keys.", "High", "Scoring Engine"],
        ["FR-10", "The system shall normalize raw scores into a Gaussian distribution standard with mean mu=100 and standard deviation sigma=15.", "High", "Psychometrics"],
        ["FR-11", "The system shall derive exact population percentile ranks based on the Gaussian cumulative distribution function Phi(z).", "High", "Psychometrics"],
        ["FR-12", "The system shall render an interactive 'Score Spectrum Ruler' positioning the user's score relative to population standard bands.", "High", "Results View"],
        ["FR-13", "The system shall transmit completed 4D vector payloads to the Groq LPU endpoint for unvarnished psychometric synthesis.", "High", "AI Service"],
        ["FR-14", "The system shall parse structured JSON responses from Groq containing archetypes, core strengths, and critical blindspots.", "High", "AI Service"],
        ["FR-15", "The system shall execute a deterministic local psychometric fallback if the Groq AI service encounters timeouts or rate limits.", "High", "Fallback Engine"],
        ["FR-16", "The system shall generate 10 randomized speed math mental arithmetic questions in the Cognitive Gym module.", "Medium", "Cognitive Gym"],
        ["FR-17", "The system shall track Cognitive Gym elapsed completion time and accuracy score in real time.", "Medium", "Cognitive Gym"],
        ["FR-18", "The system shall provide an interactive Solution Review Modal detailing step-by-step mathematical reasoning for all 10 gym problems.", "High", "Cognitive Gym"],
        ["FR-19", "The system shall enforce RBAC authorization on administrative endpoints, restricting access to users with role='admin'.", "High", "Admin Security"],
        ["FR-20", "The system shall provide administrators with complete CRUD operations (Create, Read, Update, Delete) over the question bank.", "High", "Admin Console"]
    ]
    xml.append(p("Table 3.2 Functional requirements specification (FR-01 to FR-20)", bold=True, space_before=100, space_after=60))
    xml.append(table(t32_headers, t32_rows, col_widths=[900, 4700, 1000, 2000]))

    xml.append(heading2("3.3 Non-Functional Requirements"))
    xml.append(p("Table 3.3 specifies the ten non-functional requirements (NFR-01 through NFR-10) governing quality and security attributes."))
    
    # Table 3.3
    t33_headers = ["NFR ID", "Category", "Non-Functional Requirement Specification", "Verification Standard"]
    t33_rows = [
        ["NFR-01", "Latency & Performance", "Backend REST endpoints shall respond within 200 milliseconds under normal network conditions.", "Automated API benchmarks"],
        ["NFR-02", "AI Inference Speed", "Groq LPU cognitive synthesis shall return complete diagnostic profiles within 2.5 seconds.", "Live Groq inference tests"],
        ["NFR-03", "Availability & Uptime", "The platform shall maintain 99.5% uptime across Vercel, Render, and Supabase cloud tiers.", "Cloud uptime monitors"],
        ["NFR-04", "Data Security", "All passwords shall be hashed via bcrypt; database access shall strictly enforce Row Level Security.", "Security audit & RLS tests"],
        ["NFR-05", "Connection Pooling", "FastAPI shall maintain a robust PostgreSQL connection pool to prevent socket exhaustion.", "Render load test verified"],
        ["NFR-06", "Responsive Design", "The interface shall adapt fluidly across viewports from 320px mobile screens to 4K desktop displays.", "Chrome DevTools emulator"],
        ["NFR-07", "Zero Data Loss", "Assessment progress and active question selections shall persist in localStorage across unexpected page reloads.", "Browser refresh test"],
        ["NFR-08", "Accessibility (a11y)", "All color contrast ratios across dark mode themes shall meet WCAG 2.1 AA accessibility guidelines.", "Lighthouse accessibility audit"],
        ["NFR-09", "Graceful Degradation", "The system shall function fully using local psychometric algorithms if external cloud AI is unreachable.", "Simulated API outage test"],
        ["NFR-10", "Maintainability", "Codebase shall adhere to modular separation of concerns with TypeScript/Pydantic schemas.", "ESLint & Flake8 linting"]
    ]
    xml.append(p("Table 3.3 Non-functional requirements specification (NFR-01 to NFR-10)", bold=True, space_before=100, space_after=60))
    xml.append(table(t33_headers, t33_rows, col_widths=[1000, 1800, 4200, 1600]))

    xml.append(heading2("3.4 Business Rules"))
    xml.append(p("The following fundamental business rules govern psychometric calculations and system data integrity:", bold=True))
    xml.append(bullet_item("BR-01 (Gaussian Normalization Standard): All standardized assessment scores must be calibrated against a theoretical population distribution with mean mu=100 and standard deviation sigma=15. Raw scores are mapped monotonically."))
    xml.append(bullet_item("BR-02 (Percentile Floor and Ceiling): Calculated percentiles must never fall below 0.1% or exceed 99.9%, reflecting standard statistical truncation of extreme tail distributions."))
    xml.append(bullet_item("BR-03 (Anti-Cheat Integrity Flagging): Any assessment session recording two or more tab-switch blur events must flag the resulting score record as 'Integrity Compromised'."))
    xml.append(bullet_item("BR-04 (Role-Based Access Enforcement): Administrative question creation and deletion privileges are strictly restricted to identities possessing 'role': 'admin' in public.profiles."))
    xml.append(bullet_item("BR-05 (Unified Matrix Prerequisite): An examinee must complete at least three of the four assessment modules to unlock the full Unified 4D Archetype Synthesis."))
    xml.append(bullet_item("BR-06 (Deterministic Fallback Guarantee): An examinee must never receive an error screen due to external AI provider outages; the system must seamlessly fall back to local deterministic psychometric synthesis."))

    xml.append(heading2("3.5 Use-Case Narratives"))
    xml.append(heading3("Use Case UC-01: Take Standardized 4D Assessment"))
    xml.append(p("Primary Actor: Examinee (Student / General Public)"))
    xml.append(p("Preconditions: User navigates to the assessment landing page."))
    xml.append(p("Main Success Scenario:\n"
                 "1. Examinee selects a test module (e.g., Cognitive Logic IQ).\n"
                 "2. System initializes the 10-question battery, starts response timer, and attaches Page Visibility anti-cheat listeners.\n"
                 "3. Examinee answers each question sequentially, navigating with Next/Previous buttons.\n"
                 "4. Examinee submits the completed test.\n"
                 "5. System evaluates raw answers, calculates Gaussian standardized score, derives percentile, and stores result in Supabase.\n"
                 "6. System redirects examinee to Results page displaying the Score Spectrum Ruler and AI diagnostic review."))
    xml.append(p("Alternative Scenario 3a (Anti-Cheat Violation):\n"
                 "Examinee navigates away from the active tab. System increments infraction counter and displays a warning banner upon focus return."))

    xml.append(heading3("Use Case UC-02: Play Cognitive Gym and Review Solutions"))
    xml.append(p("Primary Actor: Examinee"))
    xml.append(p("Main Success Scenario:\n"
                 "1. Examinee clicks 'Cognitive Gym & Drills' from the navigation bar.\n"
                 "2. System generates 10 randomized speed math mental arithmetic challenges and starts the countdown timer.\n"
                 "3. Examinee inputs answers and completes the speed duel.\n"
                 "4. System computes accuracy score, speed rating, and triggers celebration confetti.\n"
                 "5. Examinee clicks 'Review All 10 Solutions'.\n"
                 "6. System opens the modal displaying full mathematical reasoning and step-by-step proofs for each problem."))
    xml.append(page_break())

    return "".join(xml)
