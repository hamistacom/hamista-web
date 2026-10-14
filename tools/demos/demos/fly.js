/**
 * Demo: Flights — a one-page flight-ticket site (Azure kit), after the
 * Airlines reference: a sea of clouds at dawn with a frosted search box,
 * services, destinations moving sideways, how booking works, a night-flight
 * banner, reviews, questions and contact; extras sold in the shop.
 */
'use strict';

const L = require('../lib');
const O = require('../onepage');
const { img, link, px, w, section, cols, heading, button } = L;

const images = {};
['hero', 'sky', 'night', 'card-1', 'card-2', 'av-1', 'av-2', 'av-3', 'av-4'].forEach((k) => { images[k] = 'images/' + k + '.webp'; });
for (let i = 1; i <= 7; i++) { images['dest-' + i] = 'images/dest-' + i + '.webp'; }

const alts = {
	hero: 'دریای ابر در سپیده‌دم از پنجره‌ی هواپیما', sky: 'آسمان آبی بر فراز ابرها', night: 'ابرها در شب زیر آسمان پرستاره',
};

const CITIES = ['تهران (امام خمینی)', 'تهران (مهرآباد)', 'مشهد', 'شیراز', 'اصفهان', 'تبریز', 'کیش', 'قشم', 'اهواز', 'بندرعباس', 'استانبول', 'دبی', 'نجف', 'ایروان', 'تفلیس'];

const SEARCH = [
	{ label: 'مبدأ', name: 'from', placeholder: 'شهر یا فرودگاه', options: CITIES, icon: 'takeoff' },
	{ label: 'مقصد', name: 'to', placeholder: 'کجا می‌روید؟', options: CITIES, icon: 'landing' },
	{ label: 'تاریخ رفت', name: 'date', type: 'date', days: 90, icon: 'calendar' },
	{ label: 'مسافران', name: 'adults', type: 'count', placeholder: 'بزرگسال', max: 9, icon: 'users' },
];

const DESTS = [
	['dest-4', 'کیش', 'آب فیروزه‌ای و ساحل مرجانی', 'از ۲٬۴۸۰٬۰۰۰ تومان'],
	['dest-2', 'دبی', 'خرید، صحرا و آسمان‌خراش', 'از ۹٬۶۰۰٬۰۰۰ تومان'],
	['dest-7', 'استانبول', 'دو قاره در یک شهر', 'از ۱۴٬۸۰۰٬۰۰۰ تومان'],
	['dest-5', 'تبریز', 'بازار سرپوشیده و کوه‌های برفی', 'از ۱٬۸۵۰٬۰۰۰ تومان'],
	['dest-1', 'مشهد', 'زیارت و دشت‌های طلایی', 'از ۱٬۹۵۰٬۰۰۰ تومان'],
	['dest-6', 'شیراز', 'باغ‌ها و شب‌های شعر', 'از ۲٬۱۰۰٬۰۰۰ تومان'],
	['dest-3', 'ایروان', 'کوه آرارات و کافه‌های قدیمی', 'از ۸٬۲۰۰٬۰۰۰ تومان'],
];

const products = [
	{ key: 'insurance', title: 'بیمه‌ی مسافرتی خارج از کشور', slug: 'travel-insurance', price: 1250000, sku: 'FL-INS', image: 'card-1', gallery: [], terms: ['pc-extras'], excerpt: 'پوشش درمان و جابه‌جایی تا ۵۰ هزار یورو، مورد قبول همه‌ی سفارت‌ها.', stock: 999, virtual: true, featured: true,
		content: L.productBody(['بیمه‌نامه ظرف ده دقیقه صادر و به ایمیل شما فرستاده می‌شود.'], [['پوشش', 'تا ۵۰ هزار یورو'], ['مدت', 'تا ۳۰ روز']]) },
	{ key: 'transfer', title: 'ترانسفر فرودگاهی', slug: 'airport-transfer', price: 1850000, sku: 'FL-TRF', image: 'card-2', gallery: [], terms: ['pc-extras'], excerpt: 'خودروی شخصی از فرودگاه تا هتل، با راننده‌ای که با تابلوی نامتان منتظر است.', stock: 999, virtual: true,
		content: L.productBody(['راننده با تابلوی نام شما در سالن ورودی منتظر است و تأخیر پرواز را رایگان پوشش می‌دهد.'], [['ظرفیت', 'تا ۴ نفر']]) },
	{ key: 'lounge', title: 'سالن تشریفات فرودگاه', slug: 'airport-lounge', price: 2400000, sku: 'FL-LNG', image: 'sky', gallery: [], terms: ['pc-extras'], excerpt: 'پذیرش سریع، پذیرایی و انتظار آرام پیش از پرواز.', stock: 999, virtual: true,
		content: L.productBody(['پذیرش جداگانه، پذیرایی کامل و همراهی تا پای هواپیما.'], [['مدت', 'تا ۳ ساعت']]) },
];

