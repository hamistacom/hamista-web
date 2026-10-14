/**
 * Demo: Resume — a designer and front-end developer's personal site (Studio
 * kit), after the PixelPier reference: the name set huge, roles that light up
 * word by word, selected work, awards and education as ruled rows, an endless
 * band, services, reviews and a large call to action.
 * Pages: about with experience, work, services with rates, journal, a shop
 * of design files and mentoring sessions, and contact. Light and dark.
 */
'use strict';

const L = require('../lib');
const { img, gallery, link, px, gap, w, con, section, cols, heading, button } = L;

const images = {};
[
	'portrait', 'portrait-2', 'work-1', 'work-2', 'work-3', 'work-4', 'work-5', 'work-6', 'work-7', 'studio',
	'blog-1', 'blog-2', 'blog-3', 'av-1', 'av-2', 'av-3', 'av-4',
].forEach((k) => { images[k] = 'images/' + k + '.webp'; });

const alts = {
	portrait: 'آرش کاویانی، طراح وب و توسعه‌دهنده‌ی فرانت‌اند',
	studio: 'میز کار در استودیو',
};

const contactUrl = '{{page:contact}}';
const NAME = 'آرش کاویانی';

/* ---------------- Work, posts, products ---------------- */

const terms = [
	{ key: 'pf-web', taxonomy: 'hm_portfolio_cat', name: 'وب‌سایت', slug: 'website' },
	{ key: 'pf-app', taxonomy: 'hm_portfolio_cat', name: 'اپلیکیشن', slug: 'app' },
	{ key: 'pf-brand', taxonomy: 'hm_portfolio_cat', name: 'هویت بصری', slug: 'identity' },
	{ key: 'cat-design', taxonomy: 'category', name: 'طراحی', slug: 'design' },
	{ key: 'cat-code', taxonomy: 'category', name: 'کد', slug: 'code' },
	{ key: 'pc-files', taxonomy: 'product_cat', name: 'فایل‌های طراحی', slug: 'design-files' },
	{ key: 'pc-mentor', taxonomy: 'product_cat', name: 'جلسه‌ی منتورینگ', slug: 'mentoring' },
];

const project = (key, title, slug, image, detail, cats, meta, excerpt, body) => ({
	key, title, slug, image, terms: cats, meta, excerpt,
	content: L.article(body.concat([['img', detail, '']])),
});

const projects = [
	project('p-ledger', 'داشبورد مالی «دفتر»', 'daftar-finance-dashboard', 'work-1', 'work-5', ['pf-app'],
		{ client: 'استارتاپ دفتر', year: '۱۴۰۴', services: 'طراحی رابط، سیستم طراحی، فرانت‌اند', url: '' },
		'داشبوردی که حساب‌وکتاب یک کسب‌وکار کوچک را در یک صفحه جمع می‌کند.',
		['دفتر می‌خواست حسابداری را برای صاحبان کسب‌وکارهای کوچک ساده کند. سه هفته با ده مغازه‌دار گفت‌وگو کردم و فهمیدم بیشترشان فقط دو سؤال دارند: امروز چقدر فروختم و چقدر طلب دارم.', ['ul', ['طراحی ۴۰ صفحه با سیستم طراحی', 'پیاده‌سازی با React و TypeScript', 'نسخه‌ی راست‌چین کامل']]]),
	project('p-saze', 'وب‌سایت معماری «سازه»', 'saze-architecture-site', 'work-2', 'work-6', ['pf-web'],
		{ client: 'دفتر معماری سازه', year: '۱۴۰۳', services: 'طراحی و توسعه‌ی وب', url: '' },
		'سایتی آرام که کارهای دفتر را با عکس‌های بزرگ و حرکت‌های نرم روایت می‌کند.',
		['برای دفتری که کارهایش خودشان حرف می‌زنند، سایت باید کنار برود. صفحه‌ها را با عکس‌های تمام‌عرض و متن کم ساختیم.']),
	project('p-nava', 'هویت بصری کافه «نوا»', 'nava-cafe-identity', 'work-3', 'work-7', ['pf-brand'],
		{ client: 'کافه نوا', year: '۱۴۰۳', services: 'لوگو، رنگ، منو', url: '' },
		'هویتی گرم برای کافه‌ای کوچک در محله‌ای قدیمی.',
		['از رنگ دیوارهای کاه‌گلی محله الهام گرفتم و نشانه‌ای ساختم که روی فنجان، منو و تابلو یکسان خوانده شود.']),
	project('p-raah', 'اپلیکیشن گردشگری «راه»', 'raah-travel-app', 'work-4', 'work-2', ['pf-app'],
		{ client: 'آژانس راه', year: '۱۴۰۲', services: 'تحقیق کاربر، طراحی رابط', url: '' },
		'اپی که برنامه‌ی سفر را از بلیت تا اقامت در یک جدول زمانی نشان می‌دهد.',
		['مسافرها برای هر سفر پنج اپ مختلف باز می‌کردند. یک جدول زمانی ساده همه را جمع کرد.']),
	project('p-pishkhan', 'فروشگاه آنلاین «پیشخوان»', 'pishkhan-store', 'work-7', 'work-1', ['pf-web'],
		{ client: 'فروشگاه پیشخوان', year: '۱۴۰۲', services: 'طراحی تجربه، ووکامرس', url: '' },
		'فروشگاهی سریع که خرید از موبایل را سه برابر کرد.',
		['صفحه‌ی محصول و سبد خرید را از نو طراحی کردم و سرعت را زیر یک ثانیه رساندم.']),
];

