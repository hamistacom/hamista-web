/**
 * Demo: Sepehr — a digital agency for web, product and growth (Ember kit,
 * dark), after the second home page of the Noryx reference: the brand name
 * written huge along the bottom of the hero with two round portraits and a
 * project card, services as cards that widen, figures beside a laptop,
 * a project grid, two crossed ribbons with a turning badge, a bento of smart
 * solutions, a tabbed process over a giant word, two columns of reviews,
 * team, a large "get in touch", FAQ, pricing with a yearly switch and journal.
 * Pages: about, services (+3 service pages), projects, team with online
 * consultation booking, pricing, shop of digital services, journal, FAQ and contact.
 */
'use strict';

const L = require('../lib');
const { img, gallery, link, px, gap, pad, w, con, bleed, section, cols, heading, button } = L;

const images = { logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp', apps: 'images/apps.webp' };
[
	'orb-a', 'orb-b', 'hero-bg', 'ser-1', 'ser-2', 'ser-3', 'laptop', 'pro-1', 'pro-2', 'pro-3', 'pro-4', 'pro-5', 'pro-6',
	'chain', 'support', 'tm-1', 'tm-2', 'tm-3', 'tm-4', 'av-1', 'av-2', 'av-3', 'av-4', 'av-5',
	'touch', 'blog-1', 'blog-2', 'blog-3', 'blog-4', 'blog-5', 'blog-6', 'office-1', 'office-2', 'work-1', 'work-2', 'work-3',
].forEach((k) => { images[k] = 'images/' + k + '.webp'; });
for (let i = 1; i <= 7; i++) {
	images['logo-w-' + i] = 'images/logo-w-' + i + '.webp';
}

const alts = {
	'orb-a': 'نیم‌رخ مردی روی زمینه‌ی نارنجی',
	'orb-b': 'مردی خندان با عینک و پیراهن نارنجی',
	laptop: 'لپ‌تاپی با صفحه‌ی یک وب‌سایت روی میز',
	support: 'پشتیبان خندان تیم سپهر',
	'office-1': 'تیم سپهر دور میز کار',
	'office-2': 'دو همکار در حال بررسی طرح روی لپ‌تاپ',
};

const contactUrl = '{{page:contact}}';
const bookUrl = '{{page:consult}}';
const avatars = gallery(['av-1', 'av-2', 'av-3', 'av-4']);
const logos = gallery(['logo-w-1', 'logo-w-2', 'logo-w-3', 'logo-w-4', 'logo-w-5', 'logo-w-6', 'logo-w-7']);

/* ---------------- Terms, posts, projects, team, products ---------------- */

const terms = [
	{ key: 'pf-web', taxonomy: 'hm_portfolio_cat', name: 'طراحی وب', slug: 'web-design' },
	{ key: 'pf-product', taxonomy: 'hm_portfolio_cat', name: 'محصول دیجیتال', slug: 'digital-product' },
	{ key: 'pf-growth', taxonomy: 'hm_portfolio_cat', name: 'بازاریابی', slug: 'marketing' },
	{ key: 'cat-web', taxonomy: 'category', name: 'توسعه‌ی وب', slug: 'web' },
	{ key: 'cat-growth', taxonomy: 'category', name: 'رشد و بازاریابی', slug: 'growth' },
	{ key: 'cat-brand', taxonomy: 'category', name: 'برند', slug: 'brand' },
	{ key: 'sv-consult', taxonomy: 'hm_service', name: 'مشاوره‌ی پروژه', slug: 'project-consult' },
	{ key: 'pc-care', taxonomy: 'product_cat', name: 'پشتیبانی و نگهداری', slug: 'care-plans' },
	{ key: 'pc-growth', taxonomy: 'product_cat', name: 'بسته‌های رشد', slug: 'growth-packs' },
	{ key: 'pc-design', taxonomy: 'product_cat', name: 'طراحی', slug: 'design' },
];

const project = (key, title, slug, image, detail, cats, meta, excerpt, body) => ({
	key, title, slug, image, terms: cats, meta, excerpt,
	content: L.article(body.concat([['img', detail, '']])),
});

const projects = [
	project('p-metab', 'نقشه‌ی رشد دیجیتال «متابولیسم»', 'metabolism-growth-blueprint', 'pro-1', 'pro-5', ['pf-web'],
		{ client: 'باشگاه سلامت متابولیسم', year: '۱۴۰۴', services: 'طراحی وب، سئو، صفحه‌ی فرود', url: '' },
		'سایتی تازه برای باشگاهی که می‌خواست عضو آنلاین بگیرد؛ از نخستین بازدید تا ثبت‌نام در سه قدم.',
		[
			'متابولیسم باشگاه موفقی بود که هیچ عضوی را از سایتش نمی‌گرفت. مسیر ثبت‌نام را از نه صفحه به سه قدم رساندیم و برای هر برنامه‌ی تمرینی یک صفحه‌ی فرود ساختیم.',
			['h', 'سه قدم تا عضویت'],
			'انتخاب برنامه، انتخاب ساعت و پرداخت. هر قدم روی موبایل در یک صفحه جا می‌شود و کاربر هیچ‌وقت نمی‌پرسد قدم بعد کجاست.',
			['ul', ['۳٫۴ برابر ثبت‌نام آنلاین', 'زمان بارگذاری زیر یک ثانیه', 'رتبه‌ی اول گوگل برای «باشگاه تهران»']],
		]),
	project('p-zarin', 'داشبورد دارایی دیجیتال «زرین»', 'zarin-asset-dashboard', 'pro-2', 'pro-6', ['pf-product'],
		{ client: 'استارتاپ مالی زرین', year: '۱۴۰۳', services: 'تحقیق کاربر، طراحی رابط، سیستم طراحی', url: '' },
		'داشبوردی که دارایی‌ها را در یک نگاه نشان می‌دهد؛ ساده برای تازه‌کار، کامل برای حرفه‌ای.',
		[
			'زرین داده‌ی زیادی داشت و کاربرانی که در آن گم می‌شدند. با بیست کاربر گفت‌وگو کردیم و فهمیدیم بیشترشان فقط سه عدد را هر روز نگاه می‌کنند.',
			['h', 'سه عدد، در یک نگاه'],
			'صفحه‌ی اصلی را حول همین سه عدد چیدیم و بقیه‌ی جزئیات را یک لمس دورتر گذاشتیم. سیستم طراحی هم ساختیم تا تیم بتواند صفحه‌های تازه را خودش بسازد.',
			['q', 'اولین بار بود که کاربرها از سادگی اپ تعریف می‌کردند، نه از امکاناتش.', 'مدیر محصول زرین'],
		]),
	project('p-fithive', 'بازاریابی داده‌محور «فیت‌هایو»', 'fithive-data-marketing', 'pro-3', 'pro-1', ['pf-growth'],
		{ client: 'فروشگاه لوازم ورزشی فیت‌هایو', year: '۱۴۰۴', services: 'تبلیغات کلیکی، ایمیل، گزارش', url: '' },
		'کمپین‌هایی که بودجه را از نمایش به فروش بردند؛ با گزارشی که هر هفته روی میز مدیر است.',
		[
			'فیت‌هایو ماهانه بودجه‌ی زیادی خرج تبلیغ می‌کرد و نمی‌دانست کدام کانال می‌فروشد. پیش از هر کاری ردیابی را از کلیک تا خرید کامل کردیم.',
			['ul', ['۴۲٪ کاهش هزینه‌ی هر فروش', 'دو برابر شدن فروش از ایمیل', 'گزارش هفتگی یک‌صفحه‌ای']],
		]),
	project('p-gostar', 'گسترش دیجیتال «گستر»', 'gostar-digital-expansion', 'pro-4', 'pro-2', ['pf-web', 'pf-growth'],
		{ client: 'شرکت پخش گستر', year: '۱۴۰۳', services: 'وب‌سایت شرکتی، پرتال نمایندگان، سئو', url: '' },
		'سایت شرکتی و پرتالی که نمایندگان فروش در سراسر کشور هر روز با آن کار می‌کنند.',
		[
			'گستر سیصد نماینده‌ی فروش داشت که سفارش‌ها را تلفنی ثبت می‌کردند. پرتالی ساختیم که سفارش، موجودی و پیگیری را یک‌جا می‌آورد.',
			['ul', ['۷۰٪ سفارش‌ها آنلاین ثبت می‌شوند', 'اتصال مستقیم به نرم‌افزار حسابداری', 'آموزش کامل تیم فروش']],
		]),
];

const twoShifts = { on: true, from: '09:00', to: '13:00', from2: '15:00', to2: '18:00' };
const morning = { on: true, from: '09:00', to: '13:00', from2: '', to2: '' };
const off = { on: false, from: '09:00', to: '13:00', from2: '', to2: '' };
const week = (pattern) => {
	const map = { t: twoShifts, m: morning, o: off };
	const days = [6, 0, 1, 2, 3, 4, 5];
	const out = {};
	days.forEach((d, i) => { out[d] = map[pattern[i]] || off; });
	return out;
};
const member = (key, title, slug, order, image, meta, pattern, excerpt, paragraphs) => ({
	key, title, slug, order, image, terms: ['sv-consult'], meta, excerpt, slot: 30, schedule: week(pattern),
	content: L.article(paragraphs),
});

const experts = [
	member('m-babak', 'بابک صدری', 'babak-sadri', 1, 'tm-1', { role: 'بنیان‌گذار و مدیر فنی', experience: '۱۵', fee: 'جلسه‌ی اول رایگان', location: 'آنلاین' }, 'ttmtmoo',
		'پانزده سال است سایت و محصول دیجیتال می‌سازد؛ از فروشگاه‌های کوچک تا سامانه‌های پرترافیک.',
		['بابک سپهر را در ۱۳۸۹ با دو هم‌کلاسی راه انداخت. هنوز روی معماری پروژه‌های بزرگ کار می‌کند و جلسه‌های فنی با مشتری‌ها را خودش می‌گیرد.', ['ul', ['معماری نرم‌افزار', 'وردپرس و ووکامرس در مقیاس بالا', 'امنیت و سرعت']]]),
	member('m-shirin', 'شیرین افشار', 'shirin-afshar', 2, 'tm-2', { role: 'مدیر طراحی محصول', experience: '۱۲', fee: 'جلسه‌ی اول رایگان', location: 'حضوری یا آنلاین' }, 'tmttmoo',
		'محصول را از نگاه کاربر می‌بیند؛ تحقیق، طراحی رابط و سیستم طراحی.',
		['شیرین پیش از سپهر طراح ارشد دو استارتاپ مالی بود و حالا تیم طراحی را هدایت می‌کند.', ['ul', ['تحقیق کاربر', 'طراحی رابط وب و موبایل', 'سیستم طراحی']]]),
	member('m-omid', 'امید نیک‌نام', 'omid-niknam', 3, 'tm-3', { role: 'مدیر رشد و بازاریابی', experience: '۱۰', fee: '۸۵۰ هزار تومان', location: 'آنلاین' }, 'mtmtmoo',
		'کمپین‌هایی می‌سازد که هر تومانش اندازه گرفته می‌شود.',
		['امید ده سال است کمپین‌های دیجیتال فروشگاه‌ها و استارتاپ‌ها را مدیریت می‌کند.', ['ul', ['تبلیغات کلیکی', 'سئو و محتوا', 'تحلیل داده و گزارش']]]),
	member('m-negar', 'نگار فرهمند', 'negar-farahmand', 4, 'tm-4', { role: 'سرپرست پشتیبانی و نگهداری', experience: '۸', fee: '۶۵۰ هزار تومان', location: 'آنلاین' }, 'ttmmtoo',
		'سایت‌ها را سالم، به‌روز و سریع نگه می‌دارد؛ بی‌آنکه کسی متوجه شود.',
		['نگار سرپرست تیم پشتیبانی سپهر است و بیش از صد سایت را نگهداری می‌کند.']),
];

const product = (key, title, slug, price, sku, image, cats, excerpt, paragraphs, specs, extra = {}) => Object.assign({
	key, title, slug, price, sku, image, gallery: [], terms: cats, excerpt, stock: 999, virtual: true,
	content: L.productBody(paragraphs, specs),
}, extra);

const products = [
	product('care-basic', 'پشتیبانی و نگهداری ماهانه‌ی سایت', 'monthly-site-care', 2400000, 'SP-CARE-1', 'pro-4', ['pc-care'],
		'به‌روزرسانی، پشتیبان‌گیری، پایش امنیت و رفع خطا؛ هر ماه، بی‌دردسر.',
		['هر هفته افزونه‌ها و هسته را به‌روز می‌کنیم، هر روز پشتیبان می‌گیریم و اگر خطایی پیش بیاید، پیش از آنکه مشتری‌هایتان ببینند رفعش می‌کنیم.'],
		[['مدت', 'یک ماه'], ['پاسخ‌گویی', 'کمتر از چهار ساعت'], ['گزارش', 'ماهانه']], { featured: true }),
	product('bug-fix', 'رفع خطای فوری سایت', 'urgent-bug-fix', 1500000, 'SP-FIX-1', 'pro-3', ['pc-care'],
		'سایت از کار افتاده یا خطا می‌دهد؟ در کمتر از ۲۴ ساعت درستش می‌کنیم.',
		['خطای پایگاه داده، صفحه‌ی سفید، ویروس یا ناسازگاری افزونه؛ مشکل را پیدا می‌کنیم، رفع می‌کنیم و گزارش می‌دهیم چه بود.'],
		[['زمان رفع', 'کمتر از ۲۴ ساعت'], ['شامل', 'یک مشکل مشخص']]),
	product('seo-month', 'بسته‌ی سئوی ماهانه', 'monthly-seo-pack', 6900000, 'SP-SEO-1', 'pro-1', ['pc-growth'],
		'سئوی فنی، چهار محتوای تخصصی و گزارش رتبه؛ هر ماه.',
		['هر ماه مشکلات فنی سایت را رفع می‌کنیم، چهار محتوای تخصصی بر پایه‌ی جست‌وجوی واقعی مخاطب می‌نویسیم و گزارش رتبه می‌فرستیم.'],
		[['محتوا', 'چهار مقاله در ماه'], ['گزارش', 'ماهانه'], ['حداقل قرارداد', 'سه ماه']], { featured: true }),
	product('ads-setup', 'راه‌اندازی کمپین تبلیغات کلیکی', 'ppc-campaign-setup', 4500000, 'SP-ADS-1', 'pro-2', ['pc-growth'],
		'ساخت حساب، ردیابی تبدیل و اولین کمپین؛ آماده برای فروش.',
		['حساب تبلیغاتی را درست می‌سازیم، ردیابی تبدیل را راه می‌اندازیم و اولین کمپین را با پیام و صفحه‌ی فرود مناسب منتشر می‌کنیم.'],
		[['زمان تحویل', 'پنج روز کاری'], ['شامل', 'دو هفته پایش']]),
	product('ui-app', 'طراحی رابط کاربری اپلیکیشن', 'app-ui-design', 18000000, 'SP-UI-1', 'pro-5', ['pc-design'],
		'طراحی ده صفحه‌ی کلیدی اپلیکیشن با سیستم طراحی و نمونه‌ی تعاملی.',
		['ده صفحه‌ی اصلی اپ را طراحی می‌کنیم، نمونه‌ی تعاملی می‌سازیم و فایل فیگما را با سیستم طراحی تحویل می‌دهیم.'],
		[['تعداد صفحه', '۱۰'], ['خروجی', 'فیگما و نمونه‌ی تعاملی'], ['بازبینی', 'دو دور']]),
	product('landing', 'طراحی صفحه‌ی فرود کمپین', 'campaign-landing-page', 7500000, 'SP-LND-1', 'pro-6', ['pc-design'],
		'صفحه‌ی فرودی سریع و راست‌چین که برای فروش ساخته شده است.',
		['متن، طراحی و ساخت صفحه با المنتور؛ همراه با فرم، ردیابی و آزمون سرعت.'],
		[['زمان تحویل', 'هفت روز کاری'], ['سرعت', 'بالای ۹۵ در PageSpeed']]),
];

const posts = [
	{
		key: 'branding', title: 'برندینگ خلاق چطور کسب‌وکار را جلو می‌برد', slug: 'how-creative-branding-drives-business', image: 'blog-1', terms: ['cat-brand'], days_ago: 2,
		excerpt: 'هویت بصری و روایت درست، اعتماد می‌سازند و اعتماد، مشتری وفادار.',
		content: L.article([
			'مشتری پیش از خرید، تصمیم می‌گیرد به شما اعتماد کند یا نه. برند همان چیزی است که این تصمیم را آسان می‌کند: یک ظاهر یکدست، یک لحن آشنا و قولی که هر بار تکرار می‌شود.',
			['h', 'از لوگو بزرگ‌تر'],
			'برند از لوگو شروع می‌شود اما آنجا تمام نمی‌شود. پاسخ پشتیبانی، بسته‌بندی و حتی پیامک تأیید سفارش هم بخشی از برند شماست.',
			['ul', ['یک راهنمای برند کوتاه و کاربردی', 'لحن یکسان در همه‌ی کانال‌ها', 'بازبینی سالانه']],
		]),
	},
	{
		key: 'seo', title: 'راهبردهای سئو که واقعاً نتیجه می‌دهند', slug: 'seo-strategies-that-deliver', image: 'blog-2', terms: ['cat-growth'], days_ago: 8,
		excerpt: 'به جای دنبال کردن ترفندها، روی سه کار تمرکز کنید که گوگل همیشه دوست داشته است.',
		content: L.article([
			'هر چند ماه ترفند تازه‌ای برای سئو دست‌به‌دست می‌شود و چند ماه بعد از کار می‌افتد. آنچه می‌ماند، سه اصل ساده است.',
			['ol', ['سایتی سریع و بی‌خطا', 'محتوایی که به پرسش واقعی جواب می‌دهد', 'پیوندهایی که به‌طور طبیعی به دست می‌آیند']],
		]),
	},
	{
		key: 'social', title: 'تاکتیک‌های شبکه‌های اجتماعی برای رشد سریع', slug: 'social-tactics-for-rapid-growth', image: 'blog-3', terms: ['cat-growth'], days_ago: 14,
		excerpt: 'ویدیوی کوتاه، انتشار منظم و گفت‌وگو با مخاطب؛ سه چیزی که امسال جواب داد.',
		content: L.article([
			'شبکه‌های اجتماعی جای تبلیغ نیستند؛ جای گفت‌وگو هستند. برندهایی که امسال رشد کردند، بیشتر از آنکه حرف بزنند، گوش دادند.',
			['ul', ['ویدیوهای زیر یک دقیقه', 'تقویم انتشار ثابت', 'پاسخ به هر نظر در کمتر از یک ساعت']],
		]),
	},
	{
		key: 'speed', title: 'هر ثانیه تأخیر، چقدر فروش را کم می‌کند؟', slug: 'what-a-second-of-delay-costs', image: 'blog-4', terms: ['cat-web'], days_ago: 21,
		excerpt: 'سرعت سایت فقط موضوعی فنی نیست؛ مستقیم روی فروش اثر می‌گذارد.',
		content: L.article([
			'در پروژه‌های امسال، هر بار سرعت صفحه‌ی محصول را یک ثانیه بهتر کردیم، نرخ خرید هم بالا رفت.',
			['ul', ['تصاویر WebP در اندازه‌ی واقعی', 'فونت میزبانی‌شده روی سایت خودتان', 'حذف اسکریپت‌های بی‌استفاده']],
		]),
	},
	{
		key: 'data', title: 'بازاریابی داده‌محور برای کسب‌وکارهای کوچک', slug: 'data-driven-marketing-small-business', image: 'blog-5', terms: ['cat-growth'], days_ago: 27,
		excerpt: 'لازم نیست تیم داده داشته باشید؛ با سه گزارش ساده می‌شود تصمیم بهتر گرفت.',
		content: L.article([
			'بیشتر کسب‌وکارهای کوچک داده دارند، اما از آن استفاده نمی‌کنند. این سه گزارش را هر هفته نگاه کنید.',
			['ol', ['فروش به تفکیک کانال', 'هزینه‌ی جذب هر مشتری', 'مشتری‌هایی که دوباره خرید کرده‌اند']],
		]),
	},
	{
		key: 'future', title: 'آینده‌ی بازاریابی دیجیتال در یک نگاه', slug: 'future-of-digital-marketing', image: 'blog-6', terms: ['cat-brand'], days_ago: 35,
		excerpt: 'هوش مصنوعی، جست‌وجوی گفتاری و حریم خصوصی؛ برای سال آینده چه آماده کنیم؟',
		content: L.article([
			'ابزارها عوض می‌شوند اما اصل ثابت است: پیام روشن به مخاطب درست. در این نوشته سه تغییر مهم سال آینده را مرور می‌کنیم.',
		]),
	},
];

/* ---------------- Shared blocks ---------------- */

const eyebrow = (n, label) => '*{ ' + n + ' }* # ' + label;

const services = [
	{ title: 'توسعه‌ی وب', text: 'سایت و فروشگاهی سریع، امن و آماده‌ی رشد؛ با وردپرس یا کدنویسی اختصاصی.', tags: 'وردپرس، ووکامرس، اتصال به سامانه‌ها', image: img('ser-1'), icon: 'code', link: link('{{page:web-dev}}') },
	{ title: 'طراحی رابط و تجربه‌ی کاربری', text: 'ابزارهای هوشمند طراحی برای محصولی که کاربر دوستش دارد.', tags: 'صفحه‌ی فرود، هویت بصری، رابط کاربری، اپلیکیشن', image: img('ser-2'), icon: 'grid', link: link('{{page:ui-design}}') },
	{ title: 'بازاریابی دیجیتال', text: 'سئو، تبلیغات کلیکی و شبکه‌های اجتماعی؛ با گزارشی که می‌شود به آن تکیه کرد.', tags: 'سئو، تبلیغات، محتوا', image: img('ser-3'), icon: 'megaphone', link: link('{{page:marketing}}') },
	{ title: 'پشتیبانی و رفع خطا', text: 'سایت شما را سالم و به‌روز نگه می‌داریم و هر خطا را پیش از دیده شدن رفع می‌کنیم.', tags: 'نگهداری، امنیت، سرعت', image: img('work-1'), icon: 'shield', link: link('{{shop}}') },
];

const faqItems = [
	['آژانس شما دقیقاً چه خدماتی ارائه می‌دهد؟', 'توسعه‌ی وب و فروشگاه، طراحی رابط و تجربه‌ی کاربری، بازاریابی دیجیتال و پشتیبانی و نگهداری سایت. هر خدمت را جدا یا با هم می‌توانید بگیرید.'],
	['برای هر مشتری راهبرد جداگانه می‌نویسید؟', 'بله. هیچ دو کسب‌وکاری شبیه هم نیستند؛ هر پروژه با جلسه‌ی کشف شروع می‌شود و برنامه‌اش مخصوص همان کسب‌وکار است.'],
	['موفقیت کمپین را چطور اندازه می‌گیرید؟', 'با شاخص‌های روشن: بازدید، تبدیل، هزینه‌ی جذب هر مشتری و بازگشت سرمایه. هر ماه گزارشی ساده و دقیق می‌گیرید.'],
	['با استارتاپ‌ها و کسب‌وکارهای کوچک هم کار می‌کنید؟', 'بله؛ بسته‌ی شروع برای همین ساخته شده و جلسه‌ی اول مشاوره هم رایگان است.'],
	['از روند پروژه باخبر می‌شوم؟', 'هر هفته گزارش کوتاه کارهای انجام‌شده را می‌گیرید و در پنل پروژه همیشه می‌بینید کار کجاست.'],
];

const faqBlock = () => section({ space: 'lg', gap: 0 }, [
	cols({ widths: [42, 58], gap: 56, align: 'start' }, [
		[
			heading({ eyebrow: eyebrow('۰۹', 'پرسش‌های متداول'), title: 'پاسخ پرسش‌ها،\n*بی‌ابهام*', desc: 'پرسش‌های رایج درباره‌ی کار با سپهر، همه در یک‌جا.', title_size: 'lg' }),
			L.textEditor('<p>یک گفت‌وگوی کوتاه رزرو کنید تا روند کار را با هم مرور کنیم.</p>'),
			w('hm-proof', { avatars: gallery(['av-5']), name: 'شیرین افشار', role: 'مدیر طراحی محصول', score: '', stars: 5, note: '', layout: 'card', align: 'start', plus: '' }),
			button('رزرو تماس', bookUrl),
		],
		[L.faq(faqItems, { style: 'cards' })],
	]),
]);

const pricingPlans = (featuredBadge) => [
	{ name: 'بسته‌ی شروع', desc: 'انتخابی هوشمند برای استارتاپ‌هایی که سرعت، شفافیت و خلاقیت می‌خواهند.', price: '۲۹', price_alt: '۲۱', unit: 'میلیون تومان', period: '/ ماهانه', features: 'طراحی موشن و انیمیشن\nهشت تا ده پست در ماه\nکپشن و هشتگ\nتوقف یا ارتقا در هر زمان', btn_text: 'شروع کنید', btn_link: link(contactUrl), featured: '', badge: '' },
	{ name: 'بسته‌ی رشد', desc: 'برای برندهایی که می‌خواهند سریع‌تر و منظم‌تر دیده شوند.', price: '۴۵', price_alt: '۳۴', unit: 'میلیون تومان', period: '/ ماهانه', features: 'تصویرسازی و گرافیک سه‌بعدی\nطراحی وب و رابط کاربری\nموشن و انیمیشن\nوب، برند و موشن\nتوقف یا لغو در هر زمان', btn_text: 'شروع کنید', btn_link: link(contactUrl), featured: 'yes', badge: featuredBadge },
	{ name: 'بسته‌ی ویژه', desc: 'تیم کامل سپهر کنار شما؛ برای چند برند و پروژه‌ی هم‌زمان.', price: '۷۹', price_alt: '۵۹', unit: 'میلیون تومان', period: '/ ماهانه', features: 'همه‌ی امکانات بسته‌ی رشد\nمدیر پروژه‌ی اختصاصی\nجلسه‌ی هفتگی\nقرارداد سطح خدمات', btn_text: 'تماس بگیرید', btn_link: link(contactUrl), featured: '', badge: '' },
];

const pricingBlock = (n) => section({ space: 'lg', gap: 40 }, [
	heading({ eyebrow: eyebrow(n, 'تعرفه‌ها'), title: 'تعرفه‌های *منعطف*', desc: 'اشتراک ماهانه‌ی طراحی و توسعه؛ هر وقت خواستید متوقف یا ارتقا دهید.', header_align: 'center', title_size: 'lg' }),
	w('hm-pricing', { plans: pricingPlans('پرطرفدار'), switch_off: 'ماهانه', switch_on: 'سالانه', switch_note: '۲۵٪ تخفیف' }),
	cols({ widths: [16, 66, 18], gap: 24, align: 'center' }, [
		[L.textEditor('<p style="font-weight:800;font-size:1.15em">مشتری‌های ما:</p>')],
		[w('hm-logo-grid', { logos, columns: '7', columns_tablet: '4', columns_mobile: '3', look: 'plain', btn_text: '' })],
		[button('به ما بپیوندید', contactUrl)],
	]),
]);

const touchBlock = () => con({
	content_width: 'full', css_classes: 'hm-gutter hm-space-lg hm-scheme-inverse hm-dim-photo', flex_gap: gap(32),
	background_background: 'classic', background_image: img('touch'), background_position: 'center center', background_size: 'cover',
}, [
	w('hm-giant-text', { text: 'در تماس', second: 'باشیم', motion: 'slide', look: 'solid', size: { unit: 'vw', size: 13, sizes: [] }, align: 'center', tag: 'p' }),
	cols({ widths: [50, 50], gap: 32, align: 'end' }, [
		[heading({ eyebrow: eyebrow('۰۸', 'در تماس باشیم'), title: '', title_size: 'sm' })],
		[L.textEditor('<p>راهبردی منظم برای ساختن برندی که پیوسته و پایدار رشد می‌کند. از همین امروز شروع کنید.</p>'),
			L.buttons(['همین امروز شروع کنید', contactUrl], ['رزرو وقت مشاوره', bookUrl], { btn2_style: 'link' })],
	]),
]);

/* ---------------- Home ---------------- */

const ribbon = (items, tilt, bg, color, reverse) => w('hm-marquee', {
	items: items.map((text) => ({ text })), separator: 'plus', size: 'md', look: 'solid', speed: px(50), follow: 'yes', bordered: '',
	reverse: reverse ? 'yes' : '', tilt: { unit: 'deg', size: tilt, sizes: [] }, band_bg: bg, color,
});
const ribbonWords = ['طراحی وب', 'بازاریابی دیجیتال', 'برندینگ', 'سئو', 'توسعه‌ی وب', 'تبلیغات'];

const home = [
	bleed(w('hm-agency-hero', {
		style: 'wordmark', status: 'پذیرش پروژه‌ی تازه',
		title: 'ما آژانسی\n*دیجیتال* هستیم',
		desc: 'ابزارهای هوشمند بازاریابی و طراحی، برای عملکرد بهتر در همه‌ی کانال‌ها.',
		btn_text: 'شروع کنید', btn_link: link(contactUrl), btn_style: 'primary',
		image: img('orb-a'), image2: img('orb-b'), poster: img('pro-6'), film: 'https://www.aparat.com/v/hamista',
		logos, avatars, big: 'سپ*هر*',
		card_title: 'شروع پروژه', card_text: 'یک تماس رزرو کنید و با مدیر پروژه حرف بزنید.', card_btn: 'رزرو تماس', card_link: link(bookUrl),
		liked: 'انتخاب +۴۵ بنیان‌گذار', height: 'screen',
	}), { background_background: 'classic', background_image: img('hero-bg'), background_position: 'center center', background_size: 'cover' }),

	section({ space: 'lg', gap: 48 }, [
		cols({ widths: [58, 42], gap: 48, align: 'end' }, [
			[heading({ eyebrow: eyebrow('۰۱', 'خدمات ما'), title: 'رشد با\nراهبرد دیجیتال', title_size: 'lg' })],
			[L.textEditor('<p>همه‌ی خدمات دیجیتالی که یک کسب‌وکار برای رشد، ارتباط و موفقیت لازم دارد.</p>'), button('همه‌ی خدمات', '{{page:services}}', 'secondary')],
		]),
		w('hm-service-list', { look: 'panels', items: services }),
	]),

	section({ space: 'lg', gap: 40 }, [
		cols({ widths: [44, 56], gap: 56, align: 'center' }, [
			[L.imageReveal('laptop', { ratio: '4-3', reveal: 'clip-up', parallax: px(0.15) })],
			[
				heading({ eyebrow: eyebrow('۰۲', 'چه کسی هستیم'), title: '', title_size: 'sm' }),
				L.counters([
					{ value: 75, prefix: '', suffix: '+', label: 'پروژه‌ی منتشرشده', desc: 'پروژه‌هایی که از ۱۳۸۹ با موفقیت تحویل داده‌ایم.' },
					{ value: 96, prefix: '', suffix: '٪', label: 'رضایت مشتری', desc: 'درصد مشتری‌هایی که کاملاً راضی بوده‌اند.' },
					{ value: 1389, prefix: '', suffix: '', label: 'سال تأسیس', desc: 'سالی که دو بنیان‌گذار اولین پروژه را تحویل دادند.' },
				], { grouping: '', columns: '3', columns_tablet: '3', columns_mobile: '1' }),
				L.textEditor('<p>سپهر آژانسی با خدمات کامل است؛ از راهبرد و طراحی تا سایتی که فقط زیبا نیست، کار می‌کند و دوام می‌آورد.</p>'),
				w('hm-proof', { avatars: gallery(['tm-1']), name: 'بابک صدری', role: 'بنیان‌گذار', score: '', stars: 0, note: '', layout: 'card', align: 'start', plus: '' }),
			],
		]),
	]),

	section({ space: 'lg', gap: 40, top0: true }, [
		cols({ widths: [58, 42], gap: 48, align: 'end' }, [
			[heading({ eyebrow: eyebrow('۰۳', 'نمونه‌کارها'), title: 'کارهایی که\n*به نتیجه رسیدند*', title_size: 'lg' })],
			[L.textEditor('<p>هر پروژه با یک مسئله‌ی واقعی شروع شده و با عدد سنجیده شده است.</p>'), button('همه‌ی پروژه‌ها', '{{page:projects}}', 'secondary')],
		]),
		w('hm-project-show', { source: 'portfolio', count: 4, look: 'grid', btn_text: 'دیدن پروژه' }),
	]),

	con({ content_width: 'full', css_classes: 'hm-ribbons', flex_gap: gap(0) }, [
		ribbon(ribbonWords, -4, '#ff4a17', '#ffffff', false),
		ribbon(ribbonWords.slice().reverse(), 4, '#0d0d0f', '#ffffff', true),
		w('hm-badge-ring', { mode: 'text', text: 'سلام کنیم • بیایید حرف بزنیم • ', center: 'arrow', link: link(contactUrl), look: 'accent', size: px(170), speed: 18 }),
	]),

	section({ space: 'lg', gap: 48 }, [
		heading({ eyebrow: eyebrow('۰۴', 'چرا سپهر'), title: 'راه‌حل‌های *هوشمند*', desc: 'آنچه سپهر را برای کسب‌وکارهای در حال رشد، انتخابی مطمئن می‌کند.', header_align: 'center', title_size: 'lg' }),
		w('hm-bento', {
			columns: '9', columns_tablet: '2', columns_mobile: '1', row_height: px(300),
			cards: [
				{ kind: 'list', title: 'راه‌حل‌های راهبردی\nبرای اثری ماندگار', text: 'راهبرد اختصاصی\nکیفیت بالای خروجی\nتحویل به‌موقع\nروند شفاف\nپشتیبانی پس از انتشار', btn_text: 'شروع کنید', btn_link: link(contactUrl), tone: 'light', cols: '3', rows: '2' },
				{ kind: 'rating', title: 'مورد اعتماد +۲۰۰ برند', value: '4.9/5', image: img('apps'), image_place: 'bottom', tone: 'dark', cols: '3', rows: '1' },
				{ kind: 'text', title: 'رشد مقیاس‌پذیر', text: 'سامانه‌هایی که همراه کسب‌وکار شما بزرگ می‌شوند.', image: img('chain'), image_place: 'end', tone: 'light', cols: '3', rows: '1' },
				{ kind: 'text', kicker: 'آنلاین', title: 'پشتیبانی مشتری،\nیک پیام فاصله', image: img('support'), image_place: 'end', tone: 'glass', cols: '3', rows: '1' },
				{ kind: 'figure', kicker: 'محبوب کارآفرینان', title: 'مشتری‌هایی که دوباره برمی‌گردند', text: 'چون نتیجه‌ی کارمان را دیده‌اند.', value: '۹۵٪', tone: 'accent', cols: '3', rows: '1' },
			],
		}),
	]),

	section({ space: 'md', gap: 0, cls: 'hm-space-bottom-0' }, [
		w('hm-process', {
			eyebrow: eyebrow('۰۵', 'روند کار'), title: 'چارچوب ما برای\nرشد پایدار برند', desc: 'سامانه‌ای راهبردی برای ساختن برندی قوی که پیوسته و پایدار رشد می‌کند.',
			title_tag: 'h2', title_size: 'md', header_align: 'start', title_reveal: 'words', look: 'tabs', more: 'بیشتر',
			steps: [
				{ icon: 'compass', title: 'کشف و برنامه', text: 'هدف‌ها، بازار و رقبا را بررسی می‌کنیم و نقشه‌ی راه روشنی می‌نویسیم.', link: link('{{page:services}}') },
				{ icon: 'pen', title: 'طراحی', text: 'ایده‌ها را به طرح‌هایی دقیق تبدیل می‌کنیم که پیش از ساخت امتحانشان می‌کنید.', link: link('{{page:ui-design}}') },
				{ icon: 'code', title: 'ساخت و انتشار', text: 'سایت یا محصول را می‌سازیم، می‌آزماییم و طبق زمان‌بندی منتشر می‌کنیم.', link: link('{{page:web-dev}}') },
				{ icon: 'trend', title: 'رشد', text: 'عملکرد را دنبال می‌کنیم و هر ماه نتیجه را بهتر می‌کنیم.', link: link('{{page:marketing}}') },
			],
		}),
		w('hm-giant-text', { text: 'گام‌ها', motion: 'slide', look: 'accent', size: { unit: 'vw', size: 22, sizes: [] }, crop: 'yes', align: 'end', tag: 'p' }),
	]),

	section({ space: 'lg', gap: 40 }, [
		L.textScrub('از زبان *مشتری‌هایی* که کنارشان بودیم', { eyebrow: eyebrow('۰۶', 'نظر مشتری‌ها'), size: 'md', align: 'center' }),
		w('hm-testimonial-wall', {
			look: 'columns', rating_label: 'امتیاز',
			items: [
				{ quote: 'خدمات عالی و راهنمایی دقیق. کمپین‌ها را هوشمندانه پیش بردند و هویت برندمان از همیشه قوی‌تر شد.', name: 'ژینا ولی‌زاده', role: 'مدیر پروژه', avatar: img('av-3'), rating: '4.9', tone: 'light' },
				{ quote: 'تیم سپهر خیلی زود فهمید چه می‌خواهیم و سایتی تحویل داد که فروش ما را دو برابر کرد.', name: 'اسماعیل حسینی', role: 'مدیر فروش', avatar: img('av-2'), rating: '4.9', tone: 'dark' },
				{ quote: 'روایت خلاق را با راهبرد هوشمند ترکیب می‌کنند و نتیجه می‌گیرند. همکاری با آن‌ها را به همه پیشنهاد می‌کنم.', name: 'آنیتا بهرامی', role: 'مدیر توسعه‌ی نرم‌افزار', avatar: img('av-1'), rating: '4.9', tone: 'dark' },
				{ quote: 'در هر مرحله کنارمان بودند و گزارش‌هایشان آن‌قدر روشن بود که تصمیم گرفتن آسان شد.', name: 'جواد جهانی', role: 'مدیر محصول', avatar: img('av-4'), rating: '4.9', tone: 'accent' },
			],
		}),
	]),

	section({ space: 'lg', gap: 40 }, [
		cols({ widths: [55, 45], gap: 48, align: 'end' }, [
			[heading({ eyebrow: eyebrow('۰۷', 'تیم ما'), title: 'کارشناسانی که\nبه *رشد شما* اهمیت می‌دهند', title_size: 'lg' })],
			[button('دیدن همه‌ی تیم', '{{page:team}}', 'secondary')],
		]),
		L.team([
			{ photo: img('tm-1'), name: 'بابک صدری', role: 'بنیان‌گذار و مدیر فنی', linkedin: link('https://linkedin.com/'), instagram: link('') },
			{ photo: img('tm-2'), name: 'شیرین افشار', role: 'مدیر طراحی محصول', linkedin: link('https://linkedin.com/'), instagram: link('') },
			{ photo: img('tm-3'), name: 'امید نیک‌نام', role: 'مدیر رشد و بازاریابی', linkedin: link('https://linkedin.com/'), instagram: link('') },
			{ photo: img('tm-4'), name: 'نگار فرهمند', role: 'سرپرست پشتیبانی', linkedin: link('https://linkedin.com/'), instagram: link('') },
		], { layout: 'grid', columns: '4', columns_tablet: '2', columns_mobile: '2' }),
	]),

	touchBlock(),
	faqBlock(),
	pricingBlock('۱۰'),

	section({ space: 'lg', gap: 40 }, [
		cols({ widths: [58, 42], gap: 48, align: 'end' }, [
			[heading({ eyebrow: eyebrow('۱۱', 'تازه‌ترین نوشته‌ها'), title: 'راهبردهای رشد برای\nبرندهای آینده‌نگر', title_size: 'lg' })],
			[L.textEditor('<p>برنامه‌ریزی هوشمند و نوآوری خلاق، کنار هم برای بهتر شدن عملکرد برند شما.</p>'), button('همه‌ی نوشته‌ها', '{{page:blog}}', 'secondary')],
		]),
		L.posts({ count: 3, layout: 'list', excerpt: 'yes' }),
	]),
];

/* ---------------- About ---------------- */

const about = [
	L.pageHead(eyebrow('۰۱', 'درباره‌ی ما'), 'پانزده سال\n*ساختن برای وب*', 'از ۱۳۸۹ سایت، محصول و کمپین برای کسب‌وکارهای ایرانی می‌سازیم؛ با تیمی که از اول تا آخر کنار شماست.'),
	section({ space: 'md', gap: 24 }, [
		cols({ widths: [60, 40], gap: 24 }, [[L.imageReveal('office-1', { ratio: '16-9' })], [L.imageReveal('office-2', { ratio: '4-5' })]]),
	]),
	section({ space: 'md', gap: 0 }, [
		w('hm-about-intro', {
			style: 'stats', eyebrow: eyebrow('۰۲', 'داستان ما'),
			statement: 'کسب‌وکارها را *به وب* و وب را به فروش وصل می‌کنیم.',
			text: 'دو هم‌کلاسی که اولین سایت را برای یک استارتاپ تازه ساختند، حالا تیمی سی‌نفره‌اند. روش کار عوض نشده است: گوش دادن، ساختن، اندازه گرفتن.',
			btn_text: 'گفت‌وگو کنیم', btn_link: link(contactUrl), btn_style: 'primary',
			figures: [
				{ label: 'مشتری راضی و بازگشتی', value: '۹۶٪', text: 'بیشتر کار ما از مشتری‌های قبلی می‌آید.' },
				{ label: 'پروژه‌ی تحویل‌شده', value: '+۷۵', text: 'سایت، فروشگاه و محصول دیجیتال در صنایع مختلف.' },
				{ label: 'عضو تیم', value: '۳۰', text: 'طراح، برنامه‌نویس، بازاریاب و پشتیبان.' },
			],
			score: '4.9/5', score_text: 'میانگین امتیاز مشتری‌ها به خدمات ما.', score_avatars: avatars,
		}),
	]),
	section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: eyebrow('۰۳', 'خدمات'), title: 'آنچه برایتان می‌سازیم', title_size: 'lg' }),
		w('hm-service-list', { look: 'panels', items: services }),
	]),
	section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: eyebrow('۰۴', 'تیم'), title: 'آدم‌های سپهر', title_size: 'lg' }),
		w('hm-experts', { eyebrow: '', title: '', desc: '', header_align: 'start', title_tag: 'h2', title_size: 'lg', title_reveal: 'words', count: 4, groups: [], filters: '', card_style: 'card', ratio: '3/4', button: 'yes', layout: 'grid', columns: '4' }),
	]),
	faqBlock(),
];

