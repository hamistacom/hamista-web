/**
 * Demo: Arghavan — a marketing and design agency (Ember kit, light, purple),
 * after the third home page of the Noryx reference: a giant running line
 * over a large portrait, figure cards on a dark panel, the process in
 * stages, numbered services with pictures, a featured works gallery,
 * one client at a time picked from a row of faces, a strip of portraits
 * under a huge title, pricing, a project brief beside the FAQ and the journal.
 * Pages: about, services (+3 service pages), projects, team with online
 * consultation booking, pricing, shop of marketing packages, journal, FAQ and contact.
 */
'use strict';

const L = require('../lib');
const { img, gallery, link, px, gap, pad, w, con, bleed, section, cols, heading, button } = L;

const images = { logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp' };
[
	'hero', 'ball', 'about', 'about-2', 'stage-1', 'stage-2', 'stage-3', 'ser-1', 'ser-2', 'ser-3', 'ser-4',
	'pro-1', 'pro-2', 'pro-3', 'pro-4', 'pro-5', 'pro-6', 'tst-1', 'tst-2', 'tst-3', 'tst-4', 'tst-5', 'av-1', 'av-2', 'av-3', 'av-4',
	'tm-1', 'tm-2', 'tm-3', 'tm-4', 'tm-5', 'dark-bg', 'blog-1', 'blog-2', 'blog-3', 'blog-4', 'blog-5', 'blog-6', 'office-1', 'office-2',
].forEach((k) => { images[k] = 'images/' + k + '.webp'; });
for (let i = 1; i <= 7; i++) {
	if (i < 7) {
		images['logo-w-' + i] = 'images/logo-w-' + i + '.webp';
	}
	images['logo-k-' + i] = 'images/logo-k-' + i + '.webp';
}

const alts = {
	hero: 'مردی خندان با عینک و موهای بافته',
	about: 'دو همکار در حال بررسی طرح‌ها روی میز',
	'office-1': 'تیم ارغوان دور میز کار',
	'office-2': 'دو همکار در حال بررسی طرح روی لپ‌تاپ',
};

const contactUrl = '{{page:contact}}';
const bookUrl = '{{page:consult}}';
const avatars = gallery(['av-1', 'av-2', 'av-3']);
const logosWhite = gallery(['logo-w-1', 'logo-w-2', 'logo-w-3', 'logo-w-4', 'logo-w-5', 'logo-w-6']);
const logosInk = gallery(['logo-k-1', 'logo-k-2', 'logo-k-3', 'logo-k-4', 'logo-k-5', 'logo-k-6', 'logo-k-7']);

/* ---------------- Terms, posts, projects, team, products ---------------- */

const terms = [
	{ key: 'pf-seo', taxonomy: 'hm_portfolio_cat', name: 'سئو', slug: 'seo' },
	{ key: 'pf-web', taxonomy: 'hm_portfolio_cat', name: 'طراحی وب', slug: 'web-design' },
	{ key: 'pf-app', taxonomy: 'hm_portfolio_cat', name: 'اپلیکیشن', slug: 'app' },
	{ key: 'pf-brand', taxonomy: 'hm_portfolio_cat', name: 'برند', slug: 'brand' },
	{ key: 'cat-marketing', taxonomy: 'category', name: 'بازاریابی', slug: 'marketing' },
	{ key: 'cat-design', taxonomy: 'category', name: 'طراحی', slug: 'design' },
	{ key: 'cat-brand', taxonomy: 'category', name: 'برند', slug: 'brand' },
	{ key: 'sv-consult', taxonomy: 'hm_service', name: 'جلسه‌ی مشاوره', slug: 'consultation' },
	{ key: 'pc-marketing', taxonomy: 'product_cat', name: 'بسته‌های بازاریابی', slug: 'marketing-packs' },
	{ key: 'pc-brand', taxonomy: 'product_cat', name: 'برند و هویت', slug: 'brand-identity' },
	{ key: 'pc-content', taxonomy: 'product_cat', name: 'تولید محتوا', slug: 'content' },
];

const project = (key, title, slug, image, detail, cats, meta, excerpt, body) => ({
	key, title, slug, image, terms: cats, meta, excerpt,
	content: L.article(body.concat([['img', detail, '']])),
});

const projects = [
	project('p-nima', 'قالب فروشگاهی «نیما»', 'nima-store-theme', 'pro-1', 'pro-3', ['pf-web'],
		{ client: 'فروشگاه پوشاک نیما', year: '۱۴۰۴', services: 'طراحی تجربه، فروشگاه، سئو', url: '' },
		'فروشگاهی که خرید از موبایل را به سه لمس رسانده است.',
		[
			'نیما مشتری وفادار داشت و فروشگاهی که روی موبایل سخت باز می‌شد. فروشگاه را از صفر و با اولویت موبایل طراحی کردیم.',
			['h', 'سه لمس تا پرداخت'],
			'انتخاب سایز، افزودن به سبد و پرداخت؛ همه بی‌آنکه کاربر صفحه را عوض کند.',
			['ul', ['۶۲٪ رشد فروش موبایل', 'نرخ رها کردن سبد نصف شد', 'امتیاز ۹۸ در PageSpeed']],
		]),
	project('p-roya', 'نقشه‌ی رشد دیجیتال «رویا»', 'roya-growth-blueprint', 'pro-3', 'pro-4', ['pf-seo'],
		{ client: 'کلینیک زیبایی رویا', year: '۱۴۰۳', services: 'سئو، محتوا، تبلیغات محلی', url: '' },
		'از صفحه‌ی دوم گوگل تا رتبه‌ی اول جست‌وجوهای محلی، در شش ماه.',
		[
			'رویا در شهر خودش شناخته‌شده بود اما در گوگل دیده نمی‌شد. سئوی محلی، محتوای تخصصی و نقشه‌ی گوگل را با هم پیش بردیم.',
			['ul', ['رتبه‌ی اول در ۱۸ عبارت کلیدی', 'سه برابر شدن تماس از گوگل', 'گزارش ماهانه‌ی ساده']],
		]),
	project('p-saba', 'هویت بصری «صبا»', 'saba-company-logo', 'pro-5', 'pro-2', ['pf-brand'],
		{ client: 'استارتاپ سفر صبا', year: '۱۴۰۴', services: 'نام‌گذاری، لوگو، راهنمای برند', url: '' },
		'لوگویی سبک و ماندگار برای استارتاپی که سفر را ساده می‌کند.',
		[
			'صبا نام داشت اما چهره نداشت. از یک کارگاه نیم‌روزه با تیم شروع کردیم و به نشانه‌ای رسیدیم که هم روی اپ کوچک خوانا باشد و هم روی بیلبورد.',
			['q', 'حالا مسافرها ما را از روی لوگو می‌شناسند.', 'بنیان‌گذار صبا'],
		]),
	project('p-mehr', 'بازاریابی داده‌محور «مهر»', 'mehr-data-marketing', 'pro-6', 'pro-1', ['pf-seo', 'pf-app'],
		{ client: 'اپلیکیشن آموزشی مهر', year: '۱۴۰۳', services: 'تبلیغات اپ، تحلیل داده، ایمیل', url: '' },
		'کمپین نصب اپ که هزینه‌ی جذب هر کاربر را ۴۵٪ کمتر کرد.',
		[
			'مهر برای هر نصب هزینه‌ی زیادی می‌داد و بیشتر کاربران تازه در هفته‌ی اول اپ را حذف می‌کردند. پیام تبلیغ را با تجربه‌ی روز اول یکی کردیم.',
			['ul', ['۴۵٪ کاهش هزینه‌ی جذب', '۲ برابر ماندگاری هفته‌ی اول']],
		]),
	project('p-tara', 'گسترش دیجیتال «تارا»', 'tara-digital-expansion', 'pro-4', 'pro-6', ['pf-web', 'pf-brand'],
		{ client: 'گالری صنایع دستی تارا', year: '۱۴۰۴', services: 'وب‌سایت، عکاسی محصول، فروش بین‌المللی', url: '' },
		'گالری کوچکی که حالا به مشتری‌هایی در چهار کشور می‌فروشد.',
		[
			'تارا محصولات دست‌ساز زیبایی داشت و مشتری‌هایی که فقط حضوری می‌خریدند. فروشگاهی دوزبانه ساختیم و داستان هر هنرمند را کنار اثرش گذاشتیم.',
		]),
	project('p-arya', 'اپلیکیشن باشگاه «آریا»', 'arya-fitness-app', 'pro-2', 'pro-5', ['pf-app'],
		{ client: 'باشگاه ورزشی آریا', year: '۱۴۰۳', services: 'طراحی رابط، تحقیق کاربر', url: '' },
		'اپی که رزرو کلاس و پیگیری تمرین را در یک‌جا جمع کرده است.',
		[
			'اعضای آریا برای رزرو کلاس تلفن می‌زدند و برنامه‌ی تمرین را روی کاغذ داشتند. اپی طراحی کردیم که هر دو را ساده کرد.',
		]),
];

const twoShifts = { on: true, from: '09:30', to: '13:00', from2: '15:00', to2: '18:30' };
const morning = { on: true, from: '09:30', to: '13:00', from2: '', to2: '' };
const off = { on: false, from: '09:30', to: '13:00', from2: '', to2: '' };
const week = (pattern) => {
	const map = { t: twoShifts, m: morning, o: off };
	const days = [6, 0, 1, 2, 3, 4, 5];
	const out = {};
	days.forEach((d, i) => { out[d] = map[pattern[i]] || off; });
	return out;
};
const member = (key, title, slug, order, image, meta, pattern, excerpt, paragraphs) => ({
	key, title, slug, order, image, terms: ['sv-consult'], meta, excerpt, slot: 45, schedule: week(pattern),
	content: L.article(paragraphs),
});

const experts = [
	member('m-mahsa', 'مهسا توکلی', 'mahsa-tavakoli', 1, 'tm-1', { role: 'بنیان‌گذار و مدیر استراتژی', experience: '۱۳', fee: 'جلسه‌ی اول رایگان', location: 'حضوری یا آنلاین' }, 'ttmtmoo',
		'برندها را از جایگاه و پیام تا کمپین همراهی می‌کند.',
		['مهسا ارغوان را در ۱۳۹۶ راه انداخت. پیش از آن مدیر بازاریابی یک برند بزرگ پوشاک بود.', ['ul', ['استراتژی برند', 'برنامه‌ی بازاریابی', 'جایگاه‌یابی']]]),
	member('m-arash', 'آرش کیانی', 'arash-kiani', 2, 'tm-2', { role: 'مدیر تولید محتوا', experience: '۹', fee: 'جلسه‌ی اول رایگان', location: 'آنلاین' }, 'tmttmoo',
		'محتوایی می‌سازد که دیده، خوانده و به اشتراک گذاشته می‌شود.',
		['آرش ویدیو و محتوای شبکه‌های اجتماعی برندهای ارغوان را هدایت می‌کند.', ['ul', ['ویدیوی کوتاه', 'تقویم محتوا', 'نویسندگی خلاق']]]),
	member('m-sahar', 'سحر نادری', 'sahar-naderi', 3, 'tm-3', { role: 'مدیر طراحی', experience: '۱۱', fee: '۸۰۰ هزار تومان', location: 'حضوری' }, 'mtmtmoo',
		'هویت بصری و رابط کاربری را با دقت و ذوق طراحی می‌کند.',
		['سحر سرپرست تیم طراحی ارغوان است و بیش از شصت هویت بصری طراحی کرده است.']),
	member('m-kaveh', 'کاوه رستمی', 'kaveh-rostami', 4, 'tm-4', { role: 'سرپرست سئو', experience: '۸', fee: '۷۵۰ هزار تومان', location: 'آنلاین' }, 'ttmmtoo',
		'سایت‌ها را به صفحه‌ی اول گوگل می‌برد و همان‌جا نگه می‌دارد.',
		['کاوه هشت سال است سئوی فنی و محتوایی فروشگاه‌ها و کلینیک‌ها را انجام می‌دهد.']),
	member('m-ladan', 'لادن شریفی', 'ladan-sharifi', 5, 'tm-5', { role: 'مدیر ارتباط با مشتری', experience: '۷', fee: 'جلسه‌ی اول رایگان', location: 'حضوری یا آنلاین' }, 'momomoo',
		'از اولین تماس تا تحویل، کنار مشتری است.',
		['لادن مطمئن می‌شود هر پروژه به‌موقع، با کیفیت و بی‌غافلگیری تحویل شود.']),
];

const product = (key, title, slug, price, sku, image, cats, excerpt, paragraphs, specs, extra = {}) => Object.assign({
	key, title, slug, price, sku, image, gallery: [], terms: cats, excerpt, stock: 999, virtual: true,
	content: L.productBody(paragraphs, specs),
}, extra);

const products = [
	product('social-month', 'مدیریت ماهانه‌ی شبکه‌های اجتماعی', 'monthly-social-management', 12000000, 'AR-SOC-1', 'pro-1', ['pc-marketing'],
		'دوازده پست، هشت استوری و گزارش ماهانه؛ با طراحی و متن.',
		['تقویم محتوا را با هم می‌نویسیم، طراحی و متن را ما آماده می‌کنیم و هر ماه گزارش رشد صفحه را می‌فرستیم.'],
		[['پست', '۱۲ در ماه'], ['استوری', '۸ در ماه'], ['گزارش', 'ماهانه']], { featured: true }),
	product('local-seo', 'بسته‌ی سئوی محلی', 'local-seo-pack', 8500000, 'AR-SEO-1', 'pro-3', ['pc-marketing'],
		'دیده شدن در نقشه و جست‌وجوهای محلی گوگل.',
		['پروفایل کسب‌وکار در نقشه‌ی گوگل، صفحه‌های محلی سایت و نظرهای مشتری را سامان می‌دهیم.'],
		[['زمان اجرا', 'یک ماه'], ['شامل', 'پروفایل نقشه، ۴ صفحه‌ی محلی']]),
	product('logo', 'طراحی لوگو و هویت پایه', 'logo-and-core-identity', 22000000, 'AR-BRD-1', 'pro-5', ['pc-brand'],
		'لوگو، رنگ، فونت و راهنمای کوتاه برند.',
		['سه ایده‌ی اولیه، دو دور بازبینی و فایل نهایی در همه‌ی قالب‌ها؛ همراه با راهنمای ده‌صفحه‌ای برند.'],
		[['ایده‌ی اولیه', '۳'], ['بازبینی', '۲ دور'], ['خروجی', 'AI، SVG، PNG، PDF']], { featured: true }),
	product('brand-guide', 'راهنمای کامل برند', 'complete-brand-guideline', 35000000, 'AR-BRD-2', 'pro-4', ['pc-brand'],
		'سندی که تیم شما هر روز برای ظاهر و لحن برند به آن تکیه می‌کند.',
		['از لوگو و رنگ تا لحن نوشتن و قالب پست‌ها؛ همه در یک راهنمای کاربردی.'],
		[['صفحه', '۴۰'], ['قالب', 'PDF و فیگما']]),
	product('video-pack', 'بسته‌ی تولید ویدیوی کوتاه', 'short-video-pack', 15000000, 'AR-VID-1', 'pro-6', ['pc-content'],
		'هشت ویدیوی زیر یک دقیقه برای اینستاگرام و آپارات.',
		['ایده، فیلم‌نامه، فیلم‌برداری و تدوین؛ آماده‌ی انتشار با زیرنویس.'],
		[['تعداد', '۸ ویدیو'], ['مدت', 'زیر یک دقیقه'], ['زمان تحویل', 'سه هفته']]),
	product('copywriting', 'نوشتن متن سایت', 'website-copywriting', 9000000, 'AR-TXT-1', 'pro-2', ['pc-content'],
		'متن صفحه‌های اصلی سایت، با لحن برند و سئوی درست.',
		['متن صفحه‌ی اصلی، درباره‌ی ما، خدمات و تماس را می‌نویسیم؛ کوتاه، روشن و فروشنده.'],
		[['صفحه', 'تا ۶ صفحه'], ['بازبینی', '۲ دور']]),
];

const posts = [
	{
		key: 'power-data', title: 'قدرت بازاریابی داده‌محور', slug: 'power-of-data-driven-marketing', image: 'blog-1', terms: ['cat-marketing'], days_ago: 2,
		excerpt: 'داده کمک می‌کند تصمیم‌های هوشمندتر بگیرید، مخاطب را دقیق‌تر هدف بگیرید و نتیجه‌ی قابل اندازه‌گیری داشته باشید.',
		content: L.article([
			'بازاریابی بدون داده، مثل رانندگی در شب بی‌چراغ است. لازم نیست ابزار گران بخرید؛ با چند گزارش ساده می‌شود دید کجا پول هدر می‌رود.',
			['ol', ['هر فروش از کدام کانال آمده؟', 'هزینه‌ی جذب هر مشتری چقدر است؟', 'چند درصد مشتری‌ها دوباره می‌خرند؟']],
		]),
	},
	{
		key: 'future', title: 'آینده‌ی بازاریابی دیجیتال', slug: 'future-of-digital-marketing', image: 'blog-2', terms: ['cat-marketing'], days_ago: 6,
		excerpt: 'هوش مصنوعی، جست‌وجوی گفتاری و ویدیوی کوتاه؛ برای سال آینده چه آماده کنیم؟',
		content: L.article([
			'ابزارها هر سال عوض می‌شوند، اما اصل ثابت است: پیام روشن به مخاطب درست، در زمان درست.',
			['ul', ['محتوای کوتاه و صادق', 'جست‌وجوی گفتاری و پرسش‌محور', 'احترام به حریم خصوصی مخاطب']],
		]),
	},
	{
		key: 'brand-stage', title: 'مرحله‌های ساختن یک برند ماندگار', slug: 'stages-of-a-lasting-brand', image: 'blog-3', terms: ['cat-brand'], days_ago: 11,
		excerpt: 'از کشف و جایگاه تا هویت و راهنمای برند؛ چهار مرحله‌ای که هر برند از آن می‌گذرد.',
		content: L.article([
			'برند ماندگار یک‌شبه ساخته نمی‌شود. این چهار مرحله را به ترتیب پیش ببرید.',
			['ol', ['کشف: مخاطب و رقبا', 'جایگاه: چرا شما؟', 'هویت: نام، لوگو، رنگ', 'راهنما: برای تیم']],
		]),
	},
	{
		key: 'color', title: 'رنگ در هویت بصری چه می‌گوید', slug: 'what-colour-says-in-identity', image: 'blog-4', terms: ['cat-design'], days_ago: 18,
		excerpt: 'رنگ پیش از هر کلمه‌ای با مخاطب حرف می‌زند؛ چطور درست انتخابش کنیم؟',
		content: L.article([
			'مشتری در چند ثانیه‌ی اول، پیش از خواندن هر کلمه، از رنگ برداشت می‌کند. رنگ برند باید با پیام آن هم‌صدا باشد.',
		]),
	},
	{
		key: 'video', title: 'ویدیوی کوتاه برای برندهای کوچک', slug: 'short-video-for-small-brands', image: 'blog-5', terms: ['cat-marketing'], days_ago: 25,
		excerpt: 'با یک گوشی و یک ایده‌ی خوب هم می‌شود ویدیویی ساخت که دیده شود.',
		content: L.article([
			'لازم نیست استودیو داشته باشید. نور پنجره، صدای تمیز و یک ایده‌ی روشن، نیمی از کار است.',
		]),
	},
	{
		key: 'landing', title: 'صفحه‌ی فرودی که می‌فروشد', slug: 'landing-pages-that-sell', image: 'blog-6', terms: ['cat-design'], days_ago: 33,
		excerpt: 'یک پیام، یک پیشنهاد، یک دکمه؛ ساختار ساده‌ی صفحه‌های فرود موفق.',
		content: L.article([
			'صفحه‌ی فرود جای معرفی همه‌ی خدمات نیست. یک پیام روشن، نشانه‌های اعتماد و یک دکمه کافی است.',
		]),
	},
];

/* ---------------- Shared blocks ---------------- */

const eyebrow = (n, label) => '*{ ' + n + ' }* # ' + label;

/** A dark rounded band. */
const band = (opts, elements) => con(Object.assign({
	content_width: 'boxed',
	css_classes: ['hm-gutter', 'hm-space-' + (opts.space || 'lg'), 'hm-scheme-inverse', opts.cls || ''].join(' ').trim(),
	flex_gap: gap(opts.gap ?? 48),
}, opts.extra || {}), elements);

const services = [
	{ title: 'هویت برند و گرافیک', text: 'از نام و لوگو تا رنگ و تصویر؛ زبانی بصری که برند شما را در یک نگاه معرفی کند.', tags: 'طراحی تعاملی، لوگو، راهنمای برند', image: img('ser-1'), icon: 'palette', link: link('{{page:branding}}') },
	{ title: 'طراحی و توسعه‌ی وب', text: 'سایت و فروشگاهی سریع، راست‌چین و فروشنده که روی هر گوشی درست کار می‌کند.', tags: 'طراحی تجربه، وردپرس، فروشگاه', image: img('ser-2'), icon: 'code', link: link('{{page:web}}') },
	{ title: 'بازاریابی دیجیتال', text: 'سئو، شبکه‌های اجتماعی و تبلیغات؛ با برنامه‌ای روشن و گزارشی دقیق.', tags: 'سئو، تبلیغات، شبکه‌های اجتماعی', image: img('ser-3'), icon: 'megaphone', link: link('{{page:marketing}}') },
	{ title: 'تولید محتوا و ویدیو', text: 'متن، عکس و ویدیوی کوتاهی که دیده می‌شود و به اشتراک گذاشته می‌شود.', tags: 'ویدیوی کوتاه، عکاسی، نویسندگی', image: img('ser-4'), icon: 'camera', link: link('{{shop}}') },
];

const faqItems = [
	['آژانس شما چه خدماتی ارائه می‌دهد؟', 'هویت برند، طراحی و توسعه‌ی وب، بازاریابی دیجیتال و تولید محتوا. موفقیت هر کار را با داده‌ی تحلیلی، تعامل کاربر، نرخ تبدیل و بازگشت سرمایه می‌سنجیم.'],
	['برای هر مشتری راهبرد جداگانه دارید؟', 'بله؛ هر پروژه با جلسه‌ی کشف شروع می‌شود و برنامه‌اش مخصوص همان کسب‌وکار نوشته می‌شود.'],
	['موفقیت کمپین را چطور می‌سنجید؟', 'با شاخص‌هایی که پیش از شروع با هم تعیین می‌کنیم: بازدید، تبدیل، هزینه‌ی جذب و فروش.'],
	['با کسب‌وکارهای کوچک هم کار می‌کنید؟', 'بله؛ بسته‌ی شروع دقیقاً برای کسب‌وکارهای کوچک و تازه‌کار ساخته شده است.'],
	['گزارش منظم پیشرفت کار را دریافت می‌کنم؟', 'هر هفته گزارش کوتاه و هر ماه گزارش کامل با عدد و پیشنهاد قدم بعد.'],
	['خدمات سئو و بازاریابی دیجیتال هم دارید؟', 'بله؛ از سئوی فنی و محلی تا تبلیغات کلیکی و مدیریت شبکه‌های اجتماعی.'],
	['می‌توانید سایت فعلی ما را بهتر کنید؟', 'حتماً. اول یک ممیزی کوتاه انجام می‌دهیم و فهرست کارها را به ترتیب اثر پیشنهاد می‌کنیم.'],
];

const briefBlock = (n) => section({ space: 'lg', gap: 0 }, [
	cols({ widths: [44, 56], gap: 40, align: 'start' }, [
		[con({ content_width: 'full', css_classes: 'hm-scheme-inverse hm-panel', padding: pad(40, 40), flex_gap: gap(24) }, [
			heading({ eyebrow: eyebrow(n, 'زمان پاسخ: کمتر از یک ساعت'), title: 'جزئیات پروژه‌تان را\nبرایمان بنویسید', title_size: 'sm' }),
			L.contactForm({ show_phone: 'yes', show_company: '', show_subject: '', button: 'ارسال', success: 'پیامتان رسید؛ کمتر از یک ساعت دیگر تماس می‌گیریم.' }),
			w('hm-proof', { avatars: gallery(['av-4', 'av-2']), name: 'لادن شریفی', role: 'مدیر ارتباط با مشتری', score: '', stars: 5, note: 'بر پایه‌ی ۲۰۴ نظر', layout: 'card', align: 'start', plus: '' }),
		], true)],
		[heading({ eyebrow: eyebrow('سؤال‌ها', 'پرسش‌های متداول'), title: 'هر آنچه\nباید بدانید', desc: 'با ترکیب نوآوری و هدف، طرح‌هایی می‌سازیم که برندها را در بازار رقابتی جلو می‌برند.', title_size: 'lg' }), L.faq(faqItems, { style: 'cards' })],
	]),
]);

const pricingBlock = (n) => section({ space: 'lg', gap: 40 }, [
	heading({ eyebrow: eyebrow(n, 'تعرفه‌ها'), title: 'تعرفه‌های منعطف', desc: 'اشتراک ماهانه‌ی طراحی و بازاریابی؛ هر وقت خواستید متوقف یا ارتقا دهید.', header_align: 'center', title_size: 'lg' }),
	w('hm-pricing', {
		plans: [
			{ name: 'بسته‌ی پایه', desc: 'انتخابی هوشمند برای کسب‌وکارهایی که سرعت، شفافیت و خلاقیت می‌خواهند.', price: '۱۹', price_alt: '۱۴', unit: 'میلیون تومان', period: '/ ماهانه', features: 'موشن گرافیک و انیمیشن\nهشت تا ده پست در ماه\nکپشن و هشتگ\nتوقف یا ارتقا در هر زمان', btn_text: 'همین حالا شروع کنید', btn_link: link(contactUrl), featured: '', badge: 'شروع ساده' },
			{ name: 'بسته‌ی رشد', desc: 'پرطرفدارترین بسته برای برندهایی که می‌خواهند منظم و پیوسته دیده شوند.', price: '۳۹', price_alt: '۲۹', unit: 'میلیون تومان', period: '/ ماهانه', features: 'تصویرسازی و گرافیک سه‌بعدی\nطراحی وب و رابط کاربری\nموشن و انیمیشن\nوب، برند و موشن\nتوقف یا لغو در هر زمان', btn_text: 'همین حالا شروع کنید', btn_link: link(contactUrl), featured: 'yes', badge: 'پرطرفدار' },
			{ name: 'بسته‌ی ویژه', desc: 'تیم کامل ارغوان کنار شما؛ برای چند برند و کانال هم‌زمان.', price: '۶۵', price_alt: '۴۹', unit: 'میلیون تومان', period: '/ ماهانه', features: 'همه‌ی امکانات بسته‌ی رشد\nمدیر حساب اختصاصی\nجلسه‌ی هفتگی\nگزارش کامل ماهانه', btn_text: 'همین حالا شروع کنید', btn_link: link(contactUrl), featured: '', badge: 'دسترسی کامل' },
		],
		switch_off: 'ماهانه', switch_on: 'سالانه', switch_note: '۲۵٪ تخفیف',
	}),
]);

/* ---------------- Home ---------------- */

const home = [
	bleed(w('hm-agency-hero', {
		style: 'marquee', status: 'پذیرش پروژه‌ی تازه',
		title: 'بازاریابی که\n*دیده می‌شود*',
		desc: 'ابزارهای هوشمند بازاریابی برای عملکرد بهتر در همه‌ی شبکه‌های اجتماعی.',
		btn_text: 'درباره‌ی ما', btn_link: link('{{page:about}}'), btn_style: 'primary',
		image: img('hero'), image2: img('ball'), poster: img('pro-5'), film: 'https://www.aparat.com/v/hamista',
		big: 'آژانس *بازاریابی دیجیتال* ارغوان', height: 'screen',
	})),

	section({ space: 'lg', gap: 0 }, [
		con({ content_width: 'full', css_classes: 'hm-scheme-inverse hm-panel', padding: pad(48, 48), flex_gap: gap(0) }, [
			w('hm-about-intro', {
				style: 'stats', eyebrow: eyebrow('۰۱', 'درباره‌ی ما'),
				statement: 'برندها را با *طراحی معنادار* دیجیتال متحول می‌کنیم',
				text: 'با ترکیب نوآوری و هدف، طرح‌هایی دیجیتال می‌سازیم که برندها را در بازار رقابتی جلو می‌برند.',
				image: img('about'), btn_text: 'بیشتر درباره‌ی ما', btn_link: link('{{page:about}}'), btn_style: 'primary',
				figures: [
					{ label: 'مشتری راضی و بازگشتی', value: '۹۵٪', text: 'تعهد ما به خدماتی که فراتر از انتظار است.' },
					{ label: 'پروژه در ۲۴ شهر', value: '۷۵۰', text: 'مشتری‌هایی که با طراحی درست، دوباره به ما برگشتند.' },
					{ label: 'عضو تیم و همکار', value: '+۸۰', text: 'تیمی که هر سال بزرگ‌تر و باتجربه‌تر می‌شود.' },
				],
				score: '4.9/5', score_text: 'امتیاز رضایت مشتری‌ها را ببینید.', score_avatars: avatars,
			}),
		], true),
	]),

	section({ space: 'lg', gap: 40 }, [
		w('hm-process', {
			eyebrow: eyebrow('۰۲', 'روند کار'), title: 'ایده‌ها چطور به\n*طرح‌های برنده* تبدیل می‌شوند', desc: 'ایده‌های خلاق را به طرح‌هایی اثرگذار تبدیل می‌کنیم که مخاطب را جذب می‌کنند.',
			title_tag: 'h2', title_size: 'md', header_align: 'center', title_reveal: 'words', look: 'stages', stage: 'مرحله',
			steps: [
				{ icon: 'rocket', title: 'کشف و برنامه', text: 'هدف‌ها را بررسی می‌کنیم، بازار را می‌شناسیم و نقشه‌ی راه روشنی می‌کشیم.', image: img('stage-1') },
				{ icon: 'palette', title: 'طراحی و ساخت', text: 'ایده‌ها را به طرح‌های دقیق و بعد به صفحه‌ها و کمپین‌های واقعی تبدیل می‌کنیم.', image: img('stage-2') },
				{ icon: 'trend', title: 'بهینه‌سازی و رشد', text: 'عملکرد را دنبال می‌کنیم، راهبرد را اصلاح می‌کنیم و نتیجه را بزرگ‌تر می‌کنیم.', image: img('stage-3') },
			],
		}),
	]),

	band({ space: 'lg', gap: 48 }, [
		cols({ widths: [58, 42], gap: 48, align: 'end' }, [
			[heading({ eyebrow: eyebrow('۰۳', 'خدمات ما'), title: 'راه‌حل‌های راهبردی\nبرای *رشد دیجیتال*', title_size: 'lg' })],
			[L.textEditor('<p>همه‌ی خدمات دیجیتالی که کسب‌وکار شما برای رشد، ارتباط و موفقیت لازم دارد.</p>'), button('همه‌ی خدمات', '{{page:services}}')],
		]),
		w('hm-service-list', { look: 'numbered', items: services.map((s, i) => Object.assign({}, s, { meta_label: 'زمان‌بندی', meta_value: ['۲ تا ۴ هفته', '۴ تا ۸ هفته', 'ماهانه', '۲ تا ۳ هفته'][i] })), btn_text: 'جزئیات خدمت' }),
	]),

	section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: eyebrow('۰۴', 'نمونه‌کارها'), title: 'نمونه‌کارهای *برگزیده*', desc: 'مجموعه‌ای از پروژه‌هایی که تعهد ما به طراحی تمیز و تجربه‌های دیجیتال معنادار را نشان می‌دهند.', header_align: 'center', title_size: 'xl' }),
		w('hm-project-show', { source: 'portfolio', count: 6, look: 'gallery', btn_text: 'دیدن پروژه' }),
	]),

	band({ space: 'lg', gap: 40, extra: { background_background: 'classic', background_image: img('dark-bg'), background_position: 'center center', background_size: 'cover' } }, [
		cols({ widths: [58, 42], gap: 48, align: 'end' }, [
			[heading({ eyebrow: eyebrow('۰۵', 'نظر مشتری‌ها'), title: 'برندهایی که\n*به ما اعتماد کردند*', title_size: 'lg' })],
			[button('همه‌ی نظرها', '{{page:about}}')],
		]),
		w('hm-testimonial-wall', {
			look: 'spotlight', rating_label: 'امتیاز', summary: 'امتیاز ۴٫۹ از ۵ از سوی +۱۲۰۰ مشتری خوشحال', logos: logosWhite, logos_label: 'برندهایی که به ما اعتماد کرده‌اند:',
			items: [
				{ quote: 'کار با این تیم تجربه‌ای فوق‌العاده بود. خلاقیت و نگاه راهبردی‌شان باعث شد برند ما سریع‌تر از انتظار رشد کند.', name: 'رضا کرمانی', role: 'مدیرعامل فروشگاه نیما', avatar: img('tst-1'), rating: '4.9' },
				{ quote: 'تیمی بسیار حرفه‌ای که راه‌حل‌های دیجیتال اثرگذار تحویل داد. گزارش‌هایشان همیشه روشن و به‌موقع بود.', name: 'فرهاد مقدم', role: 'مدیر بازاریابی کلینیک رویا', avatar: img('tst-2'), rating: '4.9' },
				{ quote: 'راهبرد آن‌ها حضور آنلاین ما را به‌طور چشمگیری بهتر کرد و فروش اینترنتی‌مان دو برابر شد.', name: 'پویا شاکری', role: 'بنیان‌گذار صبا', avatar: img('tst-3'), rating: '5' },
				{ quote: 'خدمات حرفه‌ای که برند و حضور آنلاین ما را یک پله بالاتر برد.', name: 'یاسمن قربانی', role: 'مدیر محصول اپ مهر', avatar: img('tst-5'), rating: '4.8' },
				{ quote: 'دید ما را به یک برند قدرتمند و امروزی تبدیل کردند؛ دقیق، صبور و خلاق.', name: 'بهمن ستوده', role: 'مدیر گالری تارا', avatar: img('tst-4'), rating: '4.9' },
			],
		}),
	]),

	section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: eyebrow('۰۶', 'تیم ما'), title: '', header_align: 'center', title_size: 'sm' }),
		w('hm-giant-text', { text: 'شریک رشد', second: 'شما', motion: 'part', look: 'solid', size: { unit: 'vw', size: 9, sizes: [] }, align: 'center', tag: 'h2' }),
		L.team([
			{ photo: img('tm-1'), name: 'مهسا توکلی', role: 'بنیان‌گذار و مدیر استراتژی', linkedin: link('https://linkedin.com/'), instagram: link('https://instagram.com/') },
			{ photo: img('tm-2'), name: 'آرش کیانی', role: 'مدیر تولید محتوا', linkedin: link('https://linkedin.com/'), instagram: link('https://instagram.com/') },
			{ photo: img('tm-3'), name: 'سحر نادری', role: 'مدیر طراحی', linkedin: link('https://linkedin.com/'), instagram: link('https://instagram.com/') },
			{ photo: img('tm-4'), name: 'کاوه رستمی', role: 'سرپرست سئو', linkedin: link('https://linkedin.com/'), instagram: link('https://instagram.com/') },
			{ photo: img('tm-5'), name: 'لادن شریفی', role: 'مدیر ارتباط با مشتری', linkedin: link('https://linkedin.com/'), instagram: link('https://instagram.com/') },
		], { layout: 'strip', mono: '' }),
	]),

	pricingBlock('۰۷'),
	briefBlock('۰۸'),

	section({ space: 'lg', gap: 40 }, [
		cols({ widths: [58, 42], gap: 48, align: 'end' }, [
			[heading({ eyebrow: eyebrow('۰۹', 'تازه‌ترین نوشته‌ها'), title: 'نگاه کارشناسان به بازاریابی،\nطراحی و نوآوری دیجیتال', title_size: 'lg' })],
			[L.textEditor('<p>برنامه‌ریزی هوشمند و نوآوری خلاق، کنار هم برای بهتر شدن عملکرد برند شما.</p>'), button('همه‌ی نوشته‌ها', '{{page:blog}}')],
		]),
		L.posts({ count: 3, layout: 'grid', columns: '3', excerpt: 'yes' }),
	]),
];

