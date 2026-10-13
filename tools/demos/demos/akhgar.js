/**
 * Demo: Akhgar — a creative studio for brand, web and growth (Ember kit),
 * after the first home page of the Noryx reference: a dark panel hero with a
 * running strip and social ring, a statement that lights up word by word,
 * a bento of reasons, large stepping service names, stacking project cards,
 * pricing, team, a piling process with a giant word, a testimonial wall over
 * a crowd, a call to action under arcs, journal and FAQ.
 * Pages: about, services (+3 service pages), projects, team with online
 * consultation booking, pricing, shop of digital products, journal, FAQ and contact.
 */
'use strict';

const L = require('../lib');
const { img, gallery, link, px, pct, gap, pad, w, con, bleed, section, cols, heading, button } = L;

const images = { logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp' };
[
	'hero', 'hero-film', 'laurel', 'about', 'star', 'why-bg', 'cloud', 'hand', 'robot', 'shield', 'runner', 'faces',
	'ser-1', 'ser-2', 'ser-3', 'ser-4', 'ser-5', 'pro-1', 'pro-2', 'pro-3', 'pro-4', 'pro-5', 'pro-6', 'pro-7',
	'plan-1', 'plan-2', 'bolt', 'plan-wave', 'tm-1', 'tm-2', 'tm-3', 'tm-4', 'tm-5', 'step-1', 'step-2', 'step-3',
	'crowd', 'tst-1', 'tst-2', 'tst-3', 'tst-4', 'tst-5', 'av-1', 'av-2', 'av-3', 'av-4', 'av-5', 'av-6',
	'touch', 'faq-face', 'blog-1', 'blog-2', 'blog-3', 'blog-4', 'blog-5', 'blog-6', 'footer-bg',
	'office-1', 'office-2', 'work-1', 'work-2', 'work-3', 'work-4', 'work-5', 'work-6',
].forEach((k) => { images[k] = 'images/' + k + '.webp'; });
for (let i = 1; i <= 7; i++) {
	images['logo-w-' + i] = 'images/logo-w-' + i + '.webp';
	images['logo-k-' + i] = 'images/logo-k-' + i + '.webp';
}

const alts = {
	hero: 'نیم‌رخ مردی در نور سرخ و آبی استودیو',
	about: 'چهره‌ای زیر کلاه، پشت پرده‌ای از نوارهای عمودی نور',
	runner: 'دونده‌ای در حال گام برداشتن روی شن',
	crowd: 'جمعیتی در تاریکی سالن، رو به نور صحنه',
	'office-1': 'تیم اخگر دور میز کار، کنار مانیتورها',
	'office-2': 'دو همکار در حال بررسی نمونه‌ی طراحی',
};

const contactUrl = '{{page:contact}}';
const bookUrl = '{{page:consult}}';
const avatars = gallery(['av-1', 'av-2', 'av-3']);
const logosInk = gallery(['logo-k-1', 'logo-k-2', 'logo-k-3', 'logo-k-4', 'logo-k-5', 'logo-k-6', 'logo-k-7']);
const logosWhite = gallery(['logo-w-6', 'logo-w-7', 'logo-w-1']);

/* ---------------- Terms, posts, projects, team, products ---------------- */

const terms = [
	{ key: 'pf-brand', taxonomy: 'hm_portfolio_cat', name: 'برندینگ', slug: 'branding' },
	{ key: 'pf-web', taxonomy: 'hm_portfolio_cat', name: 'وب و اپلیکیشن', slug: 'web-and-app' },
	{ key: 'pf-growth', taxonomy: 'hm_portfolio_cat', name: 'رشد و تبلیغات', slug: 'growth' },
	{ key: 'cat-brand', taxonomy: 'category', name: 'برند', slug: 'brand' },
	{ key: 'cat-growth', taxonomy: 'category', name: 'رشد', slug: 'growth-notes' },
	{ key: 'cat-design', taxonomy: 'category', name: 'طراحی', slug: 'design' },
	{ key: 'sv-consult', taxonomy: 'hm_service', name: 'مشاوره‌ی استراتژی', slug: 'strategy-consult' },
	{ key: 'pc-kits', taxonomy: 'product_cat', name: 'کیت‌های طراحی', slug: 'design-kits' },
	{ key: 'pc-templates', taxonomy: 'product_cat', name: 'قالب‌های آماده', slug: 'ready-templates' },
	{ key: 'pc-sessions', taxonomy: 'product_cat', name: 'جلسه و ممیزی', slug: 'sessions-and-audits' },
];

const project = (key, title, slug, image, detail, cats, meta, excerpt, body) => ({
	key, title, slug, image, terms: cats, meta, excerpt,
	content: L.article(body.concat([['img', detail, '']])),
});

const projects = [
	project('p-sokhan', 'کمپین رشد شبکه‌های اجتماعی «سخن»', 'sokhan-social-growth', 'pro-1', 'pro-4', ['pf-growth'],
		{ client: 'اپلیکیشن آموزش زبان سخن', year: '۱۴۰۴', services: 'استراتژی محتوا، تبلیغات، ویدیو', url: '' },
		'سه ماه، یک صدای تازه و دو برابر شدن کاربران فعال؛ بی‌آنکه بودجه‌ی تبلیغات بیشتر شود.',
		[
			'سخن مخاطب داشت، اما مخاطبش او را با رقبا اشتباه می‌گرفت. کار را با گفت‌وگو با پنجاه کاربر شروع کردیم تا بفهمیم چرا یادگیری را رها می‌کنند.',
			['h', 'یک لحن، در همه‌جا'],
			'برای برند یک راهنمای لحن نوشتیم و قالب‌های کوتاه ویدیویی ساختیم که هر هفته با کمترین هزینه تولید شوند. تبلیغات را از نمایش صرف به ثبت‌نام آزمایشی بردیم.',
			['ul', ['۲٫۱ برابر کاربر فعال هفتگی', '۳۸٪ کاهش هزینه‌ی جذب هر کاربر', 'بیش از ۹۰ ویدیوی کوتاه در سه ماه']],
		]),
	project('p-nava', 'برند و استراتژی بازار «نوا»', 'nava-branding', 'pro-2', 'pro-5', ['pf-brand'],
		{ client: 'کارگاه قهوه‌ی نوا', year: '۱۴۰۳', services: 'نام‌گذاری، هویت بصری، بسته‌بندی', url: '' },
		'از یک کارگاه کوچک تا برندی که در سه شهر شناخته می‌شود؛ هویتی گرم با جزئیاتی که دیده می‌شود.',
		[
			'نوا قهوه‌ی خوبی داشت و بسته‌بندی‌ای که در قفسه گم می‌شد. هویت را از بوی قهوه‌ی تازه‌برشته شروع کردیم: رنگ مس، خط‌های گرم و یک نشانه‌ی ساده که روی هر چیزی جا شود.',
			['h', 'قفسه، اولین ویترین'],
			'بسته‌بندی را طوری چیدیم که از دو متری هم شناخته شود و نوع دانه و درجه‌ی برشته‌کاری با یک نگاه خوانده شود.',
			['q', 'اولین بار بود مشتری‌ها از ما می‌پرسیدند طراح بسته‌بندی کیست.', 'مدیر کارگاه نوا'],
		]),
	project('p-pishro', 'کمپین چندرسانه‌ای بازاریابی «پیشرو»', 'pishro-multichannel', 'pro-3', 'pro-6', ['pf-growth', 'pf-web'],
		{ client: 'آموزشگاه برنامه‌نویسی پیشرو', year: '۱۴۰۴', services: 'وب‌سایت، سئو، تبلیغات کلیکی', url: '' },
		'سایتی تازه، صفحه‌های فرود برای هر دوره و گزارشی که نشان می‌دهد هر ثبت‌نام از کجا آمده است.',
		[
			'پیشرو هر فصل دوره‌ی تازه داشت و هر بار از صفر برایش تبلیغ می‌کرد. یک سیستم ساختیم: سایتی سریع، قالب صفحه‌ی فرود برای هر دوره و ردیابی کامل از کلیک تا ثبت‌نام.',
			['ul', ['زمان بارگذاری صفحه زیر یک ثانیه', '۵۴٪ رشد ثبت‌نام از جست‌وجوی گوگل', 'گزارش ماهانه‌ی ساده برای مدیران']],
		]),
	project('p-farhang', 'وب‌سایت و فروشگاه «فرهنگ‌سرا»', 'farhangsara-store', 'pro-7', 'pro-4', ['pf-web'],
		{ client: 'نشر فرهنگ‌سرا', year: '۱۴۰۳', services: 'طراحی تجربه، فروشگاه، اتصال انبار', url: '' },
		'فروشگاه کتابی که خواندن معرفی کتاب‌ها در آن لذت دارد؛ با اتصال مستقیم به انبار نشر.',
		[
			'فرهنگ‌سرا هزار و دویست عنوان کتاب داشت و فهرستی که کسی تا انتهایش نمی‌رفت. صفحه‌ها را حول کشف کتاب چیدیم: مجموعه‌های موضوعی، نقل‌قول‌ها و پیشنهاد ویراستاران.',
			['ul', ['۴۱٪ افزایش میانگین سبد خرید', 'اتصال لحظه‌ای موجودی به انبار', 'نسخه‌ی موبایل با سرعت عالی']],
		]),
];

const twoShifts = { on: true, from: '10:00', to: '13:00', from2: '15:00', to2: '18:00' };
const morning = { on: true, from: '10:00', to: '13:00', from2: '', to2: '' };
const off = { on: false, from: '10:00', to: '13:00', from2: '', to2: '' };
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
	member('m-sara', 'سارا احمدی', 'sara-ahmadi', 1, 'tm-3', { role: 'بنیان‌گذار و مدیر خلاقیت', experience: '۱۴', fee: 'جلسه‌ی اول رایگان', location: 'حضوری یا آنلاین' }, 'ttmtmoo',
		'برندها را از نام و داستان تا هویت بصری می‌سازد؛ چهارده سال کار با استارتاپ‌ها و برندهای ملی.',
		['سارا پیش از اخگر مدیر هنری دو آژانس تبلیغاتی بود. حالا بیشتر وقتش را روی جلسه‌های کشف با مشتری‌ها و هدایت تیم طراحی می‌گذارد.', ['ul', ['استراتژی و جایگاه‌یابی برند', 'نام‌گذاری و داستان برند', 'هدایت هویت بصری']]]),
	member('m-arman', 'آرمان رضوی', 'arman-razavi', 2, 'tm-1', { role: 'مدیر رشد و تبلیغات', experience: '۱۰', fee: 'جلسه‌ی اول رایگان', location: 'آنلاین' }, 'tmttmoo',
		'کمپین‌هایی می‌سازد که هر تومانش قابل ردیابی است؛ از تبلیغات کلیکی تا سئو.',
		['آرمان ده سال است که کمپین‌های دیجیتال برندهای فروشگاهی و آموزشی را مدیریت می‌کند و به عددها بیشتر از سلیقه اعتماد دارد.', ['ul', ['تبلیغات کلیکی و شبکه‌های اجتماعی', 'سئو و محتوا', 'گزارش و تحلیل داده']]]),
	member('m-niloofar', 'نیلوفر کریمی', 'niloofar-karimi', 3, 'tm-4', { role: 'مدیر طراحی تجربه', experience: '۱۲', fee: '۹۵۰ هزار تومان', location: 'حضوری' }, 'mtmtmoo',
		'سایت و اپلیکیشن را از نگاه کاربر می‌بیند؛ تحقیق، معماری اطلاعات و طراحی رابط.',
		['نیلوفر تحقیق کاربر و طراحی رابط را برای بیش از چهل محصول دیجیتال انجام داده است.', ['ul', ['تحقیق و آزمون کاربرپذیری', 'طراحی رابط وب و موبایل', 'سیستم‌های طراحی']]]),
	member('m-kian', 'کیان مرادی', 'kian-moradi', 4, 'tm-5', { role: 'سرپرست توسعه', experience: '۹', fee: '۹۵۰ هزار تومان', location: 'آنلاین' }, 'ttmmtoo',
		'سایت‌هایی می‌سازد که زیر یک ثانیه بالا می‌آیند و سال‌ها بی‌دردسر کار می‌کنند.',
		['کیان سرپرست تیم توسعه‌ی اخگر است و روی سرعت، امنیت و نگهداری بلندمدت سایت‌ها تمرکز دارد.', ['ul', ['وردپرس و فروشگاه‌های ووکامرس', 'بهینه‌سازی سرعت', 'اتصال به سامانه‌های داخلی']]]),
	member('m-mina', 'مینا صالحی', 'mina-salehi', 5, 'tm-2', { role: 'طراح موشن و سه‌بعدی', experience: '۷', fee: '۷۵۰ هزار تومان', location: 'آنلاین' }, 'momomoo',
		'به برندها حرکت می‌دهد؛ ویدیوی محصول، انیمیشن لوگو و مدل‌های سه‌بعدی.',
		['مینا طراح موشن و سه‌بعدی است و پیش از اخگر برای استودیوهای تبلیغاتی ویدیوی محصول می‌ساخت.']),
];