const posts = [
	{ key: 'grid', title: 'چرا هنوز روی کاغذ طراحی می‌کنم', slug: 'why-i-still-sketch-on-paper', image: 'blog-1', terms: ['cat-design'], days_ago: 4,
		excerpt: 'پیش از باز کردن فیگما، ده دقیقه با مداد؛ ارزان‌ترین آزمون هر ایده.',
		content: L.article(['هر پروژه را با چند برگ کاغذ شروع می‌کنم. کاغذ اجازه نمی‌دهد درگیر رنگ و فاصله شوم؛ فقط ساختار می‌ماند.', ['ul', ['ده دقیقه، شش طرح سریع', 'انتخاب دو طرح', 'تازه بعد فیگما']]]) },
	{ key: 'rtl', title: 'نکته‌هایی برای رابط راست‌چین که کمتر گفته می‌شوند', slug: 'rtl-interface-tips', image: 'blog-2', terms: ['cat-code'], days_ago: 12,
		excerpt: 'پیکان‌ها، اعداد، آیکن‌ها و فاصله‌ها؛ جزئیاتی که رابط فارسی را درست یا عجیب می‌کنند.',
		content: L.article(['بیشتر رابط‌های فارسی را با برعکس کردن رابط انگلیسی می‌سازند؛ اما همه‌چیز نباید برعکس شود.', ['ol', ['آیکن پخش و ساعت برعکس نمی‌شوند', 'اعداد را فارسی بنویسید اما شماره‌ی کارت را چپ‌چین', 'از ویژگی‌های منطقی CSS استفاده کنید']]]) },
	{ key: 'motion', title: 'حرکت در رابط: کم، دقیق، معنادار', slug: 'motion-in-interfaces', image: 'blog-3', terms: ['cat-design'], days_ago: 25,
		excerpt: 'هر حرکت باید به کاربر چیزی بگوید؛ وگرنه فقط وقت او را می‌گیرد.',
		content: L.article(['حرکت خوب دیده نمی‌شود؛ حس می‌شود. سه قاعده‌ای که در هر پروژه رعایت می‌کنم.', ['ul', ['کوتاه‌تر از ۴۰۰ میلی‌ثانیه', 'از جایی که کاربر نگاه می‌کند', 'برای کسانی که حرکت کمتر می‌خواهند، خاموش']]]) },
];

const product = (key, title, slug, price, sku, image, cats, excerpt, paragraphs, specs, extra = {}) => Object.assign({
	key, title, slug, price, sku, image, gallery: [], terms: cats, excerpt, stock: 999, virtual: true, downloadable: true,
	content: L.productBody(paragraphs, specs),
}, extra);

