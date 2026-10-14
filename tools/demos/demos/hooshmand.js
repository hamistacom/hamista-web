/**
 * Demo: Hooshmand — an applied-AI company: an assistant that answers
 * customers, analytics that reads the numbers and automation for the
 * repetitive work (Azure kit with a violet accent; dark by default, light on
 * request). Threads of light float around a giant headline and drift with
 * the pointer, products come forward one at a time from the depth of the
 * page, a reel opens up with the scroll, then crossed ribbons, a bento of
 * figures, a staged process, reviews, team, pricing and journal.
 * Pages: about, solutions (+3 solution pages), case studies, demo booking
 * with the team, pricing, shop of plans and credits, journal, FAQ and contact.
 */
'use strict';

const L = require('../lib');
const { img, gallery, link, px, gap, w, con, section, cols, heading, button } = L;

const images = {};
[
	'light-1', 'light-2', 'light-3', 'light-4', 'light-5', 'face-1', 'face-2', 'face-3', 'wave', 'silk', 'silk-2', 'reel',
	'office-1', 'office-2', 'office-3', 'office-4', 'tm-1', 'tm-2', 'tm-3', 'tm-4', 'av-1', 'av-2', 'av-3', 'av-4',
	'blog-1', 'blog-2', 'blog-3', 'blog-4',
].forEach((k) => { images[k] = 'images/' + k + '.webp'; });

const alts = {
	'face-1': 'چهره‌ای در نور قرمز و آبی',
	'face-2': 'نیم‌رخ مردی در نور آبی و قرمز',
	'face-3': 'زنی در نور آبی',
	wave: 'رشته‌های نور نارنجی روی زمینه‌ی سیاه',
	reel: 'موج نور در تاریکی',
	'office-1': 'تیم در حال کار با لپ‌تاپ در دفتر',
	'office-2': 'جلسه‌ی تیم دور میز',
	'office-3': 'دو همکار در حال بررسی نمودارها',
	'office-4': 'دو همکار کنار میز کار',
};

const contactUrl = '{{page:contact}}';
const demoUrl = '{{page:demo}}';
const avatars = gallery(['av-1', 'av-2', 'av-3', 'av-4']);
const eyebrow = (n, label) => '*{ ' + n + ' }* # ' + label;

/* ---------------- Terms ---------------- */

const terms = [
	{ key: 'pf-assist', taxonomy: 'hm_portfolio_cat', name: 'دستیار هوشمند', slug: 'assistant' },
	{ key: 'pf-insight', taxonomy: 'hm_portfolio_cat', name: 'تحلیل داده', slug: 'analytics' },
	{ key: 'pf-auto', taxonomy: 'hm_portfolio_cat', name: 'خودکارسازی', slug: 'automation' },
	{ key: 'cat-ai', taxonomy: 'category', name: 'هوش مصنوعی کاربردی', slug: 'applied-ai' },
	{ key: 'cat-data', taxonomy: 'category', name: 'داده', slug: 'data' },
	{ key: 'cat-product', taxonomy: 'category', name: 'محصول', slug: 'product' },
	{ key: 'sv-demo', taxonomy: 'hm_service', name: 'جلسه‌ی دمو', slug: 'product-demo' },
	{ key: 'pc-plans', taxonomy: 'product_cat', name: 'اشتراک‌ها', slug: 'plans' },
	{ key: 'pc-credit', taxonomy: 'product_cat', name: 'اعتبار پردازش', slug: 'credits' },
];

/* ---------------- Case studies ---------------- */

const project = (key, title, slug, image, detail, cats, meta, excerpt, body) => ({
	key, title, slug, image, terms: cats, meta, excerpt,
	content: L.article(body.concat([['img', detail, '']])),
});

const projects = [
	project('p-bimeh', 'دستیار پاسخ‌گوی «بیمه‌ی آرمان»', 'arman-insurance-assistant', 'office-1', 'light-1', ['pf-assist'],
		{ client: 'بیمه‌ی آرمان', year: '۱۴۰۴', services: 'دستیار گفت‌وگو، اتصال به سامانه‌ی خسارت', url: '' },
		'دستیاری که شبانه‌روز به پرسش بیمه‌گذاران جواب می‌دهد و پرونده‌ی خسارت را خودش باز می‌کند.',
		[
			'مرکز تماس بیمه‌ی آرمان روزی چهار هزار تماس می‌گرفت که بیشترشان یک پرسش تکراری بودند: «پرونده‌ی من کجاست؟». دستیار هوشمند را به سامانه‌ی خسارت وصل کردیم تا همین پرسش را با شماره‌ی بیمه‌نامه، در چند ثانیه جواب دهد.',
			['h', 'آدم‌ها برای کارهای سخت'],
			'حالا کارشناس‌ها فقط پرونده‌هایی را می‌بینند که واقعاً به تصمیم انسانی نیاز دارند و دستیار بقیه را پیش می‌برد.',
			['ul', ['۶۸٪ پرسش‌ها بدون کارشناس پاسخ می‌گیرند', 'زمان انتظار از ۹ دقیقه به ۲۰ ثانیه رسید', 'رضایت مشتری ۴٫۷ از ۵']],
		]),
	project('p-pakhsh', 'پیش‌بینی فروش «پخش البرز»', 'alborz-sales-forecast', 'office-3', 'light-3', ['pf-insight'],
		{ client: 'شرکت پخش البرز', year: '۱۴۰۳', services: 'مدل پیش‌بینی، داشبورد مدیریتی', url: '' },
		'مدلی که فروش هفته‌ی بعد هر شعبه را پیش‌بینی می‌کند تا انبار نه خالی بماند نه پر.',
		[
			'پخش البرز هر هفته برای صد و بیست شعبه سفارش انبار می‌داد و همیشه یا کم می‌آمد یا زیاد. داده‌ی سه سال فروش، تقویم تعطیلات و آب‌وهوا را کنار هم گذاشتیم.',
			['h', 'عدد، پیش از جلسه'],
			'هر شنبه صبح، پیش‌بینی هر شعبه با بازه‌ی اطمینانش روی داشبورد مدیران است.',
			['ul', ['۳۱٪ کاهش کالای مانده در انبار', 'خطای پیش‌بینی زیر ۸٪', 'داشبورد فارسی روی موبایل']],
		]),
	project('p-faktor', 'خودکارسازی فاکتور «فروشگاه ماهور»', 'mahoor-invoice-automation', 'office-2', 'light-5', ['pf-auto'],
		{ client: 'فروشگاه زنجیره‌ای ماهور', year: '۱۴۰۴', services: 'خواندن اسناد، اتصال به حسابداری', url: '' },
		'فاکتورهای کاغذی خوانده می‌شوند، با سفارش تطبیق داده می‌شوند و مستقیم به حسابداری می‌روند.',
		[
			'تیم مالی ماهور هر ماه هزار و پانصد فاکتور را دستی وارد می‌کرد. سامانه‌ای ساختیم که عکس فاکتور را می‌خواند، اقلام را با سفارش خرید تطبیق می‌دهد و فقط موارد مغایر را برای بررسی نگه می‌دارد.',
			['ul', ['۹۲٪ فاکتورها بدون دخالت دستی ثبت می‌شوند', 'بستن حساب ماه از ده روز به دو روز رسید', 'سازگار با نرم‌افزارهای حسابداری ایرانی']],
		]),
];

