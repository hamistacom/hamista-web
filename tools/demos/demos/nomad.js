/**
 * Demo: Kooch — food and handwoven crafts from nomadic families (Nomad kit),
 * built as a complete shop: two home pages, the families, our story, the
 * season box, wholesale, summer trips, care, shipping, FAQ and contact;
 * eleven products in four categories.
 */
'use strict';

const L = require('../lib');
const { img, link, px, w, section, cols, heading, button, fx } = L;

const images = { logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp' };
['hero', 'camp', 'weaving', 'pattern', 'cat-food', 'cat-herbs', 'cat-woven', 'cat-box'].forEach((k) => { images[k] = 'images/' + k + '.webp'; });
['ghee', 'kashk', 'qurut', 'thyme', 'pennyroyal', 'gabbeh', 'gabbeh-indigo', 'cushion', 'socks', 'yarn', 'box'].forEach((k) => {
	images['p-' + k] = 'images/p-' + k + '.webp';
	images['p-' + k + '-b'] = 'images/p-' + k + '-b.webp';
});
for (let i = 1; i <= 6; i++) { images['journal-' + i] = 'images/journal-' + i + '.webp'; }

const alts = {
	hero: 'روغن حیوانی، کشک، قره‌قروت، آویشن و کلاف پشم روی پارچه‌ی کتان کنار یک گبه',
	camp: 'سیاه‌چادرهای عشایر و گله در دامنه‌ی زاگرس، نزدیک غروب',
	weaving: 'کلاف‌های پشم رنگ‌شده با روناس، پوست گردو، نیل و اسپرک روی میز چوبی',
	pattern: 'نقش گلیم با لوزی‌های پله‌ای روناسی و نیلی',
};

const shopUrl = '{{shop}}';

/* ---------------- Catalogue ---------------- */

const terms = [
	{ key: 'pc-food', taxonomy: 'product_cat', name: 'خوراکی‌ها', slug: 'nomad-food', image: 'cat-food', description: 'روغن حیوانی، کشک و قره‌قروت؛ همان دستور قدیمی.' },
	{ key: 'pc-herbs', taxonomy: 'product_cat', name: 'گیاهان کوهی', slug: 'mountain-herbs', image: 'cat-herbs', description: 'چیده‌شده در ییلاق، خشک‌شده در سایه.' },
	{ key: 'pc-woven', taxonomy: 'product_cat', name: 'دست‌بافته‌ها', slug: 'handwoven', image: 'cat-woven', description: 'گبه، گلیم، جوراب و کلاف پشم با رنگ گیاهی.' },
	{ key: 'pc-box', taxonomy: 'product_cat', name: 'جعبه‌ی فصل', slug: 'season-box', image: 'cat-box', description: 'هر فصل، تازه‌ترین محصولات ییلاق در یک جعبه.' },
	{ key: 'cat-life', taxonomy: 'category', name: 'زندگی ایل', slug: 'nomadic-life' },
	{ key: 'cat-craft', taxonomy: 'category', name: 'دست‌بافته‌ها', slug: 'crafts' },
	{ key: 'cat-food', taxonomy: 'category', name: 'خوراک', slug: 'food' },
];

const product = (key, title, slug, price, sku, image, terms_, extra, excerpt, paragraphs, specs) => Object.assign({
	key, title, slug, price, sku, image, gallery: [image + '-b'], terms: terms_, excerpt, stock: 30, weight: 0.5,
	content: L.productBody(paragraphs, specs),
}, extra);

const products = [
	product('ghee', 'روغن حیوانی', 'ghee', 2450000, 'KC-GHEE-900', 'p-ghee', ['pc-food'], { featured: true, weight: 1, attributes: [{ name: 'وزن', options: ['۹۰۰ گرم'] }, { name: 'ایل', options: ['قشقایی'] }] },
		'روغن زرد از کره‌ی شیر گوسفند ییلاق، جوشیده روی آتش هیزم؛ ۹۰۰ گرم.',
		['این روغن از کره‌ی شیر گوسفندانی است که در ییلاق‌های فارس می‌چرند. کره را روی آتش آرام هیزم می‌جوشانند تا آبش بخار شود و روغنی زرد و خوش‌عطر بماند.', 'برای پلو، حلوا و هر غذایی که بوی خانه‌ی مادربزرگ را می‌خواهد.'],
		[['وزن خالص', '۹۰۰ گرم'], ['ماندگاری', 'شش ماه در دمای اتاق، یک سال در یخچال'], ['خانواده', 'کشکولی، فیروزآباد'], ['افزودنی', 'ندارد']]),
	product('kashk', 'کشک محلی گلوله‌ای', 'kashk', 690000, 'KC-KASHK-500', 'p-kashk', ['pc-food'], { featured: true, weight: 0.6, attributes: [{ name: 'وزن', options: ['۵۰۰ گرم'] }] },
		'کشک خشک‌شده در آفتاب ییلاق؛ ترش و پرطعم، بدون نمک اضافه.',
		['کشک گلوله‌ای از دوغ همان شیری است که روغن از آن گرفته می‌شود. گلوله‌ها را با دست می‌سازند و زیر آفتاب ییلاق خشک می‌کنند.', 'برای کشک بادمجان و آش، چند ساعت در آب ولرم خیس کنید و بسایید.'],
		[['وزن خالص', '۵۰۰ گرم'], ['نمک افزوده', 'ندارد'], ['ماندگاری', 'یک سال در جای خشک']]),
	product('qara-qurut', 'قره‌قروت', 'qara-qurut', 520000, 'KC-QARA-300', 'p-qurut', ['pc-food'], { weight: 0.4, attributes: [{ name: 'وزن', options: ['۳۰۰ گرم'] }] },
		'قرص‌های تیره و ترش، از جوشاندن آرام آب کشک.',
		['قره‌قروت از جوشاندن طولانی آب کشک به دست می‌آید تا غلیظ و تیره شود. بعد آن را قرص می‌کنند و در سایه خشک می‌کنند.', 'ترش و پرطعم؛ برای خوردن، یا افزودن به آش و خورش.'],
		[['وزن خالص', '۳۰۰ گرم'], ['افزودنی', 'ندارد'], ['ماندگاری', 'یک سال در جای خشک']]),
	product('wild-thyme', 'آویشن کوهی', 'wild-thyme', 320000, 'KC-THYME-100', 'p-thyme', ['pc-herbs'], { featured: true, weight: 0.15, attributes: [{ name: 'وزن', options: ['۱۰۰ گرم'] }] },
		'چیده‌شده در اوج گلدهی در ییلاق سمیرم، خشک‌شده در سایه.',
		['آویشن کوهی ییلاق سمیرم را صبح زود و در اوج گلدهی می‌چینند و زیر سایه‌ی چادر خشک می‌کنند تا عطرش بماند.', 'برای دمنوش، روی ماست یا در خوراک‌ها.'],
		[['وزن خالص', '۱۰۰ گرم'], ['ارتفاع ییلاق', '۲۶۰۰ متر'], ['بسته‌بندی', 'پاکت کرافت زیپ‌دار']]),
	product('pennyroyal', 'پونه‌ی کوهی', 'pennyroyal', 280000, 'KC-PUNE-80', 'p-pennyroyal', ['pc-herbs'], { weight: 0.3, attributes: [{ name: 'وزن', options: ['۸۰ گرم'] }] },
		'پونه‌ی کنار چشمه‌های ییلاق، پیش از گل چیده‌شده؛ در شیشه.',
		['پونه را کنار چشمه‌ها و پیش از گل دادن می‌چینند، وقتی برگ‌ها بیشترین عطر را دارند.', 'برای دوغ، ماست و آش؛ یا دمنوشی سبک بعد از غذا.'],
		[['وزن خالص', '۸۰ گرم'], ['بسته‌بندی', 'شیشه با درب فلزی'], ['خانواده', 'شش‌بلوکی، سمیرم']]),
	product('gabbeh-rug', 'گبه‌ی روناسی', 'gabbeh-rug', 18500000, 'KC-GAB-0912', 'p-gabbeh', ['pc-woven'], { featured: true, stock: 1, weight: 4, attributes: [{ name: 'ابعاد', options: ['۹۰ × ۱۲۰ سانتی‌متر'] }, { name: 'بافنده', options: ['خانواده‌ی دره‌شوری'] }] },
		'گبه‌ی ۹۰ در ۱۲۰ با زمینه‌ی روناسی و ترنج پله‌ای؛ پشم و رنگ گیاهی.',
		['این گبه را زنان خانواده‌ی دره‌شوری در طول یک زمستان بافته‌اند؛ بدون نقشه و با پشم گوسفندان خود ایل.', 'رنگ قرمز از ریشه‌ی روناس، آبی از نیل و زرد از اسپرک است. نوارهای کم‌رنگ و پررنگ زمینه، که به آن «ابرش» می‌گویند، نشانه‌ی رنگرزی دستی است.'],
		[['ابعاد', '۹۰ × ۱۲۰ سانتی‌متر'], ['جنس', 'پشم دست‌ریس'], ['رنگ', 'گیاهی'], ['تعداد', 'یکتا']]),
	product('gabbeh-indigo', 'گبه‌ی نیلی', 'indigo-gabbeh', 21800000, 'KC-GAB-1015', 'p-gabbeh-indigo', ['pc-woven'], { stock: 1, weight: 5, attributes: [{ name: 'ابعاد', options: ['۱۰۰ × ۱۵۰ سانتی‌متر'] }, { name: 'بافنده', options: ['خانواده‌ی دره‌شوری'] }] },
		'زمینه‌ی نیلی با ترنج اسپرکی؛ گبه‌ای آرام برای اتاق کار یا خواب.',
		['نیل رنگی است که با هر بار غوطه‌ور شدن پشم در خم، عمیق‌تر می‌شود. زمینه‌ی این گبه سه بار رنگ خورده است.', 'پشت گبه، نام بافنده و سال بافت دوخته شده است.'],
		[['ابعاد', '۱۰۰ × ۱۵۰ سانتی‌متر'], ['جنس', 'پشم دست‌ریس'], ['رنگ', 'گیاهی'], ['تعداد', 'یکتا']]),
	product('kilim-cushion', 'کوسن گلیمی', 'kilim-cushion', 1950000, 'KC-CUSH-45', 'p-cushion', ['pc-woven'], { sale_price: 1690000, stock: 12, weight: 0.7, attributes: [{ name: 'ابعاد', options: ['۴۵ × ۴۵ سانتی‌متر'] }] },
		'روکش گلیم دستباف با لوزی‌های پله‌ای، همراه با بالشتک پر.',
		['روکش این کوسن یک تکه گلیم دستباف است با نقش «چشم» که در گلیم‌های قشقایی بسیار دیده می‌شود.', 'پشت روکش از کتان ضخیم است و زیپ پنهان دارد.'],
		[['ابعاد', '۴۵ × ۴۵ سانتی‌متر'], ['رو', 'گلیم پشمی'], ['پشت', 'کتان'], ['شست‌وشو', 'خشک‌شویی']]),
	product('wool-socks', 'جوراب پشمی دستباف', 'wool-socks', 780000, 'KC-SOCK-M', 'p-socks', ['pc-woven'], { stock: 25, weight: 0.2, attributes: [{ name: 'سایز', options: ['۳۸ تا ۴۰', '۴۱ تا ۴۳'] }] },
		'جوراب گرم زمستانی با نقش لوزی و زیگزاگ، از پشم دست‌ریس.',
		['جوراب‌های پشمی را زنان ایل در شب‌های زمستان قشلاق می‌بافند. نقش لوزی و زیگزاگ را از روی گلیم‌ها برمی‌دارند.', 'پشم طبیعی گرم است، رطوبت را دفع می‌کند و بو نمی‌گیرد. با آب سرد و دست بشویید.'],
		[['جنس', 'پشم دست‌ریس'], ['شست‌وشو', 'با دست، آب سرد'], ['خشک کردن', 'پهن روی حوله']]),
	product('wool-yarn', 'کلاف پشم رنگ گیاهی', 'naturally-dyed-yarn', 460000, 'KC-YARN-100', 'p-yarn', ['pc-woven'], { stock: 40, weight: 0.12, attributes: [{ name: 'رنگ', options: ['روناسی', 'گردویی', 'نیلی', 'اسپرکی'] }, { name: 'وزن', options: ['۱۰۰ گرم'] }] },
		'پشم دست‌ریس با رنگ روناس، پوست گردو، نیل یا اسپرک؛ برای بافتنی.',
		['همان پشمی که گبه‌ها با آن بافته می‌شوند، حالا برای بافتنی‌های شما. هر کلاف را در خم‌های رنگ ایل رنگ کرده‌ایم.', 'رنگ کلاف‌ها از یک خم تا خم دیگر کمی فرق دارد؛ اگر برای یک کار چند کلاف لازم دارید، همه را با هم سفارش دهید.'],
		[['وزن', '۱۰۰ گرم'], ['طول تقریبی', '۱۸۰ متر'], ['میل پیشنهادی', 'شماره‌ی ۴ تا ۵']]),
	product('season-box', 'جعبه‌ی فصل', 'season-box', 4200000, 'KC-BOX-FAM', 'p-box', ['pc-box'], { featured: true, sale_price: 3780000, stock: 50, weight: 3, attributes: [{ name: 'اندازه', options: ['خانواده (سه تا پنج نفر)'] }] },
		'روغن، کشک، قره‌قروت و گیاه کوهی؛ تازه‌ترین محصولات فصل در یک جعبه.',
		['جعبه‌ی فصل را هر سه ماه یک بار، با تازه‌ترین محصول ییلاق یا قشلاق می‌بندیم. در هر جعبه یادداشتی از خانواده‌ای هست که محصولات را ساخته‌اند.', 'محتوای جعبه با فصل عوض می‌شود؛ فهرست هر فصل را در صفحه‌ی جعبه‌ی فصل ببینید.'],
		[['محتوا', 'یک کیلو روغن، کشک، قره‌قروت، دو بسته گیاه کوهی'], ['ارسال', 'رایگان به همه‌ی شهرها'], ['بسته‌بندی', 'جعبه‌ی مقوایی بازیافتی']]),
];

/* ---------------- Journal ---------------- */

const posts = [
	{
		key: 'spring-migration', title: 'کوچ بهاره: سه هفته در راه ییلاق', slug: 'spring-migration', image: 'journal-1', terms: ['cat-life'], days_ago: 4,
		excerpt: 'مسیری که هر سال تکرار می‌شود، اما هیچ سالی شبیه سال قبل نیست.',
		content: L.article([
			'اواخر فروردین، وقتی گرمای قشلاق شروع می‌شود، چادرها جمع می‌شوند و ایل راه می‌افتد. مسیر کوچ از فیروزآباد تا ییلاق‌های سمیرم حدود سه هفته طول می‌کشد.',
			['h', 'یک روز کوچ'],
			'روز پیش از طلوع آفتاب شروع می‌شود. بار را روی چهارپایان می‌بندند، گله جلو می‌رود و خانواده پشت سرش. نزدیک ظهر، کنار چشمه‌ای اتراق می‌کنند تا گرما بگذرد.',
			['q', 'کوچ فقط جابه‌جایی نیست؛ تقویم زندگی ماست. هر چیزی که می‌سازیم، به زمان کوچ بستگی دارد.', 'بهمن دره‌شوری'],
			'امروز بخشی از مسیر با کامیون طی می‌شود، اما خانواده‌های همکار ما هنوز بخش کوهستانی را پیاده می‌روند.',
		]),
	},
	{
		key: 'kilim-motifs', title: 'معنای نقش‌های گلیم و گبه', slug: 'meaning-of-kilim-motifs', image: 'journal-2', terms: ['cat-craft'], days_ago: 10,
		excerpt: 'لوزی، درخت زندگی، شیر و شانه؛ هر نقش حرفی دارد.',
		content: L.article([
			'بافنده‌های عشایر بدون نقشه می‌بافند، اما نقش‌ها تصادفی نیستند. بسیاری از آن‌ها نسل به نسل منتقل شده‌اند و معنایی دارند.',
			['ul', ['لوزی: نماد زمین، چشمه یا گاهی چشم نگهبان', 'درخت زندگی: باروری و ادامه‌ی نسل', 'شیر: شجاعت و نگهبانی از خانه', 'شانه: پاکیزگی و نظم']],
			'هر بافنده این نقش‌ها را به شیوه‌ی خودش می‌بافد؛ برای همین دو گبه هیچ‌وقت شبیه هم نیستند.',
		]),
	},
	{
		key: 'making-ghee', title: 'روغن حیوانی را چطور می‌سازند', slug: 'how-ghee-is-made', image: 'journal-3', terms: ['cat-food'], days_ago: 15,
		excerpt: 'از دوغ زدن در مشک تا جوشاندن آرام روی آتش هیزم.',
		content: L.article([
			['ol', ['شیر گوسفند را می‌جوشانند و ماست می‌کنند.', 'ماست را با آب در مشک می‌ریزند و ساعت‌ها تکان می‌دهند تا کره جدا شود.', 'کره را روی آتش آرام هیزم می‌جوشانند تا آبش بخار شود و روغن زرد و شفاف بماند.', 'روغن را صاف می‌کنند و در شیشه می‌ریزند؛ روغن کوچ ساده و بدون افزودنی است.']],
			'از هر ده لیتر شیر، کمتر از نیم کیلو روغن به دست می‌آید. برای همین روغن حیوانی واقعی گران است.',
		]),
	},
	{
		key: 'mountain-herbs', title: 'گیاهان ییلاق: کِی بچینیم، چطور خشک کنیم', slug: 'mountain-herbs', image: 'journal-4', terms: ['cat-food'], days_ago: 21,
		excerpt: 'آویشن در اوج گلدهی، پونه پیش از گل؛ و همیشه در سایه.',
		content: L.article([
			'عطر گیاهان کوهی به زمان چیدن بستگی دارد. آویشن را در اوج گلدهی و صبح زود، پیش از گرمای آفتاب، می‌چینند.',
			'گیاهان را هرگز زیر آفتاب مستقیم خشک نمی‌کنند؛ آفتاب رنگ و عطرشان را می‌برد. زیر سایه‌ی چادر و در جریان باد، در چند روز خشک می‌شوند.',
		]),
	},
	{
		key: 'natural-dyes', title: 'روناس، پوست گردو، نیل: رنگ‌های طبیعی گبه', slug: 'natural-dyes', image: 'journal-5', terms: ['cat-craft'], days_ago: 28,
		excerpt: 'رنگ‌هایی که با گذر سال زیباتر می‌شوند.',
		content: L.article([
			'رنگ قرمز گبه‌ها از ریشه‌ی روناس، قهوه‌ای از پوست گردو و آبی از نیل می‌آید. زرد را از اسپرک و گاهی پوست انار می‌گیرند.',
			'رنگ‌های طبیعی در طول سال‌ها کمی روشن‌تر و نرم‌تر می‌شوند؛ چیزی که رنگ‌های شیمیایی هرگز ندارند.',
			['img', 'weaving', 'کلاف‌های پشم رنگ‌شده، آماده‌ی دار'],
		]),
	},
	{
		key: 'night-in-the-tent', title: 'یک شب در سیاه‌چادر', slug: 'a-night-in-the-tent', image: 'journal-6', terms: ['cat-life'], days_ago: 36,
		excerpt: 'چای روی آتش، صدای چشمه و آسمانی که در شهر نمی‌بینید.',
		content: L.article([
			'سیاه‌چادر از موی بز بافته می‌شود. در گرمای روز سایه می‌دهد و در باران، الیاف باد می‌کنند و چادر آب‌بند می‌شود.',
			'شب‌ها همه دور آتش جمع می‌شوند. چای در قوری سیاه دم می‌کشد و قصه‌هایی تعریف می‌شود که سال‌هاست تکرار شده‌اند.',
			['q', 'در شهر ساعت داریم؛ در ییلاق خورشید و ستاره‌ها.'],
		]),
	},
];

/* ---------------- Shared blocks ---------------- */

const QUOTES = [
	{ quote: 'روغن حیوانی‌اش همان بوی خانه‌ی مادربزرگم در فارس را می‌دهد. سال‌ها بود چنین روغنی پیدا نکرده بودم.', name: 'منیژه بهادری', role: 'تهران' },
	{ quote: 'گبه را برای اتاق بچه گرفتیم. پشت فرش اسم بافنده‌اش دوخته شده؛ این برای ما خیلی ارزش داشت.', name: 'پیمان افشار', role: 'کرج' },
	{ quote: 'کشک و قره‌قروت را برای رستورانمان می‌گیریم. کیفیتش ثابت است و همیشه به موقع می‌رسد.', name: 'سحر نادری', role: 'سرآشپز، شیراز' },
];

const FAQ_SHOP = [
	['محصولات از کجا می‌آیند؟', 'از چهارده خانواده‌ی عشایر قشقایی و بختیاری که مستقیم با آن‌ها کار می‌کنیم. نام خانواده و منطقه روی هر بسته نوشته شده است.'],
	['روغن حیوانی را چطور نگه دارم؟', 'در ظرف دربسته و جای خنک. در دمای اتاق تا شش ماه و در یخچال تا یک سال کیفیتش را حفظ می‌کند.'],
	['گبه‌ها دقیقاً همان عکس‌اند؟', 'هر گبه دستباف و یکتاست. عکس هر فرش، خود همان فرش است و ابعاد دقیقش در صفحه‌ی محصول آمده.'],
	['ارسال به شهرستان دارید؟', 'بله، به همه‌ی شهرها. خوراکی‌ها در بسته‌بندی عایق و گبه‌ها لوله‌شده در کیسه‌ی پارچه‌ای ارسال می‌شوند.'],
	['سهم خانواده‌ها از فروش چقدر است؟', 'قیمت خرید را خود خانواده‌ها تعیین می‌کنند و ما پیش از برداشت پرداخت می‌کنیم. هر سال گزارش خریدها را منتشر می‌کنیم.'],
];

const FAMILIES = [
	{ eyebrow: 'ایل قشقایی · فیروزآباد', title: 'خانواده‌ی کشکولی', text: 'سه نسل گله‌داری و ساخت روغن حیوانی. روغن و کشک کوچ از مشک‌های همین خانواده می‌آید.', points: 'روغن حیوانی\nکشک گلوله‌ای\nقره‌قروت', image: img('p-ghee'), btn_text: 'محصولات این خانواده', btn_link: link('{{termlink:pc-food}}'), tone: '' },
	{ eyebrow: 'ایل بختیاری · چهارمحال', title: 'خانواده‌ی دره‌شوری', text: 'زنان این خانواده گبه‌ها و گلیم‌های کوچ را می‌بافند؛ ترنج پله‌ای و نقش چشم امضای آن‌هاست.', points: 'گبه‌ی دستباف\nکوسن گلیمی\nکلاف رنگ گیاهی', image: img('p-gabbeh-b'), btn_text: 'دست‌بافته‌های این خانواده', btn_link: link('{{termlink:pc-woven}}'), tone: 'inverse' },
	{ eyebrow: 'ایل قشقایی · سمیرم', title: 'خانواده‌ی شش‌بلوکی', text: 'ییلاقشان در ارتفاع ۲۶۰۰ متری است؛ آویشن و پونه‌ی کوچ را همین خانواده می‌چیند.', points: 'آویشن کوهی\nپونه‌ی کوهی\nجوراب پشمی', image: img('p-thyme'), btn_text: 'گیاهان این خانواده', btn_link: link('{{termlink:pc-herbs}}'), tone: 'accent' },
];

const perks = () => L.features([
	{ icon: 'tent', title: 'مستقیم از خانواده‌ها', text: 'نام خانواده روی هر بسته.' },
	{ icon: 'leaf', title: 'بدون افزودنی', text: 'همان دستور قدیمی.' },
	{ icon: 'truck', title: 'ارسال رایگان', text: 'برای خرید بالای ۲ میلیون تومان.' },
	{ icon: 'refresh', title: 'هفت روز بازگشت', text: 'برای دست‌بافته‌ها، بی‌پرسش.' },
], { layout: 'grid', style: 'plain', columns: '4', icon_style: 'tile' });

const newsletter = (title = 'وقتی محصول تازه‌ی\n*ییلاق* رسید', desc = 'فصلی یک نامه: محصولات تازه، پیش‌فروش گبه‌ها و روایتی از زندگی ایل.') => L.cta({
	eyebrow: 'خبرنامه', title, desc,
	action: 'email', email_placeholder: 'ایمیل شما', email_button: 'عضویت', note: 'فصلی یک ایمیل؛ هر وقت خواستید لغو کنید.',
	look: 'image', image: img('camp'), decor: '', rounded: '',
});

const SEASONS = [
	{ image: img('journal-1'), label: 'بهار', title: 'کوچ بهاره', text: 'ایل از قشلاق به سوی ییلاق راه می‌افتد؛ مسیری سه‌هفته‌ای.', link: link('{{post:spring-migration}}') },
	{ image: img('journal-3'), label: 'اوایل تابستان', title: 'روغن و کشک', text: 'شیر فراوان است؛ روغن حیوانی و کشک در مشک‌ها ساخته می‌شود.', link: link('{{post:making-ghee}}') },
	{ image: img('journal-4'), label: 'تابستان', title: 'گیاهان ییلاق', text: 'آویشن و پونه در اوج عطر چیده و در سایه خشک می‌شوند.', link: link('{{post:mountain-herbs}}') },
	{ image: img('journal-5'), label: 'پاییز', title: 'رنگرزی و بافت', text: 'پشم با روناس، پوست گردو و نیل رنگ می‌شود؛ دارها برپا می‌شوند.', link: link('{{post:natural-dyes}}') },
	{ image: img('journal-6'), label: 'زمستان', title: 'قشلاق', text: 'در گرمای قشلاق، گبه‌ها و جوراب‌ها کامل می‌شوند.', link: link('{{post:night-in-the-tent}}') },
];

/* ---------------- Home ---------------- */

const home = [
	L.bleed(w('hm-hero', {
		layout: 'split', title_tag: 'h1', title_size: 'xl', header_align: 'start', title_reveal: 'words',
		eyebrow: 'کوچ · از ییلاق تا خانه‌ی شما',
		title: 'آنچه عشایر\n*برای سفره‌ی خودشان*\nمی‌سازند',
		desc: 'روغن حیوانی، کشک، گیاهان کوهی و دست‌بافته‌های چهارده خانواده‌ی قشقایی و بختیاری؛ بی‌واسطه، با قیمتی که خودشان تعیین می‌کنند.',
		btn1_text: 'خرید محصولات', btn1_link: link(shopUrl), btn1_style: 'primary',
		btn2_text: 'خانواده‌ها', btn2_link: link('{{page:families}}'), btn2_style: 'secondary',
		stats: [
			{ value: '۱۴', label: 'خانواده‌ی همکار' },
			{ value: '۲', label: 'ایل: قشقایی و بختیاری' },
			{ value: '۱۰۰٪', label: 'پرداخت پیش از برداشت' },
		],
		media_type: 'image', image: img('hero'), media_ratio: 'landscape', height: 'auto', decor: '', hint: '',
	})),
	section({ space: 'sm', gap: 0 }, [perks()]),
	section({ space: 'md', gap: 32, cards: 'cascade' }, [
		L.productCategories(['nomad-food', 'mountain-herbs', 'handwoven', 'season-box'], { eyebrow: 'دسته‌ها', title: 'از *چادر* تا آشپزخانه' }),
	]),
	section({ space: 'md', gap: 32 }, [
		L.productCarousel({ eyebrow: 'محصولات فصل', title: 'تازه از *ییلاق*', source: 'featured', more_text: 'همه‌ی محصولات', more_link: link(shopUrl) }),
	]),
	section({ space: 'none', gap: 0, zoom: 'expand', zoomAmount: 0.24, zoomInner: true, zoomRadius: 6 }, [
		L.imageReveal('camp', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	fx(section({ space: 'md', gap: 32, width: 1000 }, [
		L.textScrub('عشایر هیچ‌وقت برای بازار نساختند؛ برای *چادر خودشان* ساختند. ما فقط راهی پیدا کردیم که آنچه برای خودشان می‌سازند *به شهر هم برسد*، با قیمتی که خودشان تعیین می‌کنند.', { eyebrow: 'چرا کوچ', size: 'md' }),
	]), { tone: 'surface' }),
	section({ space: 'md', gap: 32 }, [
		heading({ eyebrow: 'خانواده‌ها', title: 'سه خانواده،\n*سه ییلاق*' }),
		L.stack(FAMILIES),
	]),
	section({ space: 'md', gap: 32 }, [
		L.productTabs([
			{ label: 'پرفروش‌ها', source: 'featured', category: [], count: 8 },
			{ label: 'خوراکی‌ها', source: 'recent', category: ['nomad-food'], count: 8 },
			{ label: 'دست‌بافته‌ها', source: 'recent', category: ['handwoven'], count: 8 },
			{ label: 'حراج', source: 'sale', category: [], count: 8 },
		], { eyebrow: 'فروشگاه', title: 'برای *خانه و سفره*' }),
	]),
	fx(section({ space: 'md', gap: 48 }, [
		cols({ widths: [50, 50], gap: 72, align: 'center' }, [
			[
				heading({ eyebrow: 'دست‌بافته‌ها', title: 'هر گبه،\n*یک بافنده*', desc: 'گبه‌ها را زنان ایل بدون نقشه و از روی حافظه می‌بافند. پشم از گوسفندان خود ایل است و رنگ‌ها از روناس، پوست گردو، نیل و اسپرک. پشت هر گبه نام بافنده‌اش دوخته شده است.' }),
				button('دیدن دست‌بافته‌ها', '{{termlink:pc-woven}}', 'primary'),
			],
			[fx(L.imageReveal('weaving', { ratio: '4-3', reveal: 'none', parallax: px(0) }), { zoom: 'in', zoomAmount: 0.12, zoomInner: true })],
		]),
	]), { tone: 'inverse' }),
	L.hscroll({
		eyebrow: 'یک سال با ایل', title: 'هر فصل،\n*یک محصول*', desc: 'زندگی عشایر با فصل‌ها جابه‌جا می‌شود؛ محصولات کوچ هم.',
		items: SEASONS, card_size: 'md', card_style: 'caption', scheme: '',
	}),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'از زبان خریداران', title: 'طعمی که *آشناست*', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'دفتر کوچ', title: 'روایت‌هایی از *ییلاق*' })],
			[button('همه‌ی روایت‌ها', '{{blog}}', 'secondary', { _flex_align_self: 'flex-end' })],
		]),
		L.posts({ count: 3, layout: 'grid', columns: '3', excerpt: 'yes' }),
	]),
	newsletter(),
];

