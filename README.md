# Kintsu

### Decolonizing Mental Health Data via Heritage Proverbs.

[Live Demo](https://kintsu-theta.vercel.app) | [Video Walkthrough](https://youtu.be/ltpAnOagsRs)

---

## The Challenge
Second-generation immigrants often face a profound language gap when attempting to discuss mental health with their families. Clinical terminology such as "burnout," "depression," or "anxiety" frequently lacks direct translation in many heritage languages or, worse, is mistranslated as "laziness" or "ungratefulness." This linguistic barrier reinforces stigma, isolates the individual, and prevents access to communal support systems.

## The Solution
Kintsu is a privacy-first web application designed to bridge this gap. Acting as a digital "Diplomat," Kintsu translates emotional distress into culturally validated proverbs and cognitive reframes. By grounding clinical concepts in heritage wisdom, the platform enables users to communicate their needs in language that honors their family's values rather than challenging them.

## Testing Guide
To evaluate the efficacy of the proverb generation and cultural alignment, please perform the following test case:

1.  **Navigate** to the main interface.
2.  **Input Emotion:** "Burnt out from medical school pressure"
3.  **Select Culture:** "Indian"
4.  **Observe:** The system will generate a "Bridge Card" that reframes the concept of burnout not as failure, but through a culturally specific lens (e.g., referencing the necessity of rest for sustained duty), complete with a verified proverb.

## Key Features

### 1. RAG-Powered Wisdom
The application utilizes Google Gemini in JSON Mode, grounded in a curated folklore dataset. This Retrieval-Augmented Generation (RAG) approach ensures that all generated proverbs are culturally accurate and hallucination-resistant, prioritizing safety and relevance over generative creativity.

### 2. The Bridge
Kintsu removes the friction of initiating difficult conversations. The "Bridge" feature generates deep links for WhatsApp and SMS that pre-fill the proverb script. This allows users to send a culturally framed message immediately, bypassing the paralysis often associated with asking for help.

### 3. Data Philanthropy
The platform introduces a gamified feedback loop for "Data Philanthropy." Users can anonymously donate their successful reframes to a seeded dataset. This aggregate data (currently simulating 450+ entries) is intended to help decolonize future AI models by providing a corpus of non-Western emotional expression.

### 4. Crisis Safety
Safety is paramount. The application employs real-time regex patterns and API guardrails to detect inputs indicative of self-harm or immediate danger. Such inputs trigger an immediate interception, redirecting the user to 988 or the Crisis Text Line, ensuring the tool is never used as a substitute for emergency care.

### 5. Digital Ceramics UI
The user interface implements a "Digital Ceramics" design system. Utilizing Fraunces and Manrope typefaces with custom noise overlays, the aesthetic is designed to evoke the tactile calmness of a library or a handwritten letter, rather than a sterile clinical dashboard.

### 6. Role Toggle
The Sanctuary supports two distinct perspectives. Children can submit their emotional burden and receive a culturally reframed proverb. Parents can describe what their child said and receive a warm, culturally grounded explanation of what the child likely meant — bridging the generational direction of the gap, not just one side of it.

### 7. Kintsu Chat
After receiving a Bridge Card, users can open a conversational panel with Kintsu — an AI cultural therapist persona. The chat is seeded with a role-aware opening message and responds with culturally attuned, therapist-style guidance. It is designed as a safe space to process the reframe before sending it, reducing the gap between insight and action.

## Technical Architecture

**Frontend**
*   **Next.js:** For server-side rendering and robust routing.
*   **Tailwind CSS:** For a utility-first, responsive design system.

**Backend**
*   **Supabase:** Handles authentication and database requirements.

**Artificial Intelligence**
*   **Google Gemini 2.5 Flash:** Optimized for JSON output to ensure structured, reliable data generation.

## Safety & Ethics
Kintsu is a communication aid, not a medical device. It includes a prominent disclaimer stating that it does not provide medical advice or diagnosis. The built-in crisis interception system is designed to route at-risk users to appropriate emergency services immediately.

## Installation

To run the project locally:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
