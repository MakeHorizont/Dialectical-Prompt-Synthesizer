
import React, { useState, useRef } from 'react';
import { TRANSLATIONS, INITIAL_STATE } from './constants';
// Fixed: Added missing import for TranslationSet type
import { AppState, LanguageCode, PromptFormat, PromptData, AppMode, TranslationSet } from './types';
import { generateAntithesis, generateSynthesis } from './services/geminiService';
import { CollapsibleSection } from './components/CollapsibleSection';
import { PromptField } from './components/PromptField';
import { LanguageSelector } from './components/LanguageSelector';
import { StructuredGenerator } from './components/StructuredGenerator';

const App: React.FC = () => {
  const [lang, setLang] = useState<LanguageCode>('en'); // Interface Language
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  
  const t = TRANSLATIONS[lang];
  const archiveInputRef = useRef<HTMLInputElement>(null);

  // --- Actions ---

  const handlePromptChange = (key: keyof AppState, value: string) => {
    setState(prev => {
        const currentData = (prev as any)[key] as PromptData;
        if (typeof currentData === 'object' && currentData !== null && 'content' in currentData) {
             return {
                ...prev,
                [key]: { ...currentData, content: value, isModified: true }
            };
        }
        return prev;
    });
  };

  const handleTargetLangChange = (newTarget: LanguageCode) => {
      setState(prev => ({ ...prev, targetLanguage: newTarget }));
  };

  const handleImprove = async () => {
    if (!state.initial.content) return;

    setState(prev => ({ ...prev, isImproving: true, showImproved: true }));
    const antithesis = await generateAntithesis(state.initial.content, state.targetLanguage);
    
    setState(prev => ({
      ...prev,
      isImproving: false,
      improved: { ...prev.improved, content: antithesis, isModified: false }
    }));
  };

  const handleFormatChange = async (format: PromptFormat) => {
    setState(prev => ({ 
        ...prev, 
        selectedFormat: format, 
        isSynthesizing: true, 
        showSynthesis: true 
    }));

    const synthesis = await generateSynthesis(
      state.improved.content, 
      format, 
      state.targetLanguage,
      undefined,
      state.initial.content,
      state.improved.content
    );

    setState(prev => ({
      ...prev,
      isSynthesizing: false,
      synthesized: { ...prev.synthesized, content: synthesis, isModified: false }
    }));
  };

  const handleRefinement = async () => {
    if (!state.refinementRequest || !state.selectedFormat) return;
    setState(prev => ({ ...prev, isSynthesizing: true }));
    const currentSynthesis = state.synthesized.content; 
    const refined = await generateSynthesis(
      currentSynthesis,
      state.selectedFormat, 
      state.targetLanguage, 
      state.refinementRequest,
      state.initial.content,
      state.improved.content
    );
    setState(prev => ({
      ...prev,
      isSynthesizing: false,
      synthesized: { ...prev.synthesized, content: refined },
      refinementRequest: ''
    }));
  };

  const handleExportArchive = () => {
    const blob = new Blob([JSON.stringify({ timestamp: Date.now(), state }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logic_lab_workspace_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportArchive = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const json = JSON.parse(ev.target?.result as string);
          if (json.state) setState(json.state);
        } catch (err) { alert('Invalid file'); }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.05)] shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-slate-100">L</div>
             <div>
                <h1 className="text-xl font-black text-slate-900 leading-tight tracking-tighter uppercase">{t.header_title}</h1>
                <p className="text-[10px] text-slate-400 tracking-[0.2em] font-black uppercase opacity-80">{t.header_subtitle}</p>
             </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
             <button 
                onClick={() => setState(prev => ({ ...prev, mode: 'dialectic' }))}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${state.mode === 'dialectic' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                {t.mode_dialectic}
             </button>
             <button 
                onClick={() => setState(prev => ({ ...prev, mode: 'structural' }))}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${state.mode === 'structural' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                {t.mode_structural}
             </button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-6">
             <div className="flex gap-4">
                <button onClick={handleExportArchive} className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">{t.export_archive}</button>
                <button onClick={() => archiveInputRef.current?.click()} className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">{t.import_archive}</button>
                <input type="file" ref={archiveInputRef} className="hidden" accept=".json" onChange={handleImportArchive} />
             </div>
             
             <div className="h-8 w-px bg-slate-200 hidden lg:block"></div>
             
             <div className="flex gap-4 items-center">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-black text-slate-300 text-center lg:text-left">{t.interface_language}</span>
                    <LanguageSelector current={lang} onChange={setLang} />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-black text-indigo-300 text-center lg:text-left">{t.target_prompt_language}</span>
                    <LanguageSelector current={state.targetLanguage} onChange={handleTargetLangChange} />
                </div>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 bg-slate-50">
        {state.mode === 'dialectic' ? (
          <div className="space-y-12 bg-slate-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <section className="space-y-6">
                <CollapsibleSection title={t.initial_prompt} className="border-slate-300 border-2">
                  <PromptField 
                    data={state.initial} 
                    onChange={(val) => handlePromptChange('initial', val)} 
                    translations={t}
                    placeholder={t.placeholder_enter}
                    interfaceLang={lang}
                    targetLang={state.targetLanguage}
                  />
                </CollapsibleSection>
                <button 
                  onClick={handleImprove}
                  disabled={state.isImproving || !state.initial.content}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-[0.3em] text-sm hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {state.isImproving && <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                  {t.improve_button}
                </button>
              </section>

              {state.showImproved && (
                <section className="space-y-6 animate-fade-in-up">
                   <CollapsibleSection title={t.improved_prompt} className="border-indigo-400 border-2 bg-indigo-50/10">
                      <PromptField 
                        data={state.improved} 
                        onChange={(val) => handlePromptChange('improved', val)} 
                        translations={t}
                        interfaceLang={lang}
                        targetLang={state.targetLanguage}
                      />
                   </CollapsibleSection>
                </section>
              )}
            </div>

            {state.showImproved && (
              <div className="border-t-2 border-slate-200 pt-12 animate-fade-in">
                  <div className="flex flex-col items-center gap-6 mb-10">
                      <div className="text-center">
                        <span className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.4em] block mb-2">{t.process_step} {state.isSynthesizing ? '...' : 'Systemic Output'}</span>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{t.mode_dialectic}</h2>
                        <p className="text-xs text-slate-500 mt-2">{t.dialectical_desc}</p>
                      </div>
                      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
                          {Object.values(PromptFormat).map((fmt) => (
                              <button
                                  key={fmt}
                                  onClick={() => handleFormatChange(fmt)}
                                  className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${state.selectedFormat === fmt ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
                              >
                                  {TRANSLATIONS[lang][`format_${fmt === PromptFormat.TYPESCRIPT ? 'typescript' : fmt === PromptFormat.XML ? 'xml' : fmt === PromptFormat.PSEUDOCODE ? 'pseudo' : 'costar'}` as keyof TranslationSet] || fmt}
                              </button>
                          ))}
                      </div>
                  </div>

                  {state.showSynthesis && (
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-2xl overflow-hidden ring-1 ring-indigo-50">
                            <div className="bg-indigo-600 px-6 py-3 flex items-center justify-between">
                               <span className="text-white text-xs font-black uppercase tracking-widest">{t.synthesized_prompt}</span>
                               <span className="text-indigo-200 text-[10px] font-mono">{state.selectedFormat}</span>
                            </div>
                            <div className="p-1 min-h-[400px]">
                                <PromptField 
                                    data={state.synthesized}
                                    onChange={(val) => handlePromptChange('synthesized', val)}
                                    translations={t}
                                    interfaceLang={lang}
                                    targetLang={state.targetLanguage}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-sm items-center">
                            <div className="pl-4">
                               <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                            </div>
                            <input 
                                type="text" 
                                value={state.refinementRequest}
                                onChange={(e) => setState(prev => ({ ...prev, refinementRequest: e.target.value }))}
                                placeholder={t.refinement_request}
                                className="flex-1 border-none focus:ring-0 text-sm font-medium px-2 text-slate-700 placeholder-slate-400 outline-none"
                                onKeyDown={(e) => e.key === 'Enter' && handleRefinement()}
                            />
                            <button 
                                onClick={handleRefinement}
                                disabled={state.isSynthesizing || !state.refinementRequest}
                                className="bg-slate-900 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:bg-black disabled:opacity-20"
                            >
                                {t.submit}
                            </button>
                        </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        ) : (
          <StructuredGenerator 
             state={state} 
             setState={setState} 
             translations={t} 
             interfaceLang={lang} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