/* ---------------- Home, second version ---------------- */

const home2 = [
	L.slider([
		{ image: img('camp'), eyebrow: 'کوچ · محصولات عشایری', title: 'از *ییلاق*،\nبه شهر', text: 'خوراکی‌های طبیعی و دست‌بافته‌های اصیل، مستقیم از خانواده‌های عشایر.', btn_text: 'فروشگاه', url: shopUrl },
		{ image: img('weaving'), eyebrow: 'رنگ گیاهی', title: 'روناس، گردو،\n*نیل و اسپرک*', text: 'کلاف‌های پشمی که گبه‌ها با آن بافته می‌شوند؛ حالا برای بافتنی‌های شما.', btn_text: 'کلاف‌ها', url: '{{product:wool-yarn}}' },
		{ image: img('hero'), eyebrow: 'جعبه‌ی فصل', title: 'هر فصل،\n*یک جعبه*', text: 'روغن، کشک، قره‌قروت و گیاه کوهی؛ تازه‌ترین محصول هر فصل.', btn_text: 'جعبه‌ی فصل', url: '{{page:box}}' },
	]),
	section({ space: 'md', gap: 32 }, [
		L.productCarousel({ eyebrow: 'پرفروش‌ها', title: 'محبوب‌ترین‌ها', source: 'featured', layout: 'grid', columns: '4', count: 8, more_text: 'فروشگاه', more_link: link(shopUrl) }),
	]),
	fx(section({ space: 'md', gap: 32 }, [
		L.productCategories(['nomad-food', 'mountain-herbs', 'handwoven', 'season-box'], { eyebrow: 'دسته‌ها', title: 'خرید بر اساس *دسته*', style: 'circle' }),
	]), { tone: 'soft', cards: 'spread' }),
	section({ space: 'sm', gap: 0 }, [
		L.con({ content_width: 'full', css_classes: 'hm-scheme-inverse hm-kilim-top', padding: L.pad(48, 48, 40) }, [
			L.counters([
				{ value: 14, label: 'خانواده‌ی همکار' },
				{ value: 2600, label: 'متر، ارتفاع ییلاق' },
				{ value: 380, label: 'گبه‌ی بافته‌شده' },
				{ value: 0, label: 'افزودنی' },
			], { style: 'plain', columns: '4' }),
		], true),
	]),
	section({ space: 'md', gap: 32 }, [
		L.productDeal({ eyebrow: 'پیشنهاد این فصل', title: 'جعبه‌ی *فصل*', desc: 'یک کیلو روغن، کشک، قره‌قروت و دو بسته گیاه کوهی؛ با ارسال رایگان.', ids: '{{ids:season-box}}' }),
	]),
	section({ space: 'md', gap: 40 }, [
		L.tabs([
			{ title: 'روغن حیوانی', subtitle: 'خوراکی', meta: '۰۱', image: img('p-ghee'), panel_title: 'همان روغن زرد قدیمی', panel_text: 'از کره‌ی شیر گوسفندانی که در ییلاق می‌چرند، با جوشاندن آرام روی آتش هیزم. عطرش برنج را عوض می‌کند.', chips: 'شیر گوسفند، ییلاق، بدون افزودنی', btn_text: 'خرید روغن', btn_link: link('{{product:ghee}}') },
			{ title: 'کشک و قره‌قروت', subtitle: 'خوراکی', meta: '۰۲', image: img('p-kashk'), panel_title: 'از دوغ، زیر آفتاب ییلاق', panel_text: 'کشک گلوله‌ای و قره‌قروت از دوغ همان شیر؛ ترش و پرطعم، بدون نمک اضافه.', chips: 'آفتاب‌خشک، دست‌ساز', btn_text: 'خرید کشک', btn_link: link('{{product:kashk}}') },
			{ title: 'گیاهان کوهی', subtitle: 'دمنوش و ادویه', meta: '۰۳', image: img('p-thyme'), panel_title: 'چیده‌شده در اوج عطر', panel_text: 'آویشن و پونه را در زمان گلدهی می‌چینند و در سایه خشک می‌کنند تا عطرشان بماند.', chips: 'آویشن، پونه', btn_text: 'خرید آویشن', btn_link: link('{{product:wild-thyme}}') },
			{ title: 'دست‌بافته‌ها', subtitle: 'گبه، گلیم و جوراب', meta: '۰۴', image: img('p-gabbeh'), panel_title: 'بافته از حافظه', panel_text: 'گبه، گلیم و جوراب‌های پشمی که زنان ایل بدون نقشه و با رنگ گیاهی می‌بافند. هر کدام یکتاست.', chips: 'پشم، روناس، نیل', btn_text: 'دیدن دست‌بافته‌ها', btn_link: link('{{termlink:pc-woven}}') },
		], { autoplay: 7, media_side: 'start' }),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *خرید*' }), button('همه‌ی پرسش‌ها', '{{page:faq}}', 'secondary')],
			[L.faq(FAQ_SHOP.slice(0, 4), { style: 'lines' })],
		]),
	]), { tone: 'surface' }),
	newsletter(),
];

