/**
 * Demo: Hamoon Industries — process-control equipment (Industrial kit), built
 * as a complete corporate site with a catalogue: two home pages, product
 * families, services, industries, quality and certificates, about, careers,
 * FAQ, a three-step quote request and a knowledge base; six products in four
 * families.
 */
'use strict';

const L = require('../lib');
const { img, link, px, w, section, cols, heading, button, fx } = L;

const images = { logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp', hall: 'images/hall.webp', plant: 'images/plant.webp', workbench: 'images/workbench.webp' };
for (let i = 1; i <= 6; i++) { images['product-' + i] = 'images/product-' + i + '.webp'; images['product-' + i + '-b'] = 'images/product-' + i + '-b.webp'; images['drawing-' + i] = 'images/drawing-' + i + '.webp'; }

const alts = {
	hall: 'سالن تولید کارخانه‌ی هامون در نور صبح، با ستون‌های فولادی و خرپاهای سقف',
	plant: 'نور صبح از پنجره‌های بلند روی کف بتنی سالن مونتاژ',
	workbench: 'سالن آزمون در شیفت شب، زیر چراغ‌های سقفی',
	'product-1': 'پنل کنترل لمسی HCP-7', 'product-2': 'گیج فشار PG-160', 'product-3': 'شیر توپی BV-50',
	'product-4': 'پمپ سانتریفیوژ CP-15', 'product-5': 'کنترلر PLC-X8', 'product-6': 'دبی‌سنج FM-200',
};

const shopUrl = '{{shop}}';
const rfqUrl = '{{page:contact}}';

const LINES = [
	{ image: img('product-1'), label: 'اتوماسیون', title: 'پنل کنترل HCP-7', text: 'نمایشگر لمسی ۷ اینچ صنعتی با نمودار زنده‌ی فشار و دکمه‌ی توقف اضطراری.', link: link('{{product:hcp-7}}') },
	{ image: img('product-2'), label: 'ابزار دقیق', title: 'گیج فشار PG-160', text: 'قاب استیل، شیشه‌ی ایمنی و دقت کلاس ۱٫۰ برای خطوط تا ۱۶ بار.', link: link('{{product:pg-160}}') },
	{ image: img('product-3'), label: 'شیرآلات', title: 'شیر توپی BV-50', text: 'بدنه‌ی چدن داکتیل، فلنج استاندارد و آب‌بندی PTFE.', link: link('{{product:bv-50}}') },
	{ image: img('product-4'), label: 'پمپ', title: 'پمپ سانتریفیوژ CP-15', text: 'الکتروموتور ۱۵ کیلووات، پروانه‌ی بالانس‌شده و شاسی یکپارچه.', link: link('{{product:cp-15}}') },
	{ image: img('product-5'), label: 'اتوماسیون', title: 'کنترلر PLC-X8', text: 'هشت ماژول ورودی و خروجی روی ریل DIN با نشانگر وضعیت هر کانال.', link: link('{{product:plc-x8}}') },
	{ image: img('product-6'), label: 'ابزار دقیق', title: 'دبی‌سنج FM-200', text: 'اندازه‌گیری الکترومغناطیسی دبی با خروجی ۴ تا ۲۰ میلی‌آمپر.', link: link('{{product:fm-200}}') },
];

const QUOTES = [
	{ quote: 'گیج‌ها و شیرهای هامون را سه سال است در خط تصفیه‌ی آب استفاده می‌کنیم. مهم‌تر از کیفیت، پاسخ‌گویی تیم فنی‌شان در شیفت شب است.', name: 'مهندس علیرضا توکلی', role: 'سرپرست تعمیرات، شرکت آب منطقه‌ای' },
	{ quote: 'پنل کنترل را دقیقاً با نقشه‌ی خط ما ساختند و راه‌اندازی در دو روز تمام شد. مستندات کامل تحویل دادند که کمتر می‌بینیم.', name: 'مهندس نسرین فاضلی', role: 'مدیر فنی، کارخانه‌ی لبنیات' },
	{ quote: 'قطعه‌ی یدکی پمپ را دو روزه رساندند. برای خطی که نباید بخوابد، همین تفاوت اصلی است.', name: 'مهندس حمید شاکری', role: 'مدیر تولید، صنایع سیمان' },
];

const FAQ = [
	['زمان تحویل سفارش‌ها چقدر است؟', 'محصولات استاندارد معمولاً از انبار و تا پنج روز کاری ارسال می‌شوند. پنل‌های کنترل و سفارش‌های اختصاصی بسته به پیچیدگی بین سه تا هشت هفته زمان می‌برند.'],
	['گارانتی محصولات چگونه است؟', 'همه‌ی محصولات ۱۸ ماه گارانتی ساخت دارند. پمپ‌ها و پنل‌های کنترل در صورت نصب توسط تیم ما ۲۴ ماه گارانتی می‌شوند.'],
	['آیا نصب و راه‌اندازی هم انجام می‌دهید؟', 'بله. تیم نصب و راه‌اندازی ما در سراسر کشور اعزام می‌شود و پس از راه‌اندازی، آموزش اپراتورها را هم انجام می‌دهد.'],
	['برگه‌ی مشخصات فنی و گواهی کالیبراسیون ارائه می‌کنید؟', 'برای هر محصول برگه‌ی مشخصات فنی و برای ابزار دقیق گواهی کالیبراسیون قابل ردیابی همراه بار ارسال می‌شود.'],
	['امکان ساخت سفارشی بر اساس نقشه‌ی ما هست؟', 'بله. واحد طراحی ما بر اساس نقشه یا مشخصات شما پیشنهاد فنی و مالی می‌دهد و پیش از ساخت، نقشه‌های اجرایی را برای تأیید ارسال می‌کند.'],
];

const RFQ = {
	need_label: 'محصول',
	need_title: 'به چه تجهیزاتی نیاز دارید؟',
	need_desc: 'هر چند گروه که لازم است انتخاب کنید.',
	choices: [
		{ label: 'پنل و تابلوی کنترل', note: 'HMI، PLC، تابلوی برق', icon: 'cpu' },
		{ label: 'ابزار دقیق', note: 'گیج، دبی‌سنج، ترانسمیتر', icon: 'gauge' },
		{ label: 'شیرآلات صنعتی', note: 'توپی، کشویی، کنترلی', icon: 'sliders' },
		{ label: 'پمپ و الکتروموتور', note: 'سانتریفیوژ و فرایندی', icon: 'cog' },
		{ label: 'خدمات و تعمیرات', note: 'نصب، کالیبراسیون، تعمیر', icon: 'wrench' },
		{ label: 'پروژه‌ی کامل', note: 'طراحی تا راه‌اندازی', icon: 'factory' },
	],
	multi: 'yes',
	budget_on: 'yes',
	budget_label: 'جزئیات',
	budget_title: 'حجم سفارش تقریباً چقدر است؟',
	budgets: 'یک یا چند قلم\nسفارش عمده برای یک خط\nتجهیز کامل یک واحد\nفعلاً در حال برآورد هستیم',
	timeline_on: 'yes',
	timeline_title: 'زمان نیاز',
	timelines: 'فوری، کمتر از دو هفته\nیک تا دو ماه آینده\nبرای پروژه‌ی آینده',
	contact_label: 'اطلاعات تماس',
	contact_title: 'پیش‌فاکتور را برای چه کسی بفرستیم؟',
	show_name: 'yes', label_name: 'نام و نام خانوادگی',
	show_phone: 'yes', label_phone: 'شماره‌ی موبایل',
	show_email: 'yes', label_email: 'ایمیل', req_email: '',
	show_company: 'yes', label_company: 'نام شرکت یا کارخانه', req_company: 'yes',
	show_message: 'yes', label_message: 'مشخصات فنی یا توضیحات', req_message: '',
	next_text: 'ادامه', back_text: 'قبلی', submit_text: 'درخواست پیش‌فاکتور',
	done_title: 'درخواست شما ثبت شد',
	done_text: 'کارشناس فروش تا پایان همین روز کاری تماس می‌گیرد. اگر نقشه یا برگه‌ی مشخصات دارید، آن را به sales@hamoon-ind.ir بفرستید.',
	done_btn_text: 'دیدن محصولات', done_btn_link: link('{{shop}}'), done_btn_style: 'secondary',
	remember: 'yes', boxed: 'yes', columns: '2',
};

/* ---------------- Shared blocks ---------------- */

const SERVICES = [
	{ icon: 'compass', title: 'مشاوره و طراحی', text: 'انتخاب تجهیزات بر اساس سیال، فشار، دما و استانداردهای پروژه.', meta: 'ENG' },
	{ icon: 'factory', title: 'ساخت سفارشی', text: 'پنل‌ها و تابلوهای کنترل بر اساس نقشه و منطق کنترلی خط شما.', meta: 'FAB' },
	{ icon: 'wrench', title: 'نصب و راه‌اندازی', text: 'اعزام تیم به سراسر کشور و آموزش اپراتورها در محل.', meta: 'SITE' },
	{ icon: 'gauge', title: 'کالیبراسیون', text: 'کالیبراسیون دوره‌ای ابزار دقیق با گواهی قابل ردیابی.', meta: 'CAL' },
	{ icon: 'shield', title: 'گارانتی ۱۸ ماهه', text: 'گارانتی ساخت برای همه‌ی محصولات و ۲۴ ماه با نصب توسط ما.', meta: 'WAR' },
	{ icon: 'truck', title: 'قطعه‌ی یدکی', text: 'انبار قطعات پرمصرف و ارسال ۴۸ ساعته برای خطوط تحت قرارداد.', meta: 'PART' },
];

const STEPS = [
	{ marker: '۰۱', icon: 'search', title: 'بازدید و نیازسنجی', text: 'کارشناس ما شرایط خط را بررسی و مشخصات فنی را مستند می‌کند.' },
	{ marker: '۰۲', icon: 'pen', title: 'پیشنهاد فنی و مالی', text: 'نقشه‌ها، فهرست تجهیزات و زمان‌بندی را برای تأیید ارسال می‌کنیم.' },
	{ marker: '۰۳', icon: 'factory', title: 'ساخت و آزمون', text: 'ساخت در کارخانه و آزمون کامل پیش از ارسال، با حضور ناظر شما.' },
	{ marker: '۰۴', icon: 'bolt', title: 'نصب و تحویل', text: 'نصب، راه‌اندازی، آموزش و تحویل مستندات کامل.' },
];

const LAYERS = [
	{ eyebrow: 'LAYER 01 · FIELD', title: 'ابزار دقیق و شیرآلات', text: 'لایه‌ای که مستقیماً با سیال در تماس است: اندازه می‌گیرد و جریان را کنترل می‌کند.', points: 'گیج فشار PG-160\nدبی‌سنج FM-200\nشیر توپی BV-50', image: img('product-2'), btn_text: 'ابزار دقیق', btn_link: link('{{termlink:pcat-instrument}}'), tone: '' },
	{ eyebrow: 'LAYER 02 · POWER', title: 'پمپ و محرکه', text: 'قلب خط: پمپ‌های سانتریفیوژ و الکتروموتورهایی که برای کار مداوم ساخته شده‌اند.', points: 'پمپ CP-15\nشاسی یکپارچه\nپروانه‌ی بالانس‌شده', image: img('product-4-b'), btn_text: 'مشخصات CP-15', btn_link: link('{{product:cp-15}}'), tone: 'inverse' },
	{ eyebrow: 'LAYER 03 · CONTROL', title: 'کنترل و نمایش', text: 'مغز خط: کنترلرها و پنل‌هایی که همه‌چیز را هماهنگ می‌کنند و به اپراتور نشان می‌دهند.', points: 'کنترلر PLC-X8\nپنل لمسی HCP-7\nهشدار پیش از توقف', image: img('product-1'), btn_text: 'کنترل و اتوماسیون', btn_link: link('{{termlink:pcat-control}}'), tone: 'accent' },
];

const INDUSTRIES = [
	{ title: 'آب و فاضلاب', subtitle: 'ایستگاه‌های پمپاژ و تصفیه', meta: '۰۱', image: img('drawing-5'), panel_title: 'پمپاژ پایدار، شبانه‌روز', panel_text: 'پمپ‌های سانتریفیوژ، شیرهای توپی و دبی‌سنج‌های الکترومغناطیسی برای ایستگاه‌های پمپاژ و تصفیه‌خانه‌ها، با پنل کنترل از راه دور.', chips: 'CP-15، BV-50، FM-200', btn_text: 'مشاوره برای پروژه', btn_link: link(rfqUrl) },
	{ title: 'صنایع غذایی', subtitle: 'بهداشتی و قابل شست‌وشو', meta: '۰۲', image: img('drawing-6'), panel_title: 'استیل، دقیق، قابل ردیابی', panel_text: 'ابزار دقیق با قطعات در تماس از جنس استیل ۳۱۶ و گواهی کالیبراسیون، برای خطوط لبنیات، نوشیدنی و کنسرو.', chips: 'PG-160، FM-200', btn_text: 'مشاوره برای پروژه', btn_link: link(rfqUrl) },
	{ title: 'پتروشیمی', subtitle: 'فشار و دمای بالا', meta: '۰۳', image: img('drawing-3'), panel_title: 'برای سخت‌ترین شرایط', panel_text: 'شیرآلات و ابزار دقیق مناسب سیالات خورنده و محیط‌های پرخطر، با مستندات کامل برای بازرسی.', chips: 'BV-50، PG-160', btn_text: 'مشاوره برای پروژه', btn_link: link(rfqUrl) },
	{ title: 'سیمان و معدن', subtitle: 'گرد و غبار و لرزش', meta: '۰۴', image: img('drawing-4'), panel_title: 'مقاوم در برابر محیط', panel_text: 'تابلوها و کنترلرهایی با درجه‌ی حفاظت بالا و طراحی مقاوم در برابر لرزش، برای کار مداوم در خطوط سنگین.', chips: 'PLC-X8، HCP-7', btn_text: 'مشاوره برای پروژه', btn_link: link(rfqUrl) },
];

const figures = (style = 'plain') => L.counters([
	{ value: 28, label: 'سال ساخت', desc: 'از کارگاه کوچک تا کارخانه' },
	{ value: 900, suffix: '+', label: 'پروژه', desc: 'در ۲۶ استان' },
	{ value: 1.0, label: 'کلاس دقت', desc: 'ابزار دقیق کالیبره‌شده' },
	{ value: 48, suffix: ' ساعت', label: 'ارسال قطعه', desc: 'برای خطوط تحت قرارداد' },
], { style, columns: '4' });

const rfqCta = (title = 'مشخصات خط را بفرستید،\n*پیش‌فاکتور* بگیرید', desc = 'در همان روز کاری پاسخ می‌دهیم؛ با فهرست تجهیزات، زمان تحویل و قیمت.') => L.cta({
	eyebrow: 'استعلام قیمت', title, desc,
	btn1_text: 'درخواست پیش‌فاکتور', btn1_link: link(rfqUrl), btn2_text: 'تماس با فروش', btn2_link: link('tel:+982144009280'),
	look: 'image', image: img('workbench'), decor: '', rounded: '', note: '',
});

/* ---------------- Home ---------------- */

const home = [
	L.bleed(w('hm-hero', {
		layout: 'split', title_tag: 'h1', title_size: 'xl', header_align: 'start', title_reveal: 'words',
		eyebrow: 'صنایع هامون · از ۱۳۷۶',
		title: 'تجهیزات کنترل فرایند،\n*ساخت ایران*',
		desc: 'پنل‌های کنترل، ابزار دقیق، شیرآلات و پمپ‌های صنعتی برای خطوطی که نباید از کار بیفتند؛ طراحی و ساخت در کارخانه‌ی خودمان، با پشتیبانی شبانه‌روزی.',
		btn1_text: 'درخواست پیش‌فاکتور', btn1_link: link(rfqUrl), btn1_style: 'primary',
		btn2_text: 'کاتالوگ محصولات', btn2_link: link(shopUrl), btn2_style: 'secondary',
		stats: [
			{ value: '۲۸', label: 'سال تجربه' },
			{ value: '۹۰۰+', label: 'پروژه‌ی اجراشده' },
			{ value: '۲۴/۷', label: 'پشتیبانی فنی' },
		],
		media_type: 'image', image: img('hall'), media_ratio: 'landscape', height: 'auto', decor: '', hint: '',
	})),
	L.marquee(['پتروشیمی', 'نفت و گاز', 'آب و فاضلاب', 'صنایع غذایی', 'سیمان', 'نیروگاه', 'داروسازی'], { look: 'muted', size: 'sm', separator: 'dot', speed: px(40), bordered: 'yes' }),
	section({ space: 'md', gap: 32, cards: 'cascade' }, [
		L.productCategories(['control-automation', 'instrumentation', 'valves', 'pumps'], { eyebrow: 'خانواده‌های محصول', title: 'چهار خانواده،\n*یک خط کامل*', more_text: 'همه‌ی محصولات', more_link: link(shopUrl) }),
	]),
	section({ space: 'md', gap: 32 }, [
		L.productCarousel({ eyebrow: 'پرفروش‌ها', title: 'از انبار، *آماده‌ی ارسال*', source: 'featured', card_parts: ['badges', 'hover'], more_text: 'کاتالوگ کامل', more_link: link(shopUrl) }),
	]),
	section({ space: 'none', gap: 0, zoom: 'expand', zoomAmount: 0.24, zoomInner: true, zoomRadius: 4 }, [
		L.imageReveal('plant', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	fx(section({ space: 'md', gap: 32, width: 1000 }, [
		L.textScrub('خطی که می‌خوابد، هر ساعتش هزینه دارد. برای همین تجهیزاتی می‌سازیم که *سال‌ها بی‌صدا کار کنند*، و تیمی داریم که اگر روزی صدایشان درآمد، *در همان شیفت* برسد.', { eyebrow: 'اصل ما', size: 'md' }),
	]), { tone: 'surface' }),
	section({ space: 'md', gap: 32 }, [
		heading({ eyebrow: 'سه لایه‌ی یک خط', title: 'از سیال\n*تا صفحه‌ی اپراتور*' }),
		L.stack(LAYERS),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'خدمات', title: 'فقط فروش نیست؛ *همراهی* است', header_align: 'center' }),
		L.features(SERVICES, { layout: 'grid', style: 'cards', columns: '3', icon_style: 'tile' }),
	]), { cards: 'cascade' }),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64, align: 'center' }, [
			[heading({ eyebrow: 'در یک نگاه', title: 'بیست‌وهشت سال\n*ساختن*' }), button('درباره‌ی هامون', '{{page:about}}', 'secondary')],
			[figures('plain')],
		]),
	]), { tone: 'inverse' }),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'روند پروژه', title: 'چهار مرحله تا *خط آماده*' }),
		L.steps(STEPS, { layout: 'h', cards: 'yes' }),
	]),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'از زبان مشتریان', title: 'خطوطی که *کار می‌کنند*', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'دانشنامه', title: 'نوشته‌های *تیم مهندسی*' })],
			[button('همه‌ی نوشته‌ها', '{{blog}}', 'secondary', { _flex_align_self: 'flex-end' })],
		]),
		L.posts({ count: 3, layout: 'grid', columns: '3', excerpt: 'yes' }),
	]),
	rfqCta(),
];

