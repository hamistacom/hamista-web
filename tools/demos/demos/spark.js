/**
 * Demo: Spark Academy — a project-based school for product design and
 * building (Paper kit), built as a complete site: two home pages, courses,
 * learning paths, admissions and fees, mentors, student work, team courses,
 * about, FAQ, contact and the journal; six courses sold as WooCommerce
 * products.
 */
'use strict';

const L = require('../lib');
const { img, link, px, w, section, cols, heading, button, fx } = L;

const images = { logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp' };
['hero', 'studio', 'workspace', 'community'].forEach((k) => { images[k] = 'images/' + k + '.webp'; });
for (let i = 1; i <= 8; i++) { images['ui-' + i] = 'images/ui-' + i + '.webp'; images['journal-' + i] = 'images/journal-' + i + '.webp'; }
for (let i = 1; i <= 6; i++) { images['course-' + i] = 'images/course-' + i + '.webp'; images['course-' + i + '-b'] = 'images/course-' + i + '-b.webp'; }

const alts = {
	hero: 'جلد دوره‌های آکادمی جرقه، طرح مدادی یک اپ و مداد روی میز بلوط',
	studio: 'نور پنجره روی دیوار گچی استودیوی آکادمی',
	workspace: 'دو برگه طرح مدادی روی میز گردو',
	community: 'اتاق آرام استودیو با نیمکت و نور بعدازظهر',
};

const shopUrl = '{{shop}}';

/* ---------------- Shared content ---------------- */

const SHIPPED = [
	{ image: img('ui-1'), label: 'اپلیکیشن · ۱۴۰۴', title: 'نوبت‌یار', text: 'نوبت‌دهی آنلاین برای آرایشگاه‌ها؛ حالا هر روز بیش از دو هزار نوبت با آن ثبت می‌شود.', link: link('{{post:report-nobatyar}}') },
	{ image: img('ui-5'), label: 'اپلیکیشن · ۱۴۰۴', title: 'پیمانه', text: 'خرج ماهانه را بدون جدول و فرمول نشان می‌دهد. ساخته‌ی تیم چهارنفره‌ی فصل بهار.', link: link('#') },
	{ image: img('ui-3'), label: 'وب‌اپ · ۱۴۰۳', title: 'نشان', text: 'دستیار نوشتن برای کسب‌وکارهای کوچک؛ کپشن، معرفی محصول و پاسخ به پیام مشتری.', link: link('#') },
	{ image: img('ui-4'), label: 'اپلیکیشن · ۱۴۰۳', title: 'گام', text: 'عادت‌ساز ساده با یک ایده: هر روز فقط یک کار کوچک، و دیدن زنجیره‌ای که نمی‌خواهی پاره شود.', link: link('#') },
	{ image: img('ui-6'), label: 'سایت · ۱۴۰۴', title: 'سکو', text: 'صفحه‌ساز برای کسب‌وکارهای محلی که می‌خواهند در یک عصر سایت داشته باشند.', link: link('#') },
	{ image: img('ui-2'), label: 'داشبورد · ۱۴۰۴', title: 'پیشخوان فروش', text: 'گزارش فروش روزانه برای فروشگاه‌های اینترنتی، با تمرکز بر سه عددی که واقعاً مهم‌اند.', link: link('#') },
];

const QUOTES = [
	{ quote: 'قبل از جرقه سه دوره‌ی آنلاین را نیمه‌کاره رها کرده بودم. اینجا کسی منتظر پروژه‌ات است و همین فرق اصلی است.', name: 'مریم صالحی', role: 'طراح محصول در یک استارتاپ پرداخت' },
	{ quote: 'بهترین بخش دوره، جلسه‌های بازبینی با منتور بود. یاد گرفتم برای تصمیم‌هایم دلیل بیاورم، نه سلیقه.', name: 'آرش نیک‌فر', role: 'دانش‌آموخته‌ی مسیر طراحی محصول' },
	{ quote: 'برای تیم‌مان دوره‌ی تیمی گرفتیم. شش هفته بعد اولین نسخه‌ی اپ داخلی شرکت روی گوشی همه بود.', name: 'نیلوفر کاظمی', role: 'مدیر محصول، شرکت پخش' },
];

const FAQ = [
	['برای شروع به سابقه‌ی کاری یا دانش فنی نیاز دارم؟', 'نه. دوره‌های «از صفر» برای کسانی طراحی شده‌اند که فقط با کامپیوتر کار کرده‌اند. در جلسه‌ی مشاوره سطح شما را می‌سنجیم و اگر لازم باشد یک مسیر آمادگی کوتاه پیشنهاد می‌کنیم.'],
	['کلاس‌ها حضوری است یا آنلاین؟', 'هر دو. جلسه‌های اصلی هفته‌ای دو بار آنلاین و زنده برگزار می‌شوند و ضبطشان در پنل شما می‌ماند. جمعه‌ها هم استودیو برای کار گروهی و رفع اشکال باز است.'],
	['اگر از دوره راضی نبودم چه؟', 'تا پایان هفته‌ی دوم می‌توانید بدون توضیح انصراف بدهید و کل مبلغ را پس بگیرید.'],
	['امکان پرداخت قسطی هست؟', 'بله. هزینه‌ی همه‌ی دوره‌ها را می‌توانید در سه قسط ماهانه و بدون کارمزد پرداخت کنید.'],
	['بعد از پایان دوره چه می‌شود؟', 'پروژه‌ی شما در صفحه‌ی دانش‌آموختگان منتشر می‌شود، به گروه هم‌دوره‌ای‌ها می‌پیوندید و تا شش ماه برای بازبینی رزومه و تمرین مصاحبه کنار شما هستیم.'],
];

const WHY = [
	{ icon: 'cube', title: 'پروژه‌محور از روز اول', text: 'از جلسه‌ی دوم روی ایده‌ی خودتان کار می‌کنید؛ تمرین‌ها همان قطعه‌های محصول شما هستند.', meta: '۶ تا ۱۴ هفته' },
	{ icon: 'users', title: 'کلاس‌های دوازده‌نفره', text: 'گروه کوچک یعنی وقت کافی برای بازبینی کار تک‌تک شما.', meta: 'حداکثر ۱۲ نفر' },
	{ icon: 'compass', title: 'منتور همراه', text: 'هر هفته یک جلسه‌ی خصوصی با منتوری که در تیم‌های محصول ایران کار کرده است.', meta: 'جلسه‌ی هفتگی' },
	{ icon: 'rocket', title: 'روز انتشار', text: 'محصول نهایی را جلوی کارفرماها و هم‌دوره‌ای‌ها ارائه می‌کنید.', meta: 'روز ارائه' },
];

const SEASON = [
	{ marker: '۰۱', icon: 'target', title: 'انتخاب مسیر', text: 'در یک جلسه‌ی مشاوره‌ی رایگان، هدف و سطح شما را می‌سنجیم و دوره‌ی مناسب را پیشنهاد می‌کنیم.' },
	{ marker: '۰۲', icon: 'book', title: 'کلاس و تمرین', text: 'دو جلسه‌ی زنده در هفته و تمرین‌هایی که مستقیم به محصول شما وصل‌اند.' },
	{ marker: '۰۳', icon: 'users', title: 'ساختن در تیم', text: 'از هفته‌ی ششم با طراح‌ها و برنامه‌نویس‌های دوره‌های دیگر تیم می‌شوید.' },
	{ marker: '۰۴', icon: 'rocket', title: 'انتشار', text: 'محصول را منتشر می‌کنید و نتیجه را در روز ارائه نشان می‌دهید.' },
];

const PATHS = [
	{ title: 'طراحی محصول', subtitle: '۱۰ هفته · از صفر', meta: '۰۱', image: img('course-1'), panel_title: 'از مسئله تا نمونه‌ی قابل تست', panel_text: 'تحقیق کاربر، معماری اطلاعات، طراحی رابط و تست کاربردپذیری. در پایان یک نمونه‌ی کامل دارید که با کاربر واقعی آزموده شده.', chips: 'فیگما، تحقیق کاربر، نمونه‌سازی', btn_text: 'جزئیات دوره', btn_link: link('{{product:course-design}}') },
	{ title: 'توسعه‌ی وب', subtitle: '۱۴ هفته · مقدماتی تا پیشرفته', meta: '۰۲', image: img('course-2'), panel_title: 'سایتی که واقعاً بالا می‌آید', panel_text: 'HTML و CSS تا جاوااسکریپت، ری‌اکت و اتصال به API. پروژه‌ی پایانی روی دامنه‌ی خودتان منتشر می‌شود.', chips: 'جاوااسکریپت، ری‌اکت، Git', btn_text: 'جزئیات دوره', btn_link: link('{{product:course-web}}') },
	{ title: 'هوش مصنوعی کاربردی', subtitle: '۸ هفته · متوسط', meta: '۰۳', image: img('course-3'), panel_title: 'هوش مصنوعی در خدمت محصول', panel_text: 'کجا مدل زبانی به کار محصول می‌آید و کجا نه؛ طراحی تجربه، ارزیابی خروجی و ساخت یک قابلیت واقعی.', chips: 'مدل زبانی، ارزیابی، طراحی تجربه', btn_text: 'جزئیات دوره', btn_link: link('{{product:course-ai}}') },
	{ title: 'تحلیل داده', subtitle: '۸ هفته · متوسط', meta: '۰۴', image: img('course-6'), panel_title: 'تصمیم با عدد، نه با حدس', panel_text: 'SQL، داشبوردسازی و طراحی آزمایش با داده‌ی واقعی یک کسب‌وکار.', chips: 'SQL، داشبورد، آزمون A/B', btn_text: 'جزئیات دوره', btn_link: link('{{product:course-data}}') },
];

const AUDIENCE = [
	{ eyebrow: '۰۱', title: 'تازه شروع کرده‌اید', text: 'دانشجو هستید یا تازه فارغ‌التحصیل شده‌اید و می‌خواهید اولین نمونه‌کار جدی‌تان را بسازید.', points: 'دوره‌های «از صفر»\nمسیر آمادگی دوهفته‌ای\nکمک در ساخت نمونه‌کار', image: img('course-1-b'), btn_text: 'دوره‌های مقدماتی', btn_link: link(shopUrl), tone: '' },
	{ eyebrow: '۰۲', title: 'می‌خواهید مسیر شغلی‌تان را عوض کنید', text: 'در حوزه‌ی دیگری کار کرده‌اید و حالا می‌خواهید وارد تیم‌های محصول شوید.', points: 'کلاس‌های عصر و آخر هفته\nمنتور از همان صنعت\nتمرین مصاحبه', image: img('workspace'), btn_text: 'مشاوره‌ی تغییر مسیر', btn_link: link('{{page:admissions}}'), tone: 'inverse' },
	{ eyebrow: '۰۳', title: 'تیم دارید', text: 'تیم شما باید سریع‌تر محصول بسازد. دوره را با پروژه‌ی واقعی شرکت خودتان برگزار می‌کنیم.', points: 'دوره‌ی اختصاصی تیمی\nکار روی پروژه‌ی خود شرکت\nگزارش پیشرفت برای مدیران', image: img('course-5-b'), btn_text: 'دوره‌ی تیمی', btn_link: link('{{page:teams}}'), tone: 'accent' },
];

const PRICING = () => L.pricing([
	{ name: 'تک‌دوره', desc: 'یک دوره به انتخاب شما', price: 'از ۶٬۹۰۰٬۰۰۰', price_alt: 'از ۲٬۳۰۰٬۰۰۰', unit: 'تومان', period: '', features: 'جلسه‌های زنده و ضبط‌شده\nبازبینی هفتگی تمرین‌ها\nگواهی پایان دوره', btn_text: 'دیدن دوره‌ها', btn_link: link(shopUrl), featured: '', badge: '' },
	{ name: 'مسیر کامل', desc: 'دو دوره‌ی مکمل با تخفیف', price: '۲۱٬۵۰۰٬۰۰۰', price_alt: '۷٬۲۰۰٬۰۰۰', unit: 'تومان', period: '', features: 'هر آنچه در تک‌دوره هست\nجلسه‌ی خصوصی هفتگی با منتور\nشش ماه همراهی شغلی\nحضور در روز ارائه', btn_text: 'شروع مسیر', btn_link: link('{{page:admissions}}'), featured: 'yes', badge: 'انتخاب بیشتر دانشجوها' },
	{ name: 'تیمی', desc: 'برای ۵ تا ۱۵ نفر از یک شرکت', price: 'توافقی', price_alt: 'توافقی', unit: '', period: '', features: 'برنامه‌ی اختصاصی\nکار روی پروژه‌ی شرکت\nگزارش پیشرفت ماهانه', btn_text: 'هماهنگی جلسه', btn_link: link('{{page:teams}}'), featured: '', badge: '' },
], { switch_off: 'پرداخت یکجا', switch_on: 'پرداخت در سه قسط', switch_note: 'بدون کارمزد' });

const MENTORS = [
	{ icon: '', title: 'آرمان شریفی', text: 'هم‌بنیان‌گذار؛ منتور طراحی محصول' },
	{ icon: '', title: 'سارا رحیمی', text: 'هم‌بنیان‌گذار؛ منتور توسعه‌ی وب' },
	{ icon: '', title: 'بهراد مقدم', text: 'سرپرست آموزش داده' },
	{ icon: '', title: 'ترانه افشار', text: 'منتور کسب‌وکار دیجیتال' },
	{ icon: '', title: 'کاوه بهرامی', text: 'منتور هوش مصنوعی' },
	{ icon: '', title: 'نگار امینی', text: 'هماهنگ‌کننده‌ی دوره‌های تیمی' },
];

const newsletter = (title = 'هر ماه\n*یک ایمیل خوب*', desc = 'زمان شروع دوره‌های تازه، کارگاه‌های رایگان و بهترین نوشته‌های مجله؛ ماهی یک بار، نه بیشتر.') => L.cta({
	eyebrow: 'خبرنامه', title, desc,
	action: 'email', email_placeholder: 'ایمیل شما', email_button: 'عضویت', note: 'هر وقت بخواهید با یک کلیک لغو می‌شود.',
	look: 'image', image: img('studio'), decor: '', rounded: '',
});

const CONSULT_FORM = {
	need_label: 'مسیر', need_title: 'به کدام مسیر فکر می‌کنید؟', need_desc: 'اگر مطمئن نیستید، گزینه‌ی آخر را بزنید.',
	choices: [
		{ label: 'طراحی محصول', note: 'تحقیق، رابط، نمونه‌سازی', icon: 'pen' },
		{ label: 'توسعه‌ی وب', note: 'از HTML تا ری‌اکت', icon: 'code' },
		{ label: 'هوش مصنوعی کاربردی', note: 'برای محصول، نه تحقیق', icon: 'cpu' },
		{ label: 'تحلیل داده', note: 'SQL و داشبورد', icon: 'chart' },
		{ label: 'هنوز نمی‌دانم', note: 'با هم انتخاب می‌کنیم', icon: 'compass' },
	],
	multi: '',
	budget_on: 'yes', budget_label: 'سطح', budget_title: 'الان کجای کار هستید؟',
	budgets: 'از صفر شروع می‌کنم\nکمی تجربه دارم\nدر همین حوزه کار می‌کنم',
	timeline_on: 'yes', timeline_title: 'از کی می‌خواهید شروع کنید؟',
	timelines: 'همین فصل\nفصل بعد\nفقط می‌خواهم بدانم',
	contact_label: 'تماس', contact_title: 'جلسه‌ی مشاوره را با چه کسی هماهنگ کنیم؟',
	show_name: 'yes', label_name: 'نام و نام خانوادگی',
	show_phone: 'yes', label_phone: 'شماره‌ی موبایل',
	show_email: 'yes', label_email: 'ایمیل', req_email: '',
	show_company: '', show_message: 'yes', label_message: 'هر چیزی که بخواهید بدانیم', req_message: '', consent: '',
	next_text: 'مرحله‌ی بعد', back_text: 'قبلی', submit_text: 'رزرو جلسه‌ی مشاوره',
	done_title: 'درخواستتان ثبت شد',
	done_text: 'تا پایان روز کاری بعد تماس می‌گیریم تا زمان جلسه‌ی بیست‌دقیقه‌ای را هماهنگ کنیم.',
	done_btn_text: 'دیدن دوره‌ها', done_btn_link: link(shopUrl), done_btn_style: 'secondary',
	remember: 'yes', boxed: 'yes', columns: '2',
};

/* ---------------- Home ---------------- */

const home = [
	L.bleed(w('hm-hero', {
		layout: 'split', title_tag: 'h1', title_size: 'xl', header_align: 'start', title_reveal: 'words',
		eyebrow: 'آکادمی جرقه · مدرسه‌ی ساخت محصول',
		title: 'یاد بگیر، بساز،\n*منتشر کن*',
		desc: 'جرقه مدرسه‌ی ساخت محصول است. به‌جای مدرک، هر دوره با یک محصول واقعی تمام می‌شود که آدم‌ها از آن استفاده می‌کنند.',
		btn1_text: 'دوره‌های این فصل', btn1_link: link(shopUrl), btn1_style: 'primary',
		btn2_text: 'مشاوره‌ی رایگان', btn2_link: link('{{page:admissions}}'), btn2_style: 'secondary',
		stats: [
			{ value: '۱٬۲۰۰+', label: 'دانش‌آموخته' },
			{ value: '۳۴۰', label: 'محصول منتشرشده' },
			{ value: '۴٫۸', label: 'امتیاز دانشجوها از ۵' },
		],
		media_type: 'image', image: img('hero'), media_ratio: 'landscape', height: 'auto', decor: '', hint: '',
	})),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'چرا جرقه', title: 'کلاس کمتر،\n*کار واقعی* بیشتر' })],
			[L.features(WHY, { layout: 'grid', style: 'plain', columns: '2', icon_style: 'tile' })],
		]),
	]), { cards: 'cascade' }),
	section({ space: 'md', gap: 32 }, [
		L.productCarousel({ eyebrow: 'دوره‌ها', title: 'دوره‌های *این فصل*', source: 'recent', card_ratio: '3-4', card_parts: ['badges', 'hover'], more_text: 'همه‌ی دوره‌ها', more_link: link(shopUrl) }),
	]),
	section({ space: 'none', gap: 0, zoom: 'expand', zoomAmount: 0.24, zoomInner: true, zoomRadius: 6 }, [
		L.imageReveal('studio', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	fx(section({ space: 'md', gap: 32, width: 1000 }, [
		L.textScrub('سال ۱۳۹۸ از خودمان پرسیدیم چرا بیشتر کسانی که دوره می‌بینند *هیچ‌وقت چیزی نمی‌سازند*. جواب ساده بود: کسی منتظر کارشان نبود. در جرقه، یک قانون هیچ‌وقت عوض نشده: *هیچ دوره‌ای بدون انتشار تمام نمی‌شود*.', { eyebrow: 'آنچه هستیم', size: 'md' }),
	]), { tone: 'surface' }),
	section({ space: 'md', gap: 32 }, [
		heading({ eyebrow: 'برای چه کسانی', title: 'سه نقطه‌ی\n*شروع*' }),
		L.stack(AUDIENCE),
	]),
	L.hscroll({ eyebrow: 'ساخته‌ی دانشجوها', title: 'محصولاتی که\n*منتشر شده‌اند*', desc: 'هر کدام با یک طرح مدادی شروع شد.', items: SHIPPED, card_size: 'md', card_style: 'caption', scheme: '' }),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'مسیر یک فصل', title: 'از ثبت‌نام تا\n*روز انتشار*', header_align: 'center', desc: 'هر فصل چهارده هفته است و در چهار مرحله پیش می‌رود.' }),
		L.steps(SEASON, { layout: 'h', cards: 'yes' }),
	]), { tone: 'inverse' }),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'از زبان دانشجوها', title: 'آنچه *دانش‌آموخته‌ها* می‌گویند', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'مجله', title: 'تازه‌ها از *مجله‌ی جرقه*' })],
			[button('همه‌ی نوشته‌ها', '{{blog}}', 'secondary', { _flex_align_self: 'flex-end' })],
		]),
		L.posts({ count: 3, layout: 'grid', columns: '3', excerpt: 'yes' }),
	]),
	newsletter(),
];