/* ---------------- Families ---------------- */

const families = [
	L.pageHead('خانواده‌ها', 'چهارده خانواده،\n*دو ایل*', 'هر محصول کوچ کار دست یک خانواده است. سه خانواده‌ای که بیشترین همکاری را با ما دارند، این‌جا معرفی شده‌اند.'),
	section({ space: 'sm', zoom: 'expand', zoomAmount: 0.2, zoomInner: true, zoomRadius: 6 }, [
		L.imageReveal('camp', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	section({ space: 'md', gap: 32 }, [L.stack(FAMILIES)]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'تقویم ایل', title: 'از قشلاق\n*تا ییلاق*', header_align: 'center', desc: 'خانواده‌های همکار هر سال دو بار کوچ می‌کنند. محصولات کوچ هم با همین تقویم ساخته می‌شوند.' }),
		L.steps([
			{ marker: '', icon: 'sun', title: 'قشلاق، زمستان', text: 'دشت‌های گرم فارس؛ بافتن گبه و جوراب.' },
			{ marker: '', icon: 'compass', title: 'کوچ بهاره', text: 'فروردین؛ سه هفته در راه ییلاق.' },
			{ marker: '', icon: 'mountain', title: 'ییلاق، تابستان', text: 'روغن، کشک و گیاهان کوهی.' },
			{ marker: '', icon: 'tent', title: 'کوچ پاییزه', text: 'مهر؛ بازگشت به قشلاق و رنگرزی پشم.' },
		], { layout: 'h', cards: 'yes' }),
	]), { tone: 'surface', cards: 'cascade' }),
	section({ space: 'sm', gap: 0 }, [
		L.con({ content_width: 'full', css_classes: 'hm-scheme-inverse', padding: L.pad(44, 48) }, [
			L.counters([
				{ value: 14, label: 'خانواده' },
				{ value: 2, label: 'ایل' },
				{ value: 61, label: 'نفر، با بافنده‌ها' },
				{ value: 100, suffix: '٪', label: 'پرداخت پیش از برداشت' },
			], { style: 'plain', columns: '4' }),
		], true),
	]),
	L.cta({
		title: 'مهمان *ییلاق* شوید',
		desc: 'هر تابستان چند سفر کوچک با خانواده‌های همکار برگزار می‌کنیم.',
		btn1_text: 'سفرهای ییلاق', btn1_link: link('{{page:trips}}'), btn2_text: '', look: 'surface', decor: '', note: '',
	}),
];

