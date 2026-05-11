import { FileWarning, Mail, ShieldCheck, AlertCircle, Info } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function DMCA() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-16 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 transition-all">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-red-500/10 rounded-2xl">
            <FileWarning className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('dmcaTitle')}
          </h1>
        </div>

        <div className="space-y-12 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
          <section className="bg-red-500/5 p-8 rounded-3xl border border-red-500/10">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('dmcaSec1Title')}</h2>
            </div>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
              {t('dmcaSec1Content')} SavePro respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998, we will respond expeditiously to claims of copyright infringement.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reporting Infringement</h2>
            </div>
            <p className="mb-4">
              {t('dmcaIntro')} To file a notice of infringement with us, you must provide a written communication that includes the following:
            </p>
            <ul className="list-disc ps-6 space-y-3">
              <li>A physical or electronic signature of the person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed.</li>
              <li>Information reasonably sufficient to permit the service provider to contact the complaining party (Email, Phone).</li>
              <li>A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized.</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner.</li>
            </ul>
          </section>

          <div className="mt-12 p-10 bg-gradient-to-br from-red-500/10 to-purple-500/10 rounded-3xl border border-red-500/20 dark:border-purple-500/20 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500 rounded-xl">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('contactUs')}</h3>
            </div>
            <p className="mb-6 text-slate-700 dark:text-slate-300">
              Please send all formal DMCA notices to our designated agent. We process these requests within 24-48 hours.
            </p>
            <a href="mailto:dmca@savepro.site" className="text-2xl font-black text-red-600 dark:text-red-400 hover:text-purple-500 transition-colors underline decoration-4 underline-offset-8">
              dmca@savepro.site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

