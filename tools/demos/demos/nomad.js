/**
 * Demo: Kooch — organic food and handwoven crafts from nomadic families (Nomad kit).
 */
'use strict';

const L = require('../lib');
const { img, link, px, section, cols, heading, button } = L;

const images = { hero: 'images/hero.webp', pattern: 'images/pattern.webp', weaving: 'images/weaving.webp' };
for (let i = 1; i <= 6; i++) { images['product-' + i] = 'images/product-' + i + '.webp'; images['product-' + i + '-b'] = 'images/product-' + i + '-b.webp'; images['journal-' + i] = 'images/journal-' + i + '.webp'; }
for (let i = 1; i <= 6; i++) { images['person-' + i] = '../shared/images/person-' + i + '.webp'; }

images.logo = 'images/logo.webp';
images['logo-dark'] = 'images/logo-dark.webp';

const alts = {
	hero: 'سیاه‌چادرهای عشایر در دامنه‌ی زاگرس هنگام طلوع',
	pattern: 'نوار نقش گلیم با لوزی‌های پله‌ای',
	weaving: 'دار قالی با گبه‌ی نیمه‌بافته و کلاف‌های پشم رنگ‌شده',
	'product-1': 'روغن حیوانی کوچ', 'product-2': 'کشک محلی کوچ', 'product-3': 'قره‌قروت کوچ',
	'product-4': 'آویشن کوهی کوچ', 'product-5': 'گبه‌ی دستباف', 'product-6': 'جوراب پشمی دستباف',
};

const QUOTES = [
	{ quote: 'روغن حیوانی‌اش همان بوی خانه‌ی مادربزرگم در فارس را می‌دهد. سال‌ها بود چنین روغنی پیدا نکرده بودم.', name: 'منیژه بهادری', role: 'مشتری از تهران', avatar: img('person-4') },
	{ quote: 'گبه را برای اتاق بچه گرفتیم. پشت هر فرش اسم بافنده‌اش نوشته شده؛ این برای ما خیلی ارزش داشت.', name: 'پیمان افشار', role: 'مشتری از کرج', avatar: img('person-1') },
	{ quote: 'کشک و قره‌قروت را برای رستورانمان می‌گیریم. کیفیتش ثابت است و همیشه به موقع می‌رسد.', name: 'سحر نادری', role: 'سرآشپز، رستوران سنتی', avatar: img('person-6') },
];

const FAQ = [
	['محصولات از کجا می‌آیند؟', 'از چهارده خانواده‌ی عشایر قشقایی و بختیاری که مستقیم با آن‌ها کار می‌کنیم. نام خانواده و منطقه روی هر بسته نوشته شده است.'],
	['روغن حیوانی را چطور نگه دارم؟', 'در ظرف دربسته و جای خنک. در دمای اتاق تا شش ماه و در یخچال تا یک سال کیفیتش را حفظ می‌کند.'],
	['گبه‌ها دقیقاً همان عکس‌اند؟', 'هر گبه دست‌بافت و یکتاست. عکس هر فرش، خود همان فرش است و ابعاد دقیقش در صفحه‌ی محصول آمده.'],
	['ارسال به شهرستان دارید؟', 'بله، به همه‌ی شهرها. محصولات خوراکی در بسته‌بندی عایق و گبه‌ها لوله‌شده در کیسه‌ی پارچه‌ای ارسال می‌شوند.'],
	['سهم خانواده‌ها از فروش چقدر است؟', 'قیمت خرید را خود خانواده‌ها تعیین می‌کنند و ما پیش از برداشت پرداخت می‌کنیم. هر سال گزارش خریدها را منتشر می‌کنیم.'],
];

/* ---------------- Home A ---------------- */

