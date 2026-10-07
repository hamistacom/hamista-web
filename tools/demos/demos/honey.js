/**
 * Demo: Shahdineh — natural mountain honey (Honey kit), built as a complete
 * shop: two home pages, our story with lab results, the beekeepers, a honey
 * guide, monthly subscription, corporate gifts, storage, shipping, FAQ and
 * contact; nine products in four categories.
 */
'use strict';

const L = require('../lib');
const { img, link, px, section, cols, heading, button, fx } = L;

const images = { logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp' };
['hero', 'comb', 'apiary', 'cat-honey', 'cat-comb', 'cat-bee', 'cat-gift', 'process-1', 'process-2', 'process-3'].forEach((k) => { images[k] = 'images/' + k + '.webp'; });
['gavan', 'thyme', 'sidr', 'wild', 'orange', 'comb', 'pollen', 'gift', 'dipper'].forEach((k) => {
	images['p-' + k] = 'images/p-' + k + '.webp';
	images['p-' + k + '-b'] = 'images/p-' + k + '-b.webp';
});
for (let i = 1; i <= 6; i++) { images['journal-' + i] = 'images/journal-' + i + '.webp'; }

const alts = {
	hero: 'سه شیشه عسل گون، آویشن و کنار روی میز چوبی، کنار قاشق عسل',
	comb: 'نمای نزدیک قاب موم؛ سلول‌های سرپوشیده و سلول‌های پر از عسل',
	apiary: 'کندوهای رنگی در دامنه‌ی کوهستان، میان گل‌های وحشی',
};

const shopUrl = '{{shop}}';

/* ---------------- Catalogue ---------------- */

const terms = [
	{ key: 'pc-honey', taxonomy: 'product_cat', name: 'عسل', slug: 'honey', image: 'cat-honey', description: 'گون، آویشن، کنار، بهارنارنج و چهل‌گیاه.' },
	{ key: 'pc-comb', taxonomy: 'product_cat', name: 'عسل موم‌دار', slug: 'comb-honey', image: 'cat-comb', description: 'قاب موم، همان‌طور که از کندو برداشته شده.' },
	{ key: 'pc-bee', taxonomy: 'product_cat', name: 'فرآورده‌های زنبور', slug: 'bee-products', image: 'cat-bee', description: 'گرده‌ی گل و ابزار سرو عسل.' },
	{ key: 'pc-gift', taxonomy: 'product_cat', name: 'هدیه', slug: 'gifts', image: 'cat-gift', description: 'جعبه‌های چشیدنی و هدیه‌ی سازمانی.' },
	{ key: 'cat-know', taxonomy: 'category', name: 'شناخت عسل', slug: 'honey-guide' },
	{ key: 'cat-bee', taxonomy: 'category', name: 'زنبور و طبیعت', slug: 'bees' },
	{ key: 'cat-kitchen', taxonomy: 'category', name: 'آشپزخانه', slug: 'kitchen' },
];

const HONEY_SPECS = (region, color, sucrose) => [['منطقه', region], ['رنگ', color], ['ساکارز (آزمایش این برداشت)', sucrose], ['وزن خالص', '۵۰۰ گرم'], ['ظرف', 'شیشه‌ی شش‌ضلعی با در فلزی']];

const product = (key, title, slug, price, sku, image, terms_, extra, excerpt, paragraphs, specs) => Object.assign({
	key, title, slug, price, sku, image, gallery: [image + '-b'], terms: terms_, excerpt, stock: 40, weight: 0.75,
	content: L.productBody(paragraphs, specs),
}, extra);

const products = [
	product('gavan-honey', 'عسل گون', 'gavan-honey', 1850000, 'SH-GAV-500', 'p-gavan', ['pc-honey'], { featured: true, attributes: [{ name: 'وزن', options: ['۵۰۰ گرم'] }, { name: 'منطقه', options: ['زاگرس'] }] },
		'روشن و لطیف، از ارتفاعات زاگرس؛ کم‌شیرین و خوش‌عطر.',
		['عسل گون از شهد گیاه گون در ارتفاعات بالای ۲۴۰۰ متر زاگرس است. رنگش روشن و طعمش ملایم است و دیرتر از بیشتر عسل‌ها شکرک می‌زند.', 'برای خوردن با قاشق، همراه شیر گرم یا روی نان تازه.'],
		HONEY_SPECS('زاگرس، ۲۴۰۰ متر', 'سفید طلایی', '۱٫۲٪')),
	product('thyme-honey', 'عسل آویشن', 'thyme-honey', 1450000, 'SH-THY-500', 'p-thyme', ['pc-honey'], { featured: true, sale_price: 1290000, attributes: [{ name: 'وزن', options: ['۵۰۰ گرم'] }, { name: 'منطقه', options: ['سبلان'] }] },
		'معطر و گرم، از دامنه‌های سبلان؛ همراه همیشگی چای.',
		['عسل آویشن طعمی گرم و عطری تند دارد که از اولین قاشق شناخته می‌شود.', 'کنار چای، روی پنیر یا در دمنوش‌های زمستانی.'],
		HONEY_SPECS('دامنه‌ی سبلان', 'کهربایی', '۱٫۹٪')),
	product('sidr-honey', 'عسل کُنار', 'sidr-honey', 1280000, 'SH-SID-500', 'p-sidr', ['pc-honey'], { featured: true, attributes: [{ name: 'وزن', options: ['۵۰۰ گرم'] }, { name: 'منطقه', options: ['جنوب ایران'] }] },
		'تیره، پرقوام و کاراملی؛ از درختان کنار جنوب ایران.',
		['عسل کنار از شهد گل درختان کنار در جنوب ایران است؛ رنگی تیره و طعمی عمیق و کاراملی دارد.', 'برای کسانی که عسل پرطعم دوست دارند.'],
		HONEY_SPECS('هرمزگان', 'کهربایی تیره', '۲٫۴٪')),
	product('orange-blossom-honey', 'عسل بهارنارنج', 'orange-blossom-honey', 1390000, 'SH-ORB-500', 'p-orange', ['pc-honey'], { featured: true, attributes: [{ name: 'وزن', options: ['۵۰۰ گرم'] }, { name: 'منطقه', options: ['شیراز و جهرم'] }] },
		'عطر باغ‌های بهارنارنج شیراز در یک شیشه؛ روشن و گل‌دار.',
		['اردیبهشت، وقتی باغ‌های شیراز و جهرم پر از شکوفه‌ی نارنج است، زنبورها شهدی جمع می‌کنند که عطرش تا ماه‌ها در عسل می‌ماند.', 'برای چای، دسرهای شیری و هر جا که عطر گل می‌خواهید.'],
		HONEY_SPECS('شیراز و جهرم', 'طلایی روشن', '۱٫۶٪')),
	product('wildflower-honey', 'عسل چهل‌گیاه', 'wildflower-honey', 980000, 'SH-WLD-500', 'p-wild', ['pc-honey'], { attributes: [{ name: 'وزن', options: ['۵۰۰ گرم'] }, { name: 'منطقه', options: ['البرز'] }] },
		'طعمی متعادل از گل‌های وحشی البرز؛ برای هر روز.',
		['عسل چهل‌گیاه از گل‌های وحشی متنوع دامنه‌های البرز است و طعمی متعادل دارد.', 'همه‌کاره: از صبحانه تا شیرینی‌پزی و دمنوش.'],
		HONEY_SPECS('دامنه‌ی البرز', 'طلایی', '۲٫۱٪')),
	product('comb-honey', 'عسل موم‌دار (قاب کامل)', 'comb-honey', 1650000, 'SH-CMB-700', 'p-comb', ['pc-comb'], { stock: 15, weight: 1, attributes: [{ name: 'وزن', options: ['حدود ۷۰۰ گرم'] }] },
		'قاب موم پر از عسل، همان‌طور که از کندو برداشته شده.',
		['عسل موم‌دار دست‌نخورده‌ترین شکل عسل است: قاب موم همان‌طور که زنبورها ساخته‌اند، در جعبه‌ی چوبی.', 'موم را می‌توانید همراه عسل بجوید؛ طعمی متفاوت و تجربه‌ای قدیمی.'],
		[['وزن تقریبی', '۷۰۰ گرم'], ['ظرف', 'قاب چوبی با جعبه‌ی شفاف'], ['منطقه', 'دامنه‌ی سبلان']]),
	product('bee-pollen', 'گرده‌ی گل', 'bee-pollen', 680000, 'SH-POL-250', 'p-pollen', ['pc-bee'], { stock: 25, weight: 0.4, attributes: [{ name: 'وزن', options: ['۲۵۰ گرم'] }] },
		'دانه‌های رنگی گرده‌ی گل، خشک‌شده در سایه.',
		['گرده‌ی گل را زنبورها از گل‌های مختلف جمع می‌کنند؛ هر رنگ از یک گل است.', 'روی ماست، در اسموتی یا مستقیم با قاشق. در ظرف دربسته و جای خنک نگه دارید.'],
		[['وزن خالص', '۲۵۰ گرم'], ['روش خشک کردن', 'در سایه، بدون حرارت'], ['ظرف', 'شیشه با در فلزی']]),
	product('tasting-set', 'جعبه‌ی چشیدنی', 'tasting-set', 1490000, 'SH-SET-3', 'p-gift', ['pc-gift'], { featured: true, stock: 60, weight: 1.1, attributes: [{ name: 'محتوا', options: ['سه شیشه‌ی ۲۵۰ گرمی'] }] },
		'گون، آویشن و کنار در سه شیشه‌ی کوچک؛ برای آشنایی، یا هدیه.',
		['اگر نمی‌دانید کدام عسل را دوست دارید، از این جعبه شروع کنید: یک عسل روشن، یک عسل معطر و یک عسل تیره.', 'در جعبه‌ی کرافت با کارت راهنمای چشیدن؛ آماده برای هدیه.'],
		[['محتوا', 'سه شیشه‌ی ۲۵۰ گرمی'], ['بسته‌بندی', 'جعبه‌ی کرافت'], ['کارت هدیه', 'به انتخاب شما']]),
	product('honey-dipper', 'قاشق عسل چوبی', 'honey-dipper', 240000, 'SH-DIP-1', 'p-dipper', ['pc-bee'], { stock: 80, weight: 0.05, attributes: [{ name: 'جنس', options: ['چوب گردو'] }] },
		'خراطی‌شده از چوب گردو؛ عسل را بی‌چکه از شیشه تا فنجان می‌برد.',
		['شیارهای سر قاشق عسل را نگه می‌دارند تا با چرخاندن آرام، بی‌آنکه بچکد، به فنجان یا نان برسد.', 'با آب گرم بشویید و گاهی با کمی روغن خوراکی جلا دهید.'],
		[['جنس', 'چوب گردو'], ['طول', '۱۶ سانتی‌متر'], ['ساخت', 'خراطی دستی، اصفهان']]),
];

/* ---------------- Journal ---------------- */

const posts = [
	{
		key: 'real-honey', title: 'عسل طبیعی را چطور تشخیص بدهیم؟', slug: 'how-to-tell-real-honey', image: 'journal-3', terms: ['cat-know'], days_ago: 3,
		excerpt: 'آزمایش‌های خانگی معروف بیشتر افسانه‌اند. آنچه واقعاً کار می‌کند، برگه‌ی آزمایش است.',
		content: L.article([
			'احتمالاً شنیده‌اید که عسل طبیعی در آب حل نمی‌شود، شعله را روشن نگه می‌دارد یا روی دستمال کاغذی پخش نمی‌شود. بیشتر این آزمایش‌ها به رطوبت عسل بستگی دارند، نه به طبیعی بودنش.',
			['h', 'چه چیزی واقعاً مهم است؟'],
			['ul', ['ساکارز: نشانه‌ی شکر افزوده یا تغذیه‌ی زنبور با شکر؛ در عسل خوب کمتر از ۵ درصد.', 'رطوبت: عسل رسیده کمتر از ۲۰ درصد آب دارد.', 'HMF: نشانه‌ی حرارت دیدن یا کهنگی؛ هر چه کمتر بهتر.']],
			['h', 'شکرک زدن، نشانه‌ی خوبی است'],
			'برخلاف تصور رایج، شکرک زدن نشانه‌ی تقلب نیست. بیشتر عسل‌های طبیعی دیر یا زود شکرک می‌زنند؛ سرعتش به نوع گل و دما بستگی دارد.',
			['q', 'مطمئن‌ترین آزمایش خانگی، خواندن برگه‌ی آزمایش آزمایشگاه است.'],
		]),
	},
	{
		key: 'which-honey', title: 'گون، آویشن، کنار یا بهارنارنج؟', slug: 'choosing-your-honey', image: 'journal-2', terms: ['cat-know'], days_ago: 8,
		excerpt: 'راهنمای کوتاه انتخاب عسل بر اساس طعم و مصرف.',
		content: L.article([
			'هر عسل طعم گلی را دارد که زنبور از آن شهد جمع کرده است. انتخاب درست، بیشتر به سلیقه و مصرف شما بستگی دارد تا به «بهترین» بودن.',
			['ul', ['عسل گون: روشن و ملایم؛ برای خوردن با قاشق.', 'عسل آویشن: معطر و گرم؛ عالی با چای و پنیر.', 'عسل کنار: تیره و کاراملی؛ پرقوام و پرطعم.', 'عسل بهارنارنج: گل‌دار و روشن؛ برای دسرها و چای.']],
			'اگر اولین بار است که عسل طبیعی می‌خرید، جعبه‌ی چشیدنی سه شیشه‌ای را امتحان کنید.',
		]),
	},
	{
		key: 'harvest-time', title: 'چرا عسل را دیرتر برداشت می‌کنیم', slug: 'why-we-harvest-late', image: 'journal-4', terms: ['cat-bee'], days_ago: 14,
		excerpt: 'صبر برای سرپوشیده شدن سلول‌ها، تفاوت عسل رسیده و نارس است.',
		content: L.article([
			'زنبورها وقتی رطوبت عسل به اندازه‌ی کافی پایین آمد، روی هر سلول را با لایه‌ای نازک از موم می‌پوشانند. این نشانه‌ی رسیدن عسل است.',
			'برداشت زودتر عسل بیشتری می‌دهد، اما عسلی که رطوبت بالا دارد زود ترش می‌شود. ما فقط قاب‌هایی را برداشت می‌کنیم که دست‌کم هشتاد درصد سلول‌هایشان سرپوشیده است.',
			['img', 'process-2', 'قاب نیمه‌سرپوشیده؛ هنوز برای برداشت زود است'],
		]),
	},
	{
		key: 'storing-honey', title: 'نگهداری عسل: یخچال یا کابینت؟', slug: 'how-to-store-honey', image: 'journal-1', terms: ['cat-know'], days_ago: 20,
		excerpt: 'عسل تقریباً هیچ‌وقت خراب نمی‌شود؛ به شرطی که این سه نکته را رعایت کنید.',
		content: L.article([
			['ol', ['در ظرف را همیشه محکم ببندید؛ عسل رطوبت هوا را جذب می‌کند.', 'دور از نور مستقیم و گرمای اجاق نگه دارید.', 'یخچال لازم نیست و شکرک زدن را سریع‌تر می‌کند.']],
			'اگر عسل شکرک زد، شیشه را در ظرف آب ولرم بگذارید. حرارت مستقیم یا مایکروویو عطر و آنزیم‌های عسل را از بین می‌برد.',
		]),
	},
	{
		key: 'bees-and-flowers', title: 'نقشه‌ی گل‌ها: عسل هر منطقه از کجا می‌آید', slug: 'honey-map-of-iran', image: 'journal-5', terms: ['cat-bee'], days_ago: 27,
		excerpt: 'از گون زاگرس تا کنار جنوب؛ سفری کوتاه روی نقشه‌ی عسل ایران.',
		content: L.article([
			'تنوع اقلیم ایران یعنی تنوع گل‌ها، و تنوع گل‌ها یعنی عسل‌هایی با رنگ و طعم کاملاً متفاوت.',
			['ul', ['دامنه‌های زاگرس: گون و گیاهان کوهستانی', 'دامنه‌ی سبلان: آویشن و گل‌های وحشی', 'البرز: چهل‌گیاه و گل‌های بهاری', 'شیراز و جهرم: بهارنارنج', 'جنوب ایران: درختان کنار']],
			'به همین دلیل روی برچسب هر شیشه‌ی شهدینه، منطقه و ارتفاع زنبورستان را می‌نویسیم.',
		]),
	},
	{
		key: 'honey-breakfast', title: 'سه صبحانه با عسل که ارزش زود بیدار شدن دارند', slug: 'honey-breakfast-ideas', image: 'journal-6', terms: ['cat-kitchen'], days_ago: 35,
		excerpt: 'نان سنگک داغ و کره را می‌دانید؛ این سه را هم امتحان کنید.',
		content: L.article([
			['h3', 'ماست، گردو و عسل آویشن'],
			'یک کاسه ماست پرچرب، مشتی گردوی تازه و یک قاشق عسل آویشن. عطر آویشن با ترشی ماست عالی جور می‌شود.',
			['h3', 'پنیر لیقوان و عسل گون'],
			'ترکیب شور و شیرین قدیمی آذربایجان؛ عسل ملایم گون طعم پنیر را نمی‌پوشاند.',
			['h3', 'موم عسل روی نان داغ'],
			'یک تکه عسل موم‌دار روی نان تازه‌ی تنوری؛ موم را بجوید و صبحانه‌ای یادتان بماند.',
		]),
	},
];

/* ---------------- Shared blocks ---------------- */

const QUOTES = [
	{ quote: 'عسل گون را برای پدرم گرفتم که سال‌ها زنبوردار بود. اولین قاشق را که خورد گفت «این را از کندو آورده‌اند، نه از کارخانه».', name: 'فرناز موسوی', role: 'اصفهان' },
	{ quote: 'برگه‌ی آزمایش همراه هر شیشه برای من کافی بود. دیگر لازم نیست به حرف فروشنده اعتماد کنم.', name: 'سینا رحمانی', role: 'تهران' },
	{ quote: 'بسته‌بندی آن‌قدر محکم بود که تا شیراز یک قطره هم بیرون نزد. عسل آویشنش هم فوق‌العاده است.', name: 'مهسا کریمی', role: 'شیراز' },
];

const FAQ = [
	['از کجا بفهمم عسل طبیعی است؟', 'مطمئن‌ترین راه آزمایش است؛ برای همین برگه‌ی آزمایش هر برداشت روی صفحه‌ی همان محصول و داخل جعبه است. ساکارز، رطوبت و HMF در این برگه آمده‌اند.'],
	['چرا عسلم شکرک زده؟ یعنی تقلبی است؟', 'نه. شکرک زدن ویژگی طبیعی بیشتر عسل‌هاست، به‌خصوص در هوای سرد. شیشه را در ظرف آب ولرم (کمتر از ۴۰ درجه) بگذارید تا دوباره روان شود.'],
	['عسل را چطور نگه دارم؟', 'در ظرف دربسته، دور از نور مستقیم و در دمای اتاق. یخچال لازم نیست و شکرک زدن را سریع‌تر می‌کند.'],
	['ارسال چقدر طول می‌کشد؟', 'سفارش‌های تهران تا ۲۴ ساعت و شهرهای دیگر دو تا چهار روز کاری می‌رسند. همه‌ی شیشه‌ها در جعبه‌ی ضدضربه ارسال می‌شوند.'],
	['اگر راضی نبودم چه؟', 'تا هفت روز پس از دریافت، حتی اگر در شیشه را باز کرده باشید، مبلغ کامل را برمی‌گردانیم.'],
];

const PROCESS = [
	{ eyebrow: 'قدم اول', title: 'کندوهای کوهستان', text: 'زنبوردارهای همکار کندوها را در ارتفاع بالای ۲۰۰۰ متر و دور از مزارع سم‌پاشی‌شده نگه می‌دارند. زنبورها در فصل برداشت از گل‌های وحشی تغذیه می‌کنند، نه از شربت شکر.', points: 'ارتفاع بالای ۲۰۰۰ متر\nبدون تغذیه‌ی شکر در فصل برداشت\nبازدید سالانه از هر زنبورستان', image: img('process-1'), btn_text: 'زنبوردارها', btn_link: link('{{page:beekeepers}}'), tone: '' },
	{ eyebrow: 'قدم دوم', title: 'برداشت در زمان درست', text: 'قاب‌ها فقط وقتی برداشت می‌شوند که زنبورها روی سلول‌ها را با موم پوشانده‌اند؛ یعنی عسل رسیده و رطوبتش پایین است.', points: 'برداشت از قاب‌های سرپوشیده\nاستخراج سرد، بدون حرارت\nصاف کردن با توری، بدون فیلتر صنعتی', image: img('process-2'), btn_text: 'درباره‌ی برداشت', btn_link: link('{{post:harvest-time}}'), tone: 'inverse' },
	{ eyebrow: 'قدم سوم', title: 'آزمایش و شیشه', text: 'از هر برداشت نمونه به آزمایشگاه معتمد می‌رود. فقط عسلی که از استاندارد ملی بهتر باشد شیشه می‌شود.', points: 'آزمایش ساکارز، رطوبت و HMF\nشیشه‌ی شیشه‌ای، نه پلاستیک\nبرگه‌ی آزمایش داخل هر جعبه', image: img('process-3'), btn_text: 'نتایج آزمایش', btn_link: link('{{page:about}}#lab'), tone: 'accent' },
];

const LAB = () => L.counters([
	{ value: 1.8, suffix: '٪', label: 'ساکارز', desc: 'حد مجاز: ۵٪' },
	{ value: 16.4, suffix: '٪', label: 'رطوبت', desc: 'حد مجاز: ۲۰٪' },
	{ value: 6, label: 'HMF', desc: 'میلی‌گرم در کیلو؛ حد مجاز: ۴۰' },
	{ value: 0, label: 'شکر افزوده', desc: 'در هیچ برداشتی' },
], { style: 'cards', columns: '2' });

const perks = () => L.features([
	{ icon: 'flask', title: 'آزمایش هر برداشت', text: 'برگه‌ی آزمایش داخل هر جعبه.' },
	{ icon: 'mountain', title: 'مستقیم از زنبوردار', text: 'نام زنبوردار روی برچسب.' },
	{ icon: 'truck', title: 'ارسال رایگان', text: 'برای خرید بالای ۲ میلیون تومان.' },
	{ icon: 'refresh', title: 'هفت روز بازگشت', text: 'حتی با در باز.' },
], { layout: 'grid', style: 'plain', columns: '4', icon_style: 'tile' });

const newsletter = (title = 'وقتی برداشت تازه رسید،\n*اول به شما* می‌گوییم', desc = 'فصلی یک نامه؛ با خبر برداشت‌های تازه و پیش‌فروش عسل موم‌دار.') => L.cta({
	eyebrow: 'خبرنامه', title, desc,
	action: 'email', email_placeholder: 'ایمیل شما', email_button: 'خبرم کنید', note: 'فصلی یک ایمیل؛ هر وقت خواستید لغو کنید.',
	look: 'image', image: img('apiary'), decor: '', rounded: '',
});

const TABS = [
	{ title: 'عسل گون', subtitle: 'روشن و لطیف', meta: '۰۱', image: img('p-gavan'), panel_title: 'سفید طلایی، با شیرینی ملایم', panel_text: 'از شهد گیاه گون در ارتفاعات زاگرس؛ رنگ روشن، عطر ملایم و شیرینی کم. برای کسانی که عسل را با قاشق می‌خورند.', chips: 'ملایم، روشن، شکرک دیر', btn_text: 'خرید عسل گون', btn_link: link('{{product:gavan-honey}}') },
	{ title: 'عسل آویشن', subtitle: 'معطر و گرم', meta: '۰۲', image: img('p-thyme'), panel_title: 'عطر کوهستان در یک قاشق', panel_text: 'طعمی گرم و عطری تند؛ همراه چای، برای صبحانه‌های زمستانی یا با پنیر محلی.', chips: 'معطر، کهربایی، برای چای', btn_text: 'خرید عسل آویشن', btn_link: link('{{product:thyme-honey}}') },
	{ title: 'عسل کُنار', subtitle: 'تیره و پرطعم', meta: '۰۳', image: img('p-sidr'), panel_title: 'عسل جنوب، با طعمی عمیق', panel_text: 'از درختان کنار جنوب ایران؛ رنگی تیره، طعمی کاراملی و قوام بالا.', chips: 'تیره، کاراملی، پرقوام', btn_text: 'خرید عسل کنار', btn_link: link('{{product:sidr-honey}}') },
	{ title: 'عسل بهارنارنج', subtitle: 'گل‌دار و روشن', meta: '۰۴', image: img('p-orange'), panel_title: 'اردیبهشت شیراز، در شیشه', panel_text: 'از شکوفه‌های نارنج باغ‌های شیراز و جهرم؛ عطری که ماه‌ها در عسل می‌ماند.', chips: 'گل‌دار، طلایی روشن، برای دسر', btn_text: 'خرید عسل بهارنارنج', btn_link: link('{{product:orange-blossom-honey}}') },
];

/* ---------------- Home ---------------- */

const home = [
	L.bleed(L.w('hm-hero', {
		layout: 'split', title_tag: 'h1', title_size: 'xl', header_align: 'start', title_reveal: 'words',
		eyebrow: 'شهدینه · عسل طبیعی کوهستان',
		title: 'عسل کوهستان،\nهمان‌طور که\n*زنبور ساخته*',
		desc: 'از دوازده خانواده‌ی زنبوردار در زاگرس، سبلان و البرز؛ بدون حرارت، بدون شکر و با برگه‌ی آزمایش برای هر برداشت.',
		btn1_text: 'خرید عسل', btn1_link: link(shopUrl), btn1_style: 'primary',
		btn2_text: 'کدام عسل؟', btn2_link: link('{{page:guide}}'), btn2_style: 'secondary',
		stats: [
			{ value: '۱۲', label: 'خانواده‌ی زنبوردار' },
			{ value: '۰٪', label: 'شکر افزوده' },
			{ value: '۲۴ ساعت', label: 'ارسال در تهران' },
		],
		media_type: 'image', image: img('hero'), media_ratio: 'landscape', height: 'auto', decor: '', hint: '',
	})),
	section({ space: 'sm', gap: 0 }, [perks()]),
	section({ space: 'md', gap: 32, cards: 'cascade' }, [
		L.productCategories(['honey', 'comb-honey', 'bee-products', 'gifts'], { eyebrow: 'دسته‌ها', title: 'از کندو *تا سفره*' }),
	]),
	section({ space: 'md', gap: 32 }, [
		L.productCarousel({ eyebrow: 'پرفروش‌ها', title: 'عسل‌های *این فصل*', source: 'featured', more_text: 'همه‌ی محصولات', more_link: link(shopUrl) }),
	]),
	section({ space: 'none', gap: 0, zoom: 'expand', zoomAmount: 0.24, zoomInner: true, zoomRadius: 8 }, [
		L.imageReveal('comb', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	fx(section({ space: 'md', gap: 32, width: 1000 }, [
		L.textScrub('برای یک کیلو عسل، زنبورها *میلیون‌ها گل* را می‌گردند. ما فقط صبر می‌کنیم تا کارشان تمام شود: برداشت از قاب‌های *سرپوشیده*، استخراج سرد و شیشه، بی‌هیچ میان‌بُری.', { eyebrow: 'چرا شهدینه', size: 'md' }),
	]), { tone: 'surface' }),
	section({ space: 'md', gap: 32 }, [
		heading({ eyebrow: 'از کندو تا خانه', title: 'سه قدم،\n*بدون میان‌بُر*' }),
		L.stack(PROCESS),
	]),
	section({ space: 'md', gap: 40 }, [L.tabs(TABS, { autoplay: 7, media_side: 'start' })]),
	fx(section({ space: 'md', gap: 48 }, [
		cols({ widths: [45, 55], gap: 64, align: 'center' }, [
			[heading({ eyebrow: 'آزمایش هر برداشت', title: 'عددها\n*دروغ نمی‌گویند*', desc: 'میانگین نتایج برداشت تابستان امسال، کنار حد مجاز استاندارد ملی.' }), button('همه‌ی نتایج', '{{page:about}}', 'secondary')],
			[LAB()],
		]),
	]), { tone: 'inverse', cards: 'cascade' }),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'از زبان خریداران', title: 'طعمی که *یادشان مانده*', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'دفترچه‌ی عسل', title: 'خواندنی‌هایی درباره‌ی *عسل و زنبور*' })],
			[button('همه‌ی نوشته‌ها', '{{blog}}', 'secondary', { _flex_align_self: 'flex-end' })],
		]),
		L.posts({ count: 3, layout: 'grid', columns: '3', excerpt: 'yes' }),
	]),
	newsletter(),
];

