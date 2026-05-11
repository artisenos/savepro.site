import { FileWarning, Mail, ShieldCheck, AlertCircle, Info } from "lucide-react";

export default function DMCA() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-16 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 transition-all">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-red-500/10 rounded-2xl">
            <FileWarning className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            DMCA Compliance
          </h1>
        </div>

        <div className="space-y-12 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
          <section className="bg-red-500/5 p-8 rounded-2xl border border-red-500/10">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Content Non-Hosting Statement</h2>
            </div>
            <p className="font-medium text-slate-800 dark:text-slate-200">
              SavePro.site does not host any copyrighted media, videos, or files on its own servers. 
            </p>
            <p className="mt-4">
              Our service acts strictly as a technical service provider, facilitating the download of content directly from social media platforms' public CDNs to the user's device. We do not maintain a database of downloaded content or provide a search engine for copyrighted materials.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Digital Millennium Copyright Act (DMCA)</h2>
            </div>
            <p>
              SavePro.site respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998, we will respond expeditiously to claims of copyright infringement that are reported to our designated copyright agent.
            </p>
          </section>

          <section className="space-y-6 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Takedown Request Procedure</h2>
            <p>If you are a copyright owner, or are authorized to act on behalf of one, please report alleged copyright infringements by providing a written notice containing the following information:</p>
            <ul className="list-decimal pl-6 space-y-4 mt-4">
              <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.</li>
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>Identification of the material that is claimed to be infringing (e.g., the specific URL on our site where the tool is being misused).</li>
              <li>Your contact information, including your address, telephone number, and an email address.</li>
              <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner.</li>
            </ul>
          </section>

          <div className="mt-12 p-8 bg-gradient-to-br from-red-500/10 to-purple-500/10 rounded-2xl border border-red-500/20 dark:border-purple-500/20 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-red-500" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Designated Agent Contact</h3>
            </div>
            <p className="mb-4">
              Please send all DMCA notices to our designated agent via email:
            </p>
            <a href="mailto:dmca@savepro.site" className="text-xl font-bold text-red-600 dark:text-red-400 hover:text-purple-500 transition-colors underline decoration-2 underline-offset-4">
              dmca@savepro.site
            </a>
            <p className="mt-6 text-sm flex items-center gap-2 text-slate-500">
              <Info className="w-4 h-4" />
              Please allow 1-3 business days for a response.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
