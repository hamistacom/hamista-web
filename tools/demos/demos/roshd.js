/**
 * Demo: Roshd — management and growth consulting for small and medium firms (Coral kit).
 */
'use strict';

const L = require('../lib');
const { link, section, cols, heading, button } = L;

const images = { logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp' };
const anchor = (id, el) => { el.settings._element_id = id; return el; };

const BENTO = [
	{ wide: 'yes', tone: 'soft', icon: '', figure: '۳۸٪', title: 'رشد میانگین فروش در سال اول', text: 'میانگین شرکت‌هایی که دست‌کم دوازده ماه با ما کار کرده‌اند؛ از گزارش‌های مالی خودشان.' },
	{ tone: 'warm', icon: '', figure: '۲×', title: 'تصمیم‌گیری سریع‌تر', text: 'جلسه‌های کوتاه هفتگی به جای گزارش‌های بلند ماهانه.' },
	{ tone: 'dark', icon: 'chart', title: 'داشبورد مالی زنده', text: 'جریان نقدی، سود و هزینه‌ها در یک صفحه؛ به‌روز هر روز.' },
	{ tone: 'sand', icon: 'users', title: 'مشاور اختصاصی', text: 'یک نفر که کسب‌وکارتان را از نزدیک می‌شناسد و همیشه در دسترس است.' },
	{ wide: 'yes', tone: '', icon: 'target', title: 'برنامه‌ی رشد نودروزه', text: 'سه هدف روشن، دوازده هفته و یک جلسه‌ی هفتگی؛ بدون فایل‌های قطوری که هیچ‌وقت خوانده نمی‌شوند.' },
	{ tone: 'soft', icon: '', figure: '۲۴۰', title: 'شرکت همراه', text: 'از تولیدی‌های کوچک تا فروشگاه‌های چندشعبه.' },
];

const QUOTES = [
	{ quote: 'تا پیش از رشد، نمی‌دانستیم کدام محصول واقعاً سود می‌دهد. سه ماه بعد، نیمی از محصولات را کنار گذاشتیم و سودمان بیشتر شد.', name: 'نسرین طاهری', role: 'مدیرعامل، پوشاک طاها' },
	{ quote: 'جلسه‌های هفتگی کوتاه و دقیق است. مشاورمان قبل از جلسه اعداد را دیده و فقط درباره‌ی تصمیم‌ها حرف می‌زنیم.', name: 'حمید اسدی', role: 'بنیان‌گذار، کارگاه چوب اسدی' },
	{ quote: 'برای اولین بار برنامه‌ای داریم که همه‌ی تیم آن را می‌فهمد. داشبورد مالی را هر صبح با قهوه نگاه می‌کنم.', name: 'شیما فرجی', role: 'مدیر مالی، فروشگاه‌های نیلا' },
].map((q) => Object.assign({ rating: '0' }, q));

const FAQ = [
	['برای چه اندازه‌ای از شرکت‌ها مناسب است؟', 'شرکت‌هایی با پنج تا دویست نفر نیرو و فروش ماهانه‌ی دست‌کم یک میلیارد تومان. برای کسب‌وکارهای کوچک‌تر برنامه‌ی پایه را پیشنهاد می‌کنیم.'],
	['حداقل مدت همکاری چقدر است؟', 'سه ماه؛ یک برنامه‌ی رشد نودروزه. پس از آن هر ماه می‌توانید ادامه دهید یا متوقف کنید.'],
	['اطلاعات مالی ما محرمانه می‌ماند؟', 'بله. قرارداد عدم افشا پیش از اولین جلسه امضا می‌شود و دسترسی به داشبورد فقط برای شما و مشاورتان است.'],
	['اگر نتیجه نگرفتیم چه؟', 'اگر در پایان سه ماه هیچ‌یک از سه هدف برنامه محقق نشده باشد، هزینه‌ی ماه سوم را برمی‌گردانیم.'],
];

const PLANS = [
	{ name: 'پایه', desc: 'برای کسب‌وکارهای نوپا', price: '۱۸', price_alt: '۱۶', unit: 'میلیون تومان', period: 'ماهانه', features: 'برنامه‌ی رشد نودروزه\nجلسه‌ی دوهفتگی\nداشبورد مالی استاندارد\nپشتیبانی در پیام‌رسان', btn_text: 'شروع با پایه', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
	{ name: 'رشد', desc: 'برای شرکت‌های در حال گسترش', price: '۳۴', price_alt: '۳۰', unit: 'میلیون تومان', period: 'ماهانه', features: 'همه‌ی امکانات پایه\nمشاور اختصاصی\nجلسه‌ی هفتگی\nداشبورد مالی سفارشی\nبازبینی قیمت‌گذاری و هزینه‌ها', btn_text: 'شروع با رشد', btn_link: link('{{page:contact}}'), featured: 'yes', badge: 'بیشترین انتخاب' },
	{ name: 'همراه کامل', desc: 'برای گروه‌ها و شرکت‌های چندشعبه', price: 'توافقی', price_alt: 'توافقی', unit: '', period: '', features: 'تیم مشاوره‌ی اختصاصی\nحضور در جلسه‌های هیئت‌مدیره\nطراحی ساختار سازمانی\nآموزش مدیران میانی', btn_text: 'هماهنگی جلسه', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
];

/* ---------------- Home ---------------- */

const home = [
	L.bleed(L.w('hm-hero', {
		layout: 'center', title_tag: 'h1', title_size: 'xl', header_align: 'center', title_reveal: 'words',
		eyebrow: 'رشد · مشاوره‌ی مدیریت',
		title: 'کسب‌وکارتان را\n*با آرامش* بزرگ کنید',
		desc: 'برنامه‌ی رشد، داشبورد مالی و همراهی هفتگی مشاوران باتجربه؛ برای شرکت‌های کوچک و متوسطی که می‌خواهند بی‌آشفتگی بزرگ شوند.',
		btn1_text: 'جلسه‌ی آشنایی رایگان', btn1_link: link('{{page:contact}}'), btn1_style: 'primary',
		btn2_text: 'برنامه‌ها و هزینه‌ها', btn2_link: link('#plans'), btn2_style: 'secondary',
		media_type: 'none', height: 'auto', decor: '', hint: '',
	})),
	section({ space: 'md', top0: true, gap: 32 }, [
		L.features(BENTO, { layout: 'bento', style: 'cards', columns: '4', icon_style: 'soft' }),
	]),
	section({ space: 'sm', gap: 0 }, [
		L.con({ content_width: 'full', css_classes: 'hm-scheme-inverse hm-rounded', padding: L.pad(40, 48) }, [
			L.counters([
				{ value: 12, label: 'سال تجربه' },
				{ value: 240, label: 'شرکت همراه' },
				{ value: 38, suffix: '٪', label: 'رشد میانگین فروش' },
				{ value: 94, suffix: '٪', label: 'تمدید همکاری' },
			], { style: 'plain', columns: '4' }),
		], true),
	]),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'شیوه‌ی کار', title: 'چهار قدم، *دوازده هفته*', header_align: 'center' }),
		L.steps([
			{ marker: '', icon: 'search', title: 'شناخت', text: 'دو جلسه برای دیدن اعداد، فرایندها و تیم؛ بدون قضاوت.' },
			{ marker: '', icon: 'target', title: 'برنامه', text: 'سه هدف قابل اندازه‌گیری برای نود روز آینده.' },
			{ marker: '', icon: 'bolt', title: 'اجرا', text: 'جلسه‌ی هفتگی، کارهای مشخص و پیگیری دقیق.' },
			{ marker: '', icon: 'chart', title: 'سنجش', text: 'گزارش پایان دوره و برنامه‌ی سه ماه بعد.' },
		], { layout: 'h', cards: 'yes' }),
	]),
	section({ space: 'md', scheme: 'surface', gap: 40 }, [
		heading({ eyebrow: 'از زبان مدیران', title: 'اعداد، *نه وعده‌ها*' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]),
	anchor('plans', section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'برنامه‌ها', title: 'هزینه‌ی *روشن*، بی‌قرارداد بلندمدت', header_align: 'center', desc: 'همه‌ی برنامه‌ها با یک جلسه‌ی آشنایی رایگان شروع می‌شوند.' }),
		L.pricing(PLANS, { switch_off: 'پرداخت ماهانه', switch_on: 'پرداخت سه‌ماهه', switch_note: '۱۰٪ تخفیف' }),
	])),
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *شروع*' }), button('گفت‌وگو با ما', '{{page:contact}}', 'secondary')],
			[L.faq(FAQ)],
		]),
	]),
	L.cta({
		eyebrow: 'جلسه‌ی آشنایی',
		title: 'اولین جلسه\n*رایگان* است',
		desc: 'چهل‌وپنج دقیقه گفت‌وگو درباره‌ی کسب‌وکار شما؛ بدون تعهد و بدون فروش.',
		btn1_text: 'رزرو جلسه', btn1_link: link('{{page:contact}}'),
		btn2_text: '۰۲۱-۹۱۰۰۴۴۰۰', btn2_link: link('tel:+982191004400'),
		look: 'inverse', decor: '', note: '',
	}),
];

