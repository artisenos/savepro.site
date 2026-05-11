import { FileWarning, Mail, ShieldCheck, AlertCircle, Info } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function DMCA() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-16 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 transition-all">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-red-500/10 rounded-2xl">
            <FileWarning className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('dmcaTitle')}
          </h1>
        </div>

        <div className="space-y-12 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
          <section className="bg-red-500/5 p-8 rounded-2xl border border-red-500/10">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('dmcaSec1Title')}</h2>
            </div>
            <p className="font-medium text-slate-800 dark:text-slate-200">
              {t('dmcaSec1Content')}
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('dmcaTitle')}</h2>
            </div>
            <p>
              {t('dmcaIntro')}
            </p>
          </section>

          <div className="mt-12 p-8 bg-gradient-to-br from-red-500/10 to-purple-500/10 rounded-2xl border border-red-500/20 dark:border-purple-500/20 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-red-500" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('contactUs')}</h3>
            </div>
            <p className="mb-4">
              Please send all DMCA notices to our designated agent via email:
            </p>
            <a href="mailto:dmca@savepro.site" className="text-xl font-bold text-red-600 dark:text-red-400 hover:text-purple-500 transition-colors underline decoration-2 underline-offset-4">
              dmca@savepro.site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