/* ---------------- Services and service pages ---------------- */

const servicesPage = [
	L.pageHead(eyebrow('۰۱', 'خدمات'), 'از طراحی تا رشد،\n*در یک تیم*', 'توسعه‌ی وب، طراحی محصول، بازاریابی و پشتیبانی؛ هر کدام را جدا یا همه را با هم بگیرید.'),
	section({ space: 'md', gap: 0 }, [w('hm-service-list', { look: 'numbered', items: services.map((s, i) => Object.assign({}, s, { meta_label: 'زمان‌بندی', meta_value: ['۴ تا ۸ هفته', '۳ تا ۶ هفته', 'ماهانه', 'ماهانه'][i] })), btn_text: 'جزئیات خدمت' })]),
	section({ space: 'lg', gap: 40 }, [
		w('hm-process', { eyebrow: eyebrow('۰۲', 'روند کار'), title: 'از اولین جلسه تا انتشار', desc: 'سه مرحله‌ی روشن؛ در هر مرحله می‌دانید کجای کار هستیم.', title_tag: 'h2', title_size: 'md', header_align: 'center', title_reveal: 'words', look: 'stages', stage: 'مرحله',
			steps: [
				{ icon: 'compass', title: 'کشف و برنامه', text: 'هدف‌ها، بازار و مخاطب را بررسی می‌کنیم و نقشه‌ی راه روشنی می‌کشیم.', image: img('work-1') },
				{ icon: 'palette', title: 'طراحی و ساخت', text: 'ایده‌ها را به طرح‌های دقیق و بعد به صفحه‌های واقعی تبدیل می‌کنیم.', image: img('work-2') },
				{ icon: 'trend', title: 'بهینه‌سازی و رشد', text: 'عملکرد را دنبال می‌کنیم و نتیجه را هر ماه بزرگ‌تر می‌کنیم.', image: img('work-3') },
			] }),
	]),
	pricingBlock('۰۳'),
	faqBlock(),
];

