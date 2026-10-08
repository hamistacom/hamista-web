/**
 * Demo: Gelineh — a shop for handmade ceramics (Clay kit), built as a
 * complete store: two home pages, shop and collections, the atelier, custom
 * and wholesale orders, care guide, shipping and returns, journal, FAQ and
 * contact; ten products in five categories.
 */
'use strict';

const L = require('../lib');
const { img, link, px, w, section, cols, heading, button, fx } = L;

const images = { logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp' };
['hero', 'shelf', 'flatlay-2', 'studio', 'cat-plates', 'cat-bowls', 'cat-cups', 'cat-vases'].forEach((k) => { images[k] = 'images/' + k + '.webp'; });
['plate-white', 'plate-turq', 'bowl-oat', 'bowl-honey', 'cup-night', 'mug-clay', 'vase-sage', 'jug-white', 'platter', 'set'].forEach((k) => {
	images['p-' + k] = 'images/p-' + k + '.webp';
	images['p-' + k + '-b'] = 'images/p-' + k + '-b.webp';
});
for (let i = 1; i <= 4; i++) { images['journal-' + i] = 'images/journal-' + i + '.webp'; }

const alts = {
	hero: 'بشقاب، کاسه و فنجان‌های دست‌ساز روی پارچه‌ی کتان', shelf: 'گلدان‌ها و کوزه‌های لعابی روی طاقچه در نور پنجره',
	'flatlay-2': 'بشقاب‌های سبز و سفید روی رومیزی کتان', studio: 'کاسه‌های لعابی روی میز گچی کارگاه',
};

const shopUrl = '{{shop}}';
const contactUrl = '{{page:contact}}';

/* ---------------- Catalogue ---------------- */

const terms = [
	{ key: 'pc-plates', taxonomy: 'product_cat', name: 'بشقاب و دیس', slug: 'plates', image: 'cat-plates', description: 'بشقاب‌های تخت و گود، و دیس‌های سرو.' },
	{ key: 'pc-bowls', taxonomy: 'product_cat', name: 'کاسه', slug: 'bowls', image: 'cat-bowls', description: 'از کاسه‌ی صبحانه تا کاسه‌ی سالاد.' },
	{ key: 'pc-cups', taxonomy: 'product_cat', name: 'فنجان و ماگ', slug: 'cups', image: 'cat-cups', description: 'برای چای، قهوه و دمنوش.' },
	{ key: 'pc-vases', taxonomy: 'product_cat', name: 'گلدان و کوزه', slug: 'vases', image: 'cat-vases', description: 'برای گل‌های تازه و خشک، یا تنها برای دیدن.' },
	{ key: 'pc-sets', taxonomy: 'product_cat', name: 'سرویس', slug: 'sets', image: 'p-set', description: 'سرویس‌های کامل برای سفره‌ی چهار و شش‌نفره.' },
	{ key: 'cat-making', taxonomy: 'category', name: 'از کارگاه', slug: 'making' },
	{ key: 'cat-care', taxonomy: 'category', name: 'نگهداری', slug: 'care' },
	{ key: 'cat-glaze', taxonomy: 'category', name: 'لعاب و رنگ', slug: 'glazes' },
];

const SPECS = (size, glaze, care) => [
	['جنس', 'سفال سنگی (استون‌ور)، پخت در ۱۲۶۰ درجه'],
	['ابعاد', size],
	['لعاب', glaze],
	['ماشین ظرف‌شویی و مایکروویو', care],
	['ساخت', 'دست‌ساز، کارگاه گلینه در تهران'],
];

const product = (key, title, slug, price, sku, image, terms_, extra, excerpt, paragraphs, specs) => Object.assign({
	key, title, slug, price, sku, image, gallery: [image + '-b'], terms: terms_, excerpt, stock: 24, weight: 0.8,
	content: L.productBody(paragraphs, specs),
}, extra);

const products = [
	product('plate-white', 'بشقاب تخت «سپیده»', 'sepideh-dinner-plate', 780000, 'GL-PL-SEP', 'p-plate-white', ['pc-plates'], { featured: true, attributes: [{ name: 'قطر', options: ['۲۷ سانتی‌متر'] }, { name: 'رنگ', options: ['سفید شیری'] }] },
		'سفید شیری با خال‌های ریز آهن؛ بشقاب هر روز، که مهمانی را هم آبرومند می‌کند.',
		['بشقاب سپیده را با لعاب مات سفید و خاک سنگی کرم‌رنگ می‌سازیم. خال‌های ریز قهوه‌ای، آهنِ درون خاک است که در کوره به سطح می‌آید؛ برای همین هیچ دو بشقابی دقیقاً شبیه هم نیستند.', 'لبه‌ی بشقاب بی‌لعاب مانده تا رنگ خاک دیده شود.'],
		SPECS('قطر ۲۷ سانتی‌متر، ارتفاع ۲٫۵ سانتی‌متر', 'مات سفید شیری', 'مناسب')),
	product('plate-turq', 'بشقاب «فیروزه»', 'firouzeh-plate', 860000, 'GL-PL-FIR', 'p-plate-turq', ['pc-plates'], { featured: true, attributes: [{ name: 'قطر', options: ['۲۴ سانتی‌متر'] }, { name: 'رنگ', options: ['فیروزه‌ای'] }] },
		'لعاب براق فیروزه‌ای؛ رنگی که قرن‌هاست در سفال ایرانی زندگی می‌کند.',
		['فیروزه‌ای، شناخته‌شده‌ترین رنگ سفال ایرانی است. لعاب این بشقاب در گودی‌ها پررنگ‌تر و روی لبه‌ها روشن‌تر می‌نشیند و نور را مثل آب برمی‌گرداند.', 'برای غذاهای رنگی، میوه یا شیرینی.'],
		SPECS('قطر ۲۴ سانتی‌متر', 'براق فیروزه‌ای', 'مناسب')),
	product('bowl-oat', 'کاسه‌ی «ابر»', 'abr-bowl', 540000, 'GL-BW-ABR', 'p-bowl-oat', ['pc-bowls'], { featured: true, attributes: [{ name: 'قطر', options: ['۱۵ سانتی‌متر'] }] },
		'کاسه‌ی صبحانه با لعاب جوی دوسر؛ گرم، نرم و سبک در دست.',
		['کاسه‌ی ابر برای صبحانه، سوپ یا ماست است. دیواره‌ی نازکش آن را سبک کرده و پایه‌ی بی‌لعابش، حس خاک را زیر انگشت نگه می‌دارد.'],
		SPECS('قطر ۱۵ سانتی‌متر، ارتفاع ۷ سانتی‌متر', 'نیمه‌مات کرم', 'مناسب')),
	product('bowl-honey', 'کاسه‌ی سالاد «کهربا»', 'kahroba-salad-bowl', 1250000, 'GL-BW-KAH', 'p-bowl-honey', ['pc-bowls'], { sale_price: 1090000, attributes: [{ name: 'قطر', options: ['۲۸ سانتی‌متر'] }] },
		'کاسه‌ی بزرگ سرو با لعاب عسلی؛ مرکز سفره.',
		['لعاب کهربایی این کاسه، در گودی پررنگ‌تر و روی لبه‌ها به رنگ خاک نزدیک‌تر است. برای سالاد، میوه یا نان، و آن‌قدر بزرگ که برای شش نفر کافی باشد.'],
		SPECS('قطر ۲۸ سانتی‌متر، ارتفاع ۱۰ سانتی‌متر', 'براق عسلی', 'مناسب')),
	product('cup-night', 'فنجان «شب»', 'shab-cup', 460000, 'GL-CP-SHB', 'p-cup-night', ['pc-cups'], { featured: true, attributes: [{ name: 'گنجایش', options: ['۲۲۰ میلی‌لیتر'] }] },
		'فنجان سرمه‌ای براق؛ برای چای عصر یا قهوه‌ی صبح.',
		['لعاب سرمه‌ای عمیق، روی لبه‌ها کمی روشن می‌شود و رگه‌های آبی ظریفی پیدا می‌کند. دسته‌ی فنجان را با دست می‌سازیم و می‌چسبانیم؛ برای همین هر کدام کمی متفاوت است.'],
		SPECS('گنجایش ۲۲۰ میلی‌لیتر', 'براق سرمه‌ای', 'مناسب')),
	product('mug-clay', 'ماگ «خاک»', 'khak-mug', 420000, 'GL-CP-KHK', 'p-mug-clay', ['pc-cups'], { attributes: [{ name: 'گنجایش', options: ['۳۵۰ میلی‌لیتر'] }] },
		'نیمه‌ی پایینی بی‌لعاب، نیمه‌ی بالایی آجری؛ ماگ هر روز.',
		['ماگ خاک را برای کسانی ساخته‌ایم که دوست دارند بافت خاک را زیر دست حس کنند. داخل ماگ کاملاً لعاب دارد و به‌راحتی شسته می‌شود.'],
		SPECS('گنجایش ۳۵۰ میلی‌لیتر', 'نیمه‌لعاب آجری', 'مناسب')),
	product('vase-sage', 'گلدان «قامت»', 'ghamat-vase', 1850000, 'GL-VS-GHM', 'p-vase-sage', ['pc-vases'], { featured: true, attributes: [{ name: 'ارتفاع', options: ['۳۴ سانتی‌متر'] }] },
		'گلدان بلند با لعاب سبز مریمی؛ برای یک شاخه، یا هیچ شاخه.',
		['قامت را روی چرخ و در یک تکه می‌سازیم. رد انگشت‌های سفالگر روی بدنه مانده و لعاب سبز مریمی، در این شیارها پررنگ‌تر می‌نشیند.', 'داخل گلدان لعاب دارد و آب نگه می‌دارد.'],
		SPECS('ارتفاع ۳۴ سانتی‌متر، دهانه ۵ سانتی‌متر', 'نیمه‌براق سبز مریمی', 'دست‌شویی توصیه می‌شود')),
	product('jug-white', 'کوزه‌ی «سپید»', 'sepid-jug', 1450000, 'GL-VS-SPD', 'p-jug-white', ['pc-vases'], { attributes: [{ name: 'ارتفاع', options: ['۲۸ سانتی‌متر'] }] },
		'کوزه‌ای با شانه‌ی پهن و گردن کوتاه؛ برای آب، گل یا طاقچه.',
		['شکل کوزه‌ی سپید از کوزه‌های قدیمی آب الهام گرفته است؛ با لعاب سفید شیری و پایه‌ای که رنگ خاک را نشان می‌دهد.'],
		SPECS('ارتفاع ۲۸ سانتی‌متر', 'مات سفید شیری', 'دست‌شویی توصیه می‌شود')),
	product('platter', 'دیس بیضی «دریا»', 'darya-oval-platter', 1680000, 'GL-PL-DRY', 'p-platter', ['pc-plates'], { attributes: [{ name: 'ابعاد', options: ['۳۸ × ۲۴ سانتی‌متر'] }] },
		'دیس سرو بیضی با لعاب سرمه‌ای؛ برای برنج، ماهی یا میوه.',
		['دیس دریا برای سفره‌های بزرگ ساخته شده است. لعاب سرمه‌ای عمیقش، رنگ غذا را زنده‌تر نشان می‌دهد.'],
		SPECS('۳۸ × ۲۴ سانتی‌متر', 'براق سرمه‌ای', 'مناسب')),
	product('set', 'سرویس شش‌نفره «سفره»', 'sofreh-six-place-set', 7900000, 'GL-ST-SFR', 'p-set', ['pc-sets'], { featured: true, sale_price: 6900000, weight: 9, attributes: [{ name: 'تعداد', options: ['۱۸ تکه'] }] },
		'شش بشقاب، شش کاسه و شش فنجان با لعاب شنی؛ یک سفره‌ی کامل.',
		['سرویس سفره شامل شش بشقاب تخت، شش کاسه و شش فنجان است؛ همه با لعاب شنی گرم و لبه‌های بی‌لعاب.', 'در جعبه‌ی هدیه و با بسته‌بندی ایمن ارسال می‌شود.'],
		SPECS('بشقاب ۲۷، کاسه ۱۵ سانتی‌متر، فنجان ۲۲۰ میلی‌لیتر', 'نیمه‌مات شنی', 'مناسب')),
];

/* ---------------- Journal ---------------- */

const posts = [
	{
		key: 'no-two-alike', title: 'چرا هیچ دو کاسه‌ی ما شبیه هم نیستند', slug: 'no-two-alike', image: 'journal-1', terms: ['cat-making'], days_ago: 6,
		excerpt: 'تفاوت‌های کوچک، نشانه‌ی دست است، نه عیب.',
		content: L.article([
			'گاهی مشتری‌ها می‌پرسند چرا دو کاسه از یک مدل، کمی با هم فرق دارند. پاسخ ساده است: هر کاسه را یک نفر، روی چرخ و با دست ساخته است.',
			['h', 'جایی که تفاوت پیدا می‌شود'],
			['ul', ['ضخامت دیواره، که با فشار انگشت‌ها کمی تغییر می‌کند.', 'خال‌های آهن، که در کوره به سطح می‌آیند.', 'لعاب، که در گودی‌ها جمع می‌شود و روی لبه‌ها نازک‌تر است.']],
			'این تفاوت‌ها را عیب نمی‌دانیم؛ امضای دست سفالگرند.',
		]),
	},
	{
		key: 'clay-to-kiln', title: 'از گل تا کوره: یک کاسه چطور ساخته می‌شود', slug: 'from-clay-to-kiln', image: 'journal-2', terms: ['cat-making'], days_ago: 14,
		excerpt: 'دو هفته، دو بار پخت و دست‌کم پنج جفت دست؛ داستان ساخت یک کاسه.',
		content: L.article([
			'ساخت یک کاسه از لحظه‌ای که گل روی چرخ می‌نشیند تا روزی که در جعبه گذاشته می‌شود، حدود دو هفته طول می‌کشد.',
			['ol', ['ورز دادن گل و گرفتن هوای آن.', 'فرم دادن روی چرخ.', 'خشک شدن آهسته و تراش پایه.', 'پخت اول در ۹۰۰ درجه.', 'لعاب‌زنی با دست.', 'پخت دوم در ۱۲۶۰ درجه.']],
			'هر مرحله اگر عجولانه انجام شود، کاسه در کوره ترک برمی‌دارد. برای همین است که تعداد هر مدل محدود است.',
		]),
	},
	{
		key: 'dishwasher', title: 'سفال در ماشین ظرف‌شویی؟ راهنمای نگهداری', slug: 'caring-for-stoneware', image: 'journal-3', terms: ['cat-care'], days_ago: 23,
		excerpt: 'سفال سنگی ما برای استفاده‌ی روزانه ساخته شده؛ با چند نکته‌ی ساده، سال‌ها می‌ماند.',
		content: L.article([
			'همه‌ی ظرف‌های گلینه از سفال سنگی ساخته شده‌اند که در دمای بالا پخته می‌شود و آب جذب نمی‌کند؛ پس برای ماشین ظرف‌شویی و مایکروویو مناسب‌اند.',
			['h', 'چند نکته'],
			['ul', ['ظرف داغ را مستقیم روی سطح سرد یا خیس نگذارید.', 'برای گلدان‌ها و کوزه‌ها، شستن با دست را پیشنهاد می‌کنیم.', 'لکه‌های چای را با کمی جوش‌شیرین پاک کنید.']],
		]),
	},
	{
		key: 'turquoise', title: 'لعاب فیروزه‌ای؛ رنگی که از دل تاریخ آمده', slug: 'turquoise-glaze', image: 'journal-4', terms: ['cat-glaze'], days_ago: 31,
		excerpt: 'چرا فیروزه‌ای این‌قدر با سفال ایرانی گره خورده است.',
		content: L.article([
			'کمتر رنگی مثل فیروزه‌ای یادآور سفال و کاشی ایرانی است؛ از ظرف‌های کهن موزه‌ها تا گنبدهای شهرهای تاریخی.',
			'لعاب فیروزه‌ای ما از ترکیب مس با لعاب قلیایی به دست می‌آید. در کوره، بسته به ضخامت لعاب، از سبزآبی روشن تا آبی عمیق تغییر می‌کند.',
			['q', 'فیروزه‌ای، رنگ آب در سرزمینی است که همیشه تشنه‌ی آب بوده.', ''],
		]),
	},
];

/* ---------------- Shared blocks ---------------- */

const productsGrid = (s = {}) => w('hm-product-carousel', Object.assign({
	eyebrow: '', title: '', desc: '', header_align: 'start', title_tag: 'h2', title_size: 'lg', title_reveal: 'words',
	more_text: '', more_link: link(''),
	source: 'recent', category: [], count: 8, hide_out: '',
	card_style: 'minimal', card_ratio: '1-1', card_parts: ['badges', 'hover', 'cart'],
	layout: 'carousel', per_view: 4, per_view_tablet: 2.4, per_view_mobile: 1.3, columns: '4', arrows: 'top', dots: '', autoplay: '',
}, s));

const categoriesWidget = (s = {}) => w('hm-product-categories', Object.assign({
	eyebrow: '', title: '', desc: '', header_align: 'start', title_tag: 'h2', title_size: 'lg', title_reveal: 'words',
	more_text: '', more_link: link(''),
	pick: ['plates', 'bowls', 'cups', 'vases', 'sets'], count: 5, style: 'card', show_count: 'yes',
	layout: 'grid', columns: '5', per_view: 5, per_view_tablet: 2.4, per_view_mobile: 1.6,
}, s));

const QUOTES = [
	{ quote: 'سرویس سفره را برای خانه‌ی تازه خریدیم. سه سال است هر روز از آن استفاده می‌کنیم و هنوز مثل روز اول است؛ فقط بیشتر دوستش داریم.', name: 'نازنین فاضلی', role: 'تهران', rating: '5' },
	{ quote: 'بسته‌بندی آن‌قدر دقیق بود که کاسه‌ها از تهران تا مشهد بی‌هیچ آسیبی رسیدند. یک یادداشت دست‌نویس هم داخل جعبه بود.', name: 'علی رضوانی', role: 'مشهد', rating: '5' },
	{ quote: 'برای کافه‌مان صد و بیست فنجان سفارش دادیم. هم کیفیت یکدست بود و هم حس دست‌ساز بودن را داشت.', name: 'کافه‌ی آفتاب', role: 'شیراز، سفارش عمده', rating: '5' },
];

const FAQ_SHOP = [
	['ظرف‌ها برای ماشین ظرف‌شویی مناسب‌اند؟', 'بله؛ همه‌ی بشقاب‌ها، کاسه‌ها و فنجان‌ها برای ماشین ظرف‌شویی و مایکروویو مناسب‌اند. برای گلدان‌ها شستن با دست را پیشنهاد می‌کنیم.'],
	['چقدر طول می‌کشد تا سفارشم برسد؟', 'سفارش‌ها ظرف دو روز کاری بسته‌بندی و ارسال می‌شوند؛ در تهران یک تا دو روز و در شهرهای دیگر سه تا پنج روز کاری بعد می‌رسند.'],
	['اگر ظرفی شکسته برسد چه؟', 'عکس آن را ظرف ۴۸ ساعت برایمان بفرستید؛ همان را دوباره و بی‌هزینه ارسال می‌کنیم.'],
	['می‌توانم کالا را پس بدهم؟', 'تا هفت روز پس از تحویل، اگر ظرف استفاده نشده باشد، آن را پس می‌گیریم و مبلغ را برمی‌گردانیم.'],
	['چرا ظرف‌ها با عکس کمی فرق دارند؟', 'هر ظرف دست‌ساز است؛ رنگ لعاب و خال‌های ریز آن کمی متفاوت است. این تفاوت‌ها، نشانه‌ی دست سفالگرند.'],
];

const pageHead = (eyebrow, title, desc, extra = {}) => section(Object.assign({ space: 'md', bottom0: true }, extra), [
	heading({ eyebrow, title, desc, title_tag: 'h1', title_size: 'xl' }),
]);

const perks = () => L.features([
	{ icon: 'truck', title: 'ارسال رایگان', text: 'برای سفارش‌های بالای ۲ میلیون تومان.' },
	{ icon: 'box', title: 'بسته‌بندی ایمن', text: 'اگر چیزی شکسته برسد، دوباره می‌فرستیم.' },
	{ icon: 'refresh', title: 'هفت روز بازگشت', text: 'اگر دلتان را نبرد، پس می‌گیریم.' },
	{ icon: 'gift', title: 'بسته‌بندی هدیه', text: 'با یادداشت دست‌نویس، بی‌هزینه.' },
], { layout: 'grid', style: 'plain', columns: '4', icon_style: 'tile' });

const newsletter = (title = 'از *کوره‌ی تازه*\nباخبر شوید', desc = 'هر ماه یک نامه: مدل‌های تازه، داستان‌های کارگاه و پیش‌فروش‌های محدود.') => L.cta({
	eyebrow: 'خبرنامه', title, desc,
	action: 'email', email_placeholder: 'ایمیل شما', email_button: 'عضویت', note: 'هر ماه یک ایمیل؛ هر وقت خواستید لغو کنید.',
	look: 'image', image: img('studio'), decor: '', rounded: '',
});

/* ---------------- Home ---------------- */

const home = [
	L.bleed(w('hm-hero', {
		layout: 'editorial', title_tag: 'h1', title_size: 'xl', header_align: 'start', title_reveal: 'words',
		eyebrow: 'گلینه · سفال دست‌ساز',
		title: 'سفره‌ای که\n*با دست* ساخته شده',
		desc: 'بشقاب، کاسه، فنجان و گلدان‌هایی که یکی‌یکی روی چرخ سفالگری ساخته و دو بار در کوره پخته می‌شوند؛ برای استفاده‌ی هر روز.',
		btn1_text: 'دیدن فروشگاه', btn1_link: link(shopUrl), btn1_style: 'primary',
		btn2_text: 'داستان کارگاه', btn2_link: link('{{page:atelier}}'), btn2_style: 'secondary',
		media_type: 'image', image: img('hero'), media_ratio: 'landscape', height: 'auto', decor: '', hint: '',
	})),
	section({ space: 'sm', gap: 0 }, [perks()]),
	section({ space: 'md', gap: 32, cards: 'cascade' }, [
		categoriesWidget({ eyebrow: 'دسته‌ها', title: 'برای *هر وعده*' }),
	]),
	section({ space: 'md', gap: 32 }, [
		productsGrid({ eyebrow: 'تازه از کوره', title: 'مدل‌های *تازه*', more_text: 'همه‌ی محصولات', more_link: link(shopUrl) }),
	]),
	fx(section({ space: 'md', gap: 48 }, [
		cols({ widths: [45, 55], gap: 72, align: 'center' }, [
			[fx(L.imageReveal('studio', { ratio: '4-3', reveal: 'none', parallax: px(0) }), { zoom: 'in', zoomAmount: 0.12, zoomInner: true })],
			[
				heading({ eyebrow: 'کارگاه گلینه', title: 'دو هفته،\n*برای یک کاسه*' }),
				L.textScrub('هر ظرف گلینه را *یک نفر* روی چرخ می‌سازد، دو بار در کوره می‌پزد و با دست لعاب می‌زند. خال‌های ریز، رد انگشت‌ها و لعابی که در گودی‌ها جمع شده، *امضای دست* است؛ برای همین هیچ دو ظرفی دقیقاً شبیه هم نیستند.', { size: 'sm' }),
				button('داستان کارگاه', '{{page:atelier}}', 'secondary'),
			],
		]),
	]), { tone: 'surface' }),
	section({ space: 'md', gap: 32 }, [
		w('hm-product-tabs', {
			eyebrow: 'انتخاب ما', title: 'برای *سفره‌ی شما*', desc: '', header_align: 'start', title_tag: 'h2', title_size: 'lg', title_reveal: 'words',
			more_text: '', more_link: link(''),
			tabs_style: 'pills',
			tabs: [
				{ label: 'پرفروش‌ها', source: 'featured', category: [], count: 8 },
				{ label: 'کاسه‌ها', source: 'recent', category: ['bowls'], count: 8 },
				{ label: 'فنجان و ماگ', source: 'recent', category: ['cups'], count: 8 },
				{ label: 'حراج', source: 'sale', category: [], count: 8 },
			],
			card_style: 'minimal', card_ratio: '1-1', card_parts: ['badges', 'hover', 'cart'],
			layout: 'grid', columns: '4',
		}),
	]),
	section({ space: 'none', gap: 0, zoom: 'expand', zoomAmount: 0.22, zoomInner: true, zoomRadius: 14 }, [
		L.imageReveal('shelf', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'از زبان خریداران', title: 'سفره‌هایی که *با گلینه* چیده شده', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'دفترچه', title: 'داستان‌های *کارگاه*' })],
			[button('همه‌ی یادداشت‌ها', '{{blog}}', 'secondary', { _flex_align_self: 'flex-end' })],
		]),
		L.posts({ count: 3, layout: 'grid', columns: '3', excerpt: 'yes' }),
	]),
	newsletter(),
];

