/**
 * Demo: Sayal — a motion design studio (Flux kit).
 *
 * The showcase for scroll choreography: floating elements, zoom in and zoom out,
 * a depth tunnel, horizontal scroll and stacked cards.
 */
'use strict';

const L = require('../lib');
const { img, link, px, section, cols, heading, button } = L;

const images = { hero: 'images/hero.webp', chat: 'images/chat.webp' };
for (let i = 1; i <= 6; i++) { images['orb-' + i] = 'images/orb-' + i + '.webp'; images['journal-' + i] = 'images/journal-' + i + '.webp'; images['product-' + i] = 'images/product-' + i + '.webp'; images['product-' + i + '-b'] = 'images/product-' + i + '-b.webp'; }
for (let i = 1; i <= 4; i++) { images['glass-' + i] = 'images/glass-' + i + '.webp'; }
for (let i = 1; i <= 3; i++) { images['ribbon-' + i] = 'images/ribbon-' + i + '.webp'; }
for (let i = 1; i <= 8; i++) { images['float-' + i] = 'images/float-' + i + '.webp'; }
images.logo = 'images/logo.webp';
images['logo-dark'] = 'images/logo-dark.webp';
for (let i = 1; i <= 6; i++) { images['person-' + i] = '../shared/images/person-' + i + '.webp'; }

const alts = {
	hero: 'کره‌ی نورانی با حلقه‌های مداری و ذرات نور',
	chat: 'گفت‌وگوی دستیار هوشمند استودیو برای ایده‌پردازی موشن',
	'ribbon-1': 'موج‌های نوری سیال روی پس‌زمینه‌ی تیره',
	'glass-1': 'پنل‌های شیشه‌ای شناور روی نور گرم',
};

const anchor = (id, el) => { el.settings._element_id = id; return el; };

const QUOTES = [
	{ quote: 'ده‌ثانیه‌ی ابتدایی ویدیوی معرفی ما را از پایه عوض کردند. از همان روز نرخ دیده شدن تا انتها تقریباً دو برابر شد.', name: 'ندا فروغی', role: 'مدیر برند، شرکت فین‌تک', avatar: img('person-6') },
	{ quote: 'برعکس استودیوهایی که فقط زیبا می‌سازند، سیال اول می‌پرسد حرکت قرار است چه چیزی را به کاربر بفهماند.', name: 'آرین کامیاب', role: 'مدیر محصول اپلیکیشن سفر', avatar: img('person-1') },
	{ quote: 'انیمیشن‌های رابط کاربری‌شان هم زیبا بود هم سبک. روی گوشی‌های ضعیف هم روان اجرا شد.', name: 'ساناز رحمتی', role: 'سرپرست فنی، استارتاپ آموزشی', avatar: img('person-2') },
];

const FAQ = [
	['یک پروژه‌ی موشن چقدر طول می‌کشد؟', 'یک ویدیوی معرفی ۳۰ تا ۶۰ ثانیه‌ای معمولاً سه تا پنج هفته زمان می‌برد؛ از فیلمنامه و استوری‌بورد تا انیمیشن و صدا. انیمیشن‌های رابط کاربری کوچک را در یک تا دو هفته تحویل می‌دهیم.'],
	['خروجی انیمیشن رابط کاربری چه فرمتی است؟', 'بسته به نیاز: Lottie برای وب و اپ، ویدیوی بدون کانال آلفا برای شبکه‌های اجتماعی، و در صورت درخواست کد CSS و جاوااسکریپت آماده‌ی استفاده. همه‌ی خروجی‌ها از نظر حجم بهینه می‌شوند.'],
	['می‌توانم فقط بخشی از کار را به شما بسپارم؟', 'بله. بعضی مشتری‌ها فقط استوری‌بورد می‌گیرند و انیمیشن را خودشان اجرا می‌کنند و بعضی فقط انیمیشن را، با استوری‌بورد خودشان.'],
	['چند دور بازبینی در قیمت هست؟', 'سه دور بازبینی؛ یکی روی استوری‌بورد، یکی روی انیمیشن خام و یکی روی نسخه‌ی نهایی. تغییرات بیشتر به‌صورت ساعتی محاسبه می‌شود.'],
	['فایل‌های لایه‌باز را هم تحویل می‌دهید؟', 'برای پروژه‌های اختصاصی بله، پس از تسویه‌ی کامل، همراه فایل‌های After Effects، فونت‌ها و راهنمای استفاده.'],
];

const BRIEF = {
	need_label: 'نیاز شما', need_title: 'چه چیزی را متحرک کنیم؟', need_desc: 'هر چند گزینه که لازم است انتخاب کنید.',
	choices: [
		{ label: 'ویدیوی معرفی', note: 'برند، محصول یا کمپین', icon: 'play' },
		{ label: 'انیمیشن رابط کاربری', note: 'وب و اپلیکیشن', icon: 'layers' },
		{ label: 'وب‌سایت اسکرولی', note: 'تعامل و حرکت در صفحه', icon: 'mouse' },
		{ label: 'موشن شبکه‌های اجتماعی', note: 'ریلز، استوری و پست', icon: 'camera' },
		{ label: 'هویت متحرک', note: 'لوگو و سیستم حرکتی برند', icon: 'palette' },
		{ label: 'هنوز نمی‌دانم', note: 'با هم پیدا می‌کنیم', icon: 'compass' },
	],
	multi: 'yes',
	budget_on: 'yes', budget_label: 'بودجه', budget_title: 'بودجه‌ی تقریبی پروژه چقدر است؟',
	budgets: 'کمتر از ۴۰ میلیون تومان\n۴۰ تا ۱۰۰ میلیون تومان\n۱۰۰ تا ۲۵۰ میلیون تومان\nبیش از ۲۵۰ میلیون تومان\nهنوز مشخص نیست',
	timeline_on: 'yes', timeline_title: 'زمان مورد نیاز',
	timelines: 'کمتر از دو هفته\nیک تا دو ماه\nمنعطف هستم',
	contact_label: 'تماس', contact_title: 'پاسخ را برای چه کسی بفرستیم؟',
	show_name: 'yes', label_name: 'نام و نام خانوادگی',
	show_phone: 'yes', label_phone: 'شماره‌ی موبایل',
	show_email: 'yes', label_email: 'ایمیل', req_email: '',
	show_company: 'yes', label_company: 'نام برند یا شرکت', req_company: '',
	show_message: 'yes', label_message: 'توضیح کوتاه درباره‌ی پروژه', req_message: '', consent: '',
	next_text: 'مرحله‌ی بعد', back_text: 'قبلی', submit_text: 'ارسال درخواست',
	done_title: 'درخواست شما رسید',
	done_text: 'ظرف یک روز کاری یکی از ما تماس می‌گیرد تا درباره‌ی ایده‌ی شما حرف بزنیم. تا آن موقع، نمونه‌کارها را ببینید.',
	done_btn_text: 'دیدن نمونه‌کارها', done_btn_link: link('{{page:home}}'), done_btn_style: 'secondary',
	remember: 'yes', boxed: 'yes', columns: '2',
};

