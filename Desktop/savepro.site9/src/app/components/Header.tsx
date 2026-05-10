import { Link } from "react-router";
import { Download, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
            <Download className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
            Save<span className="text-blue-600 dark:text-blue-500">Pro</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 hidden dark:block" />
            <Moon className="h-5 w-5 block dark:hidden" />
          </button>
        </div>
      </div>
    </header>
  );
}