/* ---------------- Team and demo booking ---------------- */

const shift = { on: true, from: '09:00', to: '13:00', from2: '15:00', to2: '18:00' };
const morning = { on: true, from: '09:00', to: '13:00', from2: '', to2: '' };
const off = { on: false, from: '09:00', to: '13:00', from2: '', to2: '' };
const week = (pattern) => {
	const map = { t: shift, m: morning, o: off };
	const out = {};
	[6, 0, 1, 2, 3, 4, 5].forEach((d, i) => { out[d] = map[pattern[i]] || off; });
	return out;
};
const member = (key, title, slug, order, image, meta, pattern, excerpt, paragraphs) => ({
	key, title, slug, order, image, terms: ['sv-demo'], meta, excerpt, slot: 30, schedule: week(pattern),
	content: L.article(paragraphs),
});

const experts = [
	member('m-arash', 'آرش کیانی', 'arash-kiani', 1, 'tm-1', { role: 'هم‌بنیان‌گذار و مدیر فنی', experience: '۱۴', fee: 'جلسه‌ی دمو رایگان', location: 'آنلاین' }, 'ttmtmoo',
		'مدل‌های زبانی و یادگیری ماشین را از آزمایشگاه به محصول واقعی می‌رساند.',
		['آرش پیش از هوشمند، سال‌ها روی پردازش زبان فارسی کار کرده است و هنوز معماری همه‌ی محصولات را خودش بازبینی می‌کند.', ['ul', ['مدل‌های زبانی فارسی', 'زیرساخت پردازش', 'امنیت داده']]]),
	member('m-sara', 'سارا مهدوی', 'sara-mahdavi', 2, 'tm-3', { role: 'مدیر محصول', experience: '۱۰', fee: 'جلسه‌ی دمو رایگان', location: 'حضوری یا آنلاین' }, 'tmttmoo',
		'از اولین گفت‌وگو تا راه‌اندازی، کنار تیم شما می‌ماند.',
		['سارا محصولات هوشمند را طوری طراحی می‌کند که کارمندان بی‌آموزش طولانی با آن کار کنند.', ['ul', ['کشف نیاز', 'طراحی تجربه‌ی گفت‌وگو', 'اندازه‌گیری نتیجه']]]),
	member('m-kaveh', 'کاوه رستمی', 'kaveh-rostami', 3, 'tm-2', { role: 'سرپرست داده', experience: '۹', fee: 'جلسه‌ی دمو رایگان', location: 'آنلاین' }, 'mtmtmoo',
		'داده‌های پراکنده را به عددهایی تبدیل می‌کند که می‌شود با آن تصمیم گرفت.',
		['کاوه تیم داده را هدایت می‌کند و مدل‌های پیش‌بینی هوشمند زیر نظر اوست.']),
	member('m-nazanin', 'نازنین شریفی', 'nazanin-sharifi', 4, 'tm-4', { role: 'مدیر موفقیت مشتری', experience: '۸', fee: 'جلسه‌ی دمو رایگان', location: 'آنلاین' }, 'ttmmtoo',
		'مطمئن می‌شود هر مشتری از روز اول نتیجه بگیرد.',
		['نازنین راه‌اندازی و آموزش تیم‌های مشتری را بر عهده دارد.']),
];

/* ---------------- Shop: plans and credits ---------------- */

const product = (key, title, slug, price, sku, image, cats, excerpt, paragraphs, specs, extra = {}) => Object.assign({
	key, title, slug, price, sku, image, gallery: [], terms: cats, excerpt, stock: 999, virtual: true,
	content: L.productBody(paragraphs, specs),
}, extra);

const products = [
	product('plan-start', 'اشتراک ماهانه‌ی دستیار — پایه', 'assistant-basic-monthly', 4900000, 'HM-AS-1', 'light-2', ['pc-plans'],
		'دستیار پاسخ‌گو روی سایت و تلگرام، تا دو هزار گفت‌وگو در ماه.',
		['دستیار را با پرسش‌های پرتکرار و صفحه‌های سایتتان آموزش می‌دهیم و روی سایت و تلگرام راه می‌اندازیم.'],
		[['گفت‌وگو', 'تا ۲٬۰۰۰ در ماه'], ['کانال', 'سایت و تلگرام'], ['پشتیبانی', 'ایمیل و تیکت']], { featured: true }),
	product('plan-pro', 'اشتراک ماهانه‌ی دستیار — حرفه‌ای', 'assistant-pro-monthly', 12900000, 'HM-AS-2', 'light-1', ['pc-plans'],
		'اتصال به سامانه‌های داخلی، گزارش تحلیلی و تا ده هزار گفت‌وگو.',
		['دستیار به سفارش‌ها، پرونده‌ها یا موجودی شما وصل می‌شود و کار واقعی انجام می‌دهد؛ همراه با گزارش ماهانه‌ی پرسش‌ها.'],
		[['گفت‌وگو', 'تا ۱۰٬۰۰۰ در ماه'], ['اتصال', 'تا سه سامانه'], ['پشتیبانی', 'تلفنی در ساعت کاری']], { featured: true }),
	product('credit-10', 'اعتبار پردازش اسناد — ۱۰۰۰ برگ', 'document-credit-1000', 3500000, 'HM-CR-1', 'light-3', ['pc-credit'],
		'خواندن فاکتور، قرارداد و فرم؛ هزار برگ، بدون تاریخ انقضا.',
		['هر برگ سند را می‌خوانیم، اقلامش را استخراج می‌کنیم و به‌صورت جدول یا مستقیم به نرم‌افزار شما تحویل می‌دهیم.'],
		[['حجم', '۱٬۰۰۰ برگ'], ['انقضا', 'ندارد'], ['خروجی', 'اکسل یا اتصال مستقیم']]),
	product('credit-50', 'اعتبار پردازش اسناد — ۵۰۰۰ برگ', 'document-credit-5000', 14500000, 'HM-CR-2', 'light-5', ['pc-credit'],
		'برای تیم‌های مالی پرکار؛ پنج هزار برگ با هزینه‌ی کمتر برای هر برگ.',
		['همان پردازش دقیق، با حجم بیشتر و اولویت در صف پردازش.'],
		[['حجم', '۵٬۰۰۰ برگ'], ['اولویت', 'صف ویژه'], ['انقضا', 'ندارد']]),
];

/* ---------------- Journal ---------------- */

