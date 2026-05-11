import { Shield, Lock, Eye, Globe, Database, UserCheck } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-16 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 transition-all">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-cyan-500/10 rounded-2xl">
            <Shield className="w-8 h-8 text-cyan-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('privacyPolicyTitle')}
          </h1>
        </div>

        <div className="space-y-12 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
          <section>
            <p className="text-xl font-medium text-slate-800 dark:text-slate-200">
              {t('privacyPolicyIntro')}
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('privacySec1Title')}</h2>
            </div>
            <p dangerouslySetInnerHTML={{ __html: t('privacySec1Content') }} />
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('privacySec2Title')}</h2>
            </div>
            <p dangerouslySetInnerHTML={{ __html: t('privacySec2Content') }} />
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('privacySec3Title')}</h2>
            </div>
            <p dangerouslySetInnerHTML={{ __html: t('privacySec3Content') }} />
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('privacySec4Title')}</h2>
            </div>
            <p dangerouslySetInnerHTML={{ __html: t('privacySec4Content') }} />
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('privacySec5Title')}</h2>
            </div>
            <p dangerouslySetInnerHTML={{ __html: t('privacySec5Content') }} />
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('privacySec6Title')}</h2>
            </div>
            <p dangerouslySetInnerHTML={{ __html: t('privacySec6Content') }} />
          </section>

          <div className="mt-12 p-8 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl border border-cyan-500/20 dark:border-purple-500/20 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-start md:text-start">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('privacyContactTitle')}</h3>
                <p className="text-slate-600 dark:text-slate-300">contact@savepro.site</p>
              </div>
              <a href="mailto:support@savepro.site" className="text-xl font-bold text-cyan-600 dark:text-cyan-400 hover:text-purple-500 transition-colors underline decoration-2 underline-offset-4">
                support@savepro.site
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

