/**
 * Demo: Roshd — management and growth consulting for small and medium firms
 * (Coral kit), built as a complete site: home, services, plans, case studies,
 * about, FAQ, contact and notes. Pictures are the firm's own paperwork:
 * monthly dashboards, the ninety-day plan, proposals and process sketches.
 */
'use strict';

const L = require('../lib');
const { img, link, px, section, cols, heading, button, fx } = L;

const images = { logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp' };
['hero', 'report', 'plan', 'process', 'case-1', 'case-2', 'case-3', 'journal-1', 'journal-2', 'journal-3', 'journal-4'].forEach((k) => { images[k] = 'images/' + k + '.webp'; });
const alts = {
	hero: 'داشبورد ماهانه، کتابچه‌ی برنامه‌ی نودروزه و نامه‌ی پیشنهاد روی میز',
	report: 'گزارش ماهانه‌ی جریان نقدی با نمودار رو به رشد',
	plan: 'کتابچه‌ی برنامه‌ی رشد نودروزه',
	process: 'طرح مدادی فرایند سفارش تا تحویل کنار نامه‌ی پیشنهاد',
};
const anchor = (id, el) => { el.settings._element_id = id; return el; };

const BENTO = [
	{ wide: 'yes', tone: 'soft', icon: '', figure: '۳۸٪', title: 'رشد میانگین فروش در سال اول', text: 'میانگین شرکت‌هایی که دست‌کم دوازده ماه با ما کار کرده‌اند؛ از گزارش‌های مالی خودشان.' },
	{ tone: 'warm', icon: '', figure: '۲×', title: 'تصمیم‌گیری سریع‌تر', text: 'جلسه‌های کوتاه هفتگی به جای گزارش‌های بلند ماهانه.' },
	{ tone: 'dark', icon: 'chart', title: 'داشبورد مالی زنده', text: 'جریان نقدی، سود و هزینه‌ها در یک صفحه؛ به‌روز هر روز.' },
	{ tone: 'sand', icon: 'users', title: 'مشاور اختصاصی', text: 'یک نفر که کسب‌وکارتان را از نزدیک می‌شناسد و همیشه در دسترس است.' },
	{ wide: 'yes', tone: '', icon: 'target', title: 'برنامه‌ی رشد نودروزه', text: 'سه هدف روشن، دوازده هفته و یک جلسه‌ی هفتگی؛ بدون فایل‌های قطوری که هیچ‌وقت خوانده نمی‌شوند.' },
	{ tone: 'soft', icon: '', figure: '۲۴۰', title: 'شرکت همراه', text: 'از تولیدی‌های کوچک تا فروشگاه‌های چندشعبه.' },
];

const QUOTES = [
	{ quote: 'تا پیش از رشد، نمی‌دانستیم کدام محصول واقعاً سود می‌دهد. سه ماه بعد، نیمی از محصولات را کنار گذاشتیم و سودمان بیشتر شد.', name: 'نسرین طاهری', role: 'مدیرعامل، پوشاک طاها' },
	{ quote: 'جلسه‌های هفتگی کوتاه و دقیق است. مشاورمان قبل از جلسه اعداد را دیده و فقط درباره‌ی تصمیم‌ها حرف می‌زنیم.', name: 'حمید اسدی', role: 'بنیان‌گذار، کارگاه چوب اسدی' },
	{ quote: 'برای اولین بار برنامه‌ای داریم که همه‌ی تیم آن را می‌فهمد. داشبورد مالی را هر صبح با قهوه نگاه می‌کنم.', name: 'شیما فرجی', role: 'مدیر مالی، فروشگاه‌های نیلا' },
].map((q) => Object.assign({ rating: '0' }, q));

const FAQ = [
	['برای چه اندازه‌ای از شرکت‌ها مناسب است؟', 'شرکت‌هایی با پنج تا دویست نفر نیرو و فروش ماهانه‌ی دست‌کم یک میلیارد تومان. برای کسب‌وکارهای کوچک‌تر برنامه‌ی پایه را پیشنهاد می‌کنیم.'],
	['حداقل مدت همکاری چقدر است؟', 'سه ماه؛ یک برنامه‌ی رشد نودروزه. پس از آن هر ماه می‌توانید ادامه دهید یا متوقف کنید.'],
	['اطلاعات مالی ما محرمانه می‌ماند؟', 'بله. قرارداد عدم افشا پیش از اولین جلسه امضا می‌شود و دسترسی به داشبورد فقط برای شما و مشاورتان است.'],
	['اگر نتیجه نگرفتیم چه؟', 'اگر در پایان سه ماه هیچ‌یک از سه هدف برنامه محقق نشده باشد، هزینه‌ی ماه سوم را برمی‌گردانیم.'],
];

const PLANS = [
	{ name: 'پایه', desc: 'برای کسب‌وکارهای نوپا', price: '۱۸', price_alt: '۱۶', unit: 'میلیون تومان', period: 'ماهانه', features: 'برنامه‌ی رشد نودروزه\nجلسه‌ی دوهفتگی\nداشبورد مالی استاندارد\nپشتیبانی در پیام‌رسان', btn_text: 'شروع با پایه', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
	{ name: 'رشد', desc: 'برای شرکت‌های در حال گسترش', price: '۳۴', price_alt: '۳۰', unit: 'میلیون تومان', period: 'ماهانه', features: 'همه‌ی امکانات پایه\nمشاور اختصاصی\nجلسه‌ی هفتگی\nداشبورد مالی سفارشی\nبازبینی قیمت‌گذاری و هزینه‌ها', btn_text: 'شروع با رشد', btn_link: link('{{page:contact}}'), featured: 'yes', badge: 'بیشترین انتخاب' },
	{ name: 'همراه کامل', desc: 'برای گروه‌ها و شرکت‌های چندشعبه', price: 'توافقی', price_alt: 'توافقی', unit: '', period: '', features: 'تیم مشاوره‌ی اختصاصی\nحضور در جلسه‌های هیئت‌مدیره\nطراحی ساختار سازمانی\nآموزش مدیران میانی', btn_text: 'هماهنگی جلسه', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
];

const CASES = [
	{ eyebrow: 'پوشاک طاها · قیمت‌گذاری', title: 'حاشیه‌ی سود از ۲۲ به ۳۴ درصد', text: 'نیمی از محصولات کم‌فروش کنار رفت و قیمت پانزده محصول پرفروش بازبینی شد؛ فروش کمتر، سود بیشتر.', points: 'تحلیل سود هر محصول\nحذف ۴۸٪ کالای راکد\nداشبورد هفتگی فروش', image: img('case-1'), btn_text: 'خواندن یادداشت', btn_link: link('{{post:pricing-note}}'), tone: '' },
	{ eyebrow: 'کارگاه چوب اسدی · فرایند', title: 'زمان تحویل از ۳۰ به ۱۵ روز', text: 'فرایند سفارش تا تحویل روی کاغذ کشیده شد و سه گلوگاه با تغییرهای کوچک برداشته شد.', points: 'نقشه‌ی فرایند\nبرنامه‌ی هفتگی تولید\nتحویل سر وقت ۹۶٪', image: img('case-2'), btn_text: 'خواندن یادداشت', btn_link: link('{{post:process-note}}'), tone: 'inverse' },
	{ eyebrow: 'فروشگاه‌های نیلا · مالی', title: 'نقدینگی ۴۱ درصد بیشتر', text: 'سه شعبه با یک داشبورد؛ مهلت پرداخت عمده‌فروشان کوتاه شد و خرید فصلی برنامه‌ریزی شد.', points: 'داشبورد مالی زنده\nدوره‌ی وصول ۴۲ روز\nبودجه‌ی خرید فصلی', image: img('case-3'), btn_text: 'خواندن یادداشت', btn_link: link('{{post:cash-note}}'), tone: '' },
];

/* ---------------- Home ---------------- */

const home = [
	L.bleed(L.w('hm-hero', {
		layout: 'split', title_tag: 'h1', title_size: 'xl', header_align: 'start', title_reveal: 'words',
		eyebrow: 'رشد · مشاوره‌ی مدیریت',
		title: 'کسب‌وکارتان را\n*با آرامش* بزرگ کنید',
		desc: 'برنامه‌ی رشد، داشبورد مالی و همراهی هفتگی مشاوران باتجربه؛ برای شرکت‌های کوچک و متوسطی که می‌خواهند بی‌آشفتگی بزرگ شوند.',
		btn1_text: 'جلسه‌ی آشنایی رایگان', btn1_link: link('{{page:contact}}'), btn1_style: 'primary',
		btn2_text: 'برنامه‌ها و هزینه‌ها', btn2_link: link('{{page:plans}}'), btn2_style: 'secondary',
		media_type: 'image', image: img('hero'), media_ratio: 'landscape', height: 'auto', decor: '', hint: '',
	})),
	section({ space: 'md', top0: true, gap: 32 }, [
		L.features(BENTO, { layout: 'bento', style: 'cards', columns: '4', icon_style: 'soft' }),
	]),
	section({ space: 'sm', gap: 0 }, [
		L.con({ content_width: 'full', css_classes: 'hm-scheme-inverse hm-rounded', padding: L.pad(40, 48) }, [
			L.counters([
				{ value: 12, label: 'سال تجربه' },
				{ value: 240, label: 'شرکت همراه' },
				{ value: 38, suffix: '٪', label: 'رشد میانگین فروش' },
				{ value: 94, suffix: '٪', label: 'تمدید همکاری' },
			], { style: 'plain', columns: '4' }),
		], true),
	]),
	section({ space: 'none', gap: 0, zoom: 'expand', zoomAmount: 0.2, zoomInner: true, zoomRadius: 4 }, [
		L.imageReveal('report', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	section({ space: 'md', gap: 40, cards: 'cascade' }, [
		heading({ eyebrow: 'شیوه‌ی کار', title: 'چهار قدم، *دوازده هفته*', header_align: 'center' }),
		L.steps([
			{ marker: '', icon: 'search', title: 'شناخت', text: 'دو جلسه برای دیدن اعداد، فرایندها و تیم؛ بدون قضاوت.' },
			{ marker: '', icon: 'target', title: 'برنامه', text: 'سه هدف قابل اندازه‌گیری برای نود روز آینده.' },
			{ marker: '', icon: 'bolt', title: 'اجرا', text: 'جلسه‌ی هفتگی، کارهای مشخص و پیگیری دقیق.' },
			{ marker: '', icon: 'chart', title: 'سنجش', text: 'گزارش پایان دوره و برنامه‌ی سه ماه بعد.' },
		], { layout: 'h', cards: 'yes' }),
	]),
	section({ space: 'md', gap: 32 }, [
		heading({ eyebrow: 'نمونه‌ها', title: 'سه شرکت،\n*سه عدد*' }),
		L.stack(CASES),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'از زبان مدیران', title: 'اعداد، *نه وعده‌ها*' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]), { tone: 'surface' }),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'برنامه‌ها', title: 'هزینه‌ی *روشن*، بی‌قرارداد بلندمدت', header_align: 'center', desc: 'همه‌ی برنامه‌ها با یک جلسه‌ی آشنایی رایگان شروع می‌شوند.' }),
		L.pricing(PLANS, { switch_off: 'پرداخت ماهانه', switch_on: 'پرداخت سه‌ماهه', switch_note: '۱۰٪ تخفیف' }),
	]), { cards: 'cascade' }),
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *شروع*' }), button('گفت‌وگو با ما', '{{page:contact}}', 'secondary')],
			[L.faq(FAQ)],
		]),
	]),
	L.cta({
		eyebrow: 'جلسه‌ی آشنایی',
		title: 'اولین جلسه\n*رایگان* است',
		desc: 'چهل‌وپنج دقیقه گفت‌وگو درباره‌ی کسب‌وکار شما؛ بدون تعهد و بدون فروش.',
		btn1_text: 'رزرو جلسه', btn1_link: link('{{page:contact}}'),
		btn2_text: '۰۲۱-۹۱۰۰۴۴۰۰', btn2_link: link('tel:+982191004400'),
		look: 'inverse', decor: '', note: '',
	}),
];