const homeA = [
	L.hero({
		layout: 'split',
		eyebrow: 'از ییلاق تا خانه‌ی شما',
		title: 'آنچه عشایر\n*برای سفره‌ی خودشان*\nمی‌سازند.',
		desc: 'کوچ روغن حیوانی، کشک، گیاهان کوهی و دست‌بافته‌های خانواده‌های عشایر قشقایی و بختیاری را بی‌واسطه به شهر می‌آورد؛ همان‌ها که برای چادر خودشان می‌سازند.',
		btn1_text: 'خرید محصولات', btn1_link: link('{{shop}}'),
		btn2_text: 'خانواده‌های کوچ', btn2_link: link('{{page:about}}'),
		stats: [
			{ value: '۱۴', label: 'خانواده‌ی عشایر' },
			{ value: '۲', label: 'ایل: قشقایی و بختیاری' },
			{ value: '۱۰۰٪', label: 'پرداخت پیش از برداشت' },
		],
		media_type: 'image',
		image: img('hero'),
		media_ratio: 'landscape',
		height: 'screen',
		decor: '',
		hint: 'اسکرول کنید',
	}),
	L.marquee(['روغن حیوانی', 'کشک محلی', 'قره‌قروت', 'آویشن کوهی', 'گبه‌ی دستباف', 'جوراب پشمی'], { look: 'solid', size: 'md', separator: 'plus', speed: px(45) }),
	section({ space: 'md' }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'محصولات فصل', title: 'از *چادر* تا آشپزخانه' })],
			[button('همه‌ی محصولات', '{{shop}}', 'secondary')],
		]),
		L.products({ source: 'featured', count: 4, columns: '4' }),
	]),
	section({ space: 'none', cls: 'hm-kilim-top' }, [L.imageReveal('pattern', { ratio: 'auto', reveal: 'clip-x', parallax: px(0) })]),
	section({ space: 'md', width: 1100 }, [
		L.textScrub('عشایر هیچ‌وقت برای بازار نساختند؛ برای *چادر خودشان* ساختند. ما فقط راهی پیدا کردیم که آنچه برای خودشان می‌سازند، *به شهر هم برسد*، با قیمتی که خودشان تعیین می‌کنند.', { eyebrow: 'چرا کوچ', size: 'lg' }),
	]),
	L.hscroll({
		eyebrow: 'یک سال با عشایر',
		title: 'هر فصل،\n*یک محصول*',
		desc: 'زندگی عشایر با فصل‌ها جابه‌جا می‌شود؛ محصولات ما هم.',
		items: [
			{ image: img('journal-1'), label: 'بهار', title: 'کوچ بهاره', text: 'ایل از قشلاق به سوی ییلاق راه می‌افتد؛ مسیری چند هفته‌ای.', link: link('{{post:spring-migration}}') },
			{ image: img('journal-3'), label: 'اوایل تابستان', title: 'روغن و کشک', text: 'شیر فراوان است؛ روغن حیوانی و کشک در مشک‌ها ساخته می‌شود.', link: link('{{post:making-ghee}}') },
			{ image: img('journal-4'), label: 'تابستان', title: 'گیاهان ییلاق', text: 'آویشن و گیاهان کوهی در اوج عطر چیده و در سایه خشک می‌شوند.', link: link('{{post:mountain-herbs}}') },
			{ image: img('journal-5'), label: 'پاییز', title: 'رنگرزی و بافت', text: 'پشم شسته و با روناس و پوست گردو رنگ می‌شود؛ دارها برپا می‌شوند.', link: link('{{post:natural-dyes}}') },
			{ image: img('journal-6'), label: 'زمستان', title: 'قشلاق', text: 'در گرمای قشلاق، گبه‌ها و جوراب‌ها کامل می‌شوند.', link: link('{{post:night-in-the-tent}}') },
		],
		card_size: 'md',
		card_style: 'caption',
		scheme: 'surface',
	}),
	section({ space: 'md' }, [
		heading({ eyebrow: 'قول‌های کوچ', title: 'چهار چیز که *عوض نمی‌شود*', header_align: 'center' }),
		L.features([
			{ icon: 'tent', title: 'مستقیم از خانواده‌ها', text: 'بدون واسطه می‌خریم؛ نام خانواده روی هر بسته است.', meta: '۱۴ خانواده' },
			{ icon: 'leaf', title: 'بدون افزودنی', text: 'نه نگهدارنده، نه رنگ، نه طعم‌دهنده؛ همان دستور قدیمی.', meta: 'طبیعی' },
			{ icon: 'heart', title: 'قیمت منصفانه', text: 'قیمت را خود خانواده‌ها تعیین می‌کنند و پیش از برداشت پرداخت می‌شود.', meta: 'تجارت منصفانه' },
			{ icon: 'truck', title: 'ارسال به همه‌ی شهرها', text: 'بسته‌بندی عایق برای خوراکی‌ها و کیسه‌ی پارچه‌ای برای دست‌بافته‌ها.', meta: '۲ تا ۴ روز' },
		], { layout: 'grid', style: 'cards', columns: '4', icon_style: 'tile' }),
	]),
	section({ space: 'md', scheme: 'inverse' }, [
		cols({ widths: [50, 50], gap: 64, align: 'center' }, [
			[
				heading({ eyebrow: 'دست‌بافته‌ها', title: 'هر گبه،\n*یک بافنده، یک داستان*', desc: 'گبه‌ها را زنان ایل بدون نقشه و از روی حافظه می‌بافند. پشم از گوسفندان خود ایل است و رنگ‌ها از روناس، پوست گردو و نیل. پشت هر گبه نام بافنده‌اش دوخته شده است.' }),
				button('دیدن گبه‌ها', '{{product:gabbeh-rug}}', 'primary'),
			],
			[L.imageReveal('weaving', { ratio: '4-3', reveal: 'clip-up', parallax: px(0.3) })],
		]),
	]),
	section({ space: 'md' }, [
		heading({ eyebrow: 'مشتری‌ها می‌گویند', title: 'طعمی که *آشناست*', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]),
	section({ space: 'md', top0: true }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'پیش از *خرید*' }), button('تماس با ما', '{{page:contact}}', 'secondary')],
			[L.faq(FAQ)],
		]),
	]),
	section({ space: 'md', scheme: 'surface', cls: 'hm-kilim-top' }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'دفتر کوچ', title: 'روایت‌هایی از *ییلاق*' })],
			[button('همه‌ی روایت‌ها', '{{blog}}', 'secondary')],
		]),
		L.posts({ count: 3, layout: 'grid', columns: '3' }),
	]),
	L.cta({
		eyebrow: 'جعبه‌ی فصل',
		title: 'هر فصل، *یک جعبه*\nاز ییلاق.',
		desc: 'روغن، کشک، گیاهان و یک دست‌بافته‌ی کوچک؛ چهار بار در سال، با تازه‌ترین محصول هر فصل.',
		btn1_text: 'سفارش جعبه‌ی فصل', btn1_link: link('{{page:contact}}'),
		btn2_text: 'فروشگاه', btn2_link: link('{{shop}}'),
		look: 'inverse',
		decor: '',
		note: '',
	}),
];

