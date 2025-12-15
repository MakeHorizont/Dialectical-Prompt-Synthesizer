import React from 'react';
import { LanguageCode } from '../types';

interface LanguageSelectorProps {
  current: LanguageCode;
  onChange: (lang: LanguageCode) => void;
}

const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ current, onChange }) => {
  return (
    <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            current === lang.code
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
          }`}
          title={lang.label}
        >
          <span className="mr-1">{lang.flag}</span>
          <span className="hidden sm:inline">{lang.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
};