const servicePage = (title, lead, image, bullets, body) => [
	L.pageHead(eyebrow('خدمت', title), title, lead),
	section({ space: 'md', gap: 40 }, [
		L.imageReveal(image, { ratio: '21-9', reveal: 'clip-up' }),
		cols({ widths: [62, 38], gap: 56, align: 'start' }, [
			[L.textEditor(body), heading({ title: 'آنچه دریافت می‌کنید', title_size: 'sm', title_tag: 'h2' }), L.features(bullets.map(([t, x, i]) => ({ icon: i, title: t, text: x })), { columns: '2', style: 'cards', layout: 'grid' })],
			[w('hm-cta', { eyebrow: '', title: 'برای پروژه‌تان\nبرنامه بگیرید', desc: 'جلسه‌ی اول رایگان است؛ نیم ساعت درباره‌ی هدف و بودجه حرف می‌زنیم.', title_tag: 'h3', title_size: 'md', header_align: 'start', title_reveal: 'words', action: 'buttons', btn1_text: 'رزرو مشاوره', btn1_link: link(bookUrl), btn1_style: 'primary', btn2_text: '', look: 'surface', decor: '', rounded: 'yes' })],
		]),
	]),
	section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: eyebrow('نمونه‌ها', 'پروژه‌های مرتبط'), title: 'کارهایی در همین زمینه', title_size: 'lg' }),
		w('hm-project-show', { source: 'portfolio', count: 2, look: 'grid', btn_text: 'دیدن پروژه' }),
	]),
];

