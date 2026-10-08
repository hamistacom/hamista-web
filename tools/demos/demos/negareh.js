/**
 * Demo: Negareh — a digital art studio and collection (Nova kit). Dark first
 * with a light mode, a floating glass header, and a hero whose fanned card
 * deck shows the studio's services: the arrows bring the next card flying
 * onto the deck while its title types itself in.
 *
 * Artwork comes from the reference designs; the page itself uses only type,
 * glass panels and thin line contours.
 */
'use strict';

const L = require('../lib');
const { img, link, px, section, cols, heading, button, fx } = L;

const images = { logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp', 'card-1': 'images/card-1.webp', 'card-2': 'images/card-2.webp', members: 'images/members.webp' };
const alts = {
	'card-1': 'کاراکتر سه‌بعدی پرنده با عینک نارنجی و کاپشن رنگارنگ',
	'card-2': 'کاراکتر سه‌بعدی صورتی با هدفون و کلاه',
	members: 'چهره‌ی چند هنرمند عضو',
};

const shopUrl = '{{shop}}';

/* ---------------- Shared ---------------- */

const SERVICES = [
	{ image: img('card-1'), label: 'خدمت', title: 'طراحی کاراکتر سه‌بعدی', text: 'از طرح اولیه تا مدل نهایی و رندر؛ با سه دور بازبینی.', person: 'استودیو نگاره', meta: 'تحویل ۲۱ روزه', tag_label: 'از', tag: '۱۸ میلیون تومان', url: '{{page:services}}' },
	{ image: img('card-2'), label: 'خدمت', title: 'هنر دیجیتال و پوستر', text: 'پوستر، کاور و تصویرسازی برای برند، آلبوم و کمپین.', person: 'استودیو نگاره', meta: 'تحویل ۱۰ روزه', tag_label: 'از', tag: '۹ میلیون تومان', url: '{{page:services}}' },
	{ image: img('card-1'), label: 'کلکسیون', title: 'کلکسیون اختصاصی برند', text: 'مجموعه‌ای از کاراکترها با یک داستان و یک زبان بصری.', person: 'استودیو نگاره', meta: 'تحویل ۴۵ روزه', tag_label: 'از', tag: '۶۰ میلیون تومان', url: '{{page:services}}' },
	{ image: img('card-2'), label: 'آموزش', title: 'کارگاه طراحی کاراکتر', text: 'شش جلسه‌ی آنلاین، از ایده تا رندر نهایی.', person: 'استودیو نگاره', meta: 'شروع ۱ آبان', tag_label: 'هزینه', tag: '۴٫۸ میلیون تومان', url: '{{page:services}}' },
];

const FAQ = [
	['مالکیت اثر سفارشی با کیست؟', 'پس از تسویه، همه‌ی حقوق استفاده‌ی تجاری اثر به شما منتقل می‌شود و فایل‌های لایه‌باز را تحویل می‌گیرید.'],
	['می‌توانم طرح را پیش از نهایی شدن ببینم؟', 'بله؛ هر سفارش سه دور بازبینی دارد: طرح خطی، مدل خام و رندر نهایی.'],
	['آثار فروشگاه را کجا استفاده کنم؟', 'آثار فروشگاه با مجوز استفاده‌ی شخصی و تجاری محدود فروخته می‌شوند؛ جزئیات مجوز در صفحه‌ی هر اثر آمده است.'],
	['پرداخت چطور است؟', 'پرداخت آنلاین با همه‌ی کارت‌های بانکی؛ برای سفارش‌های اختصاصی پرداخت در دو مرحله انجام می‌شود.'],
];

const ctaBand = () => fx(section({ space: 'md', gap: 24, cls: 'hm-contours' }, [
	heading({ eyebrow: 'شروع همکاری', title: 'کاراکتر برندتان را\n*با هم بسازیم*', header_align: 'center', desc: 'یک جلسه‌ی آشنایی رایگان؛ ایده‌تان را بگویید، پیشنهاد مکتوب بگیرید.' }),
	L.buttons(['ثبت سفارش', '{{page:contact}}', 'primary'], ['دیدن آثار', shopUrl, 'secondary'], { align: 'center' }),
]), { cards: 'cascade' });

/* ---------------- Home ---------------- */

const home = [
	section({ space: 'lg', gap: 40, cls: 'hm-contours' }, [
		cols({ widths: [56, 44], gap: 48, align: 'center', reverseMobile: true }, [
			[
				heading({ eyebrow: 'نگاره · استودیو و گالری هنر دیجیتال', title: 'کشف و خرید\n*کلکسیون‌های* تازه', title_tag: 'h1', title_size: 'xl', title_reveal: 'words', desc: 'کاراکترهای سه‌بعدی، پوستر و آثار دیجیتال؛ آماده برای خرید یا سفارش اختصاصی برای برند شما.' }),
				L.buttons(['شروع کنید', shopUrl, 'primary'], ['خدمات استودیو', '{{page:services}}', 'secondary']),
				L.counters([
					{ value: 43, suffix: ' هزار+', label: 'اثر در کلکسیون‌ها' },
					{ value: 16, suffix: ' هزار', label: 'حراج برگزارشده' },
					{ value: 10, suffix: ' هزار+', label: 'هنرمند' },
				], { style: 'plain', columns: '3' }),
			],
			[L.cardStack(SERVICES, { autoplay: 6 })],
		]),
	]),
	L.marquee(['استودیو آوا', 'گالری نقش', 'کافه‌کتاب', 'برند پرنیان', 'نشر افق', 'بازی‌سازی آرش', 'موسیقی نوا'], { look: 'muted', size: 'md', separator: 'dot', speed: px(36) }),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'خدمات', title: 'از ایده\n*تا اثر نهایی*', desc: 'هر سفارش یک مدیر پروژه، جدول زمانی روشن و سه دور بازبینی دارد.' })],
			[button('همه‌ی خدمات', '{{page:services}}', 'secondary', { _flex_align_self: 'flex-end' })],
		]),
		L.features([
			{ icon: 'cube', title: 'کاراکتر سه‌بعدی', text: 'مدل‌سازی، بافت و رندر برای کمپین، بازی و کلکسیون.', meta: '۲۱ روز' },
			{ icon: 'palette', title: 'هنر دیجیتال', text: 'پوستر، کاور آلبوم و تصویرسازی با زبان بصری برند.', meta: '۱۰ روز' },
			{ icon: 'layers', title: 'کلکسیون برند', text: 'مجموعه‌ای از کاراکترها با داستان و قواعد یکسان.', meta: '۴۵ روز' },
			{ icon: 'play', title: 'موشن کوتاه', text: 'حرکت چندثانیه‌ای کاراکتر برای ریلز و استوری.', meta: '۷ روز' },
		], { layout: 'grid', style: 'cards', columns: '4', icon_style: 'tile' }),
	]), { cards: 'cascade' }),
	section({ space: 'md', gap: 32 }, [
		L.productCarousel({ eyebrow: 'فروشگاه', title: 'آثار *تازه*', source: 'recent', count: 8, card_ratio: '1-1', card_parts: ['badges', 'hover', 'cart'], more_text: 'همه‌ی آثار', more_link: link(shopUrl) }),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'چطور کار می‌کند', title: 'سه قدم تا\n*اثر خودتان*', header_align: 'center' }),
		L.steps([
			{ marker: '۰۱', icon: 'user', title: 'ثبت‌نام', text: 'با شماره‌ی موبایل، در چند ثانیه.' },
			{ marker: '۰۲', icon: 'search', title: 'انتخاب یا سفارش', text: 'اثری را بخرید یا سفارش اختصاصی بدهید.' },
			{ marker: '۰۳', icon: 'check', title: 'دریافت', text: 'فایل‌ها و مجوز استفاده، بلافاصله پس از پرداخت.' },
		], { layout: 'h', cards: 'yes' }),
	]), { cards: 'cascade' }),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [40, 60], gap: 64, align: 'center' }, [
			[
				heading({ eyebrow: 'اعضا', title: 'جامعه‌ی\n*هنرمندان نگاره*', desc: 'بیش از ده هزار هنرمند اثرشان را این‌جا عرضه می‌کنند؛ شما هم بپیوندید.' }),
				L.w('image', { image: img('members'), image_size: 'full', align: 'start' }),
			],
			[L.counters([
				{ value: 43, suffix: ' هزار+', label: 'اثر' },
				{ value: 10, suffix: ' هزار+', label: 'هنرمند' },
				{ value: 98, suffix: '٪', label: 'رضایت خریداران' },
				{ value: 24, label: 'ساعت پاسخ‌گویی' },
			], { style: 'plain', columns: '2' })],
		]),
	]), { tone: 'surface' }),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از\n*خرید*' }), button('همه‌ی پرسش‌ها', '{{page:faq}}', 'secondary')],
			[L.faq(FAQ, { style: 'lines' })],
		]),
	]),
	ctaBand(),
];

