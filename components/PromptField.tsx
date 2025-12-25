import React, { useRef, useEffect, useState } from 'react';
import { PromptData, TranslationSet, LanguageCode } from '../types';
import { translateText } from '../services/translationService';

interface PromptFieldProps {
  data: PromptData;
  onChange: (value: string) => void;
  translations: TranslationSet;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  extraActions?: React.ReactNode;
  interfaceLang: LanguageCode;
  targetLang: LanguageCode;
}

export const PromptField: React.FC<PromptFieldProps> = ({
  data,
  onChange,
  translations,
  placeholder,
  readOnly = false,
  className = "",
  extraActions,
  interfaceLang,
  targetLang
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for the Right Field (User Language)
  const [userContent, setUserContent] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(false);
  
  // Refs to manage debounce and race conditions
  const isEditingRightRef = useRef(false);
  const debounceTimerRef = useRef<number | null>(null);
  const lastTranslatedSourceRef = useRef<string>('');

  const isSplitView = interfaceLang !== targetLang;

  // EFFECT 1: Handle LEFT -> RIGHT Translation
  useEffect(() => {
    if (!isSplitView) return;
    if (isEditingRightRef.current) return;

    const sourceText = data.content;
    if (sourceText === lastTranslatedSourceRef.current) return;

    if (!sourceText) {
      setUserContent('');
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = window.setTimeout(async () => {
      setIsTranslating(true);
      setTranslationError(false);
      const translation = await translateText(sourceText, interfaceLang, targetLang);
      
      if (translation !== null) {
          setUserContent(translation);
          lastTranslatedSourceRef.current = sourceText;
      } else {
          setTranslationError(true);
      }
      setIsTranslating(false);
    }, 800);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [data.content, interfaceLang, targetLang, isSplitView]);


  // HANDLER: User types in RIGHT field
  const handleRightChange = (newValue: string) => {
    setUserContent(newValue);
    isEditingRightRef.current = true;

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = window.setTimeout(async () => {
      setIsTranslating(true);
      setTranslationError(false);
      const translatedToTarget = await translateText(newValue, targetLang, interfaceLang);
      
      if (translatedToTarget !== null) {
          onChange(translatedToTarget);
          lastTranslatedSourceRef.current = translatedToTarget;
      } else {
          setTranslationError(true);
      }
      
      setIsTranslating(false);
      isEditingRightRef.current = false;
    }, 1000);
  };

  const handleLeftChange = (newValue: string) => {
    isEditingRightRef.current = false;
    onChange(newValue);
  };

  const handleExport = () => {
    const blob = new Blob([data.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.id}_prompt.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          handleLeftChange(text);
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      
      {isSplitView && (
        <div className="flex shrink-0 text-xs font-bold text-slate-500 uppercase tracking-wide px-4 py-2 bg-slate-50/50 border-b border-slate-200">
          <div className="w-1/2 pr-2 flex justify-between items-center">
            <span>{translations.original_view}</span>
          </div>
          <div className="w-1/2 pl-4 border-l border-slate-300 flex justify-between items-center">
             <span>{translations.translated_view}</span>
             <div className="flex items-center gap-2">
                {isTranslating && <span className="text-indigo-500 animate-pulse text-[10px]">↻ {translations.syncing}</span>}
                {translationError && <span className="text-red-500 text-[10px]" title="Error">⚠️ {translations.error}</span>}
             </div>
          </div>
        </div>
      )}

      <div className={`flex-1 relative group grid min-h-0 ${isSplitView ? 'grid-cols-2' : 'grid-cols-1'}`}>
        
        <div className="relative flex flex-col h-full border-r border-slate-100 last:border-r-0">
             <textarea
              value={data.content}
              onChange={(e) => handleLeftChange(e.target.value)}
              placeholder={placeholder}
              readOnly={readOnly}
              className={`flex-1 w-full p-6 text-sm font-mono text-slate-800 bg-slate-50 border-none focus:ring-0 resize-none outline-none transition-all placeholder:text-slate-300`}
            />
            <div className="absolute bottom-4 right-4 px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] rounded font-bold uppercase pointer-events-none opacity-50 z-10">
                {targetLang}
            </div>
        </div>

        {isSplitView && (
          <div className="relative flex flex-col h-full">
            <textarea
              value={userContent}
              onChange={(e) => handleRightChange(e.target.value)}
              placeholder={isTranslating ? translations.placeholder_translating : translations.placeholder_translation}
              readOnly={readOnly} 
              className={`flex-1 w-full p-6 text-sm font-mono text-slate-700 bg-white border-none focus:ring-0 resize-none outline-none transition-all placeholder:text-slate-200`}
            />
             <div className="absolute bottom-4 right-4 px-1.5 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] rounded font-bold uppercase pointer-events-none opacity-70 z-10">
                {interfaceLang}
            </div>
          </div>
        )}

      </div>

      <div className="flex shrink-0 items-center justify-between px-4 py-3 bg-slate-50/50 border-t border-slate-200">
        <div className="flex gap-4">
            <button
                onClick={handleExport}
                className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                title="Export as TXT"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                {translations.export}
            </button>
            <button
                onClick={handleImportClick}
                className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                title="Import from TXT"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                {translations.import}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt" />
        </div>
        
        <div className="flex gap-2">
             {extraActions}
        </div>
      </div>
    </div>
  );
};