const WORK = [
	{ image: img('orb-1'), label: 'ویدیوی معرفی', title: 'فین‌تک پیمانه', text: 'ویدیوی ۴۵ ثانیه‌ای معرفی اپ؛ نرخ ثبت‌نام صفحه‌ی فرود ۸۲٪ بیشتر شد.', link: link('{{post:case-peymaneh}}') },
	{ image: img('glass-2'), label: 'انیمیشن رابط', title: 'اپ سفرنو', text: 'ریزتعامل‌هایی که رزرو را سه‌قدم کوتاه‌تر کرد؛ بدون افزایش حجم اپ.', link: link('{{post:case-safarno-motion}}') },
	{ image: img('ribbon-2'), label: 'وب‌سایت اسکرولی', title: 'نمایشگاه هنر معاصر', text: 'سایتی که با اسکرول داستان می‌گوید؛ میانگین ماندگاری ۳ دقیقه و ۴۰ ثانیه.', link: link('#') },
	{ image: img('orb-5'), label: 'هویت متحرک', title: 'برند تازه‌ی نیلوفر', text: 'سیستم حرکتی کامل برای یک برند لوازم آرایشی؛ از لوگوی متحرک تا استوری.', link: link('#') },
	{ image: img('glass-3'), label: 'موشن اجتماعی', title: 'کمپین ریلز بیمه‌یار', text: 'سی ویدیوی کوتاه در یک ماه؛ ۱٫۲ میلیون بازدید ارگانیک.', link: link('#') },
	{ image: img('orb-3'), label: 'فیلم کوتاه', title: 'شوریل ۱۴۰۴', text: 'دو دقیقه از بهترین حرکت‌های سال گذشته.', link: link('#') },
];

/* ---------------- Home A: choreography ---------------- */

