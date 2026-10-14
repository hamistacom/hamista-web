/**
 * Demo: Currency payments — a one-page site for paying in dollars and buying
 * AI and software subscriptions from Iran (Nova kit, dark first), built on
 * the same one-page frame as the flights demo: a live price calculator in the
 * hero, the services as a bento, how an order works, plans, reviews,
 * questions and contact; each service is also a product in the shop.
 */
'use strict';

const L = require('../lib');
const O = require('../onepage');
const { img, link, px, gap, w, con, section, cols, heading, button } = L;

const images = {};
['hero', 'wide', 'tall', 'card-1', 'card-2', 'card-3', 'av-1', 'av-2', 'av-3', 'av-4'].forEach((k) => { images[k] = 'images/' + k + '.webp'; });
const alts = { hero: 'نوارهای طلایی نور روی زمینه‌ی تیره' };

const RATE = 61500;

const SERVICES = [
	['اشتراک هوش مصنوعی', 'ماه', 1990000, 0, 1, 1],
	['پرداخت دلاری', 'دلار', RATE, 6, 5, 50],
	['گیفت‌کارت اپل و گوگل', 'دلار', RATE, 8, 10, 25],
	['هزینه‌ی آزمون و سفارت', 'دلار', RATE, 4, 50, 245],
];

const products = [
	['ai-plus', 'اشتراک یک‌ماهه‌ی دستیار هوش مصنوعی', 'ai-assistant-monthly', 1990000, 'card-1', 'نسخه‌ی پیشرفته‌ی دستیار هوش مصنوعی روی ایمیل خودتان، فعال‌سازی در کمتر از یک ساعت.', [['مدت', 'یک ماه'], ['تحویل', 'کمتر از یک ساعت'], ['حساب', 'ایمیل خود شما']], true],
	['ai-image', 'اشتراک ابزار ساخت تصویر', 'ai-image-tool-monthly', 1650000, 'card-2', 'اشتراک ماهانه‌ی ابزار ساخت تصویر با هوش مصنوعی، روی حساب شخصی شما.', [['مدت', 'یک ماه'], ['تحویل', 'کمتر از دو ساعت']], true],
	['dev-tools', 'اشتراک ابزارهای برنامه‌نویسی', 'developer-tools-subscription', 1200000, 'card-3', 'دستیار کدنویسی و ابزارهای طراحی، پرداخت ماهانه یا سالانه.', [['مدت', 'یک ماه'], ['تحویل', 'همان روز']], false],
	['exam-fee', 'پرداخت هزینه‌ی آزمون زبان', 'language-exam-fee', 15100000, 'tall', 'ثبت‌نام و پرداخت هزینه‌ی آزمون‌های بین‌المللی زبان؛ رسید رسمی همان روز.', [['تحویل', 'همان روز'], ['رسید', 'رسمی و قابل پیگیری']], false],
].map(([key, title, slug, price, image, excerpt, specs, featured]) => ({
	key, title, slug, price, sku: 'PY-' + key.toUpperCase(), image, gallery: [], terms: ['pc-services'], excerpt, stock: 999, virtual: true, featured,
	content: L.productBody([excerpt, 'پس از پرداخت، کارشناس ما در کمتر از یک ساعت در پیام‌رسان با شما هماهنگ می‌کند.'], specs),
}));