/* ---------------- Home, second version ---------------- */

const home2 = [
	L.slider([
		{ image: img('studio'), eyebrow: 'آکادمی جرقه', title: 'هر محصول با یک\n*جرقه* شروع می‌شود', text: 'مدرسه‌ی ساخت محصول؛ کلاس‌های کوچک، منتور همراه و روز انتشار.', btn_text: 'دوره‌ها', url: shopUrl },
		{ image: img('workspace'), eyebrow: 'روش ما', title: 'اول *کاغذ*،\nبعد کد', text: 'هر ایده با یک طرح مدادی شروع می‌شود و با کاربر واقعی آزموده.', btn_text: 'مسیرهای آموزشی', url: '{{page:paths}}' },
		{ image: img('hero'), eyebrow: 'فصل پاییز', title: 'ثبت‌نام\n*باز است*', text: 'شش دوره، دوازده نفر در هر کلاس.', btn_text: 'ثبت‌نام و شهریه', url: '{{page:admissions}}' },
	]),
	section({ space: 'md', gap: 40 }, [L.tabs(PATHS, { autoplay: 7, media_side: 'start' })]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'شهریه', title: 'ساده و *شفاف*', header_align: 'center', desc: 'همه‌ی دوره‌ها را می‌توانید در سه قسط بدون کارمزد بپردازید.' }),
		PRICING(),
	]), { tone: 'surface', cards: 'cascade' }),
	section({ space: 'md', gap: 40, cards: 'cascade' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'منتورها', title: 'کسانی که\n*کنارتان* هستند' }), button('همه‌ی منتورها', '{{page:mentors}}', 'secondary')],
			[L.features(MENTORS.slice(0, 4), { layout: 'grid', style: 'plain', columns: '2', icon_style: 'plain' })],
		]),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *ثبت‌نام*' }), button('همه‌ی پرسش‌ها', '{{page:faq}}', 'secondary')],
			[L.faq(FAQ.slice(0, 4), { style: 'lines' })],
		]),
	]), { tone: 'surface' }),
	newsletter(),
];