/* ---------------- Services ---------------- */

const services = [
	L.pageHead('خدمات', 'کاراکتری که\n*یادش می‌ماند*', 'هر سفارش با یک جلسه‌ی آشنایی شروع می‌شود و با فایل‌های لایه‌باز و مجوز کامل تمام می‌شود.'),
	section({ space: 'md', gap: 40, cls: 'hm-contours' }, [
		cols({ widths: [50, 50], gap: 56, align: 'center' }, [
			[L.cardStack(SERVICES, { autoplay: 0 })],
			[L.features([
				{ icon: '', title: 'جلسه‌ی آشنایی', text: 'هدف، مخاطب و حال‌وهوای کاراکتر را با هم مشخص می‌کنیم.' },
				{ icon: '', title: 'طرح خطی', text: 'سه طرح اولیه؛ یکی را انتخاب می‌کنید.' },
				{ icon: '', title: 'مدل و بافت', text: 'مدل سه‌بعدی، رنگ و جنس، با یک دور بازبینی.' },
				{ icon: '', title: 'رندر و تحویل', text: 'رندر نهایی، فایل‌های لایه‌باز و مجوز کامل.' },
			], { layout: 'list', style: 'plain', numbered: 'yes', icon_style: 'plain' })],
		]),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'تعرفه', title: 'قیمت *روشن*', header_align: 'center' }),
		L.pricing([
			{ name: 'پوستر', desc: 'یک اثر دیجیتال', price: '۹', price_alt: '', unit: 'میلیون تومان', period: 'از', features: 'یک طرح نهایی\nدو دور بازبینی\nفایل چاپی', btn_text: 'سفارش', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
			{ name: 'کاراکتر', desc: 'مدل سه‌بعدی کامل', price: '۱۸', price_alt: '', unit: 'میلیون تومان', period: 'از', features: 'سه طرح اولیه\nمدل و بافت\nسه رندر نهایی\nفایل‌های لایه‌باز', btn_text: 'سفارش', btn_link: link('{{page:contact}}'), featured: 'yes', badge: 'پرسفارش' },
			{ name: 'کلکسیون', desc: 'مجموعه‌ی برند', price: '۶۰', price_alt: '', unit: 'میلیون تومان', period: 'از', features: 'تا ۱۲ کاراکتر\nداستان و قواعد بصری\nموشن کوتاه\nمجوز تجاری کامل', btn_text: 'سفارش', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
		], { switch_off: '', switch_on: '' }),
	]), { cards: 'cascade' }),
	ctaBand(),
];