/* ---------------- Story ---------------- */

const story = [
	L.pageHead('داستان کوچ', 'یک تابستان\n*در ییلاق*', 'کوچ از یک سفر شروع شد. تابستان ۱۴۰۰ چند هفته مهمان یک خانواده‌ی قشقایی در ییلاق سمیرم بودیم. وقت رفتن، روغن و کشکی که برایمان گذاشتند آن‌قدر خوب بود که فکر کردیم این طعم نباید فقط در ییلاق بماند.'),
	section({ space: 'sm', zoom: 'expand', zoomAmount: 0.18, zoomInner: true, zoomRadius: 6 }, [
		L.imageReveal('hero', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	section({ space: 'md', gap: 48 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'امروز', title: 'نامشان\n*روی هر بسته*' })],
			[L.textScrub('امروز با *چهارده خانواده* کار می‌کنیم. قیمت را خودشان تعیین می‌کنند، پیش از برداشت پول می‌گیرند و *نامشان روی هر بسته* است؛ چون آنچه می‌فروشیم، کار دست آن‌هاست.', { size: 'md' })],
		]),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'اصول ما', title: 'آنچه *قول* داده‌ایم' }),
		L.features([
			{ icon: 'heart', title: 'قیمت با خانواده‌هاست', text: 'ما چانه نمی‌زنیم؛ قیمت خرید را خود خانواده‌ها تعیین می‌کنند.' },
			{ icon: 'clock', title: 'پرداخت پیش از برداشت', text: 'پول هر فصل را پیش از برداشت می‌پردازیم تا خانواده‌ها برنامه‌ریزی کنند.' },
			{ icon: 'leaf', title: 'دستور قدیمی', text: 'هیچ محصولی را برای بازار «بهبود» نمی‌دهیم؛ همان‌طور که برای خودشان می‌سازند.' },
			{ icon: 'chart', title: 'گزارش سالانه', text: 'هر سال گزارش خریدها و سهم هر خانواده را منتشر می‌کنیم.' },
		], { layout: 'grid', style: 'cards', columns: '4', icon_style: 'tile' }),
	]), { tone: 'surface', cards: 'flip' }),
	section({ space: 'md', gap: 40, cards: 'cascade' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'تیم کوچ', title: 'کسانی که\n*راه را* باز نگه می‌دارند' })],
			[L.features([
				{ icon: '', title: 'آیدا کشکولی', text: 'بنیان‌گذار؛ رابطه با خانواده‌ها' },
				{ icon: '', title: 'بهمن دره‌شوری', text: 'ایل بختیاری؛ دست‌بافته‌ها' },
				{ icon: '', title: 'نسیم فروغی', text: 'کیفیت و بسته‌بندی' },
				{ icon: '', title: 'رستم شش‌بلوکی', text: 'ارسال و انبار' },
			], { layout: 'grid', style: 'plain', columns: '2', icon_style: 'plain' })],
		]),
	]),
	section({ space: 'none', gap: 0, cls: 'hm-kilim-top' }, [L.imageReveal('pattern', { ratio: 'auto', reveal: 'none', parallax: px(0) })]),
	newsletter('مهمان *ییلاق*\nشوید', 'از سفرهای تابستانی با خانواده‌های همکار و پیش‌فروش گبه‌ها باخبر شوید.'),
];