/* ---------------- Home, second version ---------------- */

const home2 = [
	L.bleed(w('hm-slider', {
		slides: [
			{ image: img('flatlay-2'), image_mobile: {}, eyebrow: 'مجموعه‌ی بهار', title: 'سبز مریمی،\n*سفید شیری*', text: 'بشقاب‌ها و کاسه‌های تازه، با لعاب‌هایی به رنگ برگ و شیر.', btn_text: 'دیدن مجموعه', link: link(shopUrl), tone: 'dark', position: 'start' },
			{ image: img('shelf'), image_mobile: {}, eyebrow: 'گلدان و کوزه', title: 'برای *یک شاخه*', text: 'گلدان‌هایی که خالی هم زیبا هستند.', btn_text: 'گلدان‌ها', link: link('{{termlink:pc-vases}}'), tone: 'dark', position: 'start' },
			{ image: img('hero'), image_mobile: {}, eyebrow: 'سرویس سفره', title: 'یک سفره‌ی *کامل*', text: 'هجده تکه برای شش نفر؛ با بسته‌بندی هدیه.', btn_text: 'سرویس سفره', link: link('{{product:set}}'), tone: 'dark', position: 'start' },
		],
		height: { unit: 'vh', size: 86, sizes: [] }, boxed: '', arrows: 'sides', dots: 'bar', autoplay: '6',
	})),
	section({ space: 'md', gap: 32 }, [
		productsGrid({ eyebrow: 'پرفروش‌ها', title: 'محبوب‌ترین‌ها', source: 'featured', layout: 'grid', columns: '4', count: 8, more_text: 'فروشگاه', more_link: link(shopUrl) }),
	]),
	fx(section({ space: 'md', gap: 32 }, [
		categoriesWidget({ eyebrow: 'دسته‌ها', title: 'خرید بر اساس *نوع ظرف*', style: 'circle' }),
	]), { tone: 'soft', cards: 'spread' }),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [50, 50], gap: 72, align: 'center' }, [
			[
				heading({ eyebrow: 'سفارش ویژه', title: 'برای کافه،\n*رستوران و هتل*', desc: 'ظرف‌هایی با رنگ و اندازه‌ی دلخواه، برای کسب‌وکارهایی که سفره‌شان امضای خودشان است.' }),
				L.features([
					{ icon: '', title: 'از ۵۰ تکه', text: 'حداقل سفارش برای هر مدل.' },
					{ icon: '', title: 'لعاب اختصاصی', text: 'رنگی که فقط برای شما ساخته می‌شود.' },
					{ icon: '', title: 'تحویل ۶ تا ۸ هفته', text: 'با نمونه‌ی اولیه پیش از تولید.' },
				], { layout: 'list', style: 'plain', numbered: 'yes', icon_style: 'plain' }),
				button('درخواست سفارش ویژه', '{{page:custom}}', 'primary'),
			],
			[fx(L.imageReveal('p-set', { ratio: '1-1', reveal: 'none', parallax: px(0) }), { zoom: 'out', zoomAmount: 0.12 })],
		]),
	]),
	section({ space: 'md', gap: 32 }, [
		w('hm-product-deal', {
			eyebrow: 'پیشنهاد این هفته', title: 'سرویس *سفره*', desc: 'هجده تکه برای شش نفر، با بسته‌بندی هدیه و ارسال رایگان.', header_align: 'start', title_tag: 'h2', title_size: 'lg', title_reveal: 'words',
			source: 'manual', ids: '{{ids:set}}', count: 1, layout_type: 'spotlight', ends: 'date', end_date: '2026-12-30 23:59',
		}),
	]),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *خرید*' }), button('همه‌ی پرسش‌ها', '{{page:faq}}', 'secondary')],
			[L.faq(FAQ_SHOP.slice(0, 4), { style: 'lines' })],
		]),
	]),
	newsletter(),
];

