/**
 * Demo: Sayal — a motion design studio (Flux kit), built as a complete studio
 * site: two home pages, selected work, services and rates, motion packs sold
 * online, a three-step project brief, about, FAQ, contact and a journal.
 *
 * Light-trail stills carry the hero and the reel; the rest of the work is shown
 * the way a studio keeps it: storyboards, easing-curve sheets, contact sheets
 * and style frames, photographed on the desk.
 */
'use strict';

const L = require('../lib');
const { img, link, px, section, cols, heading, button, fx } = L;

const images = { hero: 'images/hero.webp', reel: 'images/reel.webp', studio: 'images/studio.webp', logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp' };
for (let i = 1; i <= 6; i++) {
	images['work-' + i] = 'images/work-' + i + '.webp';
	images['journal-' + i] = 'images/journal-' + i + '.webp';
	images['product-' + i] = 'images/product-' + i + '.webp';
	images['product-' + i + '-b'] = 'images/product-' + i + '-b.webp';
}

const alts = {
	hero: 'رد نورهای گرم در عکاسی با نوردهی طولانی',
	reel: 'خطوط نور نارنجی روی زمینه‌ی تیره',
	studio: 'استوری‌بورد، برگه‌ی انتخاب فریم و منحنی شتاب روی میز استودیو',
	'work-1': 'استوری‌بورد و استایل‌فریم ویدیوی معرفی پیمانه روی میز بتنی',
	'work-2': 'طرح مدادی صفحه‌های اپ سفرنو کنار برگه‌ی منحنی شتاب',
	'work-3': 'استایل‌فریم سایت نمایشگاه هنر معاصر روی دیوار',
	'work-4': 'برگه‌ی فریم‌به‌فریم نشانه‌ی متحرک نیلوفر و دو نمونه‌رنگ',
	'work-5': 'سه استایل‌فریم عمودی ریلز بیمه‌یار',
	'work-6': 'رد نور گرم، فریمی از شوریل',
};

const anchor = (id, el) => { el.settings._element_id = id; return el; };

/* ---------------- Shared ---------------- */

const QUOTES = [
	{ quote: 'ده ثانیه‌ی اول ویدیوی معرفی ما را از پایه عوض کردند. از همان روز، تعداد کسانی که ویدیو را تا آخر می‌بینند تقریباً دو برابر شد.', name: 'ندا فروغی', role: 'مدیر برند پیمانه' },
	{ quote: 'برخلاف استودیوهایی که فقط زیبا می‌سازند، سیال اول می‌پرسد حرکت قرار است چه چیزی را به کاربر بفهماند.', name: 'آرین کامیاب', role: 'مدیر محصول سفرنو' },
	{ quote: 'انیمیشن‌های رابط کاربری‌شان هم زیبا بود هم سبک. روی گوشی‌های ضعیف هم روان اجرا شد و حجم اپ تقریباً تغییری نکرد.', name: 'ساناز رحمتی', role: 'سرپرست فنی بیمه‌یار' },
];

const FAQ_PROJECT = [
	['یک پروژه‌ی موشن چقدر طول می‌کشد؟', 'یک ویدیوی معرفی ۳۰ تا ۶۰ ثانیه‌ای معمولاً سه تا پنج هفته زمان می‌برد؛ از فیلمنامه و استوری‌بورد تا انیمیشن و صدا. انیمیشن‌های رابط کاربری کوچک را در یک تا دو هفته تحویل می‌دهیم.'],
	['قیمت را چطور تعیین می‌کنید؟', 'پس از جلسه‌ی آشنایی، پیشنهاد مکتوبی می‌فرستیم که زمان‌بندی، تعداد دورهای بازبینی و هزینه را جدا جدا نوشته است. قیمت‌های صفحه‌ی خدمات نقطه‌ی شروع‌اند، نه سقف.'],
	['چند دور بازبینی در قیمت هست؟', 'سه دور: یکی روی استوری‌بورد، یکی روی انیمیشن خام و یکی روی نسخه‌ی نهایی. تغییرات بیشتر ساعتی حساب می‌شود و پیش از انجام، هزینه‌اش را می‌گوییم.'],
	['می‌توانم فقط بخشی از کار را به شما بسپارم؟', 'بله. بعضی مشتری‌ها فقط استوری‌بورد و استایل‌فریم می‌گیرند و انیمیشن را خودشان اجرا می‌کنند؛ بعضی هم فقط انیمیشن را، با استوری‌بورد خودشان.'],
];

const FAQ_TECH = [
	['خروجی انیمیشن رابط کاربری چه فرمتی است؟', 'بسته به نیاز: Lottie برای وب و اپ، ویدیو برای شبکه‌های اجتماعی، و در صورت نیاز کد CSS و جاوااسکریپت آماده. همه‌ی خروجی‌ها از نظر حجم بهینه می‌شوند.'],
	['انیمیشن‌ها سرعت سایت را کم نمی‌کنند؟', 'هدف ما همین است که نکنند. فقط ویژگی‌هایی را متحرک می‌کنیم که مرورگر ارزان اجرا می‌کند، فایل‌ها را سبک نگه می‌داریم و برای کسانی که «کاهش حرکت» را روشن کرده‌اند نسخه‌ی آرام‌تری می‌سازیم.'],
	['فایل‌های لایه‌باز را هم تحویل می‌دهید؟', 'برای پروژه‌های اختصاصی بله؛ پس از تسویه‌ی کامل، همراه فایل‌های After Effects، فونت‌ها و راهنمای استفاده.'],
	['صدا را هم خودتان طراحی می‌کنید؟', 'بله. طراح صدای استودیو برای هر ویدیو موسیقی، افکت و میکس نهایی را آماده می‌کند. اگر صدای اختصاصی برند دارید، با همان کار می‌کنیم.'],
];

const BRIEF = {
	need_label: 'نیاز شما', need_title: 'چه چیزی را متحرک کنیم؟', need_desc: 'هر چند گزینه که لازم است انتخاب کنید.',
	choices: [
		{ label: 'ویدیوی معرفی', note: 'برند، محصول یا کمپین', icon: 'play' },
		{ label: 'انیمیشن رابط کاربری', note: 'وب و اپلیکیشن', icon: 'layers' },
		{ label: 'وب‌سایت اسکرولی', note: 'تعامل و حرکت در صفحه', icon: 'mouse' },
		{ label: 'موشن شبکه‌های اجتماعی', note: 'ریلز، استوری و پست', icon: 'camera' },
		{ label: 'هویت متحرک', note: 'نشانه و سیستم حرکتی برند', icon: 'palette' },
		{ label: 'هنوز نمی‌دانم', note: 'با هم پیدا می‌کنیم', icon: 'compass' },
	],
	multi: 'yes',
	budget_on: 'yes', budget_label: 'بودجه', budget_title: 'بودجه‌ی تقریبی پروژه چقدر است؟',
	budgets: 'کمتر از ۴۰ میلیون تومان\n۴۰ تا ۱۰۰ میلیون تومان\n۱۰۰ تا ۲۵۰ میلیون تومان\nبیش از ۲۵۰ میلیون تومان\nهنوز مشخص نیست',
	timeline_on: 'yes', timeline_title: 'کار را برای چه زمانی لازم دارید؟',
	timelines: 'کمتر از دو هفته\nیک تا دو ماه\nزمان منعطف است',
	contact_label: 'تماس', contact_title: 'پاسخ را برای چه کسی بفرستیم؟',
	show_name: 'yes', label_name: 'نام و نام خانوادگی',
	show_phone: 'yes', label_phone: 'شماره‌ی موبایل',
	show_email: 'yes', label_email: 'ایمیل', req_email: '',
	show_company: 'yes', label_company: 'نام برند یا شرکت', req_company: '',
	show_message: 'yes', label_message: 'توضیح کوتاه درباره‌ی پروژه', req_message: '', consent: '',
	next_text: 'مرحله‌ی بعد', back_text: 'قبلی', submit_text: 'ارسال درخواست',
	done_title: 'درخواست شما رسید',
	done_text: 'ظرف یک روز کاری یکی از ما تماس می‌گیرد تا درباره‌ی ایده‌تان حرف بزنیم. تا آن موقع، نمونه‌کارها را ببینید.',
	done_btn_text: 'دیدن نمونه‌کارها', done_btn_link: link('{{page:work}}'), done_btn_style: 'secondary',
	remember: 'yes', boxed: 'yes', columns: '2',
};

const WORK = [
	{ image: img('work-1'), label: 'ویدیوی معرفی', title: 'پیمانه', text: 'ویدیوی ۴۵ ثانیه‌ای معرفی اپ؛ نرخ ثبت‌نام صفحه‌ی فرود ۸۲٪ بیشتر شد.', link: link('{{post:case-peymaneh}}') },
	{ image: img('work-2'), label: 'انیمیشن رابط', title: 'سفرنو', text: 'ریزتعامل‌هایی که رزرو را سه قدم کوتاه‌تر کرد؛ بدون افزایش حجم اپ.', link: link('{{post:case-safarno-motion}}') },
	{ image: img('work-3'), label: 'وب‌سایت اسکرولی', title: 'نمایشگاه هنر معاصر', text: 'سایتی که با اسکرول داستان می‌گوید؛ میانگین ماندگاری ۳ دقیقه و ۴۰ ثانیه.', link: link('{{page:work}}') },
	{ image: img('work-4'), label: 'هویت متحرک', title: 'نیلوفر', text: 'سیستم حرکتی کامل برای یک برند آرایشی؛ از نشانه‌ی متحرک تا استوری.', link: link('{{page:work}}') },
	{ image: img('work-5'), label: 'موشن اجتماعی', title: 'بیمه‌یار', text: 'سی ریلز کوتاه در یک ماه؛ ۱٫۲ میلیون بازدید بدون تبلیغ.', link: link('{{page:work}}') },
	{ image: img('work-6'), label: 'فیلم کوتاه', title: 'شوریل ۱۴۰۴', text: 'دو دقیقه از بهترین حرکت‌های سال گذشته.', link: link('{{post:showreel-making}}') },
];

const CASES = [
	{ eyebrow: 'پیمانه · ویدیوی معرفی', title: '۴۵ ثانیه، ۸۲٪ ثبت‌نام بیشتر', text: 'پیش از هر طراحی یک سؤال نوشتیم: کاربر در ده ثانیه‌ی اول باید چه چیزی بفهمد؟ جواب، ریتم سه‌بخشی ویدیو را ساخت.', points: 'فیلمنامه، استوری‌بورد و شش استایل‌فریم\nانیمیشن و طراحی صدا\nنسخه‌های ۹:۱۶ و ۱:۱ برای شبکه‌ها', image: img('work-1'), btn_text: 'خواندن داستان', btn_link: link('{{post:case-peymaneh}}'), tone: '' },
	{ eyebrow: 'سفرنو · انیمیشن رابط', title: 'رزرو، سه قدم کوتاه‌تر', text: 'مسئله زیبایی نبود؛ کاربر نمی‌فهمید انتخابش ثبت شده یا نه. چند حرکت کوچک تأیید، جای یک مرحله‌ی کامل را گرفت.', points: '۱۲ ریزتعامل با Lottie\nهر فایل زیر ۲۰ کیلوبایت\nنسخه‌ی آرام برای «کاهش حرکت»', image: img('work-2'), btn_text: 'خواندن داستان', btn_link: link('{{post:case-safarno-motion}}'), tone: 'inverse' },
	{ eyebrow: 'نیلوفر · هویت متحرک', title: 'نشانه‌ای که شکوفه می‌دهد', text: 'نشانه‌ی برند در ۴۸ فریم باز می‌شود؛ همان ریتم در استوری‌ها، بسته‌بندی دیجیتال و تیتراژ ویدیوها تکرار می‌شود.', points: 'نشانه‌ی متحرک و نسخه‌ی کوتاه\nقواعد حرکتی برند\n۲۴ قالب استوری', image: img('work-4'), btn_text: 'همه‌ی نمونه‌کارها', btn_link: link('{{page:work}}'), tone: '' },
];

const SERVICE_TABS = [
	{ title: 'ویدیوی معرفی', subtitle: '۳۰ تا ۹۰ ثانیه', meta: '۰۱', image: img('work-1'), panel_title: 'از یک سؤال تا آخرین فریم', panel_text: 'فیلمنامه، استوری‌بورد، استایل‌فریم، انیمیشن و طراحی صدا؛ با نسخه‌های جدا برای هر پلتفرم و هر نسبت تصویر.', chips: 'فیلمنامه، استوری‌بورد، صدا', btn_text: 'شروع پروژه', btn_link: link('{{page:brief}}') },
	{ title: 'انیمیشن رابط کاربری', subtitle: 'وب و اپلیکیشن', meta: '۰۲', image: img('work-2'), panel_title: 'حرکت‌هایی که راهنمایی می‌کنند', panel_text: 'ورود، بارگذاری، تأیید و خطا؛ با منحنی‌های شتاب مستند و خروجی Lottie یا کد، آماده برای تیم فنی.', chips: 'Lottie، ریزتعامل، کتابچه‌ی حرکت', btn_text: 'شروع پروژه', btn_link: link('{{page:brief}}') },
	{ title: 'وب‌سایت اسکرولی', subtitle: 'داستان‌گویی با اسکرول', meta: '۰۳', image: img('work-3'), panel_title: 'صفحه‌ای که با شما راه می‌رود', panel_text: 'زوم، پین و اسکرول افقی، با تمرکز روی سرعت بارگذاری و دسترس‌پذیری؛ روی گوشی‌های معمولی هم روان.', chips: 'زوم، اسکرول افقی، سرعت', btn_text: 'شروع پروژه', btn_link: link('{{page:brief}}') },
	{ title: 'هویت متحرک', subtitle: 'سیستم حرکتی برند', meta: '۰۴', image: img('work-4'), panel_title: 'برندی که همه‌جا یک‌جور حرکت می‌کند', panel_text: 'نشانه‌ی متحرک، قواعد حرکتی، قالب‌های استوری و تیتراژ؛ همراه راهنمایی که تیم داخلی هم بتواند از آن استفاده کند.', chips: 'نشانه‌ی متحرک، قالب، راهنما', btn_text: 'شروع پروژه', btn_link: link('{{page:brief}}') },
];

const PROCESS = [
	{ marker: 'هفته‌ی ۱', icon: 'search', title: 'گفت‌وگو و تحقیق', text: 'برند، مخاطب و هدف را می‌شناسیم و یک سؤال محوری می‌نویسیم.' },
	{ marker: 'هفته‌ی ۲', icon: 'layers', title: 'استوری‌بورد و استایل‌فریم', text: 'قاب‌های کلیدی و سبک حرکت را می‌کشیم و با شما تأیید می‌کنیم.' },
	{ marker: 'هفته‌ی ۳ و ۴', icon: 'play', title: 'انیمیشن و صدا', text: 'ساخت، طراحی صدا و دو دور بازبینی؛ هر هفته یک نسخه‌ی دیدنی.' },
	{ marker: 'هفته‌ی ۵', icon: 'chart', title: 'تحویل و سنجش', text: 'خروجی بهینه برای هر پلتفرم و گزارش اثر روی ماندگاری و تبدیل.' },
];

const PLANS = () => L.pricing([
	{ name: 'انیمیشن رابط', desc: 'ریزتعامل‌ها و صفحه‌های کلیدی', price: '۳۵', price_alt: '۳۲', unit: 'میلیون تومان', period: 'از', features: 'تا ۱۲ ریزتعامل\nخروجی Lottie و کد\nکتابچه‌ی حرکت\nیک دور بازبینی', btn_text: 'درخواست', btn_link: link('{{page:brief}}'), featured: '', badge: '' },
	{ name: 'ویدیوی معرفی', desc: '۳۰ تا ۶۰ ثانیه، کامل', price: '۹۰', price_alt: '۸۱', unit: 'میلیون تومان', period: 'از', features: 'فیلمنامه و استوری‌بورد\nانیمیشن و طراحی صدا\nسه دور بازبینی\nنسخه‌های شبکه‌های اجتماعی', btn_text: 'درخواست', btn_link: link('{{page:brief}}'), featured: 'yes', badge: 'پرسفارش' },
	{ name: 'وب‌سایت اسکرولی', desc: 'سایت نمایشی کامل', price: '۱۶۰', price_alt: '۱۴۴', unit: 'میلیون تومان', period: 'از', features: 'طراحی و ساخت\nزوم، پین و اسکرول افقی\nبهینه‌سازی سرعت\nآموزش مدیریت محتوا', btn_text: 'درخواست', btn_link: link('{{page:brief}}'), featured: '', badge: '' },
], { switch_off: 'پرداخت یکجا', switch_on: 'پرداخت در سه مرحله', switch_note: '۱۰٪ تخفیف یکجا' });

const briefCta = (title = 'فریم اول را\n*با هم* بسازیم.', desc = 'ایده‌تان هر چه هست، یک جلسه‌ی آشنایی بدون تعهد برای شنیدنش وقت داریم.') => L.cta({
	eyebrow: 'شروع پروژه', title, desc,
	btn1_text: 'شروع پروژه', btn1_link: link('{{page:brief}}'), btn2_text: 'نمونه‌کارها', btn2_link: link('{{page:work}}'),
	look: 'image', image: img('reel'), decor: '', note: '',
});

/* ---------------- Home: choreography ---------------- */

const home = [
	L.bleed(L.w('hm-hero', {
		layout: 'full', title_tag: 'h1', title_size: 'xl', header_align: 'start', title_reveal: 'words', title_stagger: 'yes',
		eyebrow: 'سیال · استودیوی موشن',
		title: 'حرکت،\n*جان* می‌دهد.',
		desc: 'ایده‌های ثابت را به تجربه‌های متحرک تبدیل می‌کنیم: ویدیوی معرفی، انیمیشن رابط کاربری و وب‌سایت‌هایی که با اسکرول داستان می‌گویند.',
		btn1_text: 'شروع پروژه', btn1_link: link('{{page:brief}}'), btn1_style: 'primary',
		btn2_text: 'نمونه‌کارها', btn2_link: link('#work'), btn2_style: 'ghost',
		stats: [
			{ value: '۴۲', suffix: '', label: 'کمپین در سال' },
			{ value: '۸', suffix: '', label: 'سال تجربه' },
			{ value: '۹۶', suffix: '٪', label: 'مشتری بازگشتی' },
		],
		media_type: 'image', image: img('hero'), height: 'screen', decor: '', overlay: px(0.12), hint: '',
	})),
	L.marquee(['موشن گرافیک', 'انیمیشن رابط کاربری', 'وب‌سایت اسکرولی', 'ویدیوی معرفی', 'هویت متحرک', 'طراحی صدا'], { look: 'muted', size: 'md', separator: 'dot', speed: px(40) }),
	section({ space: 'md', width: 1040 }, [
		L.textScrub('حرکت خوب *دیده نمی‌شود*، حس می‌شود. صفحه را روان‌تر، توضیح را روشن‌تر و برند را *به‌یادماندنی‌تر* می‌کند؛ به شرط آنکه هر حرکتی دلیلی داشته باشد.', { eyebrow: 'باور ما', size: 'lg' }),
	]),
	anchor('work', L.hscroll({
		eyebrow: 'نمونه‌کارها',
		title: 'کارهایی که\n*حرکت* دارند',
		desc: 'به اسکرول ادامه دهید؛ ردیف با شما می‌رود.',
		items: WORK,
		card_size: 'md',
		card_style: 'caption',
		btn1_text: 'همه‌ی نمونه‌کارها', btn1_link: link('{{page:work}}'),
		scheme: 'inverse',
	})),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'خدمات', title: 'چهار شکل\n*حرکت*', desc: 'یک خدمت جدا یا بسته‌ی کامل؛ در هر دو حالت یک مدیر پروژه و جدول زمانی روشن دارید.' })],
			[button('خدمات و تعرفه‌ها', '{{page:services}}', 'secondary', { _flex_align_self: 'flex-end' })],
		]),
		L.tabs(SERVICE_TABS, { autoplay: 7, media_side: 'start' }),
	]),
	L.scrollZoom({
		eyebrow: 'شوریل ۱۴۰۴',
		title: 'یک سال، *۴۲ حرکت*',
		image: img('reel'),
		start_scale: px(0.42),
		radius: px(6),
		length: px(2),
		o_title: 'هر پروژه با یک *سؤال ساده* شروع می‌شود.',
		o_desc: 'حرکت قرار است چه چیزی را به بیننده بفهماند؟ اگر جوابی نداشته باشد، حرکت نمی‌دهیم.',
		btn1_text: 'نمونه‌کارها', btn1_link: link('{{page:work}}'), btn1_style: 'inverse',
	}),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64, align: 'center' }, [
			[heading({ eyebrow: 'در یک سال', title: 'عددهایی که\n*حرکت* ساخت' })],
			[L.counters([
				{ value: 42, label: 'کمپین در سال گذشته' },
				{ value: 8, label: 'سال تجربه‌ی موشن' },
				{ value: 96, suffix: '٪', label: 'مشتری بازگشتی' },
				{ value: 3, suffix: '×', label: 'رشد میانگین ماندگاری' },
			], { style: 'plain', columns: '2' })],
		]),
	]), { tone: 'inverse' }),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'روند کار', title: 'پنج هفته تا\n*اولین فریم*', header_align: 'center' }),
		L.steps(PROCESS, { layout: 'h', cards: 'yes' }),
	]), { cards: 'cascade' }),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'مشتری‌ها می‌گویند', title: 'حرکتی که *اثر* داشت', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]),
	fx(section({ space: 'md', gap: 32 }, [
		L.productCarousel({ eyebrow: 'فروشگاه', title: 'ابزارهای آماده‌ی *موشن*', desc: 'بسته‌های انیمیشن و قالب‌هایی که در استودیو برای خودمان ساختیم.', source: 'recent', count: 6, card_ratio: '1-1', card_parts: ['badges', 'hover'], more_text: 'همه‌ی محصولات', more_link: link('{{shop}}') }),
	]), { tone: 'surface' }),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *شروع*' }), button('همه‌ی پرسش‌ها', '{{page:faq}}', 'secondary')],
			[L.faq(FAQ_PROJECT, { style: 'lines' })],
		]),
	]),
	anchor('brief', section({ space: 'md', scheme: 'inverse' }, [
		cols({ widths: [42, 58], gap: 64, align: 'flex-start' }, [
			[
				heading({ eyebrow: 'شروع پروژه', title: 'ایده‌تان را\n*متحرک* کنیم', desc: 'سه سؤال کوتاه؛ ظرف یک روز کاری تماس می‌گیریم تا درباره‌ی ایده‌تان حرف بزنیم.' }),
				L.textEditor('<ul><li>جلسه‌ی آشنایی رایگان</li><li>پیشنهاد مکتوب با زمان و قیمت روشن</li><li>سه دور بازبینی در همه‌ی پروژه‌ها</li></ul>'),
			],
			[L.leadForm(BRIEF)],
		]),
	])),
];

