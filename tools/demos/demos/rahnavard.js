/**
 * Demo: Rahnavard — slow, small-group journeys across Iran (Voyage kit).
 */
'use strict';

const L = require('../lib');
const { img, link, px, section, cols, heading, button } = L;
const fx = L.fx;

const images = { logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp', film: 'images/film.mp4' };
for (let i = 1; i <= 4; i++) { images['slide-' + i] = 'images/slide-' + i + '.webp'; images['tour-' + i] = 'images/tour-' + i + '.webp'; images['journal-' + i] = 'images/journal-' + i + '.webp'; }
for (let i = 1; i <= 7; i++) { images['dest-' + i] = 'images/dest-' + i + '.webp'; }
images['wide-1'] = 'images/wide-1.webp';
images['wide-2'] = 'images/wide-2.webp';

const alts = {
	'slide-1': 'آسمان غروب بر آب آرام', 'slide-2': 'تپه‌های شنی کویر لوت در گرگ‌ومیش',
	'slide-3': 'مه صبحگاهی بر جنگل‌های هیرکانی', 'slide-4': 'آسمان عصر بر دشت مرودشت',
	'wide-1': 'آسمان پرستاره‌ی کویر', 'wide-2': 'غروب بر دشت مرودشت',
	film: 'فیلم کوتاه ره‌نورد',
};

const TOURS = [
	{
		key: 'desert', image: img('tour-2'), eyebrow: '۶ روز · آبان تا اسفند', title: 'کویر و کاروانسرا',
		text: 'از کاشان تا مرنجاب و یزد؛ روزها در کوچه‌های خشتی و شب‌ها در کاروانسرا، زیر آسمانی که در شهر نمی‌بینید.',
		points: 'دو شب اقامت در کاروانسرای صفوی\nرصد ستارگان با راهنمای نجوم\nاز ۲۸٫۵ میلیون تومان برای هر نفر',
	},
	{
		key: 'zagros', image: img('tour-1'), eyebrow: '۷ روز · اردیبهشت و خرداد', title: 'زاگرس، همراه با کوچ',
		text: 'چند روز همراه کوچ بهاره‌ی عشایر قشقایی؛ سیاه‌چادر، نان تازه روی ساج و دره‌هایی که تازه سبز شده‌اند.',
		points: 'دو شب مهمان سیاه‌چادر\nپیاده‌روی سبک هر روز\nاز ۳۲ میلیون تومان برای هر نفر',
	},
	{
		key: 'gulf', image: img('tour-3'), eyebrow: '۵ روز · آذر تا اسفند', title: 'قشم و هرمز',
		text: 'جزیره‌های رنگی خلیج فارس: ساحل سرخ هرمز، دره‌ی ستارگان و قایق‌سواری آرام در جنگل حرا.',
		points: 'اقامتگاه بومی کنار دریا\nغذای دریایی به دست آشپزهای محلی\nاز ۲۴ میلیون تومان برای هر نفر',
	},
	{
		key: 'alborz', image: img('tour-4'), eyebrow: '۴ روز · تیر تا شهریور', title: 'دامنه‌های البرز',
		text: 'روزهای خنک تابستان در روستاهای کوهستانی البرز؛ چشمه، باغ‌های گردو و طلوع دماوند از پشت پنجره.',
		points: 'پیاده‌روی تا ارتفاع ۳٬۰۰۰ متر\nمناسب همه‌ی سن‌ها و سطح‌ها\nاز ۱۸ میلیون تومان برای هر نفر',
	},
];
const tourCards = (btn) => TOURS.map(({ key, ...t }) => Object.assign(t, { btn_text: btn, btn_link: link('{{page:contact}}') }));

const QUOTES = [
	{ quote: 'سومین سفرم با ره‌نورد بود. هیچ‌وقت حس نکردم در «تور» هستم؛ بیشتر شبیه سفر با چند دوست بود که راه را خوب بلدند.', name: 'شیرین مقدم', role: 'کویر و کاروانسرا، آبان ۱۴۰۴' },
	{ quote: 'شبی که در سیاه‌چادر ماندیم و مادر خانواده برایمان نان پخت را هیچ‌وقت فراموش نمی‌کنم. برنامه‌ریزی بی‌نقص بود و هیچ عجله‌ای نداشتیم.', name: 'آرش فرهمند', role: 'زاگرس، همراه با کوچ' },
	{ quote: 'با پدر و مادرم رفتیم و نگران سختی راه بودیم. راهنما همه‌چیز را با حوصله برای سن آن‌ها تنظیم کرد.', name: 'نگار صدری', role: 'دامنه‌های البرز' },
	{ quote: 'گروه هشت‌نفره دقیقاً همان چیزی بود که می‌خواستم. هر جا دلمان می‌خواست بیشتر می‌ماندیم.', name: 'کاوه رستگار', role: 'قشم و هرمز' },
];

const FAQ = [
	['گروه‌ها چند نفره‌اند؟', 'حداکثر هشت نفر، به‌جز راهنما. برای خانواده‌ها و گروه‌های دوستانه، سفر اختصاصی هم برگزار می‌کنیم.'],
	['قیمت تور شامل چه چیزهایی است؟', 'اقامت، همه‌ی جابه‌جایی‌های داخل مسیر، صبحانه و شام، بلیت بازدیدها و راهنمای بومی. بلیت رفت‌وبرگشت تا مبدأ تور جداگانه حساب می‌شود.'],
	['برای سفر به آمادگی بدنی خاصی نیاز است؟', 'بیشتر مسیرهای ما پیاده‌روی‌های سبک دارند. سطح سختی هر تور را در برنامه‌اش نوشته‌ایم و پیش از ثبت‌نام با شما هماهنگ می‌کنیم.'],
	['اگر نتوانم بیایم، هزینه برمی‌گردد؟', 'تا سی روز پیش از حرکت، کل مبلغ و تا ده روز پیش از حرکت، نیمی از آن برگردانده می‌شود. می‌توانید جایتان را به دوستتان هم بدهید.'],
	['برای سفر اختصاصی چقدر زودتر خبر بدهیم؟', 'دست‌کم شش هفته پیش از سفر؛ برای فصل‌های شلوغ مثل نوروز، سه ماه.'],
	['بیمه‌ی مسافرتی در قیمت هست؟', 'بله؛ بیمه‌ی پایه‌ی مسافرتی در همه‌ی تورها هست و بیمه‌ی تکمیلی را هم می‌توانید اضافه کنید.'],
];

/* ---------------- Home ---------------- */

const home = [
	L.showcase({
		eyebrow: 'ره‌نورد · سفرهای آهسته در ایران',
		title: 'سفری\n*بی‌پایان*',
		video_text: 'تماشای فیلم',
		video: '{{img:film}}',
		btn_text: 'تورهای این فصل',
		btn_url: '{{page:tours}}',
		slides: [
			{ image: img('slide-1'), label: 'اصفهان', text: 'نصف جهان؛ میدانی از گنبدهای کاشی، بازارهای سرپوشیده و پل‌هایی که غروب‌ها روشن می‌شوند.' },
			{ image: img('slide-2'), label: 'کویر لوت', text: 'گرم‌ترین نقطه‌ی زمین و یکی از تاریک‌ترین آسمان‌های شب؛ کلوت‌ها در نور ماه.' },
			{ image: img('slide-3'), label: 'جنگل هیرکانی', text: 'جنگل‌های چند میلیون‌ساله‌ی شمال، در مه صبحگاهی و صدای رودخانه.' },
			{ image: img('slide-4'), label: 'تخت جمشید', text: 'ستون‌های پارسه در آفتاب عصر؛ جایی که تاریخ هنوز ایستاده است.' },
		],
		stats: [
			{ value: '۲٬۰۰۰', label: 'اثر تاریخی' },
			{ value: '۲۸', label: 'میراث جهانی' },
			{ value: '۳۱', label: 'استان' },
		],
		social: [
			{ label: 'اینستاگرام', url: 'https://instagram.com/' },
			{ label: 'آپارات', url: 'https://www.aparat.com/' },
			{ label: 'تلگرام', url: 'https://t.me/' },
		],
	}),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [38, 62], gap: 64 }, [
			[heading({ eyebrow: 'ره‌نورد', title: 'ایران را\n*آهسته* ببینید' })],
			[L.textScrub('گروه‌های کوچک را به جاهایی می‌بریم که اتوبوس‌های بزرگ نمی‌روند. شب را در خانه‌های قدیمی می‌مانیم، با مردم همان محل غذا می‌خوریم و برای هر شهر *وقت کافی* می‌گذاریم. سفر برای ما فهرست جاهای دیدنی نیست؛ *فرصت دیدن* است.', { size: 'md' })],
		]),
		L.counters([
			{ value: 12, label: 'سال سفر در ایران' },
			{ value: 8, label: 'نفر، بزرگ‌ترین گروه ما' },
			{ value: 46, label: 'مسیر در ۱۹ استان' },
			{ value: 98, suffix: '٪', label: 'مسافر راضی' },
		], { style: 'plain', columns: '4' }),
	]),
	L.hscroll({
		eyebrow: 'مقصدها',
		title: 'هفت سرزمین،\n*یک ایران*',
		desc: 'از کویر تا جنگل و دریا؛ در هر منطقه با راهنمایی سفر می‌کنید که همان‌جا بزرگ شده است.',
		btn1_text: 'همه‌ی مقصدها', btn1_link: link('{{page:tours}}'),
		items: [
			{ image: img('dest-1'), label: 'اصفهان', title: 'نصف جهان', text: 'میدان نقش جهان، پل‌های زاینده‌رود و بازاری که هنوز زنده است.', link: link('{{page:tours}}') },
			{ image: img('dest-2'), label: 'کرمان', title: 'کویر لوت', text: 'کلوت‌ها، شن‌های روان و آسمانی پر از ستاره.', link: link('{{page:tours}}') },
			{ image: img('dest-3'), label: 'گیلان و مازندران', title: 'جنگل هیرکانی', text: 'روستاهای پلکانی، مه صبحگاهی و چای تازه‌دم.', link: link('{{page:tours}}') },
			{ image: img('dest-4'), label: 'هرمزگان', title: 'قشم و هرمز', text: 'دره‌ی ستارگان، جنگل حرا و آب فیروزه‌ای خلیج فارس.', link: link('{{page:tours}}') },
			{ image: img('dest-5'), label: 'مازندران', title: 'البرز و دماوند', text: 'روستاهای کوهستانی، چشمه‌ها و تابستان خنک.', link: link('{{page:tours}}') },
			{ image: img('dest-6'), label: 'کاشان', title: 'کویر مرنجاب', text: 'دریاچه‌ی نمک، کاروانسرای صفوی و شبی زیر ستاره‌ها.', link: link('{{page:tours}}') },
			{ image: img('dest-7'), label: 'گیلان', title: 'ساحل کاسپین', text: 'طلوع روی دریا، بازار ماهی و چای‌خانه‌های لاهیجان.', link: link('{{page:tours}}') },
		],
		card_size: 'md',
		card_style: 'overlay',
		btn1_style: 'secondary',
	}),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'تورهای این فصل', title: 'چهار مسیر،\n*چهار حال‌وهوا*' })],
			[button('تقویم کامل تورها', '{{page:tours}}', 'secondary', { _flex_align_self: 'flex-end' })],
		]),
		L.stack(tourCards('جزئیات و رزرو')),
	]),
	L.scrollZoom({
		eyebrow: 'شب‌های کویر',
		title: 'آسمانی که *در شهر نمی‌بینید*',
		image: img('wide-1'),
		start_scale: px(0.5),
		radius: px(6),
		length: px(2),
		o_title: 'شب را زیر *ستاره‌ها* بمانید.',
		o_desc: 'در تور کویر و کاروانسرا، دو شب دور از نور شهر می‌مانیم و با راهنمای نجوم، آسمان را از نزدیک می‌خوانیم.',
		btn1_text: 'برنامه‌ی تور کویر', btn1_link: link('{{page:tours}}'), btn1_style: 'inverse',
	}),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [38, 62], gap: 64 }, [
			[heading({ eyebrow: 'شیوه‌ی سفر ما', title: 'کم‌شتاب،\n*دقیق*، صمیمی', desc: 'هر سفر را خودمان چند بار رفته‌ایم و جزئیاتش را با مردم همان محل ساخته‌ایم.' })],
			[L.features([
				{ icon: 'users', title: 'گروه‌های کوچک', text: 'حداکثر هشت نفر؛ تا هر کس جای خودش را داشته باشد و هیچ‌کس در صف نماند.', meta: '۸ نفر' },
				{ icon: 'compass', title: 'راهنمای بومی', text: 'در هر منطقه، راهنمایی که همان‌جا بزرگ شده و راه‌های نرفته را می‌شناسد.', meta: '۲۲ راهنما' },
				{ icon: 'tent', title: 'اقامت در خانه‌های قدیمی', text: 'خانه‌های تاریخی، کاروانسراها و اقامتگاه‌های بومی، به جای هتل‌های زنجیره‌ای.', meta: '۳۴ اقامتگاه' },
				{ icon: 'clock', title: 'برنامه‌ی بی‌عجله', text: 'هر روز یک یا دو مقصد، با وقت آزاد برای قدم زدن، عکاسی و نشستن.', meta: 'آهسته' },
			], { layout: 'list', style: 'plain', icon_style: 'plain', columns: '2' })],
		]),
	]),
	section({ space: 'md', scheme: 'surface', gap: 40 }, [
		heading({ eyebrow: 'از زبان مسافرها', title: 'سفرهایی که *تمام نمی‌شوند*' }),
		L.testimonials(QUOTES, { layout: 'carousel' }),
	]),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'سفرنامه', title: 'یادداشت‌هایی *از راه*' })],
			[button('همه‌ی یادداشت‌ها', '{{blog}}', 'secondary', { _flex_align_self: 'flex-end' })],
		]),
		L.posts({ count: 3, layout: 'grid', columns: '3' }),
	]),
	L.cta({
		eyebrow: 'سفر اختصاصی',
		title: 'سفر بعدی را\n*با هم* بسازیم.',
		desc: 'برای خانواده، دوستان یا یک همراه؛ مسیر، تاریخ و سرعت سفر را با هم تنظیم می‌کنیم.',
		btn1_text: 'مشاوره‌ی رایگان سفر', btn1_link: link('{{page:contact}}'),
		btn2_text: 'تورهای آماده', btn2_link: link('{{page:tours}}'),
		look: 'image',
		image: img('wide-2'),
		decor: '',
		note: '',
	}),
];