/* ---------------- Courses and paths ---------------- */

const courses = [
	L.pageHead('دوره‌ها', 'شش دوره،\n*یک قانون*', 'هر دوره با یک محصول منتشرشده تمام می‌شود. کلاس‌ها آنلاین و زنده‌اند و جمعه‌ها استودیو برای کار گروهی باز است.'),
	section({ space: 'md', gap: 32 }, [
		L.productTabs([
			{ label: 'همه', source: 'recent', category: [], count: 6 },
			{ label: 'طراحی', source: 'recent', category: ['design-courses'], count: 6 },
			{ label: 'برنامه‌نویسی', source: 'recent', category: ['development-courses'], count: 6 },
			{ label: 'کسب‌وکار و داده', source: 'recent', category: ['business-courses'], count: 6 },
		], { title: '', card_ratio: '3-4', card_parts: ['badges', 'hover'], columns: '3' }),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'در همه‌ی دوره‌ها', title: 'آنچه *همیشه* هست', header_align: 'center' }),
		L.features(WHY, { layout: 'grid', style: 'cards', columns: '4', icon_style: 'tile' }),
	]), { tone: 'surface', cards: 'cascade' }),
	newsletter(),
];

const paths = [
	L.pageHead('مسیرهای آموزشی', 'مسیرت را\n*انتخاب کن*', 'چهار مسیر اصلی؛ هر کدام با یک دوره‌ی پایه و یک دوره‌ی تکمیلی. اگر بین دو مسیر مانده‌اید، جلسه‌ی مشاوره رایگان است.'),
	section({ space: 'md', gap: 40 }, [L.tabs(PATHS, { autoplay: 0, media_side: 'start' })]),
	section({ space: 'md', gap: 32 }, [
		heading({ eyebrow: 'برای چه کسانی', title: 'سه نقطه‌ی *شروع*' }),
		L.stack(AUDIENCE),
	]),
	fx(section({ space: 'md', gap: 40, width: 980 }, [
		heading({ eyebrow: 'مشاوره‌ی رایگان', title: 'مسیرتان را\n*با هم پیدا کنیم*', header_align: 'center' }),
		L.leadForm(CONSULT_FORM),
	]), { tone: 'surface' }),
];

