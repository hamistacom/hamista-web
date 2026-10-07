/**
 * Demo: Hamoon Industries — maker of process-control equipment (Industrial kit).
 */
'use strict';

const L = require('../lib');
const { img, link, px, section, cols, heading, button } = L;

const images = { hero: 'images/hero.webp', plant: 'images/plant.webp', workbench: 'images/workbench.webp' };
for (let i = 1; i <= 6; i++) { images['product-' + i] = 'images/product-' + i + '.webp'; images['product-' + i + '-b'] = 'images/product-' + i + '-b.webp'; images['drawing-' + i] = 'images/drawing-' + i + '.webp'; }
for (let i = 1; i <= 6; i++) { images['person-' + i] = '../shared/images/person-' + i + '.webp'; }

images.logo = 'images/logo.webp';
images['logo-dark'] = 'images/logo-dark.webp';

const alts = {
	hero: 'پنل کنترل، گیج فشار و شیر توپی صنایع هامون',
	plant: 'خط فرایند با مخزن، پمپ، شیر و تابلوی کنترل',
	workbench: 'میز آزمون کیفیت در کارخانه‌ی هامون',
	'product-1': 'پنل کنترل لمسی HCP-7', 'product-2': 'گیج فشار PG-160', 'product-3': 'شیر توپی فلنج‌دار BV-50',
	'product-4': 'پمپ سانتریفیوژ CP-15', 'product-5': 'کنترلر PLC-X8', 'product-6': 'دبی‌سنج الکترومغناطیسی FM-200',
};

const LINES = [
	{ image: img('product-1'), label: 'اتوماسیون', title: 'پنل کنترل HCP-7', text: 'نمایشگر لمسی ۷ اینچ صنعتی با نمودار زنده‌ی فشار و دکمه‌ی توقف اضطراری.', link: link('{{product:hcp-7}}') },
	{ image: img('product-2'), label: 'ابزار دقیق', title: 'گیج فشار PG-160', text: 'قاب استیل، شیشه‌ی ایمنی و دقت کلاس ۱٫۰ برای خطوط تا ۱۶ بار.', link: link('{{product:pg-160}}') },
	{ image: img('product-3'), label: 'شیرآلات', title: 'شیر توپی BV-50', text: 'بدنه‌ی چدن داکتیل، فلنج استاندارد و آب‌بندی PTFE برای کار بی‌دردسر.', link: link('{{product:bv-50}}') },
	{ image: img('product-4'), label: 'پمپ', title: 'پمپ سانتریفیوژ CP-15', text: 'الکتروموتور ۱۵ کیلووات، پروانه‌ی بالانس‌شده و شاسی یکپارچه.', link: link('{{product:cp-15}}') },
	{ image: img('product-5'), label: 'اتوماسیون', title: 'کنترلر PLC-X8', text: 'هشت ماژول ورودی و خروجی روی ریل DIN با نشانگر وضعیت برای هر کانال.', link: link('{{product:plc-x8}}') },
	{ image: img('product-6'), label: 'ابزار دقیق', title: 'دبی‌سنج FM-200', text: 'اندازه‌گیری الکترومغناطیسی دبی با نمایشگر محلی و خروجی ۴ تا ۲۰ میلی‌آمپر.', link: link('{{product:fm-200}}') },
];