const product = (key, title, slug, price, sku, image, cats, excerpt, paragraphs, specs, extra = {}) => Object.assign({
	key, title, slug, price, sku, image, gallery: [], terms: cats, excerpt, stock: 999, virtual: true, downloadable: true,
	content: L.productBody(paragraphs, specs),
}, extra);

const products = [
	product('kit-brand', 'کیت راهنمای برند', 'brand-guideline-kit', 2900000, 'AK-KIT-BRAND', 'pro-4', ['pc-kits'],
		'هفتاد صفحه‌ی آماده برای راهنمای برند؛ لوگو، رنگ، تایپوگرافی و لحن.',
		['قالبی که خودمان برای تحویل هویت بصری به مشتری‌ها استفاده می‌کنیم؛ حالا برای تیم‌هایی که می‌خواهند راهنمای برندشان را خودشان بنویسند.', 'فایل‌ها در فیگما و ایندیزاین، با نمونه‌ی کامل پرشده.'],
		[['قالب فایل', 'فیگما، ایندیزاین'], ['تعداد صفحه', '۷۰'], ['زبان', 'فارسی و انگلیسی']], { featured: true }),
	product('kit-social', 'بسته‌ی قالب پست و استوری', 'social-template-pack', 1800000, 'AK-KIT-SOCIAL', 'pro-5', ['pc-kits'],
		'۱۲۰ قالب پست و استوری قابل ویرایش برای اینستاگرام و لینکدین.',
		['قالب‌هایی که با چند کلیک رنگ و فونت برندتان را می‌گیرند. برای اعلام محصول، نقل‌قول، آموزش و پیشنهاد ویژه.'],
		[['قالب فایل', 'فیگما و کانوا'], ['تعداد قالب', '۱۲۰'], ['ابعاد', 'پست، استوری، کاروسل']], { featured: true }),
	product('tpl-landing', 'قالب صفحه‌ی فرود محصول', 'product-landing-template', 3500000, 'AK-TPL-LAND', 'pro-6', ['pc-templates'],
		'صفحه‌ی فرود آماده برای المنتور؛ سریع، راست‌چین و آماده‌ی کمپین.',
		['همان ساختاری که برای کمپین‌های مشتری‌هایمان استفاده می‌کنیم: پیام اصلی، نشانه‌های اعتماد، پرسش‌ها و فرم.'],
		[['سازگار با', 'وردپرس و المنتور'], ['سرعت', 'بالای ۹۵ در PageSpeed'], ['پشتیبانی', 'شش ماه']]),
	product('tpl-deck', 'قالب ارائه‌ی سرمایه‌گذاری', 'pitch-deck-template', 2400000, 'AK-TPL-DECK', 'pro-7', ['pc-templates'],
		'بیست‌وچهار اسلاید برای ارائه به سرمایه‌گذار؛ از مسئله تا عددها.',
		['ساختاری که در بیش از ده جلسه‌ی جذب سرمایه آزموده شده است. هر اسلاید یک راهنمای کوتاه دارد که می‌گوید چه بنویسید.'],
		[['قالب فایل', 'پاورپوینت، کی‌نوت، فیگما'], ['تعداد اسلاید', '۲۴']]),
	product('audit-seo', 'ممیزی سئو و سرعت سایت', 'seo-speed-audit', 4900000, 'AK-AUD-SEO', 'pro-1', ['pc-sessions'],
		'گزارش کامل سئوی فنی، محتوا و سرعت؛ با فهرست کارها به ترتیب اهمیت.',
		['ظرف هفت روز کاری گزارشی می‌گیرید که می‌گوید سایتتان کجا رتبه از دست می‌دهد و هر مشکل را چطور باید رفع کرد.', 'یک جلسه‌ی آنلاین یک‌ساعته برای مرور گزارش هم در بسته هست.'],
		[['زمان تحویل', 'هفت روز کاری'], ['خروجی', 'گزارش PDF و جلسه‌ی مرور']], { featured: true }),
	product('session-brand', 'جلسه‌ی کارگاه برند', 'brand-workshop-session', 6500000, 'AK-SES-BRAND', 'pro-2', ['pc-sessions'],
		'کارگاه سه‌ساعته با تیم شما برای روشن کردن جایگاه و پیام برند.',
		['با تیم مدیریت می‌نشینیم و جایگاه، مخاطب و پیام اصلی برند را روی کاغذ می‌آوریم. خروجی، یک سند یک‌صفحه‌ای است که همه‌ی تیم به آن تکیه می‌کنند.'],
		[['مدت', 'سه ساعت'], ['شرکت‌کنندگان', 'تا شش نفر'], ['محل', 'حضوری در دفتر یا آنلاین']]),
];