/* ---------------- Tours ---------------- */

const tours = [
	section({ space: 'md', bottom0: true }, [
		cols({ widths: [55, 45], align: 'flex-end', gap: 64 }, [
			[heading({ eyebrow: 'تورها', title: 'تورهای *ره‌نورد*', title_tag: 'h1', title_size: 'xl' })],
			[L.textEditor('<p>هر تور را چند بار خودمان رفته‌ایم پیش از آنکه به کسی پیشنهادش کنیم. ظرفیت هر گروه هشت نفر است؛ برای رزرو یا سفر اختصاصی پیام بدهید.</p>')],
		]),
	]),
	section({ space: 'md' }, [L.stack(tourCards('درخواست رزرو'))]),
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *ثبت‌نام*' }), button('پرسش دیگری دارید؟', '{{page:contact}}', 'secondary')],
			[L.faq(FAQ)],
		]),
	]),
];

/* ---------------- About ---------------- */

const about = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'درباره‌ی ره‌نورد', title: 'از یک سفر\n*شروع شد*', title_tag: 'h1', title_size: 'xl' }),
	]),
	section({ space: 'md' }, [
		cols({ widths: [50, 50], gap: 64, align: 'center' }, [
			[L.imageReveal('dest-6', { ratio: '4-3', reveal: 'clip-up', parallax: px(0.25) })],
			[
				L.textScrub('ره‌نورد را دو دوست راه انداختند که سال‌ها با کوله‌پشتی در ایران سفر کرده بودند و هر بار از خودشان می‌پرسیدند چرا تورها این‌قدر *شتاب‌زده‌اند*. امروز تیم ما بیست‌ودو راهنمای بومی دارد و هنوز هر مسیر را *پیش از همه، خودمان* می‌رویم.', { size: 'md' }),
			],
		]),
	]),
	section({ space: 'md', scheme: 'surface', gap: 40 }, [
		heading({ eyebrow: 'به چه باور داریم', title: 'سه *اصل* که عوض نمی‌شود' }),
		L.features([
			{ icon: 'leaf', title: 'سفر مسئولانه', text: 'اقامت و غذا را از خانواده‌های محلی می‌گیریم تا درآمد سفر در همان منطقه بماند.' },
			{ icon: 'users', title: 'گروه کوچک', text: 'هیچ گروهی بیشتر از هشت مسافر ندارد؛ نه برای فروش بیشتر، نه در شلوغ‌ترین فصل.' },
			{ icon: 'heart', title: 'احترام به میزبان', text: 'هر مسیر را با مردم همان محل طراحی می‌کنیم و قواعد میزبان را پیش از سفر برایتان می‌گوییم.' },
		], { layout: 'grid', style: 'plain', icon_style: 'plain', columns: '3' }),
	]),
	section({ space: 'md' }, [
		L.counters([
			{ value: 12, label: 'سال سفر' },
			{ value: 22, label: 'راهنمای بومی' },
			{ value: 3400, label: 'مسافر' },
			{ value: 34, label: 'اقامتگاه همکار' },
		], { style: 'plain', columns: '4' }),
	]),
	L.cta({
		title: 'آماده‌ی *رفتن* هستید؟',
		desc: 'تقویم تورهای این فصل را ببینید یا برای سفر اختصاصی با ما تماس بگیرید.',
		btn1_text: 'تورهای این فصل', btn1_link: link('{{page:tours}}'),
		btn2_text: 'تماس', btn2_link: link('{{page:contact}}'),
		look: 'inverse',
		decor: '',
		note: '',
	}),
];

