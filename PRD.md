# Product Requirements Document (PRD)

## Visibl — AI Visibility Platform

> **Version:** 1.0  
> **Last Updated:** December 25, 2024  
> **Status:** In Development

---

## 1. Executive Summary

### 1.1 Product Vision

**Visibl** is a SaaS platform that helps brands and agencies monitor, optimize, and improve their visibility across AI-powered chatbots and assistants. As AI platforms like ChatGPT, Gemini, Perplexity, and Grok increasingly influence purchase decisions and brand perception, Visibl provides the intelligence and tools needed to ensure brands are accurately represented in AI-generated responses.

### 1.2 Problem Statement

Brands today face a new challenge: **AI chatbots are becoming the new search engines**. When consumers ask ChatGPT "What are the best running shoes?" or "Compare Nike vs Adidas," brands have no visibility or control over how they're represented. Unlike traditional SEO where brands can optimize for Google, there's currently no equivalent strategy for AI visibility.

### 1.3 Solution

Visibl provides:
- **Monitoring** — Track how your brand and products are mentioned across AI platforms
- **Analysis** — Understand sentiment, coverage, and competitive positioning
- **Optimization** — Actionable recommendations to improve AI visibility
- **Content Generation** — AI-optimized content creation tools
- **Reporting** — Professional PDF reports for stakeholders

---

## 2. Target Users

### 2.1 Primary Personas

#### Brand Manager (Business User)
- **Role:** Marketing/Brand Manager at a consumer brand
- **Goals:** Understand brand presence in AI responses, improve product visibility
- **Pain Points:** No visibility into AI chatbot mentions, unable to influence AI-generated recommendations
- **Usage Pattern:** Daily monitoring, weekly optimization actions

#### Agency Account Manager
- **Role:** Digital marketing agency managing multiple brand clients
- **Goals:** Monitor and report on AI visibility for client portfolio
- **Pain Points:** Managing multiple brands, creating client reports, demonstrating ROI
- **Usage Pattern:** Multi-brand dashboard, monthly client reporting

### 2.2 Secondary Personas

- **Content Strategist** — Uses optimization recommendations to create AI-friendly content
- **SEO Specialist** — Integrates AI visibility into overall search strategy
- **C-Suite Executive** — Reviews high-level visibility reports and competitive analysis

---

## 3. User Stories & Journeys

### 3.1 Core User Stories

#### Authentication
| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | New user | Sign up with email and password | I can create my account |
| US-02 | Returning user | Log in to my account | I can access my dashboard |
| US-03 | User | Stay logged in across sessions | I don't have to re-authenticate constantly |

#### Brand Management
| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-04 | Brand manager | Add my brand to track | I can monitor AI visibility |
| US-05 | Brand manager | Upload my brand logo | Reports look professional |
| US-06 | Brand manager | Switch between multiple brands | I can manage my portfolio |
| US-07 | Brand manager | Set tracking frequency | I get updates at my preferred cadence |

#### Dashboard & Monitoring
| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-08 | Brand manager | See my overall visibility score | I understand my brand's AI presence at a glance |
| US-09 | Brand manager | View mentions by AI platform | I know where I'm strong/weak |
| US-10 | Brand manager | Track visibility trends over time | I can measure improvement |
| US-11 | Brand manager | Filter data by date range | I can analyze specific periods |
| US-12 | Brand manager | Filter by AI model | I can focus on specific platforms |

#### Product Management
| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-13 | Brand manager | Add products to my brand | I can track product-level visibility |
| US-14 | Brand manager | See product visibility scores | I know which products need optimization |
| US-15 | Brand manager | View product-specific AI mentions | I understand product positioning |
| US-16 | Brand manager | Drill into individual product details | I can see granular analytics |

#### Prompt & Query Management
| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-17 | Brand manager | See what prompts mention my brand | I understand user intent |
| US-18 | Brand manager | Add custom prompts to monitor | I can track specific queries |
| US-19 | Brand manager | View AI responses for each prompt | I see how my brand is presented |
| US-20 | Brand manager | Queue prompts for analysis | I can batch process queries |
| US-21 | Brand manager | See sentiment analysis per response | I understand if mentions are positive |

#### Optimization & Actions
| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-22 | Brand manager | Receive optimization recommendations | I know what actions to take |
| US-23 | Brand manager | Prioritize recommendations by impact | I focus on high-value actions |
| US-24 | Brand manager | Generate AI-optimized content | I can improve my visibility |
| US-25 | Brand manager | Track completed optimizations | I can measure my progress |

