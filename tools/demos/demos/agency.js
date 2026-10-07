/**
 * Demo: Tapesh — a digital marketing agency (Pulse kit).
 *
 * The home page follows a conversion brief: outcome-led hero → logo bar →
 * problem / solution → services (tabs) → proof (case studies, numbers,
 * attributed quotes) → process → pricing with real capacity → objection FAQ →
 * a three-step audit request that remembers unfinished answers.
 */
'use strict';

const L = require('../lib');
const { img, link, px, section, cols, heading, button } = L;

const images = {
	showreel: 'images/showreel.webp',
	dashboard: 'images/dashboard.webp',
};
for (let i = 1; i <= 6; i++) { images['work-' + i] = 'images/work-' + i + '.webp'; }
for (let i = 1; i <= 4; i++) { images['social-' + i] = 'images/social-' + i + '.webp'; }
for (let i = 1; i <= 6; i++) { images['product-' + i] = 'images/product-' + i + '.webp'; }
for (let i = 1; i <= 6; i++) { images['journal-' + i] = 'images/journal-' + i + '.webp'; }

images.logo = 'images/logo.webp';
images['logo-dark'] = 'images/logo-dark.webp';

const alts = {
	showreel: 'کلاژی از کمپین‌های تبلیغاتی و پست‌های شبکه‌های اجتماعی',
	dashboard: 'داشبورد گزارش هفتگی بازاریابی با نرخ تبدیل و بازگشت تبلیغات',
	'work-1': 'شبکه‌ی پست‌های اینستاگرام کافه‌ی ری',
	'work-2': 'کمپین تبلیغاتی سفرنو',
	'work-3': 'فروشگاه اینترنتی پوشاک لیان',
	'work-4': 'رشد بازدید ارگانیک کلینیک پوست آرا',
	'work-5': 'صفحه‌های اپلیکیشن بیمه‌یار',
	'work-6': 'هویت بصری نانوایی‌های نان‌آور',
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

const anchor = (id, el) => { el.settings._element_id = id; return el; };

/* ---------------- Home A: conversion landing ---------------- */

const homeA = [
	L.hero({
		layout: 'split',
		eyebrow: 'آژانس دیجیتال مارکتینگ',
		title: 'رشدی که در\n*گزارش فروش*\nدیده می‌شود.',
		desc: 'تپش برای برندهای ایرانی سئو، تبلیغات کلیکی، شبکه‌های اجتماعی و محتوا را یکجا اجرا می‌کند؛ با داشبوردی که هر هفته نشان می‌دهد هر تومان کجا خرج شد و چه برگرداند.',
		btn1_text: 'دریافت ممیزی رایگان', btn1_link: link('#audit'),
		btn2_text: 'نمونه‌کارها', btn2_link: link('{{page:work}}'),
		stats: [
			{ value: '۱۸۰+', label: 'برند همکار' },
			{ value: '۳٫۲×', label: 'میانگین بازگشت تبلیغات' },
			{ value: '۹۴٪', label: 'تمدید قرارداد' },
		],
		media_type: 'mosaic',
		gallery: L.gallery(['social-1', 'work-2', 'dashboard', 'social-3', 'work-4', 'social-2']),
		height: 'screen',
		decor: 'grid',
		hint: 'اسکرول کنید',
	}),
	L.marquee(CLIENTS, { look: 'muted', size: 'md', separator: 'slash', speed: px(45) }),
	section({ space: 'md', width: 1120 }, [
		L.textScrub('بیشتر کسب‌وکارها بودجه‌ی تبلیغات کم ندارند؛ *نمی‌دانند کدام بخشش کار می‌کند*. ما هر کانال را جدا اندازه می‌گیریم، آنچه نتیجه نمی‌دهد را خاموش می‌کنیم و بودجه را جایی می‌بریم که *فروش* می‌سازد.', { eyebrow: 'مسئله‌ای که حل می‌کنیم', size: 'lg' }),
	]),
	section({ space: 'md', top0: true }, [
		L.features([
			{ icon: 'eye', title: 'دیده نمی‌شوید', text: 'سایت در گوگل صفحه‌ی سوم است و رقیب‌ها جای شما را گرفته‌اند. با سئوی فنی و محتوای تخصصی برمی‌گردید به صفحه‌ی اول.', meta: 'سئو و محتوا', wide: 'yes' },
			{ icon: 'target', title: 'تبلیغات گران تمام می‌شود', text: 'کلیک زیاد، فروش کم. کمپین‌ها را بر اساس سود هر محصول بازچینی می‌کنیم.', meta: 'تبلیغات کلیکی' },
			{ icon: 'instagram', title: 'صفحه‌ی اجتماعی ساکت است', text: 'پست می‌گذارید ولی گفت‌وگویی شکل نمی‌گیرد. تقویم محتوا را با رفتار مخاطب واقعی می‌سازیم.', meta: 'شبکه‌های اجتماعی' },
			{ icon: 'chart', title: 'عددها پراکنده‌اند', text: 'هر کانال گزارش خودش را دارد و هیچ‌کدام به فروش وصل نیست. همه را در یک داشبورد هفتگی جمع می‌کنیم.', meta: 'گزارش و داده', wide: 'yes' },
		], { layout: 'bento', style: 'cards', columns: '3', icon_style: 'tile' }),
	]),
	anchor('services', section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [55, 45], align: 'flex-end' }, [
			[heading({ eyebrow: '۰۱ — خدمات', title: 'یک تیم، *همه‌ی کانال‌ها*' })],
			[L.textEditor('<p>لازم نیست برای هر کانال سراغ یک آژانس بروید. استراتژی، اجرا و گزارش در یک تیم انجام می‌شود و همه به یک عدد پاسخ‌گو هستیم: رشد فروش شما.</p>')],
		]),
		L.tabs([
			{ title: 'سئو و محتوا', subtitle: 'دیده شدن پایدار', meta: '۰۱', image: img('work-4'), panel_title: 'جایگاه اول، با محتوایی که واقعاً خوانده می‌شود', panel_text: 'سئوی فنی، تحقیق کلمات کلیدی، نوشتن و بهینه‌سازی محتوا و لینک‌سازی سالم. هر ماه گزارش رتبه‌ها و ورودی‌ها را همراه با صفحه‌هایی که فروش آورده‌اند دریافت می‌کنید.', chips: 'سئوی فنی، محتوا، سئوی محلی', btn_text: 'جزئیات خدمت', btn_link: link('{{page:services}}') },
			{ title: 'تبلیغات کلیکی', subtitle: 'نتیجه از هفته‌ی دوم', meta: '۰۲', image: img('work-2'), panel_title: 'هر تومان، قابل پیگیری', panel_text: 'راه‌اندازی و مدیریت کمپین‌های گوگل ادز و شبکه‌های تبلیغاتی ایرانی، با ردیابی تبدیل از کلیک تا سفارش. هر هفته کمپین‌های ضعیف خاموش و بودجه جابه‌جا می‌شود.', chips: 'گوگل ادز، تبلیغات همسان، ریتارگتینگ', btn_text: 'جزئیات خدمت', btn_link: link('{{page:services}}') },
			{ title: 'شبکه‌های اجتماعی', subtitle: 'گفت‌وگو، نه فقط پست', meta: '۰۳', image: img('social-1'), panel_title: 'صفحه‌ای که مخاطب منتظرش است', panel_text: 'تقویم محتوای ماهانه، عکاسی و ویدیوی کوتاه، مدیریت دایرکت و همکاری با اینفلوئنسرها؛ با گزارشی که به فروش وصل است، نه فقط به لایک.', chips: 'اینستاگرام، ریلز، اینفلوئنسر', btn_text: 'جزئیات خدمت', btn_link: link('{{page:services}}') },
			{ title: 'برندینگ', subtitle: 'شخصیتی که به خاطر می‌ماند', meta: '۰۴', image: img('work-6'), panel_title: 'از لوگو تا لحن', panel_text: 'تحقیق بازار، جایگاه‌یابی، طراحی هویت بصری و راهنمای برند؛ تا هر چیزی که منتشر می‌کنید از یک برند واحد بیاید.', chips: 'هویت بصری، لحن برند، بسته‌بندی', btn_text: 'جزئیات خدمت', btn_link: link('{{page:services}}') },
		], { autoplay: 7, media_side: 'end' }),
	])),
	L.hscroll({
		eyebrow: '۰۲ — نمونه‌کارها',
		title: 'عددهایی که\n*ساختیم*',
		desc: 'هر پروژه با یک هدف قابل اندازه‌گیری شروع شده است.',
		items: WORK,
		card_size: 'lg',
		card_style: 'overlay',
		btn1_text: 'همه‌ی نمونه‌کارها', btn1_link: link('{{page:work}}'),
		scheme: 'inverse',
	}),
	section({ space: 'md' }, [
		L.counters([
			{ value: 180, suffix: '+', label: 'برند همکار', desc: 'از استارتاپ تا فروشگاه زنجیره‌ای' },
			{ value: 3.2, suffix: '×', label: 'بازگشت تبلیغات', desc: 'میانگین سال ۱۴۰۴' },
			{ value: 41, suffix: '٪', label: 'کاهش هزینه‌ی جذب', desc: 'در شش ماه اول همکاری' },
			{ value: 94, suffix: '٪', label: 'تمدید قرارداد', desc: 'مشتری‌هایی که ماندند' },
		], { style: 'cards', columns: '4' }),
	]),
	L.scrollPath({
		eyebrow: '۰۳ — روش کار',
		title: 'از ممیزی تا\n*رشد هفتگی*',
		hint: 'به اسکرول ادامه دهید',
		steps: [
			{ code: 'هفته‌ی ۱', title: 'ممیزی رایگان', text: 'سایت، تبلیغات و صفحه‌های اجتماعی‌تان را بررسی می‌کنیم و سه فرصت سریع را مکتوب تحویل می‌دهیم.' },
			{ code: 'هفته‌ی ۲', title: 'استراتژی و هدف‌گذاری', text: 'دو یا سه عدد هدف را با هم تعیین می‌کنیم و بودجه را بین کانال‌ها تقسیم می‌کنیم.' },
			{ code: 'هفته‌ی ۳ به بعد', title: 'اجرا', text: 'کمپین‌ها، محتوا و بهینه‌سازی سایت شروع می‌شوند؛ هر کار با یک فرضیه‌ی روشن.' },
			{ code: 'هر هفته', title: 'گزارش و بهینه‌سازی', text: 'داشبورد هفتگی و یک جلسه‌ی نیم‌ساعته: چه کار کرد، چه نکرد، قدم بعدی چیست.' },
		],
	}),
	section({ space: 'md', scheme: 'surface' }, [
		heading({ eyebrow: '۰۴ — از زبان مشتری‌ها', title: 'نتیجه را *آن‌ها* تعریف می‌کنند', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]),
	anchor('pricing', section({ space: 'md' }, [
		heading({ eyebrow: '۰۵ — تعرفه‌ها', title: 'قیمت روشن، *بدون قرارداد بلندمدت*', header_align: 'center', desc: 'این ماه فقط ظرفیت پذیرش سه برند تازه را داریم تا کیفیت کار برای مشتری‌های فعلی پایین نیاید.' }),
		L.pricing([
			{ name: 'پایه', desc: 'برای کسب‌وکارهایی که تازه شروع کرده‌اند', price: '۲۸', price_alt: '۲۵', unit: 'میلیون تومان', period: 'ماهانه', features: 'یک کانال اصلی (سئو یا تبلیغات)\nداشبورد گزارش هفتگی\nجلسه‌ی ماهانه‌ی استراتژی\nپشتیبانی در پیام‌رسان', btn_text: 'شروع با پایه', btn_link: link('#audit'), featured: '', badge: '' },
			{ name: 'رشد', desc: 'برای برندهایی که آماده‌ی مقیاس‌اند', price: '۵۵', price_alt: '۴۹', unit: 'میلیون تومان', period: 'ماهانه', features: 'سه کانال به انتخاب شما\nمدیر حساب اختصاصی\nجلسه‌ی هفتگی بهینه‌سازی\nتولید محتوای ماهانه\nتست A/B صفحه‌های فرود', btn_text: 'شروع با رشد', btn_link: link('#audit'), featured: 'yes', badge: 'انتخاب بیشتر مشتری‌ها' },
			{ name: 'مقیاس', desc: 'برای فروشگاه‌ها و برندهای چندشعبه', price: 'توافقی', price_alt: 'توافقی', unit: '', period: '', features: 'همه‌ی کانال‌ها\nتیم اختصاصی\nداشبورد اختصاصی مدیران\nهماهنگی با تیم فروش', btn_text: 'هماهنگی جلسه', btn_link: link('#audit'), featured: '', badge: '' },
		], { switch_off: 'پرداخت ماهانه', switch_on: 'پرداخت سه‌ماهه', switch_note: '۱۰٪ تخفیف' }),
	])),
	section({ space: 'md', top0: true }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: '۰۶ — پیش از تصمیم', title: 'سؤال‌هایی که *همه* می‌پرسند', desc: 'اگر سؤال دیگری دارید، در جلسه‌ی ممیزی رایگان بپرسید؛ تعهدی ایجاد نمی‌کند.' }), button('رزرو جلسه‌ی ممیزی', '#audit', 'secondary')],
			[L.faq(FAQ)],
		]),
	]),
	anchor('audit', section({ space: 'md', scheme: 'inverse', cls: 'hm-violet-glow' }, [
		cols({ widths: [42, 58], gap: 64, align: 'flex-start' }, [
			[
				heading({ eyebrow: 'ممیزی رایگان', title: 'در دو دقیقه بگویید\n*کجا ایستاده‌اید*', desc: 'سه سؤال کوتاه بپرسیم، بعد ظرف دو ساعت کاری تماس می‌گیریم. در جلسه‌ی ممیزی سه فرصت رشد سریع را مکتوب تحویل می‌گیرید، حتی اگر با ما کار نکنید.' }),
				L.textEditor('<ul><li>بدون هزینه و بدون تعهد</li><li>بررسی سایت، تبلیغات و صفحه‌های اجتماعی</li><li>پاسخ تا دو ساعت کاری</li></ul>'),
			],
			[L.leadForm(LEAD)],
		], ),
	])),
	section({ space: 'md' }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: '۰۷ — نوشته‌ها', title: 'یادداشت‌های *تیم تپش*' })],
			[button('همه‌ی نوشته‌ها', '{{blog}}', 'secondary')],
		]),
		L.posts({ count: 3, layout: 'grid', columns: '3' }),
	]),
];