/* ---------------- Home, second version ---------------- */

const home2 = [
	L.slider([
		{ image: img('hall'), eyebrow: 'صنایع هامون', title: 'کنترل کامل خط،\n*ساخت ایران*', text: 'از ابزار دقیق تا پنل کنترل؛ طراحی، ساخت، نصب و پشتیبانی زیر یک سقف.', btn_text: 'کاتالوگ محصولات', url: shopUrl },
		{ image: img('plant'), eyebrow: 'کارخانه', title: 'دوازده هزار متر،\n*یک خط آزمون*', text: 'هر دستگاه پیش از ارسال، روی خط آزمون کار می‌کند.', btn_text: 'کیفیت و گواهی‌ها', url: '{{page:quality}}' },
		{ image: img('workbench'), eyebrow: 'پشتیبانی', title: 'در همان *شیفت*', text: 'تیم فنی شبانه‌روزی و ارسال ۴۸ ساعته‌ی قطعه.', btn_text: 'خدمات', url: '{{page:services}}' },
	]),
	section({ space: 'md', gap: 40 }, [L.tabs(INDUSTRIES, { autoplay: 7, media_side: 'start' })]),
	section({ space: 'sm', gap: 0 }, [
		L.con({ content_width: 'full', css_classes: 'hm-scheme-inverse', padding: L.pad(48, 48, 40) }, [figures('plain')], true),
	]),
	section({ space: 'md', gap: 32 }, [
		L.productCarousel({ eyebrow: 'کاتالوگ', title: 'همه‌ی *محصولات*', layout: 'grid', columns: '3', count: 6, card_parts: ['badges', 'hover'], more_text: 'فروشگاه', more_link: link(shopUrl) }),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *سفارش*' }), button('همه‌ی پرسش‌ها', '{{page:faq}}', 'secondary')],
			[L.faq(FAQ.slice(0, 4), { style: 'lines' })],
		]),
	]), { tone: 'surface' }),
	rfqCta(),
];

