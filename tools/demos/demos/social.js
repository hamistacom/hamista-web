/**
 * Demo: Social growth — a one-page site for social media services (Pulse
 * kit with a pink accent): content, page management, advertising and
 * creator campaigns for Instagram, Telegram, YouTube, Aparat and LinkedIn,
 * on the same one-page frame: hero with the app ring, platforms band,
 * services bento, a strip of partner creators, how it works, monthly
 * packages, reviews, questions and an order form; packages sold in the shop.
 */
'use strict';

const L = require('../lib');
const O = require('../onepage');
const { img, gallery, link, px, w, section, cols, heading } = L;

const images = {};
['crew', 'apps', 'team', 'desk', 'av-1', 'av-2', 'av-3', 'av-4'].forEach((k) => { images[k] = 'images/' + k + '.webp'; });
for (let i = 1; i <= 5; i++) { images['creator-' + i] = 'images/creator-' + i + '.webp'; }
const alts = { hero: 'مردی خندان با عینک', crew: 'دو طراح در حال انتخاب رنگ برای یک برند' };

const pack = (key, title, slug, price, image, excerpt, specs, featured = false) => ({
	key, title, slug, price, sku: 'SC-' + key.toUpperCase(), image, gallery: [], terms: ['pc-packs'], excerpt, stock: 999, virtual: true, featured,
	content: L.productBody([excerpt, 'پیش از شروع، یک جلسه‌ی آنلاین برای شناخت کسب‌وکار و مخاطب شما برگزار می‌کنیم.'], specs),
});

const products = [
	pack('start', 'بسته‌ی شروع شبکه‌های اجتماعی', 'social-starter-pack', 9500000, 'desk', 'دوازده پست و هشت استوری طراحی‌شده با متن، برای یک ماه.', [['پست', '۱۲'], ['استوری', '۸'], ['مدت', 'یک ماه']]),
	pack('grow', 'بسته‌ی رشد ماهانه', 'monthly-growth-pack', 24000000, 'team', 'تولید محتوا، مدیریت صفحه و کمپین تبلیغاتی هدفمند برای مخاطب واقعی.', [['محتوا', '۲۰ پست و ۱۶ استوری'], ['ریلز', '۴ ویدیو'], ['گزارش', 'هفتگی']], true),
	pack('creators', 'کمپین با تولیدکنندگان محتوا', 'creator-campaign', 38000000, 'creator-2', 'معرفی کسب‌وکار شما در صفحه‌ی تولیدکنندگان محتوای هم‌سو با برندتان.', [['تعداد صفحه', '۵ تا ۸'], ['گزارش', 'بازدید و فروش']], true),
];