/* ---------------- Services ---------------- */

const services = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'خدمات', title: 'آنچه *با هم* می‌سازیم', title_tag: 'h1', title_size: 'xl', desc: 'هر همکاری با یک برنامه‌ی نودروزه شروع می‌شود؛ خدمات زیر بسته به اهداف آن برنامه به کار می‌آیند.' }),
	]),
	section({ space: 'md' }, [
		L.features([
			{ icon: 'chart', tone: 'soft', title: 'مدیریت مالی', text: 'بودجه‌بندی، جریان نقدی، قیمت‌گذاری و داشبورد مالی زنده.' },
			{ icon: 'target', tone: 'warm', title: 'استراتژی فروش', text: 'بازارهای هدف، کانال‌های فروش و ساختار تیم فروش.' },
			{ icon: 'users', tone: 'sand', title: 'منابع انسانی', text: 'ساختار سازمانی، شرح شغل و سیستم ارزیابی عملکرد.' },
			{ icon: 'cog', tone: '', title: 'فرایندها', text: 'مستندسازی و ساده‌سازی فرایندهای تکراری، از سفارش تا تحویل.' },
			{ icon: 'book', tone: '', title: 'آموزش مدیران', text: 'کارگاه‌های کوتاه برای مدیران میانی؛ تصمیم‌گیری، جلسه و بازخورد.' },
			{ icon: 'shield', tone: 'dark', title: 'مدیریت ریسک', text: 'شناسایی ریسک‌های مالی و عملیاتی پیش از آنکه دردسر شوند.' },
		], { layout: 'grid', style: 'cards', columns: '3', icon_style: 'soft' }),
	]),
];