/* ---------------- Collections ---------------- */

const collections = [
	pageHead('مجموعه‌ها', 'هر ظرف،\n*یک کاربرد*', 'پنج دسته، و در هر دسته چند مدل؛ همه از همان خاک و همان کوره.'),
	section({ space: 'md', gap: 32, cards: 'cascade' }, [categoriesWidget({ title: '' })]),
	...[['بشقاب و دیس', 'plates', 'بشقاب‌های تخت و گود، و دیس‌های سرو برای سفره‌های بزرگ.'], ['کاسه', 'bowls', 'کاسه‌ی صبحانه، سوپ و سالاد.'], ['فنجان و ماگ', 'cups', 'برای چای عصر و قهوه‌ی صبح.'], ['گلدان و کوزه', 'vases', 'برای گل تازه، شاخه‌ی خشک یا طاقچه‌ی خالی.']].map(([t, slug, d], i) => fx(section({ space: 'md', gap: 32 }, [
		productsGrid({ eyebrow: 'مجموعه', title: t, desc: d, category: [slug], layout: 'carousel', more_text: 'همه‌ی ' + t, more_link: link(shopUrl + '?product_cat=' + slug) }),
	]), i % 2 ? { tone: 'surface' } : {})),
	newsletter(),
];

/* ---------------- Atelier ---------------- */