/* ---------------- About ---------------- */

const about = [
	L.pageHead(eyebrow('۰۱', 'درباره‌ی ما'), 'برندها را\n*دیده‌شدنی* می‌کنیم', 'از ۱۳۹۶ کنار کسب‌وکارهای ایرانی هستیم؛ از کارگاه‌های کوچک تا برندهای ملی.'),
	section({ space: 'md', gap: 24 }, [
		cols({ widths: [60, 40], gap: 24 }, [[L.imageReveal('office-1', { ratio: '16-9' })], [L.imageReveal('office-2', { ratio: '4-5' })]]),
	]),
	section({ space: 'md', gap: 0 }, [
		con({ content_width: 'full', css_classes: 'hm-scheme-inverse hm-panel', padding: pad(48, 48), flex_gap: gap(0) }, [
			w('hm-about-intro', {
				style: 'stats', eyebrow: eyebrow('۰۲', 'داستان ما'),
				statement: 'هر برند *داستانی* دارد؛ ما کمکش می‌کنیم شنیده شود.',
				text: 'ارغوان با سه نفر در یک اتاق کوچک شروع شد و حالا تیمی هشتادنفره است. روش کار عوض نشده: گوش دادن، طراحی، اندازه گرفتن.',
				image: img('about-2'), btn_text: 'گفت‌وگو کنیم', btn_link: link(contactUrl), btn_style: 'primary',
				figures: [
					{ label: 'مشتری راضی و بازگشتی', value: '۹۵٪', text: 'بیشتر کار ما از مشتری‌های قبلی می‌آید.' },
					{ label: 'پروژه در ۲۴ شهر', value: '۷۵۰', text: 'برند، سایت و کمپین در صنایع مختلف.' },
					{ label: 'عضو تیم', value: '+۸۰', text: 'طراح، نویسنده، فیلم‌ساز و بازاریاب.' },
				],
				score: '4.9/5', score_text: 'میانگین امتیاز مشتری‌ها به خدمات ما.', score_avatars: avatars,
			}),
		], true),
	]),
	section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: eyebrow('۰۳', 'تیم'), title: 'آدم‌های ارغوان', header_align: 'center', title_size: 'lg' }),
		w('hm-experts', { eyebrow: '', title: '', desc: '', header_align: 'start', title_tag: 'h2', title_size: 'lg', title_reveal: 'words', count: 5, groups: [], filters: '', card_style: 'card', ratio: '3/4', button: 'yes', layout: 'carousel', columns: '4' }),
	]),
	section({ space: 'md', gap: 30 }, [w('hm-logo-grid', { logos: logosInk, columns: '7', columns_tablet: '4', columns_mobile: '2', look: 'soft', btn_text: '' })]),
	briefBlock('۰۴'),
];