/* ---------------- Admissions ---------------- */

const admissions = [
	L.pageHead('ثبت‌نام و شهریه', 'از ثبت‌نام\n*تا روز انتشار*', 'هر فصل چهارده هفته است. ثبت‌نام با یک جلسه‌ی مشاوره‌ی بیست‌دقیقه‌ای شروع می‌شود؛ رایگان و بی‌تعهد.'),
	fx(section({ space: 'md', gap: 40 }, [L.steps(SEASON, { layout: 'h', cards: 'yes' })]), { cards: 'cascade' }),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'شهریه', title: 'ساده و *شفاف*', header_align: 'center', desc: 'همه‌ی دوره‌ها را می‌توانید در سه قسط بدون کارمزد بپردازید.' }),
		PRICING(),
	]), { tone: 'surface', cards: 'cascade' }),
	section({ space: 'md', gap: 40, width: 980 }, [
		heading({ eyebrow: 'مشاوره‌ی رایگان', title: 'جلسه‌ی *مشاوره* را رزرو کنید', header_align: 'center' }),
		L.leadForm(CONSULT_FORM),
	]),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *ثبت‌نام*' })],
			[L.faq(FAQ, { style: 'lines' })],
		]),
	]),
];

/* ---------------- Mentors and student work ---------------- */

const mentors = [
	L.pageHead('منتورها', 'کسانی که\n*کنارتان* هستند', 'همه‌ی منتورهای جرقه خودشان محصول ساخته‌اند و هنوز در تیم‌های محصول کار می‌کنند. هر هفته یک جلسه‌ی خصوصی با منتورتان دارید.'),
	section({ space: 'md', gap: 40, cards: 'cascade' }, [L.features(MENTORS, { layout: 'grid', style: 'plain', columns: '3', icon_style: 'plain' })]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'از زبان دانشجوها', title: 'جلسه‌های *بازبینی*', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]), { tone: 'surface' }),
	newsletter('منتور\n*می‌شوید*؟', 'اگر در تیم محصول کار می‌کنید و دوست دارید هفته‌ای چند ساعت کنار دانشجوها باشید، در خبرنامه‌ی همکاران عضو شوید.'),
];

const work = [
	L.pageHead('ساخته‌ی دانشجوها', 'محصولاتی که\n*منتشر شده‌اند*', 'هر فصل ده‌ها محصول در روز ارائه معرفی می‌شوند. چند نمونه از پروژه‌های فصل‌های اخیر:'),
	L.hscroll({ eyebrow: '', title: '', desc: '', items: SHIPPED, card_size: 'lg', card_style: 'caption', scheme: '' }),
	fx(section({ space: 'md', gap: 40 }, [
		L.features(SHIPPED.map((s) => ({ icon: '', title: s.title, text: s.text, meta: s.label })), { layout: 'grid', style: 'plain', columns: '3', icon_style: 'plain' }),
	]), { cards: 'cascade' }),
	section({ space: 'sm', gap: 0 }, [
		L.con({ content_width: 'full', css_classes: 'hm-scheme-inverse', padding: L.pad(48, 48, 40) }, [
			L.counters([
				{ value: 340, label: 'محصول منتشرشده' },
				{ value: 1200, suffix: '+', label: 'دانش‌آموخته' },
				{ value: 71, suffix: '٪', label: 'جذب در شش ماه' },
				{ value: 14, label: 'فصل برگزارشده' },
			], { style: 'plain', columns: '4' }),
		], true),
	]),
	newsletter(),
];

/* ---------------- Teams ---------------- */

const TEAM_FORM = Object.assign({}, CONSULT_FORM, {
	need_label: 'نیاز', need_title: 'تیمتان به چه چیزی نیاز دارد؟', multi: 'yes',
	budget_title: 'چند نفر هستند؟', budget_label: 'اندازه', budgets: '۵ تا ۸ نفر\n۹ تا ۱۵ نفر\nبیش از ۱۵ نفر',
	show_company: 'yes', label_company: 'نام شرکت', req_company: 'yes',
	submit_text: 'درخواست دوره‌ی تیمی', done_text: 'ظرف دو روز کاری تماس می‌گیریم تا جلسه‌ی آشنایی با تیم را هماهنگ کنیم.',
});

const teams = [
	L.pageHead('دوره‌ی تیمی', 'تیمتان را\n*سریع‌تر* کنید', 'دوره‌های اختصاصی برای تیم‌های محصول شرکت‌ها؛ با پروژه‌ی واقعی خود شرکت و گزارش پیشرفت برای مدیران.'),
	section({ space: 'md', gap: 40, cards: 'cascade' }, [
		L.features([
			{ icon: 'target', title: 'پروژه‌ی خود شرکت', text: 'تمرین‌ها روی محصولی است که تیم واقعاً می‌سازد.', meta: 'اختصاصی' },
			{ icon: 'clock', title: 'زمان‌بندی منعطف', text: 'جلسه‌ها در ساعت کاری، حضوری یا آنلاین.', meta: '۶ تا ۱۰ هفته' },
			{ icon: 'chart', title: 'گزارش پیشرفت', text: 'هر ماه یک گزارش مکتوب برای مدیران.', meta: 'ماهانه' },
			{ icon: 'shield', title: 'محرمانگی', text: 'قرارداد عدم افشا پیش از شروع.', meta: 'NDA' },
		], { layout: 'grid', style: 'cards', columns: '4', icon_style: 'tile' }),
	]),
	section({ space: 'md', gap: 40, width: 980 }, [
		heading({ eyebrow: 'درخواست', title: 'دوره‌ی تیمی را *شروع کنیم*', header_align: 'center' }),
		L.leadForm(TEAM_FORM),
	]),
];