const homeA = [
	L.flow({
		eyebrow: 'استودیوی موشن و تجربه‌ی تعاملی',
		title: 'حرکت،\n*جان* می‌دهد.',
		desc: 'سیال ایده‌های ثابت را به تجربه‌های متحرک تبدیل می‌کند: ویدیو، انیمیشن رابط کاربری و وب‌سایت‌هایی که با اسکرول داستان می‌گویند.',
		btn1_text: 'شروع پروژه', btn1_link: link('#brief'),
		mode: 'drift',
		items: [
			{ image: img('float-1'), x: 11, y: 24, size: 250, depth: 0.7, rot: -7 },
			{ image: img('float-2'), x: 87, y: 20, size: 220, depth: 1.0, rot: 6, shape: 'tall' },
			{ image: img('float-3'), x: 17, y: 76, size: 200, depth: 1.2, rot: 5, shape: 'circle' },
			{ image: img('float-4'), x: 83, y: 76, size: 260, depth: 0.45, rot: -5 },
			{ text: '۴۲ کمپین در سال', x: 50, y: 11, size: 190, depth: 0.25, shape: 'pill' },
			{ text: 'Lottie · AE · WebGL', x: 66, y: 90, size: 200, depth: 0.15, shape: 'pill', mobile: false },
			{ image: img('float-5'), x: 36, y: 90, size: 150, depth: 0.9, rot: -3, shape: 'card', mobile: false },
		],
		scheme: 'inverse',
	}),
	L.marquee(['موشن گرافیک', 'انیمیشن رابط کاربری', 'وب‌سایت اسکرولی', 'ویدیوی معرفی', 'هویت متحرک', 'موشن اجتماعی'], { look: 'alternate', size: 'xl', separator: 'plus', speed: px(80) }),
	L.scrollZoom({
		eyebrow: 'شوریل ۱۴۰۴',
		title: 'یک سال،\n*۴۲ حرکت*',
		image: img('hero'),
		start_scale: px(0.34),
		radius: px(48),
		length: px(3.4),
		o_title: 'هر پروژه با یک\n*سؤال ساده* شروع می‌شود.',
		o_desc: 'حرکت قرار است چه چیزی را به بیننده بفهماند؟ اگر جوابی نداشته باشد، حرکت نمی‌دهیم.',
		btn1_text: 'نمونه‌کارها', btn1_link: link('#work'), btn1_style: 'inverse',
	}),
	L.depth({
		layout: 'card',
		length: px(1.1),
		scenes: [
			{ image: img('glass-1'), label: '۰۱ — کشف', title: 'ابتدا *گوش می‌دهیم*', text: 'یک هفته با تیم شما و مخاطبانتان حرف می‌زنیم تا بدانیم حرکت باید چه چیزی را روشن کند.' },
			{ image: img('orb-2'), label: '۰۲ — طراحی', title: 'بعد *حرکت* را می‌کشیم', text: 'استوری‌بورد، زمان‌بندی و سبک حرکتی را پیش از ساخت تأیید می‌کنید.' },
			{ image: img('ribbon-3'), label: '۰۳ — ساخت', title: 'سپس *جان* می‌دهیم', text: 'انیمیشن، طراحی صدا و بهینه‌سازی خروجی برای هر دستگاه و پلتفرم.' },
			{ image: img('orb-4'), label: '۰۴ — انتشار', title: 'و *اندازه می‌گیریم*', text: 'اثر حرکت را روی دیده شدن، ماندگاری و تبدیل می‌سنجیم و گزارش می‌دهیم.' },
		],
	}),
	section({ space: 'md', width: 1100 }, [
		L.textScrub('حرکت خوب *دیده نمی‌شود*، حس می‌شود. صفحه را روان‌تر، توضیح را روشن‌تر و برند را *به‌یادماندنی‌تر* می‌کند؛ مشروط بر اینکه هر حرکتی دلیلی داشته باشد.', { eyebrow: 'باور ما', size: 'lg' }),
	]),
	anchor('work', L.hscroll({
		eyebrow: 'نمونه‌کارها',
		title: 'کارهایی که\n*حرکت* دارند',
		desc: 'به اسکرول ادامه دهید؛ ردیف با شما می‌رود.',
		items: WORK,
		card_size: 'lg',
		card_style: 'overlay',
		btn1_text: 'همه‌ی پروژه‌ها', btn1_link: link('{{blog}}'),
		scheme: 'inverse',
	})),
	L.scrollZoom({
		direction: 'out',
		eyebrow: 'نگاهی از نزدیک',
		title: 'از *یک قاب*\nتا یک تجربه',
		image: img('ribbon-1'),
		start_scale: px(0.4),
		radius: px(40),
		length: px(3),
		o_title: 'صفحه‌ای که *نفس می‌کشد*.',
		o_desc: 'پس از زوم‌اوت، کارت کوچک می‌شود و جای خود را به بخش بعد می‌دهد.',
		btn1_text: 'خدمات ما', btn1_link: link('#services'), btn1_style: 'inverse',
	}),
	anchor('services', section({ space: 'md' }, [
		cols({ widths: [55, 45], align: 'flex-end' }, [
			[heading({ eyebrow: 'خدمات', title: 'چهار شکل *حرکت*' })],
			[L.textEditor('<p>می‌توانید یک خدمت را جداگانه سفارش دهید یا یک بسته‌ی کامل بگیرید؛ در هر دو حالت یک مدیر پروژه و یک جدول زمانی روشن دارید.</p>')],
		]),
		L.tabs([
			{ title: 'ویدیوی معرفی', subtitle: '۳۰ تا ۹۰ ثانیه', meta: '۰۱', image: img('orb-1'), panel_title: 'داستانی که در ده ثانیه‌ی اول گیر می‌اندازد', panel_text: 'از فیلمنامه و استوری‌بورد تا انیمیشن، موسیقی و طراحی صدا. هر ویدیو برای پلتفرم مقصد، نسبت تصویر و حجم درست خروجی می‌گیرد.', chips: 'استوری‌بورد، انیمیشن، طراحی صدا', btn_text: 'شروع پروژه', btn_link: link('#brief') },
			{ title: 'انیمیشن رابط کاربری', subtitle: 'وب و اپلیکیشن', meta: '۰۲', image: img('glass-2'), panel_title: 'ریزتعامل‌هایی که کار را ساده می‌کنند', panel_text: 'ورود، بارگذاری، تأیید و خطا؛ حرکت‌هایی که راهنمایی می‌کنند، نه حواس‌پرتی. خروجی Lottie یا کد، بهینه برای گوشی‌های ضعیف.', chips: 'Lottie، CSS، جاوااسکریپت', btn_text: 'شروع پروژه', btn_link: link('#brief') },
			{ title: 'وب‌سایت اسکرولی', subtitle: 'داستان‌گویی با اسکرول', meta: '۰۳', image: img('ribbon-2'), panel_title: 'سایتی که با اسکرول حرف می‌زند', panel_text: 'طراحی و ساخت سایت‌های نمایشی با زوم، پین، اسکرول افقی و عمق؛ با تمرکز روی سرعت و دسترس‌پذیری.', chips: 'المنتور، زوم اسکرول، عمق', btn_text: 'شروع پروژه', btn_link: link('#brief') },
			{ title: 'هویت متحرک', subtitle: 'سیستم حرکتی برند', meta: '۰۴', image: img('orb-5'), panel_title: 'برندی که حرکت هم دارد', panel_text: 'لوگوی متحرک، قواعد حرکتی، قالب‌های استوری و ارائه؛ تا همه‌چیز در هر نقطه‌ی تماس یک‌دست حرکت کند.', chips: 'لوگوی متحرک، قواعد حرکت', btn_text: 'شروع پروژه', btn_link: link('#brief') },
		], { autoplay: 7, media_side: 'end' }),
	])),
	L.flow({
		eyebrow: 'جعبه‌ابزار',
		title: 'آنچه با خودمان *می‌آوریم*',
		title_tag: 'h2', title_size: 'xl',
		mode: 'converge',
		strength: px(1.1),
		items: [
			{ text: 'استوری‌بورد', x: 14, y: 26, size: 190, depth: 0.9, shape: 'pill', rot: -6 },
			{ text: 'After Effects', x: 82, y: 22, size: 210, depth: 1.1, shape: 'pill', rot: 5 },
			{ text: 'Lottie', x: 22, y: 72, size: 140, depth: 0.7, shape: 'pill', rot: 4 },
			{ text: 'WebGL', x: 78, y: 74, size: 150, depth: 0.5, shape: 'pill', rot: -4 },
			{ text: 'طراحی صدا', x: 50, y: 88, size: 170, depth: 0.3, shape: 'pill', mobile: false },
			{ image: img('float-6'), x: 8, y: 52, size: 170, depth: 1.2, shape: 'circle', mobile: false },
			{ image: img('float-7'), x: 92, y: 52, size: 150, depth: 0.8, shape: 'circle', mobile: false },
		],
		height: { unit: 'vh', size: 100 },
	}),
	section({ space: 'md' }, [
		L.counters([
			{ value: 42, label: 'کمپین در سال گذشته' },
			{ value: 8, suffix: ' سال', label: 'تجربه‌ی موشن' },
			{ value: 96, suffix: '٪', label: 'مشتری‌های بازگشتی' },
			{ value: 3, suffix: '×', label: 'میانگین رشد ماندگاری', desc: 'پس از افزودن موشن' },
		], { style: 'cards', columns: '4' }),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [48, 52], gap: 64, align: 'center' }, [
			[
				heading({ eyebrow: 'دستیار ایده‌پردازی', title: 'پیش از جلسه،\n*با دستیار ما* حرف بزنید', desc: 'دستیار هوشمند سیال از برند و هدف شما چند ایده‌ی حرکتی می‌سازد تا جلسه‌ی اول را با یک نقطه‌ی شروع روشن شروع کنیم.' }),
				button('امتحان کنید', '#brief', 'secondary'),
			],
			[L.imageReveal('chat', { ratio: '16-9', reveal: 'clip-x', parallax: px(0.25) })],
		]),
	]),
	section({ space: 'md' }, [
		heading({ eyebrow: 'مشتری‌ها می‌گویند', title: 'حرکتی که *اثر* داشت', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		heading({ eyebrow: 'فروشگاه', title: 'ابزارهای آماده‌ی *موشن*', header_align: 'center', desc: 'بسته‌های انیمیشن و قالب‌هایی که در استودیو برای خودمان ساختیم.' }),
		L.products({ source: 'featured', count: 3, columns: '3' }),
	]),
	section({ space: 'md' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *شروع*' })],
			[L.faq(FAQ)],
		]),
	]),
	anchor('brief', section({ space: 'md', scheme: 'inverse', cls: 'hm-glow-bg' }, [
		cols({ widths: [42, 58], gap: 64, align: 'flex-start' }, [
			[
				heading({ eyebrow: 'شروع پروژه', title: 'ایده‌تان را\n*متحرک* کنیم', desc: 'سه سؤال کوتاه؛ ظرف یک روز کاری با شما تماس می‌گیریم تا درباره‌ی ایده‌تان حرف بزنیم.' }),
				L.textEditor('<ul><li>مشاوره‌ی اولیه رایگان</li><li>پیشنهاد مکتوب با زمان و قیمت روشن</li><li>سه دور بازبینی در همه‌ی پروژه‌ها</li></ul>'),
			],
			[L.leadForm(BRIEF)],
		]),
	])),
];

