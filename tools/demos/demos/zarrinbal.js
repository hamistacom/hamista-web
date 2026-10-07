/**
 * Demo: Zarrinbal — private jet charter (Aurum kit).
 */
'use strict';

const L = require('../lib');
const { img, link, px, section, cols, heading, button } = L;

const images = { logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp' };
['silk-hero', 'silk-wide', 'silk-tall', 'silk-card-1', 'silk-card-2', 'silk-card-3'].forEach((k) => { images[k] = 'images/' + k + '.webp'; });

const alts = {
	'silk-hero': 'موج ابریشم طلایی روی زمینه‌ی سیاه', 'silk-wide': 'نوار ابریشم طلایی', 'silk-tall': 'چین‌های ابریشم طلایی',
	'silk-card-1': 'ابریشم طلایی', 'silk-card-2': 'ابریشم طلایی', 'silk-card-3': 'ابریشم نقره‌ای',
};

const FLEET = [
	{ title: 'سسنا سایتیشن XLS+\u200e', text: 'جت سبک و چابک برای پروازهای داخلی و کشورهای همسایه؛ کابین ایستاده و دو موتور.', meta: '۹ مسافر · برد ۳٬۴۰۰ کیلومتر' },
	{ title: 'امبرائر لگسی ۶۵۰', text: 'کابین سه‌بخشی با فضای کار و استراحت؛ از تهران تا اروپا بدون توقف.', meta: '۱۳ مسافر · برد ۷٬۲۰۰ کیلومتر' },
	{ title: 'بمباردیه گلوبال ۶۰۰۰', text: 'اتاق خواب، حمام کامل و اینترنت در طول پرواز؛ برای سفرهای بین قاره‌ای.', meta: '۱۳ مسافر · برد ۱۱٬۱۰۰ کیلومتر' },
	{ title: 'گلف‌استریم G550', text: 'دوربردترین جت ناوگان؛ آرام، بی‌صدا و آماده‌ی پروازهای طولانی شبانه.', meta: '۱۴ مسافر · برد ۱۲٬۵۰۰ کیلومتر' },
];

const QUOTES = [
	{ quote: 'ساعت یازده شب تماس گرفتم و هفت صبح در فرودگاه دبی بودم. هیچ‌کس سؤال اضافه‌ای نپرسید؛ همه‌چیز از قبل آماده بود.', name: 'م. ر.', role: 'مدیرعامل یک گروه صنعتی' },
	{ quote: 'برای پدرم که نمی‌توانست ساعت‌ها در فرودگاه منتظر بماند، پرواز اختصاصی تنها راه بود. خدمه با حوصله‌ای کم‌نظیر از او مراقبت کردند.', name: 'س. ک.', role: 'پرواز تهران ← استانبول' },
	{ quote: 'کارت پرواز زرین‌بال برنامه‌ی سفرهای کاری ما را عوض کرد؛ سه شهر در یک روز، و شب در خانه.', name: 'ع. ن.', role: 'عضو کارت پرواز' },
].map((q) => Object.assign({ rating: '0' }, q));

/* ---------------- Home ---------------- */

const home = [
	L.bleed(L.w('hm-hero', {
		layout: 'full', title_tag: 'h1', title_size: 'xl', header_align: 'start', title_reveal: 'words', title_stagger: 'yes',
		eyebrow: 'زرین‌بال · هواپیمایی خصوصی',
		title: 'پرواز\nخصوصی',
		desc: 'جت شخصی، هر وقت و به هر مقصد؛ با خدمه‌ای که پیش از سوار شدن، سلیقه‌ی شما را می‌دانند.',
		btn1_text: 'درخواست پرواز', btn1_link: link('{{page:contact}}'), btn1_style: 'orb',
		btn2_text: '',
		stats: [
			{ value: '۱۴', suffix: '', label: 'جت آماده‌ی پرواز' },
			{ value: '۶۲', suffix: '', label: 'فرودگاه در ۲۴ کشور' },
			{ value: '۲', suffix: '', label: 'ساعت از درخواست تا پرواز' },
		],
		media_type: 'image', image: img('silk-hero'), height: 'screen', decor: '', overlay: px(0.05), hint: '',
	})),
	section({ space: 'md', width: 1000 }, [
		L.textScrub('زمان تنها چیزی است که *نمی‌شود خرید*؛ اما می‌شود آن را پس گرفت. بی‌صف، بی‌توقف و بی‌انتظار؛ از درِ خانه تا *پله‌ی هواپیما*، در کمتر از بیست دقیقه.', { eyebrow: 'فلسفه‌ی ما', size: 'lg' }),
	]),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [55, 45], align: 'flex-end' }, [
			[heading({ eyebrow: 'خدمات', title: 'هر پرواز،\n*به اندازه‌ی شما*' })],
			[L.textEditor('<p>از یک سفر کاری چندساعته تا انتقال پزشکی اضطراری؛ برنامه را شما می‌گویید و بقیه را ما.</p>')],
		]),
		L.features([
			{ icon: 'plane', title: 'پرواز اختصاصی', text: 'جت مناسب سفرتان را انتخاب کنید؛ مسیر، ساعت و پذیرایی را خودتان تعیین می‌کنید. بدون صف، بدون بازرسی‌های طولانی، از ترمینال اختصاصی.', meta: 'از ۲ ساعت پس از درخواست' },
			{ icon: 'card', title: 'کارت پرواز', text: 'ساعت پرواز را از پیش بخرید؛ با نرخ ثابت و بی‌دغدغه‌ی دسترسی.' },
			{ icon: 'ticket', title: 'پروازهای برگشت خالی', text: 'جت‌هایی که بی‌مسافر برمی‌گردند، تا نصف قیمت.' },
			{ icon: 'pulse', title: 'آمبولانس هوایی', text: 'کابین پزشکی مجهز، با پزشک و پرستار همراه.' },
			{ icon: 'star', title: 'خدمات زمینی', text: 'خودرو، هتل و تشریفات مقصد؛ پیش از رسیدن شما.' },
		], { layout: 'grid', style: 'cards', columns: '3', icon_style: 'plain', lead: 'yes' }),
	]),
	section({ space: 'md', scheme: 'surface', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[
				heading({ eyebrow: 'ناوگان', title: 'چهار جت،\n*چهار فاصله*', desc: 'همه‌ی هواپیماها زیر نظر سازمان هواپیمایی کشوری و با خلبانانی با بیش از ده هزار ساعت پرواز.' }),
				button('همه‌ی جزئیات ناوگان', '{{page:fleet}}', 'secondary'),
			],
			[L.features(FLEET.map((f) => Object.assign({ icon: '' }, f)), { layout: 'list', style: 'plain', icon_style: 'plain', numbered: 'yes' })],
		]),
	]),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [45, 55], gap: 72, align: 'center' }, [
			[L.imageReveal('silk-tall', { ratio: '3-4', reveal: 'clip-up', parallax: px(0.25) })],
			[
				heading({ eyebrow: 'تجربه', title: 'جزئیاتی که\n*دیده نمی‌شوند*', desc: 'خوب‌ترین پرواز آن است که چیزی از آن به خاطر نیاورید جز آرامش.' }),
				L.features([
					{ icon: 'shield', title: 'ترمینال اختصاصی', text: 'ورود و خروج در کمتر از ده دقیقه.' },
					{ icon: 'coffee', title: 'پذیرایی به سلیقه‌ی شما', text: 'منو را پیش از پرواز با شما هماهنگ می‌کنیم.' },
					{ icon: 'heart', title: 'همسفر چهارپا', text: 'حیوان خانگی‌تان در کابین، کنار شما.' },
					{ icon: 'clock', title: 'تغییر بی‌هزینه', text: 'تا یک ساعت پیش از پرواز، ساعت را عوض کنید.' },
				], { layout: 'grid', style: 'plain', columns: '2', icon_style: 'plain' }),
			],
		]),
	]),
	section({ space: 'sm', scheme: 'surface' }, [
		L.counters([
			{ value: 14, label: 'جت' },
			{ value: 62, label: 'فرودگاه' },
			{ value: 4800, label: 'ساعت پرواز در سال' },
			{ value: 99.6, suffix: '٪', label: 'پرواز به‌موقع' },
		], { style: 'plain', columns: '4' }),
	]),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'مسافران', title: 'به روایت *آن‌ها*', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'carousel' }),
	]),
	L.cta({
		eyebrow: 'زرین‌بال',
		title: 'پرواز بعدی‌تان را\n*امروز* برنامه‌ریزی کنید',
		desc: 'مشاوران پرواز ما هر ساعت از شبانه‌روز پاسخ‌گو هستند.',
		btn1_text: 'درخواست پرواز', btn1_link: link('{{page:contact}}'), btn1_style: 'orb',
		btn2_text: '۰۲۱-۸۸۰۰۰۹۰۰', btn2_link: link('tel:+982188000900'), btn2_style: 'secondary',
		look: 'image', image: img('silk-wide'), decor: '', note: '',
	}),
];