/* ---------------- Products overview ---------------- */

const families = [
	L.pageHead('خانواده‌های محصول', 'از ابزار دقیق\n*تا اتوماسیون*', 'هر محصول را می‌توانید جداگانه یا به‌عنوان بخشی از یک پروژه‌ی کامل سفارش دهید. برگه‌ی مشخصات و نقشه‌ی هر محصول در صفحه‌ی همان محصول است.'),
	L.hscroll({ eyebrow: 'خطوط محصول', title: 'شش محصول،\n*یک کاتالوگ*', desc: '', items: LINES, card_size: 'md', card_style: 'card', btn1_text: 'کاتالوگ کامل', btn1_link: link(shopUrl), scheme: '' }),
	...[['کنترل و اتوماسیون', 'control-automation', 'پنل‌ها و کنترلرهایی که خط را هماهنگ می‌کنند.'], ['ابزار دقیق', 'instrumentation', 'گیج‌ها و دبی‌سنج‌هایی که اندازه می‌گیرند.'], ['شیرآلات', 'valves', 'شیرهایی که جریان را قطع و وصل می‌کنند.'], ['پمپ', 'pumps', 'پمپ‌هایی که برای کار مداوم ساخته شده‌اند.']].map(([t, slug, d], i) => fx(section({ space: 'md', gap: 32 }, [
		L.productCarousel({ eyebrow: 'خانواده', title: t, desc: d, category: [slug], layout: 'grid', columns: '3', card_parts: ['badges', 'hover'], more_text: 'همه‌ی ' + t, more_link: link(shopUrl + '?product_cat=' + slug) }),
	]), i % 2 ? { tone: 'surface' } : {})),
	rfqCta(),
];

