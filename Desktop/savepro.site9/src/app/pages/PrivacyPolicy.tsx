import { Shield, Lock, Eye, Globe, Database, UserCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-16 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 transition-all">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-cyan-500/10 rounded-2xl">
            <Shield className="w-8 h-8 text-cyan-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
        </div>

        <div className="space-y-12 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
          <section>
            <p className="text-xl font-medium text-slate-800 dark:text-slate-200">
              At SavePro.site, accessible from https://savepro.site, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SavePro.site and how we use it.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Consent</h2>
            </div>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Information We Collect</h2>
            </div>
            <p>
              The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
            </p>
            <p>
              If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Log Files</h2>
            </div>
            <p>
              SavePro.site follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
            </p>
          </section>

          <section className="space-y-6 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Google DoubleClick DART Cookie</h2>
            </div>
            <p>
              Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-cyan-500 hover:underline">https://policies.google.com/technologies/ads</a>
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Our Advertising Partners</h3>
            <p>
              Some of advertisers on our site may use cookies and web beacons. Our advertising partners include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li className="font-bold">Google</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Advertising Partners Privacy Policies</h2>
            <p>
              You may consult this list to find the Privacy Policy for each of the advertising partners of SavePro.site.
            </p>
            <p>
              Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on SavePro.site, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
            </p>
            <p>
              Note that SavePro.site has no access to or control over these cookies that are used by third-party advertisers.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">GDPR Data Protection Rights</h2>
            </div>
            <p>
              We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
            </p>
            <ul className="list-disc pl-6 space-y-4">
              <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
              <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>
              <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
              <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
            <p>
              Under the CCPA, among other rights, California consumers have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-4">
              <li>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
              <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
              <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</li>
            </ul>
          </section>

          <div className="mt-12 p-8 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl border border-cyan-500/20 dark:border-purple-500/20 shadow-lg">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Contact Information</h3>
            <p className="mb-4">
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
            </p>
            <a href="mailto:support@savepro.site" className="text-xl font-bold text-cyan-600 dark:text-cyan-400 hover:text-purple-500 transition-colors underline decoration-2 underline-offset-4">
              support@savepro.site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
