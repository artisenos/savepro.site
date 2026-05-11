import { Link } from "react-router";
import { Download, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
            <Download className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl md:text-2xl tracking-tight text-slate-900 dark:text-white">
            Save<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Pro</span>
          </span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-8 mx-auto">
          <Link to="/#features" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors uppercase tracking-wider">{t('features')}</Link>
          <Link to="/#how-to-use" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors uppercase tracking-wider">{t('howToUse')}</Link>
          <Link to="/#faq" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors uppercase tracking-wider">{t('faq')}</Link>
          <Link to="/contact" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors uppercase tracking-wider">{t('contact') || 'Contact'}</Link>
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label={theme === "dark" ? t('lightMode') : t('darkMode')}
          >
            <Sun className="h-5 w-5 hidden dark:block" />
            <Moon className="h-5 w-5 block dark:hidden" />
          </button>
        </div>
      </div>
    </header>
  );
}