const ctaMeet = () => L.cta({
	eyebrow: 'جلسه‌ی آشنایی',
	title: 'اولین جلسه\n*رایگان* است',
	desc: 'چهل‌وپنج دقیقه گفت‌وگو درباره‌ی کسب‌وکار شما؛ بدون تعهد و بدون فروش.',
	btn1_text: 'رزرو جلسه', btn1_link: link('{{page:contact}}'),
	btn2_text: '۰۲۱-۹۱۰۰۴۴۰۰', btn2_link: link('tel:+982191004400'),
	look: 'inverse', decor: '', note: '',
});

/* ---------------- Services ---------------- */

const services = [
	L.pageHead('خدمات', 'آنچه *با هم* می‌سازیم', 'هر همکاری با یک برنامه‌ی نودروزه شروع می‌شود؛ خدمات زیر بسته به اهداف آن برنامه به کار می‌آیند.'),
	fx(section({ space: 'md' }, [
		L.features([
			{ icon: 'chart', tone: 'soft', title: 'مدیریت مالی', text: 'بودجه‌بندی، جریان نقدی، قیمت‌گذاری و داشبورد مالی زنده.' },
			{ icon: 'target', tone: 'warm', title: 'استراتژی فروش', text: 'بازارهای هدف، کانال‌های فروش و ساختار تیم فروش.' },
			{ icon: 'users', tone: 'sand', title: 'منابع انسانی', text: 'ساختار سازمانی، شرح شغل و سیستم ارزیابی عملکرد.' },
			{ icon: 'cog', tone: '', title: 'فرایندها', text: 'مستندسازی و ساده‌سازی فرایندهای تکراری، از سفارش تا تحویل.' },
			{ icon: 'book', tone: '', title: 'آموزش مدیران', text: 'کارگاه‌های کوتاه برای مدیران میانی؛ تصمیم‌گیری، جلسه و بازخورد.' },
			{ icon: 'shield', tone: 'dark', title: 'مدیریت ریسک', text: 'شناسایی ریسک‌های مالی و عملیاتی پیش از آنکه دردسر شوند.' },
		], { layout: 'grid', style: 'cards', columns: '3', icon_style: 'soft' }),
	]), { cards: 'cascade' }),
	section({ space: 'md', gap: 48 }, [
		cols({ widths: [50, 50], gap: 64, align: 'center' }, [
			[fx(L.imageReveal('process', { ratio: '4-3', reveal: 'none', parallax: px(0) }), { zoom: 'in', zoomAmount: 0.08, zoomInner: true })],
			[heading({ eyebrow: 'روی کاغذ', title: 'اول *نقشه*،\nبعد تغییر', desc: 'هر فرایند پیش از هر تغییری روی کاغذ کشیده می‌شود؛ گلوگاه‌ها معمولاً همان‌جا پیدا می‌شوند.' })],
		]),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'شیوه‌ی کار', title: 'چهار قدم، *دوازده هفته*', header_align: 'center' }),
		L.steps([
			{ marker: '۰۱', icon: 'search', title: 'شناخت', text: 'دو جلسه برای دیدن اعداد، فرایندها و تیم.' },
			{ marker: '۰۲', icon: 'target', title: 'برنامه', text: 'سه هدف قابل اندازه‌گیری برای نود روز.' },
			{ marker: '۰۳', icon: 'bolt', title: 'اجرا', text: 'جلسه‌ی هفتگی و پیگیری دقیق.' },
			{ marker: '۰۴', icon: 'chart', title: 'سنجش', text: 'گزارش پایان دوره و برنامه‌ی بعدی.' },
		], { layout: 'h', cards: 'yes' }),
	]), { tone: 'surface' }),
	ctaMeet(),
];