/* ---------------- Home B: tunnel ---------------- */

const homeB = [
	L.hero({
		layout: 'full',
		eyebrow: 'سیال · استودیوی موشن',
		title: 'در جریان\n*باشید*.',
		desc: 'حرکت، زبان تازه‌ی برندهاست.',
		btn1_text: 'دیدن کارها', btn1_link: link('#work'),
		btn2_text: 'شروع پروژه', btn2_link: link('{{page:contact}}'),
		media_type: 'image',
		image: img('hero'),
		height: 'screen',
		scheme: 'inverse',
		decor: '',
		hint: 'اسکرول کنید',
	}),
	L.depth({
		layout: 'cover',
		length: px(1),
		scenes: [
			{ image: img('ribbon-1'), label: '۰۱', title: 'حرکت، *توجه* می‌آورد', text: 'در یک صفحه‌ی شلوغ، چشم اول به چیزی می‌رود که حرکت دارد.' },
			{ image: img('orb-3'), label: '۰۲', title: 'حرکت، *معنا* می‌رساند', text: 'یک انتقال درست، هزار توضیح را کوتاه می‌کند.' },
			{ image: img('glass-4'), label: '۰۳', title: 'حرکت، *اعتماد* می‌سازد', text: 'رابطی که روان است، قابل اتکاتر هم حس می‌شود.' },
		],
	}),
	anchor('work', L.hscroll({
		eyebrow: 'نمونه‌کارها',
		title: 'کارهای *منتخب*',
		desc: '',
		items: WORK,
		card_size: 'md',
		card_style: 'caption',
	})),
	L.flow({
		eyebrow: 'در یک نگاه',
		title: 'نور، *شیشه* و حرکت',
		title_tag: 'h2', title_size: 'xl',
		desc: 'سبک بصری سیال ترکیبی از نور گرم، سطوح شیشه‌ای و حرکت‌های آرام است.',
		mode: 'disperse',
		items: [
			{ image: img('float-8'), x: 12, y: 30, size: 230, depth: 0.8, rot: -6 },
			{ image: img('float-2'), x: 86, y: 28, size: 200, depth: 1.1, rot: 5, shape: 'tall' },
			{ image: img('float-5'), x: 20, y: 78, size: 190, depth: 0.5, rot: 4, shape: 'circle' },
			{ image: img('float-7'), x: 80, y: 80, size: 240, depth: 0.9, rot: -4 },
		],
		scheme: 'inverse',
	}),
	L.scrollPath({
		eyebrow: 'روند کار',
		title: 'از ایده تا\n*اولین فریم*',
		hint: 'به اسکرول ادامه دهید',
		steps: [
			{ code: 'هفته‌ی ۱', title: 'گفت‌وگو و تحقیق', text: 'برند، مخاطب و هدف را می‌شناسیم و یک سؤال محوری را روی دیوار می‌نویسیم.' },
			{ code: 'هفته‌ی ۲', title: 'استوری‌بورد و استایل‌فریم', text: 'قاب‌های کلیدی و سبک حرکتی را می‌کشیم و با شما تأیید می‌کنیم.' },
			{ code: 'هفته‌ی ۳ و ۴', title: 'انیمیشن', text: 'ساخت، طراحی صدا و دو دور بازبینی؛ هر هفته یک نسخه‌ی قابل مشاهده.' },
			{ code: 'هفته‌ی ۵', title: 'تحویل و اندازه‌گیری', text: 'خروجی‌های بهینه برای هر پلتفرم و گزارش اثر روی ماندگاری و تبدیل.' },
		],
	}),
	section({ space: 'md' }, [
		heading({ eyebrow: 'تعرفه', title: 'قیمت *روشن*', header_align: 'center', desc: 'هر پروژه پیشنهاد مکتوب دارد؛ این بسته‌ها نقطه‌ی شروع‌اند.' }),
		L.pricing([
			{ name: 'انیمیشن رابط', desc: 'ریزتعامل‌ها و صفحه‌های کلیدی', price: '۳۵', price_alt: '۳۲', unit: 'میلیون تومان', period: 'از', features: 'تا ۱۲ ریزتعامل\nخروجی Lottie و کد\nیک دور بازبینی', btn_text: 'درخواست', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
			{ name: 'ویدیوی معرفی', desc: '۳۰ تا ۶۰ ثانیه، کامل', price: '۹۰', price_alt: '۸۱', unit: 'میلیون تومان', period: 'از', features: 'فیلمنامه و استوری‌بورد\nانیمیشن و طراحی صدا\nسه دور بازبینی\nنسخه‌های شبکه‌های اجتماعی', btn_text: 'درخواست', btn_link: link('{{page:contact}}'), featured: 'yes', badge: 'پرسفارش' },
			{ name: 'وب‌سایت اسکرولی', desc: 'سایت نمایشی کامل', price: '۱۶۰', price_alt: '۱۴۴', unit: 'میلیون تومان', period: 'از', features: 'طراحی و ساخت\nزوم، عمق و اسکرول افقی\nبهینه‌سازی سرعت\nآموزش مدیریت محتوا', btn_text: 'درخواست', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
		], { switch_off: 'پرداخت یکجا', switch_on: 'پرداخت در سه مرحله', switch_note: '' }),
	]),
	L.testimonials(QUOTES, { layout: 'marquee' }),
	section({ space: 'md' }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'یادداشت‌ها', title: 'پشت‌صحنه‌ی *حرکت*' })],
			[button('همه‌ی نوشته‌ها', '{{blog}}', 'secondary')],
		]),
		L.posts({ count: 3, layout: 'grid', columns: '3' }),
	]),
	L.cta({
		eyebrow: 'همین حالا',
		title: 'فریم اول را\n*با هم* بسازیم.',
		desc: 'ایده‌تان هر چه هست، یک جلسه‌ی رایگان برای شنیدنش وقت داریم.',
		btn1_text: 'رزرو جلسه', btn1_link: link('{{page:contact}}'),
		look: 'accent',
		decor: '',
		note: '',
	}),
];