/* ---------------- Home, second version ---------------- */

const home2 = [
	L.slider([
		{ image: img('apiary'), eyebrow: 'شهدینه', title: 'شیرین،\n*بی‌واسطه*', text: 'عسل طبیعی کوهستان، مستقیم از زنبوردار به خانه‌ی شما.', btn_text: 'فروشگاه', url: shopUrl },
		{ image: img('comb'), eyebrow: 'عسل موم‌دار', title: 'همان‌طور که\n*از کندو آمده*', text: 'قاب کامل موم و عسل، در جعبه‌ی چوبی.', btn_text: 'عسل موم‌دار', url: '{{product:comb-honey}}' },
		{ image: img('hero'), eyebrow: 'جعبه‌ی چشیدنی', title: 'سه عسل،\n*سه طعم*', text: 'گون، آویشن و کنار؛ برای آشنایی یا هدیه.', btn_text: 'جعبه‌ی چشیدنی', url: '{{product:tasting-set}}' },
	]),
	section({ space: 'md', gap: 32 }, [
		L.productCarousel({ eyebrow: 'قفسه‌ی شهدینه', title: 'همه‌ی *عسل‌ها*', layout: 'grid', columns: '4', count: 8, more_text: 'فروشگاه', more_link: link(shopUrl) }),
	]),
	fx(section({ space: 'md', gap: 32 }, [
		L.productCategories(['honey', 'comb-honey', 'bee-products', 'gifts'], { eyebrow: 'دسته‌ها', title: 'خرید بر اساس *دسته*', style: 'circle' }),
	]), { tone: 'soft', cards: 'spread' }),
	section({ space: 'md', gap: 32 }, [
		L.productDeal({ eyebrow: 'پیشنهاد این هفته', title: 'جعبه‌ی *چشیدنی*', desc: 'سه شیشه‌ی کوچک گون، آویشن و کنار؛ با کارت راهنمای چشیدن.', ids: '{{ids:tasting-set}}' }),
	]),
	section({ space: 'sm', gap: 0 }, [
		L.con({ content_width: 'full', css_classes: 'hm-scheme-inverse', padding: L.pad(48, 48, 40) }, [
			L.counters([
				{ value: 12, label: 'خانواده‌ی زنبوردار' },
				{ value: 2400, label: 'متر، بالاترین زنبورستان' },
				{ value: 31, suffix: ' هزار', label: 'شیشه‌ی فروخته‌شده' },
				{ value: 0, label: 'شکر افزوده' },
			], { style: 'plain', columns: '4' }),
		], true),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'درباره‌ی *عسل واقعی*' }), button('همه‌ی پرسش‌ها', '{{page:faq}}', 'secondary')],
			[L.faq(FAQ.slice(0, 4), { style: 'lines' })],
		]),
	]), { tone: 'surface' }),
	newsletter(),
];