/* ---------------- Season box ---------------- */

const box = [
	L.pageHead('جعبه‌ی فصل', 'هر فصل،\n*یک جعبه از ییلاق*', 'چهار بار در سال، تازه‌ترین محصول فصل را از خانواده‌ها می‌گیریم و برایتان می‌فرستیم؛ همراه با یادداشتی از کسانی که آن را ساخته‌اند.'),
	section({ space: 'md', gap: 48 }, [
		cols({ widths: [50, 50], gap: 72, align: 'center' }, [
			[fx(L.imageReveal('p-box', { ratio: '1-1', reveal: 'none', parallax: px(0) }), { zoom: 'out', zoomAmount: 0.1 })],
			[
				heading({ eyebrow: 'در جعبه‌ی این فصل', title: 'تابستان،\n*فصل روغن و کشک*' }),
				L.features([
					{ icon: '', title: 'یک کیلو روغن حیوانی', text: 'از مشک‌های خانواده‌ی کشکولی.' },
					{ icon: '', title: 'کشک و قره‌قروت', text: 'نیم کیلو کشک گلوله‌ای و ۳۰۰ گرم قره‌قروت.' },
					{ icon: '', title: 'دو بسته گیاه کوهی', text: 'آویشن و پونه‌ی ییلاق سمیرم.' },
					{ icon: '', title: 'یادداشت خانواده', text: 'و چند عکس از ییلاق امسال.' },
				], { layout: 'list', style: 'plain', numbered: 'yes', icon_style: 'plain' }),
			],
		]),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'اشتراک', title: 'ییلاق را *مشترک* شوید', header_align: 'center' }),
		L.pricing([
			{ name: 'جعبه‌ی کوچک', desc: 'برای یک یا دو نفر', price: '۱٬۹۰۰٬۰۰۰', price_alt: '۱٬۷۱۰٬۰۰۰', unit: 'تومان', period: 'هر فصل', features: 'نیم کیلو روغن حیوانی\nکشک و قره‌قروت\nیک بسته گیاه کوهی', btn_text: 'سفارش', btn_link: link('{{product:season-box}}'), featured: '', badge: '' },
			{ name: 'جعبه‌ی خانواده', desc: 'برای سه تا پنج نفر', price: '۴٬۲۰۰٬۰۰۰', price_alt: '۳٬۷۸۰٬۰۰۰', unit: 'تومان', period: 'هر فصل', features: 'یک کیلو روغن حیوانی\nکشک، قره‌قروت و کره\nدو بسته گیاه کوهی\nیک جفت جوراب پشمی در زمستان', btn_text: 'سفارش', btn_link: link('{{product:season-box}}'), featured: 'yes', badge: 'پرطرفدار' },
			{ name: 'هدیه', desc: 'یک بار، برای کسی که دوستش دارید', price: '۲٬۶۰۰٬۰۰۰', price_alt: '۲٬۶۰۰٬۰۰۰', unit: 'تومان', period: 'یک بار', features: 'جعبه‌ی خانواده در بسته‌بندی هدیه\nکارت دست‌نویس\nارسال در روز دلخواه', btn_text: 'سفارش هدیه', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
		], { switch_off: 'هر فصل', switch_on: 'اشتراک سالانه', switch_note: '۱۰٪ تخفیف' }),
	]), { tone: 'surface', cards: 'cascade' }),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'روند کار', title: 'از ییلاق\n*تا در خانه*', header_align: 'center' }),
		L.steps([
			{ marker: '', icon: 'calendar', title: 'انتخاب', text: 'جعبه و دوره‌ی اشتراک را انتخاب کنید.' },
			{ marker: '', icon: 'tent', title: 'برداشت', text: 'خانواده‌ها محصول فصل را آماده می‌کنند.' },
			{ marker: '', icon: 'box', title: 'بسته‌بندی', text: 'در شیراز، با بسته‌بندی عایق.' },
			{ marker: '', icon: 'truck', title: 'ارسال', text: 'هفته‌ی اول هر فصل، رایگان.' },
		], { layout: 'h', cards: 'yes' }),
	]),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'درباره‌ی *اشتراک*' })],
			[L.faq([
				['اشتراک را می‌شود لغو کرد؟', 'بله؛ تا یک هفته پیش از ارسال هر فصل می‌توانید لغو کنید یا آن را یک فصل عقب بیندازید.'],
				['محتوای جعبه همیشه همین است؟', 'نه؛ با فصل عوض می‌شود. در زمستان جوراب پشمی و در پاییز کلاف رنگ گیاهی هم اضافه می‌شود.'],
				['ارسال اشتراک هزینه دارد؟', 'ارسال جعبه‌ی فصل به همه‌ی شهرها رایگان است.'],
			], { style: 'lines' })],
		]),
	]),
];