/* ---------------- Contact ---------------- */

const contact = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'تماس با ره‌نورد', title: 'از *کجا* شروع کنیم؟', title_tag: 'h1', title_size: 'xl', desc: 'بگویید چه زمانی، با چند نفر و با چه حال‌وهوایی می‌خواهید سفر کنید؛ ظرف یک روز کاری با پیشنهاد مسیر پاسخ می‌دهیم.' }),
	]),
	section({ space: 'md' }, [
		cols({ widths: [40, 60], gap: 56 }, [
			[L.contactInfo([
				{ icon: 'whatsapp', label: 'واتس‌اپ', value: '۰۹۱۲ ۴۴۰ ۲۶۱۰', link: link('https://wa.me/989124402610', true) },
				{ icon: 'phone', label: 'تلفن', value: '۰۲۱-۸۸۶۵۴۳۲۰', link: link('tel:+982188654320') },
				{ icon: 'mail', label: 'ایمیل', value: 'safar@rahnavard.ir', link: link('mailto:safar@rahnavard.ir') },
				{ icon: 'pin', label: 'دفتر', value: 'تهران، خیابان ولیعصر، کوچه‌ی بهار، پلاک ۱۲', link: link('') },
			])],
			[L.contactForm({ show_phone: 'yes', label_phone: 'شماره‌ی موبایل', show_subject: 'yes', label_subject: 'کدام تور یا چه سفری؟', label_name: 'نام شما', label_email: 'ایمیل', label_message: 'از سفری که در ذهن دارید بگویید', button: 'ارسال درخواست', success: 'پیامتان رسید. ظرف یک روز کاری با شما تماس می‌گیریم.' })],
		]),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *سفر*' })],
			[L.faq(FAQ)],
		]),
	]),
];

