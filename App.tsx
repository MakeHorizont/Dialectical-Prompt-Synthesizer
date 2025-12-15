import React, { useState, useRef } from 'react';
import { TRANSLATIONS, INITIAL_STATE } from './constants';
import { AppState, LanguageCode, PromptFormat, PromptData } from './types';
import { generateAntithesis, generateSynthesis } from './services/geminiService';
import { CollapsibleSection } from './components/CollapsibleSection';
import { PromptField } from './components/PromptField';
import { LanguageSelector } from './components/LanguageSelector';

const App: React.FC = () => {
  const [lang, setLang] = useState<LanguageCode>('en'); // Interface Language
  // We use state.targetLanguage for output language
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  
  const t = TRANSLATIONS[lang];
  const archiveInputRef = useRef<HTMLInputElement>(null);

  // --- Actions ---

  const handlePromptChange = (key: keyof AppState, value: string) => {
    setState(prev => {
        // Safe check to ensure we are modifying a PromptData object
        const currentData = prev[key] as PromptData;
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
    
    // Pass target language to service
    const antithesis = await generateAntithesis(state.initial.content, state.targetLanguage);
    
    setState(prev => ({
      ...prev,
      isImproving: false,
      improved: { ...prev.improved, content: antithesis, isModified: false }
    }));
  };

  const handleSelectSource = (source: 'initial' | 'improved') => {
    setState(prev => ({ ...prev, selectedSource: source }));
  };

  const handleFormatChange = async (format: PromptFormat) => {
    const sourceContent = state.selectedSource === 'initial' 
      ? state.initial.content 
      : state.improved.content;
      
    setState(prev => ({ 
        ...prev, 
        selectedFormat: format, 
        isSynthesizing: true, 
        showSynthesis: true 
    }));

    // Pass target language to service
    const synthesis = await generateSynthesis(sourceContent, format, state.targetLanguage);

    setState(prev => ({
      ...prev,
      isSynthesizing: false,
      synthesized: { ...prev.synthesized, content: synthesis, isModified: false }
    }));
  };

  const handleRefinement = async () => {
    if (!state.refinementRequest || !state.selectedFormat) return;

    setState(prev => ({ ...prev, isSynthesizing: true }));

    const sourceContent = state.synthesized.content; 
    
    // Pass full context: Source, Format, TargetLang, Request, Thesis, Antithesis
    const refined = await generateSynthesis(
      sourceContent, 
      state.selectedFormat, 
      state.targetLanguage, 
      state.refinementRequest,
      state.initial.content,   // Context: Thesis
      state.improved.content   // Context: Antithesis
    );

    setState(prev => ({
      ...prev,
      isSynthesizing: false,
      synthesized: { ...prev.synthesized, content: refined },
      refinementRequest: ''
    }));
  };

  // --- Persistence ---

  const handleExportArchive = () => {
    const archiveData = {
      timestamp: Date.now(),
      state: state
    };
    const blob = new Blob([JSON.stringify(archiveData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_dialectic_archive_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportArchive = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (json.state && json.state.initial) {
            setState(json.state);
          } else {
            alert('Invalid archive format');
          }
        } catch (err) {
          alert('Error parsing archive');
        }
      };
      reader.readAsText(file);
    }
    if (archiveInputRef.current) archiveInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-auto md:h-20 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">D</div>
             <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">{t.header_title}</h1>
                <p className="text-xs text-slate-500 tracking-wider font-medium">{t.header_subtitle}</p>
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
             {/* Global Actions */}
             <div className="flex gap-2 order-2 md:order-1">
                <button onClick={handleExportArchive} className="text-xs text-slate-600 hover:text-indigo-600 underline px-2">{t.export_archive}</button>
                <button onClick={() => archiveInputRef.current?.click()} className="text-xs text-slate-600 hover:text-indigo-600 underline px-2">{t.import_archive}</button>
                <input type="file" ref={archiveInputRef} className="hidden" accept=".json" onChange={handleImportArchive} />
             </div>
             
             <div className="h-6 w-px bg-slate-200 hidden md:block order-md-2"></div>
             
             {/* Language Selectors */}
             <div className="flex flex-col sm:flex-row gap-2 order-1 md:order-3">
                 <div className="flex flex-col gap-1">
                     <span className="text-[10px] uppercase font-bold text-slate-400 pl-1">{t.interface_language}</span>
                     <LanguageSelector current={lang} onChange={setLang} />
                 </div>
                 <div className="hidden sm:block w-px bg-slate-200 mx-2"></div>
                 <div className="flex flex-col gap-1">
                     <span className="text-[10px] uppercase font-bold text-indigo-400 pl-1">{t.target_prompt_language}</span>
                     <LanguageSelector current={state.targetLanguage} onChange={handleTargetLangChange} />
                 </div>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Thesis & Antithesis Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Thesis */}
          <section className="space-y-4">
            <CollapsibleSection title={t.initial_prompt} defaultOpen={true}>
              <PromptField 
                data={state.initial} 
                onChange={(val) => handlePromptChange('initial', val)} 
                translations={t}
                placeholder={t.placeholder_enter}
                interfaceLang={lang}
                targetLang={state.targetLanguage}
              />
            </CollapsibleSection>

            {/* Step 2 Trigger */}
            <div className="flex items-center justify-between">
                <button 
                  onClick={handleImprove}
                  disabled={state.isImproving || !state.initial.content}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-white shadow-sm transition-all
                    ${state.isImproving || !state.initial.content 
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                    }`}
                >
                  {state.isImproving ? (
                     <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  )}
                  {t.improve_button}
                </button>

                {state.initial.content && (
                    <button 
                        onClick={() => handleSelectSource('initial')}
                        className={`px-4 py-2 rounded-md font-medium border text-sm transition-colors ${state.selectedSource === 'initial' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'}`}
                    >
                        {state.selectedSource === 'initial' && <span className="mr-2">✓</span>}
                        {t.select_prompt}
                    </button>
                )}
            </div>
          </section>

          {/* Antithesis */}
          {state.showImproved && (
            <section className="space-y-4 animate-fade-in-up">
               <CollapsibleSection title={t.improved_prompt} defaultOpen={true} className="border-indigo-100 ring-1 ring-indigo-50">
                  <PromptField 
                    data={state.improved} 
                    onChange={(val) => handlePromptChange('improved', val)} 
                    translations={t}
                    className="bg-indigo-50/30"
                    interfaceLang={lang}
                    targetLang={state.targetLanguage}
                  />
               </CollapsibleSection>

               <div className="flex justify-end">
                    <button 
                        onClick={() => handleSelectSource('improved')}
                        className={`px-4 py-2 rounded-md font-medium border text-sm transition-colors ${state.selectedSource === 'improved' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'}`}
                    >
                         {state.selectedSource === 'improved' && <span className="mr-2">✓</span>}
                        {t.select_prompt}
                    </button>
               </div>
            </section>
          )}

        </div>

        {/* Synthesis Phase */}
        {state.selectedSource && (
            <div className="border-t border-slate-200 pt-8 mt-8 space-y-6 animate-fade-in-up">
                
                {/* Format Selection */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <label className="text-sm font-semibold text-slate-700">{t.output_format}</label>
                    <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        {Object.values(PromptFormat).map((fmt) => (
                            <button
                                key={fmt}
                                onClick={() => handleFormatChange(fmt)}
                                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${state.selectedFormat === fmt ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                {fmt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Synthesis Output */}
                {state.showSynthesis && (
                    <div className="max-w-4xl mx-auto space-y-4">
                        <CollapsibleSection title={t.synthesized_prompt} defaultOpen={true} className="border-purple-200 shadow-md">
                            <PromptField 
                                data={state.synthesized}
                                onChange={(val) => handlePromptChange('synthesized', val)}
                                translations={t}
                                className="min-h-[300px]"
                                interfaceLang={lang}
                                targetLang={state.targetLanguage}
                            />
                        </CollapsibleSection>

                        {/* Refinement Loop */}
                        <div className="flex gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm items-center">
                            <input 
                                type="text" 
                                value={state.refinementRequest}
                                onChange={(e) => setState(prev => ({ ...prev, refinementRequest: e.target.value }))}
                                placeholder={t.refinement_request}
                                className="flex-1 border-none focus:ring-0 text-sm px-2 text-slate-700 bg-transparent placeholder-slate-400 outline-none"
                                onKeyDown={(e) => e.key === 'Enter' && handleRefinement()}
                            />
                            <button 
                                onClick={handleRefinement}
                                disabled={state.isSynthesizing || !state.refinementRequest}
                                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded text-sm font-medium disabled:opacity-50 transition-colors"
                            >
                                {state.isSynthesizing ? '...' : t.submit}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}

      </main>
    </div>
  );
};

export default App;