/* ---------------- Story ---------------- */

const about = [
	L.pageHead('داستان شهدینه', 'از کندوهای\n*پدربزرگ*', 'پدربزرگ من چهل سال در دامنه‌ی سبلان زنبورداری کرد. هر تابستان چند شیشه عسل برای ما به تهران می‌فرستاد و هر بار که از عسل مغازه‌ها حرف می‌زدیم، فقط می‌خندید. شهدینه از همان خنده شروع شد. — نگار صدری، بنیان‌گذار'),
	section({ space: 'sm', zoom: 'expand', zoomAmount: 0.2, zoomInner: true, zoomRadius: 8 }, [
		L.imageReveal('apiary', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	section({ space: 'md', gap: 48 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'امروز', title: 'عسل خوب\n*اسم و نشانی* دارد' })],
			[L.textScrub('امروز با *دوازده خانواده‌ی زنبوردار* کار می‌کنیم. بیشتر مبلغ هر شیشه مستقیم به دست خودشان می‌رسد و نامشان روی برچسب است؛ چون عسل خوب، *اسم و نشانی* دارد.', { size: 'md' })],
		]),
	]),
	L.fx(L.section({ space: 'md', gap: 48, cls: 'hm-honeycomb' }, [
		cols({ widths: [45, 55], gap: 64, align: 'center' }, [
			[heading({ eyebrow: 'آزمایش هر برداشت', title: 'عددها *دروغ نمی‌گویند*', desc: 'از هر برداشت نمونه‌ای به آزمایشگاه معتمد می‌فرستیم. این‌ها میانگین نتایج برداشت تابستان امسال‌اند، کنار حد مجاز استاندارد ملی.' })],
			[LAB()],
		]),
	]), { tone: 'surface', cards: 'cascade' }),
	section({ space: 'md', gap: 40, cards: 'cascade' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'تیم شهدینه', title: 'آدم‌های\n*پشت هر شیشه*' })],
			[L.features([
				{ icon: '', title: 'نگار صدری', text: 'بنیان‌گذار' },
				{ icon: '', title: 'گلاره امینی', text: 'آزمایش و کیفیت' },
				{ icon: '', title: 'رحیم آقازاده', text: 'زنبوردار، سبلان' },
				{ icon: '', title: 'موسی کیانی', text: 'زنبوردار، البرز' },
			], { layout: 'grid', style: 'plain', columns: '2', icon_style: 'plain' })],
		]),
	]),
	newsletter('یک شیشه،\n*یک داستان*', 'روی برچسب هر شیشه، نام زنبوردار و محل زنبورستان نوشته شده است. از برداشت‌های تازه باخبر شوید.'),
];
about[3].settings._element_id = 'lab';