const webDev = servicePage('توسعه‌ی وب', 'سایت و فروشگاهی سریع، امن و آماده‌ی رشد.', 'ser-1',
	[['وردپرس و ووکامرس', 'سایت و فروشگاه با ابزارهایی که تیم شما هم بلد است.', 'code'], ['اتصال به سامانه‌ها', 'حسابداری، انبار، درگاه پرداخت و پیامک.', 'link'], ['سرعت و امنیت', 'زیر یک ثانیه و پایش امنیت مداوم.', 'bolt'], ['سئوی فنی', 'ساختار درست برای دیده شدن در گوگل.', 'search']],
	'<p>سایت خوب دیده نمی‌شود؛ فقط کار می‌کند. سریع بالا می‌آید، روی هر گوشی درست نمایش داده می‌شود و سال‌ها بی‌دردسر می‌ماند.</p><p>در سپهر سایت را با فناوری‌هایی می‌سازیم که بعد از تحویل، تیم شما هم بتواند با آن کار کند؛ و تا هر وقت بخواهید کنارتان می‌مانیم.</p>');
const uiDesign = servicePage('طراحی رابط و تجربه‌ی کاربری', 'محصولی که کاربر بی‌راهنما با آن کار می‌کند.', 'ser-2',
	[['تحقیق کاربر', 'گفت‌وگو و آزمون با کاربران واقعی.', 'compass'], ['معماری اطلاعات', 'نقشه‌ی صفحه‌ها و مسیرهای اصلی.', 'grid'], ['طراحی رابط', 'طرح دقیق وب و موبایل.', 'pen'], ['سیستم طراحی', 'اجزای آماده برای تیم شما.', 'palette']],
	'<p>طراحی خوب با پرسیدن شروع می‌شود، نه با کشیدن. پیش از هر طرح با کاربرانتان حرف می‌زنیم تا بفهمیم کجا گیر می‌کنند.</p><p>بعد صفحه‌ها را طراحی می‌کنیم، نمونه‌ی تعاملی می‌سازیم و پیش از برنامه‌نویسی آزمایش می‌کنیم.</p>');
