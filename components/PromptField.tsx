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

  // EFFECT 1: Handle LEFT -> RIGHT Translation (When data.content changes)
  // This happens when AI generates text, OR when user types in Left field.
  useEffect(() => {
    // Skip if split view is disabled
    if (!isSplitView) return;

    // If we are currently editing the right side, do not overwrite it with a forward translation
    if (isEditingRightRef.current) return;

    const sourceText = data.content;

    // Optimization: Don't re-translate if the text hasn't changed from what we last processed
    if (sourceText === lastTranslatedSourceRef.current) return;

    if (!sourceText) {
      setUserContent('');
      return;
    }

    // Debounce the Left -> Right translation
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = window.setTimeout(async () => {
      setIsTranslating(true);
      setTranslationError(false);
      // Translate Target Lang -> Interface Lang
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


  // HANDLER: User types in RIGHT field (Interface Lang)
  // We need to translate Interface Lang -> Target Lang and update parent
  const handleRightChange = (newValue: string) => {
    setUserContent(newValue);
    isEditingRightRef.current = true; // Lock Left->Right updates

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = window.setTimeout(async () => {
      setIsTranslating(true);
      setTranslationError(false);
      // Translate Interface Lang -> Target Lang
      const translatedToTarget = await translateText(newValue, targetLang, interfaceLang);
      
      if (translatedToTarget !== null) {
          // Update parent (this will update data.content)
          onChange(translatedToTarget);
          // Update our reference so the useEffect hook knows this version of data.content is "known"
          lastTranslatedSourceRef.current = translatedToTarget;
      } else {
          setTranslationError(true);
      }
      
      setIsTranslating(false);
      isEditingRightRef.current = false; // Release lock
    }, 1000);
  };

  // HANDLER: User types in LEFT field (Target Lang)
  const handleLeftChange = (newValue: string) => {
    // If user types left, we want normal React behavior + trigger the Effect above
    isEditingRightRef.current = false; // Ensure lock is off
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
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      
      {/* Label Row if Split View */}
      {isSplitView && (
        <div className="flex text-xs font-bold text-slate-500 uppercase tracking-wide px-1">
          <div className="w-1/2 pr-2 flex justify-between">
            <span>{translations.original_view}</span>
          </div>
          <div className="w-1/2 pl-2 border-l border-slate-300 flex justify-between">
             <span>{translations.translated_view}</span>
             {isTranslating && <span className="text-indigo-500 animate-pulse">↻ Syncing...</span>}
             {translationError && <span className="text-red-500" title="Translation failed. Check API key.">⚠️ Error</span>}
          </div>
        </div>
      )}

      <div className={`relative group grid ${isSplitView ? 'grid-cols-2 gap-4' : 'grid-cols-1'}`}>
        
        {/* Main Editor (Target Language) */}
        <div className="relative">
             <textarea
              value={data.content}
              onChange={(e) => handleLeftChange(e.target.value)}
              placeholder={placeholder}
              readOnly={readOnly}
              className={`w-full h-64 p-4 text-sm font-mono text-slate-800 bg-slate-50 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none outline-none transition-shadow ${translationError ? 'border-red-300' : 'border-slate-300'}`}
            />
            {/* Lang Badge */}
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] rounded font-bold uppercase pointer-events-none opacity-50">
                {targetLang}
            </div>
        </div>

        {/* Translation View (Interface Language) - NOW EDITABLE */}
        {isSplitView && (
          <div className="relative">
            <textarea
              value={userContent}
              onChange={(e) => handleRightChange(e.target.value)}
              placeholder={isTranslating ? "Translating..." : "Translation will appear here..."}
              readOnly={readOnly} 
              className={`w-full h-64 p-4 text-sm font-mono text-slate-700 bg-white border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none outline-none transition-shadow ${translationError ? 'border-red-300' : 'border-slate-300'}`}
            />
             {/* Lang Badge */}
             <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] rounded font-bold uppercase pointer-events-none opacity-70">
                {interfaceLang}
            </div>
          </div>
        )}

      </div>

      <div className="flex items-center justify-between mt-1">
        <div className="flex gap-2">
            <button
                onClick={handleExport}
                className="text-xs flex items-center gap-1 px-2 py-1 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                title="Export Target Language Prompt"
            >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                {translations.export}
            </button>
            <button
                onClick={handleImportClick}
                className="text-xs flex items-center gap-1 px-2 py-1 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
            >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                {translations.import}
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".txt"
            />
        </div>
        
        <div className="flex gap-2">
             {extraActions}
        </div>
      </div>
    </div>
  );
};