/* ---------------- Home B: visual studio ---------------- */

const homeB = [
	L.hero({
		layout: 'center',
		eyebrow: 'تپش · آژانس دیجیتال مارکتینگ',
		title: 'برندهایی می‌سازیم که\n*نمی‌شود ندیدشان*.',
		desc: 'استراتژی، خلاقیت و داده در یک تیم. از اولین پست تا هزارمین سفارش، کنار شما.',
		btn1_text: 'شروع همکاری', btn1_link: link('{{page:contact}}'),
		btn2_text: 'دیدن کارها', btn2_link: link('#work'),
		media_type: 'none',
		height: 'screen',
		decor: 'grid',
		hint: 'اسکرول کنید',
	}),
	L.scrollZoom({
		eyebrow: 'شوریل ۱۴۰۴',
		title: 'یک سال،\n*۴۲ کمپین*',
		image: img('showreel'),
		o_title: 'و هر کدام با یک\n*عدد هدف* شروع شد.',
		o_desc: 'برای هر کمپین پیش از اجرا می‌نویسیم موفقیت یعنی چه؛ بعد همان را اندازه می‌گیریم.',
		btn1_text: 'نمونه‌کارها', btn1_link: link('{{page:work}}'), btn1_style: 'inverse',
	}),
	L.marquee(['سئو', 'تبلیغات کلیکی', 'شبکه‌های اجتماعی', 'برندینگ', 'تولید محتوا', 'صفحه‌ی فرود', 'ایمیل مارکتینگ'], { look: 'alternate', size: 'xl', separator: 'plus', speed: px(70) }),
	anchor('work', section({ space: 'md' }, [
		heading({ eyebrow: 'پروژه‌های منتخب', title: 'سه داستان، *سه عدد*' }),
		L.stack([
			{ eyebrow: 'کافه‌ی ری · شبکه‌های اجتماعی', title: '۶۸ هزار دنبال‌کننده‌ی واقعی', text: 'به‌جای مسابقه و فالوور خریدنی، روی آدم‌های محله و داستان‌های پشت پیشخوان تمرکز کردیم.', points: 'رشد ۱۶ برابری در هشت ماه\n۳۲٪ فروش آخر هفته از اینستاگرام\nسه همکاری با کافه‌گردهای محلی', image: img('work-1'), btn_text: 'خواندن داستان', btn_link: link('{{post:case-cafe-rey}}'), tone: '' },
			{ eyebrow: 'سفرنو · تبلیغات کلیکی', title: 'هزینه‌ی هر رزرو ۴۱٪ کمتر', text: 'کمپین‌ها را بر اساس سود هر مسیر سفر بازچینی کردیم و صفحه‌های فرود را برای موبایل از نو ساختیم.', points: 'ردیابی کامل از کلیک تا رزرو\n۱۸ صفحه‌ی فرود اختصاصی\nبودجه‌ی ثابت، رزرو بیشتر', image: img('work-2'), btn_text: 'خواندن داستان', btn_link: link('{{post:case-safarno}}'), tone: 'inverse' },
			{ eyebrow: 'کلینیک پوست آرا · سئو', title: 'سه برابر مراجعه از گوگل', text: 'محتوای تخصصی با بازبینی پزشک و سئوی محلی برای سه شعبه، بدون یک ریال تبلیغ.', points: '۲۱۰ کلمه‌ی کلیدی در صفحه‌ی اول\nرشد ۳ برابری نوبت آنلاین\nامتیاز ۴٫۹ در نقشه‌ها', image: img('work-4'), btn_text: 'خواندن داستان', btn_link: link('{{post:case-ara-clinic}}'), tone: 'accent' },
		]),
	])),
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [50, 50], gap: 64, align: 'center' }, [
			[L.imageReveal('dashboard', { ratio: '4-3', reveal: 'clip-x', frame: 'mat' })],
			[
				heading({ eyebrow: 'گزارش هفتگی', title: 'عددها را *هر هفته*\nمی‌بینید، نه آخر سال', desc: 'داشبورد هر مشتری به حساب‌های تبلیغاتی، آنالیتیکس و فروشگاهش وصل است. هر دوشنبه یک خلاصه‌ی یک‌صفحه‌ای می‌گیرید: چه کار کرد، چه نکرد، قدم بعدی چیست.' }),
				L.features([
					{ icon: 'chart', title: 'هزینه‌ی هر سفارش', text: 'به تفکیک کانال و کمپین.' },
					{ icon: 'trend', title: 'روند هفتگی', text: 'مقایسه با هفته و ماه قبل.' },
				], { layout: 'list', style: 'plain', columns: '1', icon_style: 'soft' }),
			],
		]),
	]),
	section({ space: 'md' }, [
		heading({ eyebrow: 'تیم', title: 'آدم‌هایی که *پشت عددها* هستند' }),
		L.team([
			{ photo: {}, name: 'لیلا پارسا', role: 'مدیر استراتژی' },
			{ photo: {}, name: 'امیرحسین راد', role: 'سرپرست تبلیغات کلیکی' },
			{ photo: {}, name: 'هانیه موسوی', role: 'مدیر خلاقیت' },
			{ photo: {}, name: 'پویا کریمی', role: 'متخصص سئو' },
		], { columns: '4' }),
	]),
	L.testimonials(QUOTES, { layout: 'marquee' }),
	section({ space: 'md' }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'یادداشت‌ها', title: 'آنچه این هفته *یاد گرفتیم*' })],
			[button('همه‌ی نوشته‌ها', '{{blog}}', 'secondary')],
		]),
		L.posts({ count: 3, layout: 'grid', columns: '3' }),
	]),
	L.cta({
		eyebrow: 'ظرفیت این ماه: سه برند',
		title: 'نوبت *برند شما*ست.',
		desc: 'ممیزی رایگان بگیرید؛ سه فرصت رشد سریع را مکتوب تحویل می‌دهیم، حتی اگر با ما کار نکنید.',
		btn1_text: 'دریافت ممیزی رایگان', btn1_link: link('{{page:contact}}'),
		btn2_text: 'تعرفه‌ها', btn2_link: link('{{page:services}}'),
		look: 'accent',
		decor: 'grid',
		note: 'پاسخ تا دو ساعت کاری',
	}),
];

