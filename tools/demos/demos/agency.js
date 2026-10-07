/**
 * Demo: Tapesh — a brand and growth studio (Studio kit), built as a complete
 * agency site: two home pages, services, selected work, packages sold online,
 * a three-step free audit, about, FAQ, contact and notes; six packages.
 */
'use strict';

const L = require('../lib');
const { img, link, px, w, section, cols, heading, button, fx } = L;

const images = { logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp', hero: 'images/hero.webp', showreel: 'images/showreel.webp', dashboard: 'images/dashboard.webp' };
for (let i = 1; i <= 6; i++) { images['work-' + i] = 'images/work-' + i + '.webp'; images['work-' + i + '-b'] = 'images/work-' + i + '-b.webp'; images['product-' + i] = 'images/product-' + i + '.webp'; images['journal-' + i] = 'images/journal-' + i + '.webp'; }
for (let i = 1; i <= 4; i++) { images['social-' + i] = 'images/social-' + i + '.webp'; }

const alts = {
	hero: 'سربرگ، کارت ویزیت و نمونه‌رنگ‌های چند برند روی میز بتنی استودیو',
	dashboard: 'گزارش هفتگی چاپی با نمودار هزینه‌ی هر سفارش، کنار خودکار و فنجان',
	showreel: 'سه پوستر برند در کنار هم روی میز بتنی',
	'work-1': 'هویت بصری کافه‌ی ری: سربرگ، کارت ویزیت و رنگ‌ها', 'work-2': 'هویت بصری سفرنو', 'work-3': 'هویت بصری لیان',
	'work-4': 'هویت بصری کلینیک آرا', 'work-5': 'هویت بصری بیمه‌یار', 'work-6': 'هویت بصری نان‌آور',
};

/* ---------------- Shared ---------------- */

const CLIENTS = ['کافه‌ی ری', 'سفرنو', 'لیان', 'کلینیک پوست آرا', 'بیمه‌یار', 'نان‌آور', 'دکوران', 'ورزش‌پلاس', 'کتاب‌نو', 'آریا کالا'];

const WORK = [
	{ image: img('work-1'), label: 'شبکه‌های اجتماعی', title: 'کافه‌ی ری', text: 'از ۴ هزار به ۶۸ هزار دنبال‌کننده‌ی واقعی در هشت ماه و صف شلوغ آخر هفته‌ها.', link: link('{{post:case-cafe-rey}}') },
	{ image: img('work-2'), label: 'تبلیغات کلیکی', title: 'سفرنو', text: 'هزینه‌ی هر رزرو ۴۱٪ کمتر شد؛ با بازطراحی کمپین‌ها و صفحه‌های فرود.', link: link('{{post:case-safarno}}') },
	{ image: img('work-3'), label: 'فروشگاه اینترنتی', title: 'لیان', text: 'نرخ تبدیل فروشگاه از ۰٫۹ به ۲٫۴ درصد رسید، بدون افزایش بودجه‌ی تبلیغات.', link: link('#') },
	{ image: img('work-4'), label: 'سئو', title: 'کلینیک پوست آرا', text: 'سه برابر شدن مراجعه از گوگل با محتوای تخصصی و سئوی محلی.', link: link('{{post:case-ara-clinic}}') },
	{ image: img('work-5'), label: 'معرفی محصول', title: 'بیمه‌یار', text: 'کمپین معرفی اپ با ۱۲۰ هزار نصب در ماه اول و هزینه‌ی جذب مشخص.', link: link('#') },
	{ image: img('work-6'), label: 'برندینگ', title: 'نان‌آور', text: 'هویت بصری تازه برای ۱۴ شعبه، از لوگو تا بسته‌بندی و تابلوی مغازه.', link: link('#') },
];

const QUOTES = [
	{ quote: 'اولین آژانسی بود که به‌جای لایک، گزارش فروش برایمان فرستاد. بعد از سه ماه هزینه‌ی هر رزرو تقریباً نصف شد.', name: 'کامران اسدی', role: 'مدیر بازاریابی سفرنو' },
	{ quote: 'تیم تپش قبل از هر کاری یک هفته کنار ما در کافه نشست تا مشتری‌ها را بشناسد. نتیجه‌اش را در صف آخر هفته می‌بینیم.', name: 'شیرین مهدوی', role: 'هم‌بنیان‌گذار کافه‌ی ری' },
	{ quote: 'داشبورد هفتگی‌شان را مدیرعامل ما هم می‌خواند. شفافیت عددها برایمان از هر چیزی مهم‌تر بود.', name: 'دکتر رضا آرامش', role: 'مدیر کلینیک پوست آرا' },
];

const FAQ = [
	['قرارداد بلندمدت لازم است؟', 'نه. قراردادها ماهانه‌اند و با یک ماه اطلاع قبلی تمام می‌شوند. اولین قرارداد را سه‌ماهه پیشنهاد می‌کنیم چون معمولاً همین زمان برای دیدن نتیجه‌ی قابل اتکا لازم است.'],
	['از کجا بفهمم کار نتیجه داده است؟', 'پیش از شروع، دو یا سه عدد هدف را با هم تعیین می‌کنیم؛ مثلاً هزینه‌ی هر سفارش یا تعداد تماس. هر هفته همین عددها را در داشبورد می‌بینید، نه فقط آمار بازدید و لایک.'],
	['با بودجه‌ی تبلیغات کم هم کار می‌کنید؟', 'بله، اگر هدف با بودجه بخواند. در جلسه‌ی ممیزی صادقانه می‌گوییم با این بودجه چه نتیجه‌ای واقع‌بینانه است؛ گاهی پیشنهادمان این است که فعلاً فقط روی سئو یا محتوا کار کنید.'],
	['مالکیت حساب‌های تبلیغاتی و محتوا با کیست؟', 'با شما. همه‌ی حساب‌ها به نام کسب‌وکار شما ساخته می‌شوند و ما فقط دسترسی مدیریت داریم. اگر روزی همکاری تمام شود، همه‌چیز سر جای خودش می‌ماند.'],
	['چقدر طول می‌کشد تا نتیجه ببینم؟', 'تبلیغات کلیکی معمولاً از هفته‌ی دوم عدد قابل اندازه‌گیری دارد؛ سئو و برندینگ سه تا شش ماه زمان می‌خواهند. زمان‌بندی دقیق را در پیشنهاد مکتوب می‌نویسیم.'],
];

const LEAD = {
	need_label: 'نیاز شما',
	need_title: 'روی چه چیزی کار کنیم؟',
	need_desc: 'هر چند گزینه که لازم است انتخاب کنید.',
	choices: [
		{ label: 'سئو و محتوا', note: 'دیده شدن در گوگل', icon: 'search' },
		{ label: 'تبلیغات کلیکی', note: 'گوگل ادز و شبکه‌های نمایشی', icon: 'target' },
		{ label: 'شبکه‌های اجتماعی', note: 'اینستاگرام، تلگرام و لینکدین', icon: 'instagram' },
		{ label: 'هویت بصری', note: 'لوگو، رنگ و لحن برند', icon: 'palette' },
		{ label: 'سایت و صفحه‌ی فرود', note: 'طراحی برای تبدیل', icon: 'globe' },
		{ label: 'هنوز نمی‌دانم', note: 'با هم پیدا می‌کنیم', icon: 'compass' },
	],
	multi: 'yes',
	budget_on: 'yes',
	budget_label: 'بودجه',
	budget_title: 'بودجه‌ی ماهانه‌ی بازاریابی‌تان حدوداً چقدر است؟',
	budgets: 'کمتر از ۳۰ میلیون تومان\n۳۰ تا ۸۰ میلیون تومان\n۸۰ تا ۲۰۰ میلیون تومان\nبیش از ۲۰۰ میلیون تومان\nهنوز مشخص نیست',
	timeline_on: 'yes',
	timeline_title: 'از کی می‌خواهید شروع کنیم؟',
	timelines: 'همین هفته\nتا یک ماه آینده\nفقط می‌خواهم مشورت بگیرم',
	contact_label: 'تماس',
	contact_title: 'نتیجه‌ی ممیزی را برای چه کسی بفرستیم؟',
	show_name: 'yes', label_name: 'نام و نام خانوادگی',
	show_phone: 'yes', label_phone: 'شماره‌ی موبایل',
	show_email: 'yes', label_email: 'ایمیل', req_email: '',
	show_company: 'yes', label_company: 'نام کسب‌وکار یا آدرس سایت', req_company: 'yes',
	show_message: '', consent: '',
	next_text: 'مرحله‌ی بعد', back_text: 'قبلی', submit_text: 'دریافت ممیزی رایگان',
	done_title: 'درخواستتان ثبت شد',
	done_text: 'تا دو ساعت کاری آینده یکی از مشاوران ما تماس می‌گیرد تا زمان جلسه‌ی ممیزی را هماهنگ کند. تا آن موقع، نمونه‌کارهای مشابه کسب‌وکار شما را ببینید.',
	done_btn_text: 'دیدن نمونه‌کارها', done_btn_link: link('{{page:work}}'), done_btn_style: 'secondary',
	remember: 'yes', boxed: 'yes', columns: '2',
};

const SERVICE_TABS = [
	{ title: 'سئو و محتوا', subtitle: 'دیده شدن پایدار', meta: '۰۱', image: img('work-4'), panel_title: 'جایگاه اول، با محتوایی که واقعاً خوانده می‌شود', panel_text: 'سئوی فنی، تحقیق کلمات کلیدی، نوشتن و بهینه‌سازی محتوا و لینک‌سازی سالم. هر ماه گزارش رتبه‌ها و صفحه‌هایی که فروش آورده‌اند.', chips: 'سئوی فنی، محتوا، سئوی محلی', btn_text: 'جزئیات خدمت', btn_link: link('{{page:services}}') },
	{ title: 'تبلیغات کلیکی', subtitle: 'نتیجه از هفته‌ی دوم', meta: '۰۲', image: img('work-2'), panel_title: 'هر تومان، قابل پیگیری', panel_text: 'راه‌اندازی و مدیریت کمپین‌های گوگل ادز و شبکه‌های تبلیغاتی ایرانی، با ردیابی تبدیل از کلیک تا سفارش.', chips: 'گوگل ادز، تبلیغات همسان، ریتارگتینگ', btn_text: 'جزئیات خدمت', btn_link: link('{{page:services}}') },
	{ title: 'شبکه‌های اجتماعی', subtitle: 'گفت‌وگو، نه فقط پست', meta: '۰۳', image: img('work-1'), panel_title: 'صفحه‌ای که مخاطب منتظرش است', panel_text: 'تقویم محتوای ماهانه، عکاسی و ویدیوی کوتاه، مدیریت دایرکت و همکاری با اینفلوئنسرها.', chips: 'اینستاگرام، ریلز، اینفلوئنسر', btn_text: 'جزئیات خدمت', btn_link: link('{{page:services}}') },
	{ title: 'برندینگ', subtitle: 'شخصیتی که به خاطر می‌ماند', meta: '۰۴', image: img('work-6'), panel_title: 'از لوگو تا لحن', panel_text: 'تحقیق بازار، جایگاه‌یابی، طراحی هویت بصری و راهنمای برند؛ تا هر چیزی که منتشر می‌کنید از یک برند واحد بیاید.', chips: 'هویت بصری، لحن برند، بسته‌بندی', btn_text: 'جزئیات خدمت', btn_link: link('{{page:services}}') },
];

const CASES = [
	{ eyebrow: 'کافه‌ی ری · شبکه‌های اجتماعی', title: '۶۸ هزار دنبال‌کننده‌ی واقعی', text: 'به‌جای مسابقه و فالوور خریدنی، روی آدم‌های محله و داستان‌های پشت پیشخوان تمرکز کردیم.', points: 'رشد ۱۶ برابری در هشت ماه\n۳۲٪ فروش آخر هفته از اینستاگرام\nسه همکاری با کافه‌گردهای محلی', image: img('work-1'), btn_text: 'خواندن داستان', btn_link: link('{{post:case-cafe-rey}}'), tone: '' },
	{ eyebrow: 'سفرنو · تبلیغات کلیکی', title: 'هزینه‌ی هر رزرو ۴۱٪ کمتر', text: 'کمپین‌ها را بر اساس سود هر مسیر سفر بازچینی کردیم و صفحه‌های فرود را برای موبایل از نو ساختیم.', points: 'ردیابی کامل از کلیک تا رزرو\n۱۸ صفحه‌ی فرود اختصاصی\nبودجه‌ی ثابت، رزرو بیشتر', image: img('work-2'), btn_text: 'خواندن داستان', btn_link: link('{{post:case-safarno}}'), tone: 'inverse' },
	{ eyebrow: 'کلینیک پوست آرا · سئو', title: 'سه برابر مراجعه از گوگل', text: 'محتوای تخصصی با بازبینی پزشک و سئوی محلی برای سه شعبه، بدون یک ریال تبلیغ.', points: '۲۱۰ کلمه‌ی کلیدی در صفحه‌ی اول\nرشد ۳ برابری نوبت آنلاین\nامتیاز ۴٫۹ در نقشه‌ها', image: img('work-4'), btn_text: 'خواندن داستان', btn_link: link('{{post:case-ara-clinic}}'), tone: 'accent' },
];

const PROCESS = [
	{ marker: '۰۱', icon: 'search', title: 'ممیزی رایگان', text: 'یک جلسه‌ی ۴۵ دقیقه‌ای و گزارش مکتوب سه فرصت سریع.' },
	{ marker: '۰۲', icon: 'target', title: 'پیشنهاد مکتوب', text: 'هدف‌ها، کانال‌ها، بودجه و زمان‌بندی، روی یک صفحه.' },
	{ marker: '۰۳', icon: 'rocket', title: 'راه‌اندازی', text: 'دسترسی‌ها، ردیابی تبدیل و داشبورد در هفته‌ی اول.' },
	{ marker: '۰۴', icon: 'chart', title: 'گزارش هفتگی', text: 'هر دوشنبه: چه کار کرد، چه نکرد، قدم بعدی.' },
];

const PLANS = () => L.pricing([
	{ name: 'شروع', desc: 'یک کانال، برای کسب‌وکارهای کوچک', price: '۱۸٬۰۰۰٬۰۰۰', price_alt: '۱۶٬۲۰۰٬۰۰۰', unit: 'تومان', period: 'ماهانه', features: 'یک کانال به انتخاب شما\nگزارش ماهانه\nجلسه‌ی ماهانه', btn_text: 'شروع با ممیزی', btn_link: link('{{page:audit}}'), featured: '', badge: '' },
	{ name: 'رشد', desc: 'سه کانال، با گزارش هفتگی', price: '۴۵٬۰۰۰٬۰۰۰', price_alt: '۴۰٬۵۰۰٬۰۰۰', unit: 'تومان', period: 'ماهانه', features: 'سئو، تبلیغات و شبکه‌های اجتماعی\nداشبورد و گزارش هفتگی\nجلسه‌ی هفتگی نیم‌ساعته\nمدیر حساب اختصاصی', btn_text: 'شروع با ممیزی', btn_link: link('{{page:audit}}'), featured: 'yes', badge: 'انتخاب بیشتر برندها' },
	{ name: 'برند', desc: 'پروژه‌ی هویت بصری', price: 'از ۳۵٬۰۰۰٬۰۰۰', price_alt: 'از ۳۵٬۰۰۰٬۰۰۰', unit: 'تومان', period: 'پروژه‌ای', features: 'جایگاه‌یابی و لحن\nلوگو، رنگ و تایپ\nراهنمای برند', btn_text: 'گفت‌وگو درباره‌ی برند', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
], { switch_off: 'پرداخت ماهانه', switch_on: 'قرارداد سه‌ماهه', switch_note: '۱۰٪ تخفیف' });

const auditCta = (title = 'نوبت\n*برند شما*ست', desc = 'در جلسه‌ی ممیزی رایگان، سه فرصت رشد سریع را مکتوب تحویل می‌گیرید؛ حتی اگر با ما کار نکنید.') => L.cta({
	eyebrow: 'ممیزی رایگان', title, desc,
	btn1_text: 'دریافت ممیزی رایگان', btn1_link: link('{{page:audit}}'), btn2_text: 'نمونه‌کارها', btn2_link: link('{{page:work}}'),
	look: 'image', image: img('hero'), decor: '', rounded: '', note: '',
});

/* ---------------- Home ---------------- */

const home = [
	L.bleed(w('hm-hero', {
		layout: 'split', title_tag: 'h1', title_size: 'xl', header_align: 'start', title_reveal: 'words',
		eyebrow: 'تپش · استودیوی برند و رشد',
		title: 'برندهایی که\n*دیده می‌شوند*،\nرشدی که شمرده می‌شود',
		desc: 'سئو، تبلیغات، شبکه‌های اجتماعی و هویت بصری برای کسب‌وکارهایی که می‌خواهند نتیجه را در گزارش فروش ببینند، نه فقط در تعداد لایک.',
		btn1_text: 'ممیزی رایگان', btn1_link: link('{{page:audit}}'), btn1_style: 'primary',
		btn2_text: 'نمونه‌کارها', btn2_link: link('{{page:work}}'), btn2_style: 'secondary',
		stats: [
			{ value: '۴۲', label: 'کمپین در یک سال' },
			{ value: '۳٫۲×', label: 'میانگین بازگشت تبلیغات' },
			{ value: '۹۴٪', label: 'تمدید قرارداد' },
		],
		media_type: 'image', image: img('hero'), media_ratio: 'landscape', height: 'auto', decor: '', hint: '',
	})),
	L.marquee(CLIENTS, { look: 'muted', size: 'sm', separator: 'dot', speed: px(40), bordered: 'yes' }),
	section({ space: 'md', gap: 40 }, [L.tabs(SERVICE_TABS, { autoplay: 7, media_side: 'start' })]),
	section({ space: 'none', gap: 0, zoom: 'expand', zoomAmount: 0.24, zoomInner: true, zoomRadius: 2 }, [
		L.imageReveal('showreel', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	fx(section({ space: 'md', gap: 32, width: 1000 }, [
		L.textScrub('هر کاری با *یک عدد هدف* شروع می‌شود و هر هفته *همان عدد* را گزارش می‌کنیم: هزینه‌ی هر سفارش، تعداد تماس یا رزرو. اگر عدد تکان نخورد، کار را عوض می‌کنیم، نه گزارش را.', { eyebrow: 'روش ما', size: 'md' }),
	]), { tone: 'surface' }),
	section({ space: 'md', gap: 32 }, [
		heading({ eyebrow: 'نمونه‌کارها', title: 'سه داستان،\n*سه عدد*' }),
		L.stack(CASES),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64, align: 'center' }, [
			[heading({ eyebrow: 'در یک سال', title: 'عددهایی که\n*ساختیم*' })],
			[L.counters([
				{ value: 42, label: 'کمپین' },
				{ value: 3.2, suffix: '×', label: 'بازگشت تبلیغات' },
				{ value: 210, label: 'کلمه در صفحه‌ی اول' },
				{ value: 94, suffix: '٪', label: 'تمدید قرارداد' },
			], { style: 'plain', columns: '2' })],
		]),
	]), { tone: 'inverse' }),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'همکاری', title: 'چهار قدم تا\n*اولین گزارش*', header_align: 'center' }),
		L.steps(PROCESS, { layout: 'h', cards: 'yes' }),
	]),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'از زبان مشتری‌ها', title: 'نتیجه را *آن‌ها* تعریف می‌کنند', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'تعرفه‌ها', title: 'قیمت روشن،\n*بدون قرارداد بلندمدت*', header_align: 'center' }),
		PLANS(),
	]), { tone: 'surface', cards: 'cascade' }),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پیش از تصمیم', title: 'سؤال‌هایی که\n*همه* می‌پرسند' }), button('همه‌ی پرسش‌ها', '{{page:faq}}', 'secondary')],
			[L.faq(FAQ.slice(0, 4), { style: 'lines' })],
		]),
	]),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'یادداشت‌ها', title: 'آنچه این هفته\n*یاد گرفتیم*' })],
			[button('همه‌ی یادداشت‌ها', '{{blog}}', 'secondary', { _flex_align_self: 'flex-end' })],
		]),
		L.posts({ count: 3, layout: 'grid', columns: '3', excerpt: 'yes' }),
	]),
	auditCta(),
];