const home = [
	O.anchor('home', section({ space: 'lg', gap: 0 }, [
		cols({ widths: [54, 46], gap: 48, align: 'center' }, [
			[
				w('hm-badge-ring', { mode: 'text', text: 'رشد واقعی • مخاطب واقعی • گزارش شفاف • ', center: 'star', link: link('#prices'), look: 'outline', size: px(120), speed: 16 }),
				heading({ eyebrow: 'اینستاگرام · تلگرام · یوتیوب · آپارات · لینکدین', title: 'صفحه‌تان را به\n*برند* تبدیل کنید', title_tag: 'h1', title_size: 'xl', desc: 'تولید محتوا، مدیریت صفحه، تبلیغات هدفمند و همکاری با تولیدکنندگان محتوا؛ برای رشد با مخاطب واقعی و گزارشی که می‌شود به آن اعتماد کرد.' }),
				L.buttons(['دیدن بسته‌ها', '#prices'], ['مشاوره‌ی رایگان', '#contact'], { btn2_style: 'ghost' }),
				w('hm-proof', { avatars: gallery(['av-1', 'av-2', 'av-3', 'av-4']), plus: 'yes', plus_link: link('#reviews'), score: '+۸۵۰', stars: 5, note: 'کسب‌وکار همراه ما', layout: 'stack', align: 'start' }),
			],
			[
				L.imageReveal('apps', { ratio: 'auto', reveal: 'fade', parallax: px(-0.1) }),
				L.imageReveal('crew', { ratio: '4-5', reveal: 'clip-up', parallax: px(0.12) }),
			],
		]),
	])),
	section({ space: 'none', gap: 0 }, [
		L.marquee(['اینستاگرام', 'تلگرام', 'یوتیوب', 'آپارات', 'لینکدین', 'روبیکا', 'ایتا', 'تیک‌تاک'], { size: 'lg', look: 'alternate', bordered: 'yes' }),
	]),
	O.anchor('services', section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: 'خدمات', title: 'هرچه صفحه‌ی شما\n*برای رشد* لازم دارد', header_align: 'center', title_size: 'lg' }),
		w('hm-bento', {
			columns: '9', columns_tablet: '2', columns_mobile: '1', row_height: px(270),
			cards: [
				{ kind: 'text', kicker: 'تولید محتوا', title: 'پست، استوری و ریلز\nبا لحن برند شما', text: 'عکاسی، طراحی، متن و ویدیوی کوتاه.', image: img('team'), image_place: 'end', tone: 'light', cols: '5', rows: '1' },
				{ kind: 'figure', kicker: 'مدیریت صفحه', title: 'پاسخ به پیام و نظر', value: '۲۴/۷', text: 'بی‌آنکه مخاطبی بی‌جواب بماند.', tone: 'dark', cols: '4', rows: '1' },
				{ kind: 'list', title: 'تبلیغات هدفمند', text: 'انتخاب مخاطب بر اساس شهر و علاقه\nبودجه‌ی روزانه‌ی قابل کنترل\nگزارش هزینه‌ی هر مشتری', tone: 'accent', cols: '3', rows: '1' },
				{ kind: 'image', title: 'کمپین با تولیدکنندگان محتوا', image: img('creator-3'), image_place: 'fill', tone: 'dark', cols: '3', rows: '1' },
				{ kind: 'rating', title: 'رضایت مشتری‌ها', value: '4.9/5', tone: 'glass', cols: '3', rows: '1' },
			],
		}),
	])),
	section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: 'شبکه‌ی تولیدکنندگان محتوا', title: '*+۳۰۰* صفحه‌ی هم‌سو\nبا برند شما', header_align: 'center', title_size: 'lg' }),
		L.team([1, 2, 3, 4, 5].map((i) => ({ photo: img('creator-' + i), name: ['نیلوفر', 'پارسا', 'آیدا', 'سامان', 'رها'][i - 1], role: ['سبک زندگی · ۴۸۰ هزار', 'فناوری · ۲۱۰ هزار', 'آشپزی · ۳۵۰ هزار', 'سفر · ۶۲۰ هزار', 'زیبایی · ۲۹۰ هزار'][i - 1], linkedin: link(''), instagram: link('https://instagram.com/') })), { layout: 'strip', mono: '' }),
	]),
	O.steps('روند کار', 'از اولین جلسه تا *اولین گزارش*', [
		['compass', 'شناخت', 'کسب‌وکار، مخاطب و رقبای شما را در یک جلسه‌ی رایگان می‌شناسیم.'],
		['pen', 'برنامه و تولید', 'تقویم محتوای ماه را می‌نویسیم و پیش از انتشار تأیید می‌گیریم.'],
		['chart', 'انتشار و گزارش', 'منتشر می‌کنیم، تبلیغ می‌کنیم و هر هفته نتیجه را گزارش می‌دهیم.'],
	]),
	O.anchor('prices', section({ space: 'lg', gap: 40 }, [
		heading({ eyebrow: 'بسته‌ها', title: 'بسته‌ی *مناسب* خودتان', header_align: 'center', title_size: 'lg' }),
		w('hm-pricing', {
			plans: [
				{ name: 'شروع', desc: 'برای صفحه‌های تازه.', price: '۹٫۵', price_alt: '۷٫۶', unit: 'میلیون تومان', period: '/ ماهانه', features: '۱۲ پست و ۸ استوری\nطراحی و متن\nگزارش ماهانه', btn_text: 'خرید بسته', btn_link: link('{{product:start}}'), featured: '', badge: '' },
				{ name: 'رشد', desc: 'پرطرفدارترین بسته.', price: '۲۴', price_alt: '۱۹٫۲', unit: 'میلیون تومان', period: '/ ماهانه', features: '۲۰ پست و ۱۶ استوری\n۴ ریلز\nمدیریت پیام‌ها\nکمپین تبلیغاتی\nگزارش هفتگی', btn_text: 'خرید بسته', btn_link: link('{{product:grow}}'), featured: 'yes', badge: 'پیشنهاد ما' },
				{ name: 'کمپین', desc: 'معرفی با تولیدکنندگان محتوا.', price: '۳۸', price_alt: '۳۰٫۴', unit: 'میلیون تومان', period: '/ هر کمپین', features: '۵ تا ۸ صفحه‌ی هم‌سو\nسناریوی اختصاصی\nگزارش بازدید و فروش', btn_text: 'خرید بسته', btn_link: link('{{product:creators}}'), featured: '', badge: '' },
			],
			switch_off: 'ماهانه', switch_on: 'سه‌ماهه', switch_note: '۲۰٪ تخفیف',
		}),
	])),
	O.reviews('نظر مشتری‌ها', 'صفحه‌هایی که *رشد کردند*', [
		['در سه ماه، پیام‌های خرید از اینستاگرام دو برابر شد. گزارش‌های هفتگی‌شان هم خیلی روشن است.', 'ترانه موسوی', 'فروشگاه لباس'],
		['ویدیوهای کوتاهی که ساختند، بیشترین بازدید تاریخ صفحه‌ی ما را آورد.', 'امید رستمی', 'کافه و رستوران'],
		['کمپین با تولیدکنندگان محتوا دقیقاً به مخاطب درست رسید؛ فروش هفته‌ی اول را باور نمی‌کردیم.', 'شیما فرهادی', 'برند آرایشی'],
		['پاسخ به پیام‌ها را سپردیم به آن‌ها و دیگر هیچ مشتری‌ای بی‌جواب نمی‌ماند.', 'کیوان نیک‌پور', 'آموزشگاه زبان'],
	]),
	O.faq([
		['آیا فالوور یا لایک غیرواقعی می‌فروشید؟', 'نه. همه‌ی خدمات ما برای رشد با مخاطب واقعی است؛ محتوا، تبلیغات هدفمند و همکاری با تولیدکنندگان محتوای واقعی.'],
		['نتیجه کی دیده می‌شود؟', 'معمولاً از هفته‌ی دوم در تعامل و از ماه دوم در پیام‌ها و فروش.'],
		['محتوا پیش از انتشار به تأیید من می‌رسد؟', 'بله؛ تقویم ماه و هر پست پیش از انتشار برای تأیید شما فرستاده می‌شود.'],
		['هزینه‌ی تبلیغات جدا حساب می‌شود؟', 'بله؛ بودجه‌ی تبلیغات را خودتان تعیین می‌کنید و گزارش هزینه‌ی دقیق می‌گیرید.'],
	]),
	O.contact('مشاوره‌ی رایگان', 'از صفحه‌تان\n*برایمان بگویید*', [
		['instagram', 'اینستاگرام', '@roshd.social', 'https://instagram.com/'],
		['telegram', 'تلگرام', '@roshd_support', 'https://t.me/'],
		['phone', 'تلفن', '۰۲۱ ۲۸۴۲ ۱۱۰۰', 'tel:02128421100'],
	], { show_company: 'yes', button: 'درخواست مشاوره' }),
];