/* ---------------- Services ---------------- */

const services = [
	L.pageHead('خدمات', 'از نقشه\n*تا راه‌اندازی*', 'خدمات مهندسی، ساخت سفارشی، نصب، کالیبراسیون و پشتیبانی؛ برای خطوطی که هامون ساخته و خطوطی که نساخته.'),
	section({ space: 'md', gap: 40, cards: 'cascade' }, [L.features(SERVICES, { layout: 'grid', style: 'cards', columns: '3', icon_style: 'tile' })]),
	section({ space: 'sm', zoom: 'expand', zoomAmount: 0.2, zoomInner: true, zoomRadius: 4 }, [
		L.imageReveal('workbench', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'روند پروژه', title: 'چهار مرحله تا *خط آماده*', header_align: 'center' }),
		L.steps(STEPS, { layout: 'h', cards: 'yes' }),
	]), { tone: 'surface' }),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'قرارداد پشتیبانی', title: 'برای خطوطی که\n*نباید بخوابند*' })],
			[L.features([
				{ icon: '', title: 'پاسخ تلفنی شبانه‌روزی', text: 'با مهندس، نه با منشی.', meta: '۲۴/۷' },
				{ icon: '', title: 'اعزام تیم', text: 'در تهران و استان‌های همجوار.', meta: '۲۴ ساعت' },
				{ icon: '', title: 'ارسال قطعه از انبار', text: 'قطعات پرمصرف خط شما، رزروشده.', meta: '۴۸ ساعت' },
				{ icon: '', title: 'بازدید پیشگیرانه', text: 'هر فصل یک بار، با گزارش مکتوب.', meta: 'فصلی' },
			], { layout: 'list', style: 'plain', numbered: '', icon_style: 'plain' })],
		]),
	]),
	rfqCta('خدمات را برای خط شما\n*برآورد کنیم*'),
];

/* ---------------- Industries ---------------- */

const industries = [
	L.pageHead('صنایع', 'هر صنعت،\n*مشخصات خودش*', 'نُهصد پروژه در بیست‌وشش استان؛ از ایستگاه پمپاژ آب تا خط لبنیات و کارخانه‌ی سیمان.'),
	section({ space: 'md', gap: 40 }, [L.tabs(INDUSTRIES, { autoplay: 0, media_side: 'start' })]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'نمونه‌پروژه‌ها', title: 'چند خط که *ساختیم*', header_align: 'center' }),
		L.features([
			{ icon: 'drop', title: 'تصفیه‌خانه‌ی آب، اصفهان', text: 'شش پمپ CP-15، دبی‌سنج‌ها و پنل کنترل از راه دور.', meta: '۱۴۰۲' },
			{ icon: 'box', title: 'خط لبنیات، قزوین', text: 'ابزار دقیق استیل ۳۱۶ و کالیبراسیون فصلی.', meta: '۱۴۰۱' },
			{ icon: 'fire', title: 'واحد پتروشیمی، عسلویه', text: 'شیرآلات و گیج‌ها با مستندات بازرسی.', meta: '۱۴۰۰' },
			{ icon: 'cube', title: 'کارخانه‌ی سیمان، کرمان', text: 'تابلوهای کنترل ضدگرد و PLC-X8.', meta: '۱۳۹۹' },
		], { layout: 'grid', style: 'cards', columns: '4', icon_style: 'tile' }),
	]), { tone: 'surface', cards: 'cascade' }),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'از زبان مشتریان', title: 'خطوطی که *کار می‌کنند*', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]),
	rfqCta(),
];

/* ---------------- Quality ---------------- */

const quality = [
	L.pageHead('کیفیت و گواهی‌ها', 'هیچ دستگاهی\n*بدون آزمون* بیرون نمی‌رود', 'آزمون فشار، کالیبراسیون و تست عملکرد در شرایط واقعی؛ با گزارشی که همراه بار برایتان ارسال می‌شود.'),
	section({ space: 'sm', zoom: 'expand', zoomAmount: 0.2, zoomInner: true, zoomRadius: 4 }, [
		L.imageReveal('plant', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		L.features([
			{ icon: 'gauge', title: 'آزمون فشار', text: '۱٫۵ برابر فشار کاری، برای همه‌ی شیرها و پمپ‌ها.', meta: '۱۰۰٪' },
			{ icon: 'check', title: 'کالیبراسیون', text: 'با مرجع قابل ردیابی و گواهی همراه بار.', meta: 'CAL' },
			{ icon: 'clock', title: 'تست ۴۸ ساعته', text: 'برای پنل‌های کنترل، پیش از ارسال.', meta: '۴۸h' },
		], { layout: 'grid', style: 'cards', columns: '3', icon_style: 'tile' }),
	]), { cards: 'flip' }),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'گواهی‌ها و استانداردها', title: 'آنچه *ضمانت* می‌کنیم' }),
		L.features([
			{ icon: 'award', title: 'سیستم مدیریت کیفیت', text: 'فرایندهای طراحی، ساخت و خدمات بر اساس ایزو ۹۰۰۱.', meta: 'ISO 9001' },
			{ icon: 'shield', title: 'استاندارد ملی', text: 'محصولات مشمول، دارای پروانه‌ی کاربرد نشان استاندارد.', meta: 'INSO' },
			{ icon: 'gauge', title: 'آزمایشگاه کالیبراسیون', text: 'کالیبراسیون ابزار دقیق با مرجع قابل ردیابی.', meta: 'CAL LAB' },
			{ icon: 'leaf', title: 'مسئولیت محیط زیستی', text: 'بازیافت ضایعات فلزی و کاهش مصرف انرژی در تولید.', meta: 'ENV' },
		], { layout: 'grid', style: 'plain', columns: '4', icon_style: 'tile' }),
	]), { tone: 'surface', cards: 'cascade' }),
	section({ space: 'sm', gap: 0 }, [
		L.con({ content_width: 'full', css_classes: 'hm-scheme-inverse', padding: L.pad(48, 48, 40) }, [figures('plain')], true),
	]),
	rfqCta('از کارخانه\n*بازدید* کنید', 'هر چهارشنبه، با هماهنگی قبلی؛ خط آزمون را از نزدیک ببینید.'),
];