const products = [
	product('ui-kit', 'کیت رابط کاربری راست‌چین', 'rtl-ui-kit', 1900000, 'CV-KIT', 'work-1', ['pc-files'],
		'بیش از ۳۰۰ جزء آماده‌ی فیگما برای رابط‌های فارسی، با حالت روشن و تیره.',
		['همان کیتی که در پروژه‌هایم استفاده می‌کنم: دکمه، فرم، جدول، کارت و نمودار؛ همه راست‌چین و با متغیرهای رنگ.'],
		[['قالب', 'فیگما'], ['اجزا', '+۳۰۰'], ['حالت‌ها', 'روشن و تیره']], { featured: true }),
	product('portfolio-tpl', 'قالب فیگمای سایت شخصی', 'personal-site-figma-template', 900000, 'CV-TPL', 'work-2', ['pc-files'],
		'هفت صفحه‌ی آماده برای سایت رزومه و نمونه‌کار.',
		['صفحه‌ی اصلی، درباره، نمونه‌کارها، جزئیات پروژه، مقاله، فروشگاه و تماس؛ آماده برای جای‌گذاری کارهای شما.'],
		[['صفحه', '۷'], ['قالب', 'فیگما']]),
	product('mentor', 'جلسه‌ی منتورینگ یک‌ساعته', 'one-hour-mentoring', 1500000, 'CV-MEN', 'portrait-2', ['pc-mentor'],
		'بررسی نمونه‌کار، مسیر شغلی یا یک پروژه‌ی مشخص؛ آنلاین و رو در رو.',
		['یک ساعت درباره‌ی نمونه‌کار، رزومه یا مسیر یادگیری‌تان حرف می‌زنیم و یک برنامه‌ی سه‌ماهه با خودتان می‌برید.'],
		[['مدت', 'یک ساعت'], ['محل', 'آنلاین']], { downloadable: false }),
];

/* ---------------- Shared blocks ---------------- */

const AWARDS = [
	{ start: '۱۴۰۴', name: 'آوُوردز', detail: 'تقدیرنامه‌ی ویژه', link: link('') },
	{ start: '۱۴۰۳', name: 'سی‌اس‌اس وینر', detail: 'سایت ماه', link: link('') },
	{ start: '۱۴۰۱', name: 'جایزه‌ی طراحی وب ایران', detail: 'برگزیده‌ی داوران', link: link('') },
	{ start: '۱۳۹۷', name: 'هکاتون داده', detail: 'برنده و انتخاب مخاطبان', link: link('') },
];
const EDUCATION = [
	{ start: '۱۴۰۲', name: 'جاوااسکریپت و تایپ‌اسکریپت', detail: 'دوره‌ی تکمیلی آنلاین', link: link('') },
	{ start: '۱۴۰۱', name: 'CSS با فلکس‌باکس و گرید', detail: 'دوره‌ی تخصصی', link: link('') },
	{ start: '۱۳۹۹', name: 'پژوهش کاربر برای اپلیکیشن', detail: 'کارگاه بین‌المللی', link: link('') },
	{ start: '۱۳۹۷', name: 'کارشناسی ارتباط تصویری', detail: 'دانشگاه هنر تهران', link: link('') },
];
const EXPERIENCE = [
	{ start: '۱۴۰۱ — اکنون', name: 'طراح و توسعه‌دهنده‌ی مستقل', detail: 'برای استارتاپ‌ها و استودیوها', link: link('') },
	{ start: '۱۳۹۸ — ۱۴۰۱', name: 'طراح ارشد محصول', detail: 'استارتاپ مالی دفتر', link: link('') },
	{ start: '۱۳۹۶ — ۱۳۹۸', name: 'توسعه‌دهنده‌ی فرانت‌اند', detail: 'استودیو طراحی سازه', link: link('') },
];

const SERVICES = [
	{ title: 'طراحی رابط و تجربه‌ی کاربری', tags: 'تحقیق، وایرفریم، طرح نهایی', image: img('work-4'), icon: 'grid', link: link('{{page:services}}'), text: 'از گفت‌وگو با کاربر تا طرحی که برنامه‌نویس بی‌سؤال پیاده‌اش می‌کند.' },
	{ title: 'توسعه‌ی فرانت‌اند', tags: 'React، وردپرس، انیمیشن', image: img('work-1'), icon: 'code', link: link('{{page:services}}'), text: 'سایت و اپی سریع، راست‌چین و دسترس‌پذیر.' },
	{ title: 'سیستم طراحی', tags: 'توکن، اجزا، مستندات', image: img('work-2'), icon: 'layers', link: link('{{page:services}}'), text: 'زبانی مشترک برای طراح و برنامه‌نویس.' },
	{ title: 'موشن و تعامل', tags: 'میکرواینترکشن، اسکرول', image: img('work-3'), icon: 'wave', link: link('{{page:services}}'), text: 'حرکت‌هایی کوتاه که رابط را زنده می‌کنند.' },
];