const QUOTES = [
	{ quote: 'گیج‌ها و شیرهای هامون را سه سال است در خط تصفیه‌ی آب استفاده می‌کنیم. مهم‌تر از کیفیت، پاسخ‌گویی تیم فنی‌شان در شیفت شب است.', name: 'مهندس علیرضا توکلی', role: 'سرپرست تعمیرات، شرکت آب منطقه‌ای', avatar: img('person-3') },
	{ quote: 'پنل کنترل را دقیقاً با نقشه‌ی خط ما ساختند و راه‌اندازی در دو روز تمام شد. مستندات کامل تحویل دادند که کمتر می‌بینیم.', name: 'مهندس نسرین فاضلی', role: 'مدیر فنی، کارخانه‌ی لبنیات', avatar: img('person-2') },
	{ quote: 'قطعه‌ی یدکی پمپ را دو روزه رساندند. برای خطی که نباید بخوابد، همین تفاوت اصلی است.', name: 'مهندس حمید شاکری', role: 'مدیر تولید، صنایع سیمان', avatar: img('person-5') },
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

/* ---------------- Home A ---------------- */

const homeA = [
	L.hero({
		layout: 'split',
		eyebrow: 'صنایع هامون · از ۱۳۷۶',
		title: 'تجهیزات کنترل فرایند،\n*ساخت ایران*.',
		desc: 'پنل‌های کنترل، ابزار دقیق، شیرآلات و پمپ‌های صنعتی برای خطوطی که نباید از کار بیفتند؛ طراحی و ساخت در کارخانه‌ی خودمان، با پشتیبانی شبانه‌روزی.',
		btn1_text: 'درخواست پیش‌فاکتور', btn1_link: link('{{page:contact}}'),
		btn2_text: 'کاتالوگ محصولات', btn2_link: link('{{shop}}'),
		stats: [
			{ value: '۲۸', label: 'سال تجربه' },
			{ value: '۹۰۰+', label: 'پروژه‌ی اجراشده' },
			{ value: '۲۴/۷', label: 'پشتیبانی فنی' },
		],
		media_type: 'image',
		image: img('hero'),
		media_ratio: 'landscape',
		height: 'screen',
		decor: 'grid',
		hint: 'اسکرول کنید',
	}),
	L.marquee(['پتروشیمی', 'نفت و گاز', 'آب و فاضلاب', 'صنایع غذایی', 'سیمان', 'نیروگاه', 'داروسازی'], { look: 'muted', size: 'md', separator: 'plus', speed: px(45) }),
	section({ space: 'md' }, [
		cols({ widths: [55, 45], align: 'flex-end' }, [
			[heading({ eyebrow: 'SYS-01 · محصولات', title: 'شش خانواده‌ی *محصول*\nبرای یک خط کامل' })],
			[button('همه‌ی محصولات', '{{shop}}', 'secondary')],
		]),
		L.products({ source: 'featured', count: 3, columns: '3' }),
	]),
	section({ space: 'md', width: 1100 }, [
		L.textScrub('خطی که می‌خوابد، هر ساعتش هزینه دارد. برای همین تجهیزاتی می‌سازیم که *سال‌ها بی‌صدا کار کنند*، و تیمی داریم که اگر روزی صدایشان درآمد، *در همان شیفت* برسد.', { eyebrow: 'SYS-02 · اصل ما', size: 'lg' }),
	]),
	L.hscroll({
		eyebrow: 'SYS-03 · خطوط تولید',
		title: 'از *ابزار دقیق*\nتا اتوماسیون',
		desc: 'هر محصول را می‌توانید جداگانه یا به‌عنوان بخشی از یک پروژه‌ی کامل سفارش دهید.',
		items: LINES,
		card_size: 'md',
		card_style: 'card',
		btn1_text: 'کاتالوگ کامل', btn1_link: link('{{shop}}'),
	}),
	section({ space: 'md' }, [
		L.counters([
			{ value: 28, label: 'سال ساخت', desc: 'از کارگاه کوچک تا کارخانه' },
			{ value: 900, suffix: '+', label: 'پروژه', desc: 'در ۲۶ استان' },
			{ value: 1.0, label: 'کلاس دقت', desc: 'ابزار دقیق کالیبره‌شده' },
			{ value: 48, suffix: 'h', label: 'ارسال قطعه', desc: 'برای خطوط تحت قرارداد' },
		], { style: 'lcd', columns: '4' }),
	]),
	L.scrollZoom({
		eyebrow: 'داخل کارخانه',
		title: 'از نقشه تا راه‌اندازی،\n*زیر یک سقف*',
		image: img('plant'),
		o_title: 'هر دستگاه پیش از ارسال\n*روی خط آزمون* کار می‌کند.',
		o_desc: 'آزمون فشار، کالیبراسیون و تست عملکرد در شرایط واقعی؛ با گزارشی که همراه بار برایتان ارسال می‌شود.',
		btn1_text: 'درباره‌ی کارخانه', btn1_link: link('{{page:about}}'), btn1_style: 'inverse',
	}),
	section({ space: 'md' }, [
		heading({ eyebrow: 'SYS-04 · خدمات', title: 'فقط فروش نیست؛ *همراهی* است', header_align: 'center' }),
		L.features([
			{ icon: 'compass', title: 'مشاوره و طراحی', text: 'انتخاب تجهیزات بر اساس سیال، فشار، دما و استانداردهای پروژه.', meta: 'ENG' },
			{ icon: 'factory', title: 'ساخت سفارشی', text: 'پنل‌ها و تابلوهای کنترل بر اساس نقشه و منطق کنترلی خط شما.', meta: 'FAB' },
			{ icon: 'wrench', title: 'نصب و راه‌اندازی', text: 'اعزام تیم به سراسر کشور و آموزش اپراتورها در محل.', meta: 'SITE' },
			{ icon: 'gauge', title: 'کالیبراسیون', text: 'کالیبراسیون دوره‌ای ابزار دقیق با گواهی قابل ردیابی.', meta: 'CAL' },
			{ icon: 'shield', title: 'گارانتی ۱۸ ماهه', text: 'گارانتی ساخت برای همه‌ی محصولات و ۲۴ ماه با نصب توسط ما.', meta: 'WAR' },
			{ icon: 'truck', title: 'قطعه‌ی یدکی', text: 'انبار قطعات پرمصرف و ارسال ۴۸ ساعته برای خطوط تحت قرارداد.', meta: 'PART' },
		], { layout: 'grid', style: 'cards', columns: '3', icon_style: 'tile' }),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		heading({ eyebrow: 'SYS-05 · روند پروژه', title: 'چهار مرحله تا *خط آماده*' }),
		L.steps([
			{ marker: '01', icon: 'search', title: 'بازدید و نیازسنجی', text: 'کارشناس ما شرایط خط را بررسی و مشخصات فنی را مستند می‌کند.' },
			{ marker: '02', icon: 'pen', title: 'پیشنهاد فنی و مالی', text: 'نقشه‌ها، فهرست تجهیزات و زمان‌بندی را برای تأیید ارسال می‌کنیم.' },
			{ marker: '03', icon: 'factory', title: 'ساخت و آزمون', text: 'ساخت در کارخانه و آزمون کامل پیش از ارسال، با حضور ناظر شما.' },
			{ marker: '04', icon: 'bolt', title: 'نصب و تحویل', text: 'نصب، راه‌اندازی، آموزش و تحویل مستندات کامل.' },
		], { layout: 'h' }),
	]),
	section({ space: 'md' }, [
		heading({ eyebrow: 'SYS-06 · از زبان مشتریان', title: 'خطوطی که *کار می‌کنند*', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]),
	section({ space: 'md', top0: true }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'SYS-07 · پرسش‌ها', title: 'پیش از *سفارش*' }), button('تماس با کارشناس فروش', '{{page:contact}}', 'secondary')],
			[L.faq(FAQ)],
		]),
	]),
	L.cta({
		eyebrow: 'پاسخ در همان روز کاری',
		title: 'مشخصات خط را بفرستید،\n*پیش‌فاکتور* بگیرید.',
		desc: 'نقشه، برگه‌ی مشخصات یا حتی یک عکس از تجهیزات فعلی کافی است.',
		btn1_text: 'درخواست پیش‌فاکتور', btn1_link: link('{{page:contact}}'),
		btn2_text: 'تماس: ۰۲۱-۴۴۰۰۹۲۸۰', btn2_link: link('tel:+982144009280'),
		look: 'inverse',
		decor: 'grill',
		note: '',
	}),
];

