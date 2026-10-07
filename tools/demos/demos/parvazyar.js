/**
 * Demo: Parvazyar — domestic and international flight tickets (Azure kit).
 */
'use strict';

const L = require('../lib');
const { img, link, px, section, cols, heading, button } = L;

const images = {
	logo: 'images/logo.webp', 'logo-dark': 'images/logo-dark.webp',
	hero: 'images/hero.webp', sky: 'images/sky.webp', night: 'images/night.webp',
	'card-1': 'images/card-1.webp', 'card-2': 'images/card-2.webp',
	// Destination scenes shared with the Rahnavard demo.
	kish: '../rahnavard/images/dest-4.webp', mashhad: '../rahnavard/images/tour-1.webp',
	istanbul: '../rahnavard/images/dest-7.webp', dubai: '../rahnavard/images/dest-2.webp',
	shiraz: '../rahnavard/images/journal-3.webp', tabriz: '../rahnavard/images/dest-5.webp',
};

const alts = {
	hero: 'دریای ابر در سپیده‌دم از پنجره‌ی هواپیما', sky: 'آسمان آبی بر فراز ابرها', night: 'ابرها در شب، زیر آسمان پرستاره',
	kish: 'آب فیروزه‌ای خلیج فارس', mashhad: 'دشت‌های طلایی در غروب', istanbul: 'دریا در سپیده‌دم', dubai: 'تپه‌های شنی در غروب',
	shiraz: 'غروب بر دشت', tabriz: 'کوه‌های برف‌گیر در مه',
};

const CITIES = ['تهران (امام خمینی)', 'تهران (مهرآباد)', 'مشهد', 'شیراز', 'اصفهان', 'تبریز', 'کیش', 'قشم', 'اهواز', 'بندرعباس', 'استانبول', 'دبی', 'نجف', 'ایروان', 'تفلیس'];

const SEARCH = [
	{ label: 'مبدأ', name: 'from', placeholder: 'شهر یا فرودگاه', options: CITIES, icon: 'takeoff' },
	{ label: 'مقصد', name: 'to', placeholder: 'کجا می‌روید؟', options: CITIES, icon: 'landing' },
	{ label: 'تاریخ رفت', name: 'date', type: 'date', days: 90, icon: 'calendar' },
	{ label: 'مسافران', name: 'adults', type: 'count', placeholder: 'بزرگسال', max: 9, icon: 'users' },
];

const DEALS = [
	{ image: img('kish'), title: 'تهران ← کیش', text: 'کیش‌ایر، ایران‌ایر · ۱ ساعت و ۴۰ دقیقه', meta: 'از ۲٬۴۸۰٬۰۰۰ تومان' },
	{ image: img('mashhad'), title: 'تهران ← مشهد', text: 'ماهان، آسمان، ایران‌ایرتور · ۱ ساعت و ۲۰ دقیقه', meta: 'از ۱٬۹۵۰٬۰۰۰ تومان' },
	{ image: img('istanbul'), title: 'تهران ← استانبول', text: 'ترکیش، ایران‌ایر · ۳ ساعت و ۳۰ دقیقه', meta: 'از ۱۴٬۸۰۰٬۰۰۰ تومان' },
	{ image: img('dubai'), title: 'تهران ← دبی', text: 'فلای‌دبی، ماهان · ۲ ساعت و ۱۰ دقیقه', meta: 'از ۹٬۶۰۰٬۰۰۰ تومان' },
];

const QUOTES = [
	{ quote: 'پروازم دو ساعت تأخیر داشت. قبل از اینکه خودم بفهمم، پیامک پروازیار رسید و پشتیبانی برای پرواز بعدی هم جا رزرو کرده بود.', name: 'مهسا کریمی', role: 'تهران ← شیراز' },
	{ quote: 'تقویم قیمت واقعاً کار می‌کند. با جابه‌جا کردن سفر به سه‌شنبه، برای چهار نفر نزدیک به سه میلیون تومان کمتر پرداختیم.', name: 'رضا امینی', role: 'تهران ← کیش' },
	{ quote: 'استرداد بلیت خارجی همیشه دردسر بود. این بار از داخل حساب کاربری درخواست دادم و پنج روز بعد پول به کارتم برگشت.', name: 'لیلا حسینی', role: 'تهران ← استانبول' },
	{ quote: 'برای سفرهای کاری شرکت از پروازیار استفاده می‌کنیم. فاکتور رسمی و گزارش ماهانه وقت حسابداری را خیلی کم کرده است.', name: 'بهروز نادری', role: 'مدیر اداری، شرکت آرتا' },
];