const marketing = servicePage('بازاریابی دیجیتال', 'کمپین‌هایی که هر تومانش قابل ردیابی است.', 'ser-3',
	[['سئو و محتوا', 'رتبه‌ی پایدار با محتوای مفید.', 'search'], ['تبلیغات کلیکی', 'گوگل و شبکه‌های تبلیغاتی ایرانی.', 'target'], ['شبکه‌های اجتماعی', 'تقویم محتوا و ویدیوی کوتاه.', 'megaphone'], ['گزارش و تحلیل', 'گزارش ماهانه‌ی ساده و دقیق.', 'chart']],
	'<p>بازاریابی خوب از عدد شروع می‌شود، نه از حدس. پیش از هر تبلیغ، ردیابی کامل را راه می‌اندازیم تا بدانیم هر کانال چه می‌آورد.</p><p>بعد با پیامی روشن و آزمون‌های کوچک، بودجه را به سمت کانال‌هایی می‌بریم که واقعاً می‌فروشند.</p>');

/* ---------------- Projects, team, booking, pricing, contact ---------------- */

const projectsPage = [
	L.pageHead(eyebrow('۰۱', 'نمونه‌کارها'), 'پروژه‌هایی که\n*به نتیجه رسیدند*', 'سایت، محصول و کمپین؛ با عددهایی که نشان می‌دهند چه تغییری کرد.'),
	section({ space: 'md', gap: 40 }, [w('hm-project-show', { source: 'portfolio', count: 8, look: 'grid', btn_text: 'دیدن پروژه' })]),
	section({ space: 'md', gap: 30 }, [w('hm-logo-grid', { logos, columns: '7', columns_tablet: '4', columns_mobile: '2', look: 'outline', btn_text: '' })]),
	touchBlock(),
];