/* ---------------- Wholesale ---------------- */

const WHOLESALE_FORM = {
	need_label: 'محصولات', need_title: 'چه محصولاتی لازم دارید؟', need_desc: 'هر چند گزینه که لازم است.',
	choices: [
		{ label: 'روغن حیوانی', note: 'ظرف‌های ۵ کیلویی', icon: 'drop' },
		{ label: 'کشک و قره‌قروت', note: 'بسته‌بندی عمده', icon: 'box' },
		{ label: 'گیاهان کوهی', note: 'آویشن و پونه', icon: 'leaf' },
		{ label: 'دست‌بافته‌ها', note: 'گبه و کوسن برای فضای کسب‌وکار', icon: 'grid' },
	],
	multi: 'yes',
	budget_on: 'yes', budget_label: 'مقدار', budget_title: 'حدود چه مقدار در ماه؟',
	budgets: 'تا ۲۰ کیلو\n۲۰ تا ۱۰۰ کیلو\nبیش از ۱۰۰ کیلو',
	timeline_on: 'yes', timeline_title: 'از چه زمانی؟',
	timelines: 'همین ماه\nفصل بعد\nهنوز مطمئن نیستم',
	contact_label: 'تماس', contact_title: 'با چه کسی صحبت کنیم؟',
	show_name: 'yes', label_name: 'نام و نام خانوادگی',
	show_phone: 'yes', label_phone: 'شماره‌ی موبایل',
	show_email: 'yes', label_email: 'ایمیل', req_email: '',
	show_company: 'yes', label_company: 'نام رستوران یا فروشگاه', req_company: '',
	show_message: 'yes', label_message: 'توضیح بیشتر', req_message: '', consent: '',
	next_text: 'مرحله‌ی بعد', back_text: 'قبلی', submit_text: 'ارسال درخواست',
	done_title: 'درخواستتان رسید',
	done_text: 'ظرف دو روز کاری تماس می‌گیریم و نمونه‌ی محصولات را برایتان می‌فرستیم.',
	done_btn_text: 'بازگشت به فروشگاه', done_btn_link: link(shopUrl), done_btn_style: 'secondary',
	remember: 'yes', boxed: 'yes', columns: '2',
};

const wholesale = [
	L.pageHead('خرید عمده', 'برای رستوران‌ها\n*و فروشگاه‌ها*', 'روغن، کشک و گیاهان کوهی کوچ را برای آشپزخانه‌های حرفه‌ای و فروشگاه‌های محلی هم می‌فرستیم؛ با فاکتور رسمی و ارسال منظم.'),
	section({ space: 'md', gap: 40, cards: 'cascade' }, [
		L.features([
			{ icon: 'card', title: 'فاکتور رسمی', text: 'با کد اقتصادی، برای هر سفارش.' },
			{ icon: 'calendar', title: 'ارسال منظم', text: 'هفتگی یا ماهانه، در روز ثابت.' },
			{ icon: 'shield', title: 'کیفیت یکسان', text: 'از همان خانواده‌ها، با برگه‌ی آزمایش.' },
			{ icon: 'gift', title: 'نمونه‌ی رایگان', text: 'پیش از اولین سفارش.' },
		], { layout: 'grid', style: 'cards', columns: '4', icon_style: 'tile' }),
	]),
	section({ space: 'md', gap: 40, width: 980 }, [
		heading({ eyebrow: 'درخواست', title: 'همکاری را *شروع کنیم*', header_align: 'center' }),
		L.leadForm(WHOLESALE_FORM),
	]),
];