const reviews = () => w('hm-testimonial-wall', {
	look: 'columns', rating_label: 'امتیاز',
	items: [
		{ quote: 'آرش فقط طراحی نمی‌کند؛ مسئله را می‌فهمد. داشبوردی که ساخت، تماس‌های پشتیبانی ما را نصف کرد.', name: 'نسیم رحیمی', role: 'مدیر محصول، دفتر', avatar: img('av-1'), rating: '5', tone: 'light' },
		{ quote: 'دقیق، خوش‌قول و با سلیقه. سایت جدید ما در هفته‌ی اول دو برابر درخواست پروژه آورد.', name: 'کامران سلیمی', role: 'مدیر، دفتر معماری سازه', avatar: img('av-2'), rating: '5', tone: 'dark' },
		{ quote: 'کدی که تحویل داد تمیز و مستند بود؛ تیم ما بی‌دردسر ادامه‌اش داد.', name: 'الهام نوری', role: 'سرپرست فنی', avatar: img('av-3'), rating: '4.9', tone: 'light' },
		{ quote: 'جلسه‌ی منتورینگ با آرش مسیر شغلی‌ام را روشن کرد. توصیه‌هایش کاملاً کاربردی بود.', name: 'رضا امینی', role: 'طراح تازه‌کار', avatar: img('av-4'), rating: '5', tone: 'accent' },
	],
});

const callToAction = () => L.cta({
	eyebrow: 'همکاری', title: 'پروژه‌ای در ذهن دارید؟\n*بیایید با هم بسازیم.*', desc: 'معمولاً ظرف یک روز کاری پاسخ می‌دهم.',
	btn1_text: 'شروع گفت‌وگو', btn1_link: link(contactUrl), btn2_text: 'hello@arash.design', btn2_link: link('mailto:hello@arash.design'),
	look: 'inverse', decor: '', rounded: '',
});

/* ---------------- Home ---------------- */

const home = [
	section({ space: 'md', gap: 24 }, [
		cols({ widths: [64, 36], gap: 40, align: 'end' }, [
			[
				w('hm-giant-text', { text: 'آرش', second: 'کاویانی', motion: 'part', look: 'solid', size: { unit: 'vw', size: 9, sizes: [] }, align: 'start', tag: 'h1' }),
				L.textScrub('طراح وب *+* توسعه‌دهنده‌ی *خلاق* فرانت‌اند', { size: 'lg' }),
			],
			[L.imageReveal('portrait', { ratio: '3-4', reveal: 'clip-up', parallax: px(0.15) })],
		]),
	]),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [45, 55], gap: 56, align: 'start' }, [
			[heading({ eyebrow: 'سلام', title: 'من *آرش کاویانی‌ام*', title_size: 'lg' })],
			[
				L.textEditor('<p>طراح دیجیتال و توسعه‌دهنده‌ی فرانت‌اند مستقل. عاشق ساختن تجربه‌هایی‌ام که فراموش نمی‌شوند: سایت‌ها و اپ‌هایی سریع، راست‌چین و دقیق، که هم زیبا هستند و هم کار می‌کنند.</p><p>نه سال است برای استارتاپ‌ها، استودیوها و برندهای ایرانی کار می‌کنم.</p>'),
				L.counters([
					{ value: 9, prefix: '', suffix: '', label: 'سال تجربه', desc: '' },
					{ value: 120, prefix: '', suffix: '+', label: 'پروژه‌ی تحویل‌شده', desc: '' },
					{ value: 14, prefix: '', suffix: '', label: 'جایزه و تقدیر', desc: '' },
				], { style: 'plain', columns: '3', columns_tablet: '3', columns_mobile: '3' }),
				button('تماس بگیرید', contactUrl),
			],
		]),
	]),
	section({ space: 'md', gap: 32 }, [
		cols({ widths: [60, 40], gap: 32, align: 'end' }, [
			[heading({ eyebrow: 'نمونه‌کارها', title: 'کارهای *برگزیده*', title_size: 'lg' })],
			[button('همه‌ی کارها', '{{page:work}}', 'secondary')],
		]),
		w('hm-project-show', { source: 'portfolio', count: 5, look: 'gallery', btn_text: 'دیدن پروژه' }),
	]),
	section({ space: 'lg', gap: 0 }, [
		cols({ widths: [50, 50], gap: 56, align: 'start' }, [
			[w('hm-rows', { title: 'جایزه‌ها', rows: AWARDS, size: 'md' })],
			[w('hm-rows', { title: 'آموزش', rows: EDUCATION, size: 'md' })],
		]),
	]),
	section({ space: 'md', gap: 0, cls: 'hm-space-bottom-0' }, [
		w('hm-giant-text', { text: 'پیکسل‌هایی با هدف · از ۱۳۹۵ ·', motion: 'marquee', look: 'outline', size: { unit: 'vw', size: 11, sizes: [] }, align: 'center', tag: 'p' }),
	]),
	section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: 'کارهایی که انجام می‌دهم', title: 'از ایده *تا کد*', title_size: 'lg' }),
		w('hm-service-list', { look: 'stagger', items: SERVICES }),
	]),
	section({ space: 'lg', gap: 40 }, [
		L.textScrub('آنچه همکارانم *می‌گویند*', { eyebrow: 'نظرها', size: 'md', align: 'center' }),
		reviews(),
	]),
	callToAction(),
];