const atelier = [
	pageHead('کارگاه', 'خاک، آتش\n*و حوصله*', 'گلینه را در سال ۱۳۹۶ مینا و کاوه، دو سفالگر، در یک کارگاه کوچک در شمال تهران راه انداختند. امروز شش نفریم و هنوز هر ظرف را خودمان می‌سازیم.'),
	section({ space: 'sm', zoom: 'expand', zoomAmount: 0.2, zoomInner: true, zoomRadius: 14 }, [
		L.imageReveal('studio', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	section({ space: 'md', gap: 48 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'باور ما', title: 'ظرف خوب،\n*هر روز* استفاده می‌شود' })],
			[L.textScrub('ظرف‌هایمان را برای ویترین نمی‌سازیم. می‌خواهیم صبح‌ها در آن‌ها صبحانه بخورید، عصرها چای بنوشید و شب‌ها سفره بچینید. سفال سنگی ما *محکم* است، در ماشین ظرف‌شویی شسته می‌شود و با گذشت سال‌ها، *زیباتر* می‌شود.', { size: 'md' })],
		]),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'مراحل ساخت', title: 'شش مرحله،\n*دو هفته*', header_align: 'center' }),
		L.steps([
			{ marker: '', icon: 'drop', title: 'ورز گل', text: 'گرفتن هوای گل تا در کوره ترک برندارد.' },
			{ marker: '', icon: 'refresh', title: 'چرخ', text: 'فرم دادن هر ظرف با دست روی چرخ.' },
			{ marker: '', icon: 'sun', title: 'خشک شدن', text: 'چند روز آهسته، و تراش پایه.' },
			{ marker: '', icon: 'fire', title: 'پخت اول', text: 'در ۹۰۰ درجه؛ گل به سفال تبدیل می‌شود.' },
			{ marker: '', icon: 'palette', title: 'لعاب', text: 'غوطه‌وری در لعاب، با دست.' },
			{ marker: '', icon: 'fire', title: 'پخت دوم', text: 'در ۱۲۶۰ درجه؛ لعاب ذوب و شیشه می‌شود.' },
		], { layout: 'h', cards: 'yes' }),
	]), { tone: 'surface', cards: 'flip' }),
	section({ space: 'sm', gap: 0 }, [
		L.con({ content_width: 'full', css_classes: 'hm-scheme-inverse', padding: L.pad(44, 48) }, [
			L.counters([
				{ value: 8, label: 'سال کار' },
				{ value: 6, label: 'سفالگر' },
				{ value: 1260, label: 'درجه، دمای پخت' },
				{ value: 24, suffix: ' هزار', label: 'ظرف ساخته‌شده' },
			], { style: 'plain', columns: '4' }),
		], true),
	]),
	section({ space: 'md', gap: 40, cards: 'cascade' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'سفالگران', title: 'دست‌هایی که\n*می‌سازند*' })],
			[L.features([
				{ icon: '', title: 'مینا افشار', text: 'هم‌بنیان‌گذار؛ طراحی فرم و لعاب' },
				{ icon: '', title: 'کاوه نیک‌نام', text: 'هم‌بنیان‌گذار؛ چرخ و کوره' },
				{ icon: '', title: 'سحر رحیمی', text: 'سفالگر؛ کاسه و بشقاب' },
				{ icon: '', title: 'امیر جلالی', text: 'سفالگر؛ گلدان و کوزه' },
				{ icon: '', title: 'لیلا شاکری', text: 'لعاب‌زنی و کنترل کیفیت' },
				{ icon: '', title: 'رضا امیری', text: 'بسته‌بندی و ارسال' },
			], { layout: 'grid', style: 'plain', columns: '2', icon_style: 'plain' })],
		]),
	]),
	newsletter('به کارگاه\n*سر بزنید*', 'پنج‌شنبه‌ها از ۱۰ تا ۱۴، درِ کارگاه برای بازدید باز است. برای خبر از روزهای کارگاه باز، عضو خبرنامه شوید.'),
];