const teamPage = [
	L.pageHead(eyebrow('۰۱', 'تیم'), 'کارشناسانی که\n*کنار شما* هستند', 'برای مشاوره با هر کدام از اعضای تیم می‌توانید آنلاین وقت بگیرید.'),
	section({ space: 'md', gap: 40 }, [
		w('hm-experts', { eyebrow: '', title: '', desc: '', header_align: 'start', title_tag: 'h2', title_size: 'lg', title_reveal: 'words', count: 8, groups: [], filters: '', card_style: 'card', ratio: '3/4', button: 'yes', layout: 'grid', columns: '4' }),
	]),
	section({ space: 'lg', gap: 40 }, [
		cols({ widths: [50, 50], gap: 48, align: 'center' }, [
			[L.textScrub('به *تیم سپهر* بپیوندید؛ همیشه دنبال آدم‌های کنجکاو هستیم.', { eyebrow: eyebrow('۰۲', 'همکاری'), size: 'md' }), button('ارسال رزومه', contactUrl, 'secondary')],
			[L.imageReveal('office-2', { ratio: '4-3' })],
		]),
	]),
];

const consult = [
	L.pageHead(eyebrow('۰۱', 'مشاوره'), 'یک گفت‌وگوی\n*کوتاه* رزرو کنید', 'مشاور، روز و ساعت را انتخاب کنید؛ پیامک تأیید و لینک جلسه برایتان فرستاده می‌شود.'),
	section({ space: 'md', gap: 40 }, [
		w('hm-booking', { title: 'رزرو جلسه‌ی مشاوره', intro: 'جلسه‌ها سی دقیقه‌اند و آنلاین برگزار می‌شوند.', expert: '0', groups: [], note: 'yes', box: 'card' }),
	]),
	faqBlock(),
];