/* ---------------- Services ---------------- */

const services = [
	section({ space: 'md', bottom0: true }, [
		cols({ widths: [58, 42], align: 'flex-end' }, [
			[heading({ eyebrow: 'خدمات', title: 'هر کانالی که\n*فروش* می‌سازد', title_tag: 'h1', title_size: 'xl' })],
			[L.textEditor('<p>می‌توانید یک خدمت را جداگانه بگیرید یا چند کانال را با هم. در هر دو حالت یک مدیر حساب، یک داشبورد و یک هدف مشترک دارید.</p>'), button('ممیزی رایگان', '{{page:contact}}')],
		]),
	]),
	section({ space: 'md' }, [
		L.features([
			{ icon: 'search', image: img('work-4'), title: 'سئو و محتوا', text: 'سئوی فنی، تحقیق کلمات کلیدی، تولید محتوای تخصصی و سئوی محلی برای کسب‌وکارهای چندشعبه.', meta: 'از ۲۸ میلیون تومان در ماه', link: link('#audit'), wide: '' },
			{ icon: 'target', image: img('work-2'), title: 'تبلیغات کلیکی', text: 'گوگل ادز، تبلیغات همسان و ریتارگتینگ، با ردیابی تبدیل تا مرحله‌ی سفارش.', meta: 'از ۲۲ میلیون تومان در ماه', link: link('#audit') },
			{ icon: 'instagram', image: img('social-2'), title: 'شبکه‌های اجتماعی', text: 'تقویم محتوا، تولید ریلز، مدیریت دایرکت و همکاری با اینفلوئنسرها.', meta: 'از ۱۸ میلیون تومان در ماه', link: link('#audit') },
			{ icon: 'palette', image: img('work-6'), title: 'برندینگ', text: 'جایگاه‌یابی، هویت بصری، لحن برند و راهنمای استفاده برای تیم‌ها.', meta: 'پروژه‌ای، از ۳۵ میلیون تومان', link: link('#audit') },
			{ icon: 'globe', image: img('work-3'), title: 'سایت و صفحه‌ی فرود', text: 'طراحی و ساخت صفحه‌هایی که برای تبدیل ساخته شده‌اند، با تست A/B مداوم.', meta: 'پروژه‌ای', link: link('#audit') },
			{ icon: 'mail', image: img('social-4'), title: 'ایمیل مارکتینگ', text: 'خبرنامه، ایمیل‌های خودکار سبد خرید و بازگشت مشتری.', meta: 'از ۹ میلیون تومان در ماه', link: link('#audit') },
		], { layout: 'grid', style: 'cards', columns: '3', icon_style: 'soft', link_text: 'درخواست مشاوره' }),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		heading({ eyebrow: 'همکاری چطور شروع می‌شود', title: 'چهار قدم تا *اولین گزارش*', header_align: 'center' }),
		L.steps([
			{ marker: '۰۱', icon: 'search', title: 'ممیزی رایگان', text: 'یک جلسه‌ی ۴۵ دقیقه‌ای و گزارش مکتوب سه فرصت سریع.' },
			{ marker: '۰۲', icon: 'target', title: 'پیشنهاد مکتوب', text: 'هدف‌ها، کانال‌ها، بودجه و زمان‌بندی، روی یک صفحه.' },
			{ marker: '۰۳', icon: 'rocket', title: 'راه‌اندازی', text: 'دسترسی‌ها، ردیابی تبدیل و داشبورد در هفته‌ی اول آماده می‌شوند.' },
			{ marker: '۰۴', icon: 'chart', title: 'گزارش هفتگی', text: 'هر دوشنبه: چه کار کرد، چه نکرد، قدم بعدی.' },
		], { layout: 'h' }),
	]),
	anchor('audit', section({ space: 'md', width: 900 }, [
		heading({ eyebrow: 'ممیزی رایگان', title: 'از *همین‌جا* شروع کنید', header_align: 'center' }),
		L.leadForm(LEAD),
	])),
	section({ space: 'md', top0: true }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *شروع*' })],
			[L.faq(FAQ)],
		]),
	]),
];