/* ---------------- Home, second version ---------------- */

const home2 = [
	L.slider([
		{ image: img('hero'), eyebrow: 'تپش', title: 'برند،\n*بعد رشد*', text: 'استودیوی برند و رشد؛ از هویت بصری تا گزارش هفتگی فروش.', btn_text: 'نمونه‌کارها', url: '{{page:work}}' },
		{ image: img('dashboard'), eyebrow: 'گزارش هفتگی', title: 'عددها\n*هر دوشنبه*', text: 'یک صفحه: چه کار کرد، چه نکرد، قدم بعدی.', btn_text: 'ممیزی رایگان', url: '{{page:audit}}' },
		{ image: img('showreel'), eyebrow: 'برندینگ', title: 'از لوگو\n*تا لحن*', text: 'هویت‌هایی که روی میز و روی صفحه، یک صدا دارند.', btn_text: 'خدمات', url: '{{page:services}}' },
	]),
	L.hscroll({ eyebrow: 'نمونه‌کارها', title: 'پروژه‌هایی که\n*عدد* دارند', desc: '', items: WORK, card_size: 'md', card_style: 'caption', scheme: '' }),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'خدمات', title: 'یک تیم،\n*همه‌ی کانال‌ها*', header_align: 'center' }),
		L.features([
			{ icon: 'search', title: 'سئو و محتوا', text: 'سئوی فنی، محتوای تخصصی و سئوی محلی.', meta: 'ماهانه' },
			{ icon: 'target', title: 'تبلیغات کلیکی', text: 'گوگل ادز و شبکه‌های نمایشی با ردیابی تبدیل.', meta: 'ماهانه' },
			{ icon: 'instagram', title: 'شبکه‌های اجتماعی', text: 'تقویم محتوا، ریلز و مدیریت دایرکت.', meta: 'ماهانه' },
			{ icon: 'palette', title: 'برندینگ', text: 'جایگاه‌یابی، هویت بصری و راهنمای برند.', meta: 'پروژه‌ای' },
		], { layout: 'grid', style: 'cards', columns: '4', icon_style: 'tile' }),
	]), { cards: 'cascade' }),
	section({ space: 'md', gap: 32 }, [
		L.productCarousel({ eyebrow: 'بسته‌ها', title: 'خرید *آنلاین*', source: 'recent', count: 6, card_ratio: '1-1', card_parts: ['badges', 'hover'], more_text: 'همه‌ی بسته‌ها', more_link: link('{{shop}}') }),
	]),
	section({ space: 'md', gap: 40 }, [L.testimonials(QUOTES, { layout: 'grid', columns: '3' })]),
	auditCta(),
];