/* ---------------- About, FAQ, contact ---------------- */

const about = [
	L.pageHead('درباره‌ی جرقه', 'مدرسه‌ای که با\n*یک سؤال* شروع شد', 'سال ۱۳۹۸ چند طراح و برنامه‌نویس از خودمان پرسیدیم چرا بیشتر کسانی که دوره می‌بینند هیچ‌وقت چیزی نمی‌سازند. جواب ساده بود: کسی منتظر کارشان نبود.'),
	section({ space: 'sm', zoom: 'expand', zoomAmount: 0.2, zoomInner: true, zoomRadius: 6 }, [
		L.imageReveal('community', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'چیزهایی که برایمان مهم است', title: 'چهار *اصل* ساده' }),
		L.features([
			{ icon: 'target', title: 'خروجی، نه حضور', text: 'ساعت حضور را نمی‌شماریم؛ چیزی را می‌شماریم که ساخته‌اید.' },
			{ icon: 'users', title: 'گروه کوچک', text: 'هیچ کلاسی بیشتر از دوازده نفر ندارد.' },
			{ icon: 'shield', title: 'صداقت درباره‌ی بازار کار', text: 'آمار جذب را همان‌طور که هست منتشر می‌کنیم.' },
			{ icon: 'heart', title: 'جامعه بعد از دوره', text: 'دانش‌آموخته‌ها هنوز به تازه‌واردها کمک می‌کنند.' },
		], { layout: 'grid', style: 'cards', columns: '4', icon_style: 'tile' }),
	]), { tone: 'surface', cards: 'flip' }),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'مسیر ما', title: 'از هشت نفر\n*تا یک جامعه*' })],
			[L.steps([
				{ marker: '۱۳۹۸', title: 'اولین فصل', text: 'هشت دانشجو، یک اتاق کرایه‌ای و سه پروژه که هر سه منتشر شدند.' },
				{ marker: '۱۴۰۰', title: 'کلاس‌های آنلاین', text: 'دانشجوهایی از ۲۲ شهر به ما پیوستند.' },
				{ marker: '۱۴۰۲', title: 'استودیوی تازه', text: 'هفت روز هفته باز برای کار گروهی.' },
				{ marker: '۱۴۰۴', title: 'دوره‌های تیمی', text: 'اولین دوره‌های اختصاصی برای تیم‌های محصول.' },
			], { layout: 'v', cards: '' })],
		]),
	]),
	newsletter('بیایید\n*آشنا شویم*', 'یک سر به استودیو بزنید یا از خبرهای آکادمی باخبر شوید.'),
];

const faqPage = [
	L.pageHead('پرسش‌های متداول', 'پیش از *ثبت‌نام*', 'جواب سؤالتان این‌جا نیست؟ یک پیام بفرستید؛ معمولاً همان روز جواب می‌دهیم.'),
	section({ space: 'md', gap: 56 }, [
		cols({ widths: [30, 70], gap: 64 }, [
			[heading({ eyebrow: 'دوره‌ها', title: 'ثبت‌نام و *پرداخت*', title_size: 'md' })],
			[L.faq(FAQ, { style: 'lines' })],
		]),
	]),
];

const contact = [
	L.pageHead('تماس', 'درباره‌ی *ایده‌تان*\nحرف بزنیم', 'برای مشاوره‌ی انتخاب دوره، دوره‌ی تیمی یا هر سؤال دیگری پیام بدهید.'),
	section({ space: 'md' }, [
		cols({ widths: [40, 60], gap: 64 }, [
			[L.contactInfo([
				{ icon: 'pin', label: 'استودیو', value: 'تهران، خیابان ولیعصر، بالاتر از پارک ساعی، کوچه‌ی نیلوفر، پلاک ۱۲', link: link('') },
				{ icon: 'phone', label: 'تلفن', value: '۰۲۱-۹۱۰۰۴۵۶۰', link: link('tel:+982191004560') },
				{ icon: 'mail', label: 'ایمیل', value: 'hello@jaraghe.academy', link: link('mailto:hello@jaraghe.academy') },
				{ icon: 'clock', label: 'ساعت کاری', value: 'شنبه تا چهارشنبه ۹ تا ۱۸، پنج‌شنبه‌ها تا ۱۴', link: link('') },
			])],
			[L.contactForm({ show_phone: 'yes', label_phone: 'شماره‌ی موبایل', show_subject: 'yes', label_subject: 'موضوع', label_name: 'نام و نام خانوادگی', label_email: 'ایمیل', label_message: 'پیام شما', button: 'ارسال پیام', success: 'پیامتان رسید. در روزهای کاری تا چند ساعت بعد جواب می‌دهیم.' })],
		]),
	]),
];

/* ---------------- Journal ---------------- */

const terms = [
	{ key: 'cat-design', taxonomy: 'category', name: 'طراحی', slug: 'design' },
	{ key: 'cat-dev', taxonomy: 'category', name: 'توسعه', slug: 'development' },
	{ key: 'cat-career', taxonomy: 'category', name: 'مسیر شغلی', slug: 'career' },
	{ key: 'cat-report', taxonomy: 'category', name: 'گزارش پروژه', slug: 'project-report' },
	{ key: 'pcat-design', taxonomy: 'product_cat', name: 'طراحی', slug: 'design-courses', image: 'course-1', description: 'طراحی محصول و دیزاین سیستم.' },
	{ key: 'pcat-dev', taxonomy: 'product_cat', name: 'برنامه‌نویسی', slug: 'development-courses', image: 'course-2', description: 'توسعه‌ی وب و هوش مصنوعی کاربردی.' },
	{ key: 'pcat-business', taxonomy: 'product_cat', name: 'کسب‌وکار و داده', slug: 'business-courses', image: 'course-6', description: 'کسب‌وکار دیجیتال و تحلیل داده.' },
];

