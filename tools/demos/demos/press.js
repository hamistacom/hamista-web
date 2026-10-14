/**
 * Demo: Rooznameh — a Persian daily newspaper (Press kit), after the Gazette
 * reference: a running line of headlines, the masthead with today's date in
 * the Persian calendar and the issue number, the top story, columns divided
 * by rules, a side column with prices, weather and an old-style advert,
 * the photo of the day, the editorial and sections by subject.
 * Pages: archive, sections, subscription (sold in the shop), advertising,
 * the newsroom, about and contact. Light newsprint and dark ink.
 */
'use strict';

const L = require('../lib');
const { img, link, px, gap, pad, w, con, section, cols, heading, button } = L;

const images = {};
[
	'wave', 'cafe', 'coast', 'camera', 'valley', 'ridge', 'hiker', 'dusk', 'harvest', 'clouds', 'daisies', 'fog',
	'room', 'forest', 'station', 'leaf', 'bridge', 'lake',
].forEach((k) => { images[k] = 'images/' + k + '.webp'; });

const alts = {
	station: 'سازه‌ی فولادی و قوس‌های آجری یک ایستگاه قدیمی',
	harvest: 'برداشت گندم با گاری و اسب در دشت',
	fog: 'دشتی در مه صبحگاهی',
	lake: 'دریاچه‌ای میان کوه‌ها زیر آسمان ابری',
	forest: 'تنه‌های بلند درختان جنگل',
};

/* ---------------- Sections and stories ---------------- */

const terms = [
	{ key: 'c-city', taxonomy: 'category', name: 'شهر', slug: 'city' },
	{ key: 'c-economy', taxonomy: 'category', name: 'اقتصاد', slug: 'economy' },
	{ key: 'c-culture', taxonomy: 'category', name: 'فرهنگ و هنر', slug: 'culture' },
	{ key: 'c-science', taxonomy: 'category', name: 'علم و فناوری', slug: 'science' },
	{ key: 'c-sport', taxonomy: 'category', name: 'ورزش', slug: 'sport' },
	{ key: 'c-nature', taxonomy: 'category', name: 'طبیعت', slug: 'nature' },
	{ key: 'c-world', taxonomy: 'category', name: 'جهان', slug: 'world' },
	{ key: 'pc-subs', taxonomy: 'product_cat', name: 'اشتراک', slug: 'subscriptions' },
	{ key: 'pc-issues', taxonomy: 'product_cat', name: 'ویژه‌نامه‌ها', slug: 'special-issues' },
];

const story = (key, title, slug, cat, image, days, byline, excerpt, body, caption = '') => ({
	key, title, slug, image, terms: [cat], days_ago: days, byline, excerpt, caption, content: L.article(body),
});