const home = [
	O.anchor('home', section({ space: 'lg', gap: 0 }, [
		cols({ widths: [55, 45], gap: 48, align: 'center' }, [
			[
				heading({ eyebrow: 'پرداخت ارزی · اشتراک هوش مصنوعی', title: 'دنیا یک *پرداخت*\nبا شما فاصله دارد', title_tag: 'h1', title_size: 'xl', desc: 'اشتراک ابزارهای هوش مصنوعی، پرداخت دلاری، گیفت‌کارت و هزینه‌ی آزمون و سفارت؛ با پرداخت ریالی و تحویل در کمتر از یک ساعت.' }),
				L.buttons(['ثبت سفارش', '#contact'], ['خدمات', '#services'], { btn2_style: 'ghost' }),
				w('hm-proof', { avatars: L.gallery(['av-1', 'av-2', 'av-3']), plus: 'yes', plus_link: link('#reviews'), score: '4.9', stars: 5, note: 'از ۱۲٬۰۰۰ سفارش موفق', layout: 'stack', align: 'start' }),
			],
			[w('hm-calculator', {
				title: 'هزینه را همین‌جا حساب کنید',
				items: SERVICES.map(([name, unit, rate, fee, min, start]) => ({ name, unit, rate, fee, min, start })),
				note: 'نرخ دلار امروز: ' + RATE.toLocaleString('fa-IR') + ' تومان؛ هر ساعت به‌روز می‌شود.',
				btn_text: 'ادامه‌ی سفارش', btn_link: link('{{shop}}'),
			})],
		]),
	])),
	section({ space: 'none', gap: 0 }, [
		L.marquee(['اشتراک هوش مصنوعی', 'پرداخت دلاری', 'گیفت‌کارت', 'هزینه‌ی آزمون زبان', 'هزینه‌ی سفارت', 'خرید از سایت‌های خارجی', 'اشتراک ابزار طراحی'], { size: 'md', look: 'alternate', bordered: 'yes' }),
	]),
	O.anchor('services', section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: 'خدمات', title: 'هرچه با *دلار* می‌خرید', header_align: 'center', title_size: 'lg' }),
		w('hm-bento', {
			columns: '9', columns_tablet: '2', columns_mobile: '1', row_height: px(270),
			cards: [
				{ kind: 'figure', kicker: 'هوش مصنوعی', title: 'دستیار هوشمند، ساخت تصویر، ابزار کدنویسی', value: '+۳۰', text: 'سرویس با فعال‌سازی روی ایمیل خودتان', image: img('hero'), image_place: 'fill', tone: 'dark', cols: '5', rows: '2' },
				{ kind: 'text', kicker: 'پرداخت دلاری', title: 'خرید از هر سایت خارجی', text: 'دامنه، هاست، نرم‌افزار و دوره‌ی آموزشی.', tone: 'accent', cols: '4', rows: '1' },
				{ kind: 'list', title: 'آزمون و سفارت', text: 'آزمون‌های زبان\nهزینه‌ی ویزا\nارزیابی مدرک', tone: 'glass', cols: '2', rows: '1' },
				{ kind: 'rating', title: 'رضایت مشتری‌ها', value: '4.9/5', tone: 'light', cols: '2', rows: '1' },
			],
		}),
	])),
	O.steps('روند سفارش', 'سه قدم، *کمتر از یک ساعت*', [
		['card', 'انتخاب و پرداخت', 'سرویس را انتخاب کنید و مبلغ را با کارت بانکی پرداخت کنید.'],
		['telegram', 'هماهنگی', 'کارشناس در پیام‌رسان اطلاعات لازم را از شما می‌گیرد.'],
		['check', 'تحویل', 'سرویس روی حساب خودتان فعال می‌شود و رسید دریافت می‌کنید.'],
	]),
	O.anchor('prices', section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: 'تعرفه‌ها', title: 'قیمت *روشن*، بی‌کارمزد پنهان', header_align: 'center', title_size: 'lg' }),
		w('hm-pricing', {
			plans: [
				{ name: 'دستیار هوش مصنوعی', desc: 'نسخه‌ی پیشرفته روی ایمیل خودتان.', price: '۱٫۹۹', price_alt: '', unit: 'میلیون تومان', period: '/ ماهانه', features: 'فعال‌سازی کمتر از یک ساعت\nحساب شخصی\nتمدید خودکار با یادآوری', btn_text: 'خرید', btn_link: link('{{product:ai-plus}}'), featured: 'yes', badge: 'پرفروش' },
				{ name: 'ساخت تصویر', desc: 'ابزار حرفه‌ای ساخت تصویر.', price: '۱٫۶۵', price_alt: '', unit: 'میلیون تومان', period: '/ ماهانه', features: 'فعال‌سازی کمتر از دو ساعت\nحساب شخصی', btn_text: 'خرید', btn_link: link('{{product:ai-image}}'), featured: '', badge: '' },
				{ name: 'پرداخت دلاری', desc: 'برای هر خرید خارجی.', price: '۶٪', price_alt: '', unit: 'کارمزد', period: '', features: 'از ۵ دلار\nرسید رسمی\nپشتیبانی تا پایان خرید', btn_text: 'محاسبه', btn_link: link('#home'), featured: '', badge: '' },
			],
			switch_off: '', switch_on: '',
		}),
	])),
	L.cta({
		eyebrow: 'پیشنهاد ویژه', title: 'اولین سفارش،\n*بدون کارمزد*',
		desc: 'برای اولین پرداخت دلاری یا اشتراک، کارمزد خدمات را از ما مهمان باشید.',
		btn1_text: 'ثبت اولین سفارش', btn1_link: link('#contact'), btn2_text: '',
		look: 'image', image: img('wide'), decor: '', rounded: '',
	}),
	O.reviews('نظر مشتری‌ها', 'بیش از *۱۲ هزار* سفارش موفق', [
		['اشتراک دستیار هوش مصنوعی را صبح خریدم و ظهر روی ایمیل خودم فعال بود. پشتیبانی هم خیلی صبور بود.', 'سینا مرادی', 'برنامه‌نویس'],
		['هزینه‌ی آزمون زبانم را پرداخت کردند و رسید رسمی همان روز رسید. کارمزدشان هم از بقیه کمتر بود.', 'نگار احمدی', 'دانشجو'],
		['برای خرید دامنه و هاست خارجی چند بار سفارش داده‌ام؛ هر بار بی‌دردسر و سریع.', 'پوریا صادقی', 'طراح وب'],
		['ماشین‌حساب بالای سایت خیلی کمک کرد؛ قبل از سفارش دقیقاً می‌دانستم چقدر می‌پردازم.', 'مریم کاظمی', 'مدیر محصول'],
	]),
	O.faq([
		['سرویس روی حساب خودم فعال می‌شود؟', 'بله؛ همه‌ی اشتراک‌ها روی ایمیل و حساب شخصی شما فعال می‌شوند و اطلاعات ورود فقط نزد خودتان است.'],
		['نرخ دلار از کجا می‌آید؟', 'نرخ بازار آزاد که هر ساعت به‌روز می‌شود؛ مبلغ نهایی پیش از پرداخت به شما نشان داده می‌شود.'],
		['اگر سفارش انجام نشود چه؟', 'مبلغ کامل ظرف ۲۴ ساعت به کارت شما برمی‌گردد.'],
		['تمدید اشتراک چطور است؟', 'سه روز پیش از پایان اشتراک پیامک یادآوری می‌گیرید و با یک کلیک تمدید می‌کنید.'],
	]),
	O.contact('ثبت سفارش', 'سفارش‌تان را\n*بنویسید*', [
		['telegram', 'تلگرام', '@pardakht_support', 'https://t.me/'],
		['whatsapp', 'واتس‌اپ', '۰۹۱۲ ۰۰۰ ۴۴۵۵', 'https://wa.me/989120004455'],
		['clock', 'پاسخ‌گویی', 'هر روز، ۸ صبح تا ۱۲ شب'],
	], { show_subject: 'yes', button: 'ارسال سفارش' }),
];