/* ---------------- Inner pages ---------------- */

const about = [
	L.pageHead('درباره', 'طراحی که *کد می‌نویسد*', 'نه سال طراحی و توسعه برای وب؛ از کاغذ و مداد تا کد تمیز.'),
	section({ space: 'md', gap: 24 }, [
		cols({ widths: [40, 60], gap: 24 }, [[L.imageReveal('portrait-2', { ratio: '4-5' })], [L.imageReveal('studio', { ratio: '4-3' })]]),
	]),
	section({ space: 'md', gap: 32, width: 1000 }, [
		L.textScrub('باور دارم بهترین رابط، رابطی است که *دیده نمی‌شود*؛ کاربر فقط کارش را انجام می‌دهد و لبخند می‌زند.', { size: 'md' }),
	]),
	section({ space: 'md', gap: 0 }, [w('hm-rows', { title: 'سابقه‌ی کار', rows: EXPERIENCE, size: 'lg' })]),
	section({ space: 'md', gap: 0 }, [
		cols({ widths: [50, 50], gap: 56, align: 'start' }, [
			[w('hm-rows', { title: 'جایزه‌ها', rows: AWARDS })],
			[w('hm-rows', { title: 'آموزش', rows: EDUCATION })],
		]),
	]),
	callToAction(),
];

const work = [
	L.pageHead('نمونه‌کارها', 'کارهایی که *دوستشان دارم*', 'وب‌سایت، اپلیکیشن و هویت بصری؛ هر کدام با یک مسئله‌ی واقعی.'),
	section({ space: 'md', gap: 40 }, [w('hm-project-show', { source: 'portfolio', count: 12, look: 'grid', btn_text: 'دیدن پروژه' })]),
	callToAction(),
];

const services = [
	L.pageHead('خدمات', 'از ایده *تا انتشار*', 'طراحی، توسعه یا هر دو؛ پروژه‌ای یا ساعتی.'),
	section({ space: 'md', gap: 0 }, [w('hm-service-list', { look: 'numbered', items: SERVICES.map((s, i) => Object.assign({}, s, { meta_label: 'زمان‌بندی', meta_value: ['۲ تا ۶ هفته', '۳ تا ۸ هفته', '۴ هفته', '۱ تا ۲ هفته'][i] })), btn_text: 'گفت‌وگو درباره‌ی پروژه' })]),
	section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: 'نرخ همکاری', title: 'قیمت *روشن*', header_align: 'center', title_size: 'lg' }),
		w('hm-pricing', {
			plans: [
				{ name: 'ساعتی', desc: 'برای کارهای کوچک و مشاوره.', price: '۹۵۰', price_alt: '', unit: 'هزار تومان', period: '/ ساعت', features: 'حداقل چهار ساعت\nگزارش کارکرد روزانه', btn_text: 'رزرو وقت', btn_link: link(contactUrl), featured: '', badge: '' },
				{ name: 'پروژه‌ای', desc: 'قیمت ثابت برای دامنه‌ی مشخص.', price: '۸۵', price_alt: '', unit: 'میلیون تومان', period: '/ از', features: 'دامنه‌ی کار مکتوب\nدو دور بازبینی\nسه ماه پشتیبانی', btn_text: 'دریافت پیش‌فاکتور', btn_link: link(contactUrl), featured: 'yes', badge: 'پیشنهاد من' },
			],
			switch_off: '', switch_on: '',
		}),
	]),
	section({ space: 'md', gap: 32 }, [heading({ eyebrow: 'فروشگاه', title: 'فایل‌ها و *جلسه‌ها*' }), L.products({ source: 'recent', count: 3, columns: '3' })]),
];

const journal = { key: 'blog', title: 'یادداشت‌ها', slug: 'journal', content: '' };