const posts = [
	story('rail', 'قطار برقی تهران–قم از امروز مسافر می‌پذیرد', 'tehran-qom-electric-train', 'c-city', 'station', 0, 'مریم شاکری، خبرنگار شهری',
		'مسیر صدوچهل‌کیلومتری در کمتر از یک ساعت طی می‌شود؛ نخستین قطار ساعت شش صبح با ششصد مسافر از ایستگاه راه‌آهن تهران حرکت کرد.',
		[
			'نخستین قطار برقی مسیر تهران–قم صبح امروز با ششصد مسافر از ایستگاه راه‌آهن تهران حرکت کرد و پنجاه‌وچهار دقیقه بعد به ایستگاه قم رسید. این مسیر تا پیش از این با قطارهای دیزلی حدود یک ساعت و نیم زمان می‌برد.',
			['h', 'هر ساعت یک قطار'],
			'به گفته‌ی مدیر بهره‌برداری، از هفته‌ی آینده هر ساعت یک قطار در هر جهت حرکت می‌کند و قیمت بلیت برای ماه نخست با تخفیف عرضه می‌شود. ایستگاه‌های میانی پرند و حسن‌آباد هم تا پایان سال به خط اضافه خواهند شد.',
			['q', 'مسافری که هر روز میان دو شهر رفت‌وآمد می‌کند، حالا یک ساعت بیشتر برای خانواده‌اش وقت دارد.', 'مدیر بهره‌برداری خط'],
			'کارشناسان حمل‌ونقل می‌گویند برقی شدن این خط، مصرف سوخت را تا شصت درصد کاهش می‌دهد و آلودگی هوای مسیر را کمتر می‌کند.',
		], 'نخستین قطار برقی در ایستگاه راه‌آهن تهران، ساعت شش بامداد'),
	story('wheat', 'برداشت گندم در دشت‌های فارس رکورد زد', 'record-wheat-harvest-fars', 'c-economy', 'harvest', 0, 'حسین نوروزی، گروه اقتصاد',
		'بارش‌های به‌موقع بهار، محصول گندم استان را به بیش از دو میلیون تن رساند؛ خرید تضمینی از هفته‌ی گذشته آغاز شده است.',
		[
			'کشاورزان فارس امسال بیش از دو میلیون تن گندم برداشت کرده‌اند؛ رقمی که در ده سال گذشته بی‌سابقه بوده است. بارش‌های بهاری و استفاده از بذرهای مقاوم به خشکی، دلیل اصلی این افزایش عنوان شده است.',
			'مراکز خرید تضمینی از هفته‌ی گذشته فعال شده‌اند و بهای محصول ظرف دو هفته به حساب کشاورزان واریز می‌شود.',
		]),
	story('fog', 'نمایشگاه عکس «مه» در خانه‌ی هنرمندان گشایش یافت', 'mist-photo-exhibition', 'c-culture', 'fog', 1, 'نازنین افشار',
		'چهل عکس سیاه‌وسفید از دشت‌های مه‌گرفته‌ی شمال کشور، حاصل پنج سال کار یک عکاس جوان، تا پایان ماه در معرض دید است.',
		[
			'نمایشگاه «مه» چهل قاب عکس سیاه‌وسفید را از صبح‌های مه‌آلود گیلان و مازندران گرد آورده است. عکاس این مجموعه پنج زمستان را در روستاهای دامنه‌ی البرز گذرانده تا لحظه‌هایی را ثبت کند که مه، مرز زمین و آسمان را محو می‌کند.',
			'نمایشگاه تا پایان ماه، هر روز از ساعت ده تا هشت شب در نگارخانه‌ی شماره‌ی دو خانه‌ی هنرمندان برپاست.',
		]),
	story('sensor', 'پژوهشگران شیراز حسگر ارزان کیفیت هوا ساختند', 'low-cost-air-sensor', 'c-science', 'leaf', 1, 'دکتر آرش مهرپویا',
		'حسگری به اندازه‌ی یک قوطی کبریت که آلاینده‌های هوا را با دقت دستگاه‌های گران‌قیمت می‌سنجد و قیمتش یک‌دهم آن‌هاست.',
		[
			'گروهی از پژوهشگران دانشگاه شیراز حسگری ساخته‌اند که ذرات معلق و گازهای آلاینده را اندازه می‌گیرد و داده‌ها را هر دقیقه به یک نقشه‌ی آنلاین می‌فرستد.',
			['ul', ['قیمت کمتر از یک‌دهم دستگاه‌های مشابه', 'مصرف برق بسیار کم با باتری خورشیدی', 'نصب روی تیر چراغ برق یا بالکن خانه']],
			'قرار است صد دستگاه از این حسگرها تا پایان سال در مدرسه‌های شیراز نصب شود.',
		]),
	story('race', 'دونده‌ی جوان مازندرانی قهرمان دوی کوهستان دماوند شد', 'damavand-mountain-race', 'c-sport', 'hiker', 2, 'گروه ورزش',
		'مسیر بیست‌وهشت‌کیلومتری را در سه ساعت و دوازده دقیقه پیمود و رکورد مسابقه را هفت دقیقه بهتر کرد.',
		[
			'دویست‌وچهل دونده از دوازده کشور در مسابقه‌ی امسال شرکت کرده بودند. قهرمان نوزده‌ساله‌ی این دوره، از کودکی در روستاهای دامنه‌ی دماوند تمرین کرده است.',
			'رده‌های دوم و سوم به دوندگانی از ترکیه و ارمنستان رسید.',
		]),
	story('chalus', 'جاده‌ی چالوس پس از دو روز بازگشایی شد', 'chalus-road-reopens', 'c-city', 'ridge', 2, 'خبرنگار ما در کرج',
		'برف سنگین و ریزش کوه، این مسیر را دو روز بسته بود؛ پلیس راه از رانندگان خواست زنجیر چرخ همراه داشته باشند.',
		[
			'محور کرج–چالوس از ظهر امروز برای خودروهای سواری بازگشایی شد. گروه‌های راهداری دو روز بی‌وقفه برای برف‌روبی و پاک‌سازی ریزش‌ها کار کردند.',
			'پلیس راه اعلام کرده تا پایان هفته تردد خودروهای سنگین در این مسیر ممنوع است.',
		]),
	story('cafes', 'کافه‌های کتاب، پاتوق تازه‌ی جوانان تبریز', 'tabriz-book-cafes', 'c-culture', 'cafe', 3, 'سارا قلی‌زاده',
		'در سه سال گذشته بیش از بیست کافه‌کتاب در تبریز باز شده است؛ جاهایی که هم می‌شود کتاب خرید و هم ساعت‌ها خواند.',
		[
			'کافه‌کتاب‌های تبریز این روزها شلوغ‌اند؛ دانشجوها برای درس خواندن می‌آیند و نویسنده‌های جوان برای جلسه‌های کتاب‌خوانی.',
			'صاحبان این کافه‌ها می‌گویند فروش کتاب در کنار قهوه، از کتاب‌فروشی‌های سنتی بیشتر شده است.',
		]),
	story('urmia', 'تراز دریاچه‌ی ارومیه پس از سه سال بالا آمد', 'lake-urmia-rises', 'c-nature', 'lake', 3, 'گروه محیط زیست',
		'بارش‌های زمستان و رهاسازی آب سدها، سطح دریاچه را چهل سانتی‌متر بالا برده است؛ پرندگان مهاجر دوباره به جزیره‌ها برگشته‌اند.',
		[
			'اندازه‌گیری‌های این هفته نشان می‌دهد تراز دریاچه‌ی ارومیه چهل سانتی‌متر نسبت به سال گذشته بالا رفته است.',
			'کارشناسان هشدار می‌دهند این بهبود شکننده است و بدون کاهش برداشت آب کشاورزی پایدار نمی‌ماند.',
		]),
	story('hyrcan', 'جنگل‌های هیرکانی زیر حفاظت ویژه رفتند', 'hyrcanian-forests-protection', 'c-nature', 'forest', 4, 'گروه محیط زیست',
		'طرح تازه، قطع درخت و ساخت‌وساز را در صدهزار هکتار از جنگل‌های شمال ممنوع می‌کند.',
		[
			'جنگل‌های هیرکانی با عمری بیش از چهل میلیون سال، از کهن‌ترین جنگل‌های جهان‌اند. طرح تازه، صدهزار هکتار از این جنگل‌ها را در سه استان شمالی زیر حفاظت ویژه می‌برد.',
		]),
	story('housing', 'بازار مسکن در پاییز آرام‌تر شد', 'housing-market-autumn', 'c-economy', 'room', 4, 'حسین نوروزی، گروه اقتصاد',
		'تعداد معامله‌ها نسبت به تابستان بیست درصد کمتر شد و قیمت‌ها در بیشتر منطقه‌ها ثابت ماند.',
		[
			'گزارش ماهانه‌ی بازار مسکن نشان می‌دهد پس از جهش تابستانی، بازار در پاییز به آرامش رسیده است. مشاوران املاک می‌گویند خریداران منتظر مانده‌اند.',
		]),
	story('telescope', 'تلسکوپ رصدخانه‌ی ملی نخستین تصویرش را ثبت کرد', 'national-observatory-first-light', 'c-science', 'dusk', 5, 'دکتر آرش مهرپویا',
		'تصویر کهکشانی در فاصله‌ی سی میلیون سال نوری، نخستین ثبت تلسکوپ سه‌وچهاردهم‌متری رصدخانه بر قله‌ی گرگش است.',
		[
			'رصدخانه‌ی ملی ایران پس از دو دهه کار، نخستین تصویر تلسکوپ اصلی‌اش را منتشر کرد. این تلسکوپ بر قله‌ی گرگش در ارتفاع سه‌هزار و ششصد متری نصب شده است.',
		]),
	story('shortfilm', 'جشنواره‌ی فیلم کوتاه با هشتاد اثر آغاز شد', 'short-film-festival', 'c-culture', 'camera', 6, 'نازنین افشار',
		'فیلم‌سازان جوان از بیست‌وشش استان در این دوره حضور دارند؛ نمایش‌ها برای همه رایگان است.',
		[
			'جشنواره‌ی امسال هشتاد فیلم کوتاه داستانی، مستند و پویانمایی را در پنج سالن نمایش می‌دهد.',
		]),
	story('bridge', 'پل تاریخی ورسک مرمت می‌شود', 'veresk-bridge-restoration', 'c-city', 'bridge', 7, 'خبرنگار ما در مازندران',
		'پل نودساله‌ی ورسک، از نمادهای راه‌آهن سراسری، در دو سال آینده بی‌آنکه رفت‌وآمد قطارها متوقف شود مرمت خواهد شد.',
		[
			'پل ورسک در سال ۱۳۱۵ ساخته شد و هنوز قطارهای مسافری و باری از روی آن می‌گذرند. طرح مرمت، تقویت پایه‌ها و بازسازی سنگ‌چین‌ها را در بر می‌گیرد.',
		]),
	story('climate', 'نشست اقلیمی جهان با توافقی تازه پایان یافت', 'world-climate-agreement', 'c-world', 'clouds', 8, 'گروه جهان',
		'کشورها پذیرفتند تا پایان دهه انتشار گازهای گلخانه‌ای را یک‌سوم کاهش دهند و صندوقی برای کشورهای آسیب‌پذیر بسازند.',
		[
			'نشست دوهفته‌ای اقلیم با توافقی پایان یافت که بسیاری آن را گامی مهم اما ناکافی می‌دانند.',
		]),
	story('waves', 'موج‌های بلند دریای عمان صیادان را به ساحل برگرداند', 'oman-sea-waves', 'c-nature', 'wave', 9, 'خبرنگار ما در چابهار',
		'هواشناسی تا پایان هفته هشدار نارنجی داده است؛ قایق‌های صیادی در اسکله‌ها مانده‌اند.',
		[
			'وزش باد شدید و موج‌های بیش از سه متر، صیادان چابهار و جاسک را مجبور به بازگشت کرده است.',
		]),
	story('coast', 'گردشگری ساحلی بوشهر دو برابر شد', 'bushehr-coastal-tourism', 'c-economy', 'coast', 10, 'گروه اقتصاد',
		'اقامتگاه‌های بوم‌گردی ساحلی امسال بیش از صدهزار مهمان داشته‌اند؛ بیشترشان از استان‌های سردسیر.',
		[
			'رشد گردشگری زمستانی، بوشهر را به یکی از مقصدهای محبوب سفرهای داخلی تبدیل کرده است.',
		]),
];