/* ---------------- Home B ---------------- */

const homeB = [
	L.hero({
		layout: 'split',
		eyebrow: 'HAMOON · HCP SERIES',
		title: 'کنترل کامل خط،\n*روی یک صفحه*.',
		desc: 'پنل‌های کنترل سری HCP فشار، دما و دبی خط را زنده نمایش می‌دهند، هشدارها را پیش از توقف خبر می‌دهند و با هر PLC استانداردی کار می‌کنند.',
		btn1_text: 'مشخصات HCP-7', btn1_link: link('{{product:hcp-7}}'),
		btn2_text: 'درخواست دمو در محل', btn2_link: link('{{page:contact}}'),
		media_type: 'device',
		device_variant: 'monitor',
		device_label: 'LINE 04 · ONLINE',
		height: 'screen',
		decor: 'grid',
	}),
	section({ space: 'sm' }, [
		L.counters([
			{ value: 6.42, suffix: 'bar', label: 'فشار خط', desc: 'نمایش زنده' },
			{ value: 78.3, suffix: '°C', label: 'دمای سیال', desc: 'با هشدار آستانه' },
			{ value: 42.7, suffix: 'm³/h', label: 'دبی', desc: 'خروجی ۴–۲۰mA' },
			{ value: 99.6, suffix: '%', label: 'زمان کارکرد', desc: 'میانگین سال گذشته' },
		], { style: 'lcd', columns: '4' }),
	]),
	section({ space: 'md' }, [
		heading({ eyebrow: 'صنایعی که با آن‌ها کار می‌کنیم', title: 'هر صنعت، *مشخصات خودش*', header_align: 'center' }),
		L.tabs([
			{ title: 'آب و فاضلاب', subtitle: 'ایستگاه‌های پمپاژ و تصفیه', meta: 'W', image: img('drawing-5'), panel_title: 'پمپاژ پایدار، شبانه‌روز', panel_text: 'پمپ‌های سانتریفیوژ، شیرهای توپی و دبی‌سنج‌های الکترومغناطیسی برای ایستگاه‌های پمپاژ و تصفیه‌خانه‌ها، با پنل کنترل از راه دور.', chips: 'CP-15، BV-50، FM-200', btn_text: 'مشاوره برای پروژه', btn_link: link('{{page:contact}}') },
			{ title: 'صنایع غذایی', subtitle: 'بهداشتی و قابل شست‌وشو', meta: 'F', image: img('drawing-6'), panel_title: 'استیل، دقیق، قابل ردیابی', panel_text: 'ابزار دقیق با قطعات در تماس از جنس استیل ۳۱۶ و گواهی کالیبراسیون، برای خطوط لبنیات، نوشیدنی و کنسرو.', chips: 'PG-160، FM-200', btn_text: 'مشاوره برای پروژه', btn_link: link('{{page:contact}}') },
			{ title: 'پتروشیمی', subtitle: 'فشار و دمای بالا', meta: 'P', image: img('drawing-3'), panel_title: 'برای سخت‌ترین شرایط', panel_text: 'شیرآلات و ابزار دقیق مناسب سیالات خورنده و محیط‌های پرخطر، با مستندات کامل برای بازرسی.', chips: 'BV-50، PG-160', btn_text: 'مشاوره برای پروژه', btn_link: link('{{page:contact}}') },
			{ title: 'سیمان و معدن', subtitle: 'گرد و غبار و لرزش', meta: 'C', image: img('drawing-4'), panel_title: 'مقاوم در برابر محیط', panel_text: 'تابلوها و کنترلرهایی با درجه‌ی حفاظت بالا و طراحی مقاوم در برابر لرزش، برای کار مداوم در خطوط سنگین.', chips: 'PLC-X8، HCP-7', btn_text: 'مشاوره برای پروژه', btn_link: link('{{page:contact}}') },
		], { autoplay: 7, media_side: 'end' }),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		heading({ eyebrow: 'خانواده‌های محصول', title: 'سه لایه‌ی *یک خط*', header_align: 'center' }),
		L.stack([
			{ eyebrow: 'LAYER 01 · FIELD', title: 'ابزار دقیق و شیرآلات', text: 'لایه‌ای که مستقیماً با سیال در تماس است: اندازه می‌گیرد و جریان را کنترل می‌کند.', points: 'گیج فشار PG-160\nدبی‌سنج FM-200\nشیر توپی BV-50', image: img('product-2'), btn_text: 'دیدن محصولات', btn_link: link('{{shop}}'), tone: '' },
			{ eyebrow: 'LAYER 02 · POWER', title: 'پمپ و محرکه', text: 'قلب خط: پمپ‌های سانتریفیوژ و الکتروموتورهایی که برای کار مداوم ساخته شده‌اند.', points: 'پمپ CP-15\nشاسی یکپارچه\nپروانه‌ی بالانس‌شده', image: img('product-4'), btn_text: 'مشخصات CP-15', btn_link: link('{{product:cp-15}}'), tone: 'inverse' },
			{ eyebrow: 'LAYER 03 · CONTROL', title: 'کنترل و نمایش', text: 'مغز خط: کنترلرها و پنل‌هایی که همه‌چیز را هماهنگ می‌کنند و به اپراتور نشان می‌دهند.', points: 'کنترلر PLC-X8\nپنل لمسی HCP-7\nهشدار پیش از توقف', image: img('product-1'), btn_text: 'مشخصات HCP-7', btn_link: link('{{product:hcp-7}}'), tone: 'accent' },
		]),
	]),
	section({ space: 'md' }, [
		cols({ widths: [50, 50], gap: 64, align: 'center' }, [
			[L.imageReveal('workbench', { ratio: '4-3', reveal: 'clip-x', frame: 'bezel' })],
			[
				heading({ eyebrow: 'کنترل کیفیت', title: 'هیچ دستگاهی *بدون آزمون*\nاز در کارخانه بیرون نمی‌رود' }),
				L.features([
					{ icon: 'gauge', title: 'آزمون فشار', text: '۱٫۵ برابر فشار کاری، برای همه‌ی شیرها و پمپ‌ها.' },
					{ icon: 'check', title: 'کالیبراسیون', text: 'با مرجع قابل ردیابی و گواهی همراه بار.' },
					{ icon: 'clock', title: 'تست ۴۸ ساعته', text: 'برای پنل‌های کنترل، پیش از ارسال.' },
				], { layout: 'list', style: 'plain', columns: '1', icon_style: 'tile' }),
			],
		]),
	]),
	section({ space: 'md', top0: true }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'دانشنامه‌ی فنی', title: 'نوشته‌های *تیم مهندسی*' })],
			[button('همه‌ی مقاله‌ها', '{{blog}}', 'secondary')],
		]),
		L.posts({ count: 3, layout: 'grid', columns: '3' }),
	]),
	L.cta({
		title: 'یک خط، یک *هم‌صحبت فنی*.',
		desc: 'از انتخاب یک گیج تا تجهیز کامل یک واحد، کارشناسان ما کنار شما هستند.',
		btn1_text: 'درخواست پیش‌فاکتور', btn1_link: link('{{page:contact}}'),
		look: 'accent',
		decor: 'grill',
		note: '',
	}),
];