const posts = [
	{
		key: 'ship-in-six-weeks', title: 'چطور اولین محصولتان را در شش هفته منتشر کنید', slug: 'ship-your-first-product', image: 'journal-1', terms: ['cat-design'], days_ago: 2,
		excerpt: 'شش هفته کم به نظر می‌رسد، تا وقتی که بدانید دقیقاً چه چیزی را نباید بسازید.',
		content: L.article([
			'بیشتر محصولاتی که هیچ‌وقت منتشر نمی‌شوند، قربانی یک اشتباه مشترک‌اند: تیم سعی می‌کند همه‌چیز را در نسخه‌ی اول جا بدهد. شش هفته برای ساختن «همه‌چیز» کم است، اما برای ساختن یک چیز درست کاملاً کافی است.',
			['h', 'هفته‌ی اول: فقط با آدم‌ها حرف بزنید'],
			'پیش از باز کردن فیگما، با پنج نفر از کسانی که فکر می‌کنید محصولتان را می‌خواهند حرف بزنید. از آن‌ها نپرسید «اگر چنین اپی بود استفاده می‌کردید؟»؛ بپرسید آخرین بار که این مشکل را داشتند چه کردند.',
			['h', 'هفته‌ی دوم و سوم: یک مسیر، نه ده قابلیت'],
			'از دل گفت‌وگوها، مهم‌ترین کاری را که کاربر می‌خواهد انجام دهد پیدا کنید و فقط همان مسیر را طراحی کنید. بقیه را در فهرستی به اسم «بعداً» بنویسید و فعلاً سراغش نروید.',
			['ul', ['یک صفحه‌ی ورود ساده', 'همان یک کار اصلی، از ابتدا تا انتها', 'یک راه برای اینکه کاربر بازخورد بدهد']],
			['h', 'هفته‌ی چهارم و پنجم: ساختن'],
			'در این دو هفته هر روز چیزی قابل نمایش داشته باشید، حتی اگر ناقص باشد. محصولی که هر روز دیده می‌شود، کمتر در جزئیات بی‌اهمیت گم می‌شود.',
			['q', 'نسخه‌ی اولی که از آن خجالت نمی‌کشید، احتمالاً خیلی دیر منتشر شده است.'],
			['h', 'هفته‌ی ششم: انتشار برای بیست نفر'],
			'لازم نیست برای انتشار سر و صدا کنید. محصول را به بیست نفر بدهید، کنارشان بنشینید و نگاه کنید. آنچه در این هفته یاد می‌گیرید، از هر جلسه‌ی برنامه‌ریزی ارزشمندتر است.',
		]),
	},
	{
		key: 'designing-for-persian', title: 'طراحی برای فارسی: نکته‌هایی که در منابع انگلیسی پیدا نمی‌کنید', slug: 'designing-for-persian', image: 'journal-6', terms: ['cat-design'], days_ago: 6,
		excerpt: 'راست‌چین کردن رابط کاربری فقط برعکس کردن جهت نیست. از اعداد تا آیکون‌ها، چند نکته که معمولاً جا می‌افتد.',
		content: L.article([
			'وقتی رابطی را که برای انگلیسی طراحی شده فارسی می‌کنیم، معمولاً به برعکس کردن جهت صفحه بسنده می‌کنیم. اما تجربه‌ی خوب فارسی چیزهای بیشتری می‌خواهد.',
			['h', 'آیکون‌هایی که جهت دارند'],
			'فلش «بعدی» در فارسی به چپ اشاره می‌کند، اما آیکون پخش ویدیو یا لوگوی برندها نباید برعکس شوند. فهرستی از آیکون‌های جهت‌دار محصولتان داشته باشید و یکی‌یکی تصمیم بگیرید.',
			['h', 'اعداد و شماره‌ها'],
			'شماره‌ی موبایل، کد تخفیف و شماره‌ی کارت همیشه چپ‌به‌راست خوانده می‌شوند، حتی در متن فارسی. این فیلدها را جداگانه چپ‌چین کنید و ورودی ارقام فارسی را هم بپذیرید.',
			['ul', ['کاربر ممکن است با کیبورد فارسی عدد وارد کند؛ آن را به لاتین تبدیل کنید.', 'جداکننده‌ی هزارگان فارسی «٬» است، نه ویرگول.', 'تاریخ شمسی را با فرمت آشنا نمایش دهید: ۱۲ مهر ۱۴۰۵.']],
			['h', 'فاصله‌ی سطرها'],
			'حروف فارسی دندانه و نقطه‌های زیادی دارند و در فاصله‌ی سطر کم به هم می‌چسبند. برای متن بدنه حداقل ۱٫۸ برابر اندازه‌ی قلم را در نظر بگیرید.',
			['q', 'نیم‌فاصله کوچک‌ترین جزء تایپوگرافی فارسی است، اما نبودنش از دور دیده می‌شود.'],
			'در نهایت، متن‌ها را با آدم‌های واقعی بخوانید. ترجمه‌ی دقیق همیشه طبیعی‌ترین جمله نیست.',
		]),
	},
	{
		key: 'portfolio-vs-resume', title: 'نمونه‌کار یا رزومه؟ آنچه کارفرماها واقعاً نگاه می‌کنند', slug: 'portfolio-vs-resume', image: 'journal-4', terms: ['cat-career'], days_ago: 11,
		excerpt: 'با شش مدیر استخدام حرف زدیم. هیچ‌کدام از نمونه‌کارهای بی‌نقص استقبال نکردند.',
		content: L.article([
			'پیش از نوشتن این مطلب با شش مدیر استخدام در تیم‌های محصول حرف زدیم. سؤالمان ساده بود: وقتی پرونده‌ی یک طراح یا برنامه‌نویس تازه‌کار را باز می‌کنید، دنبال چه هستید؟',
			['h', 'فرایند، مهم‌تر از نتیجه'],
			'تقریباً همه یک چیز گفتند: تصویر نهایی زیبا را همه دارند. آنچه کمیاب است، توضیح این است که چرا آن تصمیم گرفته شد و چه چیزی در میانه‌ی راه عوض شد.',
			['h', 'سه پروژه کافی است'],
			'نمونه‌کاری با سه پروژه‌ی عمیق، از نمونه‌کاری با دوازده تصویر بی‌توضیح قوی‌تر است. برای هر پروژه بنویسید مسئله چه بود، شما دقیقاً چه کردید و نتیجه چه شد.',
			['ol', ['مسئله و آدم‌هایی که با آن درگیر بودند', 'تصمیم‌های کلیدی و گزینه‌هایی که کنار گذاشتید', 'نتیجه، حتی اگر کوچک باشد']],
			['h', 'رزومه هنوز لازم است'],
			'رزومه جای فهرست مهارت‌ها نیست؛ نقشه‌ای است که خواننده را به بهترین پروژه‌هایتان می‌رساند. یک صفحه، با لینک مستقیم به همان سه پروژه.',
		]),
	},
	{
		key: 'report-nobatyar', title: 'از ایده تا اولین کاربر: گزارش پروژه‌ی نوبت‌یار', slug: 'nobatyar-project-report', image: 'journal-3', terms: ['cat-report'], days_ago: 15,
		excerpt: 'تیم چهارنفره‌ی فصل پاییز چطور در چهارده هفته یک اپ نوبت‌دهی ساخت که حالا هر روز استفاده می‌شود.',
		content: L.article([
			'نوبت‌یار پروژه‌ی پایانی چهار دانشجوی فصل پاییز بود: دو طراح، یک برنامه‌نویس و یک دانشجوی مسیر کسب‌وکار. ایده از تجربه‌ی یکی از اعضای تیم آمد که مادرش آرایشگاه دارد و روزی بیست تماس تلفنی برای نوبت جواب می‌دهد.',
			['img', 'ui-1', 'صفحه‌ی نوبت‌های امروز در نسخه‌ی اول نوبت‌یار'],
			['h', 'آنچه یاد گرفتند'],
			'تیم ابتدا فکر می‌کرد مشکل اصلی، رزرو آنلاین است. اما در گفت‌وگو با آرایشگرها فهمیدند مشکل بزرگ‌تر، نوبت‌هایی است که مشتری فراموش می‌کند. برای همین اولین قابلیت جدی محصول، پیامک یادآوری شد.',
			['ul', ['۱۲ گفت‌وگو با صاحبان آرایشگاه در هفته‌ی اول', 'سه بار بازطراحی صفحه‌ی ثبت نوبت', 'انتشار برای ۹ آرایشگاه در هفته‌ی دوازدهم']],
			['q', 'بعد از دو هفته استفاده، تلفن آرایشگاه دیگر مدام زنگ نمی‌زند. همین برای ما کافی بود.', 'صاحب یکی از آرایشگاه‌های آزمایشی'],
			'امروز نوبت‌یار به‌عنوان یک محصول مستقل ادامه می‌دهد و دو نفر از اعضای تیم تمام‌وقت روی آن کار می‌کنند.',
		]),
	},
	{
		key: 'speed-checklist', title: 'سرعت سایت را جدی بگیرید: چک‌لیست ده‌دقیقه‌ای', slug: 'website-speed-checklist', image: 'journal-8', terms: ['cat-dev'], days_ago: 21,
		excerpt: 'بیشتر سایت‌های کند به ابزار پیچیده نیاز ندارند؛ به ده دقیقه وقت و این فهرست.',
		content: L.article([
			'کاربر ایرانی اغلب با اینترنت موبایل و سرعت نامطمئن سایت شما را باز می‌کند. هر ثانیه‌ی اضافه در بارگذاری، یعنی بخشی از بازدیدکننده‌ها پیش از دیدن صفحه رفته‌اند.',
			['h', 'ده دقیقه، هشت مورد'],
			['ol', ['تصاویر را با فرمت WebP و در اندازه‌ی واقعی نمایش بارگذاری کنید.', 'فونت‌ها را روی سرور خودتان نگه دارید و فقط وزن‌های لازم را بارگذاری کنید.', 'اسکریپت‌های شخص ثالث را یکی‌یکی بررسی کنید؛ هر کدام هزینه دارد.', 'تصاویر پایین صفحه را با تأخیر بارگذاری کنید.', 'از کش صفحه استفاده کنید.', 'CSS و JS استفاده‌نشده را حذف کنید.', 'اندازه‌ی تصویر اصلی بالای صفحه را از قبل مشخص کنید تا صفحه نپرد.', 'سایت را روی یک گوشی معمولی و اینترنت موبایل امتحان کنید، نه فقط روی لپ‌تاپ خودتان.']],
			['h', 'اندازه بگیرید، بعد تصمیم بگیرید'],
			'پیش از هر تغییری عدد فعلی را یادداشت کنید. بهینه‌سازی بدون اندازه‌گیری، فقط حدس است.',
		]),
	},
	{
		key: 'deep-focus', title: 'تمرکز عمیق در روزهای شلوغ', slug: 'deep-focus-on-busy-days', image: 'journal-5', terms: ['cat-career'], days_ago: 28,
		excerpt: 'سه عادت کوچک که دانشجوهای موفق ما در طول دوره به آن رسیدند.',
		content: L.article([
			'بیشتر دانشجوهای ما در کنار دوره کار یا درس دارند. آنچه آن‌هایی را که پروژه را به سرانجام می‌رسانند از بقیه جدا می‌کند، استعداد نیست؛ چند عادت ساده است.',
			['h', 'یک بلوک، هر روز'],
			'حتی چهل‌وپنج دقیقه‌ی بی‌وقفه در روز، از یک روز کامل پراکنده مفیدتر است. زمانش را ثابت نگه دارید تا تصمیم گرفتن درباره‌اش انرژی نگیرد.',
			['h', 'کار بعدی را دیروز بنویسید'],
			'آخر هر جلسه‌ی کار، یک جمله بنویسید: «فردا با این شروع می‌کنم». شروع کردن سخت‌ترین بخش است و این جمله آن را آسان می‌کند.',
			['h', 'اعلان‌ها را خاموش کنید، نه دنیا را'],
			'لازم نیست از همه‌جا ناپدید شوید. فقط در همان بلوک تمرکز، گوشی را در اتاق دیگری بگذارید.',
		]),
	},
];