/* ---------------- Trips ---------------- */

const TRIP_FORM = Object.assign({}, WHOLESALE_FORM, {
	need_label: 'سفر', need_title: 'کدام سفر؟', need_desc: 'هر سفر پنج روز است و ظرفیت محدودی دارد.',
	choices: [
		{ label: 'ییلاق سمیرم', note: 'تیر؛ چیدن آویشن', icon: 'mountain' },
		{ label: 'چهارمحال', note: 'مرداد؛ کارگاه بافت', icon: 'grid' },
		{ label: 'کوچ پاییزه', note: 'مهر؛ همراهی با ایل', icon: 'compass' },
	],
	multi: '',
	budget_title: 'چند نفر هستید؟', budget_label: 'نفرات', budgets: 'یک نفر\nدو نفر\nسه نفر یا بیشتر',
	timeline_on: '',
	show_company: '', label_message: 'پرسش یا توضیح',
	done_title: 'درخواستتان ثبت شد',
	done_text: 'برنامه‌ی کامل سفر و هزینه‌ها را تا دو روز دیگر برایتان می‌فرستیم.',
});

const trips = [
	L.pageHead('سفر ییلاق', 'پنج روز\n*مهمان ایل*', 'هر تابستان چند سفر کوچک با خانواده‌های همکار برگزار می‌کنیم: در سیاه‌چادر می‌خوابید، در ساخت روغن و کشک کمک می‌کنید و شب‌ها زیر آسمان ییلاق چای می‌نوشید.'),
	section({ space: 'sm', zoom: 'expand', zoomAmount: 0.2, zoomInner: true, zoomRadius: 6 }, [
		L.imageReveal('journal-6', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'برنامه', title: 'پنج روز،\n*یک زندگی دیگر*', header_align: 'center' }),
		L.steps([
			{ marker: '', icon: 'pin', title: 'روز اول', text: 'دیدار در شیراز و رسیدن به ییلاق.' },
			{ marker: '', icon: 'drop', title: 'روز دوم', text: 'دوشیدن، مشک‌زدن و ساخت کره.' },
			{ marker: '', icon: 'leaf', title: 'روز سوم', text: 'چیدن آویشن در دامنه.' },
			{ marker: '', icon: 'grid', title: 'روز چهارم', text: 'کنار دار، با بافنده‌ها.' },
			{ marker: '', icon: 'sun', title: 'روز پنجم', text: 'طلوع بر ییلاق و بازگشت.' },
		], { layout: 'h', cards: 'yes' }),
	]), { tone: 'surface', cards: 'cascade' }),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'همراه سفر', title: 'آنچه *شامل* است' })],
			[L.features([
				{ icon: '', title: 'رفت و برگشت از شیراز', text: 'با خودروی دو‌دیفرانسیل.', meta: 'شامل' },
				{ icon: '', title: 'اقامت در سیاه‌چادر', text: 'با رختخواب پشمی و پشه‌بند.', meta: 'شامل' },
				{ icon: '', title: 'همه‌ی وعده‌ها', text: 'غذای ایل، با نان تیری تازه.', meta: 'شامل' },
				{ icon: '', title: 'بیمه‌ی مسافرتی', text: 'برای همه‌ی همراهان.', meta: 'شامل' },
			], { layout: 'list', style: 'plain', numbered: '', icon_style: 'plain' })],
		]),
	]),
	section({ space: 'md', gap: 40, width: 980 }, [
		heading({ eyebrow: 'ثبت‌نام', title: 'جای خود را *رزرو کنید*', header_align: 'center' }),
		L.leadForm(TRIP_FORM),
	]),
];

/* ---------------- Care, shipping, FAQ, contact ---------------- */

const care = [
	L.pageHead('نگهداری', 'تا فصل بعد،\n*مثل روز اول*', 'محصولات کوچ نگهدارنده ندارند. با این چند نکته، تا رسیدن جعبه‌ی بعدی تازه می‌مانند.'),
	section({ space: 'md', gap: 40, cards: 'flip' }, [
		L.features([
			{ icon: 'drop', title: 'روغن حیوانی', text: 'دربسته و دور از نور؛ با قاشق خشک بردارید.', meta: 'تا شش ماه' },
			{ icon: 'box', title: 'کشک و قره‌قروت', text: 'در ظرف شیشه‌ای، جای خشک و خنک.', meta: 'تا یک سال' },
			{ icon: 'leaf', title: 'گیاهان کوهی', text: 'در شیشه‌ی تیره؛ رطوبت عطرشان را می‌برد.', meta: 'تا یک سال' },
			{ icon: 'grid', title: 'گبه و گلیم', text: 'هر ماه از پشت جارو کنید؛ سالی یک بار قالیشویی سنتی.', meta: 'سال‌ها' },
			{ icon: 'sun', title: 'آفتاب', text: 'رنگ گیاهی در آفتاب مستقیم کم‌رنگ می‌شود.', meta: 'پرهیز کنید' },
			{ icon: 'heart', title: 'جوراب پشمی', text: 'با آب سرد و دست بشویید؛ پهن روی حوله خشک کنید.', meta: 'با دست' },
		], { layout: 'grid', style: 'cards', columns: '3', icon_style: 'tile' }),
	]),
];

const shipping = [
	L.pageHead('ارسال و مرجوعی', 'با دقت *بسته‌بندی*،\nبا خیال راحت *خرید*', 'خوراکی‌ها را در بسته‌بندی عایق و دست‌بافته‌ها را لوله‌شده در کیسه‌ی پارچه‌ای، به همه‌ی شهرها می‌فرستیم.'),
	section({ space: 'md', gap: 40 }, [perks()]),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'ارسال', title: 'زمان و *هزینه*' })],
			[L.features([
				{ icon: '', title: 'شیراز', text: 'پیک؛ همان روز یا فردا.', meta: '۶۰ هزار تومان' },
				{ icon: '', title: 'شهرهای دیگر', text: 'پست پیشتاز؛ دو تا چهار روز کاری.', meta: '۱۲۰ هزار تومان' },
				{ icon: '', title: 'خرید بالای ۲ میلیون تومان', text: 'به همه‌ی شهرها.', meta: 'رایگان' },
			], { layout: 'list', style: 'plain', numbered: '', icon_style: 'plain' })],
		]),
	]), { tone: 'surface' }),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'مرجوعی', title: 'اگر *دلتان را نبرد*' })],
			[L.faq([
				['دست‌بافته‌ها را می‌شود پس داد؟', 'بله؛ تا هفت روز پس از تحویل و بدون هیچ پرسشی. هزینه‌ی ارسال برگشت با خریدار است.'],
				['خوراکی‌ها چطور؟', 'خوراکی‌های باز نشده را تا هفت روز پس می‌گیریم. اگر بسته آسیب‌دیده رسیده، عکسش را بفرستید تا دوباره ارسال کنیم.'],
				['پول کی برمی‌گردد؟', 'ظرف سه روز کاری پس از رسیدن بسته به انبار، به همان کارتی که با آن پرداخت کرده‌اید.'],
			], { style: 'lines' })],
		]),
	]),
];

const faqPage = [
	L.pageHead('پرسش‌های متداول', 'پیش از *خرید*', 'پاسخ پرسش‌هایی که بیشتر از همه می‌شنویم. اگر پرسشتان این‌جا نیست، پیام بدهید.'),
	section({ space: 'md', gap: 56 }, [
		cols({ widths: [30, 70], gap: 64 }, [
			[heading({ eyebrow: 'خرید', title: 'سفارش و *ارسال*', title_size: 'md' })],
			[L.faq(FAQ_SHOP, { style: 'lines' })],
		]),
		cols({ widths: [30, 70], gap: 64 }, [
			[heading({ eyebrow: 'محصولات', title: 'ساخت و *کیفیت*', title_size: 'md' })],
			[L.faq([
				['روغن حیوانی کوچ از شیر چه دامی است؟', 'از شیر گوسفند؛ در بعضی فصل‌ها کمی شیر بز هم در آن هست، که روی برچسب نوشته می‌شود.'],
				['کشک شما نمک دارد؟', 'نه؛ کشک و قره‌قروت کوچ نمک افزوده ندارند. ترشی‌شان از خود دوغ است.'],
				['رنگ دست‌بافته‌ها می‌رود؟', 'رنگ‌های گیاهی پس از تثبیت با زاج نمی‌روند، اما در آفتاب مستقیم به‌مرور کم‌رنگ‌تر می‌شوند.'],
			], { style: 'lines', first_open: '' })],
		]),
	]),
];