/* ---------------- Services ---------------- */

const services = [
	L.pageHead('خدمات', 'هر کانالی که\n*فروش* می‌سازد', 'سئو، تبلیغات، شبکه‌های اجتماعی، برندینگ، سایت و ایمیل؛ هر کدام با یک عدد هدف و گزارش هفتگی.'),
	section({ space: 'md', gap: 40 }, [L.tabs(SERVICE_TABS, { autoplay: 0, media_side: 'start' })]),
	fx(section({ space: 'md', gap: 40 }, [
		L.features([
			{ icon: 'search', title: 'سئو و محتوا', text: 'سئوی فنی، تحقیق کلمات کلیدی، تولید محتوای تخصصی و سئوی محلی.', meta: 'از ۲۸ میلیون تومان در ماه' },
			{ icon: 'target', title: 'تبلیغات کلیکی', text: 'گوگل ادز، تبلیغات همسان و ریتارگتینگ، با ردیابی تبدیل.', meta: 'از ۲۲ میلیون تومان در ماه' },
			{ icon: 'instagram', title: 'شبکه‌های اجتماعی', text: 'تقویم محتوا، تولید ریلز، مدیریت دایرکت و همکاری با اینفلوئنسرها.', meta: 'از ۱۸ میلیون تومان در ماه' },
			{ icon: 'palette', title: 'برندینگ', text: 'جایگاه‌یابی، هویت بصری، لحن برند و راهنمای استفاده.', meta: 'از ۳۵ میلیون تومان' },
			{ icon: 'globe', title: 'سایت و صفحه‌ی فرود', text: 'صفحه‌هایی که برای تبدیل ساخته شده‌اند، با تست مداوم.', meta: 'پروژه‌ای' },
			{ icon: 'mail', title: 'ایمیل مارکتینگ', text: 'خبرنامه و ایمیل‌های خودکار سبد خرید و بازگشت مشتری.', meta: 'از ۹ میلیون تومان در ماه' },
		], { layout: 'grid', style: 'cards', columns: '3', icon_style: 'tile' }),
	]), { tone: 'surface', cards: 'cascade' }),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'همکاری', title: 'چهار قدم تا *اولین گزارش*', header_align: 'center' }),
		L.steps(PROCESS, { layout: 'h', cards: 'yes' }),
	]),
	fx(section({ space: 'md', gap: 48 }, [
		cols({ widths: [50, 50], gap: 72, align: 'center' }, [
			[heading({ eyebrow: 'گزارش هفتگی', title: 'عددها را *هر هفته*\nمی‌بینید', desc: 'هر دوشنبه یک خلاصه‌ی یک‌صفحه‌ای: هزینه‌ی هر سفارش به تفکیک کانال، روند هفتگی و قدم بعدی.' })],
			[fx(L.imageReveal('dashboard', { ratio: '4-3', reveal: 'none', parallax: px(0) }), { zoom: 'in', zoomAmount: 0.1, zoomInner: true })],
		]),
	]), { tone: 'inverse' }),
	auditCta(),
];