/* ---------------- About ---------------- */

const about = [
	section({ space: 'md', bottom0: true }, [
		cols({ widths: [55, 45], align: 'flex-end' }, [
			[heading({ eyebrow: 'درباره‌ی سیال', title: 'استودیویی که\n*حرکت* را جدی می‌گیرد', title_tag: 'h1', title_size: 'xl' })],
			[L.textEditor('<p>سیال را سال ۱۳۹۶ سه نفر راه انداختند که هر کدام از یک طرف به موشن رسیده بودند: یکی از نقاشی، یکی از برنامه‌نویسی و یکی از فیلم. اسم استودیو از همان‌جا آمد: چیزی که نه جامد است نه ثابت.</p>')],
		]),
	]),
	section({ space: 'md' }, [L.imageReveal('ribbon-1', { ratio: '21-9', reveal: 'clip-up', parallax: px(0.3) })]),
	section({ space: 'md', width: 1100 }, [
		L.textScrub('هشت سال بعد، هنوز یک قاعده داریم: *هیچ حرکتی بدون دلیل*. اگر نتوانیم بگوییم یک انیمیشن چه چیزی را روشن می‌کند، آن را حذف می‌کنیم؛ حتی اگر زیبا باشد.', { eyebrow: 'قاعده‌ی ما', size: 'md' }),
	]),
	section({ space: 'sm' }, [
		L.counters([
			{ value: 1396, label: 'سال تأسیس', grouping: '' },
			{ value: 18, label: 'نفر در تیم' },
			{ value: 320, suffix: '+', label: 'پروژه‌ی تحویل‌شده' },
			{ value: 12, label: 'جایزه‌ی طراحی' },
		], { style: 'plain', columns: '4', grouping: '' }),
	]),
	section({ space: 'md' }, [
		heading({ eyebrow: 'اصول ما', title: 'چهار *قاعده*' }),
		L.features([
			{ icon: 'target', title: 'حرکت برای فهماندن', text: 'هر حرکتی باید چیزی را روشن‌تر کند، نه فقط جذاب‌تر.' },
			{ icon: 'bolt', title: 'سبک بودن', text: 'انیمیشن زیبایی که صفحه را کند کند، شکست خورده است.' },
			{ icon: 'eye', title: 'دسترس‌پذیری', text: 'حرکت را برای کسانی که آن را نمی‌خواهند هم طراحی می‌کنیم.' },
			{ icon: 'heart', title: 'صداقت درباره‌ی نتیجه', text: 'اثر کار را می‌سنجیم و عددها را همان‌طور که هست می‌گوییم.' },
		], { layout: 'grid', style: 'cards', columns: '4', icon_style: 'soft' }),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		heading({ eyebrow: 'تیم', title: 'آدم‌های *سیال*' }),
		L.team([
			{ photo: img('person-2'), name: 'ترانه آذری', role: 'هم‌بنیان‌گذار، کارگردان هنری' },
			{ photo: img('person-3'), name: 'سینا نیک‌پی', role: 'هم‌بنیان‌گذار، مهندس خلاق' },
			{ photo: img('person-4'), name: 'مینا رضوی', role: 'سرپرست انیمیشن' },
			{ photo: img('person-1'), name: 'پارسا تاجیک', role: 'طراح صدا' },
			{ photo: img('person-5'), name: 'کیان صالحی', role: 'برنامه‌نویس تعاملی' },
			{ photo: img('person-6'), name: 'هستی ملکی', role: 'مدیر پروژه' },
		], { columns: '3' }),
	]),
	L.cta({
		title: 'یک *جلسه‌ی* آشنایی؟',
		desc: 'بیایید درباره‌ی ایده‌تان حرف بزنیم؛ بدون تعهد.',
		btn1_text: 'رزرو جلسه', btn1_link: link('{{page:contact}}'),
		look: 'inverse',
		decor: '',
		note: '',
	}),
];

/* ---------------- Contact ---------------- */

const contact = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'تماس با ما', title: 'ایده‌تان را\n*برایمان* بگویید', title_tag: 'h1', title_size: 'xl', desc: 'سه مرحله‌ی کوتاه را تکمیل کنید؛ ظرف یک روز کاری جواب می‌دهیم.' }),
	]),
	section({ space: 'md' }, [
		cols({ widths: [60, 40], gap: 56 }, [
			[L.leadForm(BRIEF)],
			[L.contactInfo([
				{ icon: 'mail', label: 'ایمیل', value: 'hello@sayal.studio', link: link('mailto:hello@sayal.studio') },
				{ icon: 'whatsapp', label: 'واتس‌اپ', value: '۰۹۱۲ ۵۵۰ ۱۸۳۰', link: link('https://wa.me/989125501830', true) },
				{ icon: 'phone', label: 'تلفن', value: '۰۲۱-۸۸۰۷۱۶۴۰', link: link('tel:+982188071640') },
				{ icon: 'pin', label: 'استودیو', value: 'تهران، خیابان کریم‌خان، کوچه‌ی بیست‌ویکم، پلاک ۸', link: link('') },
				{ icon: 'clock', label: 'ساعت کاری', value: 'شنبه تا چهارشنبه، ۱۰ تا ۱۸', link: link('') },
			])],
		]),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *تماس*' })],
			[L.faq(FAQ)],
		]),
	]),
];