/* ---------------- Services and service pages ---------------- */

const servicesPage = [
	L.pageHead(eyebrow('۰۱', 'خدمات'), 'از برند تا فروش،\n*در یک تیم*', 'هویت، وب، بازاریابی و محتوا؛ هر کدام را جدا یا همه را با هم بگیرید.'),
	section({ space: 'md', gap: 0 }, [w('hm-service-list', { look: 'numbered', items: services.map((s, i) => Object.assign({}, s, { meta_label: 'زمان‌بندی', meta_value: ['۲ تا ۴ هفته', '۴ تا ۸ هفته', 'ماهانه', '۲ تا ۳ هفته'][i] })), btn_text: 'جزئیات خدمت' })]),
	section({ space: 'lg', gap: 40 }, [
		w('hm-process', {
			eyebrow: eyebrow('۰۲', 'روند کار'), title: 'از اولین جلسه تا نتیجه', desc: 'سه مرحله‌ی روشن؛ در هر مرحله می‌دانید کجای کار هستیم.',
			title_tag: 'h2', title_size: 'md', header_align: 'center', title_reveal: 'words', look: 'tabs', more: 'بیشتر',
			steps: [
				{ icon: 'compass', title: 'کشف', text: 'کسب‌وکار، مخاطب و رقبا را می‌شناسیم.', link: link('{{page:about}}') },
				{ icon: 'pen', title: 'طراحی', text: 'هویت، صفحه‌ها و محتوا را طراحی می‌کنیم.', link: link('{{page:branding}}') },
				{ icon: 'megaphone', title: 'انتشار', text: 'کمپین را منتشر و نتیجه را اندازه می‌گیریم.', link: link('{{page:marketing}}') },
				{ icon: 'trend', title: 'رشد', text: 'هر ماه نتیجه را بهتر می‌کنیم.', link: link('{{page:pricing}}') },
			],
		}),
	]),
	pricingBlock('۰۳'),
];