/* ---------------- Home, second version: cinematic ---------------- */

const home2 = [
	L.showcase({
		eyebrow: 'سیال · استودیوی موشن',
		title: 'در جریان\n*باشید*',
		btn_text: 'شروع پروژه',
		btn_url: '{{page:brief}}',
		slides: [
			{ image: img('hero'), label: 'ویدیوی معرفی', text: 'پیمانه؛ ۴۵ ثانیه که نرخ ثبت‌نام را ۸۲٪ بالا برد.' },
			{ image: img('studio'), label: 'پشت میز استودیو', text: 'هر حرکت پیش از ساخت روی کاغذ کشیده می‌شود.' },
			{ image: img('work-3'), label: 'وب‌سایت اسکرولی', text: 'نمایشگاه هنر معاصر؛ سایتی که با اسکرول داستان می‌گوید.' },
			{ image: img('reel'), label: 'شوریل ۱۴۰۴', text: 'دو دقیقه از بهترین حرکت‌های سال گذشته.' },
		],
		stats: [
			{ value: '۴۲', label: 'کمپین در سال' },
			{ value: '۳۲۰', label: 'پروژه' },
			{ value: '۱۲', label: 'جایزه‌ی طراحی' },
		],
		social: [
			{ label: 'اینستاگرام', url: 'https://instagram.com/' },
			{ label: 'آپارات', url: 'https://www.aparat.com/' },
			{ label: 'بیهنس', url: 'https://behance.net/' },
		],
	}),
	section({ space: 'md', gap: 32 }, [
		heading({ eyebrow: 'نمونه‌کارها', title: 'سه پروژه،\n*سه سؤال*' }),
		L.stack(CASES),
	]),
	section({ space: 'none', gap: 0, zoom: 'expand', zoomAmount: 0.24, zoomInner: true, zoomRadius: 2 }, [
		L.imageReveal('studio', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	L.scrollPath({
		eyebrow: 'روند کار',
		title: 'از ایده تا\n*اولین فریم*',
		hint: 'به اسکرول ادامه دهید',
		steps: PROCESS.map((s) => ({ code: s.marker, title: s.title, text: s.text })),
	}),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'تعرفه', title: 'قیمت *روشن*', header_align: 'center', desc: 'هر پروژه پیشنهاد مکتوب دارد؛ این بسته‌ها نقطه‌ی شروع‌اند.' }),
		PLANS(),
	]), { tone: 'surface', cards: 'cascade' }),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'مجله', title: 'پشت‌صحنه‌ی *حرکت*' })],
			[button('همه‌ی نوشته‌ها', '{{blog}}', 'secondary', { _flex_align_self: 'flex-end' })],
		]),
		L.posts({ count: 3, layout: 'grid', columns: '3' }),
	]),
	briefCta(),
];

