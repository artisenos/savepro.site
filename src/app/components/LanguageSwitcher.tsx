import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { languages } from '../config/LanguageConfig';
import { ChevronDown, Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef} dir="ltr">
      <motion.button
        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/10 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 text-slate-700 dark:text-slate-100 transition-all shadow-lg hover:shadow-xl"
      >
        <div className="relative w-6 h-6 overflow-hidden rounded-full border-2 border-white/50 dark:border-slate-600 shadow-inner">
          <img 
            src={`https://flagcdn.com/w80/${currentLang.country}.png`} 
            alt={currentLang.name}
            className="w-full h-full object-cover scale-125"
          />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest hidden md:block">{currentLang.code}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute right-0 mt-3 w-56 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/40 dark:border-slate-800/60 shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden"
          >
            <div className="p-2 max-h-[350px] overflow-y-auto custom-scrollbar space-y-1">
              <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <Globe className="w-3 h-3" />
                Select Language
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-start text-sm transition-all duration-300 ${
                    language === lang.code 
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full overflow-hidden border-2 ${language === lang.code ? 'border-white/50' : 'border-slate-200 dark:border-slate-700'}`}>
                    <img 
                      src={`https://flagcdn.com/w80/${lang.country}.png`} 
                      alt={lang.name}
                      className="w-full h-full object-cover scale-125"
                    />
                  </div>
                  <span className="flex-1 font-medium">{lang.name}</span>
                  {language === lang.code && (
                    <motion.div layoutId="activeLang" className="w-1.5 h-1.5 rounded-full bg-white shadow-glow" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