const home = [
	O.anchor('home', L.bleed(w('hm-hero', {
		layout: 'full', title_tag: 'h1', title_size: 'xl', header_align: 'center', title_reveal: 'words',
		eyebrow: 'بلیت هواپیما · هتل · تور',
		title: 'پرواز بعدی‌تان را\n*آسوده* پیدا کنید',
		desc: 'قیمت همه‌ی ایرلاین‌ها کنار هم، رزرو در کمتر از یک دقیقه و پشتیبانی واقعی تا لحظه‌ای که روی صندلی می‌نشینید.',
		btn1_text: '', btn2_text: '',
		media_type: 'image', image: img('hero'), height: 'screen', decor: 'beams', overlay: px(0.32), hint: '',
	}), { css_classes: 'hm-bleed hm-room-below hm-pull-lg' })),
	section({ space: 'none', cls: 'hm-pull-up hm-pull-lg', gap: 40 }, [
		L.searchBox(SEARCH, { pills: 'یک‌طرفه\nرفت‌وبرگشت\nچندمسیره', pills_name: 'trip', button: 'جست‌وجوی پرواز', look: 'glass', action: '#deals' }),
		L.counters([
			{ value: 42, label: 'ایرلاین داخلی و خارجی' },
			{ value: 180, label: 'مقصد در ۲۶ کشور' },
			{ value: 1200000, label: 'مسافر در سه سال' },
			{ value: 4.8, label: 'امتیاز مسافران از ۵' },
		], { style: 'plain', columns: '4' }),
	]),
	O.anchor('services', section({ space: 'lg', gap: 40 }, [
		cols({ widths: [55, 45], gap: 40, align: 'end' }, [
			[heading({ eyebrow: 'خدمات', title: 'هرچه برای سفر لازم دارید،\n*در یک‌جا*', title_size: 'lg' })],
			[L.textEditor('<p>از بلیت تا بیمه و ترانسفر فرودگاهی؛ بی‌آنکه پنج سایت مختلف را باز کنید.</p>')],
		]),
		w('hm-bento', {
			columns: '9', columns_tablet: '2', columns_mobile: '1', row_height: px(260),
			cards: [
				{ kind: 'figure', kicker: 'پرواز داخلی', title: 'همه‌ی ایرلاین‌ها، یک قیمت شفاف', value: '۴۲', text: 'ایرلاین و چارتر همکار', image: img('sky'), image_place: 'fill', tone: 'dark', cols: '4', rows: '2' },
				{ kind: 'text', kicker: 'پرواز خارجی', title: 'استانبول، دبی، اروپا و آسیا', text: 'با پرداخت ریالی و صدور فوری.', tone: 'light', cols: '5', rows: '1' },
				{ kind: 'list', title: 'هتل و تور', text: 'هتل‌های داخلی و خارجی\nتورهای گروهی و اختصاصی\nاقامتگاه‌های بوم‌گردی', tone: 'accent', cols: '3', rows: '1' },
				{ kind: 'text', title: 'بیمه و ویزا', text: 'بیمه‌ی مسافرتی فوری و راهنمای ویزا.', btn_text: 'فروشگاه خدمات', btn_link: link('{{shop}}'), tone: 'glass', cols: '2', rows: '1' },
			],
		}),
	])),
	O.anchor('deals', L.hscroll({
		eyebrow: 'مسیرهای پرطرفدار', title: 'این هفته\n*کجا برویم؟*', desc: 'ارزان‌ترین بلیت هفته برای مقصدهایی که مسافران بیشتر دوستشان دارند.',
		items: DESTS.map(([image, title, text, label]) => ({ image: img(image), label, title, text, link: link('#home') })), card_size: 'md', card_style: 'caption', scheme: '',
	})),
	O.steps('چطور کار می‌کند', 'سه قدم تا *صندلی‌تان*', [
		['search', 'جست‌وجو', 'مبدأ، مقصد و تاریخ را بدهید؛ همه‌ی پروازها با قیمت نهایی جلوی شماست.'],
		['compare', 'مقایسه و انتخاب', 'بر اساس قیمت، ساعت، ایرلاین یا بار مجاز مرتب کنید.'],
		['ticket', 'پرداخت و بلیت', 'پرداخت امن و صدور فوری؛ بلیت به ایمیل و پیامکتان می‌رسد.'],
	]),
	L.cta({
		eyebrow: 'پروازهای شبانه', title: 'شب‌ها ارزان‌تر\n*پرواز کنید*',
		desc: 'پروازهای بعد از ساعت ۲۲ تا ۳۰ درصد ارزان‌ترند. هشدار قیمت را روشن کنید تا اولین نفری باشید که باخبر می‌شود.',
		btn1_text: 'روشن‌کردن هشدار قیمت', btn1_link: link('#contact'), btn2_text: '',
		look: 'image', image: img('night'), decor: '', rounded: '',
	}),
	O.reviews('نظر مسافران', 'مسافرانی که *دوباره* برگشتند', [
		['پروازم دو ساعت تأخیر داشت. پیش از اینکه خودم بفهمم پیامک رسید و پشتیبانی برای پرواز بعدی جا رزرو کرده بود.', 'مهسا کریمی', 'تهران ← شیراز'],
		['تقویم قیمت واقعاً کار می‌کند. با جابه‌جا کردن سفر به سه‌شنبه، برای چهار نفر نزدیک سه میلیون تومان کمتر پرداختیم.', 'رضا امینی', 'تهران ← کیش'],
		['استرداد بلیت خارجی همیشه دردسر بود. این بار از حساب کاربری درخواست دادم و پنج روز بعد پول برگشت.', 'لیلا حسینی', 'تهران ← استانبول'],
		['برای سفرهای کاری شرکت استفاده می‌کنیم. فاکتور رسمی و گزارش ماهانه وقت حسابداری را خیلی کم کرده است.', 'بهروز نادری', 'مدیر اداری'],
	]),
	O.faq([
		['بلیت را کی و چطور دریافت می‌کنم؟', 'بلافاصله پس از پرداخت؛ بلیت به ایمیل و پیامک شما فرستاده می‌شود و در حساب کاربری‌تان هم همیشه در دسترس است.'],
		['استرداد بلیت چطور انجام می‌شود؟', 'از حساب کاربری درخواست بدهید. مبلغ طبق قوانین ایرلاین محاسبه و حداکثر ظرف هفت روز کاری برمی‌گردد.'],
		['قیمت‌ها با خود ایرلاین فرقی دارند؟', 'نه؛ نرخ رسمی ایرلاین یا آژانس همکار است و هزینه‌ی پنهانی ندارد.'],
		['اگر پرواز لغو شود چه؟', 'تغییرات را لحظه‌ای پیامک می‌کنیم و پشتیبانی برای جابه‌جایی یا استرداد کامل با شما تماس می‌گیرد.'],
	]),
	O.contact('تماس', 'هر ساعت از شبانه‌روز\n*کنارتان هستیم*', [
		['phone', 'پشتیبانی ۲۴ ساعته', '۰۲۱ ۹۱۰۰ ۲۰۲۰', 'tel:02191002020'],
		['mail', 'ایمیل', 'support@parvaz.ir', 'mailto:support@parvaz.ir'],
		['pin', 'دفتر مرکزی', 'تهران، خیابان آزادی، نبش خیابان شادمهر'],
	]),
];