/* ---------------- Work ---------------- */

const workPage = [
	L.pageHead('نمونه‌کارها', 'پروژه‌هایی که\n*عدد* دارند', 'هر پروژه با یک هدف قابل اندازه‌گیری شروع شده و نتیجه‌اش را همان‌طور که بوده گزارش کرده‌ایم.'),
	section({ space: 'md', gap: 32 }, [L.stack(CASES)]),
	L.hscroll({ eyebrow: 'همه‌ی پروژه‌ها', title: 'شش برند،\n*شش داستان*', desc: '', items: WORK, card_size: 'md', card_style: 'caption', scheme: '' }),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [50, 50], gap: 24 }, [
			[L.imageReveal('work-5-b', { ratio: '1-1', reveal: 'none', parallax: px(0) })],
			[L.imageReveal('work-6-b', { ratio: '1-1', reveal: 'none', parallax: px(0) })],
		]),
	]), { cards: 'spread' }),
	auditCta(),
];

/* ---------------- Audit ---------------- */

const audit = [
	L.pageHead('ممیزی رایگان', 'در دو دقیقه بگویید\n*کجا ایستاده‌اید*', 'سه سؤال کوتاه بپرسیم، بعد ظرف دو ساعت کاری تماس می‌گیریم. در جلسه‌ی ممیزی سه فرصت رشد سریع را مکتوب تحویل می‌گیرید، حتی اگر با ما کار نکنید.'),
	section({ space: 'md', gap: 40, width: 980 }, [L.leadForm(LEAD)]),
	fx(section({ space: 'md', gap: 40 }, [L.steps(PROCESS, { layout: 'h', cards: 'yes' })]), { tone: 'surface', cards: 'cascade' }),
];