const posts = [
	{
		key: 'start', title: 'هوش مصنوعی را از کجای کسب‌وکار شروع کنیم؟', slug: 'where-to-start-with-ai', image: 'blog-1', terms: ['cat-ai'], days_ago: 3,
		excerpt: 'از کاری شروع کنید که هر روز تکرار می‌شود و نتیجه‌اش را می‌شود شمرد.',
		content: L.article([
			'بیشتر پروژه‌های هوش مصنوعی شکست نمی‌خورند چون فناوری ضعیف است؛ شکست می‌خورند چون از جای اشتباهی شروع شده‌اند.',
			['h', 'سه نشانه‌ی جای درست'],
			['ol', ['کار هر روز و بارها تکرار می‌شود', 'داده‌اش همین حالا وجود دارد', 'نتیجه را می‌شود با یک عدد سنجید']],
			'پاسخ به پرسش‌های تکراری مشتری، خواندن اسناد و پیش‌بینی سفارش، معمولاً هر سه نشانه را دارند.',
		]),
	},
	{
		key: 'persian', title: 'چرا مدل‌های زبانی در فارسی سخت‌ترند', slug: 'why-persian-is-hard-for-language-models', image: 'blog-2', terms: ['cat-product'], days_ago: 10,
		excerpt: 'نیم‌فاصله، املای چندگانه و نبود داده‌ی کافی؛ و کارهایی که برایشان می‌کنیم.',
		content: L.article([
			'«می‌روم»، «میروم» و «می روم» برای انسان یکی‌اند و برای ماشین سه کلمه‌ی متفاوت. این تازه شروع ماجراست.',
			['ul', ['یکسان‌سازی نوشتار پیش از پردازش', 'آموزش با متن‌های واقعی هر صنعت', 'آزمون با کاربران فارسی‌زبان']],
		]),
	},
	{
		key: 'data', title: 'داده‌ی کم، تصمیم خوب', slug: 'good-decisions-with-little-data', image: 'blog-3', terms: ['cat-data'], days_ago: 18,
		excerpt: 'لازم نیست سال‌ها داده جمع کنید؛ با سه ماه داده‌ی تمیز هم می‌شود شروع کرد.',
		content: L.article([
			'داده‌ی زیاد و نامرتب کمتر از داده‌ی کم و تمیز به درد می‌خورد. پیش از هر مدلی، داده‌ها را مرتب کنید.',
			['ol', ['یک منبع حقیقت برای هر عدد', 'تعریف یکسان برای هر شاخص', 'ثبت خودکار به جای ورود دستی']],
		]),
	},
	{
		key: 'trust', title: 'حریم داده در پروژه‌های هوشمند', slug: 'data-privacy-in-ai-projects', image: 'blog-4', terms: ['cat-ai'], days_ago: 26,
		excerpt: 'داده‌ی مشتری‌های شما کجا می‌رود و چه کسی آن را می‌بیند؟',
		content: L.article([
			'نخستین پرسش هر مدیر درباره‌ی هوش مصنوعی همین است و باید هم باشد. همه‌ی پردازش‌های ما روی سرورهای داخل کشور انجام می‌شود و داده‌ی هیچ مشتری برای آموزش مدل مشتری دیگری استفاده نمی‌شود.',
		]),
	},
];

/* ---------------- Shared blocks ---------------- */

const solutions = [
	{ title: 'دستیار هوشمند', text: 'به پرسش مشتری‌ها در سایت، تلگرام و تماس تلفنی جواب می‌دهد و کار را تا آخر پیش می‌برد.', tags: 'گفت‌وگو، پشتیبانی، فروش', image: img('light-1'), icon: 'chat', link: link('{{page:assistant}}') },
	{ title: 'تحلیل و پیش‌بینی', text: 'فروش، تقاضا و رفتار مشتری را پیش‌بینی می‌کند و نتیجه را به زبان ساده نشان می‌دهد.', tags: 'داشبورد، پیش‌بینی، گزارش', image: img('light-3'), icon: 'chart', link: link('{{page:insight}}') },
	{ title: 'خودکارسازی فرایند', text: 'اسناد را می‌خواند، داده را جابه‌جا می‌کند و کارهای تکراری را بی‌خطا انجام می‌دهد.', tags: 'اسناد، حسابداری، گردش کار', image: img('light-5'), icon: 'bolt', link: link('{{page:automate}}') },
	{ title: 'مشاوره و آموزش', text: 'نقشه‌ی راه هوش مصنوعی سازمان را می‌کشیم و تیم شما را برای کار با آن آماده می‌کنیم.', tags: 'نقشه‌ی راه، کارگاه، همراهی', image: img('light-2'), icon: 'compass', link: link(demoUrl) },
];

const faqItems = [
	['داده‌های ما کجا نگهداری می‌شود؟', 'همه‌ی پردازش‌ها روی سرورهای داخل کشور انجام می‌شود و داده‌ی شما فقط برای سامانه‌ی خودتان استفاده می‌شود. قرارداد محرمانگی هم پیش از شروع امضا می‌کنیم.'],
	['راه‌اندازی چقدر طول می‌کشد؟', 'دستیار پایه در کمتر از دو هفته آماده است. پروژه‌هایی که به سامانه‌های داخلی وصل می‌شوند معمولاً چهار تا هشت هفته زمان می‌برند.'],
	['با زبان فارسی و گویش‌های محلی کار می‌کند؟', 'بله؛ مدل‌ها با متن و گفت‌وگوی واقعی فارسی آموزش دیده‌اند و غلط املایی، نیم‌فاصله‌ی جاافتاده و محاوره را می‌فهمند.'],
	['اگر دستیار جواب را نداند چه می‌شود؟', 'گفت‌وگو را با تمام سابقه‌اش به یک کارشناس می‌سپارد تا مشتری لازم نباشد حرفش را تکرار کند.'],
	['می‌توانیم پیش از خرید امتحانش کنیم؟', 'بله. در جلسه‌ی دمو، دستیار را با چند صفحه از سایت خودتان آموزش می‌دهیم تا نتیجه را روی داده‌ی واقعی ببینید.'],
];

const faqBlock = (n) => section({ space: 'lg', gap: 0 }, [
	cols({ widths: [42, 58], gap: 56, align: 'start' }, [
		[
			heading({ eyebrow: eyebrow(n, 'پرسش‌های متداول'), title: 'پیش از شروع،\n*بپرسید*', desc: 'پرسش‌هایی که مدیران پیش از هر پروژه‌ی هوشمند از ما می‌پرسند.', title_size: 'lg' }),
			w('hm-proof', { avatars: gallery(['tm-3']), name: 'سارا مهدوی', role: 'مدیر محصول', score: '', stars: 5, note: '', layout: 'card', align: 'start', plus: '' }),
			button('رزرو جلسه‌ی دمو', demoUrl),
		],
		[L.faq(faqItems, { style: 'cards' })],
	]),
]);

