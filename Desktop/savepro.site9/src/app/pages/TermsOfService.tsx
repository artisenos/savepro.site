export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
          شروط الاستخدام
        </h1>
        
        <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
          <p>
            باستخدامك لموقع <strong>SavePro</strong>، فإنك توافق على الامتثال لهذه الشروط والأحكام. يُرجى قراءتها بعناية قبل استخدام خدماتنا.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. طبيعة الخدمة</h2>
          <p>
            SavePro هي أداة مجانية تتيح للمستخدمين تنزيل مقاطع الفيديو من TikTok بدون علامات مائية للاستخدام الشخصي غير التجاري. نحن لا نستضيف أي محتوى مرئي على خوادمنا. الأداة تقوم فقط بمعالجة الروابط التي تقدمها وتوفير روابط التنزيل المباشرة من خوادم مزودي المحتوى الأصلي.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. حقوق الملكية الفكرية</h2>
          <p>
            لا ينتمي موقع SavePro إلى منصة TikTok أو ByteDance أو أي من شركائهم بأي شكل من الأشكال. حقوق النشر والملكية الفكرية للمقاطع الصوتية والمرئية تعود حصرياً لأصحابها ومبدعيها. 
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 pr-4 text-slate-600 dark:text-slate-400">
            <li>يجب عليك الحصول على إذن من صاحب المحتوى قبل تنزيل أي فيديو.</li>
            <li>يُمنع استخدام الفيديوهات المنزلة لأغراض تجارية دون إذن كتابي من صانع المحتوى الأصلي.</li>
            <li>أنت توافق على تحمل المسؤولية الكاملة عن أي انتهاك لحقوق النشر ناتج عن استخدامك لموقعنا.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. الاستخدام المسموح به</h2>
          <p>
            يُحظر استخدام الموقع بأي شكل قد يؤدي إلى تعطيله أو إثقال كاهل خوادمنا (مثل استخدام برامج البوت Bot لإنشاء طلبات تحميل مكثفة). نحتفظ بالحق في حظر أي عناوين IP تستخدم الموقع بشكل ينتهك هذه الشروط.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. إخلاء المسؤولية</h2>
          <p>
            يتم توفير الموقع والخدمة "كما هي" دون أي ضمانات من أي نوع. نحن لا نضمن أن الموقع سيكون متاحاً بشكل دائم، خاليًا من الأخطاء، أو أن الفيروسات والبرمجيات الخبيثة غير موجودة، على الرغم من أننا نبذل قصارى جهدنا لضمان بيئة آمنة للمستخدمين.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. التغييرات والتعديلات</h2>
          <p>
            نحتفظ بالحق في تعديل هذه الشروط في أي وقت. استمرار استخدامك للموقع بعد نشر أي تغييرات يعد قبولاً منك للشروط الجديدة. يُرجى مراجعة هذه الصفحة بانتظام للاطلاع على أحدث النسخ.
          </p>
        </div>
      </div>
    </div>
  );
}