/* ---------------- Blog ---------------- */

const terms = [
	{ key: 'cat-motion', taxonomy: 'category', name: 'موشن', slug: 'motion' },
	{ key: 'cat-ui', taxonomy: 'category', name: 'انیمیشن رابط', slug: 'ui-animation' },
	{ key: 'cat-case', taxonomy: 'category', name: 'نمونه‌کار', slug: 'case-studies' },
	{ key: 'cat-studio', taxonomy: 'category', name: 'پشت‌صحنه', slug: 'studio' },
	{ key: 'pcat-pack', taxonomy: 'product_cat', name: 'بسته‌های انیمیشن', slug: 'animation-packs' },
	{ key: 'pcat-kit', taxonomy: 'product_cat', name: 'قالب و کیت', slug: 'kits' },
	{ key: 'pcat-course', taxonomy: 'product_cat', name: 'دوره', slug: 'courses' },
];

const posts = [
	{
		key: 'smooth-scroll', title: 'چرا اسکرول نرم، سایت را گران‌تر نشان می‌دهد', slug: 'why-smooth-scroll-feels-premium', image: 'journal-1', terms: ['cat-motion'], days_ago: 3,
		excerpt: 'تفاوت یک سایت معمولی و یک سایت حرفه‌ای اغلب در چیزی است که به چشم نمی‌آید: روانی حرکت.',
		content: L.article([
			'کاربر نمی‌داند چرا یک سایت «باکیفیت» حس می‌شود، اما می‌داند که حس می‌شود. بخش بزرگی از این حس از روانی حرکت می‌آید؛ از اینکه اسکرول ناگهان نمی‌پرد و عناصر با شتاب طبیعی وارد می‌شوند.',
			['h', 'سه اصل'],
			['ol', ['حرکت باید با اینرسی باشد، نه خطی. هر چیزی که شروع می‌کند یا می‌ایستد، کمی زمان لازم دارد.', 'همه‌چیز با هم حرکت نکند. تأخیر کوچک بین عناصر، ریتم می‌سازد.', 'حرکت باید قابل خاموش شدن باشد. کاربری که حرکت را نمی‌خواهد، باید بتواند آن را کم کند.']],
			['h', 'هزینه‌ی روانی'],
			'اسکرول نرم اگر درست پیاده‌سازی نشود، روی گوشی‌های ضعیف سنگین می‌شود. قاعده‌ی ما این است: فقط ویژگی‌هایی که روی کارت گرافیک بار می‌گذارند، یعنی transform و opacity، را متحرک کنید و اندازه‌گیری‌ها را یک بار انجام دهید، نه در هر فریم.',
			['q', 'اگر اسکرول نرم باعث شد کاربر احساس کند کنترل را از دست داده، از آن صرف‌نظر کنید.'],
		]),
	},
	{
		key: 'zoom-technique', title: 'زوم؛ ساده‌ترین تکنیک برای سینمایی کردن یک صفحه', slug: 'zoom-scroll-technique', image: 'journal-2', terms: ['cat-motion'], days_ago: 9,
		excerpt: 'از کارت کوچک تا تمام صفحه، و بالعکس. چرا کار می‌کند و کجا نباید استفاده‌اش کرد.',
		content: L.article([
			'زوم در فیلم کهن‌ترین ابزار برای هدایت توجه است: نزدیک می‌شویم تا چیزی مهم شود و دور می‌شویم تا بافت و معنا نشان داده شود. در وب، اسکرول همین نقش را بازی می‌کند.',
			['h', 'زوم‌این'],
			'تصویر از یک کارت کوچک شروع می‌شود و با اسکرول تا لبه‌های صفحه بزرگ می‌شود. برای افشای یک محصول، یک پروژه یا یک جمله‌ی مهم مناسب است.',
			['h', 'زوم‌اوت'],
			'برعکس: از یک تصویر تمام‌صفحه شروع می‌کنیم و با دور شدن، متن و عناصر اطراف را آشکار می‌کنیم. برای رسیدن از احساس به توضیح کار می‌کند.',
			['ul', ['طول مسیر اسکرول را کوتاه نگه دارید؛ بیش از سه صفحه‌ی ارتفاع خسته‌کننده است.', 'متن را هیچ‌وقت روی بخش در حال حرکت تصویر نگذارید.', 'در موبایل، نسخه‌ی ساده‌تری اجرا کنید.']],
		]),
	},
	{
		key: 'case-peymaneh', title: 'پیمانه: ۴۵ ثانیه که نرخ ثبت‌نام را ۸۲ درصد بالا برد', slug: 'peymaneh-video-case-study', image: 'journal-3', terms: ['cat-case'], days_ago: 15,
		excerpt: 'چطور یک ویدیوی کوتاه، مشکل «این اپ دقیقاً چه کار می‌کند؟» را حل کرد.',
		content: L.article([
			'پیمانه یک اپ مدیریت مالی شخصی است. تیمش مشکل مشخصی داشت: بازدیدکننده‌ها صفحه‌ی فرود را می‌دیدند، اما نمی‌فهمیدند اپ دقیقاً چه کاری برایشان می‌کند.',
			['h', 'سؤال محوری'],
			'قبل از هر طراحی، یک سؤال نوشتیم: «کاربر در ده ثانیه‌ی اول باید چه چیزی بفهمد؟». جواب این بود: «بدون جدول و فرمول، می‌فهمی ماهت را چطور خرج کرده‌ای.»',
			['h', 'نتیجه'],
			['ul', ['ویدیوی ۴۵ ثانیه‌ای با ریتم سه‌بخشی: مشکل، نمایش، دعوت', '۸۲ درصد افزایش نرخ ثبت‌نام صفحه‌ی فرود', 'میانگین تماشای ویدیو: ۳۸ ثانیه از ۴۵']],
		]),
	},
	{
		key: 'case-safarno-motion', title: 'ریزتعامل‌هایی که رزرو را سه قدم کوتاه‌تر کرد', slug: 'safarno-micro-interactions', image: 'journal-4', terms: ['cat-case', 'cat-ui'], days_ago: 22,
		excerpt: 'گاهی بهترین انیمیشن، آن است که کاربر متوجهش نمی‌شود.',
		content: L.article([
			'اپ سفرنو در مرحله‌ی انتخاب تاریخ و مسافر ریزش داشت. مسئله زیبایی نبود؛ کاربر نمی‌فهمید انتخابش ثبت شده یا نه.',
			['ul', ['حرکت تأییدی کوچک روی هر انتخاب، به‌جای یک دکمه‌ی «تأیید» اضافه', 'انتقال نرم بین مراحل برای حفظ حس «ادامه‌ی همان صفحه»', 'اسکلت بارگذاری به‌جای چرخنده‌ی خالی']],
			'همه‌ی این‌ها با فایل‌های Lottie زیر ۲۰ کیلوبایت پیاده شدند و حجم اپ تقریباً تغییر نکرد.',
		]),
	},
	{
		key: 'ui-motion-mistakes', title: 'پنج اشتباه رایج در انیمیشن رابط کاربری', slug: 'five-ui-animation-mistakes', image: 'journal-5', terms: ['cat-ui'], days_ago: 30,
		excerpt: 'بیشتر انیمیشن‌های بد، بد نیستند؛ فقط زیادند.',
		content: L.article([
			['ol', ['مدت زیاد: انتقال‌های رابط بین ۱۵۰ تا ۳۵۰ میلی‌ثانیه‌اند؛ بیشتر از آن حس کندی می‌دهد.', 'همه‌چیز را هم‌زمان متحرک کردن: ریتم و تأخیر بین عناصر لازم است.', 'متحرک کردن چیزهایی که روی چیدمان اثر می‌گذارند، مثل width و top؛ به‌جای transform.', 'نادیده گرفتن گزینه‌ی «کاهش حرکت» سیستم‌عامل.', 'اضافه کردن حرکت پیش از روشن شدن هدف آن.']],
			'اگر فقط یک نکته را بپذیرید: هر انیمیشن را با این سؤال بسنجید: «اگر حذفش کنم، کاربر چیزی را گم می‌کند؟» اگر جواب نه است، حذفش کنید.',
		]),
	},
	{
		key: 'showreel-making', title: 'پشت‌صحنه‌ی شوریل ۱۴۰۴', slug: 'behind-the-showreel-2025', image: 'journal-6', terms: ['cat-studio'], days_ago: 40,
		excerpt: 'از ۴۲ پروژه، چهارده ثانیه‌ی برگزیده و چرا بیشترشان را کنار گذاشتیم.',
		content: L.article([
			'هر سال باید از میان ده‌ها پروژه، دو دقیقه انتخاب کنیم. معیار ما زیبایی نیست؛ این است که آن لحظه یک حرف روشن بزند.',
			['q', 'اگر نتوانیم یک جمله بگوییم آن حرکت چه می‌گوید، در شوریل نمی‌رود.'],
			'امسال آخرین تدوین را با یک قاعده انجام دادیم: هر ده ثانیه یک تغییر ریتم، تا بیننده هیچ‌وقت منتظر نماند و هیچ‌وقت خسته هم نشود.',
		]),
	},
];