/* ---------------- About, FAQ, contact ---------------- */

const about = [
	L.pageHead('درباره‌ی تپش', 'استودیویی که\n*گزارش فروش* می‌فرستد', 'تپش را ۱۳۹۷ سه نفر راه انداختند که از گزارش‌های پر از لایک و بی‌خبر از فروش خسته شده بودند. امروز چهارده نفریم و هنوز هر کار را با یک عدد شروع می‌کنیم.'),
	section({ space: 'sm', zoom: 'expand', zoomAmount: 0.2, zoomInner: true, zoomRadius: 2 }, [
		L.imageReveal('hero', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'اصول ما', title: 'چهار *قول*' }),
		L.features([
			{ icon: 'target', title: 'یک عدد هدف', text: 'هر کار با یک عدد قابل اندازه‌گیری شروع می‌شود.' },
			{ icon: 'eye', title: 'شفافیت', text: 'حساب‌ها به نام شماست و داشبورد همیشه باز.' },
			{ icon: 'clock', title: 'گزارش هفتگی', text: 'هر دوشنبه، بدون استثنا.' },
			{ icon: 'heart', title: 'ظرفیت محدود', text: 'هر ماه فقط سه برند تازه می‌پذیریم.' },
		], { layout: 'grid', style: 'cards', columns: '4', icon_style: 'tile' }),
	]), { tone: 'surface', cards: 'flip' }),
	section({ space: 'md', gap: 40, cards: 'cascade' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'تیم', title: 'آدم‌هایی که\n*پشت عددها* هستند' })],
			[L.features([
				{ icon: '', title: 'مهسا کریمیان', text: 'هم‌بنیان‌گذار؛ استراتژی' },
				{ icon: '', title: 'امید فرهادی', text: 'هم‌بنیان‌گذار؛ تبلیغات کلیکی' },
				{ icon: '', title: 'سپیده نوری', text: 'مدیر هنری' },
				{ icon: '', title: 'پویا رستمی', text: 'سئو و محتوا' },
			], { layout: 'grid', style: 'plain', columns: '2', icon_style: 'plain' })],
		]),
	]),
	auditCta(),
];

const faqPage = [
	L.pageHead('پرسش‌های متداول', 'پیش از *شروع*', 'اگر سؤال دیگری دارید، در جلسه‌ی ممیزی رایگان بپرسید؛ تعهدی ایجاد نمی‌کند.'),
	section({ space: 'md', gap: 56 }, [
		cols({ widths: [30, 70], gap: 64 }, [
			[heading({ eyebrow: 'همکاری', title: 'قرارداد و *نتیجه*', title_size: 'md' })],
			[L.faq(FAQ, { style: 'lines' })],
		]),
	]),
	auditCta(),
];

const contact = [
	L.pageHead('تماس', 'درباره‌ی برندتان\n*حرف بزنیم*', 'برای همکاری، پروژه‌ی برندینگ یا پرسش درباره‌ی بسته‌ها پیام بدهید.'),
	section({ space: 'md' }, [
		cols({ widths: [40, 60], gap: 64 }, [
			[L.contactInfo([
				{ icon: 'phone', label: 'تلفن', value: '۰۲۱-۸۸۶۶۰۴۲۰', link: link('tel:+982188660420') },
				{ icon: 'mail', label: 'ایمیل', value: 'hello@tapesh.studio', link: link('mailto:hello@tapesh.studio') },
				{ icon: 'pin', label: 'استودیو', value: 'تهران، خیابان ولیعصر، کوچه‌ی بهار، پلاک ۱۲', link: link('') },
				{ icon: 'clock', label: 'ساعت کاری', value: 'شنبه تا چهارشنبه، ۱۰ تا ۱۸', link: link('') },
			])],
			[L.contactForm({ show_phone: 'yes', label_phone: 'شماره‌ی موبایل', show_subject: 'yes', label_subject: 'موضوع', label_name: 'نام و نام خانوادگی', label_email: 'ایمیل', label_message: 'پیام شما', button: 'ارسال پیام', success: 'پیامتان رسید؛ تا پایان روز کاری جواب می‌دهیم.' })],
		]),
	]),
];

/* ---------------- Notes ---------------- */