/* ---------------- Plans ---------------- */

const plans = [
	L.pageHead('برنامه‌ها', 'هزینه‌ی *روشن*،\nبی‌قرارداد بلندمدت', 'همه‌ی برنامه‌ها با یک جلسه‌ی آشنایی رایگان شروع می‌شوند و پس از سه ماه، ماه‌به‌ماه ادامه پیدا می‌کنند.'),
	fx(section({ space: 'md', gap: 40 }, [L.pricing(PLANS, { switch_off: 'پرداخت ماهانه', switch_on: 'پرداخت سه‌ماهه', switch_note: '۱۰٪ تخفیف' })]), { cards: 'cascade' }),
	section({ space: 'md', gap: 48 }, [
		cols({ widths: [50, 50], gap: 64, align: 'center' }, [
			[heading({ eyebrow: 'در هر برنامه', title: 'یک کتابچه،\n*سه هدف*', desc: 'برنامه‌ی نودروزه روی چند صفحه نوشته می‌شود: سه هدف با عدد، مسئول هر کار و تاریخ هر جلسه. همان کتابچه پایان دوره سنجیده می‌شود.' })],
			[fx(L.imageReveal('plan', { ratio: '1-1', reveal: 'none', parallax: px(0) }), { zoom: 'in', zoomAmount: 0.08, zoomInner: true })],
		]),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'درباره‌ی\n*هزینه*' })],
			[L.faq(FAQ, { style: 'lines' })],
		]),
	]), { tone: 'surface' }),
	ctaMeet(),
];