/* ---------------- About, FAQ, contact ---------------- */

const about = [
	L.pageHead('درباره‌ی نگاره', 'استودیویی برای\n*کاراکترها*', 'نگاره را سال ۱۳۹۹ چند طراح سه‌بعدی و تصویرگر راه انداختند تا آثار دیجیتال ایرانی جایی برای دیده شدن و فروخته شدن داشته باشند.'),
	section({ space: 'md', width: 1000 }, [
		L.textScrub('ما باور داریم هر برند می‌تواند یک *چهره* داشته باشد؛ کاراکتری که مردم با آن *رابطه* بسازند، نه فقط یک لوگو.', { size: 'md' }),
	]),
	fx(section({ space: 'sm' }, [
		L.counters([
			{ value: 6, label: 'سال' },
			{ value: 14, label: 'طراح و تصویرگر' },
			{ value: 320, suffix: '+', label: 'کاراکتر سفارشی' },
			{ value: 10, suffix: ' هزار+', label: 'هنرمند عضو' },
		], { style: 'plain', columns: '4' }),
	]), { tone: 'surface' }),
	ctaBand(),
];

const faqPage = [
	L.pageHead('پرسش‌های متداول', 'پیش از *خرید*', 'اگر جوابتان این‌جا نیست، از صفحه‌ی تماس بپرسید.'),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [30, 70], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'خرید و *سفارش*', title_size: 'md' })],
			[L.faq(FAQ, { style: 'lines' })],
		]),
	]),
	ctaBand(),
];