/* ---------------- Home B ---------------- */

const homeB = [
	L.hero({
		layout: 'editorial',
		eyebrow: 'کوچ · محصولات عشایری',
		title: 'از *ییلاق*،\nبه شهر.',
		desc: 'خوراکی‌های طبیعی و دست‌بافته‌های اصیل، مستقیم از خانواده‌های عشایر.',
		btn1_text: 'خرید', btn1_link: link('{{shop}}'),
		btn2_text: 'داستان ما', btn2_link: link('{{page:about}}'),
		media_type: 'image',
		image: img('weaving'),
		media_ratio: 'landscape',
		height: 'auto',
		decor: 'rule',
	}),
	section({ space: 'md' }, [
		L.tabs([
			{ title: 'روغن حیوانی', subtitle: 'خوراکی', meta: '۰۱', image: img('product-1'), panel_title: 'همان روغن زرد قدیمی', panel_text: 'از کره‌ی شیر گوسفندانی که در ییلاق می‌چرند، با جوشاندن آرام روی آتش هیزم. عطرش برنج را عوض می‌کند.', chips: 'شیر گوسفند، ییلاق، بدون افزودنی', btn_text: 'خرید روغن', btn_link: link('{{product:ghee}}') },
			{ title: 'کشک و قره‌قروت', subtitle: 'خوراکی', meta: '۰۲', image: img('product-2'), panel_title: 'از دوغ، زیر آفتاب ییلاق', panel_text: 'کشک گلوله‌ای و قره‌قروت از دوغ همان شیر، خشک‌شده در آفتاب؛ ترش و پرطعم، بدون نمک اضافه.', chips: 'آفتاب‌خشک، دست‌ساز', btn_text: 'خرید کشک', btn_link: link('{{product:kashk}}') },
			{ title: 'گیاهان کوهی', subtitle: 'دمنوش و ادویه', meta: '۰۳', image: img('product-4'), panel_title: 'چیده‌شده در اوج عطر', panel_text: 'آویشن کوهی و گیاهان ییلاق را در زمان گلدهی می‌چینند و در سایه خشک می‌کنند تا عطرشان بماند.', chips: 'آویشن، پونه، گل‌گاوزبان', btn_text: 'خرید آویشن', btn_link: link('{{product:wild-thyme}}') },
			{ title: 'دست‌بافته‌ها', subtitle: 'گبه و جوراب', meta: '۰۴', image: img('product-5'), panel_title: 'بافته از حافظه', panel_text: 'گبه‌ها و جوراب‌های پشمی که زنان ایل بدون نقشه و با رنگ‌های گیاهی می‌بافند. هر کدام یکتاست.', chips: 'پشم، روناس، نیل', btn_text: 'دیدن گبه‌ها', btn_link: link('{{product:gabbeh-rug}}') },
		], { autoplay: 7, media_side: 'start' }),
	]),
	section({ space: 'sm', scheme: 'surface' }, [
		L.counters([
			{ value: 14, label: 'خانواده‌ی همکار' },
			{ value: 2600, label: 'متر ارتفاع ییلاق' },
			{ value: 380, label: 'گبه‌ی فروخته‌شده' },
			{ value: 0, label: 'افزودنی' },
		], { style: 'cards', columns: '4' }),
	]),
	section({ space: 'md' }, [
		heading({ eyebrow: 'خانواده‌ها', title: 'سه *خانواده*، سه منطقه', header_align: 'center' }),
		L.stack([
			{ eyebrow: 'ایل قشقایی · فیروزآباد', title: 'خانواده‌ی کشکولی', text: 'سه نسل گله‌داری و ساخت روغن حیوانی. روغن کوچ از مشک‌های همین خانواده می‌آید.', points: 'روغن حیوانی\nکره‌ی محلی\nکشک گلوله‌ای', image: img('product-1-b'), btn_text: 'محصولات این خانواده', btn_link: link('{{product:ghee}}'), tone: '' },
			{ eyebrow: 'ایل بختیاری · چهارمحال', title: 'خانواده‌ی دره‌شوری', text: 'زنان این خانواده گبه‌های کوچک کوچ را می‌بافند؛ نقش شیر و درخت زندگی امضای آن‌هاست.', points: 'گبه‌ی دستباف\nرنگرزی گیاهی\nجوراب پشمی', image: img('product-5-b'), btn_text: 'گبه‌های این خانواده', btn_link: link('{{product:gabbeh-rug}}'), tone: 'inverse' },
			{ eyebrow: 'ایل قشقایی · سمیرم', title: 'خانواده‌ی شش‌بلوکی', text: 'ییلاقشان در ارتفاع ۲۶۰۰ متری است؛ آویشن و گیاهان کوهی را همین خانواده می‌چیند.', points: 'آویشن کوهی\nپونه\nقره‌قروت', image: img('product-4-b'), btn_text: 'گیاهان این خانواده', btn_link: link('{{product:wild-thyme}}'), tone: 'accent' },
		]),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		heading({ eyebrow: 'جعبه‌ی فصل', title: 'ییلاق را *مشترک* شوید', header_align: 'center' }),
		L.pricing([
			{ name: 'جعبه‌ی کوچک', desc: 'برای یک یا دو نفر', price: '۱٬۹۰۰٬۰۰۰', price_alt: '۱٬۷۰۰٬۰۰۰', unit: 'تومان', period: 'هر فصل', features: 'نیم کیلو روغن حیوانی\nکشک و قره‌قروت\nیک بسته گیاه کوهی', btn_text: 'سفارش', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
			{ name: 'جعبه‌ی خانواده', desc: 'برای سه تا پنج نفر', price: '۴٬۲۰۰٬۰۰۰', price_alt: '۳٬۷۸۰٬۰۰۰', unit: 'تومان', period: 'هر فصل', features: 'یک کیلو روغن حیوانی\nکشک، قره‌قروت و کره\nسه بسته گیاه کوهی\nیک جفت جوراب پشمی', btn_text: 'سفارش', btn_link: link('{{page:contact}}'), featured: 'yes', badge: 'پرطرفدار' },
			{ name: 'رستوران‌ها', desc: 'سفارش عمده', price: 'توافقی', price_alt: 'توافقی', unit: '', period: '', features: 'روغن و کشک در بسته‌بندی عمده\nفاکتور رسمی\nارسال منظم', btn_text: 'تماس', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
		], { switch_off: 'هر فصل', switch_on: 'اشتراک سالانه', switch_note: '۱۰٪ تخفیف' }),
	]),
	L.testimonials(QUOTES, { layout: 'marquee' }),
	L.cta({
		eyebrow: 'خبرنامه',
		title: 'وقتی محصول تازه‌ی\n*ییلاق* رسید.',
		desc: 'فصلی یک ایمیل، با خبر محصولات تازه و روایتی از زندگی ایل.',
		action: 'email',
		email_placeholder: 'ایمیل شما',
		email_button: 'عضویت',
		note: '',
		look: 'surface',
		decor: '',
	}),
];

/* ---------------- About ---------------- */

const about = [
	section({ space: 'lg', bottom0: true }, [
		cols({ widths: [55, 45], align: 'flex-end' }, [
			[heading({ eyebrow: 'درباره‌ی کوچ', title: 'یک تابستان در\n*ییلاق*', title_tag: 'h1', title_size: 'xl' })],
			[L.textEditor('<p>کوچ از یک سفر شروع شد. تابستان ۱۴۰۰ چند هفته مهمان یک خانواده‌ی قشقایی در ییلاق سمیرم بودیم. وقت رفتن، روغن و کشکی که برایمان گذاشتند آن‌قدر خوب بود که فکر کردیم این طعم نباید فقط در ییلاق بماند.</p>')],
		]),
	]),
	section({ space: 'md' }, [L.imageReveal('hero', { ratio: '21-9', reveal: 'clip-up', parallax: px(0.3) })]),
	section({ space: 'md', width: 1100 }, [
		L.textScrub('امروز با *چهارده خانواده* کار می‌کنیم. قیمت را خودشان تعیین می‌کنند، پیش از برداشت پول می‌گیرند، و *نامشان روی هر بسته* است؛ چون آنچه می‌فروشیم، کار دست آن‌هاست.', { eyebrow: 'امروز', size: 'md' }),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [50, 50], gap: 64, align: 'center' }, [
			[L.imageReveal('journal-1', { ratio: '4-3', reveal: 'clip-x' })],
			[heading({ eyebrow: 'مسیر کوچ', title: 'از قشلاق تا *ییلاق*', desc: 'خانواده‌های همکار ما هر سال دو بار کوچ می‌کنند: بهار به سوی ییلاق‌های خنک زاگرس و پاییز به سوی قشلاق‌های گرم فارس. محصولات ما هم با همین تقویم ساخته می‌شوند.' })],
		]),
	]),
	section({ space: 'md' }, [
		heading({ eyebrow: 'اصول ما', title: 'آنچه *قول* داده‌ایم' }),
		L.features([
			{ icon: 'heart', title: 'قیمت با خانواده‌هاست', text: 'ما چانه نمی‌زنیم؛ قیمت خرید را خود خانواده‌ها تعیین می‌کنند.' },
			{ icon: 'clock', title: 'پرداخت پیش از برداشت', text: 'پول هر فصل را پیش از برداشت می‌پردازیم تا خانواده‌ها برنامه‌ریزی کنند.' },
			{ icon: 'leaf', title: 'دستور قدیمی', text: 'هیچ محصولی را برای بازار «بهبود» نمی‌دهیم؛ همان‌طور که برای خودشان می‌سازند.' },
			{ icon: 'eye', title: 'گزارش سالانه', text: 'هر سال گزارش خریدها و سهم هر خانواده را منتشر می‌کنیم.' },
		], { layout: 'grid', style: 'plain', columns: '4', icon_style: 'tile' }),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		heading({ eyebrow: 'تیم کوچ', title: 'کسانی که *راه را* باز نگه می‌دارند' }),
		L.team([
			{ photo: img('person-2'), name: 'آیدا کشکولی', role: 'بنیان‌گذار' },
			{ photo: img('person-3'), name: 'بهمن دره‌شوری', role: 'ارتباط با خانواده‌ها' },
			{ photo: img('person-6'), name: 'نسیم فروغی', role: 'کیفیت و بسته‌بندی' },
			{ photo: img('person-5'), name: 'رستم شش‌بلوکی', role: 'ارسال و انبار' },
		], { columns: '4' }),
	]),
	L.cta({
		title: 'مهمان *ییلاق* شوید.',
		desc: 'هر تابستان چند سفر کوچک با خانواده‌های همکار برگزار می‌کنیم.',
		btn1_text: 'اطلاع از سفرها', btn1_link: link('{{page:contact}}'),
		look: 'inverse',
		decor: '',
		note: '',
	}),
];