/* ---------------- Work ---------------- */

const workPage = [
	L.pageHead('نمونه‌کارها', 'کارهایی که\n*حرکت* دارند', 'هر پروژه با یک سؤال شروع شده و اثرش را همان‌طور که بوده گزارش کرده‌ایم: ماندگاری، تبدیل یا فقط فهم بهتر.'),
	section({ space: 'md', gap: 32 }, [L.stack(CASES)]),
	L.hscroll({ eyebrow: 'همه‌ی پروژه‌ها', title: 'شش برند،\n*شش حرکت*', desc: '', items: WORK, card_size: 'md', card_style: 'caption', scheme: 'inverse' }),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64, align: 'center' }, [
			[heading({ eyebrow: 'روی میز', title: 'هر حرکت،\n*اول روی کاغذ*', desc: 'استوری‌بورد، منحنی‌های شتاب و برگه‌های انتخاب فریم؛ پیش از اولین کلید در نرم‌افزار، حرکت روی کاغذ کشیده و تأیید می‌شود.' })],
			[cols({ widths: [50, 50], gap: 20 }, [
				[L.imageReveal('product-1-b', { ratio: '1-1', reveal: 'none', parallax: px(0) })],
				[L.imageReveal('product-2-b', { ratio: '1-1', reveal: 'none', parallax: px(0) })],
			])],
		]),
	]), { cards: 'spread' }),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'مشتری‌ها می‌گویند', title: 'حرکتی که *اثر* داشت', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]),
	briefCta(),
];