const posts = [
	{
		key: 'brand-voice', title: 'لحن برند را چطور بنویسیم که تیم واقعاً از آن استفاده کند', slug: 'writing-a-brand-voice', image: 'blog-1', terms: ['cat-brand'], days_ago: 3,
		excerpt: 'راهنمای لحنی که در یک پوشه خاک بخورد، به هیچ دردی نمی‌خورد. چهار قدم ساده برای نوشتن راهنمایی که هر روز باز شود.',
		content: L.article([
			'بیشتر راهنماهای لحن برند با جمله‌هایی مثل «صمیمی اما حرفه‌ای» شروع می‌شوند و همان‌جا هم تمام می‌شوند. مشکل این است که این جمله‌ها به نویسنده نمی‌گویند فردا صبح در پاسخ یک مشتری عصبانی چه بنویسد.',
			['h', 'به جای صفت، نمونه بنویسید'],
			'برای هر موقعیت پرتکرار، یک نمونه‌ی درست و یک نمونه‌ی نادرست کنار هم بگذارید. پاسخ به شکایت، اعلام محصول تازه، پیام خوش‌آمد. تیم از نمونه یاد می‌گیرد، نه از تعریف.',
			['q', 'لحن برند، شخصیتی است که حتی وقتی خسته‌اید هم باید سر جایش بماند.', ''],
			['ul', ['یک صفحه، نه پنجاه صفحه', 'برای هر کانال یک نمونه', 'فهرست واژه‌هایی که استفاده نمی‌کنیم', 'بازبینی هر شش ماه']],
		]),
	},
	{
		key: 'growth-hacks', title: 'پنج تجربه‌ی رشد که برای برندهای کوچک جواب داد', slug: 'growth-lessons-for-small-brands', image: 'blog-2', terms: ['cat-growth'], days_ago: 9,
		excerpt: 'بودجه‌ی کم بهانه نیست؛ پنج کاری که در کمپین‌های امسال، با کمترین هزینه بیشترین نتیجه را داشت.',
		content: L.article([
			'امسال روی کمپین‌های دوازده برند کوچک کار کردیم. بیشترشان بودجه‌ی محدودی داشتند و همین مجبورمان کرد دقیق‌تر فکر کنیم.',
			['h', 'اول اندازه بگیرید'],
			'پیش از هر تبلیغ، ردیابی تبدیل را درست کنید. بیشتر بودجه‌هایی که هدر رفته‌اند، صرف کانال‌هایی شده‌اند که هیچ‌کس نمی‌دانست چه می‌آورند.',
			['ol', ['ردیابی کامل از کلیک تا خرید', 'یک پیشنهاد روشن به جای ده پیام', 'ویدیوی کوتاه به جای عکس محصول', 'بازگشت به کاربرانی که سبد را رها کرده‌اند', 'گزارش هفتگی یک‌صفحه‌ای']],
		]),
	},
	{
		key: 'speed', title: 'چرا سایت سریع، فروش بیشتری دارد', slug: 'why-fast-sites-sell-more', image: 'blog-3', terms: ['cat-design'], days_ago: 16,
		excerpt: 'هر ثانیه تأخیر، بخشی از مشتری‌ها را پشت در نگه می‌دارد. از کجا شروع کنیم؟',
		content: L.article([
			'کاربر موبایل صبور نیست. اگر صفحه در سه ثانیه بالا نیاید، بیشتر بازدیدکننده‌ها برمی‌گردند و دیگر نمی‌آیند.',
			['h', 'سه کار با بیشترین اثر'],
			['ul', ['تصاویر را در قالب WebP و به اندازه‌ی واقعی نمایش بدهید', 'فونت‌ها را روی سایت خودتان میزبانی کنید', 'اسکریپت‌هایی را که لازم نیستند حذف کنید']],
			'در پروژه‌های اخگر، سرعت را از روز اول در طراحی لحاظ می‌کنیم، نه در هفته‌ی آخر.',
		]),
	},
	{
		key: 'design-system', title: 'سیستم طراحی برای تیم‌های کوچک: از کجا شروع کنیم', slug: 'design-systems-for-small-teams', image: 'blog-4', terms: ['cat-design'], days_ago: 24,
		excerpt: 'لازم نیست سیستم طراحی صد مؤلفه داشته باشد؛ با ده جزء درست می‌شود سرعت تیم را دو برابر کرد.',
		content: L.article([
			'سیستم طراحی برای شرکت‌های بزرگ نیست؛ برای هر تیمی است که نمی‌خواهد هر دکمه را از نو طراحی کند.',
			['ul', ['رنگ‌ها و فاصله‌ها به‌صورت توکن', 'دکمه، فیلد، کارت و جدول', 'قاعده‌ی تایپوگرافی فارسی و انگلیسی']],
		]),
	},
	{
		key: 'campaign', title: 'گزارش یک کمپین: از ایده تا اولین هزار مشتری', slug: 'campaign-report-first-thousand', image: 'blog-5', terms: ['cat-growth'], days_ago: 31,
		excerpt: 'روایت قدم‌به‌قدم کمپین راه‌اندازی یک محصول؛ آنچه کار کرد و آنچه نکرد.',
		content: L.article([
			'این گزارش روایت شش هفته کار روی راه‌اندازی یک اپلیکیشن است؛ با عددها، اشتباه‌ها و تصمیم‌هایی که گرفتیم.',
			['h', 'هفته‌ی اول: یک پیام، نه ده پیام'],
			'به جای معرفی همه‌ی امکانات، فقط روی یک مشکل تمرکز کردیم و همان را در همه‌ی کانال‌ها تکرار کردیم.',
		]),
	},
	{
		key: 'naming', title: 'نام‌گذاری برند: ده پرسشی که پیش از انتخاب نام بپرسید', slug: 'ten-questions-before-naming', image: 'blog-6', terms: ['cat-brand'], days_ago: 40,
		excerpt: 'نام خوب باید هم به گوش خوش بیاید، هم در جست‌وجو پیدا شود، هم ثبت شدنی باشد.',
		content: L.article([
			'انتخاب نام، یکی از سخت‌ترین و ماندگارترین تصمیم‌های هر کسب‌وکار است. این ده پرسش کمک می‌کنند پیش از دلبستگی به یک نام، آن را محک بزنید.',
			['ol', ['در جمله، راحت گفته می‌شود؟', 'دامنه و صفحه‌ی اجتماعی آن آزاد است؟', 'قابل ثبت به‌عنوان علامت تجاری است؟']],
		]),
	},
];

/* ---------------- Shared blocks ---------------- */

const eyebrow = (n, label) => '*{ ' + n + ' }* # ' + label;

/** A dark full-width band with an optional background picture. */
const band = (opts, elements) => con(Object.assign({
	content_width: 'boxed',
	css_classes: ['hm-gutter', 'hm-space-' + (opts.space || 'lg'), 'hm-scheme-inverse', opts.cls || ''].join(' ').trim(),
	flex_gap: gap(opts.gap ?? 48),
	background_background: opts.bg ? 'classic' : '',
	background_image: opts.bg ? img(opts.bg) : '',
	background_position: 'center center',
	background_size: 'cover',
}, opts.extra || {}), elements);