/* ---------------- About ---------------- */

const about = [
	section({ space: 'md', bottom0: true }, [
		cols({ widths: [55, 45], align: 'flex-end' }, [
			[heading({ eyebrow: 'درباره‌ی هامون', title: 'از یک کارگاه\n*تراشکاری* تا کارخانه', title_tag: 'h1', title_size: 'xl' })],
			[L.textEditor('<p>صنایع هامون سال ۱۳۷۶ با ساخت قطعات یدکی پمپ در یک کارگاه کوچک شروع به کار کرد. امروز با ۱۸۰ نفر در شهرک صنعتی عباس‌آباد، تجهیزات کنترل فرایند را برای بیش از ۹۰۰ پروژه در کشور طراحی و تولید می‌کند.</p>')],
		]),
	]),
	section({ space: 'md' }, [L.imageReveal('plant', { ratio: '21-9', reveal: 'clip-up', parallax: px(0.3), frame: 'bezel' })]),
	section({ space: 'sm' }, [
		L.counters([
			{ value: 1376, label: 'سال تأسیس' },
			{ value: 180, label: 'نفر نیروی متخصص' },
			{ value: 12000, label: 'متر مربع فضای تولید' },
			{ value: 26, label: 'استان زیر پوشش' },
		], { style: 'lcd', columns: '4', grouping: '' }),
	]),
	section({ space: 'md' }, [
		cols({ widths: [40, 60], gap: 64 }, [
			[heading({ eyebrow: 'مسیر ما', title: 'بیست‌وهشت سال\n*ساختن*' })],
			[L.steps([
				{ marker: '1376', title: 'کارگاه قطعات پمپ', text: 'ساخت قطعات یدکی برای پمپ‌های وارداتی در کارگاهی ۲۰۰ متری.' },
				{ marker: '1385', title: 'اولین پمپ کامل', text: 'طراحی و ساخت اولین پمپ سانتریفیوژ با نشان هامون.' },
				{ marker: '1394', title: 'واحد اتوماسیون', text: 'راه‌اندازی واحد طراحی و ساخت پنل‌ها و تابلوهای کنترل.' },
				{ marker: '1402', title: 'کارخانه‌ی جدید', text: 'انتقال به کارخانه‌ی ۱۲ هزار متری و راه‌اندازی آزمایشگاه کالیبراسیون.' },
			], { layout: 'v', cards: 'yes' })],
		]),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		heading({ eyebrow: 'گواهی‌ها و استانداردها', title: 'آنچه *ضمانت* می‌کنیم' }),
		L.features([
			{ icon: 'award', title: 'سیستم مدیریت کیفیت', text: 'فرایندهای طراحی، ساخت و خدمات بر اساس ایزو ۹۰۰۱.', meta: 'ISO 9001' },
			{ icon: 'shield', title: 'استاندارد ملی', text: 'محصولات مشمول، دارای پروانه‌ی کاربرد نشان استاندارد.', meta: 'INSO' },
			{ icon: 'gauge', title: 'آزمایشگاه کالیبراسیون', text: 'کالیبراسیون ابزار دقیق با مرجع قابل ردیابی.', meta: 'CAL LAB' },
			{ icon: 'leaf', title: 'مسئولیت محیط زیستی', text: 'بازیافت ضایعات فلزی و کاهش مصرف انرژی در تولید.', meta: 'ENV' },
		], { layout: 'grid', style: 'cards', columns: '4', icon_style: 'tile' }),
	]),
	section({ space: 'md' }, [
		heading({ eyebrow: 'مدیران', title: 'تیم *فنی و مدیریت*' }),
		L.team([
			{ photo: img('person-5'), name: 'مهندس جمشید هامونی', role: 'مدیرعامل و بنیان‌گذار' },
			{ photo: img('person-2'), name: 'مهندس فرزانه راستین', role: 'مدیر فنی' },
			{ photo: img('person-3'), name: 'مهندس کیوان ستاری', role: 'مدیر واحد اتوماسیون' },
			{ photo: img('person-6'), name: 'مهندس الهام نیکزاد', role: 'مدیر کنترل کیفیت' },
		], { columns: '4', mono: 'yes' }),
	]),
	L.cta({
		title: 'از کارخانه *بازدید* کنید.',
		desc: 'بازدید از خط تولید و آزمایشگاه کالیبراسیون، با هماهنگی قبلی، برای کارفرمایان و مشاوران آزاد است.',
		btn1_text: 'هماهنگی بازدید', btn1_link: link('{{page:contact}}'),
		look: 'inverse',
		decor: 'grill',
		note: '',
	}),
];