/* ---------------- Services ---------------- */

const services = [
	L.pageHead('خدمات', 'هر جا چیزی\n*باید حرکت کند*', 'ویدیو، رابط کاربری، وب‌سایت و هویت برند؛ هر کدام با یک سؤال محوری، جدول زمانی روشن و سه دور بازبینی.'),
	section({ space: 'md', gap: 40 }, [L.tabs(SERVICE_TABS, { autoplay: 0, media_side: 'start' })]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'جزئیات', title: 'آنچه در هر *پروژه* هست' }),
		L.features([
			{ icon: 'layers', title: 'استوری‌بورد و استایل‌فریم', text: 'قاب‌های کلیدی و سبک بصری، پیش از هر انیمیشنی تأیید می‌شود.', meta: 'همه‌ی پروژه‌ها' },
			{ icon: 'play', title: 'انیمیشن', text: 'ساخت در After Effects و ابزارهای وب، با منحنی‌های شتاب مستند.', meta: 'همه‌ی پروژه‌ها' },
			{ icon: 'music', title: 'طراحی صدا', text: 'موسیقی، افکت و میکس نهایی؛ یا کار با صدای اختصاصی برند شما.', meta: 'ویدیو و هویت' },
			{ icon: 'code', title: 'خروجی برای تیم فنی', text: 'Lottie، ویدیو یا کد؛ همراه راهنما و نمونه‌ی پیاده‌سازی.', meta: 'رابط و وب' },
			{ icon: 'gauge', title: 'بهینه‌سازی حجم', text: 'هر فایل تا جای ممکن سبک می‌شود تا صفحه کند نشود.', meta: 'همه‌ی خروجی‌ها' },
			{ icon: 'chart', title: 'سنجش اثر', text: 'گزارش ماندگاری، تبدیل یا زمان تماشا، چهار هفته پس از انتشار.', meta: 'به درخواست' },
		], { layout: 'grid', style: 'cards', columns: '3', icon_style: 'plain' }),
	]), { tone: 'surface', cards: 'cascade' }),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'همکاری', title: 'پنج هفته تا *اولین فریم*', header_align: 'center' }),
		L.steps(PROCESS, { layout: 'h', cards: 'yes' }),
	]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'تعرفه', title: 'قیمت *روشن*', header_align: 'center', desc: 'هر پروژه پیشنهاد مکتوب دارد؛ این بسته‌ها نقطه‌ی شروع‌اند.' }),
		PLANS(),
	]), { tone: 'inverse' }),
	briefCta(),
];

