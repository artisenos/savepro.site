import { AlertTriangle, Gavel, ShieldAlert, Info } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Disclaimer() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-16 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 transition-all">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-amber-500/10 rounded-2xl">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('disclaimerTitle')}
          </h1>
        </div>

        <div className="space-y-12 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
          <section className="bg-amber-500/5 p-8 rounded-2xl border border-amber-500/10">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('disclaimerMain')}</h2>
            </div>
            <p className="text-xl font-medium text-slate-800 dark:text-slate-200">
              {t('disclaimerContent')}
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Gavel className="w-6 h-6 text-slate-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Legal Boundaries</h2>
            </div>
            <p>{t('disclaimerTikTok')}</p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Info className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Responsibility</h2>
            </div>
            <p>
              By using this service, you acknowledge that you are responsible for any potential copyright violations that may occur from downloading and using media. SavePro does not encourage or condone the unauthorized use of copyrighted content.
            </p>
          </section>

          <div className="mt-12 p-8 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