/* ---------------- Contact ---------------- */

const contact = [
	section({ space: 'lg', bottom0: true }, [
		heading({ eyebrow: 'تماس با کوچ', title: 'سؤال، سفارش عمده\n*یا فقط سلام*', title_tag: 'h1', title_size: 'xl', desc: 'برای سفارش جعبه‌ی فصل، خرید عمده یا سفرهای ییلاق پیام بدهید.' }),
	]),
	section({ space: 'md' }, [
		cols({ widths: [40, 60], gap: 56 }, [
			[L.contactInfo([
				{ icon: 'whatsapp', label: 'واتس‌اپ', value: '۰۹۱۷ ۲۲۰ ۶۴۰۰', link: link('https://wa.me/989172206400', true) },
				{ icon: 'phone', label: 'تلفن', value: '۰۷۱-۳۲۳۴۵۶۷۰', link: link('tel:+987132345670') },
				{ icon: 'mail', label: 'ایمیل', value: 'salam@kooch.ir', link: link('mailto:salam@kooch.ir') },
				{ icon: 'pin', label: 'انبار و فروشگاه', value: 'شیراز، خیابان قصردشت، کوچه‌ی ۲۴، پلاک ۶', link: link('') },
			])],
			[L.contactForm({ show_phone: 'yes', label_phone: 'شماره‌ی موبایل', show_subject: 'yes', label_subject: 'موضوع', label_name: 'نام شما', label_email: 'ایمیل', label_message: 'پیام', button: 'ارسال پیام', success: 'پیامتان رسید؛ به‌زودی جواب می‌دهیم.' })],
		]),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'شاید جوابتان *اینجا* باشد' })],
			[L.faq(FAQ)],
		]),
	]),
];

