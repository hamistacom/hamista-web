/**
 * Demo: Khane-ye Hekmat — reading circles on Persian thought and poetry (Ink kit).
 */
'use strict';

const L = require('../lib');
const { img, link, px, section, cols, heading, button } = L;
const fx = L.fx;

const images = { logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp', astrolabe: 'images/astrolabe.webp' };
for (let i = 1; i <= 6; i++) { images['thinker-' + i] = 'images/thinker-' + i + '.webp'; }
for (let i = 1; i <= 4; i++) { images['essay-' + i] = 'images/essay-' + i + '.webp'; }

const alts = {
	astrolabe: 'طرح خطی اسطرلاب با صفحه‌ی عرض جغرافیایی اصفهان',
	'thinker-1': 'نشان ابن‌سینا', 'thinker-2': 'نشان فردوسی', 'thinker-3': 'نشان خیام',
	'thinker-4': 'نشان مولانا', 'thinker-5': 'نشان سعدی', 'thinker-6': 'نشان حافظ',
};

const VERSES = [
	{ quote: 'توانا بود هر که دانا بود\nز دانش دل پیر برنا بود', name: 'فردوسی', role: 'شاهنامه' },
	{ quote: 'بشنو این نی چون شکایت می‌کند\nاز جدایی‌ها حکایت می‌کند', name: 'مولانا', role: 'مثنوی معنوی، دفتر اول' },
	{ quote: 'بنی‌آدم اعضای یکدیگرند\nکه در آفرینش ز یک گوهرند', name: 'سعدی', role: 'گلستان' },
	{ quote: 'سال‌ها دل طلب جام جم از ما می‌کرد\nوان چه خود داشت ز بیگانه تمنا می‌کرد', name: 'حافظ', role: 'دیوان' },
].map((v) => Object.assign({ rating: '0' }, v));

const CIRCLES = [
	{ title: 'شاهنامه‌خوانی؛ از کیومرث تا فریدون', text: 'بخش پیشدادیان را بیت‌به‌بیت می‌خوانیم و از اسطوره‌ها، زبان و جهان‌بینی فردوسی حرف می‌زنیم.', meta: '۱۲ جلسه · سه‌شنبه‌ها، ۱۸ تا ۲۰' },
	{ title: 'مثنوی معنوی، دفتر اول', text: 'از نی‌نامه تا حکایت پادشاه و کنیزک؛ خواندن آرام، با شرح و گفت‌وگو.', meta: '۱۶ جلسه · شنبه‌ها، ۱۷ تا ۱۹' },
	{ title: 'سهروردی و حکمت اشراق', text: 'رساله‌های کوتاه فارسی شیخ اشراق، «عقل سرخ» و «آواز پر جبرئیل»، با زبانی ساده.', meta: '۸ جلسه · دوشنبه‌ها، ۱۸ تا ۲۰' },
	{ title: 'خیام و پرسش‌های بی‌پاسخ', text: 'رباعی‌ها را کنار زندگی ریاضی‌دان و منجم نیشابوری می‌خوانیم.', meta: '۶ جلسه · پنج‌شنبه‌ها، ۱۰ تا ۱۲' },
];

const THINKERS = [
	{ image: img('thinker-1'), label: 'قرن چهارم و پنجم هجری', title: 'ابن‌سینا', text: 'پزشک و فیلسوفی که «شفا» و «قانون»ش قرن‌ها در شرق و غرب خوانده شد.' },
	{ image: img('thinker-2'), label: 'قرن چهارم هجری', title: 'فردوسی', text: 'سی سال برای شاهنامه رنج برد تا زبان فارسی و یاد ایران زنده بماند.' },
	{ image: img('thinker-3'), label: 'قرن پنجم هجری', title: 'خیام', text: 'ریاضی‌دان و منجمی که در رباعی‌هایش از کوتاهی عمر پرسید.' },
	{ image: img('thinker-4'), label: 'قرن هفتم هجری', title: 'مولانا', text: 'مثنوی را سرود؛ بیش از بیست‌وپنج هزار بیت حکایت و حکمت.' },
	{ image: img('thinker-5'), label: 'قرن هفتم هجری', title: 'سعدی', text: 'گلستان و بوستان را نوشت؛ نثری روان که هنوز در خانه‌ها خوانده می‌شود.' },
	{ image: img('thinker-6'), label: 'قرن هشتم هجری', title: 'حافظ', text: 'غزل فارسی را به اوج رساند؛ دیوانش همدم شب‌های یلدای ماست.' },
];

/* ---------------- Home ---------------- */

const FAQ = [
	['برای شرکت در حلقه‌ها پیش‌زمینه‌ی فلسفه لازم است؟', 'نه. متن هر جلسه یک هفته پیش‌تر فرستاده می‌شود و گفت‌وگو از همان متن شروع می‌شود.'],
	['حلقه‌ها حضوری است یا آنلاین؟', 'حلقه‌های پنجشنبه حضوری در خانه‌ی حکمت است و حلقه‌های یکشنبه آنلاین برگزار می‌شود.'],
	['اگر جلسه‌ای را از دست بدهم؟', 'خلاصه‌ی هر جلسه و فهرست خواندنی‌هایش برای اعضا فرستاده می‌شود.'],
	['عضویت را می‌شود لغو کرد؟', 'بله؛ عضویت فصلی است و پیش از شروع فصل بعد می‌توانید تمدید نکنید.'],
];

const home = [
	L.bleed(L.w('hm-hero', {
		layout: 'monument', title_tag: 'h1', title_size: 'xl', header_align: 'center', title_reveal: 'words',
		eyebrow: 'خانه‌ی حکمت',
		title: 'حکمت',
		desc: 'خانه‌ای برای خواندن آرام متن‌هایی که هزار سال است با ما حرف می‌زنند؛ از شاهنامه تا مثنوی، از ابن‌سینا تا سهروردی.',
		btn1_text: 'حلقه‌های این فصل', btn1_link: link('{{page:circles}}'), btn1_style: 'primary',
		btn2_text: 'درباره‌ی خانه', btn2_link: link('{{page:about}}'), btn2_style: 'secondary',
		media_type: 'image', image: img('astrolabe'), object_turn: 'yes', height: 'screen', decor: '', hint: '',
	})),
	section({ space: 'md', width: 980 }, [
		L.textScrub('حکمت در سنت ما فقط دانستن نبود؛ *شیوه‌ای از زیستن* بود. در خانه‌ی حکمت متن‌های کهن را آهسته، با هم و از نو می‌خوانیم تا ببینیم امروز با ما *چه می‌گویند*.', { eyebrow: 'چرا می‌خوانیم', size: 'lg' }),
	]),
	section({ space: 'md', scheme: 'surface', gap: 36 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[
				heading({ eyebrow: 'حلقه‌های این فصل', title: 'چهار متن،\n*چهار فصل*', desc: 'هر حلقه حداکثر چهارده نفر دارد و حضوری در تهران و هم‌زمان آنلاین برگزار می‌شود.' }),
				button('برنامه‌ی کامل حلقه‌ها', '{{page:circles}}', 'secondary'),
			],
			[L.features(CIRCLES.map((c) => Object.assign({ icon: '' }, c)), { layout: 'list', style: 'plain', icon_style: 'plain', numbered: 'yes' })],
		]),
	]),
	L.hscroll({
		eyebrow: 'همنشینان',
		title: 'شش نام،\n*هزار سال*',
		desc: 'هر فصل یکی از این بزرگان را از نزدیک می‌خوانیم؛ نه برای ستایش، برای گفت‌وگو.',
		items: THINKERS.map((t) => Object.assign({ link: link('{{page:circles}}') }, t)),
		card_size: 'md',
		card_style: 'overlay',
		scheme: '',
		btn1_text: '',
	}),
	section({ space: 'md', gap: 36 }, [
		heading({ eyebrow: 'بیت‌ها', title: 'آنچه *می‌ماند*', header_align: 'center' }),
		L.testimonials(VERSES, { layout: 'carousel' }),
	]),
	section({ space: 'md', scheme: 'surface', gap: 36 }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'جستارها', title: 'یادداشت‌هایی از *حلقه‌ها*' })],
			[button('همه‌ی جستارها', '{{blog}}', 'secondary', { _flex_align_self: 'flex-end' })],
		]),
		L.posts({ count: 4, layout: 'compact', excerpt: '' }),
	]),
	L.cta({
		eyebrow: 'نامه‌ی جمعه‌ها',
		title: 'هر هفته،\n*یک متن کوتاه*',
		desc: 'یک بیت، یک بند از متنی کهن با شرحی کوتاه و برنامه‌ی نشست‌های هفته؛ جمعه‌ها صبح در ایمیل شما.',
		action: 'email',
		look: 'inverse',
		decor: '',
		note: 'هر وقت بخواهید با یک کلیک لغو می‌شود.',
	}),
];