module.exports = {
	manifest: {
		id: 'fly', order: 7, title: 'پرواز (یک‌صفحه‌ای)',
		desc: 'سایت یک‌صفحه‌ای بلیت هواپیما؛ دریای ابر در سپیده‌دم با جعبه‌ی جست‌وجوی شیشه‌ای و تقویم شمسی، خدمات بنتو، مقصدهای روان افقی، مراحل رزرو، پروازهای شبانه، نظر مسافران، پرسش‌ها و تماس؛ بیمه و ترانسفر در فروشگاه. آبی سلطنتی؛ روشن و تیره.',
		kit: 'azure', thumb: 'thumb.webp', required: ['elementor'], recommended: ['woocommerce'],
		tags: ['یک‌صفحه‌ای', 'بلیت هواپیما', 'گردشگری'],
		pages: ['صفحه‌ی اصلی (یک‌صفحه‌ای)', 'فروشگاه'],
	},
	content: {
		site: { title: 'پرواز', tagline: 'بلیت هواپیما، هتل و تور' },
		images, alts,
		terms: [{ key: 'pc-extras', taxonomy: 'product_cat', name: 'خدمات سفر', slug: 'travel-extras' }],
		posts: [], products,
		pages: [{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings({ header: 'transparent-light' }) }],
		templates: [{ key: 'tpl-home', type: 'page', page: 'home', title: 'پرواز — صفحه‌ی یک‌صفحه‌ای' }],
		menus: [O.menu('پرواز — منو', [['خانه', 'home'], ['خدمات', 'services'], ['مقصدها', 'deals'], ['راهنما', 'how'], ['نظرها', 'reviews'], ['پرسش‌ها', 'faq'], ['تماس', 'contact']])],
		options: {
			header_layout: 'split', header_cart: true, header_cta_text: 'پشتیبانی', header_cta_url: '#contact',
			font_body: 'iranyekan', font_heading: 'peyda', font_heading_weight: '800',
			footer_about: 'پرواز؛ خرید بلیت هواپیما، هتل و تور با پشتیبانی ۲۴ ساعته.',
			footer_copyright: 'تمام حقوق محفوظ است.',
			mobile_bar: true, mobile_bar_text: 'جست‌وجوی پرواز', mobile_bar_url: '#home', mobile_bar_phone: '02191002020',
			magnetic: true, cursor: 'ring', preloader: 'curtain', sound_enabled: false,
			seo_business_type: 'TravelAgency',
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 3, pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
	},
};