/* ---------------- Shop ---------------- */

const COURSE_SPECS = (weeks, level, sessions) => [['مدت', weeks + ' هفته'], ['سطح', level], ['جلسه‌ها', sessions], ['شیوه‌ی برگزاری', 'آنلاین زنده + استودیو'], ['گواهی', 'دارد']];

const products = [
	{ key: 'course-design', title: 'دوره‌ی طراحی محصول', slug: 'product-design-course', price: 12800000, sku: 'HS-PD-01', image: 'course-1', gallery: ['course-1-b', 'ui-1'], terms: ['pcat-design'], virtual: true, featured: true,
		excerpt: 'از تحقیق کاربر تا نمونه‌ی قابل تست؛ ده هفته کار روی ایده‌ی خودتان با منتور همراه.',
		content: L.productBody(['در این دوره یاد می‌گیرید چطور یک مسئله‌ی واقعی را بشناسید، راه‌حل را طراحی کنید و آن را با کاربر واقعی بیازمایید. تمرین‌ها همه بخشی از پروژه‌ی خود شما هستند.', 'در پایان دوره یک نمونه‌ی کامل در فیگما، گزارش تست کاربردپذیری و یک پروژه‌ی آماده برای نمونه‌کار دارید.'], COURSE_SPECS('۱۰', 'از صفر', '۲۰ جلسه‌ی زنده')) },
	{ key: 'course-web', title: 'دوره‌ی توسعه‌ی وب', slug: 'web-development-course', price: 18500000, sale_price: 15900000, sku: 'HS-WD-02', image: 'course-2', gallery: ['course-2-b', 'ui-6'], terms: ['pcat-dev'], virtual: true, featured: true,
		excerpt: 'HTML و CSS تا ری‌اکت و اتصال به API؛ پروژه‌ی پایانی روی دامنه‌ی خودتان منتشر می‌شود.',
		content: L.productBody(['دوره از پایه شروع می‌شود و قدم‌به‌قدم به ساخت یک وب‌اپ کامل می‌رسد. هر هفته یک بخش از محصول نهایی را می‌سازید و منتور کدتان را بازبینی می‌کند.', 'کار با Git، نوشتن کد خوانا و منتشر کردن روی سرور واقعی بخشی از دوره است، نه ضمیمه‌ی آن.'], COURSE_SPECS('۱۴', 'مقدماتی تا پیشرفته', '۲۸ جلسه‌ی زنده')) },
	{ key: 'course-ai', title: 'دوره‌ی هوش مصنوعی کاربردی', slug: 'applied-ai-course', price: 9800000, sku: 'HS-AI-03', image: 'course-3', gallery: ['course-3-b', 'ui-3'], terms: ['pcat-dev'], virtual: true, featured: true,
		excerpt: 'کجا مدل‌های زبانی به کار محصول می‌آیند و کجا نه؛ با ساخت یک قابلیت واقعی.',
		content: L.productBody(['این دوره برای طراح‌ها، برنامه‌نویس‌ها و مدیران محصولی است که می‌خواهند هوش مصنوعی را درست و به‌جا در محصولشان به کار ببرند.', 'یاد می‌گیرید خروجی مدل را ارزیابی کنید، تجربه‌ی کاربر را برای خطاهای احتمالی طراحی کنید و هزینه را کنترل کنید.'], COURSE_SPECS('۸', 'متوسط', '۱۶ جلسه‌ی زنده')) },
	{ key: 'course-business', title: 'دوره‌ی کسب‌وکار دیجیتال', slug: 'digital-business-course', price: 6900000, sku: 'HS-DB-04', image: 'course-4', gallery: ['course-4-b', 'ui-5'], terms: ['pcat-business'], virtual: true,
		excerpt: 'مدل درآمد، قیمت‌گذاری و جذب اولین مشتری‌ها برای محصولات دیجیتال.',
		content: L.productBody(['برای کسانی که محصول دارند یا در حال ساختن‌اند و می‌خواهند بدانند چطور از آن درآمد داشته باشند.', 'در شش هفته مدل کسب‌وکار، قیمت‌گذاری و برنامه‌ی جذب صد مشتری اول را برای محصول خودتان می‌نویسید.'], COURSE_SPECS('۶', 'از صفر', '۱۲ جلسه‌ی زنده')) },
	{ key: 'course-system', title: 'دوره‌ی دیزاین سیستم', slug: 'design-system-course', price: 8400000, sku: 'HS-DS-05', image: 'course-5', gallery: ['course-5-b', 'ui-7'], terms: ['pcat-design'], virtual: true,
		excerpt: 'ساخت کتابخانه‌ی اجزای رابط و مستندسازی آن برای تیم‌های در حال رشد.',
		content: L.productBody(['وقتی محصول بزرگ می‌شود، طراحی بدون سیستم کند و ناهماهنگ می‌شود. در این دوره یک دیزاین سیستم کوچک اما کامل می‌سازید.', 'توکن‌ها، اجزا، مستندات و هماهنگی با برنامه‌نویس‌ها، همه با مثال‌های واقعی از محصولات ایرانی.'], COURSE_SPECS('۶', 'پیشرفته', '۱۲ جلسه‌ی زنده')) },
	{ key: 'course-data', title: 'دوره‌ی تحلیل داده', slug: 'data-analysis-course', price: 10200000, sku: 'HS-DA-06', image: 'course-6', gallery: ['course-6-b', 'ui-2'], terms: ['pcat-business'], virtual: true,
		excerpt: 'SQL، داشبوردسازی و طراحی آزمایش با داده‌ی واقعی یک کسب‌وکار.',
		content: L.productBody(['تصمیم‌های محصول باید بر پایه‌ی داده گرفته شوند. در این دوره از نوشتن اولین کوئری تا طراحی آزمون A/B را تمرین می‌کنید.', 'پروژه‌ی پایانی، تحلیل داده‌ی واقعی یکی از کسب‌وکارهای همکار است که به مدیرانش ارائه می‌دهید.'], COURSE_SPECS('۸', 'متوسط', '۱۶ جلسه‌ی زنده')) },
];

