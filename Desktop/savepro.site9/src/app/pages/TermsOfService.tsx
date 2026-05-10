import { FileText, AlertTriangle, Scale, ShieldAlert, Info } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-16 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 transition-all">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-purple-500/10 rounded-2xl">
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Terms of Service
          </h1>
        </div>

        <div className="space-y-12 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
          <section className="bg-blue-500/5 p-8 rounded-2xl border border-blue-500/10">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Acceptance of Terms</h2>
            </div>
            <p>
              By accessing the website at <a href="https://savepro.site" className="text-blue-500 hover:underline">https://savepro.site</a>, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">1. Use License & Restrictions</h2>
            </div>
            <div className="p-6 bg-amber-500/5 rounded-xl border border-amber-500/10">
              <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                Non-Commercial & Educational Use Only
              </h3>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                Permission is granted to use SavePro.site's services for personal, non-commercial, and educational purposes only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
            </div>
            <ul className="list-disc pl-6 space-y-3">
              <li>Modify or copy the materials for any commercial purpose.</li>
              <li>Attempt to decompile or reverse engineer any software contained on SavePro.site.</li>
              <li>Remove any copyright or other proprietary notations from the materials.</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
              <li>Use the tool to download copyrighted content without the express permission of the content owner.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">2. Disclaimer & Limitation of Liability</h2>
            </div>
            <p>
              The materials on SavePro.site's website are provided on an 'as is' basis. SavePro.site makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
              In no event shall SavePro.site or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SavePro.site's website, even if SavePro.site or a SavePro.site authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">3. Accuracy of Materials</h2>
            <p>
              The materials appearing on SavePro.site's website could include technical, typographical, or photographic errors. SavePro.site does not warrant that any of the materials on its website are accurate, complete or current. SavePro.site may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">4. Links</h2>
            <p>
              SavePro.site has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by SavePro.site of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">5. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which the website operator resides and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </section>

          <div className="mt-12 p-8 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl border border-purple-500/20 dark:border-cyan-500/20 shadow-lg text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