/* ---------------- About ---------------- */

const about = [
	L.pageHead('درباره‌ی هامون', 'از یک کارگاه\n*تراشکاری* تا کارخانه', 'هامون در ۱۳۷۶ با ساخت قطعات یدکی پمپ در کارگاهی دویست‌متری شروع شد. امروز در کارخانه‌ای دوازده‌هزارمتری، تجهیزات کنترل فرایند را طراحی و می‌سازیم.'),
	section({ space: 'sm', zoom: 'expand', zoomAmount: 0.18, zoomInner: true, zoomRadius: 4 }, [
		L.imageReveal('hall', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'مسیر ما', title: 'بیست‌وهشت سال\n*ساختن*' }),
		L.steps([
			{ marker: '۱۳۷۶', title: 'کارگاه قطعات پمپ', text: 'ساخت قطعات یدکی برای پمپ‌های وارداتی.' },
			{ marker: '۱۳۸۵', title: 'اولین پمپ کامل', text: 'طراحی و ساخت اولین پمپ سانتریفیوژ با نشان هامون.' },
			{ marker: '۱۳۹۴', title: 'واحد اتوماسیون', text: 'طراحی و ساخت پنل‌ها و تابلوهای کنترل.' },
			{ marker: '۱۴۰۲', title: 'کارخانه‌ی جدید', text: 'کارخانه‌ی ۱۲ هزار متری و آزمایشگاه کالیبراسیون.' },
		], { layout: 'h', cards: 'yes' }),
	]), { tone: 'surface', cards: 'cascade' }),
	section({ space: 'md', gap: 40, cards: 'cascade' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'مدیران', title: 'تیم *فنی و مدیریت*' })],
			[L.features([
				{ icon: '', title: 'مهندس جمشید هامونی', text: 'مدیرعامل و بنیان‌گذار' },
				{ icon: '', title: 'مهندس فرزانه راستین', text: 'مدیر فنی' },
				{ icon: '', title: 'مهندس کیوان ستاری', text: 'مدیر واحد اتوماسیون' },
				{ icon: '', title: 'مهندس الهام نیکزاد', text: 'مدیر کنترل کیفیت' },
			], { layout: 'grid', style: 'plain', columns: '2', icon_style: 'plain' })],
		]),
	]),
	rfqCta('از کارخانه\n*بازدید* کنید', 'هر چهارشنبه، با هماهنگی قبلی.'),
];

/* ---------------- Careers ---------------- */

const careers = [
	L.pageHead('فرصت‌های شغلی', 'با ما\n*بسازید*', 'به مهندسان و تکنسین‌هایی نیاز داریم که دوست دارند کارشان روی خط تولید دیده شود.'),
	fx(section({ space: 'md', gap: 40 }, [
		L.features([
			{ icon: 'cpu', title: 'مهندس اتوماسیون', text: 'برنامه‌نویسی PLC و طراحی صفحه‌ی HMI؛ دو سال سابقه.', meta: 'تهران · تمام‌وقت' },
			{ icon: 'gauge', title: 'تکنسین کالیبراسیون', text: 'کار با مرجع‌های فشار و دبی؛ آشنایی با ISO 17025.', meta: 'تهران · تمام‌وقت' },
			{ icon: 'wrench', title: 'کارشناس نصب و راه‌اندازی', text: 'سفرهای کاری کوتاه به سراسر کشور.', meta: 'سیار · تمام‌وقت' },
			{ icon: 'chart', title: 'کارشناس فروش فنی', text: 'آشنایی با ابزار دقیق و صنایع فرایندی.', meta: 'تهران · تمام‌وقت' },
		], { layout: 'list', style: 'plain', numbered: '', icon_style: 'tile' }),
	]), { cards: 'cascade' }),
	section({ space: 'md', gap: 40, width: 860 }, [
		heading({ eyebrow: 'درخواست همکاری', title: 'رزومه‌تان را *بفرستید*', header_align: 'center' }),
		L.contactForm({ show_phone: 'yes', label_phone: 'شماره‌ی موبایل', show_subject: 'yes', label_subject: 'عنوان شغلی', label_name: 'نام و نام خانوادگی', label_email: 'ایمیل', label_message: 'درباره‌ی خودتان و لینک رزومه', button: 'ارسال درخواست', success: 'درخواستتان رسید؛ ظرف یک هفته پاسخ می‌دهیم.' }),
	]),
];

/* ---------------- FAQ and contact ---------------- */

const faqPage = [
	L.pageHead('پرسش‌های متداول', 'پیش از *سفارش*', 'پاسخ پرسش‌هایی که بیشتر از همه می‌شنویم. اگر پرسشتان این‌جا نیست، با واحد فروش تماس بگیرید.'),
	section({ space: 'md', gap: 56 }, [
		cols({ widths: [30, 70], gap: 64 }, [
			[heading({ eyebrow: 'سفارش', title: 'تحویل و *گارانتی*', title_size: 'md' })],
			[L.faq(FAQ, { style: 'lines' })],
		]),
	]),
	rfqCta(),
];

const contact = [
	L.pageHead('تماس و استعلام قیمت', 'پیش‌فاکتور،\n*در همان روز کاری*', 'سه مرحله‌ی کوتاه را تکمیل کنید یا مستقیم با واحد فروش تماس بگیرید.'),
	section({ space: 'md', gap: 48 }, [
		cols({ widths: [36, 64], gap: 56 }, [
			[L.contactInfo([
				{ icon: 'phone', label: 'واحد فروش', value: '۰۲۱-۴۴۰۰۹۲۸۰', link: link('tel:+982144009280') },
				{ icon: 'mail', label: 'ایمیل فروش', value: 'sales@hamoon-ind.ir', link: link('mailto:sales@hamoon-ind.ir') },
				{ icon: 'pin', label: 'دفتر مرکزی و کارخانه', value: 'تهران، شهرک صنعتی شمس‌آباد، خیابان نهم، پلاک ۲۲', link: link('') },
				{ icon: 'clock', label: 'ساعت کاری', value: 'شنبه تا چهارشنبه ۸ تا ۱۷، پنج‌شنبه ۸ تا ۱۳', link: link('') },
			])],
			[L.leadForm(RFQ)],
		]),
	]),
];

/* ---------------- Knowledge base ---------------- */

const terms = [
	{ key: 'cat-guide', taxonomy: 'category', name: 'راهنمای انتخاب', slug: 'selection-guides' },
	{ key: 'cat-maint', taxonomy: 'category', name: 'نگهداری و تعمیرات', slug: 'maintenance' },
	{ key: 'cat-auto', taxonomy: 'category', name: 'اتوماسیون', slug: 'automation' },
	{ key: 'pcat-control', taxonomy: 'product_cat', name: 'کنترل و اتوماسیون', slug: 'control-automation', image: 'product-1', description: 'پنل‌های لمسی و کنترلرهای ماژولار.' },
	{ key: 'pcat-instrument', taxonomy: 'product_cat', name: 'ابزار دقیق', slug: 'instrumentation', image: 'product-2', description: 'گیج‌های فشار و دبی‌سنج‌ها.' },
	{ key: 'pcat-valve', taxonomy: 'product_cat', name: 'شیرآلات', slug: 'valves', image: 'product-3', description: 'شیرهای توپی و کشویی فلنج‌دار.' },
	{ key: 'pcat-pump', taxonomy: 'product_cat', name: 'پمپ', slug: 'pumps', image: 'product-4', description: 'پمپ‌های سانتریفیوژ صنعتی.' },
];