/* ---------------- Fleet ---------------- */

const fleet = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'ناوگان', title: 'ناوگان *زرین‌بال*', title_tag: 'h1', title_size: 'xl', desc: 'هر جت پیش از هر پرواز بازرسی فنی کامل می‌شود و کابینش برای همان سفر آماده می‌شود.' }),
	]),
	section({ space: 'md' }, [
		L.features(FLEET.map((f, i) => Object.assign({ icon: '', image: img(['silk-card-1', 'silk-card-2', 'silk-card-3', 'silk-wide'][i]), link: link('{{page:contact}}') }, f)), { layout: 'grid', style: 'cards', columns: '2', icon_style: 'plain', link_text: 'درخواست این جت' }),
	]),
];

/* ---------------- About ---------------- */

const about = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'درباره‌ی ما', title: 'ده سال،\n*بی‌هیچ عجله‌ای*', title_tag: 'h1', title_size: 'xl' }),
	]),
	section({ space: 'md' }, [
		cols({ widths: [50, 50], gap: 64, align: 'center' }, [
			[L.textScrub('زرین‌بال را گروهی از خلبانان و مدیران هوانوردی بنیان گذاشتند که سال‌ها در خطوط هوایی بین‌المللی پرواز کرده بودند. باور داشتیم پرواز خصوصی باید *آرام، دقیق و بی‌ادعا* باشد؛ و هنوز همین را باور داریم.', { size: 'md' })],
			[L.imageReveal('silk-card-3', { ratio: '4-3', reveal: 'clip-up', parallax: px(0.2) })],
		]),
	]),
	section({ space: 'sm', scheme: 'surface' }, [
		L.counters([
			{ value: 10, label: 'سال' },
			{ value: 38, label: 'خلبان' },
			{ value: 12000, label: 'پرواز' },
			{ value: 0, label: 'حادثه' },
		], { style: 'plain', columns: '4' }),
	]),
];