const contact = [
	L.pageHead('تماس', 'سلام *کنیم*', 'درباره‌ی پروژه، همکاری یا فقط یک گپ؛ معمولاً ظرف یک روز پاسخ می‌دهم.'),
	section({ space: 'md', gap: 0 }, [
		cols({ widths: [40, 60], gap: 48, align: 'start' }, [
			[L.contactInfo([
				{ icon: 'mail', label: 'ایمیل', value: 'hello@arash.design', link: link('mailto:hello@arash.design') },
				{ icon: 'phone', label: 'تلفن', value: '۰۹۱۲ ۳۴۵ ۶۷۸۹', link: link('tel:09123456789') },
				{ icon: 'pin', label: 'محل کار', value: 'تهران، دورکاری برای همه‌جا', link: link('') },
			], { map: '', map_image: '' })],
			[L.contactForm({ show_phone: 'yes', show_company: 'yes', show_subject: '', button: 'ارسال پیام', success: 'پیامتان رسید؛ به‌زودی پاسخ می‌دهم.' })],
		]),
	]),
];

const pages = [
	{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings() },
	{ key: 'about', title: 'درباره', slug: 'about', elementor: about, settings: L.pageSettings() },
	{ key: 'work', title: 'نمونه‌کارها', slug: 'work', elementor: work, settings: L.pageSettings() },
	{ key: 'services', title: 'خدمات', slug: 'services', elementor: services, settings: L.pageSettings() },
	{ key: 'contact', title: 'تماس', slug: 'contact', elementor: contact, settings: L.pageSettings() },
	journal,
];

module.exports = {
	manifest: {
		id: 'cv',
		order: 6,
		title: 'رزومه',
		desc: 'سایت شخصی و رزومه‌ی طراح یا برنامه‌نویس؛ نام با حروف عظیم، نقش‌هایی که کلمه‌به‌کلمه روشن می‌شوند، نمونه‌کارها، جایزه‌ها و آموزش در ردیف‌های خط‌دار، نوار بی‌پایان، خدمات و نرخ، نظر همکاران و فروشگاه فایل‌های طراحی؛ مینیمال، روشن و تیره.',
		kit: 'studio',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: ['woocommerce'],
		tags: ['رزومه', 'شخصی', 'فریلنسر', 'نمونه‌کار'],
		pages: pages.filter((p) => p.elementor).map((p) => p.title).concat(['فروشگاه', 'یادداشت‌ها']),
	},
	content: {
		site: { title: NAME, tagline: 'طراح وب و توسعه‌دهنده‌ی فرانت‌اند' },
		images, alts, terms, posts, projects, products, pages,
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'رزومه — صفحه‌ی اصلی' },
			{ key: 'tpl-rows', type: 'section', page: 'home', index: 3, title: 'رزومه — جایزه‌ها و آموزش' },
		],
		menus: [
			{
				name: 'رزومه — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'درباره', page: 'about' },
					{ title: 'نمونه‌کارها', page: 'work' },
					{ title: 'خدمات', page: 'services' },
					{ title: 'یادداشت‌ها', page: 'blog' },
					{ title: 'فروشگاه', url: '{{shop}}' },
					{ title: 'تماس', page: 'contact' },
				],
			},
			{
				name: 'رزومه — پابرگ', location: 'footer', items: [
					{ title: 'درباره', page: 'about' },
					{ title: 'نمونه‌کارها', page: 'work' },
					{ title: 'خدمات', page: 'services' },
					{ title: 'تماس', page: 'contact' },
				],
			},
		],
		options: {
			header_layout: 'split',
			header_cart: true,
			header_cta_text: 'همکاری',
			header_cta_url: contactUrl,
			font_body: 'iransansx',
			font_body_weight: '400',
			font_heading: 'peyda',
			font_heading_weight: '800',
			footer_about: 'آرش کاویانی، طراح وب و توسعه‌دهنده‌ی فرانت‌اند مستقل در تهران.',
			footer_copyright: 'تمام حقوق محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'linkedin', url: 'https://linkedin.com/' }, { network: 'telegram', url: 'https://t.me/' }],
			magnetic: true,
			cursor: 'frame',
			preloader: 'counter',
			sound_enabled: false,
			seo_business_type: 'ProfessionalService',
			seo_llms_intro: 'سایت شخصی آرش کاویانی، طراح وب و توسعه‌دهنده‌ی فرانت‌اند.',
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 3, pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