const FAQ = [
	['بلیت را کی و چطور دریافت می‌کنم؟', 'بلافاصله پس از پرداخت. بلیت به ایمیل و پیامک شما فرستاده می‌شود و در حساب کاربری‌تان هم همیشه در دسترس است.'],
	['استرداد بلیت چطور انجام می‌شود؟', 'از بخش «سفرهای من» درخواست بدهید. مبلغ طبق قوانین هر ایرلاین محاسبه و حداکثر ظرف هفت روز کاری به حسابتان برمی‌گردد.'],
	['قیمت‌ها با خود ایرلاین فرقی دارند؟', 'نه. قیمت هر بلیت همان نرخ رسمی ایرلاین یا آژانس همکار است و هیچ هزینه‌ی پنهانی به آن اضافه نمی‌شود.'],
	['اگر پرواز تأخیر داشته باشد یا لغو شود چه؟', 'تغییرات پرواز را لحظه‌ای پیامک می‌کنیم. در صورت لغو، پشتیبانی برای جابه‌جایی یا استرداد کامل با شما تماس می‌گیرد.'],
];

/* ---------------- Home ---------------- */

const home = [
	L.bleed(L.w('hm-hero', {
		layout: 'full', title_tag: 'h1', title_size: 'xl', header_align: 'center', title_reveal: 'words',
		eyebrow: 'پروازیار · بلیت هواپیما',
		title: 'پرواز بعدی‌تان را\n*آسوده* پیدا کنید',
		desc: 'قیمت همه‌ی ایرلاین‌ها کنار هم، رزرو در کمتر از یک دقیقه و پشتیبانی واقعی تا لحظه‌ای که روی صندلی می‌نشینید.',
		btn1_text: '', btn2_text: '',
		media_type: 'image', image: img('hero'), height: 'screen', decor: 'beams', overlay: px(0.32), hint: '',
	}), { css_classes: 'hm-bleed hm-room-below hm-pull-lg' }),
	section({ space: 'none', cls: 'hm-pull-up hm-pull-lg', gap: 40 }, [
		L.searchBox(SEARCH, { pills: 'یک‌طرفه\nرفت‌وبرگشت\nچندمسیره', pills_name: 'trip', button: 'جست‌وجوی پرواز', look: 'glass', action: '{{page:deals}}' }),
		L.counters([
			{ value: 42, label: 'ایرلاین داخلی و خارجی' },
			{ value: 180, label: 'مقصد در ۲۶ کشور' },
			{ value: 1200000, label: 'مسافر در سه سال' },
			{ value: 4.8, label: 'امتیاز مسافران از ۵' },
		], { style: 'plain', columns: '4' }),
	]),
	section({ space: 'md', gap: 40 }, [
		cols({ widths: [55, 45], align: 'flex-end' }, [
			[heading({ eyebrow: 'چرا پروازیار', title: 'خرید بلیت،\n*بی‌دغدغه*' })],
			[L.textEditor('<p>هر چیزی که خرید بلیت را کند یا پرهزینه می‌کند، حذف کرده‌ایم؛ از مقایسه‌ی قیمت تا استرداد.</p>')],
		]),
		L.features([
			{ icon: 'chart', title: 'قیمت همه‌ی ایرلاین‌ها، یک‌جا', text: 'نرخ رسمی ۴۲ ایرلاین و آژانس همکار را کنار هم ببینید. تقویم قیمت، ارزان‌ترین روز هر ماه را نشان می‌دهد تا بدانید کِی بخرید.', meta: 'به‌روز هر ۵ دقیقه' },
			{ icon: 'bolt', title: 'رزرو در یک دقیقه', text: 'مسافرهای قبلی ذخیره می‌شوند؛ دفعه‌ی بعد فقط پرواز را انتخاب کنید.' },
			{ icon: 'refresh', title: 'استرداد آنلاین', text: 'درخواست استرداد از حساب کاربری، با محاسبه‌ی شفاف جریمه.' },
			{ icon: 'headphones', title: 'پشتیبانی ۲۴ ساعته', text: 'آدم واقعی پشت خط، حتی ساعت سه بامداد.' },
			{ icon: 'shield', title: 'پرداخت امن', text: 'درگاه شاپرک و نماد اعتماد الکترونیکی؛ اطلاعات کارت ذخیره نمی‌شود.' },
		], { layout: 'grid', style: 'cards', columns: '3', icon_style: 'soft', lead: 'yes' }),
	]),
	section({ space: 'md', scheme: 'surface', gap: 40 }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'پیشنهادهای این هفته', title: 'مسیرهای *پرطرفدار*' })],
			[button('همه‌ی پیشنهادها', '{{page:deals}}', 'secondary', { _flex_align_self: 'flex-end' })],
		]),
		L.features(DEALS.map((d) => Object.assign({ icon: '', link: link('{{page:deals}}') }, d)), { layout: 'grid', style: 'cards', columns: '4', icon_style: 'plain', link_text: 'دیدن پروازها' }),
	]),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'چطور کار می‌کند', title: 'سه قدم تا *صندلی‌تان*', header_align: 'center' }),
		L.steps([
			{ marker: '', icon: 'search', title: 'جست‌وجو', text: 'مبدأ، مقصد و تاریخ را بدهید؛ همه‌ی پروازها با قیمت نهایی جلوی شماست.' },
			{ marker: '', icon: 'compare', title: 'مقایسه و انتخاب', text: 'بر اساس قیمت، ساعت، ایرلاین یا بار مجاز مرتب کنید و بهترین را بردارید.' },
			{ marker: '', icon: 'ticket', title: 'پرداخت و بلیت', text: 'پرداخت امن و صدور فوری؛ بلیت به ایمیل و پیامک‌تان می‌رسد.' },
		], { layout: 'h', cards: 'yes' }),
	]),
	L.cta({
		eyebrow: 'پروازهای شبانه',
		title: 'شب‌ها ارزان‌تر\n*پرواز کنید*',
		desc: 'پروازهای بعد از ساعت ۲۲ تا ۳۰ درصد ارزان‌ترند. هشدار قیمت را روشن کنید تا اولین نفری باشید که باخبر می‌شود.',
		btn1_text: 'روشن‌کردن هشدار قیمت', btn1_link: link('{{page:contact}}'),
		btn2_text: 'پروازهای امشب', btn2_link: link('{{page:deals}}'),
		look: 'image', image: img('night'), decor: '', note: '',
	}),
	section({ space: 'md', gap: 40 }, [
		heading({ eyebrow: 'مسافرها می‌گویند', title: 'تجربه‌ی *واقعی*، نه تبلیغ' }),
		L.testimonials(QUOTES, { layout: 'carousel' }),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *خرید*' }), button('گفت‌وگو با پشتیبانی', '{{page:contact}}', 'secondary')],
			[L.faq(FAQ)],
		]),
	]),
	L.bleed(L.w('hm-hero', {
		layout: 'center', title_tag: 'h2', title_size: 'lg', header_align: 'center', title_reveal: 'words',
		eyebrow: 'اپلیکیشن پروازیار',
		title: 'بلیت، کارت پرواز و پشتیبانی\n*در جیب شما*',
		desc: 'نسخه‌ی اندروید و آی‌اواس؛ با هشدار تأخیر، کارت پرواز آفلاین و تماس یک‌لمسی با پشتیبانی.',
		btn1_text: 'دریافت اپلیکیشن', btn1_link: link('{{page:contact}}'), btn1_style: 'primary',
		btn2_text: 'بیشتر بدانید', btn2_link: link('{{page:about}}'), btn2_style: 'secondary',
		media_type: 'none', height: 'auto', decor: 'beams', scheme: 'inverse', hint: '',
	})),
];

