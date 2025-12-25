import { Translations, AppState, PromptFormat, LanguageCode } from './types';

// Canonical English templates
export const PURPOSE_TEMPLATES: Record<string, string[]> = {
  "Creative Writing": ["Genre", "Plot Summary", "Main Characters", "Protagonist Motivation", "Tone/Atmosphere", "World Setting", "Core Conflict", "Narrative Theme", "Target Audience"],
  "Technical Documentation": ["Technology/Product", "Document Type", "Primary Audience", "Complexity Level", "Key Features", "Installation Steps", "API Reference Needs"],
  "Code Generation": ["Programming Language", "Framework/Library", "Primary Functionality", "Input Structure", "Expected Output", "Algorithm Constraints"],
  "Bug Debugging": ["Environment", "Error Message", "Observed Behavior", "Expected Behavior", "Steps to Reproduce", "Recent Changes"],
  "UI/UX Design Advice": ["Platform", "User Persona", "User Goal", "Design System", "Accessibility", "Layout Priorities"],
  "Marketing Copy": ["Product/Service", "Unique Selling Proposition", "Target Demographic", "Call to Action", "Tone of Voice"],
  "SEO Optimization": ["Focus Keyword", "Secondary Keywords", "Search Intent", "Competitor URL", "Minimum Word Count"],
  "Academic Research": ["Thesis Statement", "Subject Area", "Research Question", "Methodology", "Theoretical Framework"],
  "Data Summarization": ["Source Description", "Input Format", "Key Metrics", "Synthesis Method", "Output Format"],
  "Language Translation": ["Source Text", "Source Language", "Target Language", "Regional Dialect", "Tone (Formal/Informal)"],
  "Persona Roleplay": ["Name/Identity", "Professional Background", "Personal History", "Speaking Pattern", "Core Knowledge"],
  "Other": ["Primary Objective", "Core Context", "Rules & Constraints", "Formatting Instructions", "Desired Persona"]
};

