# Sintetizador Dialéctico de Prompts

**Una interfaz sistemática para la ingeniería de prompts basada en la dialéctica hegeliana: Tesis • Antítesis • Síntesis.**

---

### 🌐 Navegación
[English](../README.md) | [Русский](README_RU.md) | [**Español**](README_ES.md) | [中文](README_ZH.md) | [हिन्दी](README_HI.md)

---

## 🧠 El Concepto

La mayoría de las herramientas se centran en "trucos". Esta herramienta se centra en la **metodología**. Fuerza un proceso dialéctico para refinar ideas:

1.  **Tesis (Prompt Inicial):** Tu idea cruda e imperfecta.
2.  **Antítesis (Negación Dialéctica):** La IA critica y niega la tesis, encontrando debilidades y proponiendo una versión más fuerte.
3.  **Síntesis (La Superación):** Combinas lo mejor de ambos, aplicando un formato de salida estricto para crear un prompt final listo para producción.

## ⚡ Características Clave

*   **Núcleo Multilingüe:** Soporte integrado para 5 idiomas.
*   **Cadena de Traducción Robusta:** Utiliza una cascada de 6 servicios gratuitos antes de recurrir a Gemini AI.
*   **Interfaz de Vista Dual:** Trabaja en el idioma de destino mientras ves la interfaz en tu idioma nativo.
*   **Persistencia:** Exportación/Importación de estados de trabajo a través de archivos JSON.

## 🛠️ Instalación

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/your-username/dialectical-prompt-synthesizer.git
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configuración**
    *   Renombra `env.example.txt` a `.env`.
    *   Añade tu API Key de Gemini.
    ```text
    VITE_API_KEY=tu_clave_aqui
    ```

4.  **Ejecutar**
    ```bash
    npm run dev
    ```