const pricingPlans = [
	{ name: 'پایه', desc: 'برای کسب‌وکارهایی که می‌خواهند پاسخ‌گویی را هوشمند کنند.', price: '۴٫۹', price_alt: '۳٫۹', unit: 'میلیون تومان', period: '/ ماهانه', features: 'دستیار روی سایت و تلگرام\nتا ۲٬۰۰۰ گفت‌وگو در ماه\nآموزش با پرسش‌های شما\nگزارش ماهانه', btn_text: 'شروع کنید', btn_link: link('{{shop}}'), featured: '', badge: '' },
	{ name: 'حرفه‌ای', desc: 'دستیاری که به سامانه‌های شما وصل می‌شود و کار واقعی انجام می‌دهد.', price: '۱۲٫۹', price_alt: '۹٫۹', unit: 'میلیون تومان', period: '/ ماهانه', features: 'همه‌ی امکانات پایه\nتا ۱۰٬۰۰۰ گفت‌وگو در ماه\nاتصال به سه سامانه\nداشبورد تحلیل پرسش‌ها\nپشتیبانی تلفنی', btn_text: 'شروع کنید', btn_link: link('{{shop}}'), featured: 'yes', badge: 'پرطرفدار' },
	{ name: 'سازمانی', desc: 'برای سازمان‌هایی با چند واحد، حجم بالا و نیاز امنیتی ویژه.', price: 'توافقی', price_alt: 'توافقی', unit: '', period: '', features: 'نصب روی سرور سازمان\nمدل اختصاصی\nمدیر پروژه‌ی اختصاصی\nقرارداد سطح خدمات', btn_text: 'تماس بگیرید', btn_link: link(contactUrl), featured: '', badge: '' },
];

const pricingBlock = (n) => section({ space: 'lg', gap: 40 }, [
	heading({ eyebrow: eyebrow(n, 'تعرفه‌ها'), title: 'به اندازه‌ی *نیاز شما*', desc: 'ماهانه یا سالانه؛ هر وقت خواستید ارتقا دهید یا متوقف کنید.', header_align: 'center', title_size: 'lg' }),
	w('hm-pricing', { plans: pricingPlans, switch_off: 'ماهانه', switch_on: 'سالانه', switch_note: '۲۰٪ تخفیف' }),
]);

const ribbon = (items, tilt, bg, color, reverse) => w('hm-marquee', {
	items: items.map((text) => ({ text })), separator: 'plus', size: 'md', look: 'solid', speed: px(46), follow: 'yes', bordered: '',
	reverse: reverse ? 'yes' : '', tilt: { unit: 'deg', size: tilt, sizes: [] }, band_bg: bg, color,
});
const ribbonWords = ['دستیار هوشمند', 'پیش‌بینی فروش', 'خواندن اسناد', 'تحلیل داده', 'خودکارسازی', 'پردازش زبان فارسی'];

const ctaBlock = (n) => con({
	content_width: 'full', css_classes: 'hm-gutter hm-space-lg hm-scheme-inverse hm-dim-photo', flex_gap: gap(32),
	background_background: 'classic', background_image: img('silk'), background_position: 'center center', background_size: 'cover',
}, [
	w('hm-giant-text', { text: 'آینده را', second: 'امروز بسازید', motion: 'slide', look: 'solid', size: { unit: 'vw', size: 11, sizes: [] }, align: 'center', tag: 'p' }),
	cols({ widths: [50, 50], gap: 32, align: 'end' }, [
		[heading({ eyebrow: eyebrow(n, 'شروع کنیم'), title: '', title_size: 'sm' })],
		[L.textEditor('<p>یک جلسه‌ی دمو رزرو کنید؛ دستیار را با چند صفحه از سایت خودتان آموزش می‌دهیم تا نتیجه را همان‌جا ببینید.</p>'),
			L.buttons(['رزرو جلسه‌ی دمو', demoUrl], ['گفت‌وگو با فروش', contactUrl], { btn2_style: 'link' })],
	]),
]);

/* ---------------- Home ---------------- */

