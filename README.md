# CropQuest: AI & Agri Project Lab

> An interactive, browser-based learning game designed to teach **project management, product management, and practical applied AI** through authentic agricultural and crop-science challenges across smallholder farming ecosystems.

🌐 **Play the Live Game**: [https://cropquest-ai-agri-project-lab.ai.studio](https://cropquest-ai-agri-project-lab.ai.studio)

---

## 🌾 Overview

**CropQuest: AI & Agri Project Lab** is built for beginners, aspiring product managers, agronomists, software engineers, and development practitioners who want to learn how to build technology that genuinely solves problems in rural and emerging markets.

Instead of generic tech examples or passive multiple-choice tests, CropQuest immerses learners into real-world agricultural scenarios across Kenya, Nigeria, Ghana, Zambia, Tanzania, Rwanda, and Ethiopia. Learners navigate shifting seasons, biological deadlines, intermittent 2G/3G connectivity, low-literacy constraints, and complex ethical dilemmas.

---

## 🎮 The Prompt & Vision

The project was built according to the following design brief:

> *Build a polished, responsive, browser-based learning game called **CropQuest: AI & Agri Project Lab** for a beginner who wants to learn **project management, product management, and practical AI** through agricultural and crop-science scenarios.*
>
> *Make the experience feel like an interactive adventure, not an online course. Use a beautiful visual style inspired by farms, crop growth, field maps, and modern agri-tech dashboards. Create a clear learning map with unlockable levels, progress tracking, XP, badges, mini-quizzes, scenario choices, and instant explanations of why an answer works. Keep text concise, beginner-friendly, and visually engaging.*
>
> *Organize the learning journey into short missions covering: (1) project vs. product management, (2) understanding farmers and users, (3) setting goals and success metrics, (4) roadmaps, backlogs, and sprints, (5) AI fundamentals and effective prompting, (6) AI-powered crop monitoring and pest/disease detection, (7) irrigation, weather, soil, and yield-planning use cases, and (8) field pilots, budgets, risks, ethics, data privacy, and measuring impact.*
>
> *Use realistic scenarios involving smallholder farmers, cooperatives, and agri-tech teams in Africa and elsewhere. Let learners make decisions—such as prioritizing a feature, planning a crop-monitoring pilot, or evaluating an AI recommendation—and receive constructive feedback. Include a final capstone where the learner designs a simple AI-enabled agricultural product from problem discovery to pilot launch.*

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/) with `@vitejs/plugin-react`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Typography**: Google Fonts (*DM Sans*, *Fraunces* serif for field titles, *JetBrains Mono* for telemetry & data)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Synthesis**: Native HTML5 [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) (synthesizes chime, success chord, level-up fanfare, and error tones with zero external audio assets)
- **Visual FX**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) for celebratory milestones
- **State & Persistence**: Reactive local state synchronized to `localStorage` (no mandatory external backend or database required)

---

## 🧭 Architecture & Codebase Structure