const posts = [
	{
		key: 'choose-pressure-gauge', title: 'انتخاب گیج فشار: پنج سؤال پیش از خرید', slug: 'choosing-a-pressure-gauge', image: 'drawing-6', terms: ['cat-guide'], days_ago: 4,
		excerpt: 'بازه‌ی فشار، جنس قطعات در تماس، اندازه‌ی صفحه، روش اتصال و نیاز به گلیسیرین.',
		content: L.article([
			'گیج فشار ساده‌ترین ابزار دقیق خط است و شاید به همین دلیل بیشتر از بقیه اشتباه انتخاب می‌شود. پیش از سفارش، جواب این پنج سؤال را داشته باشید.',
			['ol', ['فشار کاری عادی خط چقدر است؟ بازه‌ی گیج را طوری انتخاب کنید که فشار کاری در یک‌سوم میانی صفحه قرار بگیرد.', 'سیال چیست؟ برای سیالات خورنده، قطعات در تماس باید استیل یا با دیافراگم جداکننده باشند.', 'گیج از چه فاصله‌ای خوانده می‌شود؟ قطر صفحه‌ی ۱۰۰ برای تابلو، ۱۶۰ برای خواندن از دور.', 'اتصال از زیر است یا از پشت؟', 'خط لرزش یا ضربه‌ی فشار دارد؟ اگر بله، گیج پرشده با گلیسیرین بگیرید.']],
			['h', 'یک اشتباه رایج'],
			'انتخاب گیجی که بازه‌اش دقیقاً برابر فشار کاری است. در این حالت عقربه همیشه نزدیک انتهای صفحه است و دقت و عمر گیج هر دو کم می‌شود.',
		]),
	},
	{
		key: 'pump-maintenance', title: 'نگهداری پیشگیرانه‌ی پمپ سانتریفیوژ: چک‌لیست ماهانه', slug: 'centrifugal-pump-maintenance', image: 'drawing-5', terms: ['cat-maint'], days_ago: 10,
		excerpt: 'بیشتر خرابی‌های پمپ پیش از وقوع نشانه می‌دهند؛ این فهرست کمک می‌کند ببینیدشان.',
		content: L.article([
			'پمپی که ناگهان از کار می‌افتد، معمولاً هفته‌ها پیش نشانه داده است: صدای غیرعادی، لرزش یا نشتی کوچک. یک بازدید ماهانه‌ی بیست‌دقیقه‌ای بیشتر این نشانه‌ها را آشکار می‌کند.',
			['h', 'چک‌لیست ماهانه'],
			['ul', ['لرزش یاتاقان‌ها را اندازه بگیرید و با ماه قبل مقایسه کنید.', 'دمای بدنه‌ی موتور و یاتاقان‌ها را ثبت کنید.', 'آب‌بندی مکانیکی را برای نشتی بررسی کنید.', 'فشار مکش و رانش را بخوانید و با منحنی پمپ تطبیق دهید.', 'کوپلینگ و هم‌راستایی را از نظر ظاهری بررسی کنید.']],
			['q', 'عددها را یادداشت کنید. یک عدد به‌تنهایی چیزی نمی‌گوید؛ روند است که هشدار می‌دهد.'],
		]),
	},
	{
		key: 'ball-vs-gate', title: 'شیر توپی یا شیر کشویی؟', slug: 'ball-valve-vs-gate-valve', image: 'drawing-1', terms: ['cat-guide'], days_ago: 17,
		excerpt: 'مقایسه‌ای کوتاه بر اساس سرعت باز و بسته شدن، افت فشار، آب‌بندی و هزینه.',
		content: L.article([
			'هر دو شیر برای قطع و وصل جریان ساخته شده‌اند، اما در عمل تفاوت‌های مهمی دارند.',
			['h', 'شیر توپی'],
			'با یک ربع چرخش باز و بسته می‌شود، آب‌بندی بسیار خوبی دارد و برای خطوطی که مرتب قطع و وصل می‌شوند مناسب است.',
			['h', 'شیر کشویی'],
			'در حالت کاملاً باز تقریباً افت فشاری ندارد و برای قطرهای بزرگ و خطوطی که به‌ندرت بسته می‌شوند مقرون‌به‌صرفه‌تر است.',
			['ul', ['قطع و وصل مکرر: شیر توپی', 'قطر بزرگ و استفاده‌ی کم: شیر کشویی', 'سیال با ذرات معلق: با کارشناس مشورت کنید']],
		]),
	},
	{
		key: 'calibration-interval', title: 'کالیبراسیون ابزار دقیق: هر چند وقت یک بار؟', slug: 'instrument-calibration-interval', image: 'drawing-2', terms: ['cat-maint'], days_ago: 25,
		excerpt: 'پاسخ کوتاه: بستگی دارد. پاسخ بلند در این مقاله.',
		content: L.article([
			'بازه‌ی کالیبراسیون عدد ثابتی نیست. به اهمیت اندازه‌گیری، شرایط محیط و سابقه‌ی خود ابزار بستگی دارد.',
			['ul', ['ابزارهای ایمنی و قراردادی: معمولاً سالانه یا کوتاه‌تر', 'ابزارهای پایش فرایند: هر یک تا دو سال', 'ابزار در محیط پرلرزش یا دمای بالا: بازه‌ی کوتاه‌تر']],
			'بهترین روش این است که نتایج کالیبراسیون‌های قبلی را ثبت کنید. اگر ابزار در دو نوبت پیاپی خطای کمی داشته، می‌توان بازه را بلندتر کرد.',
		]),
	},
	{
		key: 'good-hmi', title: 'یک صفحه‌ی HMI خوب چه ویژگی‌هایی دارد', slug: 'what-makes-a-good-hmi', image: 'drawing-4', terms: ['cat-auto'], days_ago: 33,
		excerpt: 'اپراتور در شیفت شب باید در سه ثانیه بفهمد خط سالم است یا نه.',
		content: L.article([
			'صفحه‌ی HMI جای نمایش همه‌ی داده‌ها نیست؛ جای نمایش داده‌هایی است که اپراتور برای تصمیم گرفتن لازم دارد.',
			['ol', ['رنگ را برای وضعیت غیرعادی نگه دارید؛ حالت عادی خاکستری و آرام باشد.', 'روند را نشان دهید، نه فقط عدد لحظه‌ای.', 'هشدارها را اولویت‌بندی کنید؛ صد هشدار هم‌زمان یعنی هیچ هشداری.', 'دکمه‌های حیاتی را بزرگ و دور از هم بگذارید.']],
			'پیش از تحویل، صفحه را با اپراتورهای واقعی امتحان کنید. آن‌ها بهتر از هر طراحی می‌دانند در لحظه‌ی بحران دنبال چه هستند.',
		]),
	},
	{
		key: 'flow-meters', title: 'دبی‌سنج الکترومغناطیسی یا التراسونیک؟', slug: 'magnetic-vs-ultrasonic-flow-meter', image: 'drawing-3', terms: ['cat-guide'], days_ago: 40,
		excerpt: 'برای سیالات رسانا، الکترومغناطیسی؛ برای بقیه، بستگی دارد.',
		content: L.article([
			'دبی‌سنج الکترومغناطیسی برای سیالات رسانا مثل آب، فاضلاب و بیشتر محلول‌ها دقیق و بدون قطعه‌ی متحرک است. اما روی سیالات نارسانا مثل روغن کار نمی‌کند.',
			'دبی‌سنج التراسونیک، به‌خصوص نوع کلمپی، بدون بریدن لوله نصب می‌شود و برای اندازه‌گیری موقت یا خطوطی که نمی‌توان متوقفشان کرد مناسب است.',
			['ul', ['آب و فاضلاب: الکترومغناطیسی', 'روغن و سوخت: التراسونیک یا کوریولیس', 'اندازه‌گیری موقت: التراسونیک کلمپی']],
		]),
	},
];