/* ---------------- Circles ---------------- */

const circles = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'حلقه‌ها', title: 'حلقه‌های *خوانش*', title_tag: 'h1', title_size: 'xl', desc: 'حلقه‌ها حضوری در تهران و هم‌زمان آنلاین برگزار می‌شوند. ظرفیت هر حلقه چهارده نفر است و پیش‌نیاز خاصی ندارد؛ فقط حوصله‌ی خواندن.' }),
	]),
	section({ space: 'md' }, [
		L.features(CIRCLES.map((c) => Object.assign({ icon: '', link: link('{{page:contact}}') }, c)), { layout: 'list', style: 'plain', icon_style: 'plain', numbered: 'yes', link_text: 'ثبت‌نام' }),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *ثبت‌نام*' })],
			[L.faq([
				['برای شرکت باید متن را از قبل خوانده باشم؟', 'نه. هر جلسه متن را با هم می‌خوانیم و شرح می‌دهیم. فقط بخش هفته‌ی بعد را برای مرور به شما می‌دهیم.'],
				['هزینه‌ی هر حلقه چقدر است؟', 'از ۱٫۲ تا ۲٫۸ میلیون تومان برای کل دوره، بسته به تعداد جلسه‌ها. دانشجوها نیم‌بها ثبت‌نام می‌کنند.'],
				['اگر جلسه‌ای را از دست بدهم؟', 'صدا و یادداشت هر جلسه تا پایان دوره در حساب کاربری شما در دسترس است.'],
			])],
		]),
	]),
];