// Instant lookup dictionary for all keys across all supported languages
export const FIELD_DICTIONARY: Record<string, Record<LanguageCode, string>> = {
  "Genre": { en: "Genre", ru: "Жанр", es: "Género", zh: "流派", hi: "शैली" },
  "Plot Summary": { en: "Plot Summary", ru: "Краткий сюжет", es: "Resumen de la trama", zh: "剧情摘要", hi: "कथानक सारांश" },
  "Main Characters": { en: "Main Characters", ru: "Главные герои", es: "Personajes principales", zh: "主要角色", hi: "मुख्य पात्र" },
  "Protagonist Motivation": { en: "Protagonist Motivation", ru: "Мотивация героя", es: "Motivación del protagonista", zh: "主角动机", hi: "नायक की प्रेरणा" },
  "Tone/Atmosphere": { en: "Tone/Atmosphere", ru: "Тон и атмосфера", es: "Tono/Atmósfera", zh: "语气/氛围", hi: "स्वर/वातावरण" },
  "World Setting": { en: "World Setting", ru: "Мир и сеттинг", es: "Entorno del mundo", zh: "世界设定", hi: "विश्व सेटिंग" },
  "Core Conflict": { en: "Core Conflict", ru: "Основной конфликт", es: "Conflicto central", zh: "核心冲突", hi: "मुख्य संघर्ष" },
  "Narrative Theme": { en: "Narrative Theme", ru: "Тема повествования", es: "Tema narrativo", zh: "叙事主题", hi: "कथा विषय" },
  "Target Audience": { en: "Target Audience", ru: "Целевая аудитория", es: "Público objetivo", zh: "目标受众", hi: "लक्षित दर्शक" },
  "Technology/Product": { en: "Technology/Product", ru: "Технология/Продукт", es: "Tecnología/Producto", zh: "技术/产品", hi: "तकनीк/उत्पाद" },
  "Document Type": { en: "Document Type", ru: "Тип документа", es: "Tipo de documento", zh: "文档类型", hi: "दस्ताвеज़ का प्रकार" },
  "Primary Audience": { en: "Primary Audience", ru: "Основная аудитория", es: "Audiencia principal", zh: "主要受众", hi: "प्राथमिक दर्शक" },
  "Complexity Level": { en: "Complexity Level", ru: "Уровень сложности", es: "Nivel de complejidad", zh: "复杂度", hi: "जटिलта स्तर" },
  "Key Features": { en: "Key Features", ru: "Ключевые функции", es: "Características clave", zh: "核心功能", hi: "मुख्य विशेषताएं" },
  "Installation Steps": { en: "Installation Steps", ru: "Шаги установки", es: "Pasos de instalación", zh: "安装步骤", hi: "स्थापना चरण" },
  "API Reference Needs": { en: "API Reference Needs", ru: "Требования к API", es: "Necesidades de API", zh: "API 参考需求", hi: "API संदर्भ आवश्यकताएं" },
  "Programming Language": { en: "Programming Language", ru: "Язык программирования", es: "Lenguaje de programación", zh: "编程语言", hi: "प्रोग्रामिंग भाषा" },
  "Framework/Library": { en: "Framework/Library", ru: "Фреймворк/Библиотека", es: "Framework/Librería", zh: "框架/库", hi: "ف्रेмवर्क/लाइब्रेरी" },
  "Primary Functionality": { en: "Primary Functionality", ru: "Основной функционал", es: "Funcionalidad principal", zh: "主要功能", hi: "प्राथमिक कार्यक्षमता" },
  "Input Structure": { en: "Input Structure", ru: "Структура ввода", es: "Estructura de entrada", zh: "输入结构", hi: "इनपुट संरचना" },
  "Expected Output": { en: "Expected Output", ru: "Ожидаемый результат", es: "Resultado esperado", zh: "预期输出", hi: "अपेक्षित आउटपुट" },
  "Algorithm Constraints": { en: "Algorithm Constraints", ru: "Ограничения алгоритма", es: "Restricciones del algoritmo", zh: "算法约束", hi: "एल्गोरिथ्म बाधाएं" },
  "Environment": { en: "Environment", ru: "Окружение (ОС/Браузер)", es: "Entorno", zh: "运行环境", hi: "पर्यावरण" },
  "Error Message": { en: "Error Message", ru: "Сообщение об ошибке", es: "Mensaje de error", zh: "错误信息", hi: "त्रुटि संदेश" },
  "Observed Behavior": { en: "Observed Behavior", ru: "Наблюдаемое поведение", es: "Comportamiento observado", zh: "观察到的行为", hi: "देखा गया व्यवहार" },
  "Expected Behavior": { en: "Expected Behavior", ru: "Ожидаемое поведение", es: "Comportamiento esperado", zh: "预期行为", hi: "अपेक्षित व्यवहार" },
  "Steps to Reproduce": { en: "Steps to Reproduce", ru: "Шаги воспроизведения", es: "Pasos para reproducir", zh: "复现步骤", hi: "पुनरुत्पादन के चरण" },
  "Recent Changes": { en: "Recent Changes", ru: "Последние изменения", es: "Cambios recientes", zh: "最近更改", hi: "हाल के परिवर्तन" },
  "Platform": { en: "Platform", ru: "Платформа", es: "Plataforma", zh: "平台", hi: "प्लेटफ़ॉर्म" },
  "User Persona": { en: "User Persona", ru: "Персонаж пользователя", es: "Persona del usuario", zh: "用户画像", hi: "उपयोगकर्ता व्यक्तित्व" },
  "User Goal": { en: "User Goal", ru: "Цель пользователя", es: "Meta del usuario", zh: "用户目标", hi: "उपयोगकर्ता लक्ष्य" },
  "Design System": { en: "Design System", ru: "Дизайн-система", es: "Sistema de diseño", zh: "设计系统", hi: "डिज़ाइन सिस्टम" },
  "Accessibility": { en: "Accessibility", ru: "Доступность (ARIA)", es: "Accesibilidad", zh: "无障碍支持", hi: "सुगम्यता" },
  "Layout Priorities": { en: "Layout Priorities", ru: "Приоритеты макета", es: "Prioridades de diseño", zh: "布局优先级", hi: "लेआउट प्राथमिकताएं" },
  "Product/Service": { en: "Product/Service", ru: "Продукт/Услуга", es: "Producto/Servicio", zh: "产品/服务", hi: "उत्पाद/सेवा" },
  "Unique Selling Proposition": { en: "Unique Selling Proposition", ru: "УТП", es: "Propuesta única", zh: "独特销售主张", hi: "अनूठा विक्रय प्रस्ताव" },
  "Target Demographic": { en: "Target Demographic", ru: "Демография", es: "Demografía objetivo", zh: "目标人群", hi: "लक्षित जनसांख्यिकी" },
  "Call to Action": { en: "Call to Action", ru: "Призыв к действию (CTA)", es: "Llamada a la acción", zh: "行动呼吁", hi: "कॉल टू एक्शन" },
  "Tone of Voice": { en: "Tone of Voice", ru: "Тональность бренда", es: "Tono de voz", zh: "品牌语气", hi: "आवाज का लहजा" },
  "Focus Keyword": { en: "Focus Keyword", ru: "Ключевое слово", es: "Palabra clave", zh: "焦点关键词", hi: "मुख्य कीवर्ड" },
  "Secondary Keywords": { en: "Secondary Keywords", ru: "Вторичные ключи", es: "Palabras secundarias", zh: "次要关键词", hi: "द्वितीयक कीवर्ड" },
  "Search Intent": { en: "Search Intent", ru: "Интент поиска", es: "Intención de búsqueda", zh: "搜索意图", hi: "खोज इरादा" },
  "Competitor URL": { en: "Competitor URL", ru: "URL конкурента", es: "URL del competidor", zh: "竞争对手 URL", hi: "प्रतिस्पर्धी URL" },
  "Minimum Word Count": { en: "Minimum Word Count", ru: "Мин. кол-во слов", es: "Mínimo de palabras", zh: "最少字数", hi: "न्यूनतम शब्द संख्या" },
  "Thesis Statement": { en: "Thesis Statement", ru: "Тезис исследования", es: "Declaración de tesis", zh: "论文陈述", hi: "थीसिस वक्तव्य" },
  "Subject Area": { en: "Subject Area", ru: "Предметная область", es: "Área temática", zh: "学科领域", hi: "विषय क्षेत्र" },
  "Research Question": { en: "Research Question", ru: "Вопрос исследования", es: "Pregunta de investigación", zh: "研究问题", hi: "शोध प्रश्न" },
  "Methodology": { en: "Methodology", ru: "Методология", es: "Metodología", zh: "研究方法", hi: "कार्यप्रणाली" },
  "Theoretical Framework": { en: "Theoretical Framework", ru: "Теоретическая база", es: "Marco teórico", zh: "理论框架", hi: "सैद्धांतिक ढांचा" },
  "Source Description": { en: "Source Description", ru: "Описание источника", es: "Descripción de fuente", zh: "来源描述", hi: "स्रोत विवरण" },
  "Input Format": { en: "Input Format", ru: "Формат ввода", es: "Formato de entrada", zh: "输入格式", hi: "इनपुट प्रारूप" },
  "Key Metrics": { en: "Key Metrics", ru: "Ключевые метрики", es: "Métricas clave", zh: "核心指标", hi: "मुख्य मेट्रिक्स" },
  "Synthesis Method": { en: "Synthesis Method", ru: "Метод синтеза", es: "Método de síntesis", zh: "合成方法", hi: "संश्लेषण विधि" },
  "Output Format": { en: "Output Format", ru: "Формат вывода", es: "Formato de salida", zh: "输出格式", hi: "आउटपुट प्रारूप" },
  "Source Text": { en: "Source Text", ru: "Исходный текст", es: "Texto original", zh: "原文", hi: "स्रोत पाठ" },
  "Source Language": { en: "Source Language", ru: "Исходный язык", es: "Idioma original", zh: "源语言", hi: "स्रोत भाषा" },
  "Target Language": { en: "Target Language", ru: "Целевой язык", es: "Idioma de destino", zh: "目标语言", hi: "लक्ष্য भाषा" },
  "Regional Dialect": { en: "Regional Dialect", ru: "Региональный диалект", es: "Dialecto regional", zh: "地区方言", hi: "क्षेत्रীয় बोली" },
  "Tone (Formal/Informal)": { en: "Tone (Formal/Informal)", ru: "Тон (Формальный/Нет)", es: "Tono (Formal/Informal)", zh: "语气（正式/非正式）", hi: "लहजा (औपचारिक/अनौपचारिक)" },
  "Name/Identity": { en: "Name/Identity", ru: "Имя/Личность", es: "Nombre/Identidad", zh: "姓名/身份", hi: "नाम/पहचान" },
  "Professional Background": { en: "Professional Background", ru: "Проф. опыт", es: "Perfil profesional", zh: "职业背景", hi: "पेशेवर पृष्ठभूमि" },
  "Personal History": { en: "Personal History", ru: "Личная история", es: "Historia personal", zh: "个人历史", hi: "व्यक्तिगत इतिहास" },
  "Speaking Pattern": { en: "Speaking Pattern", ru: "Манера речи", es: "Patrón de habla", zh: "说话方式", hi: "बोलने का पैटर्न" },
  "Core Knowledge": { en: "Core Knowledge", ru: "Базовые знания", es: "Conocimiento base", zh: "核心知识", hi: "मुख्य ज्ञान" },
  "Primary Objective": { en: "Primary Objective", ru: "Основная задача", es: "Objetivo principal", zh: "主要目标", hi: "प्राथमिक उद्देश्य" },
  "Core Context": { en: "Core Context", ru: "Общий контекст", es: "Contexto central", zh: "核心背景", hi: "मुख्य संदर्भ" },
  "Rules & Constraints": { en: "Rules & Constraints", ru: "Правила и рамки", es: "Reglas y restricciones", zh: "规则与约束", hi: "नियम और बाधाएं" },
  "Formatting Instructions": { en: "Formatting Instructions", ru: "Инструкции формата", es: "Инструкции формата", zh: "格式指令", hi: "प्रारूपण निर्देश" },
  "Desired Persona": { en: "Desired Persona", ru: "Нужная роль/персона", es: "Persona deseada", zh: "目标角色", hi: "वांछित व्यक्तित्व" }
};