const servicePage = (title, lead, image, bullets, body) => [
	L.pageHead(eyebrow('خدمت', title), title, lead),
	section({ space: 'md', gap: 40 }, [
		L.imageReveal(image, { ratio: '21-9', reveal: 'clip-up' }),
		cols({ widths: [62, 38], gap: 56, align: 'start' }, [
			[L.textEditor(body), heading({ title: 'آنچه دریافت می‌کنید', title_size: 'sm', title_tag: 'h2' }), L.features(bullets.map(([t, x, i]) => ({ icon: i, title: t, text: x })), { columns: '2', style: 'cards', layout: 'grid' })],
			[w('hm-cta', { eyebrow: '', title: 'برای پروژه‌تان\nبرنامه بگیرید', desc: 'جلسه‌ی اول رایگان است؛ درباره‌ی هدف و بودجه حرف می‌زنیم.', title_tag: 'h3', title_size: 'md', header_align: 'start', title_reveal: 'words', action: 'buttons', btn1_text: 'رزرو مشاوره', btn1_link: link(bookUrl), btn1_style: 'primary', btn2_text: '', look: 'inverse', decor: '', rounded: 'yes' })],
		]),
	]),
	section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: eyebrow('نمونه‌ها', 'پروژه‌های مرتبط'), title: 'کارهایی در همین زمینه', title_size: 'lg' }),
		w('hm-project-show', { source: 'portfolio', count: 2, look: 'grid', btn_text: 'دیدن پروژه' }),
	]),
];