/* ---------------- Shop: subscriptions and special issues ---------------- */

const product = (key, title, slug, price, sku, image, cats, excerpt, paragraphs, specs, extra = {}) => Object.assign({
	key, title, slug, price, sku, image, gallery: [], terms: cats, excerpt, stock: 999, virtual: true,
	content: L.productBody(paragraphs, specs),
}, extra);

const products = [
	product('sub-print', 'اشتراک سه‌ماهه‌ی نسخه‌ی چاپی', 'print-subscription-3-months', 1950000, 'PR-SUB-3', 'room', ['pc-subs'],
		'هر صبح پیش از ساعت هفت، روزنامه پشت در خانه‌ی شما؛ نود شماره با ده درصد تخفیف.',
		['روزنامه هر روز صبح به نشانی شما می‌رسد. ارسال در تهران، کرج و قم رایگان است.'],
		[['مدت', 'سه ماه'], ['تعداد شماره', '۹۰'], ['ارسال', 'هر روز پیش از ساعت ۷']], { featured: true }),
	product('sub-digital', 'اشتراک سالانه‌ی نسخه‌ی دیجیتال', 'digital-subscription-1-year', 990000, 'PR-SUB-D', 'camera', ['pc-subs'],
		'نسخه‌ی کامل هر شماره به‌صورت PDF و آرشیو ده سال گذشته، روی هر دستگاهی.',
		['دسترسی به نسخه‌ی کامل هر شماره از ساعت شش صبح و جست‌وجو در آرشیو ده سال گذشته.'],
		[['مدت', 'یک سال'], ['قالب', 'PDF و نسخه‌ی وب'], ['آرشیو', 'ده سال']], { featured: true }),
	product('nowruz', 'ویژه‌نامه‌ی نوروز', 'nowruz-special-issue', 180000, 'PR-ISS-NW', 'daisies', ['pc-issues'],
		'صدوبیست صفحه گزارش، داستان و عکس، با جلد مقوایی؛ چاپ محدود.',
		['ویژه‌نامه‌ی نوروز امسال با گزارش‌هایی از چهار گوشه‌ی کشور و داستان‌هایی از نویسندگان جوان.'],
		[['صفحه', '۱۲۰'], ['جلد', 'مقوایی']]),
	product('photo-book', 'کتاب «یک سال در عکس»', 'year-in-pictures-book', 650000, 'PR-BK-YR', 'valley', ['pc-issues'],
		'برگزیده‌ی عکس‌های سال روزنامه در کتابی با کاغذ گلاسه و قطع رحلی.',
		['صدوپنجاه عکس از رویدادها و چهره‌های سال، با یادداشت عکاسان روزنامه.'],
		[['صفحه', '۲۰۰'], ['قطع', 'رحلی']]),
];