const contact = [
	L.pageHead('تماس و سفارش', 'ایده‌تان را\n*بگویید*', 'ظرف یک روز کاری برای هماهنگی جلسه‌ی آشنایی تماس می‌گیریم.'),
	section({ space: 'md' }, [
		cols({ widths: [40, 60], gap: 64 }, [
			[L.contactInfo([
				{ icon: 'mail', label: 'ایمیل', value: 'hello@negareh.art', link: link('mailto:hello@negareh.art') },
				{ icon: 'instagram', label: 'اینستاگرام', value: 'negareh.art', link: link('https://instagram.com/', true) },
				{ icon: 'phone', label: 'تلفن', value: '۰۲۱-۸۸۴۴۲۲۱۰', link: link('tel:+982188442210') },
				{ icon: 'clock', label: 'ساعت کاری', value: 'شنبه تا چهارشنبه، ۱۰ تا ۱۸', link: link('') },
			])],
			[L.contactForm({ show_phone: 'yes', label_phone: 'شماره‌ی موبایل', show_subject: 'yes', label_subject: 'نوع سفارش', label_name: 'نام و نام خانوادگی', label_email: 'ایمیل', label_message: 'درباره‌ی ایده‌تان بنویسید', button: 'ارسال', success: 'پیامتان رسید؛ ظرف یک روز کاری تماس می‌گیریم.' })],
		]),
	]),
];

/* ---------------- Shop ---------------- */

const terms = [
	{ key: 'pcat-character', taxonomy: 'product_cat', name: 'کاراکتر سه‌بعدی', slug: '3d-characters' },
	{ key: 'pcat-poster', taxonomy: 'product_cat', name: 'پوستر دیجیتال', slug: 'digital-posters' },
];

const product = (key, title, slug, price, image, cat, excerpt, extra = {}) => Object.assign({
	key, title, slug, price, sku: 'NG-' + key.toUpperCase(), image, terms: [cat], virtual: true, featured: true, excerpt,
	content: L.productBody([excerpt, 'فایل با کیفیت ۴K و مجوز استفاده‌ی شخصی و تجاری محدود؛ پس از پرداخت بلافاصله قابل دریافت است.'], [['ابعاد', '۴۰۹۶ × ۴۰۹۶ پیکسل'], ['فرمت', 'PNG و JPG'], ['مجوز', 'شخصی و تجاری محدود']]),
}, extra);