/* ---------------- Custom orders ---------------- */

const CUSTOM_FORM = {
	need_label: 'نوع ظرف', need_title: 'چه ظرف‌هایی لازم دارید؟', need_desc: 'هر چند گزینه که لازم است.',
	choices: [
		{ label: 'بشقاب', note: 'تخت، گود یا دسر', icon: 'grid' },
		{ label: 'کاسه', note: 'سوپ، سالاد یا دسر', icon: 'drop' },
		{ label: 'فنجان و ماگ', note: 'چای و قهوه', icon: 'coffee' },
		{ label: 'دیس سرو', note: 'بیضی یا گرد', icon: 'layers' },
		{ label: 'گلدان', note: 'برای میز یا لابی', icon: 'flower' },
		{ label: 'هنوز نمی‌دانم', note: 'با هم انتخاب می‌کنیم', icon: 'compass' },
	],
	multi: 'yes',
	budget_on: 'yes', budget_label: 'تعداد', budget_title: 'حدود چند تکه؟',
	budgets: '۵۰ تا ۱۵۰ تکه\n۱۵۰ تا ۵۰۰ تکه\nبیش از ۵۰۰ تکه',
	timeline_on: 'yes', timeline_title: 'زمان تحویل مورد نیاز',
	timelines: 'کمتر از دو ماه\nدو تا سه ماه\nمنعطف هستم',
	contact_label: 'تماس', contact_title: 'با چه کسی صحبت کنیم؟',
	show_name: 'yes', label_name: 'نام و نام خانوادگی',
	show_phone: 'yes', label_phone: 'شماره‌ی موبایل',
	show_email: 'yes', label_email: 'ایمیل', req_email: '',
	show_company: 'yes', label_company: 'نام کافه، رستوران یا هتل', req_company: '',
	show_message: 'yes', label_message: 'درباره‌ی رنگ، اندازه یا سبک مورد نظر', req_message: '', consent: '',
	next_text: 'مرحله‌ی بعد', back_text: 'قبلی', submit_text: 'ارسال درخواست',
	done_title: 'درخواست شما رسید',
	done_text: 'ظرف دو روز کاری تماس می‌گیریم تا درباره‌ی نمونه‌ی اولیه صحبت کنیم.',
	done_btn_text: 'بازگشت به فروشگاه', done_btn_link: link(shopUrl), done_btn_style: 'secondary',
	remember: 'yes', boxed: 'yes', columns: '2',
};