const home = [
	L.flow({
		eyebrow: 'هوش مصنوعی کاربردی برای کسب‌وکار',
		title: 'هوشی که\n*کار می‌کند*',
		btn1_text: 'رزرو جلسه‌ی دمو', btn1_link: link(demoUrl),
		mode: 'converge', strength: px(1.2), height: { unit: 'vh', size: 105, sizes: [] },
		items: [
			{ image: img('light-4'), shape: 'card', x: 14, y: 24, size: 230, depth: 0.9, rot: -6 },
			{ image: img('face-1'), shape: 'circle', x: 85, y: 20, size: 150, depth: 0.55 },
			{ image: img('light-3'), shape: 'tall', x: 88, y: 68, size: 170, depth: 1.15, rot: 5 },
			{ image: img('face-2'), shape: 'circle', x: 9, y: 74, size: 130, depth: 0.35 },
			{ image: img('light-2'), shape: 'card', x: 32, y: 88, size: 170, depth: 0.7, rot: 3, mobile: false },
			{ text: 'پاسخ در ۲ ثانیه', shape: 'pill', x: 70, y: 90, size: 190, depth: 0.45 },
			{ text: 'فارسی را می‌فهمد', shape: 'pill', x: 30, y: 17, size: 200, depth: 0.6, mobile: false },
		],
	}),
	L.marquee(['دستیار هوشمند', 'پیش‌بینی فروش', 'خواندن اسناد', 'گزارش خودکار', 'پردازش زبان فارسی', 'داشبورد مدیریتی'], { look: 'muted', size: 'md', separator: 'dot', speed: px(38) }),

	section({ space: 'lg', width: 1040 }, [
		L.textScrub('هوش مصنوعی وقتی ارزش دارد که *کاری واقعی* را بهتر کند: مشتری زودتر جواب بگیرد، مدیر با عدد تصمیم بگیرد و تیم وقتش را صرف کارهای *تکراری* نکند.', { eyebrow: eyebrow('۰۱', 'باور ما'), size: 'lg' }),
	]),

	section({ space: 'lg', gap: 48 }, [
		cols({ widths: [58, 42], gap: 48, align: 'end' }, [
			[heading({ eyebrow: eyebrow('۰۲', 'راه‌حل‌ها'), title: 'چهار راه برای\n*هوشمند شدن*', title_size: 'lg' })],
			[L.textEditor('<p>هر کدام را جدا راه بیندازید یا همه را با هم؛ همه به داده و سامانه‌های فعلی شما وصل می‌شوند.</p>'), button('همه‌ی راه‌حل‌ها', '{{page:solutions}}', 'secondary')],
		]),
		w('hm-service-list', { look: 'stagger', items: solutions }),
	]),

	L.depth({
		scenes: [
			{ image: img('light-1'), label: 'دستیار', title: 'گفت‌وگویی که به نتیجه می‌رسد', text: 'سفارش را پیگیری می‌کند، پرونده باز می‌کند و فقط وقتی لازم است کارشناس را صدا می‌زند.' },
			{ image: img('light-3'), label: 'تحلیل', title: 'عدد هفته‌ی بعد، همین امروز', text: 'پیش‌بینی فروش و تقاضای هر شعبه، با بازه‌ی اطمینان و توضیح ساده.' },
			{ image: img('light-5'), label: 'خودکارسازی', title: 'اسناد، بی‌ورود دستی', text: 'فاکتور و قرارداد خوانده می‌شود، تطبیق داده می‌شود و مستقیم به حسابداری می‌رود.' },
		],
	}),

	section({ space: 'lg', gap: 48 }, [
		heading({ eyebrow: eyebrow('۰۳', 'در یک نگاه'), title: 'عددهایی که\n*مشتری‌ها می‌بینند*', desc: 'میانگین نتیجه‌ی مشتری‌های ما در شش ماه اول.', header_align: 'center', title_size: 'lg' }),
		w('hm-bento', {
			columns: '9', columns_tablet: '2', columns_mobile: '1', row_height: px(280),
			cards: [
				{ kind: 'figure', kicker: 'پرسش‌های مشتری', title: 'بدون کارشناس پاسخ می‌گیرند', value: '۶۸٪', image: img('light-4'), image_place: 'fill', tone: 'dark', cols: '4', rows: '2' },
				{ kind: 'figure', kicker: 'زمان پاسخ', title: 'از ۹ دقیقه به', value: '۲۰ ث', tone: 'accent', cols: '5', rows: '1' },
				{ kind: 'list', title: 'امن از روز اول', text: 'سرورهای داخل کشور\nقرارداد محرمانگی\nدسترسی نقش‌محور\nگزارش هر دسترسی', tone: 'light', cols: '3', rows: '1' },
				{ kind: 'rating', title: 'رضایت مشتری‌ها', value: '4.8/5', tone: 'glass', cols: '2', rows: '1' },
			],
		}),
	]),

	L.scrollZoom({
		eyebrow: 'دمو در یک دقیقه',
		title: 'از پرسش تا *پاسخ*',
		image: img('reel'),
		o_title: 'دستیار، سایت شما را *می‌خواند*.',
		o_desc: 'چند صفحه و پرسش پرتکرار کافی است تا دستیار همان روز اول به مشتری‌ها جواب بدهد.',
		btn1_text: 'رزرو جلسه‌ی دمو', btn1_link: link(demoUrl),
	}),

	con({ content_width: 'full', css_classes: 'hm-ribbons', flex_gap: gap(0) }, [
		ribbon(ribbonWords, -4, 'var(--hm-accent)', '#ffffff', false),
		ribbon(ribbonWords.slice().reverse(), 4, '#0b0d1a', '#ffffff', true),
		w('hm-badge-ring', { mode: 'text', text: 'دمو رایگان • همین هفته • ', center: 'arrow', link: link(demoUrl), look: 'accent', size: px(160), speed: 18 }),
	]),

	section({ space: 'md', gap: 0, cls: 'hm-space-bottom-0' }, [
		w('hm-process', {
			eyebrow: eyebrow('۰۴', 'روند کار'), title: 'از ایده تا\n*راه‌اندازی*', desc: 'چهار گام روشن؛ در هر گام می‌دانید کار کجاست و چه نتیجه‌ای گرفته‌ایم.',
			title_tag: 'h2', title_size: 'md', header_align: 'start', title_reveal: 'words', look: 'tabs', more: 'بیشتر',
			steps: [
				{ icon: 'compass', title: 'کشف', text: 'کارهای تکراری و داده‌های موجود را با تیم شما مرور می‌کنیم و یک هدف قابل اندازه‌گیری می‌گذاریم.', link: link(demoUrl) },
				{ icon: 'grid', title: 'نمونه‌ی اولیه', text: 'در دو هفته نمونه‌ای روی داده‌ی واقعی می‌سازیم تا نتیجه را پیش از سرمایه‌گذاری ببینید.', link: link('{{page:solutions}}') },
				{ icon: 'code', title: 'اتصال و راه‌اندازی', text: 'به سامانه‌های شما وصل می‌شویم، امنیت را بررسی می‌کنیم و تیم را آموزش می‌دهیم.', link: link('{{page:automate}}') },
				{ icon: 'trend', title: 'بهبود مداوم', text: 'هر ماه گزارش می‌دهیم و دقت را با داده‌ی تازه بالاتر می‌بریم.', link: link('{{page:insight}}') },
			],
		}),
		w('hm-giant-text', { text: 'هوشمند', motion: 'marquee', look: 'outline', size: { unit: 'vw', size: 20, sizes: [] }, crop: 'yes', align: 'end', tag: 'p' }),
	]),

	section({ space: 'lg', gap: 40 }, [
		L.textScrub('مدیرانی که *هر روز* با هوشمند کار می‌کنند', { eyebrow: eyebrow('۰۵', 'نظر مشتری‌ها'), size: 'md', align: 'center' }),
		w('hm-testimonial-wall', {
			look: 'spotlight', rating_label: 'امتیاز', summary: 'امتیاز ۴٫۸ از ۵ از سوی +۱۴۰ سازمان', logos: [], logos_label: '',
			items: [
				{ quote: 'مرکز تماس ما نفس کشید. حالا کارشناس‌ها وقتشان را برای پرونده‌هایی می‌گذارند که واقعاً به آن‌ها نیاز دارد.', name: 'مهرداد صالحی', role: 'مدیر خدمات مشتری، بیمه‌ی آرمان', avatar: img('av-1'), rating: '4.9' },
				{ quote: 'برای اولین بار پیش از جلسه‌ی شنبه می‌دانیم هفته‌ی بعد چه می‌فروشیم.', name: 'لیلا کریمی', role: 'مدیر زنجیره‌ی تأمین، پخش البرز', avatar: img('av-2'), rating: '4.8' },
				{ quote: 'بستن حساب ماه از ده روز به دو روز رسید و هیچ‌کس دلش برای ورود دستی تنگ نشده است.', name: 'حمید فراهانی', role: 'مدیر مالی، فروشگاه ماهور', avatar: img('av-3'), rating: '5' },
				{ quote: 'تیمی که هم فنی است هم کسب‌وکار را می‌فهمد؛ ترکیبی که کم پیدا می‌شود.', name: 'نسرین اکبری', role: 'مدیرعامل استارتاپ رهیار', avatar: img('av-4'), rating: '4.9' },
			],
		}),
	]),

	section({ space: 'lg', gap: 40 }, [
		cols({ widths: [55, 45], gap: 48, align: 'end' }, [
			[heading({ eyebrow: eyebrow('۰۶', 'تیم'), title: 'آدم‌هایی پشت\n*مدل‌ها*', title_size: 'lg' })],
			[button('رزرو دمو با تیم', demoUrl, 'secondary')],
		]),
		L.team([
			{ photo: img('tm-1'), name: 'آرش کیانی', role: 'هم‌بنیان‌گذار و مدیر فنی', linkedin: link('https://linkedin.com/'), instagram: link('') },
			{ photo: img('tm-3'), name: 'سارا مهدوی', role: 'مدیر محصول', linkedin: link('https://linkedin.com/'), instagram: link('') },
			{ photo: img('tm-2'), name: 'کاوه رستمی', role: 'سرپرست داده', linkedin: link('https://linkedin.com/'), instagram: link('') },
			{ photo: img('tm-4'), name: 'نازنین شریفی', role: 'مدیر موفقیت مشتری', linkedin: link('https://linkedin.com/'), instagram: link('') },
		], { layout: 'strip', mono: '' }),
	]),

	pricingBlock('۰۷'),
	faqBlock('۰۸'),
	ctaBlock('۰۹'),

	section({ space: 'lg', gap: 40 }, [
		cols({ widths: [58, 42], gap: 48, align: 'end' }, [
			[heading({ eyebrow: eyebrow('۱۰', 'مجله'), title: 'هوش مصنوعی،\n*بی‌اغراق*', title_size: 'lg' })],
			[L.textEditor('<p>یادداشت‌هایی درباره‌ی آنچه در پروژه‌های واقعی جواب داد و آنچه نداد.</p>'), button('همه‌ی نوشته‌ها', '{{page:blog}}', 'secondary')],
		]),
		L.posts({ count: 3, layout: 'list', excerpt: 'yes' }),
	]),
];