/* ---------------- Contact ---------------- */

const contact = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'درخواست پرواز', title: 'کجا و *کِی*؟', title_tag: 'h1', title_size: 'xl', desc: 'مبدأ، مقصد، تاریخ و تعداد مسافران را بنویسید؛ مشاور پرواز ظرف سی دقیقه با پیشنهاد جت و قیمت تماس می‌گیرد.' }),
	]),
	section({ space: 'md' }, [
		cols({ widths: [40, 60], gap: 56 }, [
			[L.contactInfo([
				{ icon: 'phone', label: 'مشاوره‌ی پرواز، شبانه‌روزی', value: '۰۲۱-۸۸۰۰۰۹۰۰', link: link('tel:+982188000900') },
				{ icon: 'whatsapp', label: 'واتس‌اپ', value: '۰۹۱۲ ۰۰۰ ۹۰۰۹', link: link('https://wa.me/989120009009', true) },
				{ icon: 'mail', label: 'ایمیل', value: 'flight@zarrinbal.ir', link: link('mailto:flight@zarrinbal.ir') },
				{ icon: 'pin', label: 'ترمینال اختصاصی', value: 'تهران، فرودگاه مهرآباد، ترمینال CIP', link: link('') },
			])],
			[L.contactForm({ show_phone: 'yes', label_phone: 'شماره‌ی تماس', show_subject: 'yes', label_subject: 'مسیر و تاریخ', label_name: 'نام', label_email: 'ایمیل', label_message: 'جزئیات سفر (تعداد مسافران، بار، درخواست‌های خاص)', button: 'ارسال درخواست', success: 'درخواستتان رسید. مشاور پرواز ظرف سی دقیقه تماس می‌گیرد.' })],
		]),
	]),
];

/* ---------------- Journal ---------------- */

const terms = [{ key: 'cat-notes', taxonomy: 'category', name: 'یادداشت', slug: 'notes' }];

