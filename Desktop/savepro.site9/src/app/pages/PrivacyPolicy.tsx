export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
          سياسة الخصوصية
        </h1>

        <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
          <p>
            مرحباً بك في موقع <strong>SavePro</strong>. نلتزم في SavePro بحماية خصوصيتك واحترامها. تشرح سياسة الخصوصية هذه كيفية جمع واستخدام وتخزين المعلومات عند استخدامك لموقعنا.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. المعلومات التي نجمعها</h2>
          <p>
            نحن لا نطلب منك التسجيل أو تقديم معلومات شخصية مثل اسمك أو بريدك الإلكتروني أو رقم هاتفك لاستخدام الأداة الأساسية. قد نقوم بجمع بعض المعلومات غير الشخصية التي يرسلها متصفحك تلقائياً مثل عنوان IP، نوع المتصفح، واللغة.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. كيف نستخدم معلوماتك</h2>
          <p>
            تستخدم المعلومات غير الشخصية التي نجمعها لأغراض إحصائية ولتحسين جودة الخدمة المقدمة، ولضمان أمان الموقع من الهجمات والمحاولات التخريبية. لا يتم ربط هذه البيانات بأي هويات شخصية.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. ملفات تعريف الارتباط (الكوكيز)</h2>
          <p>
            قد نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربة المستخدم وعرض محتوى أو إعلانات مخصصة. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال تصفحك، ولكن تعطيلها قد يؤثر على عمل بعض الميزات في الموقع.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. مشاركة المعلومات مع أطراف ثالثة</h2>
          <p>
            نحن لا نبيع أو نؤجر أو نشارك أياً من معلوماتك (حتى لو تم جمعها) مع أطراف ثالثة، باستثناء ما تفرضه السلطات القانونية والتشريعات المحلية في حالة طلب قانوني رسمي.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. الإعلانات والروابط الخارجية</h2>
          <p>
            قد يحتوي موقعنا على روابط لمواقع أخرى وإعلانات شبكات خارجية مثل Google AdSense. هذه المواقع لها سياسات خصوصية مستقلة، ونحن لا نتحمل مسؤولية المحتوى أو السياسات الخاصة بها.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">6. تعديلات سياسة الخصوصية</h2>
          <p>
            نحتفظ بالحق في تحديث أو تغيير سياسة الخصوصية هذه في أي وقت. سيتم نشر التغييرات على هذه الصفحة مع تحديث تاريخ المراجعة. استخدامك المستمر للموقع بعد إجراء التعديلات يعد قبولاً للسياسة الجديدة.
          </p>

          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50 transition-colors">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">تواصل معنا</h3>
            <p className="text-blue-800 dark:text-blue-400">
              إذا كانت لديك أي أسئلة أو استفسارات حول سياسة الخصوصية، يرجى التواصل معنا عبر: <a href="mailto:contact@savepro.app" className="font-bold underline text-blue-900 dark:text-blue-300">contact@savepro.app</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
