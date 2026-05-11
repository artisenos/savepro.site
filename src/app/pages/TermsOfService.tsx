import { FileText, AlertTriangle, Scale, ShieldAlert, Info } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function TermsOfService() {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-16 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 transition-all">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-purple-500/10 rounded-2xl">
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('termsTitle')}
          </h1>
        </div>

        <div className="space-y-12 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
          <section className="bg-blue-500/5 p-8 rounded-2xl border border-blue-500/10">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('termsIntro')}</h2>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('termsSec1Title')}</h2>
            </div>
            <p dangerouslySetInnerHTML={{ __html: t('termsSec1Content') }} />
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('termsSec2Title')}</h2>
            </div>
            <p dangerouslySetInnerHTML={{ __html: t('termsSec2Content') }} />
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('termsSec3Title')}</h2>
            </div>
            <p dangerouslySetInnerHTML={{ __html: t('termsSec3Content') }} />
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('termsSec4Title')}</h2>
            </div>
            <p dangerouslySetInnerHTML={{ __html: t('termsSec4Content') }} />
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Info className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('termsSec5Title')}</h2>
            </div>
            <p dangerouslySetInnerHTML={{ __html: t('termsSec5Content') }} />
          </section>

          <div className="mt-12 p-8 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl border border-purple-500/20 dark:border-cyan-500/20 shadow-lg text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('allRightsReserved')} © {new Date().getFullYear()} SavePro.site
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