/* ---------------- Shared blocks ---------------- */

const box = (html, cls = 'hm-press-box') => con({ content_width: 'full', css_classes: cls, flex_gap: gap(8) }, [L.textEditor(html)], true);

const rates = box(`<h3>نرخ ارز و سکه</h3>
<table><tbody>
<tr><td>دلار</td><td class="up">۵۸٬۲۰۰ ▲</td></tr>
<tr><td>یورو</td><td class="up">۶۳٬۴۵۰ ▲</td></tr>
<tr><td>سکه‌ی امامی</td><td class="down">۴۲٬۱۰۰٬۰۰۰ ▼</td></tr>
<tr><td>طلای ۱۸ عیار (گرم)</td><td>۴٬۳۸۰٬۰۰۰</td></tr>
</tbody></table>
<p style="margin:10px 0 0;font-size:.78rem;opacity:.7">نرخ‌ها به تومان و برای ساعت ۱۰ صبح است.</p>`);

const weather = box(`<h3>هوای امروز</h3>
<table><tbody>
<tr><td>تهران — آفتابی</td><td>۱۴° / ۴°</td></tr>
<tr><td>تبریز — ابری</td><td>۹° / ۱°</td></tr>
<tr><td>مشهد — بارانی</td><td>۱۲° / ۳°</td></tr>
<tr><td>شیراز — صاف</td><td>۱۸° / ۶°</td></tr>
</tbody></table>`);

const advert = box(`<p style="font-size:.72rem;letter-spacing:.2em;opacity:.7">آگهی</p>
<h3 style="border:0;margin:0;font-size:1.6rem">چای ممتاز بهار</h3>
<p style="font-weight:800">از باغ‌های لاهیجان، از سال ۱۳۳۰</p>
<p style="border-block:1px dashed currentColor;padding:8px 0;margin:10px 0">خستگی روز را با یک استکان<br>از تن به در کنید</p>
<p style="font-weight:900;font-size:1.1rem">در همه‌ی بقالی‌های معتبر</p>`, 'hm-press-box hm-press-ad');

