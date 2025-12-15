# Dialectical Prompt Synthesizer

**A systematic interface for prompt engineering based on Hegelian dialectics: Thesis • Antithesis • Synthesis.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech](https://img.shields.io/badge/tech-React%20%7C%20TypeScript%20%7C%20Gemini-green)

---

### 🌐 Languages / Языки
[**English**](README.md) | [Русский](readme/README_RU.md) | [Español](readme/README_ES.md) | [中文](readme/README_ZH.md) | [हिन्दी](readme/README_HI.md)

---

## 🧠 The Concept

Most prompt engineering tools focus on "tricks". This tool focuses on **methodology**. It forces a dialectical process to refine ideas:

1.  **Thesis (Initial Prompt):** Your raw, imperfect idea.
2.  **Antithesis (Dialectical Negation):** The AI critiques and negates the thesis, finding weaknesses and proposing a stronger, often more complex version.
3.  **Synthesis (The Sublation):** You combine the best of both, applying a strict output format (XML, TypeScript, COSTAR, etc.) to create a final, production-ready prompt.

## ⚡ Key Features

*   **Multilingual Core:** Built-in translation for 5 languages (EN, RU, ES, ZH, HI).
*   **Robust Translation Chain:** Uses a cascade of 6 services (Google Cloud -> Google GTX -> Lingva -> SimplyTranslate -> MyMemory -> LibreTranslate) before falling back to Gemini AI, ensuring zero-cost operation for most tasks.
*   **Dual-View Interface:** Work in the target language (e.g., English for best AI results) while seeing the interface in your native language.
*   **Persistence:** Export/Import full workspace states via JSON archives.
*   **Gemini 2.5 Integration:** Uses the latest Google Gemini models for reasoning and synthesis.

## 🛠️ Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/dialectical-prompt-synthesizer.git
    cd dialectical-prompt-synthesizer
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment**
    *   Rename `env.example.txt` to `.env`.
    *   Add your Gemini API Key (Get it from [Google AI Studio](https://aistudio.google.com/)).
    ```text
    VITE_API_KEY=your_actual_api_key_here
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🏗️ Architecture

*   **Frontend:** React 19 + TypeScript
*   **Styling:** Tailwind CSS (Slate theme)
*   **AI Logic:** @google/genai SDK (Gemini 2.5 Flash)
*   **State Management:** Local React State + JSON Archiving

## 🤝 Contributing

We welcome contributions that improve the material basis of this tool. Fork, fix, and submit a PR.

## 📄 License

MIT