/**
 * Utility to find translated key instantly from dictionary without API calls.
 */
export const getLocalizedKeyFromDictionary = (key: string, lang: LanguageCode): string => {
  for (const canonicalKey in FIELD_DICTIONARY) {
    const translations = FIELD_DICTIONARY[canonicalKey];
    // Case-insensitive search through all known values for this key
    const match = Object.values(translations).some(v => v.toLowerCase() === key.toLowerCase());
    if (match) {
      return translations[lang];
    }
  }
  return key;
};

/**
 * Utility to find translated purpose name instantly.
 */
export const getLocalizedPurposeFromDictionary = (purpose: string, lang: LanguageCode): string => {
  const languages = Object.keys(PROMPT_PURPOSES) as LanguageCode[];
  let purposeIndex = -1;
  
  for (const l of languages) {
    const idx = PROMPT_PURPOSES[l].indexOf(purpose);
    if (idx !== -1) {
      purposeIndex = idx;
      break;
    }
  }

  if (purposeIndex !== -1) {
    return PROMPT_PURPOSES[lang][purposeIndex];
  }
  return purpose;
};

export const PROMPT_PURPOSES: Record<LanguageCode, string[]> = {
  en: Object.keys(PURPOSE_TEMPLATES),
  ru: ["Литературное творчество", "Техническая документация", "Генерация кода", "Отладка багов", "Советы по UI/UX", "Маркетинговые тексты", "SEO оптимизация", "Академическое исследование", "Саммари данных", "Перевод текста", "Ролевая игра", "Другое"],
  es: ["Escritura Creativa", "Documentación Técnica", "Generación de Código", "Depuración de Errores", "Diseño UI/UX", "Copia de Marketing", "Optimización SEO", "Investigación Académica", "Resumen de Datos", "Traducción de Idiomas", "Roleplay de Persona", "Otro"],
  zh: ["创意写作", "技术文档", "代码生成", "Bug 调试", "UI/UX 设计建议", "营销文案", "SEO 优化", "学术研究", "数据总结", "语言翻译", "角色扮演", "其他"],
  hi: ["रचनात्मक लेखन", "तकनीकी दस्तावेज़", "कोड जनरेशन", "बग डिबगिंग", "UI/UX डिज़ाइन सलाह", "मार्केटिंग कॉपी", "SEO अनुकूलन", "अकादमिक शोध", "डेटा सारांश", "भाषा अनुवाद", "व्यक्तित्व भूमिका", "अन्य"]
};

