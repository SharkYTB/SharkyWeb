// Lenis بإعدادات مخصصة لثبات الفريمات واستجابة فائقة (120Hz/60Hz)
const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
    lerp: 0.12, 
    smoothWheel: true,
    smoothTouch: false, // الحفاظ على النايتف سكرول للجوال لمنع التقطيع
    touchMultiplier: 2,
    wheelMultiplier: 1,
});

const heroImgWrapper = document.getElementById('heroImageWrapper');
const progressBar = document.getElementById('progressBar');
const sections = document.querySelectorAll('section, header');
const navItems = document.querySelectorAll('.nav-links a');

// متغير لتتبع القسم النشط حالياً لمنع تحديث الرابط بشكل متكرر وإرهاق المعالج
let lastActiveSection = '';

// تحسين أداء التمرير باستخدام translate3d حصراً
lenis.on('scroll', (e) => {
    let scrollTotal = e.animatedScroll;
    let height = Math.max(0.1, (document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight);
    if(progressBar) {
        progressBar.style.transform = `scale3d(${scrollTotal / height}, 1, 1)`;
    }

    if(scrollTotal < window.innerHeight && heroImgWrapper) {
        heroImgWrapper.style.transform = `translate3d(0, ${scrollTotal * 0.12}px, 0)`;
    }

    let current = '';
    sections.forEach(section => {
        // تحديد القسم الحالي بناءً على مكان الـ Scroll
        if (window.scrollY >= (section.offsetTop - 300)) {
            current = section.getAttribute('id');
        }
    });
    
    // تحديث الأزرار النشطة (Active)
    navItems.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
    });

    // ==========================================
    // الميزة الجديدة: تحديث رابط المتصفح (URL Hash) مع التمرير
    // ==========================================
    if (current && current !== lastActiveSection) {
        lastActiveSection = current;
        // استخدام replaceState لتحديث الرابط بدون إضافة سجل جديد للـ History في المتصفح
        history.replaceState(null, null, `#${current}`);
    }
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// المؤشر التفاعلي للحواسب فقط
if (window.matchMedia("(pointer: fine)").matches) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if(cursorDot) cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    const animateCursor = () => {
        outlineX += (mouseX - outlineX) * 0.28; 
        outlineY += (mouseY - outlineY) * 0.28;
        if(cursorOutline) cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const hoverElements = document.querySelectorAll('a, button, .skill-card, .contact-card, .lang-btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hover-effect'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hover-effect'));
    });
    
    const tiltElements = document.querySelectorAll('.tilt-effect');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            const xPos = (x / rect.width - 0.5) * 12; 
            const yPos = (y / rect.height - 0.5) * -12;
            el.style.transform = `perspective(1000px) translate3d(0, -6px, 0) rotateY(${xPos}deg) rotateX(${yPos}deg)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)`;
        });
    });

    const codeElements = document.querySelectorAll('.code-el');
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        codeElements.forEach((el, index) => {
            const speed = (index + 1) * 0.4;
            el.style.transform = `translate3d(${x * speed}px, ${y * speed}px, 0)`;
        });
    });
}

// ==========================================
// التحديث هنا أيضاً: عند النقر على الأقسام بالنافبار
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        // التوجه للقسم المطلوب بنعومة
        lenis.scrollTo(targetId, { offset: -70 }); 
        
        // تحديث الرابط فوق عند الضغط مباشرة (pushState يسمح بالرجوع للخلف للقسم السابق)
        history.pushState(null, null, targetId);
        lastActiveSection = targetId.replace('#', '');
        
        const navLinks = document.getElementById('navLinks');
        const menuBtn = document.getElementById('menuBtn');
        if(window.innerWidth <= 768 && navLinks) {
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
            if(menuBtn) menuBtn.querySelector('i').className = 'fas fa-bars';
        }
    });
});

const fabMenu = document.getElementById('fabMenu');
const fabBtn = document.getElementById('fabBtn');

if(fabBtn && fabMenu) {
    fabBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        fabMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!fabMenu.contains(e.target)) {
            fabMenu.classList.remove('active');
        }
    });
}

const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if(menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        menuBtn.querySelector('i').className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });
}