/* ---------------- Blog ---------------- */

const terms = [
	{ key: 'cat-life', taxonomy: 'category', name: 'زندگی ایل', slug: 'nomadic-life' },
	{ key: 'cat-craft', taxonomy: 'category', name: 'دست‌بافته‌ها', slug: 'crafts' },
	{ key: 'cat-food', taxonomy: 'category', name: 'خوراک', slug: 'food' },
	{ key: 'pcat-food', taxonomy: 'product_cat', name: 'خوراکی‌ها', slug: 'nomad-food' },
	{ key: 'pcat-herb', taxonomy: 'product_cat', name: 'گیاهان کوهی', slug: 'mountain-herbs' },
	{ key: 'pcat-craft', taxonomy: 'product_cat', name: 'دست‌بافته‌ها', slug: 'handwoven' },
];

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
			['ol', ['شیر گوسفند را می‌جوشانند و ماست می‌کنند.', 'ماست را با آب در مشک می‌ریزند و ساعت‌ها تکان می‌دهند تا کره جدا شود.', 'کره را روی آتش آرام هیزم می‌جوشانند تا آبش بخار شود و روغن زرد و شفاف بماند.', 'گاهی برای عطر، کمی آرد یا زردچوبه در پایان اضافه می‌شود؛ روغن کوچ ساده و بدون افزودنی است.']],
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
			['img', 'weaving', 'کلاف‌های پشم رنگ‌شده کنار دار'],
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