/* ---------------- About ---------------- */

const about = [
	L.pageHead(eyebrow('۰۱', 'درباره‌ی ما'), 'هوش مصنوعی،\n*به زبان کسب‌وکار*', 'از ۱۳۹۸ مدل‌های هوشمند فارسی می‌سازیم و آن‌ها را به کار روزمره‌ی سازمان‌ها وصل می‌کنیم.'),
	section({ space: 'md', gap: 24 }, [
		cols({ widths: [60, 40], gap: 24 }, [[L.imageReveal('office-1', { ratio: '16-9' })], [L.imageReveal('face-3', { ratio: '4-5' })]]),
	]),
	section({ space: 'md', gap: 0 }, [
		w('hm-about-intro', {
			style: 'stats', eyebrow: eyebrow('۰۲', 'داستان ما'),
			statement: 'فناوری پیچیده، *تجربه‌ی ساده*.',
			text: 'سه پژوهشگر پردازش زبان که از دیدن مدل‌های خوب در کشوی آزمایشگاه خسته شده بودند، هوشمند را راه انداختند تا همان مدل‌ها در مرکز تماس، انبار و حسابداری کار کنند.',
			btn_text: 'رزرو جلسه‌ی دمو', btn_link: link(demoUrl), btn_style: 'primary',
			figures: [
				{ label: 'سازمان مشتری', value: '+۱۴۰', text: 'از فروشگاه آنلاین تا بیمه و پخش.' },
				{ label: 'گفت‌وگو در ماه', value: '۲ میلیون', text: 'که دستیارهای ما به آن پاسخ می‌دهند.' },
				{ label: 'عضو تیم', value: '۳۸', text: 'پژوهشگر، مهندس، طراح و کارشناس موفقیت مشتری.' },
			],
			score: '4.8/5', score_text: 'میانگین امتیاز مشتری‌ها به همکاری با ما.', score_avatars: avatars,
		}),
	]),
	section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: eyebrow('۰۳', 'ارزش‌ها'), title: 'آنچه کنار نمی‌گذاریم', title_size: 'lg' }),
		L.features([
			{ icon: 'shield', title: 'حریم داده', text: 'داده‌ی شما فقط برای سامانه‌ی خودتان است؛ روی سرورهای داخل کشور.' },
			{ icon: 'target', title: 'نتیجه‌ی قابل سنجش', text: 'هر پروژه با یک عدد شروع می‌شود و با همان عدد سنجیده می‌شود.' },
			{ icon: 'chat', title: 'فارسی، درست', text: 'مدل‌هایمان با متن و گفت‌وگوی واقعی فارسی آموزش دیده‌اند.' },
			{ icon: 'users', title: 'انسان در حلقه', text: 'هر جا تصمیم حساس است، انسان تصمیم می‌گیرد؛ نه مدل.' },
		], { columns: '4', style: 'cards', layout: 'grid' }),
	]),
	section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: eyebrow('۰۴', 'تیم'), title: 'آدم‌های هوشمند', title_size: 'lg' }),
		w('hm-experts', { eyebrow: '', title: '', desc: '', header_align: 'start', title_tag: 'h2', title_size: 'lg', title_reveal: 'words', count: 4, groups: [], filters: '', card_style: 'card', ratio: '3/4', button: 'yes', layout: 'grid', columns: '4' }),
	]),
	ctaBlock('۰۵'),
];

/* ---------------- Solutions ---------------- */

const solutionsPage = [
	L.pageHead(eyebrow('۰۱', 'راه‌حل‌ها'), 'هوش مصنوعی برای\n*کارهای واقعی*', 'دستیار، تحلیل، خودکارسازی و مشاوره؛ هر کدام با نتیجه‌ای که می‌شود اندازه گرفت.'),
	section({ space: 'md', gap: 0 }, [w('hm-service-list', { look: 'numbered', items: solutions.map((s, i) => Object.assign({}, s, { meta_label: 'راه‌اندازی', meta_value: ['۲ هفته', '۴ تا ۶ هفته', '۳ تا ۸ هفته', 'از یک روز'][i] })), btn_text: 'جزئیات' })]),
	section({ space: 'lg', gap: 40 }, [
		w('hm-process', { eyebrow: eyebrow('۰۲', 'روند کار'), title: 'سه مرحله تا نتیجه', desc: 'پیش از هر سرمایه‌گذاری بزرگ، نتیجه را روی داده‌ی خودتان می‌بینید.', title_tag: 'h2', title_size: 'md', header_align: 'center', title_reveal: 'words', look: 'stages', stage: 'مرحله',
			steps: [
				{ icon: 'compass', title: 'کشف و هدف‌گذاری', text: 'کارهای تکراری و داده‌ها را مرور می‌کنیم و یک عدد هدف می‌گذاریم.', image: img('office-2') },
				{ icon: 'grid', title: 'نمونه روی داده‌ی واقعی', text: 'در دو هفته نمونه‌ای می‌سازیم که روی داده‌ی شما کار می‌کند.', image: img('office-3') },
				{ icon: 'trend', title: 'راه‌اندازی و بهبود', text: 'به سامانه‌ها وصل می‌شویم و هر ماه دقت را بالاتر می‌بریم.', image: img('office-4') },
			] }),
	]),
	pricingBlock('۰۳'),
	faqBlock('۰۴'),
];

