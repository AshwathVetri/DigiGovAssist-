# DigiGovAssist 🇮🇳

> **"Tell us what happened. We'll tell you what to do."**
> 
> *Core Principle: Don't ask citizens what the government already knows.*

DigiGovAssist is an intelligent AI-powered government services navigator for Indian citizens. Instead of requiring citizens to browse through bureaucratic departmental directories, search confusing terminology, and repeatedly upload the same identity documents across multiple portals, DigiGovAssist allows citizens to simply describe their real-world situation in natural language.

---

## ⚡ Important Disclaimer for Evaluators

> **Prototype Data Notice**:  
> The current hackathon prototype uses simulated **DigiPro** and mock government service data. Real DigiLocker, API Setu, and Parivahan integrations can be connected seamlessly through the pluggable provider interfaces without refactoring the user interface or application business logic.

---

## 🌟 The Core Paradigm Shift

| Traditional Gov Platforms (e.g., UMANG) | DigiGovAssist AI Navigator |
| :--- | :--- |
| **"Find a Service"** — Citizen must know the department, scheme name, and form numbers. | **"Tell us what happened"** — Citizen describes life events naturally (e.g., *"I bought a second-hand bike"*). |
| **Repetitive Uploads** — Citizen uploads Aadhaar, PAN, and address proof for every single service. | **Don't Ask What's Known** — Pre-fills verified data from the **DigiPro** citizen data layer with consent. |
| **Fragmented Portals** — Separate sites for Vahan, Sarathi, e-District, and Municipal records. | **Intelligent Bundling** — Identifies all related requirements (e.g., RC Transfer + Insurance + PUC). |
| **Opaque Eligibility** — Citizen discovers missing prerequisites only after rejection. | **Application Readiness Engine** — Calculates a real-time readiness score (e.g., 100%) prior to filing. |

---

## 🚀 Key Features

1. **Conversational AI Navigator**:
   - Understands natural language statements like *"I bought a second-hand bike"*, *"I want to apply for a driving licence"*, *"I need an income certificate"*, or *"My child was born"*.
   - Progressively powered by **Google Gemini API** with built-in rule-based keyword/NLP fallback when no API key is provided.
   - Extracts structured intent and maps directly to the appropriate government services.

2. **DigiPro Verified Citizen Data Layer**:
   - Represents the future consent-based verified citizen repository (simulating DigiLocker & API Setu).
   - Pre-loaded with 3 realistic citizen profiles: **Arjun Kumar** (Primary Demo, 20-year-old in Coimbatore), **Priya Sharma** (Bangalore), and **Rajesh Patel** (Ahmedabad).
   - Provides verified identity records: Aadhaar, PAN, Driving Licence, Parivahan Vehicle RC, Motor Insurance, PUC Certificate, Address Proof, and Income Certificate.

3. **Consent-First Architecture**:
   - Conforms with the **Digital Personal Data Protection (DPDP) Act 2023** principles.
   - Shows an explicit *"Before we continue"* consent screen itemizing exactly which verified fields will be read.
   - Maintains a tamper-evident **Consent History** log allowing citizens to audit or revoke access at any time.

4. **Requirement Matching & Readiness Engine**:
   - Computes a live **Application Readiness Score** ($0 - 100\%$) comparing service requirements against available DigiPro records.
   - Highlights ready items ($\checkmark$) and missing items ($\triangle$) before application filing.

5. **Automatic Form Filling**:
   - Pre-populates forms automatically with `✓ Filled from DigiPro` verification badges.
   - Allows citizen editing while eliminating 90%+ of manual typing.

6. **Prototype Submission & Live Tracking**:
   - Generates official tracking IDs (e.g., `DGA-2026-00124`).
   - Simulates a 6-stage lifecycle event timeline: *Application Created $\rightarrow$ Information Retrieved $\rightarrow$ Application Prepared $\rightarrow$ Application Submitted $\rightarrow$ Department Scrutiny $\rightarrow$ Final Approval*.
   - Includes printable acknowledgment receipts.