/* ---------------- Cases ---------------- */

const cases = [
	L.pageHead('نمونه‌ها', 'سه شرکت،\n*سه عدد*', 'اعداد از گزارش‌های مالی خود شرکت‌ها و با اجازه‌ی آن‌ها منتشر شده است.'),
	section({ space: 'md', gap: 32 }, [L.stack(CASES)]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'از زبان مدیران', title: 'اعداد، *نه وعده‌ها*', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]), { tone: 'inverse' }),
	ctaMeet(),
];

/* ---------------- About ---------------- */

const about = [
	L.pageHead('درباره‌ی رشد', 'مشاورانی که\n*کار کرده‌اند*', 'رشد را در سال ۱۳۹۲ چند مدیر باتجربه راه انداختند که خودشان کسب‌وکار داشتند.'),
	section({ space: 'sm', zoom: 'expand', zoomAmount: 0.2, zoomInner: true, zoomRadius: 4 }, [
		L.imageReveal('hero', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	section({ space: 'md', width: 1000 }, [
		L.textScrub('قرارمان از روز اول یکی بود: *فقط* چیزی را پیشنهاد کنیم که *خودمان اجرا کرده‌ایم*؛ و هر کار را با عددی بسنجیم که مدیر شرکت هر صبح نگاه می‌کند.', { size: 'md' }),
	]),
	fx(section({ space: 'sm' }, [
		L.counters([
			{ value: 12, label: 'سال' },
			{ value: 18, label: 'مشاور' },
			{ value: 240, label: 'شرکت همراه' },
			{ value: 9, label: 'استان' },
		], { style: 'plain', columns: '4' }),
	]), { tone: 'inverse' }),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'تیم', title: 'مشاوران *رشد*' })],
			[L.features([
				{ icon: '', title: 'کامران صدیقی', text: 'هم‌بنیان‌گذار؛ مدیریت مالی' },
				{ icon: '', title: 'لاله امیری', text: 'هم‌بنیان‌گذار؛ فروش و بازار' },
				{ icon: '', title: 'رضا کاظمی', text: 'فرایند و عملیات' },
				{ icon: '', title: 'نگار فاضلی', text: 'منابع انسانی و آموزش' },
			], { layout: 'grid', style: 'plain', columns: '2', icon_style: 'plain' })],
		]),
	]), { cards: 'cascade' }),
	ctaMeet(),
];