/* ---------------- Products ---------------- */

const products = [
	{ key: 'pack-ui', title: 'پک انیمیشن رابط کاربری', slug: 'ui-animation-pack', price: 1450000, sku: 'SY-UIPACK', image: 'product-1', gallery: ['product-1-b', 'glass-1'], terms: ['pcat-pack'], virtual: true, featured: true,
		excerpt: '۴۸ انیمیشن Lottie آماده برای دکمه، فرم، بارگذاری و خطا.',
		content: L.productBody(['۴۸ انیمیشن Lottie آماده‌ی استفاده در وب و اپلیکیشن: دکمه‌ها، فرم‌ها، اسکلت بارگذاری، حالت موفقیت و خطا.', 'همه‌ی انیمیشن‌ها زیر ۲۰ کیلوبایت‌اند و رنگ‌هایشان از یک فایل تنظیمات عوض می‌شود.'], [['تعداد', '۴۸ انیمیشن'], ['فرمت', 'Lottie (JSON)'], ['حجم هر فایل', 'کمتر از ۲۰ کیلوبایت'], ['مجوز', 'استفاده‌ی تجاری، نامحدود']]) },
	{ key: 'pack-transitions', title: 'ترنزیشن‌های ویدیویی', slug: 'video-transitions', price: 1180000, sku: 'SY-TRANS', image: 'product-2', gallery: ['product-2-b'], terms: ['pcat-pack'], virtual: true, featured: true,
		excerpt: '۱۲۰ ترنزیشن آماده‌ی پریمیر و افترافکت بدون نیاز به پلاگین.',
		content: L.productBody(['۱۲۰ ترنزیشن: زوم، ویپ، اعوجاج مایع و گذار نوری، همه آماده‌ی کشیدن روی تایم‌لاین.', 'بدون پلاگین؛ فقط با ابزارهای خود نرم‌افزار ساخته شده‌اند و روی سیستم‌های ضعیف هم روان‌اند.'], [['تعداد', '۱۲۰ ترنزیشن'], ['نرم‌افزار', 'Premiere و After Effects'], ['رزولوشن', 'تا 4K']]) },
	{ key: 'kit-glass', title: 'کیت موکاپ شیشه‌ای', slug: 'glass-mockup-kit', price: 890000, sale_price: 690000, sku: 'SY-GLASS', image: 'product-3', gallery: ['product-3-b'], terms: ['pcat-kit'], virtual: true, featured: true,
		excerpt: '۳۶ صحنه‌ی شیشه‌ای برای معرفی اپ و سایت؛ فایل فیگما.',
		content: L.productBody(['۳۶ صحنه‌ی آماده با کارت‌های شیشه‌ای و نور نرم برای معرفی اپ و سایت، با اجزای قابل ویرایش.', 'رنگ نور، شفافیت و محتوای کارت‌ها را در چند ثانیه عوض کنید.'], [['تعداد', '۳۶ صحنه'], ['فرمت', 'Figma'], ['اجزا', 'قابل ویرایش']]) },
	{ key: 'pack-icons', title: 'آیکون‌های متحرک', slug: 'animated-icons', price: 760000, sku: 'SY-ICONS', image: 'product-4', gallery: ['product-4-b'], terms: ['pcat-pack'], virtual: true,
		excerpt: '۲۴۰ آیکون SVG متحرک با سه سبک خطی، توپر و دوتایی.',
		content: L.productBody(['۲۴۰ آیکون متحرک برای رابط کاربری، هر کدام با حالت ایستا و متحرک.', 'سه سبک یکپارچه‌ی خطی، توپر و دوتایی.'], [['تعداد', '۲۴۰ آیکون'], ['فرمت', 'SVG و Lottie']]) },
	{ key: 'kit-3d', title: 'قالب ارائه‌ی سه‌بعدی', slug: '3d-presentation-template', price: 1320000, sku: 'SY-3DPRES', image: 'product-5', gallery: ['product-5-b'], terms: ['pcat-kit'], virtual: true,
		excerpt: '۴۰ اسلاید با عمق و حرکت، برای ارائه‌ی کیی‌نوت و پاورپوینت.',
		content: L.productBody(['۴۰ اسلاید با ترکیب عمق، نور و حرکت‌های نرم، برای ارائه‌ی محصول و گزارش.', 'همه‌ی متن‌ها و رنگ‌ها قابل ویرایش‌اند.'], [['تعداد', '۴۰ اسلاید'], ['فرمت', 'Keynote و PowerPoint']]) },
	{ key: 'course-motion', title: 'دوره‌ی موشن دیزاین', slug: 'motion-design-course', price: 8900000, sku: 'SY-COURSE', image: 'product-6', gallery: ['product-6-b'], terms: ['pcat-course'], virtual: true,
		excerpt: '۱۲ هفته آموزش پروژه‌محور؛ از اصول حرکت تا پروژه‌ی پایانی.',
		content: L.productBody(['دوره‌ای دوازده‌هفته‌ای که با اصول حرکت شروع می‌شود و به یک پروژه‌ی کامل می‌رسد. هر هفته یک تمرین و بازبینی فردی دارد.', 'در پایان یک ویدیوی نمونه‌کار و یک انیمیشن رابط آماده‌ی پورتفولیو دارید.'], [['مدت', '۱۲ هفته'], ['برگزاری', 'آنلاین زنده'], ['سطح', 'مقدماتی تا متوسط'], ['گواهی', 'دارد']]) },
];