/* ---------------- About ---------------- */

const about = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'درباره‌ی رشد', title: 'مشاورانی که\n*کار کرده‌اند*', title_tag: 'h1', title_size: 'xl' }),
	]),
	section({ space: 'md' }, [
		L.textScrub('رشد را در سال ۱۳۹۲ چند مدیر باتجربه راه انداختند که خودشان کسب‌وکار داشتند و از مشاوره‌های پرهزینه و بی‌نتیجه خسته بودند. قرارمان از روز اول یکی بود: *فقط* چیزی را پیشنهاد کنیم که *خودمان اجرا کرده‌ایم*.', { size: 'md' }),
	]),
	section({ space: 'sm', gap: 0 }, [
		L.con({ content_width: 'full', css_classes: 'hm-scheme-inverse hm-rounded', padding: L.pad(40, 48) }, [
			L.counters([
				{ value: 12, label: 'سال' },
				{ value: 18, label: 'مشاور' },
				{ value: 240, label: 'شرکت همراه' },
				{ value: 9, label: 'استان' },
			], { style: 'plain', columns: '4' }),
		], true),
	]),
];

/* ---------------- Contact ---------------- */

const contact = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'تماس', title: 'گفت‌وگو را *شروع* کنیم', title_tag: 'h1', title_size: 'xl', desc: 'فرم را پر کنید؛ ظرف یک روز کاری برای هماهنگی جلسه‌ی آشنایی تماس می‌گیریم.' }),
	]),
	section({ space: 'md' }, [
		cols({ widths: [40, 60], gap: 56 }, [
			[L.contactInfo([
				{ icon: 'phone', label: 'تلفن', value: '۰۲۱-۹۱۰۰۴۴۰۰', link: link('tel:+982191004400') },
				{ icon: 'mail', label: 'ایمیل', value: 'hello@roshd.co', link: link('mailto:hello@roshd.co') },
				{ icon: 'linkedin', label: 'لینکدین', value: 'roshd-consulting', link: link('https://linkedin.com/', true) },
				{ icon: 'pin', label: 'دفتر', value: 'تهران، خیابان ملاصدرا، شیخ‌بهایی شمالی، پلاک ۲۲', link: link('') },
			])],
			[L.contactForm({ show_phone: 'yes', label_phone: 'شماره‌ی تماس', show_subject: 'yes', label_subject: 'نام شرکت', label_name: 'نام و نام خانوادگی', label_email: 'ایمیل', label_message: 'بزرگ‌ترین چالش این روزهای کسب‌وکارتان چیست؟', button: 'ارسال', success: 'پیامتان رسید؛ ظرف یک روز کاری تماس می‌گیریم.' })],
		]),
	]),
];