/* ---------------- Deals ---------------- */

const deals = [
	section({ space: 'md', bottom0: true, gap: 32 }, [
		heading({ eyebrow: 'پیشنهادها', title: 'پروازهای *ارزان* این هفته', title_tag: 'h1', title_size: 'xl', header_align: 'center', desc: 'قیمت‌ها از نرخ رسمی ایرلاین‌ها و هر پنج دقیقه به‌روز می‌شوند.' }),
		L.searchBox(SEARCH, { pills: 'یک‌طرفه\nرفت‌وبرگشت', pills_name: 'trip', button: 'جست‌وجو', look: 'solid', action: '{{page:deals}}' }),
	]),
	section({ space: 'md', gap: 40 }, [
		L.features(DEALS.concat([
			{ image: img('shiraz'), title: 'تهران ← شیراز', text: 'ایران‌ایر، زاگرس · ۱ ساعت و ۱۵ دقیقه', meta: 'از ۱٬۷۸۰٬۰۰۰ تومان' },
			{ image: img('tabriz'), title: 'تهران ← تبریز', text: 'آسمان، ایران‌ایرتور · ۱ ساعت و ۱۰ دقیقه', meta: 'از ۱٬۶۴۰٬۰۰۰ تومان' },
			{ image: img('card-1'), title: 'تهران ← ایروان', text: 'ایرارمنیا، آسمان · ۲ ساعت', meta: 'از ۸٬۲۰۰٬۰۰۰ تومان' },
			{ image: img('card-2'), title: 'مشهد ← نجف', text: 'ماهان، آسمان · ۲ ساعت و ۲۰ دقیقه', meta: 'از ۷٬۹۰۰٬۰۰۰ تومان' },
		]).map((d) => Object.assign({ icon: '', link: link('{{page:contact}}') }, d)), { layout: 'grid', style: 'cards', columns: '4', icon_style: 'plain', link_text: 'رزرو' }),
	]),
];