export const TRANSLATIONS: Translations = {
  en: {
    mode_dialectic: "Iterative Logic",
    mode_structural: "Modular Design",
    purpose_label: "Workspace Goal",
    initial_prompt: "Initial Concept",
    improved_prompt: "Analytical Review",
    synthesized_prompt: "Final Systemic Prompt",
    improve_button: "Analyze & Refine",
    select_prompt: "Select",
    output_format: "Data Format",
    refinement_request: "Optimization Request",
    submit: "Apply Changes",
    export: "Export",
    import: "Import",
    export_archive: "Save Workspace",
    import_archive: "Load Workspace",
    header_title: "Logic Lab",
    header_subtitle: "Structure • Efficiency • Result",
    placeholder_enter: "Enter your initial idea or requirements...",
    interface_language: "Interface",
    target_prompt_language: "AI Target Language",
    translated_view: "Review Translation",
    original_view: "Source Data",
    add_field: "Add Module",
    add_step: "Add Step",
    syncing: "Optimizing...",
    error: "System Error",
    placeholder_translation: "Review will appear here...",
    placeholder_translating: "Processing...",
    step_label: "Step",
    key_label: "Label",
    value_label: "Content",
    dialectical_desc: "Evolutionary growth: Integrating feedback into a refined structure",
    process_step: "Process Iteration",
    confirm_delete: "Confirm module removal?",
    move_up: "Prioritize Up",
    move_down: "Prioritize Down",
    format_typescript: "TypeScript Module",
    format_xml: "Structured XML",
    format_pseudo: "Logical Flow",
    format_costar: "Systemic Framework"
  },
  ru: {
    mode_dialectic: "Итеративная Логика",
    mode_structural: "Модульная Сборка",
    purpose_label: "Цель Проекта",
    initial_prompt: "Исходный Концепт",
    improved_prompt: "Аналитический Разбор",
    synthesized_prompt: "Итоговая Система",
    improve_button: "Анализ и Уточнение",
    select_prompt: "Выбрать",
    output_format: "Формат данных",
    refinement_request: "Запрос на оптимизацию",
    submit: "Применить",
    export: "Экспорт",
    import: "Импорт",
    export_archive: "Сохранить проект",
    import_archive: "Загрузить проект",
    header_title: "Logic Lab",
    header_subtitle: "Структура • Эффективность • Результат",
    placeholder_enter: "Введите ваши идеи или требования...",
    interface_language: "Интерфейс",
    target_prompt_language: "Язык ИИ",
    translated_view: "Проверка перевода",
    original_view: "Исходные данные",
    add_field: "Добавить модуль",
    add_step: "Добавить этап",
    syncing: "Оптимизация...",
    error: "Ошибка системы",
    placeholder_translation: "Результат анализа появится здесь...",
    placeholder_translating: "Обработка...",
    step_label: "Этап",
    key_label: "Метка",
    value_label: "Содержание",
    dialectical_desc: "Эволюционное развитие: внедрение правок в общую структуру",
    process_step: "Итерация процесса",
    confirm_delete: "Подтверждаете удаление модуля?",
    move_up: "Поднять приоритет",
    move_down: "Понизить приоритет",
    format_typescript: "TypeScript Модуль",
    format_xml: "Структурированный XML",
    format_pseudo: "Логическая схема",
    format_costar: "Системный каркас"
  },
  es: {
    mode_dialectic: "Lógica Iterativa",
    mode_structural: "Diseño Modular",
    purpose_label: "Objetivo del Proyecto",
    initial_prompt: "Concepto Inicial",
    improved_prompt: "Revisión Analítica",
    synthesized_prompt: "Sistema Final",
    improve_button: "Analizar y Refinar",
    select_prompt: "Seleccionar",
    output_format: "Formato de Datos",
    refinement_request: "Solicitud de Optimización",
    submit: "Aplicar",
    export: "Exportar",
    import: "Importar",
    export_archive: "Guardar",
    import_archive: "Cargar",
    header_title: "Logic Lab",
    header_subtitle: "Estructura • Eficiencia • Resultado",
    placeholder_enter: "Ingrese su idea inicial...",
    interface_language: "Interfaz",
    target_prompt_language: "Idioma del IA",
    translated_view: "Revisión",
    original_view: "Origen",
    add_field: "Añadir Módulo",
    add_step: "Añadir Paso",
    syncing: "Optimizando...",
    error: "Error",
    placeholder_translation: "La revisión aparecerá aquí...",
    placeholder_translating: "Procesando...",
    step_label: "Paso",
    key_label: "Etiqueta",
    value_label: "Contenido",
    dialectical_desc: "Crecimiento evolutivo: integrando mejoras en la estructura",
    process_step: "Iteración",
    confirm_delete: "¿Eliminar módulo?",
    move_up: "Subir",
    move_down: "Bajar",
    format_typescript: "Módulo TypeScript",
    format_xml: "XML Estructurado",
    format_pseudo: "Flujo Lógico",
    format_costar: "Marco Sistémico"
  },
  zh: {
    mode_dialectic: "迭代逻辑",
    mode_structural: "模块化设计",
    purpose_label: "工作区目标",
    initial_prompt: "初始概念",
    improved_prompt: "分析审查",
    synthesized_prompt: "最终系统提示词",
    improve_button: "分析与优化",
    select_prompt: "选择",
    output_format: "数据格式",
    refinement_request: "优化请求",
    submit: "应用更改",
    export: "导出",
    import: "导入",
    export_archive: "保存工作区",
    import_archive: "加载工作区",
    header_title: "Logic Lab",
    header_subtitle: "结构 • 效率 • 结果",
    placeholder_enter: "输入您的初始想法或要求...",
    interface_language: "界面语言",
    target_prompt_language: "AI 目标语言",
    translated_view: "翻译审查",
    original_view: "源数据",
    add_field: "添加模块",
    add_step: "添加步骤",
    syncing: "优化中...",
    error: "系统错误",
    placeholder_translation: "审查结果将在此显示...",
    placeholder_translating: "处理中...",
    step_label: "步骤",
    key_label: "标签",
    value_label: "内容",
    dialectical_desc: "演进式增长：将反馈整合到优化结构中",
    process_step: "过程迭代",
    confirm_delete: "确认移除模块？",
    move_up: "上移",
    move_down: "下移",
    format_typescript: "TS 模块",
    format_xml: "结构化 XML",
    format_pseudo: "逻辑流",
    format_costar: "系统框架"
  },
  hi: {
    mode_dialectic: "पुनरावृत्ति तर्क",
    mode_structural: "मॉड्यूलर डिज़ाइन",
    purpose_label: "कार्यक्षेत्र लक्ष्य",
    initial_prompt: "प्रारंभिक अवधारणा",
    improved_prompt: "विश्लेषणात्मक समीक्षा",
    synthesized_prompt: "अंतिम व्यवस्थित प्रॉम्प्ट",
    improve_button: "विश्लेषण और परिष्कृत करें",
    select_prompt: "चुनें",
    output_format: "डेटा प्रारूप",
    refinement_request: "अनुकूलन अनुरोध",
    submit: "परिवर्तन लागू करें",
    export: "निर्यात",
    import: "आयात",
    export_archive: "प्रोजेक्ट सहेजें",
    import_archive: "प्रोजेक्ट लोड करें",
    header_title: "Logic Lab",
    header_subtitle: "संरचना • दक्षता • परिणाम",
    placeholder_enter: "अपना विचार या आवश्यकताएं दर्ज करें...",
    interface_language: "इंटरफ़ेस",
    target_prompt_language: "AI भाषा",
    translated_view: "अनुवाद समीक्षा",
    original_view: "स्रोत डेटा",
    add_field: "मॉड्यूल जोड़ें",
    add_step: "चरण जोड़ें",
    syncing: "अनुकूलन हो रहा है...",
    error: "सिस्टम त्रुटि",
    placeholder_translation: "समीक्षा यहाँ दिखाई देगी...",
    placeholder_translating: "प्रसंस्करण हो रहा है...",
    step_label: "चरण",
    key_label: "लेबल",
    value_label: "सामग्री",
    dialectical_desc: "विकासवादी विकास: फीडबैक को परिष्कृत संरचना में एकीकृत करना",
    process_step: "प्रक्रिया पुनरावृत्ति",
    confirm_delete: "मॉड्यूल हटाएं?",
    move_up: "ऊपर ले जाएं",
    move_down: "नीचे ले जाएं",
    format_typescript: "टाइपस्क्रिप्ट मॉड्यूल",
    format_xml: "संरचित XML",
    format_pseudo: "तार्किक प्रवाह",
    format_costar: "व्यवस्थित ढांचा"
  }
};

const DEFAULT_PURPOSE = "Creative Writing";
const INITIAL_FIELDS = PURPOSE_TEMPLATES[DEFAULT_PURPOSE].map(k => {
    const entry = FIELD_DICTIONARY[k];
    const localizedKey = entry ? entry['en'] : k;
    return {
      id: Math.random().toString(),
      key: localizedKey,
      value: ''
    };
});

export const INITIAL_STATE: AppState = {
  mode: 'dialectic',
  initial: { id: 'initial', content: '', isModified: false },
  improved: { id: 'improved', content: '', isModified: false },
  synthesized: { id: 'synthesized', content: '', isModified: false },
  selectedSource: null,
  selectedFormat: PromptFormat.COSTAR,
  targetLanguage: 'en',
  refinementRequest: '',
  isImproving: false,
  isSynthesizing: false,
  showImproved: false,
  showSynthesis: false,
  structuralPurpose: DEFAULT_PURPOSE,
  structuralFields: INITIAL_FIELDS,
  costarFields: {},
  pseudoSteps: []
};