const branding = servicePage('هویت برند و گرافیک', 'زبانی بصری که برند شما را در یک نگاه معرفی کند.', 'ser-1',
	[['جایگاه و پیام', 'برند شما در ذهن مخاطب کجا می‌نشیند.', 'target'], ['نام و لوگو', 'نشانه‌ای ساده و ماندگار.', 'pen'], ['رنگ و تایپوگرافی', 'زبان بصری یکدست.', 'palette'], ['راهنمای برند', 'سندی برای همه‌ی تیم.', 'book']],
	'<p>برند فقط لوگو نیست؛ قولی است که هر بار به مشتری می‌دهید. کار را با کارگاهی کوتاه با تیم شما شروع می‌کنیم تا جایگاه و پیام اصلی روشن شود.</p><p>بعد زبان بصری را می‌سازیم و همه را در راهنمایی کاربردی تحویل می‌دهیم.</p>');
const web = servicePage('طراحی و توسعه‌ی وب', 'سایتی سریع، راست‌چین و فروشنده.', 'ser-2',
	[['طراحی تجربه', 'مسیر روشن از بازدید تا خرید.', 'grid'], ['وردپرس و فروشگاه', 'ابزاری که تیم شما هم بلد است.', 'code'], ['سرعت', 'زیر یک ثانیه روی موبایل.', 'bolt'], ['سئوی فنی', 'ساختار درست برای گوگل.', 'search']],
	'<p>سایت شما اولین فروشنده‌ی شماست. آن را از نگاه مشتری می‌سازیم: چه می‌خواهد، کجا مردد می‌شود و چه چیزی او را به خرید می‌رساند.</p>');