/* ---------------- Beekeepers ---------------- */

const beekeepers = [
	L.pageHead('زنبوردارها', 'دوازده خانواده،\n*سه رشته‌کوه*', 'با هر خرید، بیشتر مبلغ مستقیم به دست زنبوردار می‌رسد. سه زنبورستانی که بیشترین عسل شهدینه از آن‌هاست، این‌جا معرفی شده‌اند.'),
	section({ space: 'md', gap: 32 }, [
		L.stack([
			{ eyebrow: 'سبلان · ۲۱۰۰ متر', title: 'زنبورستان آقازاده', text: 'رحیم آقازاده چهل سال است زنبورداری می‌کند؛ عسل آویشن و موم‌دار شهدینه از کندوهای اوست.', points: 'عسل آویشن\nعسل موم‌دار\nگرده‌ی گل', image: img('p-thyme'), btn_text: 'عسل‌های این زنبورستان', btn_link: link('{{product:thyme-honey}}'), tone: '' },
			{ eyebrow: 'زاگرس · ۲۴۰۰ متر', title: 'زنبورستان بختیاری‌ها', text: 'بلندترین زنبورستان ما؛ کندوها فقط سه ماه از سال در دامنه‌های پر از گون می‌مانند.', points: 'عسل گون\nبرداشت یک‌باره در سال', image: img('p-gavan'), btn_text: 'عسل گون', btn_link: link('{{product:gavan-honey}}'), tone: 'inverse' },
			{ eyebrow: 'البرز · ۱۸۰۰ متر', title: 'زنبورستان کیانی', text: 'موسی کیانی کندوها را با گل‌دهی دامنه جابه‌جا می‌کند؛ از گل‌های بهاری تا آویشن تابستان.', points: 'عسل چهل‌گیاه\nعسل بهاره', image: img('p-wild'), btn_text: 'عسل چهل‌گیاه', btn_link: link('{{product:wildflower-honey}}'), tone: 'accent' },
		]),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'همکاری', title: 'آنچه با زنبوردارها\n*قرار گذاشته‌ایم*', header_align: 'center' }),
		L.features([
			{ icon: 'heart', title: 'قیمت منصفانه', text: 'بیش از نیمی از قیمت هر شیشه به زنبوردار می‌رسد.' },
			{ icon: 'clock', title: 'پیش‌پرداخت', text: 'نیمی از مبلغ برداشت را پیش از فصل می‌پردازیم.' },
			{ icon: 'leaf', title: 'بدون سم و شکر', text: 'زنبورستان‌ها دور از مزارع سم‌پاشی‌شده‌اند.' },
			{ icon: 'flask', title: 'آزمایش مشترک', text: 'نتیجه‌ی هر آزمایش را با زنبوردار هم در میان می‌گذاریم.' },
		], { layout: 'grid', style: 'cards', columns: '4', icon_style: 'tile' }),
	]), { tone: 'surface', cards: 'flip' }),
	newsletter(),
];