/* ---------------- Brief ---------------- */

const brief = [
	L.pageHead('شروع پروژه', 'ایده‌تان را\n*برایمان* بگویید', 'سه مرحله‌ی کوتاه را تکمیل کنید؛ ظرف یک روز کاری تماس می‌گیریم و یک جلسه‌ی آشنایی رایگان هماهنگ می‌کنیم.'),
	section({ space: 'md', gap: 40, width: 980 }, [L.leadForm(BRIEF)]),
	fx(section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'بعد از ارسال', title: 'چه اتفاقی *می‌افتد*', header_align: 'center' }),
		L.steps([
			{ marker: '۰۱', icon: 'phone', title: 'تماس کوتاه', text: 'ظرف یک روز کاری؛ برای هماهنگی جلسه.' },
			{ marker: '۰۲', icon: 'users', title: 'جلسه‌ی آشنایی', text: 'چهل دقیقه، حضوری یا آنلاین، بدون تعهد.' },
			{ marker: '۰۳', icon: 'pen', title: 'پیشنهاد مکتوب', text: 'زمان، بازبینی‌ها و هزینه، روی یک صفحه.' },
		], { layout: 'h', cards: 'yes' }),
	]), { tone: 'surface', cards: 'cascade' }),
];

/* ---------------- About ---------------- */