/* ---------------- About ---------------- */

const about = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'درباره‌ی پروازیار', title: 'خرید بلیت باید\n*ساده* باشد', title_tag: 'h1', title_size: 'xl' }),
	]),
	section({ space: 'md' }, [
		cols({ widths: [50, 50], gap: 64, align: 'center' }, [
			[L.textScrub('پروازیار را تیمی از مهندسان و کارشناسان گردشگری ساخته‌اند که سال‌ها در آژانس‌های هواپیمایی کار کرده‌اند. می‌دانستیم مسافر از چه چیزهایی *خسته* است: قیمت‌های پراکنده، تماس‌های بی‌جواب و استرداد طولانی. پروازیار جواب ما به همین‌هاست.', { size: 'md' })],
			[L.imageReveal('sky', { ratio: '4-3', reveal: 'clip-up', parallax: px(0.25) })],
		]),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		L.counters([
			{ value: 3, label: 'سال تجربه‌ی آنلاین' },
			{ value: 64, label: 'نفر در تیم' },
			{ value: 42, label: 'ایرلاین همکار' },
			{ value: 1200000, label: 'مسافر' },
		], { style: 'plain', columns: '4' }),
	]),
	section({ space: 'md' }, [
		heading({ eyebrow: 'مجوزها', title: 'رسمی و *پاسخ‌گو*' }),
		L.features([
			{ icon: 'award', title: 'دفتر خدمات مسافرت هوایی بند الف', text: 'دارای مجوز سازمان هواپیمایی کشوری و عضو انجمن صنفی دفاتر خدمات مسافرت هوایی.' },
			{ icon: 'shield', title: 'نماد اعتماد الکترونیکی', text: 'دارای نماد دوستاره از مرکز توسعه‌ی تجارت الکترونیکی.' },
			{ icon: 'card', title: 'پرداخت شاپرک', text: 'تمام پرداخت‌ها از درگاه‌های رسمی شاپرک انجام می‌شود.' },
		], { layout: 'grid', style: 'plain', columns: '3', icon_style: 'soft' }),
	]),
];