```
├── index.html                           # HTML entry point with meta tags & Google fonts
├── metadata.json                        # Applet metadata & capability declarations
├── package.json                         # Dependencies & npm scripts
├── tsconfig.json                        # TypeScript configuration
├── vite.config.ts                       # Vite configuration with Tailwind 4 plugin
├── src/
│   ├── main.tsx                         # React entry point
│   ├── index.css                        # Tailwind 4 theme & typography layers
│   ├── App.tsx                          # Core state controller, view router & toast manager
│   ├── types/
│   │   └── index.ts                     # TypeScript definitions for Missions, Stages, Badges, Capstone
│   ├── data/
│   │   ├── missions.ts                  # Complete 8-mission curriculum with scenarios, stakeholders & quizzes
│   │   ├── badges.ts                    # Badge system definitions & XP values
│   │   └── glossary.ts                  # 15+ agricultural, PM, and AI terms with field examples
│   ├── utils/
│   │   ├── sound.ts                     # Web Audio API sound synthesizer
│   │   └── storage.ts                   # localStorage manager & level calculation formula
│   └── components/
│       ├── Navbar.tsx                   # Top bar with XP ticker, rank title, sound toggle & tools launch
│       ├── FieldMap.tsx                 # Interactive visual farm map with biological growth stages
│       ├── MissionRunner.tsx            # Multi-stage learning runner (Concepts, Scenarios, Tools, Quizzes)
│       ├── CapstoneBuilder.tsx          # 6-step Agri-Tech Venture Incubator & rubric grader
│       ├── ProfileModal.tsx             # Learner profile, level card, badge cabinet & reset controls
│       ├── GlossaryModal.tsx            # Searchable field handbook categorized by domain
│       ├── CertificateModal.tsx         # Printable & downloadable official completion certificate
│       ├── ToolsSandboxModal.tsx        # Standalone access to all 4 interactive simulators
│       └── interactive/
│           ├── RiceMatrixTool.tsx       # Live RICE prioritization calculator with sprint limits
│           ├── PromptLabTool.tsx        # Agri-GenAI prompt playground with IPM safety guardrails
│           ├── VisionThresholdTool.tsx  # Computer vision confidence slider & smallholder ROI simulator
│           └── IrrigationDecisionTool.tsx # Multi-sensor prescriptive irrigation & SMS generator
```

---

## 🚀 Key Features

### 1. Interactive Learning Map & Biological Growth Stages
- **8 Thematic Sectors** plus the **Capstone Incubator**.
- The learner's farm visually evolves as missions are completed:
  1. *Fallow Soil & Surveying* (0 missions completed)
  2. *Sprouting Seedlings* (1–2 missions completed)
  3. *Vegetative Canopy* (3–4 missions completed)
  4. *Flowering & Fruiting* (5–7 missions completed)
  5. *Bountiful Harvest & Enterprise Scale* (All missions + Capstone complete)

### 2. 8 Real-World Missions