const custom = [
	pageHead('سفارش ویژه', 'سفره‌ای با\n*امضای شما*', 'برای کافه‌ها، رستوران‌ها، هتل‌ها و هدیه‌های سازمانی؛ ظرف‌هایی با رنگ، اندازه و نشان دلخواه.'),
	section({ space: 'md', gap: 40, cards: 'cascade' }, [
		L.features([
			{ icon: 'palette', title: 'لعاب اختصاصی', text: 'رنگی که برای شما ساخته و فقط برای شما استفاده می‌شود.' },
			{ icon: 'pen', title: 'نشان یا لوگو', text: 'مهر برجسته روی پایه‌ی ظرف.' },
			{ icon: 'box', title: 'تولید یکدست', text: 'نمونه‌ی اولیه پیش از تولید، و کنترل کیفیت تک‌تک ظرف‌ها.' },
			{ icon: 'truck', title: 'ارسال به همه‌ی شهرها', text: 'با بسته‌بندی صنعتی و بیمه‌ی حمل.' },
		], { layout: 'grid', style: 'cards', columns: '4', icon_style: 'tile' }),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'روند کار', title: 'از نمونه\n*تا تحویل*', header_align: 'center' }),
		L.steps([
			{ marker: '', icon: 'mail', title: 'درخواست', text: 'نوع ظرف، تعداد و زمان تحویل را بگویید.' },
			{ marker: '', icon: 'palette', title: 'نمونه', text: 'ظرف نمونه با لعاب شما، ظرف دو هفته.' },
			{ marker: '', icon: 'check', title: 'تأیید و پیش‌پرداخت', text: 'پس از تأیید نمونه، تولید شروع می‌شود.' },
			{ marker: '', icon: 'truck', title: 'تحویل', text: 'شش تا هشت هفته پس از تأیید.' },
		], { layout: 'h', cards: 'yes' }),
	]), { tone: 'surface' }),
	section({ space: 'md', gap: 40, width: 980 }, [
		heading({ eyebrow: 'درخواست', title: 'سفارشتان را *شروع کنیم*', header_align: 'center' }),
		L.leadForm(CUSTOM_FORM),
	]),
];