const services = [
	{ title: 'طراحی وب‌سایت', tags: 'طراحی تجربه، واکنش‌گرا، هویت بصری', image: img('ser-1'), icon: 'grid', link: link('{{page:web-design}}'), text: 'از تحقیق کاربر تا سایتی سریع و زیبا که فروش می‌آورد.' },
	{ title: 'بازاریابی دیجیتال', tags: 'استراتژی، سئو، تبلیغات کلیکی', image: img('ser-2'), icon: 'megaphone', link: link('{{page:marketing}}'), text: 'کمپین‌هایی که هر تومانش قابل ردیابی است.' },
	{ title: 'استراتژی برند', tags: 'جایگاه‌یابی، نام‌گذاری، لوگو', image: img('ser-3'), icon: 'target', link: link('{{page:branding}}'), text: 'برندی با یک صدای روشن و ماندگار.' },
	{ title: 'موشن و سه‌بعدی', tags: 'ویدیوی محصول، انیمیشن لوگو', image: img('ser-4'), icon: 'cube', link: link('{{page:services}}'), text: 'حرکت و عمق برای محصول و برند شما.' },
	{ title: 'هویت بصری', tags: 'رنگ، تایپوگرافی، بسته‌بندی', image: img('ser-5'), icon: 'palette', link: link('{{page:branding}}'), text: 'زبان تصویری یکپارچه، از کارت ویزیت تا بیلبورد.' },
];

const faqItems = [
	['دقیقاً چه خدماتی ارائه می‌دهید؟', 'استراتژی و هویت برند، طراحی و توسعه‌ی وب‌سایت و فروشگاه، و بازاریابی دیجیتال شامل سئو، تبلیغات کلیکی و شبکه‌های اجتماعی. می‌توانید یک خدمت یا همه را با هم بگیرید.'],
	['نتیجه‌ی کار چقدر طول می‌کشد تا دیده شود؟', 'در تبلیغات کلیکی معمولاً از هفته‌ی دوم، در سئو بین سه تا شش ماه، و در پروژه‌های برند و سایت از روز تحویل.'],
	['هزینه‌ی پروژه‌ها چطور محاسبه می‌شود؟', 'برای پروژه‌های مشخص قیمت ثابت می‌دهیم و برای کارهای ادامه‌دار، اشتراک ماهانه. پیش از شروع، هزینه و زمان‌بندی را مکتوب دریافت می‌کنید.'],
	['با کسب‌وکارهای کوچک هم کار می‌کنید؟', 'بله. بسته‌ی پروژه‌ی تکی برای همین ساخته شده است و جلسه‌ی اول مشاوره هم رایگان است.'],
	['بعد از تحویل سایت پشتیبانی دارید؟', 'هر سایت سه ماه پشتیبانی رایگان دارد و پس از آن می‌توانید قرارداد نگهداری ماهانه داشته باشید.'],
];

const faqBlock = () => section({ space: 'lg', gap: 0 }, [
	cols({ widths: [58, 42], gap: 56, align: 'start' }, [
		[heading({ eyebrow: eyebrow('۱۳', 'پرسش‌های متداول'), title: 'هر آنچه باید بدانید', title_size: 'lg' }), L.faq(faqItems, { style: 'cards' })],
		[w('hm-cta', {
			eyebrow: '', title: 'هنوز مطمئن نیستید؟\nیک جلسه‌ی رایگان بگیریم.', desc: 'نیم ساعت گفت‌وگو درباره‌ی هدف‌ها و بودجه؛ بی‌هیچ تعهدی.',
			title_tag: 'h3', title_size: 'md', header_align: 'start', title_reveal: 'words', action: 'buttons',
			btn1_text: 'رزرو جلسه', btn1_link: link(bookUrl), btn1_style: 'primary', btn2_text: 'تماس بگیرید', btn2_link: link('tel:02188776655'), btn2_style: 'link',
			look: 'surface', decor: '', rounded: 'yes',
		})],
	]),
]);

const touchBlock = () => section({ space: 'lg', gap: 40, cls: 'hm-arcs' }, [
	heading({ eyebrow: eyebrow('۱۰', 'در تماس باشیم'), title: 'بیایید با هم\n*اثری بسازیم*', desc: 'با ما همراه شوید تا راهبردهایی بسازیم که رشد واقعی و ماندگار بیاورند.', header_align: 'center', title_size: 'xl' }),
	con({ content_width: 'full', css_classes: 'hm-scheme-inverse hm-panel', padding: pad(48, 48), flex_gap: gap(28) }, [
		heading({ eyebrow: eyebrow('۱۱', 'زمان پاسخ: کمتر از یک ساعت'), title: '', desc: '', title_size: 'sm' }),
		L.contactForm({ show_phone: 'yes', show_company: 'yes', show_subject: '', button: 'ارسال پیام', success: 'پیامتان رسید؛ کمتر از یک ساعت دیگر با شما تماس می‌گیریم.' }),
	], true),
]);

/* ---------------- Home ---------------- */