/* ---------------- Journal ---------------- */

const terms = [
	{ key: 'cat-notes', taxonomy: 'category', name: 'سفرنامه', slug: 'travel-notes' },
	{ key: 'cat-guide', taxonomy: 'category', name: 'راهنمای سفر', slug: 'travel-guide' },
];

const posts = [
	{
		key: 'caspian-dawn', title: 'یک صبح در گیلان: طلوع روی کاسپین', slug: 'caspian-dawn', image: 'journal-1', terms: ['cat-notes'], days_ago: 3,
		excerpt: 'ساعت پنج صبح، ساحل خالی است؛ فقط مرغ‌های دریایی و قایق‌هایی که از صید برمی‌گردند.',
		content: L.article([
			'ساعت پنج صبح ساحل خالی است. هوا هنوز خنک است و دریا آن‌قدر آرام که مرز آب و آسمان پیدا نیست. قایق‌های صیادی یکی‌یکی برمی‌گردند و بازار ماهی کم‌کم شلوغ می‌شود.',
			['h', 'از ساحل تا چای‌خانه'],
			'بعد از بازار، راه لاهیجان را در پیش می‌گیریم. چای‌خانه‌ی کوچکی بالای باغ‌های چای هست که صاحبش چای را خودش می‌چیند و خشک می‌کند.',
			['q', 'اینجا کسی عجله ندارد؛ حتی دریا.', 'یکی از مسافران تور گیلان'],
		]),
	},
	{
		key: 'qashqai-spring', title: 'کوچ بهاره‌ی قشقایی‌ها از نزدیک', slug: 'qashqai-spring-migration', image: 'journal-2', terms: ['cat-notes'], days_ago: 9,
		excerpt: 'سه روز در کنار ایلی که هر سال صدها کیلومتر را با گله‌هایش پیاده می‌رود.',
		content: L.article([
			'کوچ پیش از طلوع آفتاب شروع می‌شود. بار را روی چهارپایان می‌بندند، گله جلو می‌رود و خانواده پشت سرش. ما هم کوله‌ها را برمی‌داریم و همراهشان می‌شویم.',
			['h', 'مهمانی در سیاه‌چادر'],
			'شب، چادر را برپا می‌کنند و نان را روی ساج می‌پزند. مهمان‌نوازی ایل چیزی نیست که بتوان در یک برنامه‌ی سفر نوشت؛ باید دید.',
		]),
	},
	{
		key: 'persepolis-light', title: 'تخت جمشید را کِی ببینیم؟', slug: 'when-to-visit-persepolis', image: 'journal-3', terms: ['cat-guide'], days_ago: 16,
		excerpt: 'بهترین ساعت، بهترین فصل و چند نکته برای دیدنی آرام‌تر.',
		content: L.article([
			'تخت جمشید در بهار و پاییز زیباترین حال را دارد. اگر می‌توانید، صبح زود یا یک ساعت پیش از بسته شدن بروید؛ نور مایل سنگ‌ها را گرم می‌کند و جمعیت کمتر است.',
			['ul', ['آب و کلاه همراه داشته باشید؛ سایه کم است.', 'از پلکان شرقی آپادانا شروع کنید.', 'برای نقش رستم هم یک ساعت وقت بگذارید.']],
		]),
	},
	{
		key: 'desert-packing', title: 'سفر به کویر: چه بپوشیم، چه ببریم', slug: 'desert-packing-list', image: 'journal-4', terms: ['cat-guide'], days_ago: 24,
		excerpt: 'روزهای گرم، شب‌های سرد؛ فهرستی کوتاه برای سفری راحت.',
		content: L.article([
			'اختلاف دمای روز و شب در کویر زیاد است. لباس لایه‌لایه بیاورید: پیراهن نخی سبک برای روز و یک کاپشن گرم برای شب.',
			['ol', ['کفش راحت و ساق‌بلند برای راه رفتن روی شن', 'کلاه لبه‌دار و عینک آفتابی', 'چراغ پیشانی برای شب', 'کیسه‌ی کوچک برای جمع کردن زباله‌ها']],
		]),
	},
];

