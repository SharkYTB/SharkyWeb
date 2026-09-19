// ==========================================
// Advanced Security System - نظام الحماية المتقدم
// ==========================================
(() => {
    const initSecurity = () => {
        // 1. منع النقر بزر الماوس الأيمن (Context Menu)
        document.addEventListener('contextmenu', e => e.preventDefault());
        
        // 2. منع اختصارات لوحة المفاتيح (فحص العنصر، عرض المصدر، النسخ، الحفظ)
        document.addEventListener('keydown', e => {
            if (
                e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
                (e.ctrlKey && ['U', 'C', 'V', 'X', 'S', 'P'].includes(e.key.toUpperCase())) ||
                (e.metaKey && ['C', 'V', 'X', 'S', 'P'].includes(e.key.toUpperCase()))
            ) {
                e.preventDefault();
                console.warn("⚠️ تم إيقاف هذا الاختصار بواسطة نظام حماية الموقع.");
            }
        });
        
        // 3. منع النسخ والقص المباشر مع استبدال المحتوى
        document.addEventListener('copy', e => {
            e.preventDefault();
            if (e.clipboardData) {
                e.clipboardData.setData('text/plain', 'محاولة نسخ غير مصرح بها! جميع الحقوق محفوظة لـ شاركي ساما.');
            }
        });
        document.addEventListener('cut', e => e.preventDefault());
        
        // 4. منع سحب وإفلات العناصر (الصور والنصوص)
        document.addEventListener('dragstart', e => e.preventDefault());

        // 5. رسالة تحذيرية في الكونسول
        console.log("%cتوقف!", "color: red; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 0 #000;");
        console.log("%cهذا الموقع محمي بواسطة أنظمة شاركي. محاولة الوصول للكود المصدري مقفلة.", "font-size: 16px; color: white; background: #030305; padding: 10px; border-radius: 5px; border: 1px solid #0ea5e9;");
    };

    // تشغيل النظام الأمني فور تحميل الملف
    initSecurity();
})();