module.exports = {
	manifest: {
		id: 'flux',
		order: 6,
		title: 'سیال',
		desc: 'استودیوی موشن؛ زوم‌این و زوم‌اوت، تونل عمق، اسکرول افقی، عناصر شناور و حالت تاریک سینمایی.',
		kit: 'flux',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: ['woocommerce'],
		tags: ['خلاقیت', 'موشن', 'نمایشی'],
		pages: ['خانه', 'خانه — مدل دوم', 'درباره‌ی ما', 'تماس با ما', 'وبلاگ', 'فروشگاه'],
	},
	content: {
		site: { title: 'سیال', tagline: 'استودیوی موشن و تجربه‌ی تعاملی' },
		images, alts, terms, posts, products,
		pages: [
			{ key: 'home', title: 'خانه', slug: 'home', elementor: homeA, settings: L.pageSettings({ header: 'transparent-light' }) },
			{ key: 'home-2', title: 'خانه — مدل دوم', slug: 'home-2', elementor: homeB, settings: L.pageSettings({ header: 'transparent-light' }) },
			{ key: 'about', title: 'درباره‌ی ما', slug: 'about', elementor: about, settings: L.pageSettings() },
			{ key: 'contact', title: 'تماس با ما', slug: 'contact', elementor: contact, settings: L.pageSettings() },
			{ key: 'blog', title: 'وبلاگ', slug: 'blog', content: '' },
		],
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'سیال — صفحه‌ی اصلی' },
			{ key: 'tpl-home-2', type: 'page', page: 'home-2', title: 'سیال — صفحه‌ی اصلی، مدل دوم' },
			{ key: 'tpl-about', type: 'page', page: 'about', title: 'سیال — درباره‌ی ما' },
			{ key: 'tpl-contact', type: 'page', page: 'contact', title: 'سیال — تماس' },
			{ key: 'tpl-flow', type: 'section', page: 'home', index: 0, title: 'سیال — هیرو با عناصر شناور' },
			{ key: 'tpl-zoom-in', type: 'section', page: 'home', index: 2, title: 'سیال — زوم‌این با اسکرول' },
			{ key: 'tpl-depth', type: 'section', page: 'home', index: 3, title: 'سیال — تونل عمق' },
			{ key: 'tpl-hscroll', type: 'section', page: 'home', index: 5, title: 'سیال — اسکرول افقی نمونه‌کار' },
			{ key: 'tpl-zoom-out', type: 'section', page: 'home', index: 6, title: 'سیال — زوم‌اوت با اسکرول' },
			{ key: 'tpl-converge', type: 'section', page: 'home', index: 8, title: 'سیال — عناصر شناور همگرا' },
			{ key: 'tpl-depth-cover', type: 'section', page: 'home-2', index: 1, title: 'سیال — تونل عمق تمام‌صفحه' },
			{ key: 'tpl-disperse', type: 'section', page: 'home-2', index: 3, title: 'سیال — عناصر شناور پراکنده' },
		],
		menus: [
			{
				name: 'سیال — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home', children: [{ title: 'مدل اول — تونل عمق', page: 'home' }, { title: 'مدل دوم — سینمایی', page: 'home-2' }] },
					{ title: 'فروشگاه', url: '{{shop}}' },
					{ title: 'وبلاگ', page: 'blog' },
					{ title: 'درباره‌ی ما', page: 'about' },
					{ title: 'تماس', page: 'contact' },
				],
			},
			{
				name: 'سیال — پابرگ', location: 'footer', items: [
					{ title: 'فروشگاه', url: '{{shop}}' },
					{ title: 'وبلاگ', page: 'blog' },
					{ title: 'درباره‌ی ما', page: 'about' },
					{ title: 'تماس', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 38,
			color_scheme: 'dark',
			header_layout: 'split',
			header_cta_text: 'شروع پروژه',
			header_cta_url: '{{page:contact}}',
			footer_about: 'سیال استودیوی موشن و تجربه‌ی تعاملی است: ویدیو، انیمیشن رابط کاربری و وب‌سایت‌های اسکرولی برای برندهایی که می‌خواهند حس شوند.',
			footer_copyright: 'تمام حقوق برای استودیوی سیال محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'youtube', url: 'https://youtube.com/' }, { network: 'telegram', url: 'https://t.me/' }],
			mobile_bar: true,
			mobile_bar_text: 'شروع پروژه',
			mobile_bar_url: '{{page:contact}}',
			magnetic: true,
			cursor: true,
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