const marketing = servicePage('بازاریابی دیجیتال', 'سئو، شبکه‌های اجتماعی و تبلیغات؛ با گزارشی دقیق.', 'ser-3',
	[['سئو', 'رتبه‌ی پایدار در گوگل.', 'search'], ['شبکه‌های اجتماعی', 'تقویم محتوا و ویدیوی کوتاه.', 'megaphone'], ['تبلیغات کلیکی', 'هر تومان قابل ردیابی.', 'target'], ['گزارش', 'عددهای روشن هر ماه.', 'chart']],
	'<p>بازاریابی خوب از عدد شروع می‌شود، نه از حدس. ردیابی را راه می‌اندازیم، پیام را روشن می‌کنیم و بودجه را به سمت کانال‌هایی می‌بریم که می‌فروشند.</p>');

/* ---------------- Projects, team, booking, pricing, contact ---------------- */

const projectsPage = [
	L.pageHead(eyebrow('۰۱', 'نمونه‌کارها'), 'نمونه‌کارهای\n*برگزیده*', 'برند، سایت و کمپین؛ هر پروژه با یک مسئله‌ی واقعی شروع شده است.'),
	section({ space: 'md', gap: 40 }, [w('hm-project-show', { source: 'portfolio', count: 8, look: 'gallery', btn_text: 'دیدن پروژه' })]),
	section({ space: 'md', gap: 30 }, [w('hm-logo-grid', { logos: logosInk, columns: '7', columns_tablet: '4', columns_mobile: '2', look: 'outline', btn_text: '' })]),
];