/* ---------------- About ---------------- */

const about = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'درباره‌ی خانه', title: 'جایی برای\n*خواندن با هم*', title_tag: 'h1', title_size: 'xl' }),
	]),
	section({ space: 'md' }, [
		cols({ widths: [50, 50], gap: 64, align: 'center' }, [
			[L.textScrub('خانه‌ی حکمت را در سال ۱۳۹۸ چند معلم ادبیات و فلسفه راه انداختند؛ در اتاقی کوچک با یک میز بلند و ده صندلی. امروز صدها نفر در حلقه‌ها نشسته‌اند، اما میز هنوز *همان قدر* است.', { size: 'md' })],
			[L.imageReveal('astrolabe', { ratio: '1-1', reveal: 'fade', parallax: px(0.2) })],
		]),
	]),
	section({ space: 'md', scheme: 'surface', gap: 36 }, [
		heading({ eyebrow: 'اصول ما', title: 'سه *قرار*' }),
		L.features([
			{ icon: 'book', title: 'متن، پیش از شرح', text: 'هر جلسه با خواندن خود متن شروع می‌شود؛ شرح‌ها بعد می‌آیند.' },
			{ icon: 'users', title: 'حلقه‌های کوچک', text: 'چهارده نفر؛ آن‌قدر کم که همه حرف بزنند، آن‌قدر زیاد که صداها گوناگون باشند.' },
			{ icon: 'heart', title: 'بی‌شتاب', text: 'برای هر متن همان‌قدر وقت می‌گذاریم که لازم دارد؛ نه کمتر.' },
		], { layout: 'grid', style: 'plain', columns: '3', icon_style: 'plain' }),
	]),
	section({ space: 'md' }, [
		L.counters([
			{ value: 7, label: 'سال' },
			{ value: 46, label: 'حلقه‌ی برگزارشده' },
			{ value: 820, label: 'هم‌خوان' },
			{ value: 14, label: 'نفر در هر حلقه' },
		], { style: 'plain', columns: '4' }),
	]),
];