const contact = [
	L.pageHead('تماس', 'سؤال، سفارش\n*یا فقط سلام*', 'برای سفارش جعبه‌ی فصل، خرید عمده یا سفرهای ییلاق پیام بدهید.'),
	section({ space: 'md' }, [
		cols({ widths: [40, 60], gap: 64 }, [
			[L.contactInfo([
				{ icon: 'whatsapp', label: 'واتس‌اپ و تلفن', value: '۰۹۱۷ ۲۲۰ ۶۴۰۰', link: link('https://wa.me/989172206400', true) },
				{ icon: 'mail', label: 'ایمیل', value: 'salam@kooch.ir', link: link('mailto:salam@kooch.ir') },
				{ icon: 'instagram', label: 'اینستاگرام', value: 'kooch.ir', link: link('https://instagram.com/', true) },
				{ icon: 'pin', label: 'انبار و فروشگاه', value: 'شیراز، خیابان قصردشت، کوچه‌ی ۲۴، پلاک ۶', link: link('') },
				{ icon: 'clock', label: 'ساعت کار', value: 'شنبه تا پنج‌شنبه، ۹ تا ۱۷', link: link('') },
			])],
			[L.contactForm({ show_phone: 'yes', label_phone: 'شماره‌ی موبایل', show_subject: 'yes', label_subject: 'موضوع', label_name: 'نام شما', label_email: 'ایمیل', label_message: 'پیام', button: 'ارسال پیام', success: 'پیامتان رسید؛ ظرف یک روز کاری جواب می‌دهیم.' })],
		]),
	]),
];

/* ---------------- Package ---------------- */

const LIGHT = { light: 'start', extra: { hm_page_light_a: '#8e2f25', hm_page_light_b: '#c99a3e' } };

const pages = [
	{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings(LIGHT) },
	{ key: 'home-2', title: 'خانه — نسخه‌ی دوم', slug: 'home-2', elementor: home2, settings: L.pageSettings({ header: 'transparent-light' }) },
	{ key: 'families', title: 'خانواده‌ها', slug: 'families', elementor: families, settings: L.pageSettings(LIGHT) },
	{ key: 'about', title: 'داستان کوچ', slug: 'about', elementor: story, settings: L.pageSettings() },
	{ key: 'box', title: 'جعبه‌ی فصل', slug: 'season-box-subscription', elementor: box, settings: L.pageSettings() },
	{ key: 'wholesale', title: 'خرید عمده', slug: 'wholesale', elementor: wholesale, settings: L.pageSettings() },
	{ key: 'trips', title: 'سفر ییلاق', slug: 'summer-trips', elementor: trips, settings: L.pageSettings(LIGHT) },
	{ key: 'care', parent: 'faq', title: 'نگهداری', slug: 'care', elementor: care, settings: L.pageSettings() },
	{ key: 'shipping', parent: 'faq', title: 'ارسال و مرجوعی', slug: 'shipping-and-returns', elementor: shipping, settings: L.pageSettings() },
	{ key: 'faq', title: 'پرسش‌های متداول', slug: 'faq', elementor: faqPage, settings: L.pageSettings() },
	{ key: 'contact', title: 'تماس', slug: 'contact', elementor: contact, settings: L.pageSettings() },
	{ key: 'blog', title: 'دفتر کوچ', slug: 'journal', content: '' },
];

module.exports = {
	manifest: {
		id: 'nomad',
		order: 5,
		title: 'کوچ',
		desc: 'فروشگاه محصولات عشایری؛ فروشگاه کامل با یازده محصول در چهار دسته، خانواده‌ها، جعبه‌ی فصل با اشتراک، خرید عمده، سفرهای ییلاق، راهنمای نگهداری و دفتر کوچ. پشم خام، روناسی و نیلی.',
		kit: 'nomad',
		thumb: 'thumb.webp',
		required: ['elementor', 'woocommerce'],
		recommended: [],
		tags: ['فروشگاهی', 'ارگانیک', 'صنایع دستی'],
		pages: pages.filter((p) => p.elementor).map((p) => p.title).concat(['فروشگاه', 'دفتر کوچ']),
	},
	content: {
		site: { title: 'کوچ', tagline: 'محصولات عشایری، بی‌واسطه از ایل' },
		images, alts, terms, posts, products, pages,
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'کوچ — صفحه‌ی اصلی' },
			{ key: 'tpl-home-2', type: 'page', page: 'home-2', title: 'کوچ — صفحه‌ی اصلی، نسخه‌ی دوم' },
			{ key: 'tpl-families', type: 'page', page: 'families', title: 'کوچ — خانواده‌ها' },
			{ key: 'tpl-box', type: 'page', page: 'box', title: 'کوچ — جعبه‌ی فصل و اشتراک' },
			{ key: 'tpl-trips', type: 'page', page: 'trips', title: 'کوچ — سفر ییلاق' },
			{ key: 'tpl-stack', type: 'section', page: 'home', index: 6, title: 'کوچ — خانواده‌ها (کارت‌های پشته‌ای)' },
			{ key: 'tpl-seasons', type: 'section', page: 'home', index: 9, title: 'کوچ — فصل‌ها (اسکرول افقی)' },
			{ key: 'tpl-deal', type: 'section', page: 'home-2', index: 4, title: 'کوچ — پیشنهاد فصل با شمارش معکوس' },
		],
		menus: [
			{
				name: 'کوچ — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'فروشگاه', url: '{{shop}}', children: [
						{ title: 'خوراکی‌ها', term: 'pc-food' },
						{ title: 'گیاهان کوهی', term: 'pc-herbs' },
						{ title: 'دست‌بافته‌ها', term: 'pc-woven' },
						{ title: 'جعبه‌ی فصل', term: 'pc-box' },
					] },
					{ title: 'جعبه‌ی فصل', page: 'box' },
					{ title: 'خانواده‌ها', page: 'families' },
					{ title: 'سفر ییلاق', page: 'trips' },
					{ title: 'دفتر کوچ', page: 'blog' },
					{
						title: 'راهنما', page: 'faq', children: [
							{ title: 'داستان کوچ', page: 'about' },
							{ title: 'پرسش‌های متداول', page: 'faq' },
							{ title: 'نگهداری', page: 'care' },
							{ title: 'ارسال و مرجوعی', page: 'shipping' },
							{ title: 'خرید عمده', page: 'wholesale' },
							{ title: 'تماس', page: 'contact' },
						],
					},
				],
			},
			{
				name: 'کوچ — پابرگ', location: 'footer', items: [
					{ title: 'فروشگاه', url: '{{shop}}' },
					{ title: 'جعبه‌ی فصل', page: 'box' },
					{ title: 'خرید عمده', page: 'wholesale' },
					{ title: 'نگهداری', page: 'care' },
					{ title: 'ارسال و مرجوعی', page: 'shipping' },
					{ title: 'تماس', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 38,
			header_layout: 'split',
			header_cart: true,
			header_cta_text: '',
			font_body: 'iranyekan',
			font_heading: 'ravagh',
			font_heading_weight: '400',
			footer_about: 'کوچ خوراکی‌های طبیعی و دست‌بافته‌های خانواده‌های عشایر قشقایی و بختیاری را بی‌واسطه به شهر می‌آورد.',
			footer_copyright: 'تمام حقوق برای کوچ محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }, { network: 'whatsapp', url: 'https://wa.me/989172206400' }],
			mobile_bar: true,
			mobile_bar_text: 'فروشگاه',
			mobile_bar_url: '{{shop}}',
			mobile_bar_whatsapp: '09172206400',
			magnetic: true,
			cursor: 'dot',
			sound_enabled: true,
			sound_default: true,
			sound_theme: 'soft',
			sound_volume: 35,
			sound_hover: false,
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 4, pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