/* ---------------- Products ---------------- */

const products = [
	{ key: 'hcp-7', title: 'پنل کنترل لمسی HCP-7', slug: 'hcp-7-control-panel', price: 218000000, sku: 'HM-HCP-7', image: 'product-1', gallery: ['product-1-b', 'drawing-1'], terms: ['pcat-control'], featured: true, stock: 6, weight: 9,
		excerpt: 'نمایشگر لمسی ۷ اینچ صنعتی، نمودار زنده، توقف اضطراری و ارتباط با PLC‌های استاندارد.',
		attributes: [{ name: 'نمایشگر', options: ['۷ اینچ لمسی صنعتی'] }, { name: 'ارتباط', options: ['Modbus RTU', 'Modbus TCP'] }, { name: 'درجه‌ی حفاظت', options: ['IP65 (جلو)'] }],
		content: L.productBody(['HCP-7 برای پایش و کنترل خطوط فرایندی کوچک و متوسط طراحی شده است. فشار، دما و دبی را زنده نمایش می‌دهد و هشدارها را بر اساس آستانه‌های قابل تنظیم اعلام می‌کند.', 'بدنه‌ی فلزی، دکمه‌ی توقف اضطراری با حلقه‌ی زرد و کلیدهای لمسی مقاوم برای کار با دستکش.'], [['تغذیه', '۲۴ ولت DC'], ['دمای کاری', '۰ تا ۵۰ درجه'], ['گارانتی', '۱۸ ماه']]) },
	{ key: 'pg-160', title: 'گیج فشار PG-160', slug: 'pg-160-pressure-gauge', price: 4800000, sku: 'HM-PG-160', image: 'product-2', gallery: ['product-2-b', 'drawing-6'], terms: ['pcat-instrument'], featured: true, stock: 120, weight: 0.9,
		excerpt: 'قطر ۱۶۰ میلی‌متر، بازه‌ی ۰ تا ۱۶ بار، قاب استیل و دقت کلاس ۱٫۰.',
		attributes: [{ name: 'بازه', options: ['۰–۱۶ بار'] }, { name: 'جنس قاب', options: ['استیل ۳۰۴'] }, { name: 'اتصال', options: ['½ اینچ از زیر'] }],
		content: L.productBody(['گیج PG-160 برای خطوط آب، هوا و سیالات غیرخورنده مناسب است. صفحه‌ی بزرگ، خواندن از فاصله را آسان می‌کند.', 'نسخه‌ی پرشده با گلیسیرین برای خطوط پرلرزش هم قابل سفارش است.'], [['دقت', 'کلاس ۱٫۰'], ['قطر صفحه', '۱۶۰ میلی‌متر'], ['گواهی', 'کالیبراسیون همراه بار']]) },
	{ key: 'bv-50', title: 'شیر توپی فلنج‌دار BV-50', slug: 'bv-50-ball-valve', price: 18500000, sale_price: 16900000, sku: 'HM-BV-50', image: 'product-3', gallery: ['product-3-b', 'drawing-1'], terms: ['pcat-valve'], featured: true, stock: 40, weight: 11,
		excerpt: 'سایز DN50، بدنه‌ی چدن داکتیل، آب‌بندی PTFE و دسته‌ی قفل‌شونده.',
		attributes: [{ name: 'سایز', options: ['DN50'] }, { name: 'فشار کاری', options: ['PN16'] }, { name: 'آب‌بندی', options: ['PTFE'] }],
		content: L.productBody(['BV-50 برای قطع و وصل سریع جریان در خطوط آب، هوا و سیالات صنعتی طراحی شده است.', 'دسته‌ی قفل‌شونده از باز و بسته شدن ناخواسته جلوگیری می‌کند.'], [['بدنه', 'چدن داکتیل'], ['توپی', 'استیل ضدزنگ'], ['دمای کاری', '−۱۰ تا ۱۵۰ درجه']]) },
	{ key: 'cp-15', title: 'پمپ سانتریفیوژ CP-15', slug: 'cp-15-centrifugal-pump', price: 148000000, sku: 'HM-CP-15', image: 'product-4', gallery: ['product-4-b', 'drawing-5'], terms: ['pcat-pump'], stock: 4, weight: 165,
		excerpt: 'الکتروموتور ۱۵ کیلووات، دبی تا ۹۰ مترمکعب بر ساعت و شاسی یکپارچه.',
		attributes: [{ name: 'توان', options: ['۱۵ کیلووات'] }, { name: 'دبی', options: ['تا ۹۰ m³/h'] }, { name: 'ارتفاع', options: ['تا ۴۵ متر'] }],
		content: L.productBody(['CP-15 برای ایستگاه‌های پمپاژ، سیستم‌های خنک‌کاری و انتقال سیالات تمیز طراحی شده است.', 'پروانه‌ی بالانس دینامیکی‌شده و یاتاقان‌های با کیفیت، کار مداوم و کم‌لرزش را تضمین می‌کنند.'], [['سرعت', '۲۹۰۰ دور در دقیقه'], ['آب‌بندی', 'مکانیکی'], ['گارانتی', '۱۸ ماه / ۲۴ ماه با نصب']]) },
	{ key: 'plc-x8', title: 'کنترلر PLC-X8', slug: 'plc-x8-controller', price: 86000000, sku: 'HM-PLC-X8', image: 'product-5', gallery: ['product-5-b', 'drawing-4'], terms: ['pcat-control'], stock: 10, weight: 2.4,
		excerpt: 'پردازنده و هشت ماژول ورودی/خروجی روی ریل DIN با نشانگر وضعیت هر کانال.',
		attributes: [{ name: 'ماژول‌ها', options: ['۸ ماژول'] }, { name: 'ارتباط', options: ['Modbus', 'Ethernet'] }, { name: 'نصب', options: ['ریل DIN'] }],
		content: L.productBody(['PLC-X8 کنترلری ماژولار برای خطوط کوچک و متوسط است. ماژول‌ها بدون ابزار جابه‌جا می‌شوند و هر کانال نشانگر وضعیت دارد.', 'برنامه‌نویسی با محیط استاندارد و پشتیبانی فنی برای راه‌اندازی اولیه.'], [['ورودی/خروجی', 'تا ۶۴ کانال'], ['تغذیه', '۲۴ ولت DC'], ['دمای کاری', '۰ تا ۵۵ درجه']]) },
	{ key: 'fm-200', title: 'دبی‌سنج الکترومغناطیسی FM-200', slug: 'fm-200-flow-meter', price: 64000000, sku: 'HM-FM-200', image: 'product-6', gallery: ['product-6-b', 'drawing-3'], terms: ['pcat-instrument'], stock: 8, weight: 14,
		excerpt: 'اندازه‌گیری دبی سیالات رسانا با نمایشگر محلی و خروجی ۴ تا ۲۰ میلی‌آمپر.',
		attributes: [{ name: 'سایز', options: ['DN80'] }, { name: 'خروجی', options: ['۴–۲۰mA', 'پالس'] }, { name: 'دقت', options: ['±۰٫۵٪'] }],
		content: L.productBody(['FM-200 بدون قطعه‌ی متحرک و بدون افت فشار، دبی سیالات رسانا مثل آب و فاضلاب را اندازه می‌گیرد.', 'نمایشگر محلی دبی لحظه‌ای و حجم کل را نشان می‌دهد.'], [['لاینر', 'PTFE'], ['الکترود', 'استیل ۳۱۶'], ['درجه‌ی حفاظت', 'IP67']]) },
];