module.exports = {
	manifest: {
		id: 'social', order: 9, title: 'شبکه‌های اجتماعی (یک‌صفحه‌ای)',
		desc: 'سایت یک‌صفحه‌ای خدمات شبکه‌های اجتماعی؛ تولید محتوا، مدیریت صفحه، تبلیغات هدفمند و کمپین با تولیدکنندگان محتوا برای رشد با مخاطب واقعی. نوار پلتفرم‌ها، بنتوی خدمات، نوار چهره‌ی تولیدکنندگان، روند کار، بسته‌های ماهانه با فروش در فروشگاه، نظرها، پرسش‌ها و فرم مشاوره؛ روشن و تیره.',
		kit: 'pulse', thumb: 'thumb.webp', required: ['elementor'], recommended: ['woocommerce'],
		tags: ['یک‌صفحه‌ای', 'شبکه‌های اجتماعی', 'بازاریابی', 'فروشگاه خدمات'],
		pages: ['صفحه‌ی اصلی (یک‌صفحه‌ای)', 'فروشگاه'],
	},
	content: {
		site: { title: 'شبکه‌های اجتماعی', tagline: 'تولید محتوا، مدیریت صفحه و تبلیغات' },
		images, alts,
		terms: [{ key: 'pc-packs', taxonomy: 'product_cat', name: 'بسته‌های رشد', slug: 'growth-packs' }],
		posts: [], products,
		pages: [{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings() }],
		templates: [{ key: 'tpl-home', type: 'page', page: 'home', title: 'شبکه‌های اجتماعی — صفحه‌ی یک‌صفحه‌ای' }],
		menus: [O.menu('شبکه‌های اجتماعی — منو', [['خانه', 'home'], ['خدمات', 'services'], ['روند کار', 'how'], ['بسته‌ها', 'prices'], ['نظرها', 'reviews'], ['پرسش‌ها', 'faq'], ['مشاوره', 'contact']])],
		options: {
			accent: '#e8336b', accent_dark: '#ff5c8d',
			header_layout: 'split', header_cart: true, header_cta_text: 'مشاوره‌ی رایگان', header_cta_url: '#contact',
			font_body: 'dana', font_heading: 'peyda', font_heading_weight: '900',
			footer_about: 'تولید محتوا، مدیریت صفحه و تبلیغات شبکه‌های اجتماعی برای رشد با مخاطب واقعی.',
			footer_copyright: 'تمام حقوق محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }, { network: 'youtube', url: 'https://youtube.com/' }],
			mobile_bar: true, mobile_bar_text: 'مشاوره‌ی رایگان', mobile_bar_url: '#contact',
			magnetic: true, cursor: 'trail', preloader: 'counter', sound_enabled: false,
			seo_business_type: 'ProfessionalService',
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 3, pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
	},
};