const faqPage = [
	L.pageHead('پرسش‌های متداول', 'پیش از *شروع*', 'اگر سؤالتان این‌جا نیست، در جلسه‌ی آشنایی بپرسید.'),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [30, 70], gap: 64 }, [
			[heading({ eyebrow: 'همکاری', title: 'قرارداد و *نتیجه*', title_size: 'md' })],
			[L.faq(FAQ.concat([
				['جلسه‌ها حضوری است؟', 'جلسه‌ی شناخت حضوری در دفتر شماست؛ جلسه‌های هفتگی حضوری یا تصویری، به انتخاب شما.'],
				['خارج از تهران هم کار می‌کنید؟', 'بله؛ در نُه استان شرکت همراه داریم. هزینه‌ی سفر جلسه‌های حضوری جداگانه است.'],
			]), { style: 'lines' })],
		]),
	]),
	ctaMeet(),
];

/* ---------------- Contact ---------------- */

const contact = [
	L.pageHead('تماس', 'گفت‌وگو را *شروع* کنیم', 'فرم را پر کنید؛ ظرف یک روز کاری برای هماهنگی جلسه‌ی آشنایی تماس می‌گیریم.'),
	section({ space: 'md' }, [
		cols({ widths: [40, 60], gap: 56 }, [
			[L.contactInfo([
				{ icon: 'phone', label: 'تلفن', value: '۰۲۱-۹۱۰۰۴۴۰۰', link: link('tel:+982191004400') },
				{ icon: 'mail', label: 'ایمیل', value: 'hello@roshd.co', link: link('mailto:hello@roshd.co') },
				{ icon: 'linkedin', label: 'لینکدین', value: 'roshd-consulting', link: link('https://linkedin.com/', true) },
				{ icon: 'pin', label: 'دفتر', value: 'تهران، خیابان ملاصدرا، شیخ‌بهایی شمالی، پلاک ۲۲', link: link('') },
			])],
			[L.contactForm({ show_phone: 'yes', label_phone: 'شماره‌ی تماس', show_subject: 'yes', label_subject: 'نام شرکت', label_name: 'نام و نام خانوادگی', label_email: 'ایمیل', label_message: 'بزرگ‌ترین چالش این روزهای کسب‌وکارتان چیست؟', button: 'ارسال', success: 'پیامتان رسید؛ ظرف یک روز کاری تماس می‌گیریم.' })],
		]),
	]),
];