const products = [
	product('owl', 'پرنده‌ی عینکی', 'spectacled-bird', 2400000, 'card-1', 'pcat-character', 'کاراکتر سه‌بعدی پرنده با کاپشن رنگارنگ؛ از کلکسیون «پرندگان شهر».'),
	product('pink', 'شنونده‌ی صورتی', 'pink-listener', 3100000, 'card-2', 'pcat-character', 'کاراکتر سه‌بعدی با هدفون؛ از کلکسیون «موسیقی شب».', { sale_price: 2600000 }),
	product('owl-poster', 'پوستر پرنده‌ی عینکی', 'spectacled-bird-poster', 1200000, 'card-1', 'pcat-poster', 'نسخه‌ی پوستری کاراکتر پرنده، آماده‌ی چاپ در ابعاد ۵۰ × ۷۰.'),
	product('pink-poster', 'پوستر شنونده', 'listener-poster', 1400000, 'card-2', 'pcat-poster', 'نسخه‌ی پوستری کاراکتر صورتی، آماده‌ی چاپ در ابعاد ۵۰ × ۷۰.'),
];

/* ---------------- Package ---------------- */

const pages = [
	{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings({ header: 'transparent' }) },
	{ key: 'services', title: 'خدمات', slug: 'services', elementor: services, settings: L.pageSettings() },
	{ key: 'about', title: 'درباره', slug: 'about', elementor: about, settings: L.pageSettings() },
	{ key: 'faq', title: 'پرسش‌های متداول', slug: 'faq', elementor: faqPage, settings: L.pageSettings() },
	{ key: 'contact', title: 'تماس و سفارش', slug: 'contact', elementor: contact, settings: L.pageSettings() },
];

module.exports = {
	manifest: {
		id: 'negareh',
		order: 16,
		title: 'نگاره',
		desc: 'استودیو و گالری هنر دیجیتال؛ سربرگ شیشه‌ای شناور، هیرو با دسته‌کارت خدمات که با دکمه‌ها جابه‌جا می‌شوند و عنوانشان تایپ می‌شود، فروشگاه آثار، تیره و روشن. سبز سیاه و لیمویی.',
		kit: 'nova',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: ['woocommerce'],
		tags: ['هنر دیجیتال', 'خلاقیت', 'فروشگاه'],
		pages: pages.map((p) => p.title).concat(['فروشگاه']),
	},
	content: {
		site: { title: 'نگاره', tagline: 'استودیو و گالری هنر دیجیتال' },
		images, alts, terms, posts: [], products, pages,
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'نگاره — صفحه‌ی اصلی' },
			{ key: 'tpl-hero', type: 'section', page: 'home', index: 0, title: 'نگاره — هیرو با دسته‌کارت' },
			{ key: 'tpl-services', type: 'page', page: 'services', title: 'نگاره — خدمات' },
		],
		menus: [
			{
				name: 'نگاره — منوی اصلی', location: 'primary', items: [
					{ title: 'کاوش', url: shopUrl },
					{ title: 'خدمات', page: 'services' },
					{ title: 'درباره', page: 'about' },
					{ title: 'پرسش‌ها', page: 'faq' },
					{ title: 'تماس', page: 'contact' },
				],
			},
			{
				name: 'نگاره — پابرگ', location: 'footer', items: [
					{ title: 'فروشگاه', url: shopUrl },
					{ title: 'خدمات', page: 'services' },
					{ title: 'پرسش‌ها', page: 'faq' },
					{ title: 'تماس', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 34,
			color_scheme: 'dark',
			header_layout: 'split',
			header_glass: true,
			header_cta_text: 'ورود',
			header_cta_url: '{{page:contact}}',
			font_body: 'iransansx',
			font_heading: 'peyda',
			font_heading_weight: '700',
			footer_about: 'نگاره، استودیو و گالری هنر دیجیتال؛ کاراکترهای سه‌بعدی، پوستر و کلکسیون‌های اختصاصی برای برندها.',
			footer_copyright: 'تمام حقوق برای استودیو نگاره محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }],
			mobile_bar: true,
			mobile_bar_text: 'ثبت سفارش',
			mobile_bar_url: '{{page:contact}}',
			magnetic: true,
			cursor: 'ring',
			sound_enabled: true,
			sound_default: true,
			sound_theme: 'glass',
			sound_volume: 18,
			sound_hover: false,
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 3, pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
	},
};