const terms = [
	{ key: 'cat-case', taxonomy: 'category', name: 'نمونه‌کار', slug: 'case-studies' },
	{ key: 'cat-seo', taxonomy: 'category', name: 'سئو', slug: 'seo' },
	{ key: 'cat-ads', taxonomy: 'category', name: 'تبلیغات', slug: 'advertising' },
	{ key: 'cat-brand', taxonomy: 'category', name: 'برند', slug: 'branding' },
	{ key: 'pcat-service', taxonomy: 'product_cat', name: 'بسته‌های خدمات', slug: 'service-packages' },
	{ key: 'pcat-digital', taxonomy: 'product_cat', name: 'محصولات دیجیتال', slug: 'digital-products' },
];

const posts = [
	{
		key: 'case-cafe-rey', title: 'کافه‌ی ری: ۶۸ هزار دنبال‌کننده بدون یک مسابقه', slug: 'cafe-rey-case-study', image: 'work-1', terms: ['cat-case'], days_ago: 3,
		excerpt: 'چطور یک کافه‌ی محله‌ای با داستان‌های پشت پیشخوان، صف آخر هفته‌اش را ساخت.',
		content: L.article([
			'کافه‌ی ری وقتی سراغ ما آمد چهار هزار دنبال‌کننده داشت و بیشترشان دوستان و آشنایان صاحبان کافه بودند. هدف روشن بود: آدم‌های محله باید کافه را بشناسند و آخر هفته‌ها بیایند.',
			['h', 'آنچه انجام دادیم'],
			['ul', ['یک هفته در کافه نشستیم و با مشتری‌ها حرف زدیم.', 'به‌جای عکس‌های تزئینی، از آدم‌ها و داستان‌های پشت پیشخوان محتوا ساختیم.', 'با سه کافه‌گرد محلی همکاری کردیم که واقعاً مشتری کافه بودند.', 'برای هر پست، اثرش را روی فروش آخر هفته ردیابی کردیم.']],
			['h', 'نتیجه'],
			'در هشت ماه، صفحه به ۶۸ هزار دنبال‌کننده‌ی واقعی رسید و ۳۲ درصد مشتری‌های آخر هفته گفتند کافه را از اینستاگرام می‌شناسند.',
			['q', 'حالا مشتری‌ها اسم باریستاها را می‌دانند. این برای ما از هر عددی مهم‌تر است.', 'شیرین مهدوی، هم‌بنیان‌گذار کافه‌ی ری'],
		]),
	},
	{
		key: 'case-safarno', title: 'سفرنو: هزینه‌ی هر رزرو ۴۱ درصد کمتر', slug: 'safarno-case-study', image: 'work-2', terms: ['cat-case'], days_ago: 9,
		excerpt: 'بودجه را عوض نکردیم؛ جایش را عوض کردیم.',
		content: L.article([
			'سفرنو ماهانه بودجه‌ی قابل توجهی در گوگل ادز خرج می‌کرد، اما نمی‌دانست کدام مسیر سفر سود می‌آورد و کدام فقط کلیک.',
			['h', 'گام اول: ردیابی درست'],
			'پیش از هر تغییری، ردیابی تبدیل را از کلیک تا پرداخت راه انداختیم. معلوم شد سی درصد بودجه صرف مسیرهایی می‌شد که تقریباً هیچ رزروی نداشتند.',
			['h', 'گام دوم: کمپین بر اساس سود'],
			'کمپین‌ها را بر اساس حاشیه‌ی سود هر مسیر بازچینی کردیم و برای هجده مسیر پرفروش صفحه‌ی فرود اختصاصی موبایل ساختیم.',
			['ul', ['کاهش ۴۱ درصدی هزینه‌ی هر رزرو', 'افزایش ۲۷ درصدی رزرو با همان بودجه', 'گزارش هفتگی به تفکیک مسیر']],
		]),
	},
	{
		key: 'case-ara-clinic', title: 'کلینیک پوست آرا: سه برابر مراجعه از گوگل', slug: 'ara-clinic-case-study', image: 'work-4', terms: ['cat-case', 'cat-seo'], days_ago: 16,
		excerpt: 'محتوای تخصصی با بازبینی پزشک و سئوی محلی برای سه شعبه.',
		content: L.article([
			'در حوزه‌ی پزشکی، محتوای سطحی نه گوگل را راضی می‌کند نه بیمار را. برای کلینیک آرا روندی ساختیم که هر مقاله پیش از انتشار توسط پزشک بازبینی شود.',
			['h', 'سئوی محلی'],
			'برای هر سه شعبه صفحه‌ی جداگانه، اطلاعات دقیق در نقشه‌ها و روندی برای جمع کردن نظر بیماران راضی ساختیم.',
			['h', 'نتیجه در شش ماه'],
			['ul', ['۲۱۰ کلمه‌ی کلیدی در صفحه‌ی اول گوگل', 'سه برابر شدن نوبت‌های آنلاین', 'امتیاز ۴٫۹ از ۵ در نقشه‌ها']],
		]),
	},
	{
		key: 'ads-budget-mistakes', title: 'پنج جایی که بودجه‌ی تبلیغات بی‌صدا هدر می‌رود', slug: 'ad-budget-leaks', image: 'journal-3', terms: ['cat-ads'], days_ago: 22,
		excerpt: 'پیش از افزایش بودجه، این پنج مورد را در حساب تبلیغاتی‌تان بررسی کنید.',
		content: L.article([
			'تقریباً در هر حساب تبلیغاتی که ممیزی می‌کنیم، بخشی از بودجه صرف چیزهایی می‌شود که هیچ‌وقت به فروش نمی‌رسند. خبر خوب این است که بیشترشان در یک بعدازظهر درست می‌شوند.',
			['ol', ['کلمات کلیدی گسترده بدون فهرست کلمات منفی', 'ردیابی تبدیلی که فقط «بازدید صفحه‌ی تشکر» را می‌شمارد', 'نمایش تبلیغ در ساعت‌هایی که کسی جواب تلفن نمی‌دهد', 'صفحه‌ی فرودی که روی موبایل کند باز می‌شود', 'کمپین‌های قدیمی که هیچ‌کس خاموششان نکرده']],
			'اگر فقط یک کار می‌کنید، از ردیابی شروع کنید. تا وقتی ندانید کدام کلیک به فروش رسیده، هر تصمیمی درباره‌ی بودجه حدس است.',
		]),
	},
	{
		key: 'local-seo', title: 'سئوی محلی برای کسب‌وکارهای چندشعبه', slug: 'local-seo-guide', image: 'journal-1', terms: ['cat-seo'], days_ago: 30,
		excerpt: 'وقتی کسی می‌نویسد «نزدیک‌ترین…»، شعبه‌ی شما کجای نتایج است؟',
		content: L.article([
			'بخش بزرگی از جست‌وجوهای موبایل محلی‌اند: نزدیک‌ترین کلینیک، کافه‌ی باز در این ساعت، فروشگاه در همین محله. برای کسب‌وکارهای چندشعبه، این جست‌وجوها فرصت بزرگی‌اند.',
			['h', 'برای هر شعبه یک صفحه'],
			'هر شعبه صفحه‌ی خودش را با آدرس، ساعت کاری، تصویر واقعی و راه ارتباطی مستقیم لازم دارد. یک صفحه‌ی «شعبه‌ها» با فهرست آدرس‌ها کافی نیست.',
			['h', 'نظرها را جدی بگیرید'],
			'به همه‌ی نظرها جواب بدهید، به‌خصوص منفی‌ها. پاسخ محترمانه به یک نظر بد، برای خواننده‌های بعدی از ده نظر خوب قانع‌کننده‌تر است.',
		]),
	},
	{
		key: 'brand-voice', title: 'لحن برند را چطور روی کاغذ بیاوریم', slug: 'writing-a-brand-voice', image: 'journal-4', terms: ['cat-brand'], days_ago: 37,
		excerpt: 'سه صفت، چهار مثال و یک فهرست «این‌طور نمی‌گوییم».',
		content: L.article([
			'لحن برند وقتی فقط در ذهن مدیر بازاریابی است، با هر نیروی تازه عوض می‌شود. راهنمای لحن لازم نیست بلند باشد؛ باید کاربردی باشد.',
			['ol', ['سه صفت انتخاب کنید که برند شماست و برای هر کدام بنویسید «یعنی چه» و «یعنی چه نیست».', 'برای هر کانال، یک نمونه‌ی خوب و یک نمونه‌ی بد کنار هم بگذارید.', 'فهرستی از کلمه‌ها و جمله‌هایی بنویسید که هرگز به کار نمی‌برید.']],
			'این راهنما را هر شش ماه با نمونه‌های واقعی به‌روز کنید. لحن برند هم مثل خود برند رشد می‌کند.',
		]),
	},
];