const about = [
	section({ space: 'md', bottom0: true }, [
		cols({ widths: [55, 45], align: 'flex-end' }, [
			[heading({ eyebrow: 'درباره‌ی سیال', title: 'استودیویی که\n*حرکت* را جدی می‌گیرد', title_tag: 'h1', title_size: 'xl' })],
			[L.textEditor('<p>سیال را سال ۱۳۹۶ سه نفر راه انداختند که هر کدام از یک طرف به موشن رسیده بودند: یکی از نقاشی، یکی از برنامه‌نویسی و یکی از فیلم. اسم استودیو از همان‌جا آمد: چیزی که نه جامد است نه ثابت.</p>')],
		]),
	]),
	section({ space: 'md', zoom: 'expand', zoomAmount: 0.2, zoomInner: true, zoomRadius: 2 }, [
		L.imageReveal('studio', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
	section({ space: 'md', width: 1040 }, [
		L.textScrub('هشت سال بعد، هنوز یک قاعده داریم: *هیچ حرکتی بدون دلیل*. اگر نتوانیم بگوییم یک انیمیشن چه چیزی را روشن می‌کند، حذفش می‌کنیم؛ حتی اگر زیبا باشد.', { eyebrow: 'قاعده‌ی ما', size: 'md' }),
	]),
	fx(section({ space: 'sm' }, [
		L.counters([
			{ value: 8, label: 'سال' },
			{ value: 18, label: 'نفر در تیم' },
			{ value: 320, suffix: '+', label: 'پروژه‌ی تحویل‌شده' },
			{ value: 12, label: 'جایزه‌ی طراحی' },
		], { style: 'plain', columns: '4' }),
	]), { tone: 'surface' }),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'اصول ما', title: 'چهار *قاعده*' })],
			[L.features([
				{ icon: '', title: 'حرکت برای فهماندن', text: 'هر حرکتی باید چیزی را روشن‌تر کند، نه فقط جذاب‌تر.' },
				{ icon: '', title: 'سبک بودن', text: 'انیمیشن زیبایی که صفحه را کند کند، شکست خورده است.' },
				{ icon: '', title: 'دسترس‌پذیری', text: 'حرکت را برای کسانی که آن را نمی‌خواهند هم طراحی می‌کنیم.' },
				{ icon: '', title: 'صداقت درباره‌ی نتیجه', text: 'اثر کار را می‌سنجیم و عددها را همان‌طور که هست می‌گوییم.' },
			], { layout: 'list', style: 'plain', icon_style: 'plain', numbered: 'yes' })],
		]),
	]), { cards: 'cascade' }),
	fx(section({ space: 'md', gap: 40 }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'تیم', title: 'آدم‌های\n*سیال*', desc: 'هجده نفر در یک طبقه‌ی خیابان کریم‌خان؛ از کارگردان هنری تا طراح صدا.' })],
			[L.features([
				{ icon: '', title: 'ترانه آذری', text: 'هم‌بنیان‌گذار، کارگردان هنری' },
				{ icon: '', title: 'سینا نیک‌پی', text: 'هم‌بنیان‌گذار، مهندس خلاق' },
				{ icon: '', title: 'مینا رضوی', text: 'سرپرست انیمیشن' },
				{ icon: '', title: 'پارسا تاجیک', text: 'طراح صدا' },
				{ icon: '', title: 'کیان صالحی', text: 'برنامه‌نویس تعاملی' },
				{ icon: '', title: 'هستی ملکی', text: 'مدیر پروژه' },
			], { layout: 'grid', style: 'plain', columns: '3', icon_style: 'plain' })],
		]),
	]), { tone: 'inverse' }),
	briefCta('یک *جلسه‌ی*\nآشنایی؟', 'بیایید درباره‌ی ایده‌تان حرف بزنیم؛ بدون تعهد.'),
];

/* ---------------- FAQ and contact ---------------- */

const faqPage = [
	L.pageHead('پرسش‌های متداول', 'پیش از *شروع*', 'اگر جوابتان این‌جا نیست، در جلسه‌ی آشنایی بپرسید؛ تعهدی ایجاد نمی‌کند.'),
	section({ space: 'md', gap: 56 }, [
		cols({ widths: [30, 70], gap: 64 }, [
			[heading({ eyebrow: 'پروژه', title: 'زمان، قیمت و *بازبینی*', title_size: 'md' })],
			[L.faq(FAQ_PROJECT, { style: 'lines' })],
		]),
		cols({ widths: [30, 70], gap: 64 }, [
			[heading({ eyebrow: 'فنی', title: 'خروجی و *تحویل*', title_size: 'md' })],
			[L.faq(FAQ_TECH, { style: 'lines', first_open: '' })],
		]),
	]),
	briefCta(),
];

const contact = [
	L.pageHead('تماس', 'سری به *استودیو*\nبزنید', 'برای پروژه‌ی تازه، فرم «شروع پروژه» سریع‌تر است؛ برای هر چیز دیگری همین‌جا پیام بدهید.'),
	section({ space: 'md' }, [
		cols({ widths: [40, 60], gap: 64 }, [
			[L.contactInfo([
				{ icon: 'mail', label: 'ایمیل', value: 'hello@sayal.studio', link: link('mailto:hello@sayal.studio') },
				{ icon: 'whatsapp', label: 'واتس‌اپ', value: '۰۹۱۲ ۵۵۰ ۱۸۳۰', link: link('https://wa.me/989125501830', true) },
				{ icon: 'phone', label: 'تلفن', value: '۰۲۱-۸۸۰۷۱۶۴۰', link: link('tel:+982188071640') },
				{ icon: 'pin', label: 'استودیو', value: 'تهران، خیابان کریم‌خان، کوچه‌ی بیست‌ویکم، پلاک ۸', link: link('') },
				{ icon: 'clock', label: 'ساعت کاری', value: 'شنبه تا چهارشنبه، ۱۰ تا ۱۸', link: link('') },
			])],
			[L.contactForm({ show_phone: 'yes', label_phone: 'شماره‌ی موبایل', show_subject: 'yes', label_subject: 'موضوع', label_name: 'نام و نام خانوادگی', label_email: 'ایمیل', label_message: 'پیام شما', button: 'ارسال پیام', success: 'پیامتان رسید؛ تا پایان روز کاری جواب می‌دهیم.' })],
		]),
	]),
	section({ space: 'md', zoom: 'expand', zoomAmount: 0.18, zoomInner: true, zoomRadius: 2 }, [
		L.imageReveal('reel', { ratio: '21-9', reveal: 'none', parallax: px(0) }),
	]),
];