/* ---------------- Contact ---------------- */

const contact = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'نشانی', title: 'در خانه *باز* است', title_tag: 'h1', title_size: 'xl', desc: 'شنبه تا چهارشنبه، ساعت ۱۰ تا ۲۰. برای دیدن کتابخانه یا گفت‌وگو درباره‌ی حلقه‌ها خوش آمدید.' }),
	]),
	section({ space: 'md' }, [
		cols({ widths: [40, 60], gap: 56 }, [
			[L.contactInfo([
				{ icon: 'pin', label: 'نشانی', value: 'تهران، خیابان انقلاب، کوچه‌ی بهار، پلاک ۸، طبقه‌ی دوم', link: link('') },
				{ icon: 'phone', label: 'تلفن', value: '۰۲۱-۶۶۴۱۲۸۷۰', link: link('tel:+982166412870') },
				{ icon: 'mail', label: 'ایمیل', value: 'salam@khanehekmat.ir', link: link('mailto:salam@khanehekmat.ir') },
				{ icon: 'telegram', label: 'تلگرام', value: '@khanehekmat', link: link('https://t.me/', true) },
			])],
			[L.contactForm({ show_phone: 'yes', label_phone: 'شماره‌ی موبایل', show_subject: 'yes', label_subject: 'کدام حلقه؟', label_name: 'نام شما', label_email: 'ایمیل', label_message: 'پیام', button: 'ارسال', success: 'پیامتان رسید؛ به‌زودی پاسخ می‌دهیم.' })],
		]),
	]),
];

/* ---------------- Essays ---------------- */

const terms = [
	{ key: 'cat-essay', taxonomy: 'category', name: 'جستار', slug: 'essays' },
	{ key: 'cat-notes', taxonomy: 'category', name: 'یادداشت حلقه', slug: 'circle-notes' },
];

const posts = [
	{
		key: 'ney', title: 'نی‌نامه؛ هجده بیتی که مثنوی با آن آغاز می‌شود', slug: 'ney-nameh', image: 'essay-1', terms: ['cat-essay'], days_ago: 3,
		excerpt: 'چرا مولانا کتابش را با شکایت نی آغاز کرد؟',
		content: L.article([
			'مثنوی با هجده بیت آغاز می‌شود که به «نی‌نامه» مشهور است. نی از نیستان بریده شده و از جدایی شکایت می‌کند؛ و شارحان بسیاری نی را تمثیل جان آدمی دانسته‌اند که از اصل خود دور افتاده است.',
			['q', 'بشنو این نی چون شکایت می‌کند / از جدایی‌ها حکایت می‌کند', 'مولانا، مثنوی معنوی'],
			'در حلقه‌ی این فصل، نی‌نامه را بیت‌به‌بیت خواندیم و از خود پرسیدیم: امروز ما از چه چیزی جدا افتاده‌ایم؟',
		]),
	},
	{
		key: 'kayumars', title: 'کیومرث؛ نخستین پادشاه، نخستین سوگ', slug: 'kayumars', image: 'essay-2', terms: ['cat-notes'], days_ago: 10,
		excerpt: 'شاهنامه با پادشاهی آغاز می‌شود که فرزندش را از دست می‌دهد.',
		content: L.article([
			'در شاهنامه، کیومرث نخستین پادشاه است و نخستین سوگ را هم او تجربه می‌کند: سیامک، فرزندش، به دست دیو کشته می‌شود.',
			'حلقه‌ی شاهنامه‌خوانی این هفته درباره‌ی این پرسش گفت‌وگو کرد که چرا حماسه‌ی ملی ما با سوگ آغاز می‌شود.',
		]),
	},
	{
		key: 'red-intellect', title: '«عقل سرخ» سهروردی را چطور بخوانیم', slug: 'red-intellect', image: 'essay-3', terms: ['cat-essay'], days_ago: 18,
		excerpt: 'رساله‌ای کوتاه به فارسی، پر از رمز و تمثیل.',
		content: L.article([
			'«عقل سرخ» یکی از رساله‌های فارسی شیخ شهاب‌الدین سهروردی است؛ داستانی رمزی درباره‌ی بازی که از بند رها می‌شود و با پیری سرخ‌روی دیدار می‌کند.',
			['ul', ['آهسته بخوانید؛ هر تصویر معنایی دارد.', 'رمزها را با هم مقایسه کنید؛ سهروردی آن‌ها را در رساله‌های دیگر هم به کار می‌برد.', 'دنبال یک معنای واحد نباشید.']],
		]),
	},
	{
		key: 'khayyam', title: 'خیام منجم، خیام شاعر', slug: 'khayyam', image: 'essay-4', terms: ['cat-essay'], days_ago: 26,
		excerpt: 'مردی که تقویم جلالی را محاسبه کرد و از ناپایداری جهان نوشت.',
		content: L.article([
			'عمر خیام نیشابوری در روزگار خود بیش از هر چیز ریاضی‌دان و منجم بود و در گروهی که تقویم جلالی را تدوین کردند حضور داشت.',
			'رباعی‌هایی که به او نسبت داده می‌شود، از جهانی ناپایدار و عمری کوتاه حرف می‌زنند؛ و پرسش‌هایی که هنوز تازه‌اند.',
		]),
	},
];