/* ---------------- Package ---------------- */

const LIGHT = { light: 'start', extra: { hm_page_light_a: '#c3262f', hm_page_light_b: '#8a96a3' } };

const pages = [
	{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings(LIGHT) },
	{ key: 'home-2', title: 'خانه — نسخه‌ی دوم', slug: 'home-2', elementor: home2, settings: L.pageSettings({ header: 'transparent-light' }) },
	{ key: 'families', title: 'خانواده‌های محصول', slug: 'product-families', elementor: families, settings: L.pageSettings() },
	{ key: 'services', title: 'خدمات', slug: 'services', elementor: services, settings: L.pageSettings(LIGHT) },
	{ key: 'industries', title: 'صنایع', slug: 'industries', elementor: industries, settings: L.pageSettings() },
	{ key: 'quality', title: 'کیفیت و گواهی‌ها', slug: 'quality', elementor: quality, settings: L.pageSettings() },
	{ key: 'about', title: 'درباره‌ی ما', slug: 'about', elementor: about, settings: L.pageSettings(LIGHT) },
	{ key: 'careers', parent: 'about', title: 'فرصت‌های شغلی', slug: 'careers', elementor: careers, settings: L.pageSettings() },
	{ key: 'faq', title: 'پرسش‌های متداول', slug: 'faq', elementor: faqPage, settings: L.pageSettings() },
	{ key: 'contact', title: 'تماس و استعلام قیمت', slug: 'contact', elementor: contact, settings: L.pageSettings() },
	{ key: 'blog', title: 'دانشنامه', slug: 'knowledge', content: '' },
];

module.exports = {
	manifest: {
		id: 'industrial',
		order: 3,
		title: 'صنایع هامون',
		desc: 'شرکت صنعتی و فروش تجهیزات؛ سایت شرکتی کامل با کاتالوگ: خانواده‌های محصول، خدمات، صنایع، کیفیت و گواهی‌ها، فرصت‌های شغلی، استعلام قیمت سه‌مرحله‌ای و دانشنامه. فولاد، گرافیت و قرمز هشدار.',
		kit: 'industrial',
		thumb: 'thumb.webp',
		required: ['elementor', 'woocommerce'],
		recommended: [],
		tags: ['صنعتی', 'شرکتی', 'فروشگاه تجهیزات'],
		pages: pages.filter((p) => p.elementor).map((p) => p.title).concat(['محصولات', 'دانشنامه']),
	},
	content: {
		site: { title: 'صنایع هامون', tagline: 'تجهیزات کنترل فرایند، ساخت ایران' },
		images, alts, terms, posts, products, pages,
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'هامون — صفحه‌ی اصلی' },
			{ key: 'tpl-home-2', type: 'page', page: 'home-2', title: 'هامون — صفحه‌ی اصلی، نسخه‌ی دوم' },
			{ key: 'tpl-services', type: 'page', page: 'services', title: 'هامون — خدمات' },
			{ key: 'tpl-quality', type: 'page', page: 'quality', title: 'هامون — کیفیت و گواهی‌ها' },
			{ key: 'tpl-contact', type: 'page', page: 'contact', title: 'هامون — استعلام قیمت' },
			{ key: 'tpl-stack', type: 'section', page: 'home', index: 6, title: 'هامون — سه لایه‌ی خط (کارت‌های پشته‌ای)' },
			{ key: 'tpl-figures', type: 'section', page: 'home', index: 8, title: 'هامون — اعداد روی زمینه‌ی تیره' },
			{ key: 'tpl-tabs', type: 'section', page: 'home-2', index: 1, title: 'هامون — صنایع با زبانه' },
		],
		menus: [
			{
				name: 'هامون — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'محصولات', url: '{{shop}}', children: [
						{ title: 'خانواده‌های محصول', page: 'families' },
						{ title: 'کنترل و اتوماسیون', term: 'pcat-control' },
						{ title: 'ابزار دقیق', term: 'pcat-instrument' },
						{ title: 'شیرآلات', term: 'pcat-valve' },
						{ title: 'پمپ', term: 'pcat-pump' },
					] },
					{ title: 'خدمات', page: 'services' },
					{ title: 'صنایع', page: 'industries' },
					{ title: 'کیفیت', page: 'quality' },
					{ title: 'دانشنامه', page: 'blog' },
					{
						title: 'شرکت', page: 'about', children: [
							{ title: 'درباره‌ی ما', page: 'about' },
							{ title: 'فرصت‌های شغلی', page: 'careers' },
							{ title: 'پرسش‌های متداول', page: 'faq' },
							{ title: 'تماس', page: 'contact' },
						],
					},
				],
			},
			{
				name: 'هامون — پابرگ', location: 'footer', items: [
					{ title: 'محصولات', url: '{{shop}}' },
					{ title: 'خدمات', page: 'services' },
					{ title: 'کیفیت و گواهی‌ها', page: 'quality' },
					{ title: 'فرصت‌های شغلی', page: 'careers' },
					{ title: 'استعلام قیمت', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 38,
			header_layout: 'split',
			header_cart: false,
			header_cta_text: 'استعلام قیمت',
			header_cta_url: '{{page:contact}}',
			font_body: 'iransansx',
			font_heading: 'peyda',
			font_heading_weight: '700',
			footer_about: 'صنایع هامون از ۱۳۷۶ تجهیزات کنترل فرایند، ابزار دقیق، شیرآلات و پمپ‌های صنعتی را در ایران طراحی و تولید می‌کند.',
			footer_copyright: 'تمام حقوق برای صنایع هامون محفوظ است.',
			footer_social: [{ network: 'linkedin', url: 'https://linkedin.com/' }, { network: 'instagram', url: 'https://instagram.com/' }, { network: 'aparat', url: 'https://aparat.com/' }],
			mobile_bar: true,
			mobile_bar_text: 'استعلام قیمت',
			mobile_bar_url: '{{page:contact}}',
			mobile_bar_phone: '02144009280',
			magnetic: true,
			cursor: 'ring',
			sound_enabled: true,
			sound_default: true,
			sound_theme: 'mechanical',
			sound_volume: 30,
			sound_hover: false,
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 4, pages: { shop: 'محصولات', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