/* ---------------- Journal ---------------- */

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
			['img', 'product-1-b', 'منحنی‌های شتاب در کتابچه‌ی حرکت استودیو'],
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
			['img', 'work-1', 'استوری‌بورد نسخه‌ی سوم و استایل‌فریم دوم ویدیوی پیمانه'],
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
			['img', 'work-2', 'طرح مدادی سه حالت دکمه‌ی رزرو، کنار منحنی ورود کارت‌ها'],
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
			['img', 'studio', 'برگه‌های انتخاب فریم و استوری‌بوردها روی میز استودیو'],
			['q', 'اگر نتوانیم یک جمله بگوییم آن حرکت چه می‌گوید، در شوریل نمی‌رود.'],
			'امسال آخرین تدوین را با یک قاعده انجام دادیم: هر ده ثانیه یک تغییر ریتم، تا بیننده هیچ‌وقت منتظر نماند و هیچ‌وقت خسته هم نشود.',
		]),
	},
];

/* ---------------- Products ---------------- */

const products = [
	{ key: 'pack-ui', title: 'پک انیمیشن رابط کاربری', slug: 'ui-animation-pack', price: 1450000, sku: 'SY-UIPACK', image: 'product-1', gallery: ['product-1-b'], terms: ['pcat-pack'], virtual: true, featured: true,
		excerpt: '۴۸ انیمیشن Lottie آماده برای دکمه، فرم، بارگذاری و خطا.',
		content: L.productBody(['۴۸ انیمیشن Lottie آماده‌ی استفاده در وب و اپلیکیشن: دکمه‌ها، فرم‌ها، اسکلت بارگذاری، حالت موفقیت و خطا.', 'همه‌ی انیمیشن‌ها زیر ۲۰ کیلوبایت‌اند و رنگ‌هایشان از یک فایل تنظیمات عوض می‌شود.'], [['تعداد', '۴۸ انیمیشن'], ['فرمت', 'Lottie (JSON)'], ['حجم هر فایل', 'کمتر از ۲۰ کیلوبایت'], ['مجوز', 'استفاده‌ی تجاری، نامحدود']]) },
	{ key: 'pack-transitions', title: 'ترنزیشن‌های ویدیویی', slug: 'video-transitions', price: 1180000, sku: 'SY-TRANS', image: 'product-2', gallery: ['product-2-b'], terms: ['pcat-pack'], virtual: true, featured: true,
		excerpt: '۱۲۰ ترنزیشن آماده‌ی پریمیر و افترافکت بدون نیاز به پلاگین.',
		content: L.productBody(['۱۲۰ ترنزیشن: زوم، ویپ، اعوجاج مایع و گذار نوری، همه آماده‌ی کشیدن روی تایم‌لاین.', 'بدون پلاگین؛ فقط با ابزارهای خود نرم‌افزار ساخته شده‌اند و روی سیستم‌های ضعیف هم روان‌اند.'], [['تعداد', '۱۲۰ ترنزیشن'], ['نرم‌افزار', 'Premiere و After Effects'], ['رزولوشن', 'تا 4K']]) },
	{ key: 'kit-mockup', title: 'کیت موکاپ نمایش', slug: 'showcase-mockup-kit', price: 890000, sale_price: 690000, sku: 'SY-MOCKUP', image: 'product-3', gallery: ['product-3-b'], terms: ['pcat-kit'], virtual: true, featured: true,
		excerpt: '۳۶ صحنه‌ی آماده برای معرفی اپ و سایت؛ فایل فیگما.',
		content: L.productBody(['۳۶ صحنه‌ی آماده با قاب‌های ساده و نور نرم برای معرفی اپ و سایت، با اجزای قابل ویرایش.', 'رنگ نور، تیترها و تصویر هر صحنه را در چند ثانیه عوض کنید.'], [['تعداد', '۳۶ صحنه'], ['فرمت', 'Figma'], ['اجزا', 'قابل ویرایش']]) },
	{ key: 'pack-icons', title: 'آیکون‌های متحرک', slug: 'animated-icons', price: 760000, sku: 'SY-ICONS', image: 'product-4', gallery: ['product-4-b'], terms: ['pcat-pack'], virtual: true,
		excerpt: '۲۴۰ آیکون SVG متحرک با سه سبک خطی، توپر و دوتایی.',
		content: L.productBody(['۲۴۰ آیکون متحرک برای رابط کاربری، هر کدام با حالت ایستا و متحرک.', 'سه سبک یکپارچه‌ی خطی، توپر و دوتایی.'], [['تعداد', '۲۴۰ آیکون'], ['فرمت', 'SVG و Lottie']]) },
	{ key: 'kit-deck', title: 'قالب ارائه‌ی سینمایی', slug: 'cinematic-presentation-template', price: 1320000, sku: 'SY-DECK', image: 'product-5', gallery: ['product-5-b'], terms: ['pcat-kit'], virtual: true,
		excerpt: '۴۰ اسلاید با نور و حرکت‌های نرم، برای ارائه در کی‌نوت و پاورپوینت.',
		content: L.productBody(['۴۰ اسلاید با تیترهای درشت، نور و حرکت‌های نرم، برای ارائه‌ی محصول و گزارش سالانه.', 'همه‌ی متن‌ها و رنگ‌ها قابل ویرایش‌اند.'], [['تعداد', '۴۰ اسلاید'], ['فرمت', 'Keynote و PowerPoint']]) },
	{ key: 'course-motion', title: 'دوره‌ی موشن دیزاین', slug: 'motion-design-course', price: 8900000, sku: 'SY-COURSE', image: 'product-6', gallery: ['product-6-b'], terms: ['pcat-course'], virtual: true,
		excerpt: '۱۲ هفته آموزش پروژه‌محور؛ از اصول حرکت تا پروژه‌ی پایانی.',
		content: L.productBody(['دوره‌ای دوازده‌هفته‌ای که با اصول حرکت شروع می‌شود و به یک پروژه‌ی کامل می‌رسد. هر هفته یک تمرین و بازبینی فردی دارد.', 'در پایان یک ویدیوی نمونه‌کار و یک انیمیشن رابط آماده‌ی پورتفولیو دارید.'], [['مدت', '۱۲ هفته'], ['برگزاری', 'آنلاین زنده'], ['سطح', 'مقدماتی تا متوسط'], ['گواهی', 'دارد']]) },
];