const program = [
	L.pageHead('برنامه‌ی فصل', 'پاییز ۱۴۰۵،\n*دوازده نشست*', 'هر حلقه یک متن، یک پرسش و دو ساعت گفت‌وگو؛ پنجشنبه‌ها حضوری و یکشنبه‌ها آنلاین.'),
	fx(section({ space: 'md', gap: 40 }, [
		L.steps([
			{ marker: 'مهر', icon: 'book', title: 'رواقیان', text: 'اپیکتتوس و مارکوس آورلیوس؛ آنچه در اختیار ماست.' },
			{ marker: 'آبان', icon: 'book', title: 'خیام و سعدی', text: 'زمان، شادی و اندازه نگه داشتن.' },
			{ marker: 'آذر', icon: 'book', title: 'سهروردی', text: 'نور، دانستن و دیدن.' },
		], { layout: 'h', cards: 'yes' }),
	]), { cards: 'cascade' }),
	section({ space: 'sm', zoom: 'expand', zoomAmount: 0.2, zoomInner: true, zoomRadius: 4 }, [
		L.imageReveal('essay-2', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'عضویت', title: 'یک فصل،\n*یک حلقه*', header_align: 'center' }),
		L.pricing([
			{ name: 'آنلاین', desc: 'یکشنبه‌ها، ساعت ۲۰', price: '۱٫۸', price_alt: '', unit: 'میلیون تومان', period: 'فصلی', features: 'دوازده نشست\nمتن‌ها و خلاصه‌ها\nدسترسی به بایگانی', btn_text: 'ثبت‌نام', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
			{ name: 'حضوری', desc: 'پنجشنبه‌ها، ساعت ۱۸', price: '۳٫۲', price_alt: '', unit: 'میلیون تومان', period: 'فصلی', features: 'دوازده نشست در خانه\nمتن‌های چاپی\nچای و گفت‌وگوی پس از جلسه', btn_text: 'ثبت‌نام', btn_link: link('{{page:contact}}'), featured: 'yes', badge: 'ظرفیت محدود' },
		], { switch_off: '', switch_on: '' }),
	]), { tone: 'surface' }),
];

const faqPage = [
	L.pageHead('پرسش‌های متداول', 'پیش از *شروع*', 'اگر جوابتان این‌جا نیست، با ما تماس بگیرید.'),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [30, 70], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'آنچه *می‌پرسند*', title_size: 'md' })],
			[L.faq(FAQ, { style: 'lines' })],
		]),
	]),
];