/* ---------------- Products ---------------- */

const products = [
	{ key: 'ghee', title: 'روغن حیوانی', slug: 'ghee', price: 2450000, sku: 'KC-GHEE-900', image: 'product-1', gallery: ['product-1-b'], terms: ['pcat-food'], featured: true, stock: 30, weight: 1,
		excerpt: 'روغن زرد از کره‌ی شیر گوسفند ییلاق، جوشیده روی آتش هیزم؛ ۹۰۰ گرم.',
		attributes: [{ name: 'وزن', options: ['۹۰۰ گرم'] }, { name: 'ایل', options: ['قشقایی'] }],
		content: L.productBody(['این روغن از کره‌ی شیر گوسفندانی است که در ییلاق‌های فارس می‌چرند. کره را روی آتش آرام هیزم می‌جوشانند تا روغنی زرد و خوش‌عطر بماند.', 'برای پلو، حلوا و هر غذایی که بوی خانه‌ی مادربزرگ را می‌خواهد.'], [['وزن خالص', '۹۰۰ گرم'], ['ماندگاری', '۶ ماه در دمای اتاق'], ['خانواده', 'کشکولی، فیروزآباد']]) },
	{ key: 'kashk', title: 'کشک محلی گلوله‌ای', slug: 'kashk', price: 690000, sku: 'KC-KASHK-500', image: 'product-2', gallery: ['product-2-b'], terms: ['pcat-food'], featured: true, stock: 60, weight: 0.6,
		excerpt: 'کشک خشک‌شده در آفتاب ییلاق؛ ترش و پرطعم، بدون نمک اضافه.',
		attributes: [{ name: 'وزن', options: ['۵۰۰ گرم'] }],
		content: L.productBody(['کشک گلوله‌ای از دوغ همان شیری است که روغن از آن گرفته می‌شود. گلوله‌ها را زیر آفتاب ییلاق خشک می‌کنند.', 'برای کشک بادمجان و آش، آن را چند ساعت در آب ولرم خیس کنید و بسایید.'], [['وزن خالص', '۵۰۰ گرم'], ['نمک افزوده', 'ندارد'], ['ماندگاری', 'یک سال در جای خشک']]) },
	{ key: 'qara-qurut', title: 'قره‌قروت', slug: 'qara-qurut', price: 520000, sku: 'KC-QARA-300', image: 'product-3', gallery: ['product-3-b'], terms: ['pcat-food'], stock: 45, weight: 0.4,
		excerpt: 'قرص‌های تیره و ترش از جوشاندن آب کشک.',
		attributes: [{ name: 'وزن', options: ['۳۰۰ گرم'] }],
		content: L.productBody(['قره‌قروت از جوشاندن طولانی آب کشک به دست می‌آید تا غلیظ و تیره شود. سپس قرص‌ها را خشک می‌کنند.', 'ترش و پرطعم؛ برای خوردن یا افزودن به آش.'], [['وزن خالص', '۳۰۰ گرم'], ['افزودنی', 'ندارد']]) },
	{ key: 'wild-thyme', title: 'آویشن کوهی', slug: 'wild-thyme', price: 320000, sku: 'KC-THYME-100', image: 'product-4', gallery: ['product-4-b'], terms: ['pcat-herb'], featured: true, stock: 90, weight: 0.15,
		excerpt: 'چیده‌شده در اوج گلدهی در ییلاق سمیرم، خشک‌شده در سایه.',
		attributes: [{ name: 'وزن', options: ['۱۰۰ گرم'] }],
		content: L.productBody(['آویشن کوهی ییلاق سمیرم را صبح زود و در اوج گلدهی می‌چینند و در سایه خشک می‌کنند.', 'برای دمنوش، روی ماست یا در خوراک‌ها.'], [['وزن خالص', '۱۰۰ گرم'], ['ارتفاع ییلاق', '۲۶۰۰ متر'], ['بسته‌بندی', 'پاکت کرافت با زیپ']]) },
	{ key: 'gabbeh-rug', title: 'گبه‌ی دستباف کوچک', slug: 'gabbeh-rug', price: 18500000, sku: 'KC-GAB-0912', image: 'product-5', gallery: ['product-5-b', 'weaving'], terms: ['pcat-craft'], featured: true, stock: 1, weight: 4,
		excerpt: 'گبه‌ی ۹۰ در ۱۲۰ سانتی‌متر با نقش درخت زندگی، پشم و رنگ گیاهی.',
		attributes: [{ name: 'ابعاد', options: ['۹۰ × ۱۲۰ سانتی‌متر'] }, { name: 'بافنده', options: ['خانواده‌ی دره‌شوری'] }],
		content: L.productBody(['این گبه را زنان خانواده‌ی دره‌شوری در طول یک زمستان بافته‌اند؛ بدون نقشه و با پشم گوسفندان خود ایل.', 'رنگ‌ها از روناس، پوست گردو و نیل است. پشت گبه نام بافنده دوخته شده است.'], [['ابعاد', '۹۰ × ۱۲۰ سانتی‌متر'], ['جنس', 'پشم دستریس'], ['رنگ', 'گیاهی'], ['تعداد', 'یکتا']]) },
	{ key: 'wool-socks', title: 'جوراب پشمی دستباف', slug: 'wool-socks', price: 780000, sku: 'KC-SOCK-M', image: 'product-6', gallery: ['product-6-b'], terms: ['pcat-craft'], stock: 25, weight: 0.2,
		excerpt: 'جوراب گرم زمستانی با نقش زیگزاگ، از پشم دستریس.',
		attributes: [{ name: 'سایز', options: ['۳۸ تا ۴۲'] }],
		content: L.productBody(['جوراب‌های پشمی را زنان ایل در شب‌های زمستان قشلاق می‌بافند.', 'پشم طبیعی گرم است، رطوبت را دفع می‌کند و بو نمی‌گیرد. با آب سرد و دست بشویید.'], [['سایز', '۳۸ تا ۴۲'], ['جنس', 'پشم دستریس'], ['شست‌وشو', 'با دست، آب سرد']]) },
];