module.exports = {
	manifest: {
		id: 'roshd',
		order: 11,
		title: 'رشد',
		desc: 'مشاوره‌ی مدیریت و رشد کسب‌وکار؛ پنل‌های بنتو با رنگ‌های نرم، نوار آمار و جدول قیمت.',
		kit: 'coral',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: [],
		tags: ['شرکتی', 'مشاوره', 'کسب‌وکار'],
		pages: ['خانه', 'خدمات', 'درباره‌ی رشد', 'تماس'],
	},
	content: {
		site: { title: 'رشد', tagline: 'مشاوره‌ی مدیریت و رشد کسب‌وکار' },
		images, alts: {}, terms: [], posts: [],
		pages: [
			{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings({ header: '' }) },
			{ key: 'services', title: 'خدمات', slug: 'services', elementor: services, settings: L.pageSettings() },
			{ key: 'about', title: 'درباره‌ی رشد', slug: 'about', elementor: about, settings: L.pageSettings() },
			{ key: 'contact', title: 'تماس', slug: 'contact', elementor: contact, settings: L.pageSettings() },
		],
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'رشد — صفحه‌ی اصلی' },
			{ key: 'tpl-bento', type: 'section', page: 'home', index: 1, title: 'رشد — پنل‌های بنتو' },
			{ key: 'tpl-stats', type: 'section', page: 'home', index: 2, title: 'رشد — نوار آمار' },
			{ key: 'tpl-plans', type: 'section', page: 'home', index: 5, title: 'رشد — جدول قیمت' },
		],
		menus: [
			{
				name: 'رشد — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'خدمات', page: 'services' },
					{ title: 'برنامه‌ها', url: '#plans' },
					{ title: 'درباره‌ی رشد', page: 'about' },
					{ title: 'تماس', page: 'contact' },
				],
			},
			{
				name: 'رشد — پابرگ', location: 'footer', items: [
					{ title: 'خدمات', page: 'services' },
					{ title: 'درباره‌ی رشد', page: 'about' },
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
			header_cta_text: 'جلسه‌ی رایگان',
			header_cta_url: '{{page:contact}}',
			font_body: 'iransansx',
			font_heading: 'peyda',
			font_heading_weight: '700',
			footer_about: 'رشد، مشاوره‌ی مدیریت و رشد برای شرکت‌های کوچک و متوسط؛ با برنامه‌های نودروزه و همراهی هفتگی.',
			footer_copyright: 'تمام حقوق برای رشد محفوظ است.',
			footer_social: [{ network: 'linkedin', url: 'https://linkedin.com/' }, { network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }],
			mobile_bar: true,
			mobile_bar_text: 'جلسه‌ی رایگان',
			mobile_bar_url: '{{page:contact}}',
			mobile_bar_phone: '02191004400',
		},
		front_page: 'home',
	},
};