/* ---------------- Contact ---------------- */

const contact = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'پشتیبانی', title: 'همیشه *در دسترس*', title_tag: 'h1', title_size: 'xl', desc: 'پشتیبانی پروازیار هفت روز هفته و ۲۴ ساعته پاسخ‌گوست. برای پیگیری بلیت، شماره‌ی رزرو را همراه داشته باشید.' }),
	]),
	section({ space: 'md' }, [
		cols({ widths: [40, 60], gap: 56 }, [
			[L.contactInfo([
				{ icon: 'phone', label: 'پشتیبانی ۲۴ ساعته', value: '۰۲۱-۴۳۹۰۰۰۰۰', link: link('tel:+982143900000') },
				{ icon: 'whatsapp', label: 'واتس‌اپ', value: '۰۹۱۲ ۷۰۰ ۳۴۵۰', link: link('https://wa.me/989127003450', true) },
				{ icon: 'mail', label: 'ایمیل', value: 'support@parvazyar.ir', link: link('mailto:support@parvazyar.ir') },
				{ icon: 'pin', label: 'دفتر مرکزی', value: 'تهران، خیابان آزادی، نرسیده به فرودگاه مهرآباد، پلاک ۴۲۰', link: link('') },
			])],
			[L.contactForm({ show_phone: 'yes', label_phone: 'شماره‌ی موبایل', show_subject: 'yes', label_subject: 'شماره‌ی رزرو (اگر دارید)', label_name: 'نام و نام خانوادگی', label_email: 'ایمیل', label_message: 'پیام شما', button: 'ارسال پیام', success: 'پیامتان رسید. همکاران پشتیبانی به‌زودی تماس می‌گیرند.' })],
		]),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پاسخ‌های *کوتاه*' })],
			[L.faq(FAQ)],
		]),
	]),
];

/* ---------------- Journal ---------------- */

const terms = [
	{ key: 'cat-guide', taxonomy: 'category', name: 'راهنمای سفر', slug: 'travel-guide' },
	{ key: 'cat-news', taxonomy: 'category', name: 'اخبار پرواز', slug: 'flight-news' },
];

const posts = [
	{
		key: 'cheap-days', title: 'ارزان‌ترین روزهای هفته برای پرواز', slug: 'cheapest-days-to-fly', image: 'sky', terms: ['cat-guide'], days_ago: 2,
		excerpt: 'سه‌شنبه‌ها و چهارشنبه‌ها معمولاً ارزان‌ترند؛ اما همیشه نه.',
		content: L.article([
			'قیمت بلیت به تقاضا بستگی دارد. در مسیرهای داخلی، پروازهای میانه‌ی هفته و ساعت‌های اول صبح یا آخر شب معمولاً ارزان‌ترند.',
			['h', 'تقویم قیمت را ببینید'],
			'در صفحه‌ی نتایج، تقویم قیمت ارزان‌ترین پرواز هر روز ماه را نشان می‌دهد. گاهی یک روز جابه‌جایی، هزینه را چند صد هزار تومان کم می‌کند.',
		]),
	},
	{
		key: 'baggage', title: 'بار مجاز پروازهای داخلی و خارجی', slug: 'baggage-allowance', image: 'card-1', terms: ['cat-guide'], days_ago: 9,
		excerpt: 'چند کیلو بار همراه داشته باشیم و هزینه‌ی اضافه‌بار چقدر است؟',
		content: L.article([
			'بار مجاز هر بلیت روی کارت پرواز و در جزئیات رزرو نوشته شده است. در بیشتر پروازهای داخلی، ۲۰ کیلو بار و ۵ کیلو بار دستی مجاز است.',
			['ul', ['پروازهای خارجی معمولاً ۳۰ کیلو بار مجاز دارند.', 'اضافه‌بار را پیش از سفر بخرید؛ در فرودگاه گران‌تر است.', 'مایعات بار دستی باید در ظرف‌های ۱۰۰ میلی‌لیتری باشند.']],
		]),
	},
	{
		key: 'night-flights', title: 'پروازهای شبانه؛ ارزان‌تر و خلوت‌تر', slug: 'night-flights', image: 'night', terms: ['cat-news'], days_ago: 15,
		excerpt: 'چرا پروازهای بعد از ساعت ۲۲ ارزان‌ترند و چطور راحت‌تر سفر کنیم.',
		content: L.article([
			'ایرلاین‌ها برای پر کردن صندلی پروازهای دیروقت، قیمت پایین‌تری می‌گذارند. فرودگاه هم خلوت‌تر است و صف‌ها کوتاه‌تر.',
			['q', 'پرواز ساعت یک بامداد، بی‌صف و بی‌شلوغی؛ سه میلیون هم کمتر دادم.', 'یکی از کاربران پروازیار'],
		]),
	},
];