/* ---------------- Work (case studies index) ---------------- */

const work = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'نمونه‌کارها', title: 'پروژه‌هایی که\n*عدد* دارند', title_tag: 'h1', title_size: 'xl', desc: 'هر پروژه با یک هدف قابل اندازه‌گیری شروع شده و نتیجه‌اش را همان‌طور که بوده گزارش کرده‌ایم.' }),
	]),
	L.hscroll({
		eyebrow: '',
		title: '',
		desc: '',
		items: WORK,
		card_size: 'xl',
		card_style: 'card',
	}),
	section({ space: 'md' }, [
		heading({ eyebrow: 'داستان کامل پروژه‌ها', title: 'از *مسئله* تا نتیجه' }),
		L.posts({ count: 6, layout: 'featured', columns: '3', cats: ['{{term:cat-case}}'] }),
	]),
	L.cta({
		title: 'پروژه‌ی بعدی\n*مال شماست*؟',
		desc: 'ممیزی رایگان بگیرید و ببینید از کجا می‌شود شروع کرد.',
		btn1_text: 'دریافت ممیزی رایگان', btn1_link: link('{{page:services}}'),
		look: 'inverse',
		decor: 'grid',
		note: '',
	}),
];

/* ---------------- About ---------------- */

const about = [
	section({ space: 'md', bottom0: true }, [
		cols({ widths: [55, 45], align: 'flex-end' }, [
			[heading({ eyebrow: 'درباره‌ی تپش', title: 'آژانسی که\n*به عدد* قسم می‌خورد', title_tag: 'h1', title_size: 'xl' })],
			[L.textEditor('<p>تپش را سال ۱۳۹۷ سه نفر راه انداختند که از گزارش‌های پر از لایک و بازدید خسته شده بودند. سؤالشان ساده بود: این کمپین چقدر فروش آورد؟</p>')],
		]),
	]),
	section({ space: 'md' }, [L.imageReveal('showreel', { ratio: '21-9', reveal: 'clip-up', parallax: px(0.3) })]),
	section({ space: 'md', width: 1100 }, [
		L.textScrub('امروز ۳۴ نفریم: استراتژیست، طراح، نویسنده، متخصص تبلیغات و تحلیلگر داده. هنوز همان سؤال را می‌پرسیم و هنوز *هیچ گزارشی بدون عدد فروش* از دفتر ما بیرون نمی‌رود.', { eyebrow: 'امروز', size: 'md' }),
	]),
	section({ space: 'sm' }, [
		L.counters([
			{ value: 34, label: 'نفر در تیم' },
			{ value: 180, suffix: '+', label: 'برند همکار' },
			{ value: 42, label: 'کمپین در سال گذشته' },
			{ value: 7, label: 'سال تجربه' },
		], { style: 'plain', columns: '4' }),
	]),
	section({ space: 'md' }, [
		heading({ eyebrow: 'اصول ما', title: 'چهار *قول* به هر مشتری' }),
		L.features([
			{ icon: 'chart', title: 'گزارش با عدد فروش', text: 'لایک و بازدید را گزارش می‌کنیم، اما هیچ‌وقت به‌جای فروش.' },
			{ icon: 'lock', title: 'حساب‌ها مال شماست', text: 'همه‌ی حساب‌های تبلیغاتی و محتوا به نام کسب‌وکار شما ساخته می‌شوند.' },
			{ icon: 'shield', title: 'صداقت درباره‌ی بودجه', text: 'اگر بودجه با هدف نخواند، همان روز اول می‌گوییم.' },
			{ icon: 'clock', title: 'پاسخ در همان روز', text: 'هر مشتری یک مدیر حساب دارد که در ساعت کاری همان روز جواب می‌دهد.' },
		], { layout: 'grid', style: 'plain', columns: '4', icon_style: 'soft' }),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		heading({ eyebrow: 'تیم', title: 'چند نفر از *ما*' }),
		L.team([
			{ photo: {}, name: 'لیلا پارسا', role: 'هم‌بنیان‌گذار، مدیر استراتژی' },
			{ photo: {}, name: 'امیرحسین راد', role: 'هم‌بنیان‌گذار، تبلیغات کلیکی' },
			{ photo: {}, name: 'هانیه موسوی', role: 'مدیر خلاقیت' },
			{ photo: {}, name: 'پویا کریمی', role: 'متخصص سئو' },
			{ photo: {}, name: 'سمانه نوری', role: 'سرپرست محتوا' },
			{ photo: {}, name: 'مهدی فرهادی', role: 'تحلیلگر داده' },
		], { columns: '3' }),
	]),
	L.cta({
		title: 'با ما *قهوه* بخورید.',
		desc: 'دفتر ما در تهران است، اما بیشتر جلسه‌ها آنلاین برگزار می‌شوند. هر کدام راحت‌ترید.',
		btn1_text: 'هماهنگی جلسه', btn1_link: link('{{page:contact}}'),
		look: 'inverse',
		decor: 'grid',
		note: '',
	}),
];