/* ---------------- Package ---------------- */


const pages = [
	{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings({ header: 'transparent-light' }) },
	{ key: 'home-2', title: 'خانه — نسخه‌ی دوم', slug: 'home-2', elementor: home2, settings: L.pageSettings({ header: 'transparent-light' }) },
	{ key: 'work', title: 'نمونه‌کارها', slug: 'work', elementor: workPage, settings: L.pageSettings() },
	{ key: 'services', title: 'خدمات', slug: 'services', elementor: services, settings: L.pageSettings() },
	{ key: 'brief', title: 'شروع پروژه', slug: 'start-a-project', elementor: brief, settings: L.pageSettings() },
	{ key: 'about', title: 'درباره‌ی سیال', slug: 'about', elementor: about, settings: L.pageSettings() },
	{ key: 'faq', title: 'پرسش‌های متداول', slug: 'faq', elementor: faqPage, settings: L.pageSettings() },
	{ key: 'contact', title: 'تماس', slug: 'contact', elementor: contact, settings: L.pageSettings() },
	{ key: 'blog', title: 'مجله', slug: 'journal', content: '' },
];

module.exports = {
	manifest: {
		id: 'flux',
		order: 6,
		title: 'سیال',
		desc: 'استودیوی موشن؛ سایت کامل با دو صفحه‌ی اصلی، نمونه‌کار با کارت‌های پشته‌ای و اسکرول افقی، خدمات و تعرفه، فروشگاه بسته‌های انیمیشن، فرم سه‌مرحله‌ای شروع پروژه و مجله. گرافیتی و عاجی با رد نور.',
		kit: 'flux',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: ['woocommerce'],
		tags: ['خلاقیت', 'موشن', 'استودیو'],
		pages: pages.filter((p) => p.elementor).map((p) => p.title).concat(['فروشگاه', 'مجله']),
	},
	content: {
		site: { title: 'سیال', tagline: 'استودیوی موشن و تجربه‌ی تعاملی' },
		images, alts, terms, posts, products, pages,
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'سیال — صفحه‌ی اصلی' },
			{ key: 'tpl-home-2', type: 'page', page: 'home-2', title: 'سیال — صفحه‌ی اصلی، نسخه‌ی دوم' },
			{ key: 'tpl-work', type: 'page', page: 'work', title: 'سیال — نمونه‌کارها' },
			{ key: 'tpl-services', type: 'page', page: 'services', title: 'سیال — خدمات' },
			{ key: 'tpl-brief', type: 'page', page: 'brief', title: 'سیال — شروع پروژه' },
			{ key: 'tpl-hero', type: 'section', page: 'home', index: 0, title: 'سیال — هیرو با تیتر پلکانی' },
			{ key: 'tpl-hscroll', type: 'section', page: 'home', index: 3, title: 'سیال — اسکرول افقی نمونه‌کار' },
			{ key: 'tpl-tabs', type: 'section', page: 'home', index: 4, title: 'سیال — خدمات در زبانه‌ها' },
			{ key: 'tpl-zoom', type: 'section', page: 'home', index: 5, title: 'سیال — زوم سینمایی با اسکرول' },
			{ key: 'tpl-showcase', type: 'section', page: 'home-2', index: 0, title: 'سیال — اسلایدر سینمایی' },
			{ key: 'tpl-cases', type: 'section', page: 'home-2', index: 1, title: 'سیال — نمونه‌کار با کارت‌های پشته‌ای' },
			{ key: 'tpl-path', type: 'section', page: 'home-2', index: 3, title: 'سیال — مسیر روند کار' },
		],
		menus: [
			{
				name: 'سیال — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home', children: [{ title: 'نسخه‌ی اول — حرکت', page: 'home' }, { title: 'نسخه‌ی دوم — سینمایی', page: 'home-2' }] },
					{ title: 'نمونه‌کارها', page: 'work' },
					{ title: 'خدمات', page: 'services' },
					{ title: 'فروشگاه', url: '{{shop}}' },
					{ title: 'مجله', page: 'blog' },
					{ title: 'استودیو', page: 'about', children: [
						{ title: 'درباره‌ی سیال', page: 'about' },
						{ title: 'پرسش‌های متداول', page: 'faq' },
						{ title: 'تماس', page: 'contact' },
					] },
				],
			},
			{
				name: 'سیال — پابرگ', location: 'footer', items: [
					{ title: 'نمونه‌کارها', page: 'work' },
					{ title: 'خدمات', page: 'services' },
					{ title: 'شروع پروژه', page: 'brief' },
					{ title: 'پرسش‌های متداول', page: 'faq' },
					{ title: 'تماس', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 36,
			color_scheme: 'dark',
			font_body: 'iransansx',
			font_heading: 'lahzeh',
			font_heading_weight: '600',
			header_layout: 'split',
			header_cta_text: 'شروع پروژه',
			header_cta_url: '{{page:brief}}',
			footer_about: 'سیال استودیوی موشن و تجربه‌ی تعاملی است: ویدیو، انیمیشن رابط کاربری و وب‌سایت‌های اسکرولی برای برندهایی که می‌خواهند حس شوند.',
			footer_copyright: 'تمام حقوق برای استودیوی سیال محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'youtube', url: 'https://youtube.com/' }, { network: 'telegram', url: 'https://t.me/' }],
			mobile_bar: true,
			mobile_bar_text: 'شروع پروژه',
			mobile_bar_url: '{{page:brief}}',
			magnetic: true,
			cursor: 'blend',
			sound_enabled: true,
			sound_default: true,
			sound_theme: 'glass',
			sound_volume: 22,
			sound_hover: true,
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', catalog_rows: 3, pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