module.exports = {
	manifest: {
		id: 'parvazyar',
		order: 8,
		title: 'پروازیار',
		desc: 'سایت فروش بلیت هواپیما؛ جست‌وجوی پرواز روی تصویر تمام‌صفحه، ستون‌های نور، کارت شاخص و پیشنهادهای مسیر.',
		kit: 'azure',
		thumb: 'thumb.webp',
		required: ['elementor'],
		recommended: [],
		tags: ['گردشگری', 'بلیت هواپیما', 'شرکتی'],
		pages: ['خانه', 'پیشنهادها', 'درباره‌ی ما', 'پشتیبانی', 'مجله'],
	},
	content: {
		site: { title: 'پروازیار', tagline: 'بلیت هواپیما، آسوده' },
		images, alts, terms, posts,
		pages: [
			{ key: 'home', title: 'خانه', slug: 'home', elementor: home, settings: L.pageSettings({ header: 'transparent-light' }) },
			{ key: 'deals', title: 'پیشنهادها', slug: 'deals', elementor: deals, settings: L.pageSettings() },
			{ key: 'about', title: 'درباره‌ی ما', slug: 'about', elementor: about, settings: L.pageSettings() },
			{ key: 'contact', title: 'پشتیبانی', slug: 'support', elementor: contact, settings: L.pageSettings() },
			{ key: 'blog', title: 'مجله', slug: 'journal', content: '' },
		],
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'پروازیار — صفحه‌ی اصلی' },
			{ key: 'tpl-search', type: 'section', page: 'home', index: 1, title: 'پروازیار — جعبه‌ی جست‌وجو و آمار' },
			{ key: 'tpl-why', type: 'section', page: 'home', index: 2, title: 'پروازیار — ویژگی‌ها با کارت شاخص' },
			{ key: 'tpl-deals', type: 'section', page: 'home', index: 3, title: 'پروازیار — پیشنهادهای مسیر' },
		],
		menus: [
			{
				name: 'پروازیار — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home' },
					{ title: 'پیشنهادها', page: 'deals' },
					{ title: 'مجله', page: 'blog' },
					{ title: 'درباره‌ی ما', page: 'about' },
					{ title: 'پشتیبانی', page: 'contact' },
				],
			},
			{
				name: 'پروازیار — پابرگ', location: 'footer', items: [
					{ title: 'پیشنهادها', page: 'deals' },
					{ title: 'مجله', page: 'blog' },
					{ title: 'درباره‌ی ما', page: 'about' },
					{ title: 'پشتیبانی', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 34,
			header_layout: 'split',
			header_cart: false,
			header_cta_text: 'پیگیری بلیت',
			header_cta_url: '{{page:contact}}',
			footer_about: 'پروازیار، دفتر خدمات مسافرت هوایی دارای مجوز بند الف از سازمان هواپیمایی کشوری؛ فروش بلیت پروازهای داخلی و خارجی با پشتیبانی ۲۴ ساعته.',
			footer_copyright: 'تمام حقوق برای پروازیار محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }, { network: 'linkedin', url: 'https://linkedin.com/' }],
			mobile_bar: true,
			mobile_bar_text: 'جست‌وجوی پرواز',
			mobile_bar_url: '{{page:deals}}',
			mobile_bar_phone: '02143900000',
		},
		front_page: 'home',
		posts_page: 'blog',
	},
};