const pricingPage = [
	L.pageHead(eyebrow('۰۱', 'تعرفه‌ها'), 'قیمت روشن،\n*بی‌غافلگیری*', 'اشتراک ماهانه یا سالانه؛ هر وقت خواستید متوقف یا ارتقا دهید.'),
	pricingBlock('۰۲'),
	faqBlock(),
];

const contact = [
	L.pageHead(eyebrow('۰۱', 'تماس'), 'جزئیات پروژه‌تان را\n*برایمان بنویسید*', 'در ساعات کاری کمتر از یک ساعت پاسخ می‌دهیم.'),
	section({ space: 'md', gap: 0 }, [
		cols({ widths: [40, 60], gap: 48, align: 'start' }, [
			[L.contactInfo([
				{ icon: 'phone', label: 'تلفن', value: '۰۲۱ ۹۱۰۰ ۴۴۳۳', link: link('tel:02191004433') },
				{ icon: 'mail', label: 'ایمیل', value: 'hello@sepehr.agency', link: link('mailto:hello@sepehr.agency') },
				{ icon: 'pin', label: 'دفتر', value: 'تهران، سعادت‌آباد، بلوار پاک‌نژاد، پلاک ۴۲', link: link('') },
				{ icon: 'clock', label: 'ساعت کاری', value: 'شنبه تا چهارشنبه، ۹ تا ۱۸', link: link('') },
			], { map: '', map_image: '' })],
			[con({ content_width: 'full', css_classes: 'hm-panel', padding: pad(40, 40), flex_gap: gap(24) }, [
				heading({ eyebrow: eyebrow('۰۲', 'زمان پاسخ: کمتر از یک ساعت'), title: 'پیام بگذارید', title_size: 'sm' }),
				L.contactForm({ show_phone: 'yes', show_company: 'yes', button: 'ارسال پیام', success: 'پیامتان رسید؛ به‌زودی تماس می‌گیریم.' }),
			], true)],
		]),
	]),
	faqBlock(),
];