/* ---------------- Care, shipping, FAQ, contact ---------------- */

const care = [
	pageHead('نگهداری', 'سال‌ها،\n*مثل روز اول*', 'سفال سنگی گلینه برای استفاده‌ی هر روز ساخته شده است. این چند نکته کمک می‌کند ظرف‌هایتان سال‌ها بمانند.'),
	section({ space: 'md', gap: 40, cards: 'flip' }, [
		L.features([
			{ icon: 'drop', title: 'ماشین ظرف‌شویی', text: 'بشقاب، کاسه و فنجان‌ها مناسب‌اند. گلدان‌ها را با دست بشویید.', meta: 'مناسب' },
			{ icon: 'bolt', title: 'مایکروویو', text: 'برای گرم کردن غذا مناسب است؛ ظرف را خالی گرم نکنید.', meta: 'مناسب' },
			{ icon: 'fire', title: 'فر', text: 'تا ۲۰۰ درجه، به شرط آنکه ظرف همراه فر گرم شود.', meta: 'با احتیاط' },
			{ icon: 'gauge', title: 'تغییر ناگهانی دما', text: 'ظرف داغ را روی سطح سرد یا خیس نگذارید.', meta: 'پرهیز کنید' },
			{ icon: 'leaf', title: 'لکه‌ی چای و قهوه', text: 'با کمی جوش‌شیرین و اسفنج نرم پاک می‌شود.', meta: 'آسان' },
			{ icon: 'shield', title: 'لب‌پریدگی', text: 'ظرف‌ها را روی هم نکشید؛ لبه‌ها بی‌لعاب و حساس‌ترند.', meta: 'مراقب باشید' },
		], { layout: 'grid', style: 'cards', columns: '3', icon_style: 'tile' }),
	]),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'درباره‌ی *نگهداری*' })],
			[L.faq([FAQ_SHOP[0], ['آیا لعاب‌ها برای غذا ایمن‌اند؟', 'بله؛ همه‌ی لعاب‌های ظرف‌های غذا بدون سرب‌اند و پس از پخت دوم، کاملاً شیشه‌ای و بی‌خطر می‌شوند.'], ['ظرف ترک خورده را می‌شود استفاده کرد؟', 'ترک‌های ریز سطح لعاب (که «کریکل» نامیده می‌شوند) طبیعی‌اند. اما ظرفی را که بدنه‌اش ترک خورده، برای غذای داغ استفاده نکنید.']], { style: 'lines' })],
		]),
	]),
];

const shipping = [
	pageHead('ارسال و مرجوعی', 'با دقت *بسته‌بندی*،\nبا خیال راحت *خرید*', 'هر سفارش را با کاغذ و مقوای بازیافتی، لایه‌به‌لایه بسته‌بندی می‌کنیم و به همه‌ی شهرها می‌فرستیم.'),
	section({ space: 'md', gap: 40 }, [perks()]),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'ارسال', title: 'زمان و *هزینه*' })],
			[L.features([
				{ icon: '', title: 'تهران', text: 'پیک ویژه؛ یک تا دو روز کاری.', meta: '۹۰ هزار تومان' },
				{ icon: '', title: 'شهرهای دیگر', text: 'پست پیشتاز؛ سه تا پنج روز کاری.', meta: '۱۴۰ هزار تومان' },
				{ icon: '', title: 'سفارش بالای ۲ میلیون تومان', text: 'به همه‌ی شهرها.', meta: 'رایگان' },
			], { layout: 'list', style: 'plain', numbered: '', icon_style: 'plain' })],
		]),
	]), { tone: 'surface' }),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'مرجوعی', title: 'اگر *دلتان را نبرد*' })],
			[L.faq([FAQ_SHOP[2], FAQ_SHOP[3], ['هزینه‌ی ارسال مرجوعی با کیست؟', 'اگر ظرف آسیب‌دیده یا اشتباه رسیده باشد، با ما؛ در غیر این صورت، با خریدار.']], { style: 'lines' })],
		]),
	]),
];

const faqPage = [
	pageHead('پرسش‌های متداول', 'پیش از *خرید*', 'پاسخ پرسش‌هایی که بیشتر از همه می‌شنویم. اگر پرسشتان این‌جا نیست، پیام بدهید.'),
	section({ space: 'md', gap: 56 }, [
		cols({ widths: [30, 70], gap: 64 }, [
			[heading({ eyebrow: 'خرید', title: 'سفارش و *ارسال*', title_size: 'md' })],
			[L.faq(FAQ_SHOP, { style: 'lines' })],
		]),
		cols({ widths: [30, 70], gap: 64 }, [
			[heading({ eyebrow: 'ظرف‌ها', title: 'جنس و *ساخت*', title_size: 'md' })],
			[L.faq([
				['سفال سنگی چیست؟', 'سفالی که در دمای بالا (حدود ۱۲۶۰ درجه) پخته می‌شود؛ محکم‌تر از سفال معمولی است و آب جذب نمی‌کند.'],
				['آیا لعاب‌ها بدون سرب‌اند؟', 'بله؛ همه‌ی لعاب‌های ظرف‌های غذا بدون سرب‌اند.'],
				['می‌شود مدلی را دوباره سفارش داد؟', 'بیشتر مدل‌ها همیشه ساخته می‌شوند. اگر مدلی ناموجود بود، در صفحه‌ی آن عضو اطلاع‌رسانی شوید.'],
			], { style: 'lines', first_open: '' })],
		]),
	]),
];