/* ---------------- Shop: packages ---------------- */

const products = [
	{ key: 'p-seo-audit', title: 'ممیزی کامل سئو', slug: 'seo-audit', price: 4900000, sku: 'TP-SEO-AUD', image: 'product-1', gallery: ['dashboard'], terms: ['pcat-service'], virtual: true, featured: true,
		excerpt: 'گزارش ۴۰ صفحه‌ای وضعیت فنی، محتوا و رقبا، همراه با فهرست اولویت‌دار کارها.',
		content: L.productBody(['ممیزی شامل بررسی فنی سایت، سرعت، ساختار محتوا، کلمات کلیدی و مقایسه با سه رقیب اصلی است.', 'گزارش را در یک جلسه‌ی یک‌ساعته با شما مرور می‌کنیم تا بدانید از کجا شروع کنید.'], [['زمان تحویل', '۷ روز کاری'], ['خروجی', 'گزارش PDF و فایل اکسل کارها'], ['جلسه‌ی مرور', 'یک ساعت، آنلاین']]) },
	{ key: 'p-instagram', title: 'مدیریت اینستاگرام — ماهانه', slug: 'instagram-management', price: 18000000, sku: 'TP-IG-M', image: 'product-2', terms: ['pcat-service'], virtual: true, featured: true,
		excerpt: 'تقویم محتوا، ۱۲ پست و ۸ ریلز در ماه، مدیریت دایرکت و گزارش ماهانه.',
		content: L.productBody(['تیم محتوای ما برای کسب‌وکار شما تقویم ماهانه می‌نویسد، تولید می‌کند و منتشر می‌کند.', 'گزارش ماهانه فقط آمار دنبال‌کننده نیست؛ اثر محتوا روی پیام‌ها و سفارش‌ها را هم نشان می‌دهد.'], [['محتوای ماهانه', '۱۲ پست و ۸ ریلز'], ['پاسخ دایرکت', 'روزهای کاری'], ['گزارش', 'ماهانه']]) },
	{ key: 'p-google-ads', title: 'راه‌اندازی کمپین گوگل ادز', slug: 'google-ads-setup', price: 12000000, sale_price: 9900000, sku: 'TP-GADS', image: 'product-3', terms: ['pcat-service'], virtual: true, featured: true,
		excerpt: 'ساختار کمپین، کلمات کلیدی، متن تبلیغ و ردیابی تبدیل؛ آماده‌ی اجرا در یک هفته.',
		content: L.productBody(['کمپین را از صفر یا بر پایه‌ی حساب فعلی شما می‌سازیم و ردیابی تبدیل را تا مرحله‌ی سفارش راه می‌اندازیم.', 'یک ماه پشتیبانی و بهینه‌سازی پس از راه‌اندازی در قیمت گنجانده شده است.'], [['زمان راه‌اندازی', '۷ روز کاری'], ['پشتیبانی', 'یک ماه'], ['بودجه‌ی تبلیغات', 'جداگانه']]) },
	{ key: 'p-brand-kit', title: 'کیت هویت بصری', slug: 'brand-identity-kit', price: 35000000, sku: 'TP-BRAND', image: 'product-4', gallery: ['work-6'], terms: ['pcat-service'], virtual: true,
		excerpt: 'لوگو، رنگ، تایپوگرافی، لحن برند و راهنمای استفاده در یک بسته.',
		content: L.productBody(['کیت هویت بصری برای کسب‌وکارهایی است که تازه شروع کرده‌اند یا می‌خواهند برندشان را یکپارچه کنند.', 'سه مرحله بازخورد در فرایند گنجانده شده و همه‌ی فایل‌ها با کیفیت چاپی تحویل می‌شوند.'], [['زمان تحویل', '۴ هفته'], ['دور بازخورد', '۳ مرحله'], ['خروجی', 'فایل‌های لایه‌باز و راهنمای برند']]) },
	{ key: 'p-calendar', title: 'تقویم محتوای ۹۰ روزه', slug: '90-day-content-calendar', price: 2900000, sku: 'TP-CAL-90', image: 'product-5', terms: ['pcat-digital'], virtual: true,
		excerpt: 'قالب آماده‌ی برنامه‌ریزی محتوا با ۹۰ ایده‌ی پست برای کسب‌وکارهای خدماتی.',
		content: L.productBody(['فایل آماده در گوگل‌شیت و اکسل، با ستون‌های هدف، قالب محتوا، فراخوان و یادداشت انتشار.', '۹۰ ایده‌ی پست و استوری برای کسب‌وکارهای خدماتی، همراه با راهنمای استفاده.'], [['فرمت', 'گوگل‌شیت و اکسل'], ['دریافت', 'بلافاصله پس از خرید']]) },
	{ key: 'p-email', title: 'راه‌اندازی ایمیل مارکتینگ', slug: 'email-marketing-setup', price: 9500000, sku: 'TP-EMAIL', image: 'product-6', terms: ['pcat-service'], virtual: true,
		excerpt: 'خبرنامه، ایمیل‌های خودکار سبد خرید رهاشده و بازگشت مشتری.',
		content: L.productBody(['سه جریان ایمیل خودکار را برای فروشگاه شما طراحی، نوشته و راه‌اندازی می‌کنیم: خوش‌آمد، سبد رهاشده و بازگشت مشتری.', 'قالب خبرنامه‌ی ماهانه هم با هویت برند شما تحویل می‌شود.'], [['جریان‌های خودکار', '۳ جریان'], ['قالب خبرنامه', '۱ قالب اختصاصی'], ['زمان راه‌اندازی', '۱۰ روز کاری']]) },
];