const subscribeBlock = () => section({ space: 'lg', gap: 40 }, [
	heading({ eyebrow: 'اشتراک', title: 'روزنامه‌ی هر روز،\n*پشت در خانه*', desc: 'نسخه‌ی چاپی هر صبح پیش از ساعت هفت، یا نسخه‌ی دیجیتال روی هر دستگاهی.', header_align: 'center', title_size: 'lg' }),
	w('hm-pricing', {
		plans: [
			{ name: 'دیجیتال', desc: 'نسخه‌ی کامل هر شماره و آرشیو ده سال.', price: '۹۹۰', price_alt: '', unit: 'هزار تومان', period: '/ سالانه', features: 'نسخه‌ی PDF هر شماره\nآرشیو ده سال گذشته\nخبرنامه‌ی صبحگاهی', btn_text: 'خرید اشتراک', btn_link: link('{{product:sub-digital}}'), featured: '', badge: '' },
			{ name: 'چاپی', desc: 'هر صبح پشت در خانه، با ارسال رایگان.', price: '۱٬۹۵۰', price_alt: '', unit: 'هزار تومان', period: '/ سه‌ماهه', features: 'نود شماره‌ی چاپی\nارسال پیش از ساعت ۷\nنسخه‌ی دیجیتال رایگان\nویژه‌نامه‌ها با تخفیف', btn_text: 'خرید اشتراک', btn_link: link('{{product:sub-print}}'), featured: 'yes', badge: 'پرطرفدار' },
		],
		switch_off: '', switch_on: '',
	}),
]);

/* ---------------- Home ---------------- */