const teamPage = [
	L.pageHead(eyebrow('۰۱', 'تیم'), 'شریک\n*رشد شما*', 'برای مشاوره با هر کدام از اعضای تیم می‌توانید آنلاین وقت بگیرید.'),
	section({ space: 'md', gap: 40 }, [
		L.team([
			{ photo: img('tm-1'), name: 'مهسا توکلی', role: 'بنیان‌گذار و مدیر استراتژی', linkedin: link('https://linkedin.com/'), instagram: link('') },
			{ photo: img('tm-2'), name: 'آرش کیانی', role: 'مدیر تولید محتوا', linkedin: link('https://linkedin.com/'), instagram: link('') },
			{ photo: img('tm-3'), name: 'سحر نادری', role: 'مدیر طراحی', linkedin: link('https://linkedin.com/'), instagram: link('') },
			{ photo: img('tm-4'), name: 'کاوه رستمی', role: 'سرپرست سئو', linkedin: link('https://linkedin.com/'), instagram: link('') },
			{ photo: img('tm-5'), name: 'لادن شریفی', role: 'مدیر ارتباط با مشتری', linkedin: link('https://linkedin.com/'), instagram: link('') },
		], { layout: 'strip', mono: '' }),
	]),
	section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: eyebrow('۰۲', 'رزرو مشاوره'), title: 'با یکی از ما حرف بزنید', title_size: 'lg' }),
		w('hm-experts', { eyebrow: '', title: '', desc: '', header_align: 'start', title_tag: 'h2', title_size: 'lg', title_reveal: 'words', count: 5, groups: [], filters: '', card_style: 'card', ratio: '3/4', button: 'yes', layout: 'grid', columns: '3' }),
	]),
];

const consult = [
	L.pageHead(eyebrow('۰۱', 'مشاوره'), 'یک جلسه‌ی\n*مشاوره* رزرو کنید', 'مشاور، روز و ساعت را انتخاب کنید؛ پیامک تأیید برایتان فرستاده می‌شود.'),
	section({ space: 'md', gap: 40 }, [
		w('hm-booking', { title: 'رزرو جلسه‌ی مشاوره', intro: 'جلسه‌ها چهل‌وپنج دقیقه‌اند؛ حضوری در دفتر یا آنلاین.', expert: '0', groups: [], note: 'yes', box: 'card' }),
	]),
	briefBlock('۰۲'),
];

const pricingPage = [
	L.pageHead(eyebrow('۰۱', 'تعرفه‌ها'), 'قیمت روشن،\n*بی‌غافلگیری*', 'اشتراک ماهانه یا سالانه؛ هر وقت خواستید متوقف یا ارتقا دهید.'),
	pricingBlock('۰۲'),
	briefBlock('۰۳'),
];