const home = [
	bleed(w('hm-agency-hero', {
		style: 'panel', status: 'پذیرش پروژه‌ی تازه',
		eyebrow: '{ استودیوی برتر سال ۱۴۰۴ }',
		title: 'راه‌حل‌هایی\n*با کیفیت برتر*',
		desc: 'ابزارهای هوشمند بازاریابی و طراحی، برای دیده شدن و فروش بیشتر در هر کانال.',
		btn_text: 'درباره‌ی ما', btn_link: link('{{page:about}}'), btn_style: 'secondary',
		image: img('hero'), poster: img('hero-film'), film: 'https://www.aparat.com/v/hamista',
		strip: [{ text: 'طراحی وب' }, { text: 'برندینگ' }, { text: 'سئو' }, { text: 'توسعه' }, { text: 'تبلیغات' }],
		socials: [{ network: 'instagram', url: link('https://instagram.com/') }, { network: 'telegram', url: link('https://t.me/') }, { network: 'linkedin', url: link('https://linkedin.com/') }, { network: 'x', url: link('https://x.com/') }, { network: 'whatsapp', url: link('https://wa.me/989121234567') }],
		brand_title: '*#۱* پیشنهاد مشتری‌ها در طراحی و تولید محتوا',
		logos: logosWhite, avatars, score: '4.8', proof_note: 'بر پایه‌ی ۲۰۴ نظر', height: 'screen',
	})),

	section({ space: 'lg', gap: 0 }, [
		w('hm-about-intro', {
			style: 'mission', eyebrow: eyebrow('۰۱', 'درباره‌ی ما'),
			statement: 'اخگر استودیویی خلاق است که ایده‌ها را به برند، سایت و کمپین‌هایی تبدیل می‌کند که *دیده می‌شوند* و فروش می‌آورند.',
			image: img('about'), shape: img('star'),
			btn_text: 'درباره‌ی اخگر', btn_link: link('{{page:about}}'), btn_style: 'primary',
			figures: [
				{ label: 'رضایت مشتری', value: '4.8', text: 'میانگین امتیاز بیش از دویست پروژه‌ی تحویل‌شده.' },
				{ label: 'پروژه‌ی منتشرشده', value: '+۱K', text: 'سایت، محصول و کمپینی که به دست مردم رسیده است.' },
			],
			cards: [
				{ icon: 'target', title: 'مأموریت ما', text: 'روایت‌گری و طراحی تازه، تا اثر هر برند بیشتر شود و رشدی قابل اندازه‌گیری و ماندگار داشته باشد.', points: 'استراتژی روشن\nگزارش شفاف\nیک تیم از ابتدا تا انتها\nپشتیبانی پس از تحویل' },
				{ icon: 'eye', title: 'چشم‌انداز ما', text: 'استودیویی که برندها به آن برمی‌گردند، چون کارش سال‌ها بعد هم جواب می‌دهد.', points: 'کیفیت پایدار\nنوآوری مداوم' },
			],
			avatars: gallery(['av-4', 'av-5', 'tst-3']), person: 'سارا احمدی', role: 'بنیان‌گذار و مدیر خلاقیت',
		}),
	]),

	band({ space: 'lg', gap: 48, bg: 'why-bg', cls: 'hm-noise' }, [
		heading({ eyebrow: eyebrow('۰۲', 'چرا برندها به ما اعتماد دارند'), title: 'روایت خلاق،\nهمراه با راهبرد هوشمند', header_align: 'center', title_size: 'lg' }),
		w('hm-bento', {
			columns: '9', columns_tablet: '2', columns_mobile: '1', row_height: px(300),
			cards: [
				{ kind: 'text', kicker: 'یک تماس کوتاه، بی‌هیچ تعهدی.', title: 'بیایید گپ بزنیم،\nیا فقط سلام کنیم.', btn_text: 'رزرو جلسه', btn_link: link(bookUrl), tone: 'light', cols: '3', rows: '1' },
				{ kind: 'figure', title: 'پشتیبانی هم‌زمان', text: 'از برنامه‌ریزی تا انتشار و پس از آن.', value: '۲۴/۷', image: img('cloud'), image_place: 'fill', tone: 'light', cols: '3', rows: '1' },
				{ kind: 'rating', title: '+۱۵۰ مشتری خوشحال در سراسر کشور', value: '4.8/5', image: img('faces'), image_place: 'center', tone: 'light', cols: '3', rows: '2' },
				{ kind: 'text', title: 'امن و\nقابل اعتماد', text: '(از ۱۳۹۸)', image: img('shield'), image_place: 'end', tone: 'accent', cols: '2', rows: '1' },
				{ kind: 'text', title: 'ساخته با بهترین ابزارها', text: 'جدیدترین ابزارها، یکپارچه و آماده‌ی کار.', tone: 'light', cols: '2', rows: '1' },
				{ kind: 'image', title: 'پایدار و\nآماده‌ی آینده', image: img('runner'), image_place: 'fill', tone: 'dark', cols: '2', rows: '1' },
			],
		}),
		w('hm-logo-grid', { logos: gallery(['logo-w-1', 'logo-w-2', 'logo-w-3', 'logo-w-4', 'logo-w-5', 'logo-w-6']), columns: '6', columns_tablet: '3', columns_mobile: '2', look: 'outline', btn_text: '' }),
	]),

	section({ space: 'lg', gap: 48 }, [
		cols({ widths: [55, 45], gap: 48, align: 'end' }, [
			[heading({ eyebrow: eyebrow('۰۳', 'خدمات ما'), title: 'رشد با راهبرد\nدیجیتال هوشمند', title_size: 'lg' })],
			[L.textEditor('<p>همه‌ی آنچه یک کسب‌وکار برای رشد آنلاین لازم دارد، در یک تیم: از برند و سایت تا تبلیغات و تحلیل داده.</p>'), button('همه‌ی خدمات', '{{page:services}}')],
		]),
		w('hm-service-list', { look: 'stagger', items: services }),
	]),

	section({ space: 'md', gap: 36, top0: true }, [
		cols({ widths: [35, 65], gap: 48, align: 'start' }, [
			[heading({ eyebrow: eyebrow('۰۴', 'مورد اعتماد آینده‌سازان'), title: '', title_size: 'sm' })],
			[L.textScrub('کنار هم، *تجربه‌ها و راه‌حل‌هایی* می‌سازیم که رشدی ماندگار برای کسب‌وکار به همراه دارند.', { size: 'md' })],
		]),
		w('hm-logo-grid', { logos: logosInk, columns: '6', columns_tablet: '4', columns_mobile: '2', look: 'soft', btn_text: 'به ما بپیوندید', btn_link: link(contactUrl) }),
	]),

	band({ space: 'lg', gap: 24 }, [
		cols({ widths: [50, 50], gap: 24, align: 'center', cls: 'hm-ag-rule' }, [
			[heading({ eyebrow: eyebrow('۰۵', 'کارهای ما'), title: '', title_size: 'sm' })],
			[L.textEditor('<p style="text-align:end;font-weight:700">داستان‌هایی که روایت کرده‌ایم</p>')],
		]),
		w('hm-giant-text', { text: 'کارهای', second: 'تازه', motion: 'part', look: 'solid', size: { unit: 'vw', size: 9, sizes: [] }, align: 'center', tag: 'p' }),
		w('hm-project-show', { source: 'portfolio', count: 4, look: 'stack', btn_text: 'جزئیات پروژه', year_label: 'سال:', cat_label: 'دسته:' }),
	]),

	section({ space: 'lg', gap: 40 }, [
		cols({ widths: [55, 45], gap: 48, align: 'end' }, [
			[L.textScrub('تعرفه‌هایی *برای رشد* ساخته شده‌اند', { eyebrow: eyebrow('۰۶', 'تعرفه‌ها'), size: 'md' })],
			[L.textEditor('<p>اشتراک ماهانه‌ی طراحی با دسترسی کامل به تیم خلاق؛ یا پروژه‌ی تکی با قیمت ثابت.</p>')],
		]),
		w('hm-pricing', {
			plans: [
				{ name: 'بسته‌ی رشد', desc: 'برای استارتاپ‌ها و برندهایی که سریع حرکت می‌کنند و به ارتباط روشن نیاز دارند.', price: '۴۹', price_alt: '', unit: 'میلیون تومان', period: '/ ماهانه', features: 'درخواست طراحی نامحدود\nطراحی وب و تجربه‌ی کاربری\nموشن و انیمیشن\nپشتیبانی ویژه\nتحویل سه‌روزه\nطرح‌های اولیه و صفحه‌ی حال‌وهوا\nتوقف یا لغو در هر زمان', btn_text: 'شروع کنید', btn_link: link(bookUrl), featured: 'yes', badge: 'جای خالی محدود' },
				{ name: 'پروژه‌ی تکی', desc: 'برای کارهای یک‌باره با دامنه‌ی مشخص؛ قیمت ثابت و زمان‌بندی روشن.', price: '۱۲۰', price_alt: '', unit: 'میلیون تومان', period: '/ از', features: 'دامنه‌ی کار مشخص\nزمان‌بندی ثابت\nسه دور بازبینی\nگزارش مراحل', btn_text: 'دریافت پیش‌فاکتور', btn_link: link(contactUrl), featured: '', badge: '' },
			],
			switch_off: '', switch_on: '',
		}),
	]),

	band({ space: 'lg', gap: 40 }, [
		cols({ widths: [36, 28, 36], gap: 40, align: 'end' }, [
			[L.textScrub('قدرت گرفته از *استعداد* و ذهن‌های خلاق و پرشور', { eyebrow: eyebrow('۰۷', 'تیم ما'), size: 'md' })],
			[L.imageReveal('tm-3', { ratio: '3-4', reveal: 'clip-up', parallax: px(0.2) })],
			[L.textEditor('<p>در اخگر باور داریم کار خوب با آدم‌های خوب شروع می‌شود. تیم ما از طراح، استراتژیست و برنامه‌نویس تشکیل شده که کنار هم کار می‌کنند.</p>'),
				w('hm-proof', { avatars: gallery(['tm-1', 'tm-2', 'tm-4']), plus: 'yes', plus_link: link('{{page:team}}'), score: '+۲٫۵K', stars: 5, note: 'همکاری موفق تیمی', layout: 'stack', align: 'start' }),
				button('دیدن همه‌ی تیم', '{{page:team}}', 'secondary')],
		]),
	]),

	section({ space: 'md', gap: 0, cls: 'hm-space-bottom-0' }, [
		w('hm-process', {
			eyebrow: eyebrow('۰۸', 'روند کار'), title: 'مسیر کار ما', desc: 'با گوش دادن شروع می‌کنیم و هدف‌ها، مخاطب و چالش‌های شما را دقیق می‌شناسیم؛ بعد برنامه می‌ریزیم، می‌سازیم و کنارتان بهتر می‌کنیم.',
			title_tag: 'h2', title_size: 'md', header_align: 'start', title_reveal: 'words', look: 'tabs', more: 'بیشتر',
			steps: [
				{ icon: 'target', title: 'تحلیل و راهبرد', text: 'کسب‌وکار، هدف‌ها و بازار شما را می‌شناسیم و برنامه‌ای روشن می‌نویسیم.', link: link('{{page:services}}') },
				{ icon: 'pen', title: 'طراحی و توسعه', text: 'ایده‌ها را به طرح و بعد به صفحه‌هایی تبدیل می‌کنیم که می‌توانید امتحانشان کنید.', link: link('{{page:web-design}}') },
				{ icon: 'rocket', title: 'انتشار', text: 'آزمون، اندازه‌گیری و انتشار؛ بی‌غافلگیری و طبق زمان‌بندی.', link: link('{{page:services}}') },
				{ icon: 'trend', title: 'بهبود و رشد', text: 'گزارش ماهانه و بهبودهای پیوسته، تا نتیجه هر ماه بهتر شود.', link: link('{{page:marketing}}') },
			],
		}),
		w('hm-giant-text', { text: 'گام‌ها', motion: 'slide', look: 'accent', size: { unit: 'vw', size: 22, sizes: [] }, crop: 'yes', align: 'start', tag: 'p' }),
	]),

	band({ space: 'lg', gap: 40, bg: 'crowd', cls: 'hm-dim-photo' }, [
		cols({ widths: [50, 50], gap: 24, align: 'center' }, [
			[heading({ eyebrow: eyebrow('۰۹', 'نظر مشتری‌ها'), title: '', title_size: 'sm' })],
			[L.textEditor('<p style="text-align:end;font-weight:700">بازخورد واقعی</p>')],
		]),
		w('hm-testimonial-wall', {
			look: 'scatter', word: 'نظر مشتری‌ها', rating_label: 'امتیاز',
			items: [
				{ quote: 'تیم اخگر خیلی زود فهمید چه می‌خواهیم و راهبردهایی اجرا کرد که تعامل و فروش ما را به‌وضوح بالا برد.', name: 'کامران ویلیامی', role: 'مدیر محصول', avatar: img('tst-1'), rating: '4.9', tone: 'light' },
				{ quote: 'خدمات عالی و راهنمایی دقیق. کمپین‌ها را هوشمندانه پیش بردند و هویت برندمان قوی‌تر از همیشه شد.', name: 'دانیال لطفی', role: 'مدیر بازاریابی', avatar: img('tst-2'), rating: '4.9', tone: 'accent' },
				{ quote: 'کار با این تیم را به همه پیشنهاد می‌کنم؛ روایت خلاق را با راهبرد هوشمند ترکیب می‌کنند و نتیجه می‌گیرند.', name: 'رونیا رحیمی', role: 'بنیان‌گذار استارتاپ', avatar: img('tst-3'), rating: '4.9', tone: 'dark' },
				{ quote: 'در هر مرحله ما را همراهی کردند و راه‌حل‌هایی دادند که نتیجه‌اش در عددها پیدا بود.', name: 'کورش حنیفی', role: 'مدیر فروش', avatar: img('tst-4'), rating: '4.9', tone: 'light' },
				{ quote: 'هر پروژه با این آژانس یک همکاری واقعی بود. به مخاطب تازه رسیدیم و سریع‌تر از انتظار رشد کردیم.', name: 'فرزانه میلانی', role: 'مدیرعامل', avatar: img('tst-5'), rating: '4.9', tone: 'accent' },
			],
		}),
		w('hm-proof', { avatars: gallery(['tst-1', 'tst-3']), name: 'کورش حنیفی', role: 'مدیر فروش', score: '', stars: 5, note: 'بر پایه‌ی ۲۰۴ نظر', layout: 'card', align: 'start', plus: '' }),
	]),

	touchBlock(),

	band({ space: 'lg', gap: 40 }, [
		cols({ widths: [55, 45], gap: 48, align: 'end' }, [
			[heading({ eyebrow: eyebrow('۱۲', 'تازه‌ترین نوشته‌ها'), title: 'فکر خلاق\nکنار راهبرد هوشمند', title_size: 'lg' })],
			[L.textEditor('<p>برنامه‌ریزی هوشمند و نوآوری خلاق، کنار هم برای بهتر شدن عملکرد برند شما.</p>'), button('همه‌ی نوشته‌ها', '{{page:blog}}', 'secondary')],
		]),
		L.posts({ count: 6, layout: 'carousel', columns: '3', excerpt: '' }),
	]),

	faqBlock(),
];