module.exports = {
	manifest: {
		id: 'nomad',
		order: 5,
		title: 'کوچ',
		desc: 'فروشگاه محصولات ارگانیک عشایری؛ مدرن و مینیمال با نقش‌های گلیم، رنگ‌های گیاهی و روایت محصول.',
		kit: 'nomad',
		thumb: 'thumb.webp',
		required: ['elementor', 'woocommerce'],
		recommended: [],
		tags: ['فروشگاه', 'ارگانیک', 'صنایع دستی'],
		pages: ['خانه', 'خانه — مدل دوم', 'درباره‌ی کوچ', 'تماس', 'دفتر کوچ', 'فروشگاه'],
	},
	content: {
		site: { tagline: 'محصولات ارگانیک عشایری' },
		images, alts, terms, posts, products,
		pages: [
			{ key: 'home', title: 'خانه', slug: 'home', elementor: homeA, settings: L.pageSettings({ header: 'transparent' }) },
			{ key: 'home-2', title: 'خانه — مدل دوم', slug: 'home-2', elementor: homeB, settings: L.pageSettings({ header: 'transparent' }) },
			{ key: 'about', title: 'درباره‌ی کوچ', slug: 'about', elementor: about, settings: L.pageSettings() },
			{ key: 'contact', title: 'تماس', slug: 'contact', elementor: contact, settings: L.pageSettings() },
			{ key: 'blog', title: 'دفتر کوچ', slug: 'journal', content: '' },
		],
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'کوچ — صفحه‌ی اصلی' },
			{ key: 'tpl-home-2', type: 'page', page: 'home-2', title: 'کوچ — صفحه‌ی اصلی، مدل دوم' },
			{ key: 'tpl-about', type: 'page', page: 'about', title: 'کوچ — درباره‌ی ما' },
			{ key: 'tpl-contact', type: 'page', page: 'contact', title: 'کوچ — تماس' },
			{ key: 'tpl-seasons', type: 'section', page: 'home', index: 5, title: 'کوچ — فصل‌ها (اسکرول افقی)' },
			{ key: 'tpl-crafts', type: 'section', page: 'home', index: 7, title: 'کوچ — معرفی دست‌بافته‌ها' },
			{ key: 'tpl-families', type: 'section', page: 'home-2', index: 3, title: 'کوچ — خانواده‌ها (کارت‌های پشته‌ای)' },
			{ key: 'tpl-box', type: 'section', page: 'home-2', index: 4, title: 'کوچ — جعبه‌ی فصل' },
		],
		menus: [
			{
				name: 'کوچ — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home', children: [{ title: 'خانه — مدل اول', page: 'home' }, { title: 'خانه — مدل دوم', page: 'home-2' }] },
					{ title: 'فروشگاه', url: '{{shop}}', children: [
						{ title: 'خوراکی‌ها', term: 'pcat-food' },
						{ title: 'گیاهان کوهی', term: 'pcat-herb' },
						{ title: 'دست‌بافته‌ها', term: 'pcat-craft' },
					] },
					{ title: 'درباره‌ی کوچ', page: 'about' },
					{ title: 'دفتر کوچ', page: 'blog' },
					{ title: 'تماس', page: 'contact' },
				],
			},
			{
				name: 'کوچ — پابرگ', location: 'footer', items: [
					{ title: 'فروشگاه', url: '{{shop}}' },
					{ title: 'درباره‌ی کوچ', page: 'about' },
					{ title: 'دفتر کوچ', page: 'blog' },
					{ title: 'تماس', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 38,
			header_layout: 'split',
			header_cta_text: 'جعبه‌ی فصل',
			header_cta_url: '{{page:contact}}',
			footer_about: 'کوچ خوراکی‌های طبیعی و دست‌بافته‌های خانواده‌های عشایر قشقایی و بختیاری را بی‌واسطه به شهر می‌آورد.',
			footer_copyright: 'تمام حقوق برای کوچ محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }, { network: 'whatsapp', url: 'https://wa.me/989172206400' }],
			mobile_bar: true,
			mobile_bar_text: 'خرید',
			mobile_bar_url: '{{shop}}',
			mobile_bar_whatsapp: '09172206400',
			shop_columns: 4,
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