#### Reporting
| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-26 | Brand manager | Generate PDF visibility reports | I can share with stakeholders |
| US-27 | Brand manager | Customize report sections | Reports contain relevant data |
| US-28 | Brand manager | Add my logo to reports | Reports are white-labeled |
| US-29 | Brand manager | Save report configurations | I can regenerate easily |
| US-30 | Agency user | View saved reports history | I can access past reports |

---

### 3.2 User Journey Maps

#### Journey 1: First-Time User Onboarding

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     FIRST-TIME USER ONBOARDING                          │
└─────────────────────────────────────────────────────────────────────────┘

PHASE 1: DISCOVERY & SIGNUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━
User lands on marketing site
         │
         ▼
Clicks "Get Started" / "Sign Up"
         │
         ▼
┌─────────────────────────────────┐
│       SIGN UP FORM              │
│  • Full name                    │
│  • Email address                │
│  • Password                     │
│  • [Create Account] button      │
└─────────────────────────────────┘
         │
         ▼
Account created → Automatic login
         │
         ▼
Redirected to Dashboard

PHASE 2: BRAND SETUP
━━━━━━━━━━━━━━━━━━━━
Empty state dashboard prompts action
         │
         ▼
User clicks "Add Brand"
         │
         ▼
┌─────────────────────────────────┐
│     ADD BRAND DIALOG            │
│  Step 1: Brand Details          │
│  • Brand name*                  │
│  • Website URL*                 │
│  • Upload logo (optional)       │
│  • Tracking frequency           │
│                                 │
│  [Cancel]         [Add Brand]   │
└─────────────────────────────────┘
         │
         ▼
Brand added to portfolio
         │
         ▼
Initial analysis begins (loading state)
         │
         ▼
Dashboard populates with data

PHASE 3: EXPLORATION
━━━━━━━━━━━━━━━━━━━━
User explores dashboard sections:
• AI Visibility Overview (default)
• Product Lab
• Prompt Blast Lab
• Actions Lab
         │
         ▼
User adds first product
         │
         ▼
🎉 Onboarding Complete — User is engaged
```

---

#### Journey 2: Daily Monitoring Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     DAILY MONITORING WORKFLOW                           │
└─────────────────────────────────────────────────────────────────────────┘

User logs in
    │
    ▼
Dashboard loads with last-viewed brand
    │
    ├── Quick scan of key metrics:
    │   • Visibility Score (87/100)
    │   • Total Mentions (12,847)
    │   • Trend direction (↑5%)
    │
    ▼
User notices visibility drop on Gemini
    │
    ▼
Clicks into platform breakdown
    │
    ▼
Reviews recent prompts mentioning brand
    │
    ▼
Identifies negative sentiment on one prompt
    │
    ▼
Navigates to Actions Lab
    │
    ▼
Sees recommendation: "Update product FAQ"
    │
    ▼
Clicks "Start Optimization"
    │
    ▼
Content Studio generates draft content
    │
    ▼
User reviews, edits, and exports content
    │
    ▼
Marks action as "Complete"
    │
    ▼
Returns to dashboard — progress updated
```

---

#### Journey 3: Report Generation Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     REPORT GENERATION WORKFLOW                          │
└─────────────────────────────────────────────────────────────────────────┘

PHASE 1: REPORTS DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━
User navigates to Reports page
         │
         ▼
┌─────────────────────────────────┐
│      REPORTS DASHBOARD          │
│                                 │
│  [+ Create Report]              │
│                                 │
│  Saved Reports:                 │
│  ┌───────────────────────────┐  │
│  │ Q4 2024 AI Visibility     │  │
│  │ Oct 1 – Dec 31, 2024      │  │
│  │ Created: Dec 20           │  │
│  │ [View] [Download] [Delete]│  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
         │
         ▼
User clicks "Create Report"

PHASE 2: REPORT WIZARD
━━━━━━━━━━━━━━━━━━━━━━
Step 1: Report Setup
┌─────────────────────────────────┐
│  Report Period: [Jan 1] – [Dec 25]
│  Report Title: [AI Visibility Report]
│  Logo: [Upload]                 │
│  Page Numbers: [✓]              │
│                                 │
│  [Exit]              [Continue] │
└─────────────────────────────────┘
         │
         ▼
Step 2: AI Overview
┌─────────────────────────────────┐
│  ☑ Visibility Score             │
│  ☑ Total Mentions               │
│  Platform Coverage:             │
│    ☑ ChatGPT                    │
│    ☑ Gemini                     │
│    ☑ Perplexity                 │
│    ☑ Grok                       │
│                                 │
│  [Back]              [Continue] │
└─────────────────────────────────┘
         │
         ▼