const home = [
	con({ content_width: 'full', css_classes: 'hm-bleed', flex_gap: gap(0) }, [
		w('hm-news', { layout: 'ticker', count: 8, label: 'تازه‌ها', speed: 60, cats: [], offset: 0, orderby: 'date' }),
	]),
	section({ space: 'sm', gap: 14, width: 1240 }, [
		w('hm-masthead', {
			title: 'روزنامه‌ی امروز', motto: 'راستی، آگاهی، امید', top_start: 'سال {year} · شماره‌ی {issue}', top_middle: 'روزنامه‌ی صبح ایران', top_end: 'تأسیس {founded}',
			since: '2001-03-21', place: 'تهران', stamp: 'ویژه‌نامه', end_text: 'نسخه‌ی چاپی', end_link: link('{{page:subscribe}}'),
		}),
		cols({ widths: [80, 20], gap: 16, align: 'center' }, [
			[w('hm-nav-menu', { menu: '', style: 'underline', align: 'center' })],
			[w('hm-header-actions', { items: ['search', 'theme', 'account', 'menu'], cta: '' })],
		]),
	]),
	section({ space: 'md', gap: 0, width: 1240 }, [
		cols({ widths: [70, 30], gap: 36, align: 'start' }, [
			[
				w('hm-news', { layout: 'lead', label: '', images: 'yes', excerpt: 'yes', cats: [], offset: 0, orderby: 'date' }),
				L.spacer(36),
				w('hm-news', { layout: 'columns', count: 3, offset: 1, columns: '3', columns_tablet: '3', columns_mobile: '1', first_wide: '', images: 'yes', excerpt: 'yes', label: 'دیگر خبرهای امروز', cats: [], orderby: 'date' }),
			],
			[
				con({ content_width: 'full', css_classes: 'hm-press-rule', flex_gap: gap(28) }, [
					weather,
					rates,
					w('hm-news', { layout: 'index', count: 5, offset: 0, columns: '1', label: 'پربازدیدترین‌ها', cats: [], orderby: 'comment_count' }),
					advert,
				], true),
			],
		]),
	]),
	section({ space: 'md', gap: 24, width: 1240 }, [
		L.textScrub('روزنامه آینه‌ی هر روز است؛ آنچه امروز می‌نویسیم، *فردا تاریخ می‌شود*. ما می‌کوشیم این آینه را تمیز نگه داریم.', { eyebrow: 'سرمقاله', size: 'md', align: 'center' }),
	]),
	section({ space: 'none', gap: 0, zoom: 'expand', zoomAmount: 0.2, zoomInner: true, zoomRadius: 0 }, [
		L.imageReveal('valley', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	section({ space: 'sm', gap: 0, width: 1240 }, [
		L.textEditor('<p style="text-align:center;font-size:.85rem;opacity:.75">عکس روز: غروب بر دریاچه‌ای در دامنه‌ی زاگرس — عکاس: نیما کاوه</p>'),
	]),
	section({ space: 'md', gap: 36, width: 1240 }, [
		w('hm-news', { layout: 'columns', count: 4, offset: 4, columns: '3', columns_tablet: '2', columns_mobile: '1', first_wide: 'yes', images: 'yes', excerpt: 'yes', label: 'گزارش‌ها', more_text: 'آرشیو', more_link: link('{{page:archive}}'), cats: [], orderby: 'date' }),
	]),
	section({ space: 'md', gap: 36, width: 1240 }, [
		cols({ widths: [33, 34, 33], gap: 32, align: 'start' }, [
			[w('hm-news', { layout: 'list', count: 3, offset: 0, images: 'yes', excerpt: '', label: 'اقتصاد', more_text: 'همه', more_link: link('{{termlink:c-economy}}'), cats: ['{{term:c-economy}}'], orderby: 'date' })],
			[w('hm-news', { layout: 'list', count: 3, offset: 0, images: 'yes', excerpt: '', label: 'فرهنگ و هنر', more_text: 'همه', more_link: link('{{termlink:c-culture}}'), cats: ['{{term:c-culture}}'], orderby: 'date' })],
			[w('hm-news', { layout: 'list', count: 3, offset: 0, images: 'yes', excerpt: '', label: 'طبیعت', more_text: 'همه', more_link: link('{{termlink:c-nature}}'), cats: ['{{term:c-nature}}'], orderby: 'date' })],
		]),
	]),
	section({ space: 'md', gap: 24, width: 1240 }, [
		L.marquee(['شهر', 'اقتصاد', 'فرهنگ و هنر', 'علم و فناوری', 'ورزش', 'طبیعت', 'جهان'], { size: 'lg', look: 'alternate', bordered: 'yes' }),
	]),
	subscribeBlock(),
];

/* ---------------- Inner pages ---------------- */

const archive = [
	L.pageHead('آرشیو', 'همه‌ی *خبرها*', 'خبرها و گزارش‌های روزنامه، از تازه‌ترین تا قدیمی‌ترین.'),
	section({ space: 'md', gap: 0, width: 1240 }, [
		cols({ widths: [70, 30], gap: 36, align: 'start' }, [
			[w('hm-news', { layout: 'list', count: 12, offset: 0, images: 'yes', excerpt: 'yes', label: '', cats: [], orderby: 'date' })],
			[con({ content_width: 'full', css_classes: 'hm-press-rule', flex_gap: gap(28) }, [
				w('hm-news', { layout: 'index', count: 6, offset: 0, columns: '1', label: 'پربازدیدترین‌ها', cats: [], orderby: 'comment_count' }),
				rates,
			], true)],
		]),
	]),
];

const sections = [
	L.pageHead('سرویس‌ها', 'هر *سرویس*، یک نگاه', 'شهر، اقتصاد، فرهنگ، علم، ورزش، طبیعت و جهان؛ تازه‌ترین خبرهای هر سرویس.'),
	...[['c-city', 'شهر'], ['c-economy', 'اقتصاد'], ['c-culture', 'فرهنگ و هنر'], ['c-science', 'علم و فناوری'], ['c-nature', 'طبیعت']].map(([k, label]) => section({ space: 'sm', gap: 0, width: 1240 }, [
		w('hm-news', { layout: 'columns', count: 3, offset: 0, columns: '3', columns_tablet: '2', columns_mobile: '1', first_wide: 'yes', images: 'yes', excerpt: 'yes', label, more_text: 'همه‌ی خبرهای ' + label, more_link: link('{{termlink:' + k + '}}'), cats: ['{{term:' + k + '}}'], orderby: 'date' }),
	])),
];

const subscribe = [
	L.pageHead('اشتراک', 'روزنامه را *مشترک* شوید', 'نسخه‌ی چاپی یا دیجیتال؛ هر وقت خواستید لغو کنید.'),
	subscribeBlock(),
	section({ space: 'md', gap: 32, width: 1100 }, [
		heading({ eyebrow: 'ویژه‌نامه‌ها', title: 'از *فروشگاه* روزنامه' }),
		L.products({ source: 'recent', count: 4, columns: '4' }),
	]),
	section({ space: 'md', gap: 0, width: 900 }, [
		L.faq([
			['نسخه‌ی چاپی چه ساعتی می‌رسد؟', 'در تهران، کرج و قم هر روز پیش از ساعت هفت صبح. در شهرهای دیگر با پست و یک روز دیرتر.'],
			['می‌توانم اشتراک را متوقف کنم؟', 'بله؛ برای سفر یا هر دلیل دیگری تا سی روز در سال اشتراک را نگه می‌داریم و روزهای توقف به پایان آن اضافه می‌شود.'],
			['نسخه‌ی دیجیتال روی چه دستگاه‌هایی باز می‌شود؟', 'روی هر رایانه، تبلت یا گوشی؛ با یک حساب تا سه دستگاه.'],
		], { style: 'lines' }),
	]),
];

const advertise = [
	L.pageHead('آگهی', 'آگهی در *روزنامه*', 'هر روز صدوبیست هزار نسخه‌ی چاپی و نیم میلیون خواننده‌ی آنلاین.'),
	section({ space: 'md', gap: 40, width: 1100 }, [
		L.counters([
			{ value: 120000, prefix: '', suffix: '', label: 'شمارگان روزانه', desc: 'نسخه‌ی چاپی در سراسر کشور' },
			{ value: 500, prefix: '', suffix: ' هزار', label: 'خواننده‌ی آنلاین', desc: 'در هر روز' },
			{ value: 25, prefix: '', suffix: ' سال', label: 'سابقه', desc: 'از ۱۳۸۰' },
		], { style: 'plain', columns: '3', grouping: 'yes' }),
		w('hm-pricing', {
			plans: [
				{ name: 'یک‌هشتم صفحه', desc: 'آگهی کوچک در صفحه‌های داخلی.', price: '۸', price_alt: '', unit: 'میلیون تومان', period: '/ هر شماره', features: 'سیاه‌وسفید\nصفحه‌های داخلی', btn_text: 'رزرو آگهی', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
				{ name: 'یک‌چهارم صفحه', desc: 'رنگی، با جای ثابت در سرویس دلخواه.', price: '۱۸', price_alt: '', unit: 'میلیون تومان', period: '/ هر شماره', features: 'رنگی\nانتخاب سرویس\nنسخه‌ی آنلاین رایگان', btn_text: 'رزرو آگهی', btn_link: link('{{page:contact}}'), featured: 'yes', badge: 'پیشنهاد ما' },
				{ name: 'صفحه‌ی کامل', desc: 'یک صفحه‌ی کامل رنگی با طراحی رایگان.', price: '۶۵', price_alt: '', unit: 'میلیون تومان', period: '/ هر شماره', features: 'رنگی\nطراحی آگهی رایگان\nبنر آنلاین یک‌هفته‌ای', btn_text: 'رزرو آگهی', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
			],
			switch_off: '', switch_on: '',
		}),
	]),
];

const newsroom = [
	L.pageHead('تحریریه', 'آدم‌های *روزنامه*', 'خبرنگاران، دبیران و عکاسانی که هر روز این روزنامه را می‌سازند.'),
	section({ space: 'md', gap: 32, width: 1100 }, [
		L.features([
			{ icon: 'pen', title: 'مریم شاکری', text: 'دبیر سرویس شهری' },
			{ icon: 'chart', title: 'حسین نوروزی', text: 'دبیر سرویس اقتصاد' },
			{ icon: 'book', title: 'نازنین افشار', text: 'دبیر فرهنگ و هنر' },
			{ icon: 'flask', title: 'دکتر آرش مهرپویا', text: 'دبیر علم و فناوری' },
			{ icon: 'camera', title: 'نیما کاوه', text: 'سردبیر عکس' },
			{ icon: 'globe', title: 'سارا قلی‌زاده', text: 'دبیر سرویس جهان' },
		], { columns: '3', style: 'cards', layout: 'grid' }),
	]),
];

const about = [
	L.pageHead('درباره‌ی ما', 'بیست‌وپنج سال،\n*هر روز یک شماره*', 'روزنامه‌ی امروز از ۱۳۸۰ هر صبح منتشر شده است؛ مستقل، دقیق و منصف.'),
	section({ space: 'md', gap: 32, width: 1000 }, [
		L.textScrub('ما باور داریم خواننده حق دارد *همه‌ی ماجرا* را بداند؛ بی‌اغراق، بی‌سانسور خبری و با احترام به هوش او.', { size: 'md' }),
		L.imageReveal('room', { ratio: '21-9', reveal: 'clip-up' }),
		L.textEditor('<p>روزنامه‌ی امروز در بهار ۱۳۸۰ با هشت صفحه و سه هزار نسخه آغاز به کار کرد. امروز با بیست‌وچهار صفحه، صدوبیست هزار نسخه و نسخه‌ی آنلاینی که هر روز نیم میلیون نفر می‌خوانند، از روزنامه‌های اصلی کشور است.</p><p>تحریریه‌ی ما هفتاد خبرنگار، دبیر و عکاس دارد که در تهران و دوازده شهر دیگر کار می‌کنند.</p>'),
	]),
];

const contact = [
	L.pageHead('تماس', 'با *تحریریه* در تماس باشید', 'خبر، اصلاحیه، آگهی یا اشتراک؛ پیام شما به بخش مربوط می‌رسد.'),
	section({ space: 'md', gap: 0, width: 1100 }, [
		cols({ widths: [40, 60], gap: 48, align: 'start' }, [
			[L.contactInfo([
				{ icon: 'phone', label: 'تحریریه', value: '۰۲۱ ۶۶۴۰ ۱۲۰۰', link: link('tel:02166401200') },
				{ icon: 'mail', label: 'ایمیل', value: 'news@rooznameh.ir', link: link('mailto:news@rooznameh.ir') },
				{ icon: 'pin', label: 'نشانی', value: 'تهران، خیابان انقلاب، کوچه‌ی روزنامه، پلاک ۱۲', link: link('') },
				{ icon: 'clock', label: 'ساعت کاری', value: 'هر روز، ۸ صبح تا ۱۱ شب', link: link('') },
			], { map: '', map_image: '' })],
			[box('<h3>پیام به تحریریه</h3>'), L.contactForm({ show_phone: 'yes', show_company: '', show_subject: 'yes', button: 'ارسال پیام', success: 'پیام شما به تحریریه رسید.' })],
		]),
	]),
];

/* ---------------- Pages, menus, options ---------------- */

const pages = [
	{ key: 'home', title: 'صفحه‌ی اول', slug: 'home', elementor: home, settings: L.pageSettings({ header: 'hidden' }) },
	{ key: 'archive', title: 'آرشیو', slug: 'archive', elementor: archive, settings: L.pageSettings() },
	{ key: 'sections', title: 'سرویس‌ها', slug: 'sections', elementor: sections, settings: L.pageSettings() },
	{ key: 'subscribe', title: 'اشتراک', slug: 'subscribe', elementor: subscribe, settings: L.pageSettings() },
	{ key: 'advertise', title: 'آگهی', slug: 'advertise', elementor: advertise, settings: L.pageSettings() },
	{ key: 'newsroom', title: 'تحریریه', slug: 'newsroom', elementor: newsroom, settings: L.pageSettings() },
	{ key: 'about', title: 'درباره‌ی ما', slug: 'about', elementor: about, settings: L.pageSettings() },
	{ key: 'contact', title: 'تماس', slug: 'contact', elementor: contact, settings: L.pageSettings() },
	{ key: 'blog', title: 'خبرها', slug: 'news', content: '' },
];

module.exports = {
	manifest: {
		id: 'press',
		order: 5,
		title: 'روزنامه',
		desc: 'روزنامه و مجله‌ی خبری؛ سرتیتر با تاریخ شمسی و شماره‌ی روز، خبرهای روان، خبر اول، ستون‌های خط‌کشی‌شده، نرخ ارز و هوا، آگهی قدیمی، عکس روز، سرمقاله، سرویس‌ها، اشتراک چاپی و دیجیتال در فروشگاه. کاغذ کاهی و مرکب؛ روشن و تیره.',
		kit: 'press',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: ['woocommerce'],
		tags: ['روزنامه', 'مجله', 'خبری', 'فروشگاه اشتراک'],
		pages: pages.filter((p) => p.elementor).map((p) => p.title).concat(['فروشگاه', 'خبرها']),
	},
	content: {
		site: { title: 'روزنامه‌ی امروز', tagline: 'راستی، آگاهی، امید' },
		images, alts, terms, posts, products, pages,
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'روزنامه — صفحه‌ی اول' },
			{ key: 'tpl-mast', type: 'section', page: 'home', index: 1, title: 'روزنامه — سرتیتر و منو' },
			{ key: 'tpl-front', type: 'section', page: 'home', index: 2, title: 'روزنامه — خبر اول و ستون کناری' },
		],
		menus: [
			{
				name: 'روزنامه — منوی اصلی', location: 'primary', items: [
					{ title: 'صفحه‌ی اول', page: 'home' },
					{ title: 'شهر', term: 'c-city' },
					{ title: 'اقتصاد', term: 'c-economy' },
					{ title: 'فرهنگ و هنر', term: 'c-culture' },
					{ title: 'علم و فناوری', term: 'c-science' },
					{ title: 'ورزش', term: 'c-sport' },
					{ title: 'جهان', term: 'c-world' },
					{ title: 'بیشتر', page: 'sections', children: [
						{ title: 'آرشیو', page: 'archive' },
						{ title: 'اشتراک', page: 'subscribe' },
						{ title: 'آگهی', page: 'advertise' },
						{ title: 'تحریریه', page: 'newsroom' },
						{ title: 'درباره‌ی ما', page: 'about' },
						{ title: 'تماس', page: 'contact' },
					] },
				],
			},
			{
				name: 'روزنامه — پابرگ', location: 'footer', items: [
					{ title: 'درباره‌ی ما', page: 'about' },
					{ title: 'تحریریه', page: 'newsroom' },
					{ title: 'اشتراک', page: 'subscribe' },
					{ title: 'آگهی', page: 'advertise' },
					{ title: 'آرشیو', page: 'archive' },
					{ title: 'تماس', page: 'contact' },
				],
			},
		],
		options: {
			header_layout: 'centered',
			header_cart: true,
			header_cta_text: 'اشتراک',
			header_cta_url: '{{page:subscribe}}',
			font_body: 'iransansx',
			font_body_weight: '400',
			font_heading: 'anjoman',
			font_heading_weight: '900',
			footer_about: 'روزنامه‌ی امروز، روزنامه‌ی صبح ایران؛ از ۱۳۸۰ هر روز یک شماره.',
			footer_copyright: 'تمام حقوق برای روزنامه‌ی امروز محفوظ است. نقل مطالب با ذکر منبع آزاد است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }, { network: 'x', url: 'https://x.com/' }],
			reading_time: true,
			mobile_bar: true,
			mobile_bar_text: 'اشتراک',
			mobile_bar_url: '{{page:subscribe}}',
			magnetic: false,
			cursor: 'none',
			preloader: 'bar',
			sound_enabled: false,
			seo_business_type: 'NewsMediaOrganization',
			seo_llms_intro: 'روزنامه‌ی امروز، روزنامه‌ی صبح ایران با خبرهای شهر، اقتصاد، فرهنگ، علم، ورزش، طبیعت و جهان.',
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 3, pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