/* ---------------- Contact ---------------- */

const contact = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'تماس و استعلام قیمت', title: 'پیش‌فاکتور،\n*در همان روز کاری*', title_tag: 'h1', title_size: 'xl', desc: 'سه مرحله‌ی کوتاه را تکمیل کنید یا مستقیم با واحد فروش تماس بگیرید.' }),
	]),
	section({ space: 'md' }, [
		cols({ widths: [60, 40], gap: 56 }, [
			[L.leadForm(RFQ)],
			[L.contactInfo([
				{ icon: 'phone', label: 'واحد فروش', value: '۰۲۱-۴۴۰۰۹۲۸۰', link: link('tel:+982144009280') },
				{ icon: 'wrench', label: 'پشتیبانی فنی ۲۴ ساعته', value: '۰۹۱۲ ۷۷۰ ۴۴۰۰', link: link('tel:+989127704400') },
				{ icon: 'mail', label: 'ایمیل فروش', value: 'sales@hamoon-ind.ir', link: link('mailto:sales@hamoon-ind.ir') },
				{ icon: 'factory', label: 'کارخانه', value: 'شهرک صنعتی عباس‌آباد، خیابان صنعت ۷، پلاک ۴۲', link: link('') },
				{ icon: 'pin', label: 'دفتر مرکزی', value: 'تهران، بزرگراه ستاری، خیابان پیامبر، ساختمان هامون', link: link('') },
			])],
		]),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *سفارش*' })],
			[L.faq(FAQ)],
		]),
	]),
];

