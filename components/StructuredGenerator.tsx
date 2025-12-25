import React, { useEffect, useMemo, useState, useRef } from 'react';
import { PromptFormat, AppState, KeyValuePair, LanguageCode, TranslationSet } from '../types';
import { PROMPT_PURPOSES, PURPOSE_TEMPLATES, FIELD_DICTIONARY, getLocalizedKeyFromDictionary, getLocalizedPurposeFromDictionary } from '../constants';
import { PromptField } from './PromptField';
import { translateText } from '../services/translationService';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  translations: TranslationSet;
  interfaceLang: LanguageCode;
}

export const StructuredGenerator: React.FC<Props> = ({ state, setState, translations, interfaceLang }) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  // Start with undefined to force sync on initial mount
  const prevLangRef = useRef<LanguageCode | undefined>(undefined);

  const formatOptions = [
    { value: PromptFormat.TYPESCRIPT, label: translations.format_typescript },
    { value: PromptFormat.XML, label: translations.format_xml },
    { value: PromptFormat.PSEUDOCODE, label: translations.format_pseudo },
    { value: PromptFormat.COSTAR, label: translations.format_costar },
  ];

  // EFFECT: Sync purpose and keys when interface language changes OR on component mount
  useEffect(() => {
    // If the language hasn't changed AND this isn't the first mount, skip
    if (prevLangRef.current === interfaceLang) return;

    const syncInterface = async () => {
      // 1. Find correct Purpose name for the new language
      const newPurposeName = getLocalizedPurposeFromDictionary(state.structuralPurpose, interfaceLang);

      // 2. Translate keys instantly using Dictionary, fallback to API
      const updatedFields = await Promise.all(state.structuralFields.map(async (f) => {
        if (!f.key) return f;
        
        // Instant sync from dictionary
        const localized = getLocalizedKeyFromDictionary(f.key, interfaceLang);
        
        // If the dictionary gave us a different form, update it instantly
        if (localized !== f.key) {
          return { ...f, key: localized };
        }

        // If not in dictionary, it's a custom user-defined key. Translate using online API.
        const translatedKey = await translateText(f.key, interfaceLang, 'auto');
        return { ...f, key: translatedKey || f.key };
      }));

      // Update the global state with synchronized labels
      setState(prev => ({
        ...prev,
        structuralPurpose: newPurposeName,
        structuralFields: updatedFields
      }));
      
      prevLangRef.current = interfaceLang;
    };

    syncInterface();
  }, [interfaceLang, state.structuralPurpose, setState]);

  const handlePurposeChange = (newPurpose: string) => {
    // Find canonical English key for the selected purpose to look up the template
    const idx = PROMPT_PURPOSES[interfaceLang].indexOf(newPurpose);
    const enPurposes = PROMPT_PURPOSES['en'];
    const enKey = enPurposes[idx] || "Other";
    
    // Get template keys (stored as English canonical keys in PURPOSE_TEMPLATES)
    const templateKeys = PURPOSE_TEMPLATES[enKey] || [];
    
    // Map them instantly to the current interface language using Dictionary
    const fields = templateKeys.map(k => {
       const entry = FIELD_DICTIONARY[k];
       const localizedKey = entry ? entry[interfaceLang] : k;
       return {
         id: Math.random().toString(),
         key: localizedKey,
         value: ''
       };
    });
    
    setState(prev => ({
      ...prev,
      structuralPurpose: newPurpose,
      structuralFields: fields
    }));
  };

  const constructedPrompt = useMemo(() => {
    const purpose = state.structuralPurpose;
    const format = state.selectedFormat;
    let body = `### PURPOSE: ${purpose}\n\n`;

    if (format === PromptFormat.COSTAR) {
      state.structuralFields.forEach(f => {
        if (f.key && f.value) body += `**${f.key.toUpperCase()}**: ${f.value}\n`;
      });
    } else if (format === PromptFormat.TYPESCRIPT) {
      body += `interface PromptContext {\n`;
      state.structuralFields.forEach(f => {
        if (f.key) body += `  ${f.key.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}: string;\n`;
      });
      body += `}\n\nconst input: PromptContext = {\n`;
      state.structuralFields.forEach(f => {
        if (f.key) body += `  ${f.key.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}: "${f.value.replace(/"/g, '\\"')}",\n`;
      });
      body += `};`;
    } else if (format === PromptFormat.XML) {
      state.structuralFields.forEach(f => {
        const tag = f.key.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || 'field';
        body += `<${tag}>\n  ${f.value}\n</${tag}>\n`;
      });
    } else if (format === PromptFormat.PSEUDOCODE) {
      body += `BEGIN PROMPT LOGIC\n`;
      state.structuralFields.forEach((f, i) => {
        if (f.key) body += `  STEP ${i + 1} [${f.key.toUpperCase()}]: ${f.value}\n`;
      });
      body += `END PROMPT LOGIC`;
    }

    return body;
  }, [state.structuralPurpose, state.selectedFormat, state.structuralFields]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      synthesized: { ...prev.synthesized, content: constructedPrompt }
    }));
  }, [constructedPrompt, setState]);

  const addField = () => {
    setState(prev => ({
      ...prev,
      structuralFields: [...prev.structuralFields, { id: Math.random().toString(), key: '', value: '' }]
    }));
  };

  const removeField = (id: string) => {
    if (window.confirm(translations.confirm_delete)) {
      setState(prev => ({
        ...prev,
        structuralFields: prev.structuralFields.filter(f => f.id !== id)
      }));
    }
  };

  const updateField = (id: string, keyOrValue: 'key' | 'value', text: string) => {
    setState(prev => ({
      ...prev,
      structuralFields: prev.structuralFields.map(f => f.id === id ? { ...f, [keyOrValue]: text } : f)
    }));
  };

  const handleDragStart = (id: string) => { setDraggedId(id); };
  const handleDragEnd = () => { setDraggedId(null); };
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === id) return;
    setState(prev => {
      const draggedIdx = prev.structuralFields.findIndex(f => f.id === draggedId);
      const targetIdx = prev.structuralFields.findIndex(f => f.id === id);
      const newFields = [...prev.structuralFields];
      const item = newFields.splice(draggedIdx, 1)[0];
      newFields.splice(targetIdx, 0, item);
      return { ...prev, structuralFields: newFields };
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] animate-fade-in bg-slate-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full min-h-0">
        
        {/* Left Control Column */}
        <div className="flex flex-col space-y-6 h-full min-h-0">
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-4 shrink-0">
            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">{translations.purpose_label}</label>
              <select 
                value={state.structuralPurpose}
                onChange={(e) => handlePurposeChange(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-indigo-500 outline-none transition-all cursor-pointer"
              >
                {PROMPT_PURPOSES[interfaceLang].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">{translations.output_format}</label>
              <div className="grid grid-cols-2 gap-2">
                {formatOptions.map(opt => (
                  <button 
                    key={opt.value}
                    onClick={() => setState(prev => ({ ...prev, selectedFormat: opt.value }))}
                    className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${state.selectedFormat === opt.value ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-[1.02]' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Field List */}
          <div className="flex-1 bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {state.structuralFields.map((f, index) => (
                <div 
                  key={f.id} 
                  draggable
                  onDragStart={() => handleDragStart(f.id)}
                  onDragOver={(e) => handleDragOver(e, f.id)}
                  onDragEnd={handleDragEnd}
                  className={`group bg-slate-50 p-4 rounded-xl border-2 transition-all space-y-3 relative ${draggedId === f.id ? 'opacity-30 border-dashed border-indigo-300 scale-95' : 'border-transparent hover:border-indigo-100'}`}
                >
                  <div className="absolute top-4 right-4 flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-600 transition-colors">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </div>
                    <button onClick={() => removeField(f.id)} className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <div>
                    <input 
                      value={f.key}
                      onChange={(e) => updateField(f.id, 'key', e.target.value)}
                      placeholder={translations.key_label}
                      className="w-full bg-transparent border-none p-0 text-[10px] font-black uppercase text-indigo-500 tracking-widest focus:ring-0 placeholder:text-slate-300"
                    />
                  </div>
                  <div>
                    <textarea 
                      value={f.value}
                      onChange={(e) => updateField(f.id, 'value', e.target.value)}
                      placeholder={translations.placeholder_enter}
                      className="w-full bg-white border-2 border-slate-100 rounded-lg p-3 text-sm min-h-[80px] focus:border-indigo-400 outline-none transition-all resize-none shadow-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={addField} 
              className="mt-6 w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-all hover:bg-indigo-50/30"
            >
              + {translations.add_field}
            </button>
          </div>
        </div>

        {/* Right Preview Column */}
        <div className="flex flex-col h-full min-h-0 overflow-hidden bg-slate-50">
           <div className="flex items-center justify-between px-2 mb-4 shrink-0">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">{translations.synthesized_prompt}</h3>
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">{formatOptions.find(o => o.value === state.selectedFormat)?.label || state.selectedFormat}</span>
           </div>
           <div className="flex-1 min-h-0 bg-white shadow-2xl rounded-2xl overflow-hidden border-2 border-slate-300 ring-4 ring-slate-100 flex flex-col">
              <PromptField 
                  data={state.synthesized}
                  onChange={(val) => setState(prev => ({ ...prev, synthesized: { ...prev.synthesized, content: val } }))}
                  translations={translations}
                  interfaceLang={interfaceLang}
                  targetLang={state.targetLanguage}
              />
           </div>
        </div>
      </div>
    </div>
  );
};