const contact = [
	L.pageHead(eyebrow('۰۱', 'تماس'), 'بیایید درباره‌ی\n*برندتان* حرف بزنیم', 'در ساعات کاری کمتر از یک ساعت پاسخ می‌دهیم.'),
	section({ space: 'md', gap: 0 }, [
		L.contactInfo([
			{ icon: 'phone', label: 'تلفن', value: '۰۳۱ ۳۶۶۰ ۲۲۱۱', link: link('tel:03136602211') },
			{ icon: 'mail', label: 'ایمیل', value: 'hello@arghavan.agency', link: link('mailto:hello@arghavan.agency') },
			{ icon: 'pin', label: 'دفتر', value: 'اصفهان، خیابان چهارباغ بالا، کوچه‌ی ارغوان، پلاک ۷', link: link('') },
			{ icon: 'clock', label: 'ساعت کاری', value: 'شنبه تا چهارشنبه، ۹:۳۰ تا ۱۸:۳۰', link: link('') },
		], { map: '', map_image: '' }),
	]),
	briefBlock('۰۲'),
];

const faqPage = [
	L.pageHead(eyebrow('۰۱', 'پرسش‌ها'), 'هر آنچه\n*باید بدانید*', ''),
	briefBlock('۰۲'),
];

/* ---------------- Pages, templates, menus ---------------- */

const pages = [
	{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings({ header: 'transparent' }) },
	{ key: 'about', title: 'درباره‌ی ما', slug: 'about', elementor: about, settings: L.pageSettings() },
	{ key: 'services', title: 'خدمات', slug: 'services', elementor: servicesPage, settings: L.pageSettings() },
	{ key: 'branding', parent: 'services', title: 'هویت برند و گرافیک', slug: 'branding', elementor: branding, settings: L.pageSettings() },
	{ key: 'web', parent: 'services', title: 'طراحی و توسعه‌ی وب', slug: 'web-design', elementor: web, settings: L.pageSettings() },
	{ key: 'marketing', parent: 'services', title: 'بازاریابی دیجیتال', slug: 'digital-marketing', elementor: marketing, settings: L.pageSettings() },
	{ key: 'projects', title: 'نمونه‌کارها', slug: 'work', elementor: projectsPage, settings: L.pageSettings() },
	{ key: 'team', title: 'تیم', slug: 'team', elementor: teamPage, settings: L.pageSettings() },
	{ key: 'consult', title: 'رزرو مشاوره', slug: 'book-a-consultation', elementor: consult, settings: L.pageSettings() },
	{ key: 'pricing', title: 'تعرفه‌ها', slug: 'pricing', elementor: pricingPage, settings: L.pageSettings() },
	{ key: 'faq', title: 'پرسش‌های متداول', slug: 'faq', elementor: faqPage, settings: L.pageSettings() },
	{ key: 'contact', title: 'تماس', slug: 'contact', elementor: contact, settings: L.pageSettings() },
	{ key: 'blog', title: 'مجله', slug: 'journal', content: '' },
];

module.exports = {
	manifest: {
		id: 'arghavan',
		order: 3,
		title: 'ارغوان',
		desc: 'آژانس بازاریابی و طراحی؛ نوشته‌ی عظیم روان روی پرتره‌ی بزرگ، کارت‌های آمار روی پنل تیره، روند کار مرحله‌به‌مرحله، خدمات شماره‌دار، گالری نمونه‌کار، نظر مشتری‌ها با انتخاب از ردیف چهره‌ها، نوار پرتره‌های تیم، تعرفه، فرم پروژه کنار پرسش‌ها، رزرو مشاوره و فروشگاه بسته‌های بازاریابی. خاکستری روشن و ارغوانی؛ روشن و تیره.',
		kit: 'ember',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: ['woocommerce'],
		tags: ['آژانس بازاریابی', 'برند', 'روشن', 'رزرو آنلاین', 'فروشگاه خدمات'],
		pages: pages.filter((p) => p.elementor).map((p) => p.title).concat(['فروشگاه', 'مجله']),
	},
	content: {
		site: { title: 'ارغوان', tagline: 'آژانس بازاریابی دیجیتال و طراحی برند' },
		images, alts, terms, posts, projects, experts, products, pages,
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'ارغوان — صفحه‌ی اصلی' },
			{ key: 'tpl-about', type: 'page', page: 'about', title: 'ارغوان — درباره‌ی ما' },
			{ key: 'tpl-services', type: 'page', page: 'services', title: 'ارغوان — خدمات' },
			{ key: 'tpl-hero', type: 'section', page: 'home', index: 0, title: 'ارغوان — قهرمان با نوشته‌ی روان' },
			{ key: 'tpl-stats', type: 'section', page: 'home', index: 1, title: 'ارغوان — کارت‌های آمار' },
			{ key: 'tpl-spotlight', type: 'section', page: 'home', index: 5, title: 'ارغوان — نظر مشتری‌ها' },
			{ key: 'tpl-team', type: 'section', page: 'home', index: 6, title: 'ارغوان — نوار پرتره‌های تیم' },
		],
		menus: [
			{
				name: 'ارغوان — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'خدمات', page: 'services', children: [
						{ title: 'هویت برند و گرافیک', page: 'branding' },
						{ title: 'طراحی و توسعه‌ی وب', page: 'web' },
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
				name: 'ارغوان — پابرگ', location: 'footer', items: [
					{ title: 'درباره‌ی ما', page: 'about' },
					{ title: 'خدمات', page: 'services' },
					{ title: 'تعرفه‌ها', page: 'pricing' },
					{ title: 'رزرو مشاوره', page: 'consult' },
					{ title: 'پرسش‌ها', page: 'faq' },
					{ title: 'تماس', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 36,
			accent: '#7b2cf0',
			accent_dark: '#a874ff',
			header_layout: 'split',
			header_cart: true,
			header_cta_text: 'شروع کنید',
			header_cta_url: contactUrl,
			font_body: 'iranyekan',
			font_body_weight: '400',
			font_heading: 'peyda',
			font_heading_weight: '800',
			booking_type: 'consulting',
			booking_page: '{{pageid:consult}}',
			booking_days: 21,
			footer_about: 'ارغوان آژانس بازاریابی دیجیتال و طراحی برند در اصفهان است؛ از ۱۳۹۶ کنار برندهای ایرانی.',
			footer_copyright: 'تمام حقوق برای آژانس ارغوان محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }, { network: 'linkedin', url: 'https://linkedin.com/' }, { network: 'whatsapp', url: 'https://wa.me/989131234567' }],
			mobile_bar: true,
			mobile_bar_text: 'شروع کنید',
			mobile_bar_url: contactUrl,
			mobile_bar_phone: '03136602211',
			magnetic: true,
			cursor: 'ring',
			sound_enabled: true,
			sound_default: false,
			sound_theme: 'soft',
			sound_volume: 25,
			seo_business_type: 'ProfessionalService',
			seo_business_phone: '03136602211',
			seo_business_city: 'اصفهان',
			seo_business_street: 'خیابان چهارباغ بالا، کوچه‌ی ارغوان، پلاک ۷',
			seo_llms_intro: 'ارغوان آژانس بازاریابی دیجیتال و طراحی برند در اصفهان است.',
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 3, pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