/* ---------------- Blog ---------------- */

const terms = [
	{ key: 'cat-guide', taxonomy: 'category', name: 'راهنمای انتخاب', slug: 'selection-guides' },
	{ key: 'cat-maint', taxonomy: 'category', name: 'نگهداری و تعمیرات', slug: 'maintenance' },
	{ key: 'cat-auto', taxonomy: 'category', name: 'اتوماسیون', slug: 'automation' },
	{ key: 'pcat-control', taxonomy: 'product_cat', name: 'کنترل و اتوماسیون', slug: 'control-automation' },
	{ key: 'pcat-instrument', taxonomy: 'product_cat', name: 'ابزار دقیق', slug: 'instrumentation' },
	{ key: 'pcat-valve', taxonomy: 'product_cat', name: 'شیرآلات', slug: 'valves' },
	{ key: 'pcat-pump', taxonomy: 'product_cat', name: 'پمپ', slug: 'pumps' },
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

module.exports = {
	manifest: {
		id: 'industrial',
		order: 3,
		title: 'صنایع هامون',
		desc: 'شرکت صنعتی و فروش تجهیزات؛ طراحی اسکیومورفیک با کلیدهای فیزیکی، نمایشگرهای LCD و فرم استعلام قیمت.',
		kit: 'industrial',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: ['woocommerce'],
		tags: ['صنعتی', 'تولیدی', 'فروشگاه تجهیزات'],
		pages: ['خانه', 'خانه — مدل دوم', 'درباره‌ی ما', 'تماس و استعلام', 'دانشنامه', 'محصولات'],
	},
	content: {
		site: { title: 'صنایع هامون', tagline: 'تجهیزات کنترل فرایند، ساخت ایران' },
		images, alts, terms, posts, products,
		pages: [
			{ key: 'home', title: 'خانه', slug: 'home', elementor: homeA, settings: L.pageSettings({ header: 'transparent' }) },
			{ key: 'home-2', title: 'خانه — مدل دوم', slug: 'home-2', elementor: homeB, settings: L.pageSettings({ header: 'transparent' }) },
			{ key: 'about', title: 'درباره‌ی ما', slug: 'about', elementor: about, settings: L.pageSettings() },
			{ key: 'contact', title: 'تماس و استعلام قیمت', slug: 'contact', elementor: contact, settings: L.pageSettings() },
			{ key: 'blog', title: 'دانشنامه', slug: 'knowledge', content: '' },
		],
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'هامون — صفحه‌ی اصلی' },
			{ key: 'tpl-home-2', type: 'page', page: 'home-2', title: 'هامون — صفحه‌ی اصلی، مدل دوم' },
			{ key: 'tpl-about', type: 'page', page: 'about', title: 'هامون — درباره‌ی ما' },
			{ key: 'tpl-contact', type: 'page', page: 'contact', title: 'هامون — تماس و استعلام' },
			{ key: 'tpl-hscroll', type: 'section', page: 'home', index: 4, title: 'هامون — اسکرول افقی خطوط محصول' },
			{ key: 'tpl-lcd', type: 'section', page: 'home', index: 5, title: 'هامون — شمارنده‌های LCD' },
			{ key: 'tpl-zoom', type: 'section', page: 'home', index: 6, title: 'هامون — زوم با اسکرول کارخانه' },
			{ key: 'tpl-device-hero', type: 'section', page: 'home-2', index: 0, title: 'هامون — هیرو با موکاپ دستگاه' },
			{ key: 'tpl-stack', type: 'section', page: 'home-2', index: 3, title: 'هامون — کارت‌های پشته‌ای' },
		],
		menus: [
			{
				name: 'هامون — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home', children: [{ title: 'خانه — مدل اول', page: 'home' }, { title: 'خانه — مدل دوم', page: 'home-2' }] },
					{ title: 'محصولات', url: '{{shop}}', children: [
						{ title: 'کنترل و اتوماسیون', term: 'pcat-control' },
						{ title: 'ابزار دقیق', term: 'pcat-instrument' },
						{ title: 'شیرآلات', term: 'pcat-valve' },
						{ title: 'پمپ', term: 'pcat-pump' },
					] },
					{ title: 'دانشنامه', page: 'blog' },
					{ title: 'درباره‌ی ما', page: 'about' },
					{ title: 'تماس', page: 'contact' },
				],
			},
			{
				name: 'هامون — پابرگ', location: 'footer', items: [
					{ title: 'محصولات', url: '{{shop}}' },
					{ title: 'دانشنامه', page: 'blog' },
					{ title: 'درباره‌ی ما', page: 'about' },
					{ title: 'استعلام قیمت', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 38,
			header_layout: 'split',
			header_cta_text: 'استعلام قیمت',
			header_cta_url: '{{page:contact}}',
			footer_about: 'صنایع هامون از ۱۳۷۶ تجهیزات کنترل فرایند، ابزار دقیق، شیرآلات و پمپ‌های صنعتی را در ایران طراحی و تولید می‌کند.',
			footer_copyright: 'تمام حقوق برای صنایع هامون محفوظ است.',
			footer_social: [{ network: 'linkedin', url: 'https://linkedin.com/' }, { network: 'instagram', url: 'https://instagram.com/' }, { network: 'aparat', url: 'https://aparat.com/' }],
			mobile_bar: true,
			mobile_bar_text: 'استعلام قیمت',
			mobile_bar_url: '{{page:contact}}',
			mobile_bar_phone: '02144009280',
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', pages: { shop: 'محصولات', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