/* ---------------- Guide ---------------- */

const guide = [
	L.pageHead('کدام عسل؟', 'هر گل،\n*طعمی دیگر*', 'انتخاب عسل بیشتر به سلیقه و مصرف شما بستگی دارد تا به «بهترین» بودن. این راهنما کمک می‌کند شیشه‌ی درست را پیدا کنید.'),
	section({ space: 'md', gap: 40 }, [L.tabs(TABS, { autoplay: 0, media_side: 'start' })]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'برای هر مصرف', title: 'کدام عسل *کجا*؟', header_align: 'center' }),
		L.features([
			{ icon: 'coffee', title: 'با چای', text: 'آویشن یا بهارنارنج؛ عطرشان در چای داغ بیشتر می‌شود.', meta: 'آویشن' },
			{ icon: 'sun', title: 'صبحانه', text: 'گون روی نان و کره؛ ملایم و لطیف.', meta: 'گون' },
			{ icon: 'heart', title: 'برای کودکان', text: 'چهل‌گیاه، با طعمی متعادل (برای بالای یک سال).', meta: 'چهل‌گیاه' },
			{ icon: 'fire', title: 'شیرینی‌پزی', text: 'کنار؛ طعم کاراملی‌اش در حرارت هم می‌ماند.', meta: 'کنار' },
		], { layout: 'grid', style: 'cards', columns: '4', icon_style: 'tile' }),
	]), { tone: 'surface', cards: 'cascade' }),
	section({ space: 'md', gap: 48 }, [
		cols({ widths: [50, 50], gap: 72, align: 'center' }, [
			[
				heading({ eyebrow: 'هنوز مطمئن نیستید؟', title: 'از جعبه‌ی *چشیدنی*\nشروع کنید', desc: 'سه شیشه‌ی کوچک گون، آویشن و کنار، با کارت راهنمای چشیدن. هر کدام را بیشتر دوست داشتید، شیشه‌ی بزرگش را بخرید.' }),
				button('جعبه‌ی چشیدنی', '{{product:tasting-set}}', 'primary'),
			],
			[fx(L.imageReveal('p-gift-b', { ratio: '1-1', reveal: 'none', parallax: px(0) }), { zoom: 'in', zoomAmount: 0.1, zoomInner: true })],
		]),
	]),
];