const solutionPage = (title, lead, image, bullets, body) => [
	L.pageHead(eyebrow('راه‌حل', title), title, lead),
	section({ space: 'md', gap: 40 }, [
		L.imageReveal(image, { ratio: '21-9', reveal: 'clip-up' }),
		cols({ widths: [62, 38], gap: 56, align: 'start' }, [
			[L.textEditor(body), heading({ title: 'آنچه دریافت می‌کنید', title_size: 'sm', title_tag: 'h2' }), L.features(bullets.map(([t, x, i]) => ({ icon: i, title: t, text: x })), { columns: '2', style: 'cards', layout: 'grid' })],
			[w('hm-cta', { eyebrow: '', title: 'روی داده‌ی خودتان\nامتحانش کنید', desc: 'جلسه‌ی دمو رایگان است؛ نیم ساعت با داده‌ی واقعی شما.', title_tag: 'h3', title_size: 'md', header_align: 'start', title_reveal: 'words', action: 'buttons', btn1_text: 'رزرو دمو', btn1_link: link(demoUrl), btn1_style: 'primary', btn2_text: '', look: 'surface', decor: '', rounded: 'yes' })],
		]),
	]),
	section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: eyebrow('نمونه', 'تجربه‌ی مشتری‌ها'), title: 'پروژه‌هایی در همین زمینه', title_size: 'lg' }),
		w('hm-project-show', { source: 'portfolio', count: 2, look: 'grid', btn_text: 'دیدن پروژه' }),
	]),
];

const assistant = solutionPage('دستیار هوشمند', 'پاسخ‌گوی شبانه‌روزی که کار را تا آخر پیش می‌برد.', 'wave',
	[['سایت، تلگرام و تلفن', 'یک دستیار در همه‌ی کانال‌ها.', 'chat'], ['اتصال به سامانه‌ها', 'سفارش، پرونده و موجودی را می‌خواند.', 'link'], ['تحویل به کارشناس', 'با تمام سابقه‌ی گفت‌وگو.', 'users'], ['گزارش پرسش‌ها', 'بدانید مشتری‌ها چه می‌پرسند.', 'chart']],
	'<p>دستیار هوشمند با صفحه‌های سایت، پرسش‌های پرتکرار و سامانه‌های شما آموزش می‌بیند و به زبان خود مشتری جواب می‌دهد؛ رسمی یا محاوره‌ای، با غلط املایی یا بی آن.</p><p>هر جا جواب را نداند، گفت‌وگو را با تمام سابقه‌اش به کارشناس می‌سپارد تا مشتری مجبور نباشد حرفش را تکرار کند.</p>');
const insight = solutionPage('تحلیل و پیش‌بینی', 'عدد هفته‌ی بعد را همین امروز ببینید.', 'silk-2',
	[['پیش‌بینی فروش', 'برای هر محصول و هر شعبه.', 'trend'], ['داشبورد فارسی', 'روی موبایل و رایانه.', 'grid'], ['هشدار هوشمند', 'وقتی عددی غیرعادی می‌شود.', 'bell'], ['توضیح ساده', 'هر پیش‌بینی با دلیلش.', 'chat']],
	'<p>داده‌های فروش، انبار و تقویم را کنار هم می‌گذاریم و مدلی می‌سازیم که عدد هفته‌ی بعد را با بازه‌ی اطمینانش پیش‌بینی می‌کند.</p><p>نتیجه روی داشبوردی فارسی می‌نشیند که مدیر بدون کارشناس داده هم آن را می‌فهمد.</p>');
const automate = solutionPage('خودکارسازی فرایند', 'کارهای تکراری را به سامانه بسپارید.', 'reel',
	[['خواندن اسناد', 'فاکتور، قرارداد و فرم.', 'file'], ['تطبیق خودکار', 'با سفارش و قرارداد.', 'check'], ['اتصال به حسابداری', 'نرم‌افزارهای ایرانی رایج.', 'link'], ['فقط موارد مغایر', 'برای بررسی انسانی.', 'shield']],
	'<p>اسناد کاغذی و تصویری خوانده می‌شوند، اقلامشان استخراج می‌شود و با سفارش‌ها تطبیق داده می‌شوند.</p><p>فقط مواردی که مغایرت دارند برای بررسی می‌مانند؛ بقیه مستقیم به نرم‌افزار حسابداری شما می‌روند.</p>');

/* ---------------- Case studies, demo booking, pricing, contact ---------------- */

const casesPage = [
	L.pageHead(eyebrow('۰۱', 'تجربه‌ی مشتری‌ها'), 'نتیجه‌هایی که\n*شمرده شدند*', 'سه پروژه از سه صنعت؛ با عددهایی که نشان می‌دهند چه چیزی عوض شد.'),
	section({ space: 'md', gap: 40 }, [w('hm-project-show', { source: 'portfolio', count: 6, look: 'stack', btn_text: 'دیدن پروژه' })]),
	ctaBlock('۰۲'),
];

const demoPage = [
	L.pageHead(eyebrow('۰۱', 'جلسه‌ی دمو'), 'نیم ساعت،\n*روی داده‌ی خودتان*', 'یکی از اعضای تیم و یک زمان خالی را انتخاب کنید؛ لینک جلسه‌ی آنلاین برایتان پیامک می‌شود.'),
	section({ space: 'md', gap: 32 }, [w('hm-booking', { title: 'رزرو جلسه‌ی دمو', intro: 'جلسه‌ها سی دقیقه‌اند و آنلاین برگزار می‌شوند.', expert: '0', groups: [], note: 'yes', box: 'card' })]),
	faqBlock('۰۲'),
];

const pricingPage = [
	L.pageHead(eyebrow('۰۱', 'تعرفه‌ها'), 'شفاف، *بی‌هزینه‌ی پنهان*', 'اشتراک ماهانه یا سالانه، اعتبار پردازش اسناد و قرارداد سازمانی.'),
	pricingBlock('۰۲'),
	faqBlock('۰۳'),
];

const faqPage = [
	L.pageHead(eyebrow('۰۱', 'پرسش‌ها'), 'پرسش‌های متداول', 'پاسخ پرسش‌هایی که پیش از هر پروژه‌ی هوشمند مطرح می‌شود.'),
	faqBlock('۰۲'),
];

const contact = [
	L.pageHead(eyebrow('۰۱', 'تماس'), 'با ما *حرف بزنید*', 'برای خرید، همکاری یا پرسش فنی؛ در کمتر از یک روز کاری پاسخ می‌دهیم.'),
	section({ space: 'md', gap: 0 }, [
		cols({ widths: [40, 60], gap: 48, align: 'start' }, [
			[L.contactInfo([
				{ icon: 'phone', label: 'تلفن', value: '۰۲۱ ۹۱۰۰ ۵۵۲۰', link: link('tel:02191005520') },
				{ icon: 'mail', label: 'ایمیل', value: 'hello@hooshmand.ir', link: link('mailto:hello@hooshmand.ir') },
				{ icon: 'pin', label: 'نشانی', value: 'تهران، پارک فناوری پردیس، ساختمان نوآوری ۲', link: link('') },
				{ icon: 'clock', label: 'ساعت کاری', value: 'شنبه تا چهارشنبه، ۹ تا ۱۸', link: link('') },
			], { map: '', map_image: '' })],
			[L.contactForm({ show_phone: 'yes', show_company: 'yes', show_subject: 'yes', button: 'ارسال پیام', success: 'پیامتان رسید؛ کمتر از یک روز کاری پاسخ می‌دهیم.' })],
		]),
	]),
];