Step 3: Prompts & Queries
Step 4: Products
Step 5: On-Site Optimizations
Step 6: Actions Log
         │
         ▼
Final: Preview Report
         │
         ▼
User clicks "Export PDF"
         │
         ▼
PDF downloads to device
```

---

## 4. Feature Specifications

### 4.1 Dashboard Overview

#### Visibility Score Widget
| Attribute | Specification |
|-----------|---------------|
| Display | Circular progress dial, 0-100 scale |
| Trend | Percentage change vs. previous period with arrow indicator |
| Interaction | Click to expand detailed breakdown |
| Update Frequency | Based on tracking frequency setting |

#### Platform Coverage Chart
| Attribute | Specification |
|-----------|---------------|
| Platforms | ChatGPT, Gemini, Perplexity, Grok |
| Metrics | Mentions count, sentiment, coverage %, trend |
| Visualization | Horizontal bars or pie chart segments |
| Interaction | Hover for details, click to filter |

#### Trend Visualization
| Attribute | Specification |
|-----------|---------------|
| Chart Type | Area chart with gradient fill |
| Time Range | Configurable (7d, 30d, 90d, custom) |
| Data Points | Visibility score over time |
| Baseline | Optional comparison baseline toggle |

### 4.2 Product Lab

#### Product List View
| Column | Description |
|--------|-------------|
| Product Name | Clickable link to detail page |
| Category | Product category tag |
| Visibility Score | 0-100 with color coding |
| Mentions | Total AI mention count |
| Sentiment | Positive/Neutral/Negative indicator |
| Last Optimized | Relative timestamp |
| Actions | Pin, Edit, Delete |

#### Product Detail Page
| Section | Features |
|---------|----------|
| Header | Product name, score dial, re-analyze button |
| Platform Pillars | Visual coverage across 4 AI platforms |
| Prompts Table | All prompts mentioning this product |
| Gap Analysis | Optimization opportunities with priority |
| Keywords | SEO keyword performance table |

### 4.3 Prompt Blast Lab

#### Prompt Management
| Feature | Description |
|---------|-------------|
| Generate Tab | Create new prompts for monitoring |
| Monitor Tab | View active prompts and responses |
| Test Tab | Run ad-hoc prompt tests |
| Queue System | Batch prompts for scheduled analysis |
| Limit | Configurable max prompts per product |

#### Prompt Details Panel
| Element | Information |
|---------|-------------|
| Query | The prompt text sent to AI |
| Platform Results | Response from each AI platform |
| Sentiment | Analysis of each response |
| Sources | Cited sources from AI responses |
| Timestamp | When analysis was performed |

### 4.4 Actions Lab

#### Recommendation Cards
| Attribute | Description |
|-----------|-------------|
| Title | Action headline |
| Category | On-site, Off-site, PR/Social |
| Impact | AI Visibility increase estimate |
| Effort | Low/Medium/High |
| Priority | Do First, This Week, Later |
| Status | Pending, In Progress, Complete |

#### Content Studio
| Feature | Description |
|---------|-------------|
| Template Selection | Pre-built content types |
| Product Association | Link to tracked products |
| AI Generation | Draft content with AI |
| Editor | Rich text editing |
| Export | Copy, download, or publish |

### 4.5 Reports

#### Report Wizard Steps
| Step | Selections |
|------|------------|
| 1. Setup | Period, title, logo, page numbers |
| 2. AI Overview | Score, mentions, platform coverage |
| 3. Prompts | Select prompts to include |
| 4. Products | Select products to include |
| 5. Optimizations | Select completed actions |
| 6. Actions Log | Select logged actions |

#### PDF Export
| Element | Specification |
|---------|---------------|
| Format | A4, professional layout |
| Branding | Custom logo support |
| Sections | Modular, user-selected |
| Styling | Clean, Apple-inspired design |

---

## 5. Navigation & Information Architecture

### 5.1 Primary Navigation

```
┌─────────────────────────────────────────────────────────────────┐
│                     NAVIGATION STRUCTURE                         │
└─────────────────────────────────────────────────────────────────┘

SIDEBAR (Collapsible)
├── Dashboard
│   ├── AI Visibility Overview (default)
│   ├── Product Lab
│   ├── Prompt Blast Lab
│   │   ├── Generate
│   │   ├── Monitor
│   │   └── Test
│   └── Actions Lab
│       ├── On-Site Optimization
│       ├── Authority Lab
│       ├── Actions Log
│       └── Content Studio
│
├── Watchlist (Business User)
│   └── Pinned products and brands
│
├── Client Portal (Agency Admin)
│   └── Multi-client management
│
├── Reports
│   ├── Reports Dashboard
│   └── Create Report Wizard
│
└── Settings
    ├── Profile
    ├── Account
    ├── Password & Security
    ├── Team Management
    ├── Appearance
    └── Billing