/* ---------------- Subscription ---------------- */

const subscription = [
	L.pageHead('اشتراک', 'هر ماه،\n*یک برداشت تازه*', 'هر ماه عسل تازه‌ترین برداشت را دریافت کنید؛ انتخاب نوع عسل با شماست و هر وقت خواستید متوقفش می‌کنید.'),
	fx(section({ space: 'md', gap: 40 }, [
		L.pricing([
			{ name: 'یک شیشه', desc: 'نیم کیلو در ماه', price: '۸۹۰٬۰۰۰', price_alt: '۸۰۰٬۰۰۰', unit: 'تومان', period: 'ماهانه', features: 'یک شیشه‌ی ۵۰۰ گرمی\nانتخاب نوع عسل با شما\nارسال رایگان', btn_text: 'شروع اشتراک', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
			{ name: 'خانواده', desc: 'دو کیلو در ماه', price: '۲٬۹۵۰٬۰۰۰', price_alt: '۲٬۶۵۰٬۰۰۰', unit: 'تومان', period: 'ماهانه', features: 'چهار شیشه‌ی ۵۰۰ گرمی\nترکیب دلخواه\nارسال رایگان و اولویت‌دار\nیک قاشق چوبی هدیه', btn_text: 'شروع اشتراک', btn_link: link('{{page:contact}}'), featured: 'yes', badge: 'محبوب‌ترین' },
			{ name: 'کافه و رستوران', desc: 'از پنج کیلو به بالا', price: 'توافقی', price_alt: 'توافقی', unit: '', period: '', features: 'بسته‌بندی عمده\nفاکتور رسمی\nارسال هفتگی', btn_text: 'تماس برای همکاری', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
		], { switch_off: 'پرداخت ماهانه', switch_on: 'پرداخت سه‌ماهه', switch_note: '۱۰٪ تخفیف' }),
	]), { cards: 'cascade' }),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'روند کار', title: 'از زنبورستان\n*تا در خانه*', header_align: 'center' }),
		L.steps([
			{ marker: '', icon: 'calendar', title: 'انتخاب', text: 'نوع عسل و دوره‌ی اشتراک را انتخاب کنید.' },
			{ marker: '', icon: 'mountain', title: 'برداشت', text: 'از تازه‌ترین برداشت همان ماه.' },
			{ marker: '', icon: 'flask', title: 'آزمایش', text: 'برگه‌ی آزمایش همراه بسته.' },
			{ marker: '', icon: 'truck', title: 'ارسال', text: 'هفته‌ی اول هر ماه، رایگان.' },
		], { layout: 'h', cards: 'yes' }),
	]), { tone: 'surface' }),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'درباره‌ی *اشتراک*' })],
			[L.faq([
				['می‌شود نوع عسل را هر ماه عوض کرد؟', 'بله؛ تا پنج روز پیش از ارسال، از حساب کاربری یا با یک پیام.'],
				['اگر سفر بودم؟', 'ارسال آن ماه را یک ماه عقب می‌اندازیم؛ هزینه‌ای ندارد.'],
				['لغو اشتراک چطور است؟', 'هر وقت بخواهید، بدون جریمه. پرداخت‌های سه‌ماهه به نسبت ماه‌های باقی‌مانده برمی‌گردند.'],
			], { style: 'lines' })],
		]),
	]),
];

/* ---------------- Corporate gifts ---------------- */