const posts = [
	{
		key: 'empty-legs', title: 'پروازهای برگشت خالی چیست؟', slug: 'empty-legs', image: 'silk-card-1', terms: ['cat-notes'], days_ago: 4,
		excerpt: 'راهی برای تجربه‌ی پرواز خصوصی با کمتر از نصف قیمت.',
		content: L.article([
			'وقتی جتی مسافری را به مقصد می‌رساند و خالی برمی‌گردد، صندلی‌هایش را با تخفیفی بزرگ عرضه می‌کنیم. تاریخ و ساعت این پروازها از پیش تعیین است، اما قیمتشان گاهی کمتر از نصف است.',
			['ul', ['فهرست پروازهای خالی هر روز به‌روز می‌شود.', 'تا هفت مسافر می‌توانند از یک پرواز استفاده کنند.', 'رزرو تا شش ساعت پیش از پرواز امکان‌پذیر است.']],
		]),
	},
	{
		key: 'jet-card', title: 'کارت پرواز برای چه کسانی مناسب است؟', slug: 'jet-card', image: 'silk-card-2', terms: ['cat-notes'], days_ago: 12,
		excerpt: 'اگر سالی بیش از بیست و پنج ساعت پرواز دارید.',
		content: L.article([
			'کارت پرواز یعنی خرید ساعت پرواز از پیش، با نرخ ثابت و دسترسی تضمین‌شده. برای کسانی که سالی بیش از بیست‌وپنج ساعت پرواز دارند، معمولاً به‌صرفه‌تر از پرواز موردی است.',
		]),
	},
	{
		key: 'cabin', title: 'کابینی که برای شما آماده می‌شود', slug: 'cabin', image: 'silk-card-3', terms: ['cat-notes'], days_ago: 20,
		excerpt: 'از دمای کابین تا روزنامه‌ی صبح.',
		content: L.article([
			'پیش از هر پرواز، مشاور شما سلیقه‌تان را می‌پرسد: دمای کابین، نوع پذیرایی، روزنامه‌ها و حتی موسیقی. این جزئیات در پرونده‌تان می‌ماند تا پرواز بعدی بی‌سؤال آماده شود.',
		]),
	},
];

module.exports = {
	manifest: {
		id: 'zarrinbal',
		order: 10,
		title: 'زرین‌بال',
		desc: 'هواپیمایی خصوصی؛ سیاه و طلایی، تیتر نازک دوپاره، دکمه‌ی گرد فلزی و موج ابریشم.',
		kit: 'aurum',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: [],
		tags: ['لوکس', 'هوانوردی', 'شرکتی'],
		pages: ['خانه', 'ناوگان', 'درباره‌ی ما', 'درخواست پرواز', 'یادداشت‌ها'],
	},
	content: {
		site: { title: 'زرین‌بال', tagline: 'هواپیمایی خصوصی' },
		images, alts, terms, posts,
		pages: [
			{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings({ header: 'transparent-light' }) },
			{ key: 'fleet', title: 'ناوگان', slug: 'fleet', elementor: fleet, settings: L.pageSettings() },
			{ key: 'about', title: 'درباره‌ی ما', slug: 'about', elementor: about, settings: L.pageSettings() },
			{ key: 'contact', title: 'درخواست پرواز', slug: 'request', elementor: contact, settings: L.pageSettings() },
			{ key: 'blog', title: 'یادداشت‌ها', slug: 'notes', content: '' },
		],
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'زرین‌بال — صفحه‌ی اصلی' },
			{ key: 'tpl-hero', type: 'section', page: 'home', index: 0, title: 'زرین‌بال — هیرو با تیتر دوپاره' },
			{ key: 'tpl-fleet', type: 'section', page: 'home', index: 3, title: 'زرین‌بال — فهرست ناوگان' },
		],
		menus: [
			{
				name: 'زرین‌بال — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'ناوگان', page: 'fleet' },
					{ title: 'یادداشت‌ها', page: 'blog' },
					{ title: 'درباره‌ی ما', page: 'about' },
				],
			},
			{
				name: 'زرین‌بال — پابرگ', location: 'footer', items: [
					{ title: 'ناوگان', page: 'fleet' },
					{ title: 'یادداشت‌ها', page: 'blog' },
					{ title: 'درباره‌ی ما', page: 'about' },
					{ title: 'درخواست پرواز', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 36,
			header_layout: 'split',
			header_cart: false,
			header_search: false,
			header_cta_text: 'درخواست پرواز',
			header_cta_url: '{{page:contact}}',
			color_scheme: 'dark',
			font_body: 'peyda',
			font_body_weight: '300',
			font_heading: 'doran',
			font_heading_weight: '300',
			footer_about: 'زرین‌بال، هواپیمایی خصوصی؛ پرواز اختصاصی، کارت پرواز و آمبولانس هوایی از تهران به ۶۲ فرودگاه در ۲۴ کشور.',
			footer_copyright: 'تمام حقوق برای زرین‌بال محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'linkedin', url: 'https://linkedin.com/' }, { network: 'whatsapp', url: 'https://wa.me/989120009009' }],
			mobile_bar: true,
			mobile_bar_text: 'درخواست پرواز',
			mobile_bar_url: '{{page:contact}}',
			mobile_bar_phone: '02188000900',
		},
		front_page: 'home',
		posts_page: 'blog',
	},
};