const contact = [
	pageHead('تماس', 'با ما *در تماس* باشید', 'برای پرسش درباره‌ی سفارش، سفارش ویژه یا بازدید از کارگاه، پیام بدهید.'),
	section({ space: 'md' }, [
		cols({ widths: [40, 60], gap: 64 }, [
			[L.contactInfo([
				{ icon: 'whatsapp', label: 'واتس‌اپ و تلفن', value: '۰۹۱۲ ۴۴۰ ۷۲۱۸', link: link('https://wa.me/989124407218', true) },
				{ icon: 'mail', label: 'ایمیل', value: 'hello@gelineh.ir', link: link('mailto:hello@gelineh.ir') },
				{ icon: 'instagram', label: 'اینستاگرام', value: 'gelineh.ceramics', link: link('https://instagram.com/', true) },
				{ icon: 'pin', label: 'کارگاه', value: 'تهران، دزاشیب، خیابان شهید کمال طاهری، پلاک ۱۲', link: link('') },
				{ icon: 'clock', label: 'بازدید از کارگاه', value: 'پنج‌شنبه‌ها، ۱۰ تا ۱۴', link: link('') },
			])],
			[L.contactForm({ show_phone: 'yes', label_phone: 'شماره‌ی تماس', show_subject: 'yes', label_subject: 'موضوع', label_name: 'نام و نام خانوادگی', label_email: 'ایمیل', label_message: 'پیام شما', button: 'ارسال پیام', success: 'پیامتان رسید؛ ظرف یک روز کاری پاسخ می‌دهیم.' })],
		]),
	]),
];

/* ---------------- Package ---------------- */

const pages = [
	{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings() },
	{ key: 'home-2', title: 'خانه — نسخه‌ی دوم', slug: 'home-2', elementor: home2, settings: L.pageSettings({ header: 'transparent-light' }) },
	{ key: 'collections', title: 'مجموعه‌ها', slug: 'collections', elementor: collections, settings: L.pageSettings() },
	{ key: 'atelier', title: 'کارگاه', slug: 'atelier', elementor: atelier, settings: L.pageSettings() },
	{ key: 'custom', title: 'سفارش ویژه', slug: 'custom-orders', elementor: custom, settings: L.pageSettings() },
	{ key: 'care', parent: 'faq', title: 'نگهداری', slug: 'care', elementor: care, settings: L.pageSettings() },
	{ key: 'shipping', parent: 'faq', title: 'ارسال و مرجوعی', slug: 'shipping-and-returns', elementor: shipping, settings: L.pageSettings() },
	{ key: 'faq', title: 'پرسش‌های متداول', slug: 'faq', elementor: faqPage, settings: L.pageSettings() },
	{ key: 'contact', title: 'تماس', slug: 'contact', elementor: contact, settings: L.pageSettings() },
	{ key: 'journal', title: 'دفترچه', slug: 'journal', content: '' },
];

module.exports = {
	manifest: {
		id: 'gelineh',
		order: 14,
		title: 'گلینه',
		desc: 'فروشگاه سفال دست‌ساز؛ فروشگاه کامل با ده محصول در پنج دسته، مجموعه‌ها، کارگاه، سفارش ویژه برای کسب‌وکارها، راهنمای نگهداری، ارسال و مرجوعی و دفترچه. سفید چینی، سبز مریمی و آجری.',
		kit: 'clay',
		thumb: 'thumb.webp',
		required: ['elementor', 'woocommerce'],
		recommended: [],
		tags: ['فروشگاهی', 'دست‌ساز', 'سفال'],
		pages: pages.filter((p) => p.elementor).map((p) => p.title).concat(['فروشگاه', 'دفترچه']),
	},
	content: {
		site: { title: 'گلینه', tagline: 'سفال دست‌ساز برای سفره‌ی هر روز' },
		images, alts, terms, posts, products, pages,
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'گلینه — صفحه‌ی اصلی' },
			{ key: 'tpl-home-2', type: 'page', page: 'home-2', title: 'گلینه — صفحه‌ی اصلی، نسخه‌ی دوم' },
			{ key: 'tpl-atelier', type: 'page', page: 'atelier', title: 'گلینه — کارگاه' },
			{ key: 'tpl-custom', type: 'page', page: 'custom', title: 'گلینه — سفارش ویژه' },
			{ key: 'tpl-cats', type: 'section', page: 'home', index: 2, title: 'گلینه — دسته‌های محصولات' },
			{ key: 'tpl-new', type: 'section', page: 'home', index: 3, title: 'گلینه — اسلایدر محصولات تازه' },
			{ key: 'tpl-tabs', type: 'section', page: 'home', index: 5, title: 'گلینه — محصولات در زبانه' },
			{ key: 'tpl-deal', type: 'section', page: 'home-2', index: 4, title: 'گلینه — پیشنهاد ویژه با شمارش معکوس' },
		],
		menus: [
			{
				name: 'گلینه — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'فروشگاه', url: '{{shop}}' },
					{ title: 'مجموعه‌ها', page: 'collections' },
					{ title: 'سفارش ویژه', page: 'custom' },
					{ title: 'کارگاه', page: 'atelier' },
					{ title: 'دفترچه', page: 'journal' },
					{
						title: 'راهنما', page: 'faq', children: [
							{ title: 'پرسش‌های متداول', page: 'faq' },
							{ title: 'نگهداری', page: 'care' },
							{ title: 'ارسال و مرجوعی', page: 'shipping' },
							{ title: 'تماس', page: 'contact' },
						],
					},
				],
			},
			{
				name: 'گلینه — پابرگ', location: 'footer', items: [
					{ title: 'فروشگاه', url: '{{shop}}' },
					{ title: 'سفارش ویژه', page: 'custom' },
					{ title: 'نگهداری', page: 'care' },
					{ title: 'ارسال و مرجوعی', page: 'shipping' },
					{ title: 'پرسش‌های متداول', page: 'faq' },
					{ title: 'تماس', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 36,
			header_layout: 'split',
			header_cart: true,
			header_cta_text: '',
			font_body: 'iranyekan',
			font_heading: 'pinar',
			font_heading_weight: '500',
			footer_about: 'گلینه؛ کارگاه سفال دست‌ساز در تهران. بشقاب، کاسه، فنجان و گلدان برای سفره‌ی هر روز.',
			footer_copyright: 'تمام حقوق برای گلینه محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }, { network: 'whatsapp', url: 'https://wa.me/989124407218' }],
			mobile_bar: true,
			mobile_bar_text: 'فروشگاه',
			mobile_bar_url: '{{shop}}',
			mobile_bar_phone: '09124407218',
			cursor: 'dot',
			sound_enabled: true,
			sound_default: true,
			sound_theme: 'soft',
			sound_volume: 18,
			sound_hover: false,
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 4, pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'journal',
	},
};
