
export type LanguageCode = 'en' | 'ru' | 'es' | 'zh' | 'hi';

export enum PromptFormat {
  TYPESCRIPT = 'TypeScript Interface',
  XML = 'XML Tags',
  PSEUDOCODE = 'Pseudocode',
  COSTAR = 'COSTAR Framework'
}

export type AppMode = 'dialectic' | 'structural';

export interface PromptData {
  id: string;
  content: string;
  isModified: boolean;
}

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

export interface AppState {
  mode: AppMode;
  initial: PromptData;
  improved: PromptData;
  synthesized: PromptData;
  selectedSource: 'initial' | 'improved' | null;
  selectedFormat: PromptFormat | null;
  targetLanguage: LanguageCode;
  refinementRequest: string;
  isImproving: boolean;
  isSynthesizing: boolean;
  showImproved: boolean;
  showSynthesis: boolean;
  // Structural mode state
  structuralPurpose: string;
  structuralFields: KeyValuePair[];
  costarFields: Record<string, string>;
  pseudoSteps: string[];
}

export interface TranslationSet {
  mode_dialectic: string;
  mode_structural: string;
  purpose_label: string;
  initial_prompt: string;
  improved_prompt: string;
  synthesized_prompt: string;
  improve_button: string;
  select_prompt: string;
  output_format: string;
  refinement_request: string;
  submit: string;
  export: string;
  import: string;
  export_archive: string;
  import_archive: string;
  header_title: string;
  header_subtitle: string;
  placeholder_enter: string;
  interface_language: string;
  target_prompt_language: string;
  translated_view: string;
  original_view: string;
  add_field: string;
  add_step: string;
  syncing: string;
  error: string;
  placeholder_translation: string;
  placeholder_translating: string;
  step_label: string;
  key_label: string;
  value_label: string;
  dialectical_desc: string;
  process_step: string;
  confirm_delete: string;
  move_up: string;
  move_down: string;
  format_typescript: string;
  format_xml: string;
  format_pseudo: string;
  format_costar: string;
}

export type Translations = Record<LanguageCode, TranslationSet>;