module.exports = {
	manifest: {
		id: 'hekmat',
		order: 9,
		title: 'خانه‌ی حکمت',
		desc: 'مؤسسه‌ی فرهنگی و حلقه‌های خوانش؛ تیره و فاخر با واژه‌ی غول‌آسا، اسطرلاب چرخان و نشان‌های تایپوگرافیک.',
		kit: 'ink',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: [],
		tags: ['فرهنگی', 'آموزشی', 'ادبیات'],
		pages: ['خانه', 'حلقه‌ها', 'درباره‌ی خانه', 'نشانی', 'جستارها', 'برنامه‌ی فصل', 'پرسش‌های متداول'],
	},
	content: {
		site: { title: 'خانه‌ی حکمت', tagline: 'حلقه‌های خوانش ادبیات و حکمت ایرانی' },
		images, alts, terms, posts,
		pages: [
			{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings({ header: 'transparent', light: 'start', extra: { hm_page_light_a: '#d8b46c', hm_page_light_b: '#8a6a2f' } }) },
			{ key: 'circles', title: 'حلقه‌ها', slug: 'circles', elementor: circles, settings: L.pageSettings() },
			{ key: 'about', title: 'درباره‌ی خانه', slug: 'about', elementor: about, settings: L.pageSettings() },
			{ key: 'program', title: 'برنامه‌ی فصل', slug: 'season', elementor: program, settings: L.pageSettings() },
			{ key: 'faq', title: 'پرسش‌های متداول', slug: 'faq', elementor: faqPage, settings: L.pageSettings() },
			{ key: 'contact', title: 'نشانی', slug: 'contact', elementor: contact, settings: L.pageSettings() },
			{ key: 'blog', title: 'جستارها', slug: 'essays', content: '' },
		],
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'خانه‌ی حکمت — صفحه‌ی اصلی' },
			{ key: 'tpl-hero', type: 'section', page: 'home', index: 0, title: 'خانه‌ی حکمت — هیروی یادمانی' },
			{ key: 'tpl-circles', type: 'section', page: 'home', index: 2, title: 'خانه‌ی حکمت — فهرست شماره‌دار' },
			{ key: 'tpl-thinkers', type: 'section', page: 'home', index: 3, title: 'خانه‌ی حکمت — نشان‌ها (اسکرول افقی)' },
		],
		menus: [
			{
				name: 'خانه‌ی حکمت — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'برنامه‌ی فصل', page: 'program' },
					{ title: 'حلقه‌ها', page: 'circles' },
					{ title: 'جستارها', page: 'blog' },
					{ title: 'درباره‌ی خانه', page: 'about' },
					{ title: 'نشانی', page: 'contact' },
				],
			},
			{
				name: 'خانه‌ی حکمت — پابرگ', location: 'footer', items: [
					{ title: 'برنامه‌ی فصل', page: 'program' },
					{ title: 'پرسش‌های متداول', page: 'faq' },
					{ title: 'حلقه‌ها', page: 'circles' },
					{ title: 'جستارها', page: 'blog' },
					{ title: 'درباره‌ی خانه', page: 'about' },
					{ title: 'نشانی', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 32,
			header_layout: 'centered',
			header_cart: false,
			header_cta_text: 'ثبت‌نام',
			header_cta_url: '{{page:circles}}',
			color_scheme: 'dark',
			font_body: 'doran',
			font_heading: 'doran',
			font_heading_weight: '700',
			footer_about: 'خانه‌ی حکمت، حلقه‌های خوانش ادبیات و حکمت ایرانی؛ حضوری در تهران و هم‌زمان آنلاین.',
			footer_copyright: 'تمام حقوق برای خانه‌ی حکمت محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }, { network: 'youtube', url: 'https://youtube.com/' }],
			mobile_bar: true,
			mobile_bar_text: 'ثبت‌نام در حلقه‌ها',
			mobile_bar_url: '{{page:circles}}',
			cursor: 'ring',
			sound_enabled: true,
			sound_default: true,
			sound_theme: 'glass',
			sound_volume: 18,
			sound_hover: false,
		},
		front_page: 'home',
		posts_page: 'blog',
	},
};