const GIFT_FORM = {
	need_label: 'هدیه', need_title: 'چه هدیه‌ای در نظر دارید؟', need_desc: 'هر چند گزینه که لازم است.',
	choices: [
		{ label: 'جعبه‌ی چشیدنی', note: 'سه شیشه‌ی کوچک', icon: 'gift' },
		{ label: 'شیشه‌ی تکی', note: 'با برچسب اختصاصی', icon: 'hexagon' },
		{ label: 'عسل موم‌دار', note: 'در جعبه‌ی چوبی', icon: 'grid' },
		{ label: 'هنوز نمی‌دانم', note: 'با هم انتخاب می‌کنیم', icon: 'compass' },
	],
	multi: 'yes',
	budget_on: 'yes', budget_label: 'تعداد', budget_title: 'حدود چند هدیه؟',
	budgets: 'تا ۵۰ عدد\n۵۰ تا ۳۰۰ عدد\nبیش از ۳۰۰ عدد',
	timeline_on: 'yes', timeline_title: 'برای چه مناسبتی؟',
	timelines: 'نوروز\nیلدا\nمناسبت دیگر',
	contact_label: 'تماس', contact_title: 'با چه کسی صحبت کنیم؟',
	show_name: 'yes', label_name: 'نام و نام خانوادگی',
	show_phone: 'yes', label_phone: 'شماره‌ی موبایل',
	show_email: 'yes', label_email: 'ایمیل', req_email: '',
	show_company: 'yes', label_company: 'نام شرکت', req_company: '',
	show_message: 'yes', label_message: 'توضیح بیشتر (کارت، لوگو، زمان تحویل)', req_message: '', consent: '',
	next_text: 'مرحله‌ی بعد', back_text: 'قبلی', submit_text: 'ارسال درخواست',
	done_title: 'درخواست شما رسید',
	done_text: 'ظرف یک روز کاری تماس می‌گیریم و نمونه‌ی بسته‌بندی را برایتان می‌فرستیم.',
	done_btn_text: 'بازگشت به فروشگاه', done_btn_link: link(shopUrl), done_btn_style: 'secondary',
	remember: 'yes', boxed: 'yes', columns: '2',
};

const gifts = [
	L.pageHead('هدیه‌ی سازمانی', 'هدیه‌ای که\n*یادشان می‌ماند*', 'برای نوروز، یلدا یا قدردانی از همکاران و مشتریان؛ عسل طبیعی در بسته‌بندی کرافت، با کارت و برچسب اختصاصی شما.'),
	section({ space: 'md', gap: 48 }, [
		cols({ widths: [50, 50], gap: 72, align: 'center' }, [
			[fx(L.imageReveal('p-gift', { ratio: '1-1', reveal: 'none', parallax: px(0) }), { zoom: 'out', zoomAmount: 0.1 })],
			[L.features([
				{ icon: 'pen', title: 'برچسب و کارت اختصاصی', text: 'با لوگو و پیام شما.' },
				{ icon: 'box', title: 'بسته‌بندی کرافت', text: 'بازیافتی، بی‌پلاستیک.' },
				{ icon: 'truck', title: 'ارسال به چند نشانی', text: 'فهرست نشانی‌ها را بدهید؛ بقیه با ما.' },
				{ icon: 'card', title: 'فاکتور رسمی', text: 'با کد اقتصادی.' },
			], { layout: 'list', style: 'plain', numbered: '', icon_style: 'tile' })],
		]),
	]),
	section({ space: 'md', gap: 40, width: 980 }, [
		heading({ eyebrow: 'درخواست', title: 'هدیه‌ها را *آماده کنیم*', header_align: 'center' }),
		L.leadForm(GIFT_FORM),
	]),
];

/* ---------------- Storage, shipping, FAQ, contact ---------------- */

const care = [
	L.pageHead('نگهداری عسل', 'عسل تقریباً\n*هیچ‌وقت خراب نمی‌شود*', 'به شرطی که این چند نکته را رعایت کنید.'),
	section({ space: 'md', gap: 40, cards: 'flip' }, [
		L.features([
			{ icon: 'lock', title: 'در را ببندید', text: 'عسل رطوبت هوا را جذب می‌کند و ترش می‌شود.', meta: 'همیشه' },
			{ icon: 'sun', title: 'دور از نور و گرما', text: 'کنار اجاق یا پشت پنجره نگذارید.', meta: 'مهم' },
			{ icon: 'drop', title: 'قاشق خشک', text: 'قاشق خیس، آب به شیشه می‌برد.', meta: 'همیشه' },
			{ icon: 'gauge', title: 'یخچال لازم نیست', text: 'سرما شکرک زدن را سریع‌تر می‌کند.', meta: 'دمای اتاق' },
			{ icon: 'fire', title: 'شکرک زد؟', text: 'شیشه را در آب ولرم زیر ۴۰ درجه بگذارید.', meta: 'آهسته' },
			{ icon: 'hexagon', title: 'عسل موم‌دار', text: 'در جعبه‌ی خودش و دور از گرما.', meta: 'تا یک سال' },
		], { layout: 'grid', style: 'cards', columns: '3', icon_style: 'tile' }),
	]),
];

const shipping = [
	L.pageHead('ارسال و مرجوعی', 'شیشه‌ها\n*سالم می‌رسند*', 'هر شیشه در جعبه‌ی ضدضربه و جداکننده‌ی مقوایی ارسال می‌شود.'),
	section({ space: 'md', gap: 40 }, [perks()]),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'ارسال', title: 'زمان و *هزینه*' })],
			[L.features([
				{ icon: '', title: 'تهران', text: 'پیک؛ تا ۲۴ ساعت.', meta: '۷۰ هزار تومان' },
				{ icon: '', title: 'شهرهای دیگر', text: 'پست پیشتاز؛ دو تا چهار روز کاری.', meta: '۱۲۰ هزار تومان' },
				{ icon: '', title: 'خرید بالای ۲ میلیون تومان', text: 'به همه‌ی شهرها.', meta: 'رایگان' },
			], { layout: 'list', style: 'plain', numbered: '', icon_style: 'plain' })],
		]),
	]), { tone: 'surface' }),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'مرجوعی', title: 'اگر *راضی نبودید*' })],
			[L.faq([FAQ[4], ['اگر شیشه شکسته برسد؟', 'عکسش را تا ۴۸ ساعت بفرستید؛ همان را دوباره و بی‌هزینه ارسال می‌کنیم.'], ['پول کی برمی‌گردد؟', 'ظرف سه روز کاری پس از رسیدن بسته، به همان کارتی که پرداخت کرده‌اید.']], { style: 'lines' })],
		]),
	]),
];

const faqPage = [
	L.pageHead('پرسش‌های متداول', 'درباره‌ی *عسل واقعی*', 'پاسخ پرسش‌هایی که بیشتر از همه می‌شنویم. اگر پرسشتان این‌جا نیست، پیام بدهید.'),
	section({ space: 'md', gap: 56 }, [
		cols({ widths: [30, 70], gap: 64 }, [
			[heading({ eyebrow: 'عسل', title: 'کیفیت و *نگهداری*', title_size: 'md' })],
			[L.faq(FAQ.slice(0, 3), { style: 'lines' })],
		]),
		cols({ widths: [30, 70], gap: 64 }, [
			[heading({ eyebrow: 'خرید', title: 'سفارش و *ارسال*', title_size: 'md' })],
			[L.faq([FAQ[3], FAQ[4], ['برای کودکان هم مناسب است؟', 'برای کودکان بالای یک سال بله؛ به کودکان زیر یک سال عسل ندهید.']], { style: 'lines', first_open: '' })],
		]),
	]),
];