module.exports = {
	manifest: {
		id: 'pay', order: 8, title: 'پرداخت ارزی (یک‌صفحه‌ای)',
		desc: 'سایت یک‌صفحه‌ای پرداخت ارزی و خرید اشتراک هوش مصنوعی؛ ماشین‌حساب زنده‌ی قیمت در صفحه‌ی اول، نوار خدمات، بنتو، روند سفارش، تعرفه، نظر مشتری‌ها، پرسش‌ها و فرم سفارش؛ هر خدمت محصولی در فروشگاه. سبز‑مشکی و لیمویی؛ تیره و روشن.',
		kit: 'nova', thumb: 'thumb.webp', required: ['elementor'], recommended: ['woocommerce'],
		tags: ['یک‌صفحه‌ای', 'پرداخت ارزی', 'هوش مصنوعی', 'فروشگاه خدمات'],
		pages: ['صفحه‌ی اصلی (یک‌صفحه‌ای)', 'فروشگاه'],
	},
	content: {
		site: { title: 'پرداخت ارزی', tagline: 'اشتراک هوش مصنوعی و پرداخت دلاری' },
		images, alts,
		terms: [{ key: 'pc-services', taxonomy: 'product_cat', name: 'خدمات ارزی', slug: 'currency-services' }],
		posts: [], products,
		pages: [{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings() }],
		templates: [{ key: 'tpl-home', type: 'page', page: 'home', title: 'پرداخت ارزی — صفحه‌ی یک‌صفحه‌ای' }],
		menus: [O.menu('پرداخت ارزی — منو', [['خانه', 'home'], ['خدمات', 'services'], ['روند سفارش', 'how'], ['تعرفه‌ها', 'prices'], ['نظرها', 'reviews'], ['پرسش‌ها', 'faq'], ['سفارش', 'contact']])],
		options: {
			color_scheme: 'dark',
			header_layout: 'split', header_cart: true, header_cta_text: 'ثبت سفارش', header_cta_url: '#contact',
			font_body: 'yekan-bakh', font_heading: 'kalameh', font_heading_weight: '800',
			footer_about: 'پرداخت ارزی؛ اشتراک ابزارهای هوش مصنوعی، پرداخت دلاری و گیفت‌کارت با پرداخت ریالی.',
			footer_copyright: 'تمام حقوق محفوظ است.',
			mobile_bar: true, mobile_bar_text: 'ثبت سفارش', mobile_bar_url: '#contact',
			magnetic: true, cursor: 'glow', preloader: 'logo', sound_enabled: false,
			seo_business_type: 'ProfessionalService',
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 3, pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
	},
};