/* ---------------- Contact ---------------- */

const contact = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'تماس با ما', title: 'ممیزی رایگان،\n*در دو دقیقه*', title_tag: 'h1', title_size: 'xl', desc: 'سه سؤال کوتاه را جواب بدهید؛ تا دو ساعت کاری آینده تماس می‌گیریم. اگر ترجیح می‌دهید، مستقیم زنگ بزنید.' }),
	]),
	section({ space: 'md' }, [
		cols({ widths: [60, 40], gap: 56 }, [
			[L.leadForm(LEAD)],
			[L.contactInfo([
				{ icon: 'phone', label: 'تلفن', value: '۰۲۱-۸۸۵۵۴۴۲۰', link: link('tel:+982188554420') },
				{ icon: 'whatsapp', label: 'واتس‌اپ', value: '۰۹۱۲ ۴۴۰ ۲۲۱۰', link: link('https://wa.me/989124402210', true) },
				{ icon: 'mail', label: 'ایمیل', value: 'hello@tapesh.agency', link: link('mailto:hello@tapesh.agency') },
				{ icon: 'pin', label: 'دفتر', value: 'تهران، خیابان شریعتی، بالاتر از میرداماد، ساختمان ۱۸۰، طبقه‌ی ۴', link: link('') },
				{ icon: 'clock', label: 'ساعت کاری', value: 'شنبه تا چهارشنبه، ۹ تا ۱۸', link: link('') },
			])],
		], ),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *تماس*' })],
			[L.faq(FAQ.slice(0, 4))],
		]),
	]),
];