```

### 5.2 Header Actions

| Element | Location | Function |
|---------|----------|----------|
| Brand Switcher | Left | Switch between tracked brands |
| Search | Center | Global search |
| Notifications | Right | Alerts and updates |
| Settings | Right | Quick access to settings |
| Profile | Right | User menu |

---

## 6. UI/UX Design Principles

### 6.1 Visual Design Language

| Principle | Implementation |
|-----------|----------------|
| **Clarity** | Clean layouts, generous whitespace, clear hierarchy |
| **Consistency** | Unified component library (shadcn/ui) |
| **Responsiveness** | Mobile-first, adaptive layouts |
| **Accessibility** | WCAG 2.1 AA compliance |
| **Dark Mode** | Full theme support with semantic tokens |

### 6.2 Interaction Patterns

| Pattern | Usage |
|---------|-------|
| **Progressive Disclosure** | Show essential info first, details on demand |
| **Inline Actions** | Edit, delete, and actions within context |
| **Optimistic Updates** | Immediate UI feedback before server confirmation |
| **Skeleton Loading** | Content placeholders during data fetch |
| **Toast Notifications** | Non-blocking success/error feedback |
| **Confirmation Dialogs** | Destructive actions require explicit confirmation |

### 6.3 Empty States

| State | Design |
|-------|--------|
| No brands | Illustration + "Add your first brand" CTA |
| No products | Illustration + "Add a product" CTA |
| No data | Helpful message explaining why |
| Error | Clear error message + retry action |

---

## 7. Technical Requirements

### 7.1 Platform Support

| Platform | Minimum Version |
|----------|-----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Mobile Safari | iOS 14+ |
| Chrome Mobile | Android 10+ |

### 7.2 Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |
| Bundle Size | < 500KB (gzipped) |

### 7.3 Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Authentication | Supabase Auth with email/password |
| Authorization | Row Level Security (RLS) policies |
| Data Encryption | TLS 1.3 in transit, AES-256 at rest |
| Session Management | JWT tokens with secure refresh |
| Input Validation | Client and server-side validation |

---

## 8. Success Metrics

### 8.1 User Engagement KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Daily Active Users | Growing 10% MoM | Analytics |
| Session Duration | > 5 minutes avg | Analytics |
| Feature Adoption | 60% use all core features | Feature flags |
| Report Generation | 2+ reports/user/month | Database |

### 8.2 Business KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| User Retention | > 80% at 30 days | Cohort analysis |
| NPS Score | > 40 | User surveys |
| Support Tickets | < 5% of users/month | Support system |
| Churn Rate | < 5% monthly | Billing system |

---

## 9. Future Roadmap

### Phase 2 (Q2 2025)
- [ ] Real AI platform API integrations
- [ ] Automated scheduled reporting
- [ ] Email notifications and alerts
- [ ] Team collaboration features

### Phase 3 (Q3 2025)
- [ ] Competitor tracking and benchmarking
- [ ] Custom AI model training suggestions
- [ ] Integration with CMS platforms
- [ ] Advanced analytics and predictive insights

### Phase 4 (Q4 2025)
- [ ] White-label solution for agencies
- [ ] API access for enterprise customers
- [ ] Mobile native apps
- [ ] AI content co-pilot assistant

---

## 10. Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **AI Visibility** | How prominently a brand appears in AI chatbot responses |
| **Visibility Score** | 0-100 metric measuring overall AI presence |
| **Platform Coverage** | Percentage of AI platforms mentioning the brand |
| **Prompt** | A query or question sent to AI chatbots |
| **Mention** | An instance where an AI references a brand or product |
| **Sentiment** | The tone of an AI mention (positive/neutral/negative) |
| **Fidelity** | Accuracy of AI responses about a brand |

### B. Competitive Landscape

| Competitor | Focus | Differentiation from Visibl |
|------------|-------|------------------------------|
| Traditional SEO Tools | Google search | Visibl focuses specifically on AI chatbots |
| Brand Monitoring Tools | Social media | Visibl monitors AI platforms, not social |
| Content Optimization | General content | Visibl optimizes for AI visibility specifically |

### C. User Feedback Channels

- In-app feedback widget
- NPS surveys (quarterly)
- User interviews (monthly)
- Support ticket analysis
- Feature request voting system

---

*Document maintained by Product Team. For questions, contact product@visibl.ai*