---

## 🛠 Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Router v7, Lucide Icons
- **Backend Architecture**: Pluggable provider pattern with Supabase PostgreSQL schema (`supabase/schema.sql` and `supabase/seed.sql`) and instant in-memory / `localStorage` fallback
- **AI Engine**: Google Gemini API (`@google/genai` compatible endpoint) with built-in heuristic fallback matcher
- **State & Storage**: React Context API with persistent local storage and live event bus

---

## 📂 Project Structure

```
src/
├── config/                  # Central environment configuration (env.ts)
├── types/                   # TypeScript interfaces (Citizen, Service, Application, AI, Consent)
├── data/                    # Realistic seed data (3 citizens, 10 services, mock docs & apps)
│   ├── mockCitizens.ts      # Arjun Kumar, Priya Sharma, Rajesh Patel
│   ├── mockServices.ts      # 10 comprehensive government services
│   ├── mockApplications.ts  # Pre-seeded application history & events
│   └── mockConsents.ts      # Audit log of granted/revoked consents
├── services/                # Pluggable Service Layer (Mock-first architecture)
│   ├── ai/                  # AIService interface, MockAIService, GeminiAIService
│   ├── digipro/             # DigiProProvider interface, MockDigiProService, DigiLocker adapter
│   ├── government/          # GovernmentServiceProvider, ServiceRequirementEngine, API Setu adapter
│   ├── application/         # ApplicationServiceProvider, MockApplicationService
│   ├── consent/             # ConsentServiceProvider, MockConsentService
│   └── supabase/            # Supabase safe client initializer
├── context/                 # AppContext (active citizen, profile sync, toasts, actions)
├── components/
│   ├── common/              # Navbar, Footer, DemoToolbar, PrototypeBadge, ReadinessBar, StatusBadge, Timeline
│   ├── ai/                  # ServiceRecommendationCard, AIAssistantChat
│   ├── consent/             # ConsentModal ("Before we continue")
│   ├── digipro/             # RetrievalStepperModal (4-stage animation), DocumentViewerModal
│   └── forms/               # AutoFillApplicationForm with DigiPro badges & submission modal
├── pages/                   # Application routes
│   ├── LandingPage.tsx      # Hero, tagline, comparison table, quick scenario launcher
│   ├── NavigatorPage.tsx    # Natural language chat & structured service recommendations
│   ├── ServicesCatalogPage.tsx # 10 government services with category filtering & search
│   ├── ServiceDetailPage.tsx   # Service requirements breakdown & eligibility
│   ├── ApplicationFlowPage.tsx  # Dynamic auto-filled application form
│   ├── ApplicationsPage.tsx     # My Applications tracking list & filter
│   ├── ApplicationTrackingPage.tsx # Application tracking ID, event timeline & receipt
│   ├── DigiProHubPage.tsx       # Verified citizen data layer & document inspection
│   ├── ConsentHistoryPage.tsx   # Auditable citizen consent log with revocation
│   └── ProfilePage.tsx          # Citizen profile details & completeness score
└── layouts/
    └── RootLayout.tsx       # Master layout with DemoToolbar, Navbar, Footer & Toasts
```

---

## ⚙️ Quick Start Installation

No API keys or databases are required to run the prototype out of the box!

```bash
# 1. Install dependencies
npm install

# 2. Start local Vite development server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🔐 Environment Variables (`.env.example`)

DigiGovAssist is designed with progressive enhancement. You can optionally configure real APIs in `.env`:

```env
# Optional Supabase Connection
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Optional Google Gemini API Key
VITE_GEMINI_API_KEY=