/* ---------------- Blog ---------------- */

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

/* ---------------- Shop: packages and digital products ---------------- */

const products = [
	{ key: 'p-seo-audit', title: 'ممیزی کامل سئو', slug: 'seo-audit', price: 4900000, sku: 'TP-SEO-AUD', image: 'product-1', terms: ['pcat-service'], virtual: true, featured: true,
		excerpt: 'گزارش ۴۰ صفحه‌ای وضعیت فنی، محتوا و رقبا، همراه با فهرست اولویت‌دار کارها.',
		content: L.productBody(['ممیزی شامل بررسی فنی سایت، سرعت، ساختار محتوا، کلمات کلیدی و مقایسه با سه رقیب اصلی است.', 'گزارش را در یک جلسه‌ی یک‌ساعته با شما مرور می‌کنیم تا بدانید از کجا شروع کنید.'], [['زمان تحویل', '۷ روز کاری'], ['خروجی', 'گزارش PDF و فایل اکسل کارها'], ['جلسه‌ی مرور', 'یک ساعت، آنلاین']]) },
	{ key: 'p-instagram', title: 'مدیریت اینستاگرام — ماهانه', slug: 'instagram-management', price: 18000000, sku: 'TP-IG-M', image: 'product-2', terms: ['pcat-service'], virtual: true, featured: true,
		excerpt: 'تقویم محتوا، ۱۲ پست و ۸ ریلز در ماه، مدیریت دایرکت و گزارش ماهانه.',
		content: L.productBody(['تیم محتوای ما برای کسب‌وکار شما تقویم ماهانه می‌نویسد، تولید می‌کند و منتشر می‌کند.', 'گزارش ماهانه فقط آمار دنبال‌کننده نیست؛ اثر محتوا روی پیام‌ها و سفارش‌ها را هم نشان می‌دهد.'], [['محتوای ماهانه', '۱۲ پست و ۸ ریلز'], ['پاسخ دایرکت', 'روزهای کاری'], ['گزارش', 'ماهانه']]) },
	{ key: 'p-google-ads', title: 'راه‌اندازی کمپین گوگل ادز', slug: 'google-ads-setup', price: 12000000, sale_price: 9900000, sku: 'TP-GADS', image: 'product-3', terms: ['pcat-service'], virtual: true, featured: true,
		excerpt: 'ساختار کمپین، کلمات کلیدی، متن تبلیغ و ردیابی تبدیل؛ آماده‌ی اجرا در یک هفته.',
		content: L.productBody(['کمپین را از صفر یا بر پایه‌ی حساب فعلی شما می‌سازیم و ردیابی تبدیل را تا مرحله‌ی سفارش راه می‌اندازیم.', 'یک ماه پشتیبانی و بهینه‌سازی پس از راه‌اندازی در قیمت گنجانده شده است.'], [['زمان راه‌اندازی', '۷ روز کاری'], ['پشتیبانی', 'یک ماه'], ['بودجه‌ی تبلیغات', 'جداگانه']]) },
	{ key: 'p-brand-kit', title: 'کیت هویت بصری', slug: 'brand-identity-kit', price: 35000000, sku: 'TP-BRAND', image: 'product-4', terms: ['pcat-service'], virtual: true,
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

module.exports = {
	manifest: {
		id: 'agency',
		order: 2,
		title: 'تپش',
		desc: 'آژانس دیجیتال مارکتینگ؛ صفحه‌ی فرود تبدیل‌محور، فرم ممیزی چندمرحله‌ای، نمونه‌کار با عدد و حالت تاریک کامل.',
		kit: 'pulse',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: ['woocommerce'],
		tags: ['آژانس', 'دیجیتال مارکتینگ', 'خدمات'],
		pages: ['خانه', 'خانه — مدل دوم', 'خدمات', 'نمونه‌کارها', 'درباره‌ی ما', 'تماس با ما', 'وبلاگ', 'فروشگاه'],
	},
	content: {
		site: { title: 'تپش', tagline: 'آژانس دیجیتال مارکتینگ' },
		images,
		alts,
		terms,
		posts,
		products,
		pages: [
			{ key: 'home', title: 'خانه', slug: 'home', elementor: homeA, settings: L.pageSettings({ header: 'transparent' }) },
			{ key: 'home-2', title: 'خانه — مدل دوم', slug: 'home-2', elementor: homeB, settings: L.pageSettings({ header: 'transparent' }) },
			{ key: 'services', title: 'خدمات', slug: 'services', elementor: services, settings: L.pageSettings() },
			{ key: 'work', title: 'نمونه‌کارها', slug: 'work', elementor: work, settings: L.pageSettings() },
			{ key: 'about', title: 'درباره‌ی ما', slug: 'about', elementor: about, settings: L.pageSettings() },
			{ key: 'contact', title: 'تماس با ما', slug: 'contact', elementor: contact, settings: L.pageSettings() },
			{ key: 'blog', title: 'وبلاگ', slug: 'blog', content: '' },
		],
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'تپش — صفحه‌ی فرود' },
			{ key: 'tpl-home-2', type: 'page', page: 'home-2', title: 'تپش — صفحه‌ی اصلی، مدل دوم' },
			{ key: 'tpl-services', type: 'page', page: 'services', title: 'تپش — خدمات' },
			{ key: 'tpl-work', type: 'page', page: 'work', title: 'تپش — نمونه‌کارها' },
			{ key: 'tpl-about', type: 'page', page: 'about', title: 'تپش — درباره‌ی ما' },
			{ key: 'tpl-contact', type: 'page', page: 'contact', title: 'تپش — تماس با ما' },
			{ key: 'tpl-bento', type: 'section', page: 'home', index: 3, title: 'تپش — مسئله و راه‌حل (بنتو)' },
			{ key: 'tpl-tabs', type: 'section', page: 'home', index: 4, title: 'تپش — خدمات با زبانه' },
			{ key: 'tpl-hscroll', type: 'section', page: 'home', index: 5, title: 'تپش — اسکرول افقی نمونه‌کارها' },
			{ key: 'tpl-path', type: 'section', page: 'home', index: 7, title: 'تپش — مسیر اسکرول روش کار' },
			{ key: 'tpl-pricing', type: 'section', page: 'home', index: 9, title: 'تپش — تعرفه با ظرفیت محدود' },
			{ key: 'tpl-audit', type: 'section', page: 'home', index: 11, title: 'تپش — فرم ممیزی چندمرحله‌ای' },
			{ key: 'tpl-zoom', type: 'section', page: 'home-2', index: 1, title: 'تپش — شوریل با زوم اسکرول' },
			{ key: 'tpl-stack', type: 'section', page: 'home-2', index: 3, title: 'تپش — کارت‌های پشته‌ای نمونه‌کار' },
		],
		menus: [
			{
				name: 'تپش — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home', children: [{ title: 'صفحه‌ی فرود', page: 'home' }, { title: 'مدل دوم', page: 'home-2' }] },
					{ title: 'خدمات', page: 'services' },
					{ title: 'نمونه‌کارها', page: 'work' },
					{ title: 'فروشگاه', url: '{{shop}}' },
					{ title: 'وبلاگ', page: 'blog' },
					{ title: 'درباره‌ی ما', page: 'about' },
				],
			},
			{
				name: 'تپش — پابرگ', location: 'footer', items: [
					{ title: 'خدمات', page: 'services' },
					{ title: 'نمونه‌کارها', page: 'work' },
					{ title: 'وبلاگ', page: 'blog' },
					{ title: 'تماس با ما', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 38,
			header_layout: 'split',
			header_cta_text: 'ممیزی رایگان',
			header_cta_url: '{{page:contact}}',
			footer_about: 'تپش آژانس دیجیتال مارکتینگ است: سئو، تبلیغات کلیکی، شبکه‌های اجتماعی و برندینگ، با گزارشی که هر هفته به عدد فروش وصل است.',
			footer_copyright: 'تمام حقوق برای آژانس تپش محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'linkedin', url: 'https://linkedin.com/' }, { network: 'telegram', url: 'https://t.me/' }],
			mobile_bar: true,
			mobile_bar_text: 'ممیزی رایگان',
			mobile_bar_url: '{{page:contact}}',
			mobile_bar_phone: '02188554420',
			mobile_bar_whatsapp: '09124402210',
			cursor: false,
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