const contact = [
	L.pageHead('تماس', 'سؤالی درباره‌ی\n*عسل* دارید؟', 'برای راهنمای خرید، سفارش عمده یا پیگیری ارسال پیام بدهید. هر روز از ۹ تا ۲۱ جواب می‌دهیم.'),
	section({ space: 'md' }, [
		cols({ widths: [40, 60], gap: 64 }, [
			[L.contactInfo([
				{ icon: 'whatsapp', label: 'واتس‌اپ و تلگرام', value: '۰۹۱۲ ۳۳۰ ۵۵۸۰', link: link('https://wa.me/989123305580', true) },
				{ icon: 'phone', label: 'تلفن', value: '۰۲۱-۲۲۰۵۴۱۳۰', link: link('tel:+982122054130') },
				{ icon: 'mail', label: 'ایمیل', value: 'salam@shahdineh.ir', link: link('mailto:salam@shahdineh.ir') },
				{ icon: 'pin', label: 'فروشگاه حضوری', value: 'تهران، تجریش، خیابان دربند، پلاک ۸۸', link: link('') },
				{ icon: 'clock', label: 'ساعت پاسخ‌گویی', value: 'هر روز، ۹ تا ۲۱', link: link('') },
			])],
			[L.contactForm({ show_phone: 'yes', label_phone: 'شماره‌ی موبایل', label_name: 'نام شما', label_email: 'ایمیل', label_message: 'پیام', button: 'ارسال پیام', success: 'پیامتان رسید؛ تا چند ساعت دیگر جواب می‌دهیم.' })],
		]),
	]),
];

/* ---------------- Package ---------------- */

const LIGHT = { light: 'start', extra: { hm_page_light_a: '#b0701a', hm_page_light_b: '#e9c46a' } };

const pages = [
	{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings(LIGHT) },
	{ key: 'home-2', title: 'خانه — نسخه‌ی دوم', slug: 'home-2', elementor: home2, settings: L.pageSettings({ header: 'transparent-light' }) },
	{ key: 'about', title: 'داستان ما', slug: 'about', elementor: about, settings: L.pageSettings() },
	{ key: 'beekeepers', title: 'زنبوردارها', slug: 'beekeepers', elementor: beekeepers, settings: L.pageSettings(LIGHT) },
	{ key: 'guide', title: 'کدام عسل؟', slug: 'honey-guide', elementor: guide, settings: L.pageSettings() },
	{ key: 'subscription', title: 'اشتراک', slug: 'subscription', elementor: subscription, settings: L.pageSettings() },
	{ key: 'gifts', title: 'هدیه‌ی سازمانی', slug: 'corporate-gifts', elementor: gifts, settings: L.pageSettings() },
	{ key: 'care', parent: 'faq', title: 'نگهداری عسل', slug: 'storing-honey', elementor: care, settings: L.pageSettings() },
	{ key: 'shipping', parent: 'faq', title: 'ارسال و مرجوعی', slug: 'shipping-and-returns', elementor: shipping, settings: L.pageSettings() },
	{ key: 'faq', title: 'پرسش‌های متداول', slug: 'faq', elementor: faqPage, settings: L.pageSettings() },
	{ key: 'contact', title: 'تماس', slug: 'contact', elementor: contact, settings: L.pageSettings() },
	{ key: 'blog', title: 'دفترچه‌ی عسل', slug: 'journal', content: '' },
];

module.exports = {
	manifest: {
		id: 'honey',
		order: 4,
		title: 'شهدینه',
		desc: 'فروشگاه عسل طبیعی؛ فروشگاه کامل با نُه محصول در چهار دسته، داستان و نتایج آزمایش، زنبوردارها، راهنمای انتخاب عسل، اشتراک ماهانه، هدیه‌ی سازمانی و دفترچه. کاغذ کرم، قهوه‌ای موم و کهربایی.',
		kit: 'honey',
		thumb: 'thumb.webp',
		required: ['elementor', 'woocommerce'],
		recommended: [],
		tags: ['فروشگاهی', 'محصولات طبیعی', 'خوراکی'],
		pages: pages.filter((p) => p.elementor).map((p) => p.title).concat(['فروشگاه', 'دفترچه‌ی عسل']),
	},
	content: {
		site: { title: 'شهدینه', tagline: 'عسل طبیعی کوهستان' },
		images, alts, terms, posts, products, pages,
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'شهدینه — صفحه‌ی اصلی' },
			{ key: 'tpl-home-2', type: 'page', page: 'home-2', title: 'شهدینه — صفحه‌ی اصلی، نسخه‌ی دوم' },
			{ key: 'tpl-guide', type: 'page', page: 'guide', title: 'شهدینه — راهنمای انتخاب عسل' },
			{ key: 'tpl-gifts', type: 'page', page: 'gifts', title: 'شهدینه — هدیه‌ی سازمانی' },
			{ key: 'tpl-stack', type: 'section', page: 'home', index: 6, title: 'شهدینه — از کندو تا خانه (کارت‌های پشته‌ای)' },
			{ key: 'tpl-lab', type: 'section', page: 'home', index: 8, title: 'شهدینه — نتایج آزمایش' },
			{ key: 'tpl-deal', type: 'section', page: 'home-2', index: 3, title: 'شهدینه — پیشنهاد هفته با شمارش معکوس' },
		],
		menus: [
			{
				name: 'شهدینه — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'فروشگاه', url: '{{shop}}', children: [
						{ title: 'عسل', term: 'pc-honey' },
						{ title: 'عسل موم‌دار', term: 'pc-comb' },
						{ title: 'فرآورده‌های زنبور', term: 'pc-bee' },
						{ title: 'هدیه', term: 'pc-gift' },
					] },
					{ title: 'کدام عسل؟', page: 'guide' },
					{ title: 'اشتراک', page: 'subscription' },
					{ title: 'زنبوردارها', page: 'beekeepers' },
					{ title: 'دفترچه', page: 'blog' },
					{
						title: 'راهنما', page: 'faq', children: [
							{ title: 'داستان ما', page: 'about' },
							{ title: 'هدیه‌ی سازمانی', page: 'gifts' },
							{ title: 'پرسش‌های متداول', page: 'faq' },
							{ title: 'نگهداری عسل', page: 'care' },
							{ title: 'ارسال و مرجوعی', page: 'shipping' },
							{ title: 'تماس', page: 'contact' },
						],
					},
				],
			},
			{
				name: 'شهدینه — پابرگ', location: 'footer', items: [
					{ title: 'فروشگاه', url: '{{shop}}' },
					{ title: 'اشتراک', page: 'subscription' },
					{ title: 'هدیه‌ی سازمانی', page: 'gifts' },
					{ title: 'نگهداری عسل', page: 'care' },
					{ title: 'ارسال و مرجوعی', page: 'shipping' },
					{ title: 'تماس', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 40,
			header_layout: 'split',
			header_cart: true,
			header_cta_text: '',
			font_body: 'iranyekan',
			font_heading: 'doran',
			font_heading_weight: '500',
			footer_about: 'شهدینه عسل طبیعی کوهستان را مستقیم از دوازده خانواده‌ی زنبوردار به خانه‌ی شما می‌رساند؛ با برگه‌ی آزمایش برای هر برداشت.',
			footer_copyright: 'تمام حقوق برای شهدینه محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }, { network: 'whatsapp', url: 'https://wa.me/989123305580' }],
			mobile_bar: true,
			mobile_bar_text: 'خرید عسل',
			mobile_bar_url: '{{shop}}',
			mobile_bar_whatsapp: '09123305580',
			magnetic: true,
			cursor: 'dot',
			sound_enabled: true,
			sound_default: true,
			sound_theme: 'glass',
			sound_volume: 30,
			sound_hover: false,
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 4, pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