// مراقبة الظهور (Reveal)
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { 
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// قاموس الترجمة الكامل
const translations = {
    "page-title": { ar: "شاركي ساما | Sharky Sama", en: "Sharky Sama | Portfolio" },
    "nav-logo": { ar: "شاركي <span>ساما</span>", en: "Sharky <span>Sama</span>" },
    "pl-title": { ar: "شاركي <span>ساما</span>", en: "Sharky <span>Sama</span>" },
    "nav-home": { ar: "الرئيسية", en: "Home" },
    "nav-about": { ar: "نبذة عني", en: "About" },
    "nav-skills": { ar: "مهاراتي", en: "Skills" },
    "nav-partner": { ar: "شراكة الإبداع", en: "Duo" },
    "nav-alia": { ar: "عليا", en: "Alia" },
    "nav-contact": { ar: "تواصل معي", en: "Contact" },
    "hero-title": { ar: "شاركي <span>ساما</span>", en: "Sharky <span>Sama</span>" },
    "typewriter-text": { 
        ar: "طالب هندسة برمجيات.. أصنع من الأكواد فناً، ومن الخيال واقعاً مبرمجاً.", 
        en: "Software Engineering Student.. Turning code into art and imagination into reality." 
    },
    "about-title": { ar: "من هو <span>شاركي</span>؟", en: "Who is <span>Sharky</span>?" },
    "about-p1": { ar: "أنا مطور وطالب في تخصص هندسة البرمجيات، أجمع بين التفكير المنطقي في بناء الأنظمة والخيال الواسع في عالم التصميم والفن الرقمي. أهتم بتطوير البوتات المتقدمة، وبناء واجهات الويب العصرية، إلى جانب ممارسة الرياضة ومتابعة ثقافة الأنمي التي تلهمني في تصاميمي.", en: "I am a developer and Software Engineering student, combining logical thinking in building systems with a vast imagination in the world of design and digital art." },
    "about-p2": { ar: "هدفي دائماً هو كتابة كود نظيف وقوي، والخروج بأعمال تترك بصمة بصرية وتقنية فريدة تعبر عن هويتي وتطلعاتي.", en: "My goal is to always write clean, robust code and produce work that leaves a unique visual and technical mark reflecting my true identity." },
    "skills-title": { ar: "مهاراتي <span>وهواياتي</span>", en: "My <span>Skills</span>" },
    "skill-1": { ar: "التطوير والبرمجة", en: "Development" },
    "skill-2": { ar: "صناعة البوتات", en: "Bot Creation" },
    "skill-3": { ar: "الفنون والتصميم", en: "Arts & Design" },
    "badge-sharky": { ar: "شاركي ساما", en: "Sharky Sama" },
    "badge-alia": { ar: "عليا", en: "Alia" },
    "partner-title": { ar: "شراكة الروح <span>والكود</span>", en: "Soul & <span>Code</span> Duo" },
    "partner-p1": { ar: "في عالم مليء بسطور الأكواد البرمجية والتعقيدات التقنية، وجدنا لغة مشتركة تتجاوز حدود الشاشات. معاً، <span>شاركي ساما</span> و <span class='partner-name'>عليا</span>، نكتب أجمل قصة، نبني مشاريعنا بشغف، وندعم بعضنا في كل خطوة ومواجهة.", en: "In a world full of code lines, we found a common language. Together, <span>Sharky Sama</span> and <span class='partner-name'>Alia</span>, we build our projects with passion." },
    "partner-p2": { ar: "أنتِ لستِ فقط شريكتي في البرمجة والعمل، بل أنتِ شريكة الروح، والإلهام الذي يجعل من كل سطر كود لوحة فنية متكاملة.", en: "You are not just my partner in programming, but my soulmate and the inspiration that turns every line of code into a masterpiece." },
    "alia-title": { ar: "مساحة <span>عليا</span>", en: "<span>Alia's</span> Space" },
    "alia-subtitle": { ar: "الإبداع، التصميم، والبرمجة بروح مختلفة", en: "Creativity, Design, and Code with a unique spirit" },
    "alia-name": { ar: "عليا", en: "Alia" },
    "alia-desc": { ar: "شريكة الإبداع والمطورة التي تضع لمستها الفنية في كل تفصيل. يمكنكم متابعة أعمالي والتواصل معي عبر المنصات التالية:", en: "The creative partner and developer who puts her artistic touch in every detail." },
    "contact-title": { ar: "تواصل <span>معي</span>", en: "Get In <span>Touch</span>" },
    "c-wa-t": { ar: "واتساب", en: "WhatsApp" },
    "c-wa-d": { ar: "مراسلة شاركي ساما مباشرة عبر الواتساب", en: "Message Sharky Sama directly on WhatsApp" },
    "c-dc-t": { ar: "ديسكورد", en: "Discord" },
    "c-dc-d": { ar: "انضم إلى سيرفري الرسمي واستمتع بالتحديثات", en: "Join my official server for updates" },
    "c-ig-t": { ar: "إنستغرام", en: "Instagram" },
    "c-ig-d": { ar: "تابع يومياتي وأحدث تصاميمي وأعمالي", en: "Follow my daily life and latest designs" },
    "c-tk-t": { ar: "تيك توك", en: "TikTok" },
    "c-tk-d": { ar: "شاهد أحدث المقاطع والمونتاج الخاص بي", en: "Watch my latest clips and edits" },
    "footer-text": { ar: "&copy; 2026 الموقع الرسمي للمطور <span>شاركي ساما</span>. تم البناء بشغف وإبداع.", en: "&copy; 2026 Official Website of <span>Sharky Sama</span>. Built with passion & creativity." }
};

let currentLang = 'ar';
let typeWriterTimeout;

function startTypewriter(text) {
    const el = document.getElementById('typewriter');
    if (!el) return;
    el.textContent = '';
    let i = 0;
    clearTimeout(typeWriterTimeout);
    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            typeWriterTimeout = setTimeout(type, 35);
        }
    }
    type();
}

const langToggleBtn = document.getElementById('langToggle');
if(langToggleBtn) {
    langToggleBtn.addEventListener('click', function() {
        document.body.style.opacity = '0.7';
        setTimeout(() => {
            currentLang = currentLang === 'ar' ? 'en' : 'ar';
            document.getElementById('langText').textContent = currentLang === 'ar' ? 'EN' : 'عربي';
            
            document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = currentLang;
            document.body.classList.toggle('en-mode', currentLang === 'en');

            for (const id in translations) {
                if (id === 'typewriter-text') continue; 
                const el = document.getElementById(id);
                if (el) el.innerHTML = translations[id][currentLang];
            }
            startTypewriter(translations['typewriter-text'][currentLang]);
            document.body.style.opacity = '1';
        }, 200);
    });
}

window.addEventListener('load', () => {
    // توجيه ذكي عند إعادة تحميل الصفحة إذا كان هناك هاشتاق في الرابط
    if (window.location.hash) {
        setTimeout(() => {
            lenis.scrollTo(window.location.hash, { offset: -70, immediate: true });
        }, 100);
    }

    setTimeout(() => {
        document.body.classList.remove('no-scroll');
        document.body.classList.add('loaded');
        startTypewriter(translations['typewriter-text'][currentLang]);
    }, 500); 
});