/* ---------------- About ---------------- */

const about = [
	L.pageHead(eyebrow('۰۱', 'درباره‌ی ما'), 'تیمی کوچک،\n*کارهایی بزرگ*', 'از ۱۳۹۸ کنار برندهای ایرانی هستیم؛ از استارتاپ‌های تازه تا نام‌هایی که همه می‌شناسند.'),
	section({ space: 'md', gap: 0 }, [
		w('hm-about-intro', {
			style: 'stats', eyebrow: eyebrow('۰۲', 'داستان ما'),
			statement: 'برندها را *به معنا* و طراحی را به نتیجه گره می‌زنیم.',
			text: 'با ترکیب نوآوری و هدف، طرح‌هایی می‌سازیم که برندها را در بازار رقابتی جلو می‌برند. هر پروژه با گوش دادن شروع می‌شود و با عدد سنجیده می‌شود.',
			shape: img('bolt'), btn_text: 'گفت‌وگو کنیم', btn_link: link(contactUrl), btn_style: 'primary',
			figures: [
				{ label: 'رضایت و بازگشت مشتری', value: '۹۵٪', text: 'تعهد ما به تحویل خدمات فراتر از انتظار.' },
				{ label: 'پروژه در ۲۴ شهر', value: '۷۵۰', text: 'مشتری‌هایی که با طراحی درست، رضایت و خرید تکراری گرفته‌اند.' },
				{ label: 'عضو تیم و همکار', value: '+۸۰', text: 'تیمی که هر سال بزرگ‌تر و باتجربه‌تر می‌شود.' },
			],
			score: '4.9/5', score_text: 'میانگین امتیاز مشتری‌ها به خدمات ما.', score_avatars: avatars,
		}),
	]),
	section({ space: 'md', gap: 24 }, [
		cols({ widths: [60, 40], gap: 24 }, [[L.imageReveal('office-1', { ratio: '16-9' })], [L.imageReveal('office-2', { ratio: '4-5' })]]),
	]),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: eyebrow('۰۳', 'خدمات'), title: 'آنچه برایتان می‌سازیم', title_size: 'lg' }),
		w('hm-service-list', { look: 'stagger', items: services.slice(0, 4) }),
	]),
	band({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: eyebrow('۰۴', 'نمونه‌کارها'), title: 'چند پروژه‌ی تازه', title_size: 'lg' }),
		w('hm-project-show', { source: 'portfolio', count: 3, look: 'stack', btn_text: 'جزئیات پروژه', year_label: 'سال:', cat_label: 'دسته:' }),
	]),
	section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: eyebrow('۰۵', 'تیم'), title: 'آدم‌های اخگر', title_size: 'lg' }),
		w('hm-experts', { eyebrow: '', title: '', desc: '', header_align: 'start', title_tag: 'h2', title_size: 'lg', title_reveal: 'words', count: 4, groups: [], filters: '', card_style: 'card', ratio: '3/4', button: 'yes', layout: 'grid', columns: '4' }),
	]),
	faqBlock(),
];

/* ---------------- Services and service pages ---------------- */

const servicesPage = [
	L.pageHead(eyebrow('۰۱', 'خدمات'), 'همه‌ی آنچه برای\n*رشد آنلاین* لازم دارید', 'استراتژی، طراحی و رشد در یک تیم؛ می‌توانید یک خدمت یا همه را با هم بگیرید.'),
	section({ space: 'md', gap: 0 }, [w('hm-service-list', { look: 'numbered', items: services.map((s, i) => Object.assign({}, s, { image: img(['work-1', 'work-2', 'work-3', 'work-4', 'work-5'][i]), meta_label: 'زمان‌بندی', meta_value: ['۴ تا ۸ هفته', 'ماهانه', '۳ تا ۶ هفته', '۲ تا ۴ هفته', '۳ تا ۵ هفته'][i] })), btn_text: 'جزئیات خدمت' })]),
	band({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: eyebrow('۰۲', 'چرا اخگر'), title: 'دلیل‌هایی برای انتخاب ما', header_align: 'center', title_size: 'lg' }),
		w('hm-bento', {
			columns: '9', columns_tablet: '2', columns_mobile: '1', row_height: px(260),
			cards: [
				{ kind: 'figure', title: 'سرعت تحویل', text: 'بیشتر پروژه‌ها زودتر از موعد تحویل شده‌اند.', value: '۹۲٪', tone: 'light', cols: '3' },
				{ kind: 'figure', title: 'مشتری‌هایی که برمی‌گردند', text: 'بیشتر کار ما از مشتری‌های قبلی می‌آید.', value: '۷۸٪', tone: 'accent', cols: '3' },
				{ kind: 'list', title: 'در هر پروژه', text: 'یک مدیر پروژه‌ی ثابت\nگزارش هفتگی\nسه ماه پشتیبانی رایگان', tone: 'dark', cols: '3' },
			],
		}),
	]),
	section({ space: 'lg', gap: 40 }, [
		w('hm-process', { eyebrow: eyebrow('۰۳', 'روند کار'), title: 'از اولین جلسه تا انتشار', desc: 'چهار مرحله‌ی روشن؛ در هر مرحله می‌دانید کجای کار هستیم.', title_tag: 'h2', title_size: 'md', header_align: 'center', title_reveal: 'words', look: 'stages', stage: 'مرحله',
			steps: [
				{ icon: 'compass', title: 'کشف و برنامه', text: 'هدف‌ها، بازار و مخاطب را بررسی می‌کنیم و نقشه‌ی راه روشنی می‌کشیم.', image: img('work-4') },
				{ icon: 'palette', title: 'طراحی و ساخت', text: 'ایده‌ها را به طرح‌های دقیق و بعد به صفحه‌های واقعی تبدیل می‌کنیم.', image: img('work-5') },
				{ icon: 'trend', title: 'بهینه‌سازی و رشد', text: 'عملکرد را دنبال می‌کنیم، راهبرد را اصلاح می‌کنیم و نتیجه را بزرگ‌تر می‌کنیم.', image: img('work-6') },
			] }),
	]),
	faqBlock(),
];