const pages = [
	{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings({ header: 'transparent' }) },
	{ key: 'about', title: 'درباره‌ی ما', slug: 'about', elementor: about, settings: L.pageSettings() },
	{ key: 'solutions', title: 'راه‌حل‌ها', slug: 'solutions', elementor: solutionsPage, settings: L.pageSettings() },
	{ key: 'assistant', title: 'دستیار هوشمند', slug: 'ai-assistant', elementor: assistant, settings: L.pageSettings() },
	{ key: 'insight', title: 'تحلیل و پیش‌بینی', slug: 'analytics', elementor: insight, settings: L.pageSettings() },
	{ key: 'automate', title: 'خودکارسازی فرایند', slug: 'automation', elementor: automate, settings: L.pageSettings() },
	{ key: 'cases', title: 'تجربه‌ی مشتری‌ها', slug: 'case-studies', elementor: casesPage, settings: L.pageSettings() },
	{ key: 'demo', title: 'جلسه‌ی دمو', slug: 'book-a-demo', elementor: demoPage, settings: L.pageSettings() },
	{ key: 'pricing', title: 'تعرفه‌ها', slug: 'pricing', elementor: pricingPage, settings: L.pageSettings() },
	{ key: 'faq', title: 'پرسش‌های متداول', slug: 'faq', elementor: faqPage, settings: L.pageSettings() },
	{ key: 'contact', title: 'تماس', slug: 'contact', elementor: contact, settings: L.pageSettings() },
	{ key: 'blog', title: 'مجله', slug: 'journal', content: '' },
];

module.exports = {
	manifest: {
		id: 'hooshmand',
		order: 4,
		title: 'هوشمند',
		desc: 'شرکت هوش مصنوعی کاربردی: دستیار گفت‌وگو، تحلیل و پیش‌بینی و خودکارسازی اسناد. رشته‌های نور شناور گرد عنوان بزرگ، محصولاتی که از عمق صفحه جلو می‌آیند، ویدیویی که با اسکرول باز می‌شود، نوارهای ضربدری، بنتوی عددها، تعرفه‌ی ماهانه و سالانه، رزرو آنلاین دمو و فروشگاه اشتراک. سرمه‌ای و بنفش؛ تیره و روشن.',
		kit: 'azure',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: ['woocommerce'],
		tags: ['هوش مصنوعی', 'فناوری', 'استارتاپ', 'تیره', 'رزرو دمو', 'فروشگاه اشتراک'],
		pages: pages.filter((p) => p.elementor).map((p) => p.title).concat(['فروشگاه', 'مجله']),
	},
	content: {
		site: { title: 'هوشمند', tagline: 'هوش مصنوعی کاربردی برای کسب‌وکار' },
		images, alts, terms, posts, projects, experts, products, pages,
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'هوشمند — صفحه‌ی اصلی' },
			{ key: 'tpl-solutions', type: 'page', page: 'solutions', title: 'هوشمند — راه‌حل‌ها' },
			{ key: 'tpl-hero', type: 'section', page: 'home', index: 0, title: 'هوشمند — قهرمان با عناصر شناور' },
			{ key: 'tpl-depth', type: 'section', page: 'home', index: 4, title: 'هوشمند — محصولات در عمق' },
			{ key: 'tpl-bento', type: 'section', page: 'home', index: 5, title: 'هوشمند — بنتوی عددها' },
			{ key: 'tpl-cta', type: 'section', page: 'home', index: 13, title: 'هوشمند — دعوت به دمو' },
		],
		menus: [
			{
				name: 'هوشمند — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'راه‌حل‌ها', page: 'solutions', children: [
						{ title: 'دستیار هوشمند', page: 'assistant' },
						{ title: 'تحلیل و پیش‌بینی', page: 'insight' },
						{ title: 'خودکارسازی فرایند', page: 'automate' },
					] },
					{ title: 'تجربه‌ی مشتری‌ها', page: 'cases' },
					{ title: 'تعرفه‌ها', page: 'pricing' },
					{ title: 'درباره‌ی ما', page: 'about', children: [
						{ title: 'پرسش‌های متداول', page: 'faq' },
						{ title: 'تماس', page: 'contact' },
					] },
					{ title: 'فروشگاه', url: '{{shop}}' },
					{ title: 'مجله', page: 'blog' },
				],
			},
			{
				name: 'هوشمند — پابرگ', location: 'footer', items: [
					{ title: 'راه‌حل‌ها', page: 'solutions' },
					{ title: 'تجربه‌ی مشتری‌ها', page: 'cases' },
					{ title: 'تعرفه‌ها', page: 'pricing' },
					{ title: 'جلسه‌ی دمو', page: 'demo' },
					{ title: 'پرسش‌ها', page: 'faq' },
					{ title: 'تماس', page: 'contact' },
				],
			},
		],
		options: {
			color_scheme: 'dark',
			accent: '#6d4dff',
			accent_dark: '#9d8bff',
			header_layout: 'split',
			header_cart: true,
			header_cta_text: 'دمو رایگان',
			header_cta_url: demoUrl,
			font_body: 'dana',
			font_body_weight: '400',
			font_heading: 'peyda',
			font_heading_weight: '800',
			booking_type: 'consulting',
			booking_page: '{{pageid:demo}}',
			booking_days: 21,
			footer_about: 'هوش مصنوعی کاربردی برای کسب‌وکارهای ایرانی؛ دستیار، تحلیل و خودکارسازی روی سرورهای داخل کشور.',
			footer_copyright: 'تمام حقوق برای هوشمند محفوظ است.',
			footer_social: [{ network: 'linkedin', url: 'https://linkedin.com/' }, { network: 'telegram', url: 'https://t.me/' }, { network: 'instagram', url: 'https://instagram.com/' }, { network: 'x', url: 'https://x.com/' }],
			mobile_bar: true,
			mobile_bar_text: 'دمو رایگان',
			mobile_bar_url: demoUrl,
			mobile_bar_phone: '02191005520',
			magnetic: true,
			cursor: 'spotlight',
			preloader: 'counter',
			preloader_tone: 'dark',
			sound_enabled: false,
			seo_business_type: 'ProfessionalService',
			seo_business_phone: '02191005520',
			seo_business_city: 'تهران',
			seo_business_street: 'پارک فناوری پردیس، ساختمان نوآوری ۲',
			seo_llms_intro: 'هوشمند شرکت هوش مصنوعی کاربردی در تهران است: دستیار گفت‌وگو، تحلیل و پیش‌بینی و خودکارسازی اسناد.',
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 3, pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