/* ---------------- Package ---------------- */

const LIGHT = { light: 'start', extra: { hm_page_light_a: '#c9452c', hm_page_light_b: '#a8a49b' } };

const pages = [
	{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings(LIGHT) },
	{ key: 'home-2', title: 'خانه — نسخه‌ی دوم', slug: 'home-2', elementor: home2, settings: L.pageSettings({ header: 'transparent-light' }) },
	{ key: 'services', title: 'خدمات', slug: 'services', elementor: services, settings: L.pageSettings() },
	{ key: 'work', title: 'نمونه‌کارها', slug: 'work', elementor: workPage, settings: L.pageSettings(LIGHT) },
	{ key: 'audit', title: 'ممیزی رایگان', slug: 'free-audit', elementor: audit, settings: L.pageSettings() },
	{ key: 'about', title: 'درباره‌ی تپش', slug: 'about', elementor: about, settings: L.pageSettings() },
	{ key: 'faq', title: 'پرسش‌های متداول', slug: 'faq', elementor: faqPage, settings: L.pageSettings() },
	{ key: 'contact', title: 'تماس', slug: 'contact', elementor: contact, settings: L.pageSettings() },
	{ key: 'blog', title: 'یادداشت‌ها', slug: 'notes', content: '' },
];

module.exports = {
	manifest: {
		id: 'agency',
		order: 2,
		title: 'تپش',
		desc: 'استودیوی برند و رشد؛ سایت کامل آژانس: خدمات، نمونه‌کارها با عدد، بسته‌های خرید آنلاین، ممیزی رایگان سه‌مرحله‌ای، تعرفه‌ها و یادداشت‌ها. خاکستری گرم، مشکی و شنگرفی.',
		kit: 'studio',
		thumb: 'thumb.webp',
		required: ['elementor', 'woocommerce'],
		recommended: [],
		tags: ['آژانس', 'برندینگ', 'شرکتی'],
		pages: pages.filter((p) => p.elementor).map((p) => p.title).concat(['بسته‌ها', 'یادداشت‌ها']),
	},
	content: {
		site: { title: 'تپش', tagline: 'استودیوی برند و رشد' },
		images, alts, terms, posts, products, pages,
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'تپش — صفحه‌ی اصلی' },
			{ key: 'tpl-home-2', type: 'page', page: 'home-2', title: 'تپش — صفحه‌ی اصلی، نسخه‌ی دوم' },
			{ key: 'tpl-services', type: 'page', page: 'services', title: 'تپش — خدمات' },
			{ key: 'tpl-audit', type: 'page', page: 'audit', title: 'تپش — ممیزی رایگان' },
			{ key: 'tpl-cases', type: 'section', page: 'home', index: 5, title: 'تپش — نمونه‌کار با عدد (کارت‌های پشته‌ای)' },
			{ key: 'tpl-plans', type: 'section', page: 'home', index: 9, title: 'تپش — تعرفه‌ها' },
			{ key: 'tpl-work', type: 'section', page: 'home-2', index: 1, title: 'تپش — نمونه‌کارها (اسکرول افقی)' },
		],
		menus: [
			{
				name: 'تپش — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'خدمات', page: 'services' },
					{ title: 'نمونه‌کارها', page: 'work' },
					{ title: 'بسته‌ها', url: '{{shop}}' },
					{ title: 'یادداشت‌ها', page: 'blog' },
					{ title: 'استودیو', page: 'about', children: [
						{ title: 'درباره‌ی تپش', page: 'about' },
						{ title: 'پرسش‌های متداول', page: 'faq' },
						{ title: 'تماس', page: 'contact' },
					] },
				],
			},
			{
				name: 'تپش — پابرگ', location: 'footer', items: [
					{ title: 'خدمات', page: 'services' },
					{ title: 'نمونه‌کارها', page: 'work' },
					{ title: 'ممیزی رایگان', page: 'audit' },
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
			header_cta_text: 'ممیزی رایگان',
			header_cta_url: '{{page:audit}}',
			font_body: 'iransansx',
			font_heading: 'peyda',
			font_heading_weight: '700',
			footer_about: 'تپش استودیوی برند و رشد است؛ هر کار با یک عدد هدف شروع می‌شود و هر هفته همان عدد گزارش می‌شود.',
			footer_copyright: 'تمام حقوق برای استودیو تپش محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'linkedin', url: 'https://linkedin.com/' }, { network: 'telegram', url: 'https://t.me/' }],
			mobile_bar: true,
			mobile_bar_text: 'ممیزی رایگان',
			mobile_bar_url: '{{page:audit}}',
			mobile_bar_phone: '02188660420',
			magnetic: true,
			cursor: 'ring',
			sound_enabled: true,
			sound_default: true,
			sound_theme: 'digital',
			sound_volume: 25,
			sound_hover: false,
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 3, pages: { shop: 'بسته‌ها', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