/* ---------------- Package ---------------- */


const pages = [
	{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings() },
	{ key: 'home-2', title: 'خانه — نسخه‌ی دوم', slug: 'home-2', elementor: home2, settings: L.pageSettings({ header: 'transparent-light' }) },
	{ key: 'courses', title: 'دوره‌ها', slug: 'courses', elementor: courses, settings: L.pageSettings() },
	{ key: 'paths', title: 'مسیرهای آموزشی', slug: 'learning-paths', elementor: paths, settings: L.pageSettings() },
	{ key: 'admissions', title: 'ثبت‌نام و شهریه', slug: 'admissions', elementor: admissions, settings: L.pageSettings() },
	{ key: 'mentors', title: 'منتورها', slug: 'mentors', elementor: mentors, settings: L.pageSettings() },
	{ key: 'work', title: 'ساخته‌ی دانشجوها', slug: 'student-work', elementor: work, settings: L.pageSettings() },
	{ key: 'teams', title: 'دوره‌ی تیمی', slug: 'for-teams', elementor: teams, settings: L.pageSettings() },
	{ key: 'about', title: 'درباره‌ی جرقه', slug: 'about', elementor: about, settings: L.pageSettings() },
	{ key: 'faq', title: 'پرسش‌های متداول', slug: 'faq', elementor: faqPage, settings: L.pageSettings() },
	{ key: 'contact', title: 'تماس', slug: 'contact', elementor: contact, settings: L.pageSettings() },
	{ key: 'blog', title: 'مجله', slug: 'journal', content: '' },
];

module.exports = {
	manifest: {
		id: 'spark',
		order: 1,
		title: 'جرقه',
		desc: 'آکادمی آنلاین ساخت محصول؛ سایت کامل با فروش دوره: دوره‌ها، مسیرهای آموزشی، ثبت‌نام و شهریه با فرم مشاوره، منتورها، ساخته‌ی دانشجوها، دوره‌ی تیمی و مجله. کاغذی، گرافیتی و کبالتی.',
		kit: 'paper',
		thumb: 'thumb.webp',
		required: ['elementor', 'woocommerce'],
		recommended: [],
		tags: ['آموزشی', 'فروش دوره', 'آکادمی'],
		pages: pages.filter((p) => p.elementor).map((p) => p.title).concat(['دوره‌ها (فروشگاه)', 'مجله']),
	},
	content: {
		site: { title: 'جرقه', tagline: 'مدرسه‌ی ساخت محصول' },
		images, alts, terms, posts, products, pages,
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'جرقه — صفحه‌ی اصلی' },
			{ key: 'tpl-home-2', type: 'page', page: 'home-2', title: 'جرقه — صفحه‌ی اصلی، نسخه‌ی دوم' },
			{ key: 'tpl-admissions', type: 'page', page: 'admissions', title: 'جرقه — ثبت‌نام و شهریه' },
			{ key: 'tpl-paths', type: 'page', page: 'paths', title: 'جرقه — مسیرهای آموزشی' },
			{ key: 'tpl-stack', type: 'section', page: 'home', index: 6, title: 'جرقه — مخاطبان (کارت‌های پشته‌ای)' },
			{ key: 'tpl-season', type: 'section', page: 'home', index: 8, title: 'جرقه — مسیر یک فصل' },
			{ key: 'tpl-pricing', type: 'section', page: 'home-2', index: 2, title: 'جرقه — شهریه با پرداخت قسطی' },
		],
		menus: [
			{
				name: 'جرقه — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'دوره‌ها', page: 'courses', children: [
						{ title: 'همه‌ی دوره‌ها', url: '{{shop}}' },
						{ title: 'مسیرهای آموزشی', page: 'paths' },
						{ title: 'دوره‌ی تیمی', page: 'teams' },
					] },
					{ title: 'ثبت‌نام', page: 'admissions' },
					{ title: 'منتورها', page: 'mentors' },
					{ title: 'پروژه‌ها', page: 'work' },
					{ title: 'مجله', page: 'blog' },
					{ title: 'آکادمی', page: 'about', children: [
						{ title: 'درباره‌ی جرقه', page: 'about' },
						{ title: 'پرسش‌های متداول', page: 'faq' },
						{ title: 'تماس', page: 'contact' },
					] },
				],
			},
			{
				name: 'جرقه — پابرگ', location: 'footer', items: [
					{ title: 'دوره‌ها', page: 'courses' },
					{ title: 'ثبت‌نام و شهریه', page: 'admissions' },
					{ title: 'دوره‌ی تیمی', page: 'teams' },
					{ title: 'پرسش‌های متداول', page: 'faq' },
					{ title: 'تماس', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 36,
			header_layout: 'split',
			header_cart: true,
			header_cta_text: 'مشاوره‌ی رایگان',
			header_cta_url: '{{page:admissions}}',
			font_body: 'iranyekan',
			font_heading: 'doran',
			font_heading_weight: '500',
			footer_about: 'جرقه مدرسه‌ی ساخت محصول است؛ کلاس‌های کوچک، منتور همراه و دوره‌هایی که با انتشار یک محصول واقعی تمام می‌شوند.',
			footer_copyright: 'تمام حقوق برای آکادمی جرقه محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }, { network: 'linkedin', url: 'https://linkedin.com/' }],
			mobile_bar: true,
			mobile_bar_text: 'دوره‌ها',
			mobile_bar_url: '{{shop}}',
			mobile_bar_phone: '02191004560',
			magnetic: true,
			cursor: 'dot',
			sound_enabled: true,
			sound_default: true,
			sound_theme: 'soft',
			sound_volume: 30,
			sound_hover: false,
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 3, pages: { shop: 'همه‌ی دوره‌ها', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