const servicePage = (slug, title, lead, image, bullets, body) => [
	L.pageHead(eyebrow('خدمت', title), title, lead),
	section({ space: 'md', gap: 40 }, [
		L.imageReveal(image, { ratio: '21-9', reveal: 'clip-up' }),
		cols({ widths: [62, 38], gap: 56, align: 'start' }, [
			[L.textEditor(body), heading({ title: 'آنچه دریافت می‌کنید', title_size: 'sm', title_tag: 'h2' }), L.features(bullets.map(([t, x, i]) => ({ icon: i, title: t, text: x })), { columns: '2', style: 'cards', layout: 'grid' })],
			[w('hm-cta', { eyebrow: '', title: 'برای پروژه‌تان\nبرنامه بگیرید', desc: 'جلسه‌ی اول رایگان است؛ نیم ساعت درباره‌ی هدف و بودجه حرف می‌زنیم.', title_tag: 'h3', title_size: 'md', header_align: 'start', title_reveal: 'words', action: 'buttons', btn1_text: 'رزرو مشاوره', btn1_link: link(bookUrl), btn1_style: 'primary', btn2_text: '', look: 'inverse', decor: '', rounded: 'yes' })],
		]),
	]),
	band({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: eyebrow('نمونه‌ها', 'پروژه‌های مرتبط'), title: 'کارهایی در همین زمینه', title_size: 'lg' }),
		w('hm-project-show', { source: 'portfolio', count: 2, look: 'grid', btn_text: 'دیدن پروژه' }),
	]),
];

const webDesign = servicePage('web-design', 'طراحی وب‌سایت', 'سایتی سریع، زیبا و فروشنده؛ از تحقیق کاربر تا انتشار و نگهداری.', 'work-1',
	[['تحقیق و معماری', 'شناخت کاربر، نقشه‌ی صفحه‌ها و مسیر خرید.', 'compass'], ['طراحی رابط', 'طراحی دقیق برای موبایل و دسکتاپ.', 'grid'], ['توسعه و سرعت', 'وردپرس و المنتور، زیر یک ثانیه.', 'bolt'], ['سئوی فنی', 'ساختار درست برای دیده شدن در گوگل.', 'search']],
	'<p>سایت شما اولین فروشنده‌ی شماست. در اخگر سایت را از نگاه مشتری می‌سازیم: چه می‌خواهد، کجا مردد می‌شود و چه چیزی او را به خرید یا تماس می‌رساند.</p><p>هر سایت با تحقیق کوتاه کاربر شروع می‌شود، با طراحی دقیق ادامه پیدا می‌کند و با آزمون سرعت و سئوی فنی به انتشار می‌رسد.</p>');
const marketing = servicePage('marketing', 'بازاریابی دیجیتال', 'کمپین‌هایی که هر تومانش قابل ردیابی است؛ از سئو تا تبلیغات و شبکه‌های اجتماعی.', 'work-2',
	[['سئو و محتوا', 'رتبه‌ی پایدار با محتوایی که خوانده می‌شود.', 'search'], ['تبلیغات کلیکی', 'گوگل و شبکه‌های تبلیغاتی ایرانی.', 'target'], ['شبکه‌های اجتماعی', 'تقویم محتوا، ویدیوی کوتاه و تبلیغات.', 'megaphone'], ['گزارش و تحلیل', 'گزارش ماهانه‌ی ساده و دقیق.', 'chart']],
	'<p>بازاریابی خوب از عدد شروع می‌شود، نه از حدس. پیش از هر تبلیغ، ردیابی کامل را راه می‌اندازیم تا بدانیم هر کانال چه می‌آورد.</p><p>بعد با یک پیام روشن و آزمون‌های کوچک، بودجه را به سمت کانال‌هایی می‌بریم که واقعاً فروش می‌آورند.</p>');
const branding = servicePage('branding', 'استراتژی و هویت برند', 'برندی با یک صدای روشن؛ از جایگاه و نام تا لوگو و راهنمای برند.', 'work-3',
	[['جایگاه‌یابی', 'برند شما در ذهن مخاطب کجا می‌نشیند.', 'target'], ['نام‌گذاری', 'نامی که گفته، پیدا و ثبت شود.', 'pen'], ['هویت بصری', 'لوگو، رنگ، تایپوگرافی و تصویر.', 'palette'], ['راهنمای برند', 'سندی که تیم هر روز به آن تکیه می‌کند.', 'book']],
	'<p>برند فقط لوگو نیست؛ قولی است که هر بار به مشتری می‌دهید. کار را با کارگاهی کوتاه با تیم شما شروع می‌کنیم تا جایگاه، مخاطب و پیام اصلی روشن شود.</p><p>بعد زبان تصویری برند را می‌سازیم و همه را در یک راهنمای کاربردی تحویل می‌دهیم.</p>');

/* ---------------- Projects, team, booking ---------------- */

const projectsPage = [
	L.pageHead(eyebrow('۰۱', 'نمونه‌کارها'), 'داستان‌هایی\n*که روایت کرده‌ایم*', 'برند، سایت و کمپین؛ هر پروژه با یک مسئله‌ی واقعی شروع شده و با عدد سنجیده شده است.'),
	section({ space: 'md', gap: 30 }, [w('hm-logo-grid', { logos: logosInk, columns: '7', columns_tablet: '4', columns_mobile: '2', look: 'soft', btn_text: '' })]),
	section({ space: 'md', gap: 40 }, [w('hm-project-show', { source: 'portfolio', count: 8, look: 'gallery', btn_text: 'دیدن پروژه' })]),
	touchBlock(),
];

const teamPage = [
	L.pageHead(eyebrow('۰۱', 'تیم'), 'آدم‌هایی که\n*پشت هر پروژه* هستند', 'طراح، استراتژیست و برنامه‌نویس؛ برای مشاوره با هر کدام می‌توانید آنلاین وقت بگیرید.'),
	section({ space: 'md', gap: 40 }, [
		w('hm-experts', { eyebrow: '', title: '', desc: '', header_align: 'start', title_tag: 'h2', title_size: 'lg', title_reveal: 'words', count: 8, groups: [], filters: '', card_style: 'card', ratio: '3/4', button: 'yes', layout: 'grid', columns: '3' }),
	]),
	band({ space: 'lg', gap: 40 }, [
		cols({ widths: [50, 50], gap: 48, align: 'center' }, [
			[L.textScrub('به *تیم اخگر* بپیوندید؛ همیشه دنبال آدم‌های کنجکاو هستیم.', { eyebrow: eyebrow('۰۲', 'همکاری'), size: 'md' }), button('ارسال رزومه', contactUrl, 'secondary')],
			[L.imageReveal('office-2', { ratio: '4-3' })],
		]),
	]),
];

const consult = [
	L.pageHead(eyebrow('۰۱', 'مشاوره'), 'یک جلسه‌ی\n*مشاوره* رزرو کنید', 'با یکی از اعضای تیم درباره‌ی برند، سایت یا کمپین‌تان حرف بزنید. جلسه‌ی اول با مدیران رایگان است.'),
	section({ space: 'md', gap: 40 }, [
		w('hm-booking', { title: 'رزرو جلسه‌ی مشاوره', intro: 'مشاور، روز و ساعت را انتخاب کنید؛ پیامک تأیید و لینک جلسه برایتان فرستاده می‌شود.', expert: '0', groups: [], note: 'yes', box: 'card' }),
	]),
	faqBlock(),
];

