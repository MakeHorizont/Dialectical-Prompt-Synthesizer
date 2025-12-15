# 辩证提示合成器 (Dialectical Prompt Synthesizer)

**基于黑格尔辩证法的提示工程系统界面：正题 • 反题 • 合题。**

---

### 🌐 导航
[English](../README.md) | [Русский](README_RU.md) | [Español](README_ES.md) | [**中文**](README_ZH.md) | [हिन्दी](README_HI.md)

---

## 🧠 核心概念

大多数提示工具专注于“技巧”。本工具专注于**方法论**。它通过辩证过程来提炼思想：

1.  **正题 (初始提示):** 你原始的、不完美的想法。
2.  **反题 (辩证否定):** AI 批判并否定正题，找出弱点并提出更强的版本。
3.  **合题 (扬弃):** 你结合两者的优点，应用严格的输出格式，创建最终的生产级提示。

## ⚡ 主要功能

*   **多语言核心:** 内置 5 种语言支持。
*   **强大的翻译链:** 在回退到 Gemini AI 之前，使用 6 种免费服务的级联。
*   **双视图界面:** 在使用目标语言（如英语）工作的同时，以母语查看界面。
*   **持久化:** 通过 JSON 存档导出/导入工作区状态。

## 🛠️ 安装

1.  **克隆仓库**
    ```bash
    git clone https://github.com/your-username/dialectical-prompt-synthesizer.git
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **环境设置**
    *   将 `env.example.txt` 重命名为 `.env`。
    *   添加你的 Gemini API 密钥。
    ```text
    VITE_API_KEY=your_key_here
    ```

4.  **运行**
    ```bash
    npm run dev
    ```