/* ---------------- Notes ---------------- */

const terms = [
	{ key: 'cat-finance', taxonomy: 'category', name: 'مالی', slug: 'finance' },
	{ key: 'cat-ops', taxonomy: 'category', name: 'عملیات', slug: 'operations' },
	{ key: 'cat-team', taxonomy: 'category', name: 'تیم', slug: 'team' },
];

const posts = [
	{
		key: 'cash-note', title: 'نقدینگی، پیش از سود', slug: 'cash-before-profit', image: 'journal-1', terms: ['cat-finance'], days_ago: 4,
		excerpt: 'شرکت‌های سودده هم ممکن است به خاطر کمبود نقدینگی زمین بخورند.',
		content: L.article([
			'سود روی کاغذ است و نقدینگی در حساب بانکی. بسیاری از شرکت‌های کوچک سودده‌اند اما هر ماه برای پرداخت حقوق نگران‌اند؛ چون پولشان در انبار و نزد مشتریان عمده مانده است.',
			['h', 'سه کار برای این ماه'],
			['ol', ['دوره‌ی وصول مطالبات را حساب کنید: چند روز طول می‌کشد تا پول فروش به حساب برسد؟', 'کالای راکد بیش از نود روز را فهرست کنید.', 'یک پیش‌بینی ساده‌ی نقدینگی سه‌ماهه بنویسید؛ حتی در یک برگه.']],
			['img', 'case-3', 'گزارش سه‌ماهه‌ی جریان نقدی فروشگاه‌های نیلا'],
		]),
	},
	{
		key: 'pricing-note', title: 'قیمت را از کجا شروع کنیم', slug: 'where-pricing-starts', image: 'journal-2', terms: ['cat-finance'], days_ago: 12,
		excerpt: 'قیمت‌گذاری بر اساس «رقیب چند می‌فروشد» کافی نیست.',
		content: L.article([
			'بیشتر شرکت‌های کوچک قیمت را از روی رقیب یا با یک درصد ثابت روی بهای تمام‌شده تعیین می‌کنند. نتیجه این است که برخی محصولات در عمل زیان می‌دهند و کسی متوجه نمی‌شود.',
			['ul', ['سود هر محصول را جداگانه حساب کنید، با هزینه‌های غیرمستقیم.', 'پانزده محصول پرفروش را اول بازبینی کنید.', 'تخفیف‌های همیشگی را حذف کنید؛ تخفیف باید دلیل و تاریخ پایان داشته باشد.']],
		]),
	},
	{
		key: 'team-note', title: 'شرح شغل، کوتاه و روشن', slug: 'short-job-descriptions', image: 'journal-3', terms: ['cat-team'], days_ago: 21,
		excerpt: 'یک صفحه کافی است؛ به شرط آنکه بگوید موفقیت در این نقش چه شکلی است.',
		content: L.article([
			'شرح شغل‌های طولانی کمتر خوانده می‌شوند. یک صفحه با سه بخش کافی است: مسئولیت‌ها، عددهایی که با آن سنجیده می‌شوید، و تصمیم‌هایی که خودتان می‌گیرید.',
			['q', 'اگر کسی نداند با چه عددی سنجیده می‌شود، با حدس کار می‌کند.'],
		]),
	},
	{
		key: 'process-note', title: 'فرایند را روی کاغذ بکشید', slug: 'draw-the-process', image: 'journal-4', terms: ['cat-ops'], days_ago: 30,
		excerpt: 'گلوگاه‌ها معمولاً روی کاغذ پیدا می‌شوند، نه در جلسه.',
		content: L.article([
			'یک برگه بردارید و مسیر یک سفارش را از تماس مشتری تا تحویل بکشید: هر مرحله، هر نفر و هر انتظار. بیشتر وقت‌ها کار در صف‌ها گم می‌شود، نه در خود مراحل.',
			['img', 'process', 'طرح مدادی فرایند سفارش تا تحویل'],
			'در کارگاه چوب اسدی، همین نقشه نشان داد سفارش‌ها به‌طور میانگین شش روز منتظر تأیید نقشه‌ی اجرایی می‌مانند. با یک جلسه‌ی ثابت هفتگی برای تأیید، زمان تحویل نصف شد.',
		]),
	},
];