const custom = [
	L.pageHead('سفر اختصاصی', 'سفری که\n*فقط مال شماست*', 'برای خانواده‌ها، زوج‌ها و گروه‌های کوچک؛ مسیر، سرعت و جاهای ماندن را با هم می‌چینیم.'),
	section({ space: 'sm', zoom: 'expand', zoomAmount: 0.2, zoomInner: true, zoomRadius: 4 }, [
		L.imageReveal('wide-1', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'چطور', title: 'چهار گام تا\n*روز حرکت*', header_align: 'center' }),
		L.steps([
			{ marker: '۰۱', icon: 'compass', title: 'گفت‌وگو', text: 'سلیقه، سرعت سفر و بودجه را می‌شنویم.' },
			{ marker: '۰۲', icon: 'pin', title: 'پیش‌نویس مسیر', text: 'یک مسیر روزبه‌روز با دو گزینه‌ی اقامت.' },
			{ marker: '۰۳', icon: 'calendar', title: 'رزرو', text: 'بلیت، اقامت، راهنما و ماشین؛ همه با ما.' },
			{ marker: '۰۴', icon: 'phone', title: 'همراهی', text: 'یک شماره که در تمام سفر جواب می‌دهد.' },
		], { layout: 'h', cards: 'yes' }),
	]), { tone: 'surface', cards: 'cascade' }),
	fx(section({ space: 'md', gap: 40 }, [
		L.features([
			{ icon: 'users', title: 'گروه‌های کوچک', text: 'از دو تا دوازده نفر؛ بدون غریبه‌ها.' },
			{ icon: 'clock', title: 'سرعت دلخواه', text: 'روزهای آرام یا پرمشغله؛ انتخاب با شماست.' },
			{ icon: 'home', title: 'اقامت گزیده', text: 'خانه‌های بومی، هتل‌های کوچک و کمپ‌های آرام.' },
		], { layout: 'grid', style: 'cards', columns: '3', icon_style: 'tile' }),
	]), { cards: 'flip' }),
	L.cta({ eyebrow: 'سفر اختصاصی', title: 'مسیرتان را\n*بگویید*', desc: 'پیش‌نویس مسیر ظرف سه روز کاری؛ رایگان و بدون تعهد.', btn1_text: 'درخواست سفر', btn1_link: link('{{page:contact}}'), look: 'image', image: img('wide-2'), decor: '', note: '' }),
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
		id: 'rahnavard',
		order: 7,
		title: 'ره‌نورد',
		desc: 'آژانس سفرهای آهسته در ایران؛ سینمایی و آرام، با اسلایدر تمام‌صفحه، کارت‌های مقصد و موشن‌های سبک اسکرول.',
		kit: 'voyage',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: [],
		tags: ['گردشگری', 'آژانس سفر', 'سینمایی'],
		pages: ['خانه', 'تورها', 'درباره‌ی ما', 'تماس', 'سفرنامه', 'سفر اختصاصی', 'پرسش‌های متداول'],
	},
	content: {
		site: { title: 'ره‌نورد', tagline: 'سفرهای آهسته در ایران' },
		images, alts, terms, posts,
		pages: [
			{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings({ header: 'transparent-light' }) },
			{ key: 'tours', title: 'تورها', slug: 'tours', elementor: tours, settings: L.pageSettings() },
			{ key: 'about', title: 'درباره‌ی ما', slug: 'about', elementor: about, settings: L.pageSettings() },
			{ key: 'custom', title: 'سفر اختصاصی', slug: 'private-journeys', elementor: custom, settings: L.pageSettings() },
			{ key: 'faq', title: 'پرسش‌های متداول', slug: 'faq', elementor: faqPage, settings: L.pageSettings() },
			{ key: 'contact', title: 'تماس', slug: 'contact', elementor: contact, settings: L.pageSettings() },
			{ key: 'blog', title: 'سفرنامه', slug: 'journal', content: '' },
		],
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'ره‌نورد — صفحه‌ی اصلی' },
			{ key: 'tpl-tours', type: 'page', page: 'tours', title: 'ره‌نورد — تورها' },
			{ key: 'tpl-hero', type: 'section', page: 'home', index: 0, title: 'ره‌نورد — اسلایدر سینمایی' },
			{ key: 'tpl-destinations', type: 'section', page: 'home', index: 2, title: 'ره‌نورد — مقصدها (اسکرول افقی)' },
			{ key: 'tpl-stack', type: 'section', page: 'home', index: 3, title: 'ره‌نورد — تورها (کارت‌های پشته‌ای)' },
		],
		menus: [
			{
				name: 'ره‌نورد — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'سفر اختصاصی', page: 'custom' },
					{ title: 'تورها', page: 'tours' },
					{ title: 'سفرنامه', page: 'blog' },
					{ title: 'درباره‌ی ما', page: 'about' },
					{ title: 'تماس', page: 'contact' },
				],
			},
			{
				name: 'ره‌نورد — پابرگ', location: 'footer', items: [
					{ title: 'سفر اختصاصی', page: 'custom' },
					{ title: 'پرسش‌های متداول', page: 'faq' },
					{ title: 'تورها', page: 'tours' },
					{ title: 'سفرنامه', page: 'blog' },
					{ title: 'درباره‌ی ما', page: 'about' },
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
			header_cta_text: 'مشاوره‌ی سفر',
			header_cta_url: '{{page:contact}}',
			footer_about: 'ره‌نورد سفرهای آهسته و گروه‌های کوچک در ایران برگزار می‌کند؛ با راهنمای بومی، اقامت در خانه‌های قدیمی و وقت کافی برای دیدن.',
			footer_copyright: 'تمام حقوق برای ره‌نورد محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }, { network: 'whatsapp', url: 'https://wa.me/989124402610' }],
			mobile_bar: true,
			mobile_bar_text: 'مشاوره‌ی سفر',
			mobile_bar_url: '{{page:contact}}',
			mobile_bar_whatsapp: '09124402610',
			cursor: 'dot',
			sound_enabled: true,
			sound_default: true,
			sound_theme: 'soft',
			sound_volume: 18,
			sound_hover: false,
		},
		front_page: 'home',
		posts_page: 'blog',
	},
};