| # | Mission | Crop & Location | Core Focus |
|---|---------|-----------------|------------|
| **1** | **The Cassava Value Chain Initiative** | Cassava · Oyo & Ogun, Nigeria | **Project vs. Product Management**: Outputs (shipping software on time) vs. Outcomes (preventing tuber rot & improving farmer income); avoiding rigid Waterfall scope locks. |
| **2** | **The Rift Valley Farmer Shadowing** | French Beans & Maize · Nakuru, Kenya | **User Research & Personas**: Designing for cracked screens, harsh equatorial sun, muddy hands, intermittent 2G signals, and 1-tap voice workflows over complex text forms. |
| **3** | **The Cocoa Shield Metric Matrix** | Cocoa · Ashanti & Western, Ghana | **Goals, OKRs & North Star Metric**: Replacing vanity metrics (60,000 app installs) with genuine impact (hectares protected from Black Pod disease); leading vs. lagging indicators. |
| **4** | **The Maize Monsoon Sprint** | Maize · Central Province, Zambia | **Roadmaps, Backlogs & Sprints**: Prioritizing software releases against hard biological planting deadlines (the rains won't wait for your sprint delay); RICE scoring. |
| **5** | **The Agri-GenAI Prompt Studio** | Tomatoes & Vegetables · Arusha, Tanzania | **AI Fundamentals & Prompt Engineering**: Distinguishing Rules Engines vs. ML vs. LLMs; building structured system prompts with IPM guardrails to prevent toxic chemical advice. |
| **6** | **The Computer Vision Scout** | Maize & Coffee · Rwanda & Ethiopia | **Crop Vision & Disease Detection**: Convolutional networks & Vision Transformers; balancing True Positives, False Positives (wasted spray), and False Negatives (destroyed crop). |
| **7** | **The Multi-Sensor Water Basin** | Drip Horticulture · Sahel Fringe | **Irrigation, Soil & Yield Planning**: Fusing IoT soil capacitance probes, satellite NDVI vigor, and 24h convective rain forecasts into actionable, diesel-saving SMS advice. |
| **8** | **The High-Altitude Coffee Pilot** | Arabica Coffee · Huye, Rwanda | **Field Pilots, Budgets, Ethics & Privacy**: Structuring matched control-group A/B field trials, rural budget realities, and farmer data sovereignty charters. |

### 3. Four Embedded Interactive Simulators

1. **RICE Feature Prioritization Matrix (`RiceMatrixTool.tsx`)**
   - Adjust Reach, Impact (0.5x to 3x), Confidence (50% to 100%), and Effort (weeks) sliders.
   - Live recalculation of RICE scores: `(Reach × Impact × Confidence) ÷ Effort`.
   - Automatic feature ranking and visual sprint capacity cutoffs.

2. **Agri-GenAI Prompt Studio (`PromptLabTool.tsx`)**
   - Side-by-side **A/B safety comparison** contrasting an ungrounded prompt (which hallucinates dangerous tank-mixes and kerosene sprays) against a grounded agronomy architecture with Integrated Pest Management (IPM) rules.
   - Real-time prompt sandbox with presets for Tomato Early Blight and Maize Fertilizer application.

3. **Pest Vision Confidence Threshold Simulator (`VisionThresholdTool.tsx`)**
   - Interactive slider adjusting model confidence from 50% to 95% across a simulated 100-leaf sample.
   - Real-time confusion matrix: True Positives, False Positives, False Negatives, and True Negatives.
   - **Economic Calculator**: Calculates smallholder net financial return by balancing the cost of unneeded chemical sprays ($12/spray) against the cost of missed infestations ($85/hectare in destroyed harvest).

4. **Multi-Sensor Irrigation Prescriptive Engine (`IrrigationDecisionTool.tsx`)**
   - Combines soil volumetric water content (VWC %), 24-hour rainfall probability, and crop growth stage (Seedling, Vegetative, Flowering, Pre-Harvest).
   - Generates prescriptive valve actions, vernacular SMS dispatches in Swahili/English, and calculates liters of water and diesel pump fuel saved.

### 4. The Capstone: Agri-Tech Venture Incubator
- A 6-stage product design studio where learners synthesize everything they've learned:
  1. *Problem Statement & Context* (Crop, geography, biological urgency, field connectivity).
  2. *User Persona & Field Constraints* (Farmer habits, language, device limitations).
  3. *North Star Metric & Strategy* (Outcome-oriented metrics vs. vanity numbers).
  4. *AI Architecture & Safety Policy* (Edge CV, LLM advisory, satellite data, confidence thresholds).
  5. *MVP Backlog (RICE)* (Selecting must-haves before planting season).
  6. *Field Pilot & Data Sovereignty Charter* (Control group duration, farmer data rights).
- **Automated Rubric Evaluation**: Grades the venture across 5 dimensions (Problem Validation, Product Prioritization, AI Appropriateness, Ethical Safety, Pilot Viability) out of 100 points.
- **Product Brief Export**: Download a structured `.txt` product specification document.
- **Printable Certificate of Mastery**: An official credential ready for printing or PDF export.

### 5. Field Handbook & Audio Feedback
- **Searchable Glossary**: Instant lookups with category filters for PM, AI & ML, Agri-Tech, and Field Ethics terms with concrete field examples.
- **Web Audio Sound Effects**: Low-latency, pleasant audio chimes synthesized directly in code (no external MP3/WAV assets) with a one-click mute toggle.

---

## 💻 Local Development Setup

To run CropQuest locally:

```bash
# 1. Clone the repository
git clone <repo-url>
cd cropquest

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev

# 4. Open your browser
# Navigate to http://localhost:3000
```

### Useful Scripts

- `npm run dev` — Starts the local dev server.
- `npm run build` — Compiles the TypeScript code and produces a production bundle in `dist/`.
- `npm run lint` — Validates TypeScript types across all components (`tsc --noEmit`).

---

## 📄 License

Apache-2.0 License. See source headers for details.