/* ---------------- Package ---------------- */


const pages = [
	{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings() },
	{ key: 'services', title: 'خدمات', slug: 'services', elementor: services, settings: L.pageSettings() },
	{ key: 'plans', title: 'برنامه‌ها', slug: 'plans', elementor: plans, settings: L.pageSettings() },
	{ key: 'cases', title: 'نمونه‌ها', slug: 'case-studies', elementor: cases, settings: L.pageSettings() },
	{ key: 'about', title: 'درباره‌ی رشد', slug: 'about', elementor: about, settings: L.pageSettings() },
	{ key: 'faq', title: 'پرسش‌های متداول', slug: 'faq', elementor: faqPage, settings: L.pageSettings() },
	{ key: 'contact', title: 'تماس', slug: 'contact', elementor: contact, settings: L.pageSettings() },
	{ key: 'blog', title: 'یادداشت‌ها', slug: 'notes', content: '' },
];

module.exports = {
	manifest: {
		id: 'roshd',
		order: 11,
		title: 'رشد',
		desc: 'مشاوره‌ی مدیریت و رشد کسب‌وکار؛ سایت کامل با خدمات، برنامه‌ها و هزینه‌ها، سه نمونه‌کار با عدد، درباره، پرسش‌ها و یادداشت‌ها. عکس‌ها از کاغذهای خود شرکت: داشبورد ماهانه، کتابچه‌ی برنامه و طرح فرایند.',
		kit: 'coral',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: [],
		tags: ['شرکتی', 'مشاوره', 'کسب‌وکار'],
		pages: pages.filter((p) => p.elementor).map((p) => p.title).concat(['یادداشت‌ها']),
	},
	content: {
		site: { title: 'رشد', tagline: 'مشاوره‌ی مدیریت و رشد کسب‌وکار' },
		images, alts, terms, posts, pages,
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'رشد — صفحه‌ی اصلی' },
			{ key: 'tpl-bento', type: 'section', page: 'home', index: 1, title: 'رشد — پنل‌های بنتو' },
			{ key: 'tpl-stats', type: 'section', page: 'home', index: 2, title: 'رشد — نوار آمار' },
			{ key: 'tpl-plans', type: 'page', page: 'plans', title: 'رشد — برنامه‌ها' },
			{ key: 'tpl-cases', type: 'section', page: 'home', index: 5, title: 'رشد — نمونه‌ها با کارت‌های پشته‌ای' },
		],
		menus: [
			{
				name: 'رشد — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'خدمات', page: 'services' },
					{ title: 'برنامه‌ها', page: 'plans' },
					{ title: 'نمونه‌ها', page: 'cases' },
					{ title: 'یادداشت‌ها', page: 'blog' },
					{ title: 'درباره', page: 'about', children: [{ title: 'درباره‌ی رشد', page: 'about' }, { title: 'پرسش‌های متداول', page: 'faq' }] },
					{ title: 'تماس', page: 'contact' },
				],
			},
			{
				name: 'رشد — پابرگ', location: 'footer', items: [
					{ title: 'خدمات', page: 'services' },
					{ title: 'برنامه‌ها', page: 'plans' },
					{ title: 'نمونه‌ها', page: 'cases' },
					{ title: 'پرسش‌های متداول', page: 'faq' },
					{ title: 'تماس', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 34,
			header_layout: 'split',
			header_cart: false,
			header_cta_text: 'جلسه‌ی رایگان',
			header_cta_url: '{{page:contact}}',
			font_body: 'iransansx',
			font_heading: 'peyda',
			font_heading_weight: '700',
			footer_about: 'رشد، مشاوره‌ی مدیریت و رشد برای شرکت‌های کوچک و متوسط؛ با برنامه‌های نودروزه و همراهی هفتگی.',
			footer_copyright: 'تمام حقوق برای رشد محفوظ است.',
			footer_social: [{ network: 'linkedin', url: 'https://linkedin.com/' }, { network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }],
			mobile_bar: true,
			mobile_bar_text: 'جلسه‌ی رایگان',
			mobile_bar_url: '{{page:contact}}',
			mobile_bar_phone: '02191004400',
			cursor: 'dot',
			sound_enabled: true,
			sound_default: true,
			sound_theme: 'soft',
			sound_volume: 18,
			sound_hover: false,
		},
		front_page: 'home',
		posts_page: 'blog',
	},
};