# Planned Production Gateways (Not required for prototype)
DIGILOCKER_CLIENT_ID=
DIGILOCKER_CLIENT_SECRET=
DIGILOCKER_REDIRECT_URI=
API_SETU_BASE_URL=
API_SETU_API_KEY=
GOVERNMENT_API_BASE_URL=
```

*If any environment variable is omitted, DigiGovAssist automatically falls back to its built-in simulated data and local AI engine without error.*

---

## 🎯 Demo Scenarios to Test

Click the **"Load Bike Scenario"** button in the top developer bar or try these inputs in the AI Navigator:

1. **Scenario 1 (Primary)**:
   - Input: *"I bought a second-hand bike."*
   - AI Identifies: **Used Vehicle Purchase (Two-Wheeler / Car)**
   - Recommends: Vehicle Ownership Transfer, RC Verification, Insurance Verification, PUC Verification
   - Click: **Start Service** $\rightarrow$ Observe explicit consent screen $\rightarrow$ Observe 4-step DigiPro retrieval $\rightarrow$ Observe 100% readiness and auto-filled Form 29/30 $\rightarrow$ Submit and track application!

2. **Scenario 2**:
   - Input: *"I want to apply for a driving licence."*
   - AI Identifies: Permanent Driving Licence + Learner's Licence (LLR) with Sarathi MoRTH integration.

3. **Scenario 3**:
   - Input: *"I need an income certificate for college admission."*
   - AI Identifies: Revenue Administration e-District Income Certificate.

4. **Scenario 4**:
   - Input: *"My child was born last week."*
   - AI Identifies: Civil Registration System Birth Registration & Certificate.

5. **Scenario 5**:
   - Input: *"I want to start a small shop."*
   - AI Identifies: Ministry of MSME Udyam Registration (Zero Fee).

---

## 🏛 Supported Government Services (10 Included)

1. **Vehicle Ownership Transfer** (MoRTH Parivahan Form 29/30)
2. **Vehicle RC Status Verification** (National Vahan Register)
3. **Vehicle Insurance Verification** (IRDAI / IIB)
4. **Vehicle PUC Check & Renewal** (Automated Emission Testing)
5. **Learner's Licence (LLR)** (Sarathi Contactless Online Exam)
6. **Permanent Driving Licence (DL)** (State Transport Department)
7. **Income Certificate** (Revenue Administration / e-District)
8. **Residence / Domicile Certificate** (District Revenue Collectorate)
9. **Birth Certificate** (Civil Registration System / Municipal Corp)
10. **Small Business Registration** (Ministry of MSME Udyam)

---

## 👥 Demo Citizen Accounts

Use the **Citizen Switcher** in the top developer bar or Profile page to test different citizen profiles:

1. **Arjun Kumar** (Primary Demo):
   - 20 years old, Coimbatore, Tamil Nadu
   - 100% DigiPro verified: Aadhaar, PAN, DL, Royal Enfield Classic 350 RC, Insurance, PUC, Address Proof, Birth Certificate, 12th Grade Certificate, Income Certificate.
2. **Priya Sharma**:
   - 28 years old, Software Engineer in Bangalore, Karnataka
   - Verified Aadhaar, PAN, DL, Income Certificate.
3. **Rajesh Patel**:
   - 42 years old, Small Retail Shop Owner in Ahmedabad, Gujarat
   - Verified Aadhaar, PAN.

---

## 🔮 Future Architecture Roadmap

- [ ] **DigiLocker OAuth 2.0 PKCE**: Connect `digilockerService.ts` to live DigiLocker Pull API.
- [ ] **API Setu Gateway**: Connect `apiSetuService.ts` to MeitY's National Data Exchange.
- [ ] **Parivahan e-Vahan & e-Sarathi APIs**: Dispatch signed Form 29/30 payloads directly to state RTO endpoints.
- [ ] **Multilingual Support**: Voice & natural language understanding in 12+ Indian languages via Bhashini API.

---

## 📜 License

Created for Digital India Hackathon & Innovation Showcases. Open prototype licensed under MIT.