const faqPage = [
	L.pageHead(eyebrow('۰۱', 'پرسش‌ها'), 'هر آنچه\n*باید بدانید*', ''),
	faqBlock(),
	touchBlock(),
];

/* ---------------- Pages, templates, menus ---------------- */

const pages = [
	{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings({ header: 'transparent-light' }) },
	{ key: 'about', title: 'درباره‌ی ما', slug: 'about', elementor: about, settings: L.pageSettings() },
	{ key: 'services', title: 'خدمات', slug: 'services', elementor: servicesPage, settings: L.pageSettings() },
	{ key: 'web-dev', parent: 'services', title: 'توسعه‌ی وب', slug: 'web-development', elementor: webDev, settings: L.pageSettings() },
	{ key: 'ui-design', parent: 'services', title: 'طراحی رابط و تجربه‌ی کاربری', slug: 'ui-ux-design', elementor: uiDesign, settings: L.pageSettings() },
	{ key: 'marketing', parent: 'services', title: 'بازاریابی دیجیتال', slug: 'digital-marketing', elementor: marketing, settings: L.pageSettings() },
	{ key: 'projects', title: 'نمونه‌کارها', slug: 'work', elementor: projectsPage, settings: L.pageSettings() },
	{ key: 'team', title: 'تیم', slug: 'team', elementor: teamPage, settings: L.pageSettings() },
	{ key: 'consult', title: 'رزرو مشاوره', slug: 'book-a-call', elementor: consult, settings: L.pageSettings() },
	{ key: 'pricing', title: 'تعرفه‌ها', slug: 'pricing', elementor: pricingPage, settings: L.pageSettings() },
	{ key: 'faq', title: 'پرسش‌های متداول', slug: 'faq', elementor: faqPage, settings: L.pageSettings() },
	{ key: 'contact', title: 'تماس', slug: 'contact', elementor: contact, settings: L.pageSettings() },
	{ key: 'blog', title: 'مجله', slug: 'journal', content: '' },
];

module.exports = {
	manifest: {
		id: 'sepehr',
		order: 2,
		title: 'سپهر',
		desc: 'آژانس دیجیتال توسعه‌ی وب، طراحی محصول و بازاریابی؛ نام برند با حروف عظیم در قهرمان، خدمات کارتی بازشونده، نوارهای متحرک ضربدری، بنتوی راه‌حل‌ها، دیوار نظرها، تعرفه‌ی ماهانه و سالانه، رزرو آنلاین مشاوره و فروشگاه خدمات دیجیتال. مشکی عمیق و نارنجی آتشین؛ تیره و روشن.',
		kit: 'ember',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: ['woocommerce'],
		tags: ['آژانس دیجیتال', 'توسعه‌ی وب', 'تیره', 'رزرو آنلاین', 'فروشگاه خدمات'],
		pages: pages.filter((p) => p.elementor).map((p) => p.title).concat(['فروشگاه', 'مجله']),
	},
	content: {
		site: { title: 'سپهر', tagline: 'آژانس دیجیتال توسعه‌ی وب، محصول و رشد' },
		images, alts, terms, posts, projects, experts, products, pages,
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'سپهر — صفحه‌ی اصلی' },
			{ key: 'tpl-about', type: 'page', page: 'about', title: 'سپهر — درباره‌ی ما' },
			{ key: 'tpl-services', type: 'page', page: 'services', title: 'سپهر — خدمات' },
			{ key: 'tpl-hero', type: 'section', page: 'home', index: 0, title: 'سپهر — قهرمان با نام عظیم برند' },
			{ key: 'tpl-ribbons', type: 'section', page: 'home', index: 5, title: 'سپهر — نوارهای ضربدری' },
			{ key: 'tpl-bento', type: 'section', page: 'home', index: 6, title: 'سپهر — بنتوی راه‌حل‌ها' },
			{ key: 'tpl-touch', type: 'section', page: 'home', index: 10, title: 'سپهر — در تماس باشیم' },
		],
		menus: [
			{
				name: 'سپهر — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'خدمات', page: 'services', children: [
						{ title: 'توسعه‌ی وب', page: 'web-dev' },
						{ title: 'طراحی رابط و تجربه‌ی کاربری', page: 'ui-design' },
						{ title: 'بازاریابی دیجیتال', page: 'marketing' },
					] },
					{ title: 'نمونه‌کارها', page: 'projects' },
					{ title: 'درباره‌ی ما', page: 'about', children: [
						{ title: 'تیم', page: 'team' },
						{ title: 'تعرفه‌ها', page: 'pricing' },
						{ title: 'پرسش‌های متداول', page: 'faq' },
					] },
					{ title: 'فروشگاه', url: '{{shop}}' },
					{ title: 'مجله', page: 'blog' },
					{ title: 'تماس', page: 'contact' },
				],
			},
			{
				name: 'سپهر — پابرگ', location: 'footer', items: [
					{ title: 'درباره‌ی ما', page: 'about' },
					{ title: 'خدمات', page: 'services' },
					{ title: 'تعرفه‌ها', page: 'pricing' },
					{ title: 'نظر مشتری‌ها', page: 'projects' },
					{ title: 'پرسش‌ها', page: 'faq' },
					{ title: 'تماس', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 34,
			color_scheme: 'dark',
			header_layout: 'split',
			header_cart: true,
			header_cta_text: 'شروع پروژه',
			header_cta_url: contactUrl,
			font_body: 'dana',
			font_body_weight: '400',
			font_heading: 'kalameh',
			font_heading_weight: '800',
			booking_type: 'consulting',
			booking_page: '{{pageid:consult}}',
			booking_days: 21,
			footer_about: 'تجربه‌های دیجیتالی که وصل می‌کنند، بزرگ می‌شوند و نتیجه می‌دهند. سپهر از ۱۳۸۹ کنار کسب‌وکارهای ایرانی است.',
			footer_copyright: 'تمام حقوق برای آژانس دیجیتال سپهر محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }, { network: 'linkedin', url: 'https://linkedin.com/' }, { network: 'x', url: 'https://x.com/' }],
			mobile_bar: true,
			mobile_bar_text: 'شروع پروژه',
			mobile_bar_url: contactUrl,
			mobile_bar_phone: '02191004433',
			magnetic: true,
			cursor: 'ring',
			sound_enabled: true,
			sound_default: false,
			sound_theme: 'soft',
			sound_volume: 25,
			seo_business_type: 'ProfessionalService',
			seo_business_phone: '02191004433',
			seo_business_city: 'تهران',
			seo_business_street: 'سعادت‌آباد، بلوار پاک‌نژاد، پلاک ۴۲',
			seo_llms_intro: 'سپهر آژانس دیجیتال توسعه‌ی وب، طراحی محصول و بازاریابی در تهران است.',
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 3, pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