const pricingPage = [
	L.pageHead(eyebrow('۰۱', 'تعرفه‌ها'), 'قیمت روشن،\n*بی‌غافلگیری*', 'اشتراک ماهانه برای کار ادامه‌دار، پروژه‌ی تکی برای کار مشخص؛ هزینه را پیش از شروع می‌دانید.'),
	section({ space: 'md', gap: 40 }, [
		w('hm-pricing', {
			plans: [
				{ name: 'شروع', desc: 'برای کسب‌وکارهای تازه‌کار.', price: '۲۹', price_alt: '۲۹۰', unit: 'میلیون تومان', period: '/ ماهانه', features: 'یک درخواست هم‌زمان\nطراحی گرافیک و شبکه‌های اجتماعی\nتحویل پنج‌روزه\nگزارش ماهانه', btn_text: 'انتخاب بسته', btn_link: link(contactUrl), featured: '', badge: '' },
				{ name: 'رشد', desc: 'پرطرفدارترین بسته برای برندهای در حال رشد.', price: '۴۹', price_alt: '۴۹۰', unit: 'میلیون تومان', period: '/ ماهانه', features: 'درخواست طراحی نامحدود\nطراحی وب و تجربه‌ی کاربری\nموشن و انیمیشن\nتحویل سه‌روزه\nپشتیبانی ویژه', btn_text: 'انتخاب بسته', btn_link: link(contactUrl), featured: 'yes', badge: 'پیشنهاد ما' },
				{ name: 'شرکتی', desc: 'برای تیم‌های بزرگ و چند برند.', price: '۹۵', price_alt: '۹۵۰', unit: 'میلیون تومان', period: '/ ماهانه', features: 'تیم اختصاصی\nچند برند هم‌زمان\nجلسه‌ی هفتگی\nقرارداد سطح خدمات', btn_text: 'تماس بگیرید', btn_link: link(contactUrl), featured: '', badge: '' },
			],
			switch_off: 'ماهانه', switch_on: 'سالانه', switch_note: 'دو ماه رایگان',
		}),
	]),
	faqBlock(),
];

const contact = [
	L.pageHead(eyebrow('۰۱', 'تماس'), 'بیایید درباره‌ی\n*پروژه‌تان* حرف بزنیم', 'فرم را پر کنید یا مستقیم تماس بگیرید؛ کمتر از یک ساعت در ساعات کاری پاسخ می‌دهیم.'),
	section({ space: 'md', gap: 0 }, [
		cols({ widths: [40, 60], gap: 48, align: 'start' }, [
			[L.contactInfo([
				{ icon: 'phone', label: 'تلفن', value: '۰۲۱ ۸۸۷۷ ۶۶۵۵', link: link('tel:02188776655') },
				{ icon: 'mail', label: 'ایمیل', value: 'hello@akhgar.studio', link: link('mailto:hello@akhgar.studio') },
				{ icon: 'pin', label: 'دفتر', value: 'تهران، خیابان شریعتی، کوچه‌ی گلستان، پلاک ۱۸', link: link('') },
				{ icon: 'clock', label: 'ساعت کاری', value: 'شنبه تا چهارشنبه، ۱۰ تا ۱۸', link: link('') },
			], { map: '', map_image: '' })],
			[con({ content_width: 'full', css_classes: 'hm-scheme-inverse hm-panel', padding: pad(40, 40), flex_gap: gap(24) }, [
				heading({ eyebrow: eyebrow('۰۲', 'زمان پاسخ: کمتر از یک ساعت'), title: 'پیام بگذارید', title_size: 'sm' }),
				L.contactForm({ show_phone: 'yes', show_company: 'yes', button: 'ارسال پیام', success: 'پیامتان رسید؛ به‌زودی تماس می‌گیریم.' }),
			], true)],
		]),
	]),
	faqBlock(),
];

const faqPage = [
	L.pageHead(eyebrow('۰۱', 'پرسش‌ها'), 'پاسخ پرسش‌هایی\n*که زیاد می‌شنویم*', ''),
	faqBlock(),
	touchBlock(),
];

/* ---------------- Pages, templates, menus ---------------- */

const pages = [
	{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings() },
	{ key: 'about', title: 'درباره‌ی ما', slug: 'about', elementor: about, settings: L.pageSettings() },
	{ key: 'services', title: 'خدمات', slug: 'services', elementor: servicesPage, settings: L.pageSettings() },
	{ key: 'web-design', parent: 'services', title: 'طراحی وب‌سایت', slug: 'web-design', elementor: webDesign, settings: L.pageSettings() },
	{ key: 'marketing', parent: 'services', title: 'بازاریابی دیجیتال', slug: 'digital-marketing', elementor: marketing, settings: L.pageSettings() },
	{ key: 'branding', parent: 'services', title: 'استراتژی و هویت برند', slug: 'branding', elementor: branding, settings: L.pageSettings() },
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
		id: 'akhgar',
		order: 1,
		title: 'اخگر',
		desc: 'استودیوی خلاق برند، وب و رشد؛ پنل تیره با نوار متحرک و حلقه‌ی شبکه‌های اجتماعی، کارت‌های بنتو، خدمات پله‌ای، نمونه‌کارهای پشته‌ای، روند کار، دیوار نظرها، رزرو آنلاین مشاوره با اعضای تیم و فروشگاه محصولات دیجیتال. خاکستری مه‌آلود، مشکی و نارنجی آتشین؛ روشن و تیره.',
		kit: 'ember',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: ['woocommerce'],
		tags: ['آژانس', 'استودیو خلاق', 'رزرو آنلاین', 'فروشگاه دیجیتال'],
		pages: pages.filter((p) => p.elementor).map((p) => p.title).concat(['فروشگاه', 'مجله']),
	},
	content: {
		site: { title: 'اخگر', tagline: 'استودیوی خلاق برند، وب و رشد' },
		images, alts, terms, posts, projects, experts, products, pages,
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'اخگر — صفحه‌ی اصلی' },
			{ key: 'tpl-about', type: 'page', page: 'about', title: 'اخگر — درباره‌ی ما' },
			{ key: 'tpl-services', type: 'page', page: 'services', title: 'اخگر — خدمات' },
			{ key: 'tpl-service', type: 'page', page: 'web-design', title: 'اخگر — صفحه‌ی یک خدمت' },
			{ key: 'tpl-hero', type: 'section', page: 'home', index: 0, title: 'اخگر — قهرمان پنل تیره' },
			{ key: 'tpl-bento', type: 'section', page: 'home', index: 2, title: 'اخگر — کارت‌های بنتو' },
			{ key: 'tpl-works', type: 'section', page: 'home', index: 5, title: 'اخگر — نمونه‌کارهای پشته‌ای' },
			{ key: 'tpl-wall', type: 'section', page: 'home', index: 9, title: 'اخگر — دیوار نظرها' },
		],
		menus: [
			{
				name: 'اخگر — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'خدمات', page: 'services', children: [
						{ title: 'طراحی وب‌سایت', page: 'web-design' },
						{ title: 'بازاریابی دیجیتال', page: 'marketing' },
						{ title: 'استراتژی و هویت برند', page: 'branding' },
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
				name: 'اخگر — پابرگ', location: 'footer', items: [
					{ title: 'درباره‌ی ما', page: 'about' },
					{ title: 'خدمات', page: 'services' },
					{ title: 'نمونه‌کارها', page: 'projects' },
					{ title: 'تعرفه‌ها', page: 'pricing' },
					{ title: 'رزرو مشاوره', page: 'consult' },
					{ title: 'پرسش‌ها', page: 'faq' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 36,
			header_layout: 'split',
			header_cart: true,
			header_cta_text: 'شروع پروژه',
			header_cta_url: contactUrl,
			font_body: 'yekan-bakh',
			font_body_weight: '400',
			font_heading: 'dana',
			font_heading_weight: '800',
			booking_type: 'consulting',
			booking_page: '{{pageid:consult}}',
			booking_days: 21,
			footer_about: 'اخگر استودیوی خلاق برند، وب و رشد است؛ از ۱۳۹۸ کنار برندهای ایرانی، از استارتاپ‌های تازه تا نام‌های آشنا.',
			footer_copyright: 'تمام حقوق برای استودیو اخگر محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }, { network: 'linkedin', url: 'https://linkedin.com/' }, { network: 'x', url: 'https://x.com/' }],
			mobile_bar: true,
			mobile_bar_text: 'شروع پروژه',
			mobile_bar_url: contactUrl,
			mobile_bar_phone: '02188776655',
			magnetic: true,
			cursor: 'ring',
			sound_enabled: true,
			sound_default: false,
			sound_theme: 'soft',
			sound_volume: 25,
			seo_business_type: 'ProfessionalService',
			seo_business_phone: '02188776655',
			seo_business_city: 'تهران',
			seo_business_street: 'خیابان شریعتی، کوچه‌ی گلستان، پلاک ۱۸',
			seo_llms_intro: 'اخگر استودیوی خلاق برند، طراحی وب و بازاریابی دیجیتال در تهران است.',
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 3, pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
