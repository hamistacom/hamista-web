/**
 * Demo: Shahdineh — a natural honey shop (Honey kit).
 */
'use strict';

const L = require('../lib');
const { img, link, px, section, cols, heading, button } = L;

const images = { hero: 'images/hero.webp', comb: 'images/comb.webp', apiary: 'images/apiary.webp' };
for (let i = 1; i <= 6; i++) { images['product-' + i] = 'images/product-' + i + '.webp'; images['product-' + i + '-b'] = 'images/product-' + i + '-b.webp'; images['journal-' + i] = 'images/journal-' + i + '.webp'; }
for (let i = 1; i <= 3; i++) { images['process-' + i] = 'images/process-' + i + '.webp'; }

images.logo = 'images/logo.webp';
images['logo-dark'] = 'images/logo-dark.webp';

const alts = {
	hero: 'سه شیشه عسل طبیعی کنار قاب موم و قاشق عسل',
	comb: 'نمای نزدیک قاب موم پر از عسل',
	apiary: 'کندوهای چوبی در دامنه‌ی کوهستان هنگام غروب',
	'product-1': 'عسل گون شهدینه', 'product-2': 'عسل آویشن شهدینه', 'product-3': 'عسل کُنار شهدینه',
	'product-4': 'عسل چهل‌گیاه شهدینه', 'product-5': 'عسل موم‌دار شهدینه', 'product-6': 'گرده‌ی گل شهدینه',
};

const QUOTES = [
	{ quote: 'عسل گونشان را برای پدرم گرفتم که سال‌ها زنبوردار بود. اولین قاشق را که خورد گفت «این را از کندو آورده‌اند، نه از کارخانه».', name: 'فرناز موسوی', role: 'مشتری از اصفهان' },
	{ quote: 'برگه‌ی آزمایش همراه هر شیشه برای من کافی بود. دیگر لازم نیست به حرف فروشنده اعتماد کنم.', name: 'دکتر سینا رحمانی', role: 'مشتری از تهران' },
	{ quote: 'بسته‌بندی آن‌قدر محکم بود که حتی در پست به شیراز هم یک قطره بیرون نزد. عسل آویشنش هم فوق‌العاده است.', name: 'مهسا کریمی', role: 'مشتری از شیراز' },
];

const FAQ = [
	['از کجا بفهمم عسل طبیعی است؟', 'مطمئن‌ترین راه، آزمایش است؛ برای همین برگه‌ی آزمایش هر برداشت روی صفحه‌ی همان محصول و داخل جعبه است. ساکارز، رطوبت و HMF در این برگه آمده‌اند و می‌توانید با استاندارد ملی مقایسه کنید.'],
	['چرا عسلم شکرک زده؟ یعنی تقلبی است؟', 'نه. شکرک زدن ویژگی طبیعی بیشتر عسل‌هاست، به‌خصوص در هوای سرد. شیشه را در ظرف آب ولرم (کمتر از ۴۰ درجه) بگذارید تا دوباره روان شود؛ هرگز مستقیم روی حرارت نگذارید.'],
	['عسل را چطور نگه دارم؟', 'در ظرف دربسته، دور از نور مستقیم و در دمای اتاق. یخچال لازم نیست و شکرک زدن را سریع‌تر می‌کند.'],
	['ارسال چقدر طول می‌کشد؟', 'سفارش‌های تهران تا ۲۴ ساعت و شهرهای دیگر بین دو تا چهار روز کاری می‌رسند. همه‌ی شیشه‌ها در جعبه‌ی ضدضربه ارسال می‌شوند.'],
	['اگر راضی نبودم چه؟', 'تا هفت روز پس از دریافت، حتی اگر در شیشه را باز کرده باشید، مبلغ کامل را برمی‌گردانیم.'],
];

/* ---------------- Home A ---------------- */

const homeA = [
	L.hero({
		layout: 'split',
		eyebrow: 'برداشت تازه‌ی تابستان رسید',
		title: 'عسل کوهستان،\nهمان‌طور که\n*زنبور ساخته*.',
		desc: 'شهدینه عسل طبیعی را مستقیم از دوازده زنبوردار در دامنه‌های سبلان، زاگرس و البرز می‌آورد؛ بدون شکر، بدون حرارت، با برگه‌ی آزمایش برای هر برداشت.',
		btn1_text: 'خرید عسل', btn1_link: link('{{shop}}'),
		btn2_text: 'برگه‌های آزمایش', btn2_link: link('{{page:about}}'),
		stats: [
			{ value: '۱۲', label: 'زنبوردار همکار' },
			{ value: '۰٪', label: 'شکر افزوده' },
			{ value: '۲۴', suffix: ' ساعت', label: 'ارسال در تهران' },
		],
		media_type: 'image',
		image: img('hero'),
		media_ratio: 'square',
		height: 'screen',
		decor: '',
		hint: 'اسکرول کنید',
	}),
	L.marquee(['عسل گون', 'عسل آویشن', 'عسل کُنار', 'عسل چهل‌گیاه', 'عسل موم‌دار', 'گرده‌ی گل'], { look: 'alternate', size: 'lg', separator: 'dot', speed: px(50) }),
	section({ space: 'md' }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'پرفروش‌ترین‌ها', title: 'عسل‌های *این فصل*' })],
			[button('همه‌ی محصولات', '{{shop}}', 'secondary')],
		]),
		L.products({ source: 'featured', count: 4, columns: '4' }),
	]),
	section({ space: 'md', width: 1100, cls: 'hm-honeycomb' }, [
		L.textScrub('عسل خوب را نمی‌شود *ساخت*؛ فقط می‌شود *پیدا کرد* و دست‌نخورده به خانه‌ی شما رساند. کار ما همین است: پیدا کردن زنبوردارهای درست، و دست نزدن به آنچه زنبور ساخته.', { eyebrow: 'حرف ما', size: 'lg' }),
	]),
	section({ space: 'md' }, [
		heading({ eyebrow: 'از کندو تا خانه', title: 'سه قدم، *بدون میان‌بُر*', header_align: 'center' }),
		L.stack([
			{ eyebrow: 'قدم اول', title: 'کندوهای کوهستان', text: 'زنبوردارهای همکار ما کندوها را در ارتفاع بالای ۲۰۰۰ متر و دور از مزارع سم‌پاشی‌شده نگه می‌دارند. زنبورها در طول فصل از گل‌های وحشی تغذیه می‌کنند، نه از شربت شکر.', points: 'ارتفاع بالای ۲۰۰۰ متر\nبدون تغذیه‌ی شکر در فصل برداشت\nبازدید سالانه از هر زنبورستان', image: img('process-1'), btn_text: 'زنبوردارهای ما', btn_link: link('{{page:about}}'), tone: '' },
			{ eyebrow: 'قدم دوم', title: 'برداشت در زمان درست', text: 'قاب‌ها فقط وقتی برداشت می‌شوند که زنبورها روی سلول‌ها را با موم پوشانده‌اند؛ یعنی عسل رسیده و رطوبتش پایین است.', points: 'برداشت از قاب‌های سرپوشیده\nاستخراج سرد، بدون حرارت\nصاف کردن با توری، بدون فیلتر صنعتی', image: img('process-2'), btn_text: 'درباره‌ی برداشت', btn_link: link('{{post:harvest-time}}'), tone: 'inverse' },
			{ eyebrow: 'قدم سوم', title: 'آزمایش و شیشه', text: 'از هر برداشت نمونه به آزمایشگاه معتمد می‌رود. فقط عسلی که از استاندارد ملی بهتر باشد شیشه می‌شود.', points: 'آزمایش ساکارز، رطوبت و HMF\nشیشه‌ی شیشه‌ای، نه پلاستیک\nبرگه‌ی آزمایش داخل هر جعبه', image: img('process-3'), btn_text: 'خرید عسل', btn_link: link('{{shop}}'), tone: 'accent' },
		]),
	]),
	L.scrollZoom({
		eyebrow: 'نگاه نزدیک',
		title: 'هر شش‌ضلعی،\n*یک قطره صبر*',
		image: img('comb'),
		o_title: 'برای یک کیلو عسل،\nزنبورها *میلیون‌ها گل* را می‌گردند.',
		o_desc: 'برای همین است که عسل واقعی ارزان نیست و نباید باشد.',
		btn1_text: 'عسل موم‌دار', btn1_link: link('{{product:comb-honey}}'), btn1_style: 'inverse',
	}),
	section({ space: 'md' }, [
		L.features([
			{ icon: 'flask', title: 'آزمایش هر برداشت', text: 'برگه‌ی آزمایش ساکارز، رطوبت و HMF برای هر برداشت، روی سایت و داخل جعبه.' },
			{ icon: 'mountain', title: 'مستقیم از زنبوردار', text: 'بدون واسطه می‌خریم و منصفانه می‌پردازیم؛ نام زنبوردار روی برچسب هر شیشه است.' },
			{ icon: 'sun', title: 'بدون حرارت', text: 'عسل هیچ‌وقت حرارت نمی‌بیند تا آنزیم‌ها و عطرش دست‌نخورده بماند.' },
			{ icon: 'heart', title: 'ضمانت بازگشت', text: 'تا هفت روز، حتی با در باز، اگر راضی نبودید پول را پس می‌دهیم.' },
		], { layout: 'grid', style: 'cards', columns: '4', icon_style: 'soft' }),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [50, 50], gap: 64, align: 'center' }, [
			[L.imageReveal('apiary', { ratio: '4-3', reveal: 'clip-up', parallax: px(0.3) })],
			[
				heading({ eyebrow: 'زنبوردارها', title: 'دوازده خانواده،\n*سه رشته‌کوه*', desc: 'با هر خرید، بیشتر مبلغ مستقیم به دست زنبوردار می‌رسد. نام هر زنبوردار و محل زنبورستانش روی برچسب شیشه نوشته شده است.' }),
				button('آشنایی با زنبوردارها', '{{page:about}}', 'secondary'),
			],
		]),
	]),
	section({ space: 'md' }, [
		heading({ eyebrow: 'از زبان مشتری‌ها', title: 'طعمی که *یادشان مانده*', header_align: 'center' }),
		L.testimonials(QUOTES, { layout: 'grid', columns: '3' }),
	]),
	section({ space: 'md', top0: true }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'درباره‌ی *عسل واقعی*' }), button('پرسیدن از ما', '{{page:contact}}', 'secondary')],
			[L.faq(FAQ)],
		]),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [60, 40], align: 'flex-end' }, [
			[heading({ eyebrow: 'دفترچه‌ی عسل', title: 'خواندنی‌هایی درباره‌ی *عسل و زنبور*' })],
			[button('همه‌ی نوشته‌ها', '{{blog}}', 'secondary')],
		]),
		L.posts({ count: 3, layout: 'grid', columns: '3' }),
	]),
	L.cta({
		eyebrow: 'اولین خرید',
		title: 'یک شیشه بچشید،\n*بقیه‌اش با شما*.',
		desc: 'با کد «اولین‌شهد» روی اولین سفارشتان ۱۰ درصد تخفیف بگیرید.',
		btn1_text: 'خرید عسل', btn1_link: link('{{shop}}'),
		btn2_text: 'راهنمای انتخاب عسل', btn2_link: link('{{post:which-honey}}'),
		look: 'inverse',
		decor: '',
		note: 'ارسال رایگان برای سفارش‌های بالای دو میلیون تومان',
	}),
];
homeA[homeA.length - 1].settings.css_classes += ' hm-drip-top';

/* ---------------- Home B ---------------- */

const homeB = [
	L.hero({
		layout: 'full',
		eyebrow: 'شهدینه · عسل طبیعی کوهستان',
		title: 'شیرین،\n*بی‌واسطه*.',
		desc: 'از کندوهای دامنه‌ی سبلان و زاگرس، مستقیم به سفره‌ی شما.',
		btn1_text: 'خرید عسل', btn1_link: link('{{shop}}'),
		btn2_text: 'داستان ما', btn2_link: link('{{page:about}}'),
		media_type: 'image',
		image: img('comb'),
		height: 'screen',
		scheme: 'inverse',
		decor: '',
		hint: 'اسکرول کنید',
	}),
	section({ space: 'md' }, [
		heading({ eyebrow: 'کدام عسل برای شما؟', title: 'هر گل، *طعمی دیگر*', header_align: 'center' }),
		L.tabs([
			{ title: 'عسل گون', subtitle: 'روشن و لطیف', meta: '۰۱', image: img('product-1'), panel_title: 'سفید طلایی، با شیرینی ملایم', panel_text: 'عسل گون از شهد گیاه گون در ارتفاعات زاگرس است؛ رنگ روشن، عطر ملایم و شیرینی کم. برای کسانی که عسل را بی‌واسطه با قاشق می‌خورند.', chips: 'ملایم، روشن، شکرک دیر', btn_text: 'خرید عسل گون', btn_link: link('{{product:gavan-honey}}') },
			{ title: 'عسل آویشن', subtitle: 'معطر و گرم', meta: '۰۲', image: img('product-2'), panel_title: 'عطر کوهستان در یک قاشق', panel_text: 'عسل آویشن طعمی گرم و عطری تند دارد؛ همراه چای، برای صبحانه‌های زمستانی یا با پنیر محلی.', chips: 'معطر، کهربایی، برای چای', btn_text: 'خرید عسل آویشن', btn_link: link('{{product:thyme-honey}}') },
			{ title: 'عسل کُنار', subtitle: 'تیره و پرطعم', meta: '۰۳', image: img('product-3'), panel_title: 'عسل جنوب، با طعمی عمیق', panel_text: 'از درختان کنار جنوب ایران؛ رنگی تیره، طعمی کاراملی و قوام بالا. محبوب برای مصرف خوراکی همراه دمنوش.', chips: 'تیره، کاراملی، پرقوام', btn_text: 'خرید عسل کنار', btn_link: link('{{product:sidr-honey}}') },
			{ title: 'عسل چهل‌گیاه', subtitle: 'متعادل و همه‌کاره', meta: '۰۴', image: img('product-4'), panel_title: 'برای هر روز و هر سفره', panel_text: 'از گل‌های وحشی مختلف یک دامنه؛ طعمی متعادل که با همه‌چیز جور است، از صبحانه تا شیرینی‌پزی.', chips: 'متعادل، طلایی، اقتصادی', btn_text: 'خرید عسل چهل‌گیاه', btn_link: link('{{product:wildflower-honey}}') },
		], { autoplay: 7, media_side: 'start' }),
	]),
	section({ space: 'sm', scheme: 'surface' }, [
		L.counters([
			{ value: 2400, label: 'متر ارتفاع زنبورستان‌ها' },
			{ value: 12, label: 'خانواده‌ی زنبوردار' },
			{ value: 18, suffix: '٪', label: 'رطوبت کمتر از', desc: 'استاندارد ملی: ۲۰٪' },
			{ value: 7, label: 'روز ضمانت بازگشت' },
		], { style: 'cards', columns: '4' }),
	]),
	L.hscroll({
		eyebrow: 'همه‌ی محصولات',
		title: 'قفسه‌ی *شهدینه*',
		desc: 'به اسکرول ادامه دهید.',
		items: [
			{ image: img('product-1'), label: 'عسل', title: 'عسل گون', text: 'روشن، لطیف و کم‌شیرین.', link: link('{{product:gavan-honey}}') },
			{ image: img('product-2'), label: 'عسل', title: 'عسل آویشن', text: 'معطر و گرم، برای چای.', link: link('{{product:thyme-honey}}') },
			{ image: img('product-3'), label: 'عسل', title: 'عسل کُنار', text: 'تیره و کاراملی.', link: link('{{product:sidr-honey}}') },
			{ image: img('product-4'), label: 'عسل', title: 'عسل چهل‌گیاه', text: 'متعادل و همه‌کاره.', link: link('{{product:wildflower-honey}}') },
			{ image: img('product-5'), label: 'موم‌دار', title: 'عسل موم‌دار', text: 'قاب کامل موم و عسل.', link: link('{{product:comb-honey}}') },
			{ image: img('product-6'), label: 'فرآورده', title: 'گرده‌ی گل', text: 'دانه‌های رنگی گرده.', link: link('{{product:bee-pollen}}') },
		],
		card_size: 'md',
		card_style: 'caption',
		btn1_text: 'ورود به فروشگاه', btn1_link: link('{{shop}}'),
	}),
	section({ space: 'md' }, [
		heading({ eyebrow: 'اشتراک عسل', title: 'هر ماه، *یک برداشت تازه*', header_align: 'center', desc: 'هر ماه عسل تازه‌ترین برداشت را دریافت کنید. هر وقت خواستید متوقفش کنید.' }),
		L.pricing([
			{ name: 'یک شیشه', desc: 'نیم کیلو در ماه', price: '۸۹۰٬۰۰۰', price_alt: '۸۰۰٬۰۰۰', unit: 'تومان', period: 'ماهانه', features: 'یک شیشه‌ی ۵۰۰ گرمی\nانتخاب نوع عسل با شما\nارسال رایگان', btn_text: 'شروع اشتراک', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
			{ name: 'خانواده', desc: 'دو کیلو در ماه', price: '۲٬۹۵۰٬۰۰۰', price_alt: '۲٬۶۵۰٬۰۰۰', unit: 'تومان', period: 'ماهانه', features: 'چهار شیشه‌ی ۵۰۰ گرمی\nترکیب دلخواه چهار نوع\nارسال رایگان و اولویت‌دار\nیک قاشق چوبی هدیه', btn_text: 'شروع اشتراک', btn_link: link('{{page:contact}}'), featured: 'yes', badge: 'محبوب‌ترین' },
			{ name: 'کافه و رستوران', desc: 'از پنج کیلو به بالا', price: 'توافقی', price_alt: 'توافقی', unit: '', period: '', features: 'بسته‌بندی عمده\nفاکتور رسمی\nارسال هفتگی', btn_text: 'تماس برای همکاری', btn_link: link('{{page:contact}}'), featured: '', badge: '' },
		], { switch_off: 'پرداخت ماهانه', switch_on: 'پرداخت سه‌ماهه', switch_note: '۱۰٪ تخفیف' }),
	]),
	section({ space: 'md', scheme: 'surface' }, [
		heading({ eyebrow: 'زنبوردارهای ما', title: 'دست‌هایی که *پشت هر شیشه* است' }),
		L.team([
			{ photo: {}, name: 'کاکا رحیم', role: 'زنبوردار، دامنه‌ی سبلان' },
			{ photo: {}, name: 'خاله فاطمه', role: 'زنبوردار، کوه‌های زاگرس' },
			{ photo: {}, name: 'آقا موسی', role: 'زنبوردار، دامنه‌ی البرز' },
			{ photo: {}, name: 'گلاره', role: 'مسئول آزمایش و کیفیت' },
		], { columns: '4' }),
	]),
	L.testimonials(QUOTES, { layout: 'marquee' }),
	L.cta({
		eyebrow: 'خبرنامه‌ی شهدینه',
		title: 'وقتی برداشت تازه رسید،\n*اول به شما* می‌گوییم.',
		desc: 'فصلی یک ایمیل؛ با خبر برداشت‌های تازه و کد تخفیف ویژه‌ی مشترک‌ها.',
		action: 'email',
		email_placeholder: 'ایمیل شما',
		email_button: 'خبرم کنید',
		note: '',
		look: 'surface',
		decor: '',
	}),
];

/* ---------------- About ---------------- */

const about = [
	section({ space: 'md', bottom0: true, cls: 'hm-honeycomb' }, [
		cols({ widths: [55, 45], align: 'flex-end' }, [
			[heading({ eyebrow: 'داستان شهدینه', title: 'از کندوهای\n*پدربزرگ*', title_tag: 'h1', title_size: 'xl' })],
			[L.textEditor('<p>پدربزرگ من چهل سال در دامنه‌ی سبلان زنبورداری کرد. هر تابستان چند شیشه عسل برای ما به تهران می‌فرستاد و هر بار که از عسل مغازه‌ها حرف می‌زدیم، فقط می‌خندید. شهدینه از همان خنده شروع شد.</p><p>— نگار صدری، بنیان‌گذار</p>')],
		]),
	]),
	section({ space: 'md' }, [L.imageReveal('apiary', { ratio: '21-9', reveal: 'clip-up', parallax: px(0.3) })]),
	section({ space: 'md', width: 1100 }, [
		L.textScrub('امروز با *دوازده خانواده‌ی زنبوردار* کار می‌کنیم. بیشتر مبلغ هر شیشه مستقیم به دست خودشان می‌رسد و نامشان روی برچسب است؛ چون عسل خوب، *اسم و نشانی* دارد.', { eyebrow: 'امروز', size: 'md' }),
	]),
	anchor('lab', section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [45, 55], gap: 64, align: 'center' }, [
			[heading({ eyebrow: 'آزمایش هر برداشت', title: 'عددها *دروغ نمی‌گویند*', desc: 'از هر برداشت نمونه‌ای به آزمایشگاه معتمد می‌فرستیم. این‌ها میانگین نتایج برداشت تابستان امسال‌اند، کنار حد مجاز استاندارد ملی.' })],
			[L.counters([
				{ value: 1.8, suffix: '٪', label: 'ساکارز', desc: 'حد مجاز: ۵٪' },
				{ value: 16.4, suffix: '٪', label: 'رطوبت', desc: 'حد مجاز: ۲۰٪' },
				{ value: 6, label: 'HMF', desc: 'میلی‌گرم در کیلو · حد مجاز: ۴۰' },
				{ value: 0, label: 'شکر افزوده', desc: 'در هیچ برداشتی' },
			], { style: 'cards', columns: '2' })],
		]),
	])),
	section({ space: 'md' }, [
		heading({ eyebrow: 'تیم و زنبوردارها', title: 'آدم‌های *شهدینه*' }),
		L.team([
			{ photo: {}, name: 'نگار صدری', role: 'بنیان‌گذار' },
			{ photo: {}, name: 'گلاره امینی', role: 'مسئول آزمایش و کیفیت' },
			{ photo: {}, name: 'کاکا رحیم', role: 'زنبوردار، سبلان' },
			{ photo: {}, name: 'آقا موسی', role: 'زنبوردار، البرز' },
		], { columns: '4' }),
	]),
	L.cta({
		title: 'یک شیشه،\n*یک داستان*.',
		desc: 'روی برچسب هر شیشه، نام زنبوردار و محل زنبورستان نوشته شده است.',
		btn1_text: 'خرید عسل', btn1_link: link('{{shop}}'),
		look: 'accent',
		decor: '',
		note: '',
	}),
];

function anchor(id, el) { el.settings._element_id = id; return el; }

/* ---------------- Contact ---------------- */

const contact = [
	section({ space: 'md', bottom0: true }, [
		heading({ eyebrow: 'تماس با ما', title: 'سؤالی درباره‌ی\n*عسل* دارید؟', title_tag: 'h1', title_size: 'xl', desc: 'برای راهنمای خرید، سفارش عمده یا پیگیری ارسال پیام بدهید. هر روز از ۹ تا ۲۱ جواب می‌دهیم.' }),
	]),
	section({ space: 'md' }, [
		cols({ widths: [40, 60], gap: 56 }, [
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
	section({ space: 'md', scheme: 'surface' }, [
		cols({ widths: [36, 64], gap: 64 }, [
			[heading({ eyebrow: 'پرسش‌ها', title: 'شاید جوابتان *اینجا* باشد' })],
			[L.faq(FAQ)],
		]),
	]),
];

/* ---------------- Blog ---------------- */

const terms = [
	{ key: 'cat-know', taxonomy: 'category', name: 'شناخت عسل', slug: 'honey-guide' },
	{ key: 'cat-bee', taxonomy: 'category', name: 'زنبور و طبیعت', slug: 'bees' },
	{ key: 'cat-kitchen', taxonomy: 'category', name: 'آشپزخانه', slug: 'kitchen' },
	{ key: 'pcat-honey', taxonomy: 'product_cat', name: 'عسل', slug: 'honey' },
	{ key: 'pcat-comb', taxonomy: 'product_cat', name: 'عسل موم‌دار', slug: 'comb-honey' },
	{ key: 'pcat-bee', taxonomy: 'product_cat', name: 'فرآورده‌های زنبور', slug: 'bee-products' },
];

const posts = [
	{
		key: 'real-honey', title: 'عسل طبیعی را چطور تشخیص بدهیم؟', slug: 'how-to-tell-real-honey', image: 'journal-3', terms: ['cat-know'], days_ago: 3,
		excerpt: 'آزمایش‌های خانگی معروف بیشتر افسانه‌اند. آنچه واقعاً کار می‌کند، برگه‌ی آزمایش است.',
		content: L.article([
			'احتمالاً شنیده‌اید که عسل طبیعی در آب حل نمی‌شود، شعله را روشن نگه می‌دارد یا روی دستمال کاغذی پخش نمی‌شود. بیشتر این آزمایش‌ها بیشتر به رطوبت عسل بستگی دارند تا به طبیعی بودنش.',
			['h', 'چه چیزی واقعاً مهم است؟'],
			['ul', ['ساکارز: نشانه‌ی شکر افزوده یا تغذیه‌ی زنبور با شکر؛ در عسل خوب کمتر از ۵ درصد.', 'رطوبت: عسل رسیده کمتر از ۲۰ درصد آب دارد.', 'HMF: نشانه‌ی حرارت دیدن یا کهنگی؛ هر چه کمتر بهتر.']],
			['h', 'شکرک زدن، نشانه‌ی خوبی است'],
			'برخلاف تصور رایج، شکرک زدن نشانه‌ی تقلب نیست. بیشتر عسل‌های طبیعی دیر یا زود شکرک می‌زنند؛ سرعتش به نوع گل و دما بستگی دارد.',
			['q', 'مطمئن‌ترین آزمایش خانگی، خواندن برگه‌ی آزمایش آزمایشگاه است.'],
		]),
	},
	{
		key: 'which-honey', title: 'گون، آویشن، کنار یا چهل‌گیاه؟', slug: 'choosing-your-honey', image: 'journal-2', terms: ['cat-know'], days_ago: 8,
		excerpt: 'راهنمای کوتاه انتخاب عسل بر اساس طعم و مصرف.',
		content: L.article([
			'هر عسل طعم گلی را دارد که زنبور از آن شهد جمع کرده است. انتخاب درست، بیشتر به سلیقه و مصرف شما بستگی دارد تا به «بهترین» بودن.',
			['ul', ['عسل گون: روشن و ملایم؛ برای خوردن با قاشق و کسانی که شیرینی تند دوست ندارند.', 'عسل آویشن: معطر و گرم؛ عالی با چای و پنیر.', 'عسل کنار: تیره و کاراملی؛ پرقوام و پرطعم.', 'عسل چهل‌گیاه: متعادل و همه‌کاره؛ برای مصرف روزانه و آشپزی.']],
			'اگر اولین بار است که عسل طبیعی می‌خرید، بسته‌ی چشیدنی چهار شیشه‌ی کوچک را امتحان کنید.',
		]),
	},
	{
		key: 'harvest-time', title: 'چرا عسل را دیرتر برداشت می‌کنیم', slug: 'why-we-harvest-late', image: 'journal-4', terms: ['cat-bee'], days_ago: 14,
		excerpt: 'صبر برای سرپوشیده شدن سلول‌ها، تفاوت عسل رسیده و نارس است.',
		content: L.article([
			'زنبورها وقتی رطوبت عسل به اندازه‌ی کافی پایین آمد، روی هر سلول را با لایه‌ای نازک از موم می‌پوشانند. این نشانه‌ی رسیدن عسل است.',
			'برداشت زودتر، مقدار بیشتری عسل می‌دهد، اما عسلی که رطوبت بالا دارد زود ترش می‌شود. ما فقط قاب‌هایی را برداشت می‌کنیم که دست‌کم هشتاد درصد سلول‌هایشان سرپوشیده است.',
			['img', 'process-2', 'قاب سرپوشیده‌ی آماده‌ی برداشت'],
		]),
	},
	{
		key: 'storing-honey', title: 'نگهداری عسل: یخچال یا کابینت؟', slug: 'how-to-store-honey', image: 'journal-1', terms: ['cat-know'], days_ago: 20,
		excerpt: 'عسل تقریباً هیچ‌وقت خراب نمی‌شود؛ به شرطی که این سه نکته را رعایت کنید.',
		content: L.article([
			['ol', ['در ظرف را همیشه محکم ببندید؛ عسل رطوبت هوا را جذب می‌کند.', 'دور از نور مستقیم و گرمای اجاق نگه دارید.', 'یخچال لازم نیست و شکرک زدن را سریع‌تر می‌کند.']],
			'اگر عسل شکرک زد، شیشه را در ظرف آب ولرم بگذارید. حرارت مستقیم یا مایکروفر عطر و آنزیم‌های عسل را از بین می‌برد.',
		]),
	},
	{
		key: 'bees-and-flowers', title: 'نقشه‌ی گل‌ها: عسل هر منطقه از کجا می‌آید', slug: 'honey-map-of-iran', image: 'journal-5', terms: ['cat-bee'], days_ago: 27,
		excerpt: 'از گون زاگرس تا کنار جنوب؛ سفری کوتاه روی نقشه‌ی عسل ایران.',
		content: L.article([
			'تنوع اقلیم ایران یعنی تنوع گل‌ها، و تنوع گل‌ها یعنی عسل‌هایی با رنگ و طعم کاملاً متفاوت.',
			['ul', ['دامنه‌های زاگرس: گون و گیاهان کوهستانی', 'دامنه‌ی سبلان و آذربایجان: آویشن و گل‌های وحشی', 'البرز: چهل‌گیاه و گل‌های بهاری', 'جنوب ایران: درختان کنار']],
			'به همین دلیل روی برچسب هر شیشه‌ی شهدینه، منطقه و ارتفاع زنبورستان را می‌نویسیم.',
		]),
	},
	{
		key: 'honey-breakfast', title: 'سه صبحانه با عسل که ارزش زود بیدار شدن دارند', slug: 'honey-breakfast-ideas', image: 'journal-6', terms: ['cat-kitchen'], days_ago: 35,
		excerpt: 'نان سنگک داغ و کره را می‌دانید؛ این سه را هم امتحان کنید.',
		content: L.article([
			['h3', 'ماست یونانی، گردو و عسل آویشن'],
			'یک کاسه ماست پرچرب، مشتی گردوی تازه و یک قاشق عسل آویشن. عطر آویشن با ترشی ماست عالی جور می‌شود.',
			['h3', 'پنیر لیقوان و عسل گون'],
			'ترکیب شور و شیرین قدیمی آذربایجان؛ عسل ملایم گون طعم پنیر را نمی‌پوشاند.',
			['h3', 'نان تست، کره‌ی بادام زمینی و عسل کنار'],
			'عسل تیره و کاراملی کنار، کنار طعم بادام زمینی، صبحانه‌ای سیرکننده برای روزهای شلوغ.',
		]),
	},
];

/* ---------------- Products ---------------- */

const HONEY_SPECS = (region, color, sucrose) => [['منطقه', region], ['رنگ', color], ['ساکارز (آزمایش این برداشت)', sucrose], ['وزن خالص', '۵۰۰ گرم'], ['ظرف', 'شیشه با در فلزی']];

const products = [
	{ key: 'gavan-honey', title: 'عسل گون', slug: 'gavan-honey', price: 1850000, sku: 'SH-GAV-500', image: 'product-1', gallery: ['product-1-b', 'comb'], terms: ['pcat-honey'], featured: true, stock: 40, weight: 0.75,
		excerpt: 'روشن و لطیف، از ارتفاعات زاگرس؛ کم‌شیرین و خوش‌عطر.',
		attributes: [{ name: 'وزن', options: ['۵۰۰ گرم'] }, { name: 'منطقه', options: ['زاگرس'] }],
		content: L.productBody(['عسل گون از شهد گیاه گون در ارتفاعات بالای ۲۴۰۰ متر زاگرس است. رنگش روشن و طعمش ملایم است و دیرتر از بیشتر عسل‌ها شکرک می‌زند.', 'برای خوردن با قاشق، همراه شیر گرم یا روی نان تازه.'], HONEY_SPECS('زاگرس، ۲۴۰۰ متر', 'سفید طلایی', '۱٫۲٪')) },
	{ key: 'thyme-honey', title: 'عسل آویشن', slug: 'thyme-honey', price: 1450000, sale_price: 1290000, sku: 'SH-THY-500', image: 'product-2', gallery: ['product-2-b'], terms: ['pcat-honey'], featured: true, stock: 55, weight: 0.75,
		excerpt: 'معطر و گرم، از دامنه‌های سبلان؛ همراه همیشگی چای.',
		attributes: [{ name: 'وزن', options: ['۵۰۰ گرم'] }, { name: 'منطقه', options: ['سبلان'] }],
		content: L.productBody(['عسل آویشن طعمی گرم و عطری تند دارد که از اولین قاشق شناخته می‌شود.', 'کنار چای، روی پنیر یا در دمنوش‌های زمستانی.'], HONEY_SPECS('دامنه‌ی سبلان', 'کهربایی', '۱٫۹٪')) },
	{ key: 'sidr-honey', title: 'عسل کُنار', slug: 'sidr-honey', price: 1280000, sku: 'SH-SID-500', image: 'product-3', gallery: ['product-3-b'], terms: ['pcat-honey'], featured: true, stock: 30, weight: 0.75,
		excerpt: 'تیره، پرقوام و کاراملی؛ از درختان کنار جنوب ایران.',
		attributes: [{ name: 'وزن', options: ['۵۰۰ گرم'] }, { name: 'منطقه', options: ['جنوب ایران'] }],
		content: L.productBody(['عسل کنار از شهد گل درختان کنار در جنوب ایران است؛ رنگی تیره و طعمی عمیق و کاراملی دارد.', 'برای کسانی که عسل پرطعم دوست دارند.'], HONEY_SPECS('هرمزگان', 'کهربایی تیره', '۲٫۴٪')) },
	{ key: 'wildflower-honey', title: 'عسل چهل‌گیاه', slug: 'wildflower-honey', price: 980000, sku: 'SH-WLD-500', image: 'product-4', gallery: ['product-4-b'], terms: ['pcat-honey'], featured: true, stock: 80, weight: 0.75,
		excerpt: 'طعمی متعادل از گل‌های وحشی البرز؛ برای هر روز.',
		attributes: [{ name: 'وزن', options: ['۵۰۰ گرم'] }, { name: 'منطقه', options: ['البرز'] }],
		content: L.productBody(['عسل چهل‌گیاه از گل‌های وحشی متنوع دامنه‌های البرز است و طعمی متعادل دارد.', 'همه‌کاره: از صبحانه تا شیرینی‌پزی و دمنوش.'], HONEY_SPECS('دامنه‌ی البرز', 'طلایی', '۲٫۱٪')) },
	{ key: 'comb-honey', title: 'عسل موم‌دار (قاب کامل)', slug: 'comb-honey', price: 1650000, sku: 'SH-CMB-700', image: 'product-5', gallery: ['product-5-b', 'comb'], terms: ['pcat-comb'], stock: 15, weight: 1,
		excerpt: 'قاب موم پر از عسل، همان‌طور که از کندو برداشته شده.',
		attributes: [{ name: 'وزن', options: ['حدود ۷۰۰ گرم'] }],
		content: L.productBody(['عسل موم‌دار دست‌نخورده‌ترین شکل عسل است: قاب موم همان‌طور که زنبورها ساخته‌اند، در جعبه‌ی چوبی.', 'موم را می‌توانید همراه عسل بجوید؛ طعمی متفاوت و تجربه‌ای قدیمی.'], [['وزن تقریبی', '۷۰۰ گرم'], ['ظرف', 'جعبه‌ی چوبی با در شفاف'], ['منطقه', 'دامنه‌ی سبلان']]) },
	{ key: 'bee-pollen', title: 'گرده‌ی گل', slug: 'bee-pollen', price: 680000, sku: 'SH-POL-250', image: 'product-6', gallery: ['product-6-b'], terms: ['pcat-bee'], stock: 25, weight: 0.4,
		excerpt: 'دانه‌های رنگی گرده‌ی گل، خشک‌شده در سایه.',
		attributes: [{ name: 'وزن', options: ['۲۵۰ گرم'] }],
		content: L.productBody(['گرده‌ی گل را زنبورها از گل‌های مختلف جمع می‌کنند؛ هر رنگ از یک گل است.', 'روی ماست، در اسموتی یا مستقیم با قاشق. در ظرف دربسته و جای خنک نگه دارید.'], [['وزن خالص', '۲۵۰ گرم'], ['روش خشک کردن', 'در سایه، بدون حرارت'], ['ظرف', 'شیشه با در فلزی']]) },
];

module.exports = {
	manifest: {
		id: 'honey',
		order: 4,
		title: 'شهدینه',
		desc: 'فروشگاه عسل طبیعی؛ رنگ‌های گرم، بافت شش‌ضلعی، داستان محصول و فروش اشتراکی.',
		kit: 'honey',
		thumb: 'thumb.webp',
		required: ['elementor', 'woocommerce'],
		recommended: [],
		tags: ['فروشگاه', 'محصولات طبیعی', 'خوراکی'],
		pages: ['خانه', 'خانه — مدل دوم', 'داستان ما', 'تماس با ما', 'دفترچه‌ی عسل', 'فروشگاه'],
	},
	content: {
		site: { title: 'شهدینه', tagline: 'عسل طبیعی کوهستان' },
		images, alts, terms, posts, products,
		pages: [
			{ key: 'home', title: 'خانه', slug: 'home', elementor: homeA, settings: L.pageSettings({ header: 'transparent' }) },
			{ key: 'home-2', title: 'خانه — مدل دوم', slug: 'home-2', elementor: homeB, settings: L.pageSettings({ header: 'transparent-light' }) },
			{ key: 'about', title: 'داستان ما', slug: 'about', elementor: about, settings: L.pageSettings() },
			{ key: 'contact', title: 'تماس با ما', slug: 'contact', elementor: contact, settings: L.pageSettings() },
			{ key: 'blog', title: 'دفترچه‌ی عسل', slug: 'journal', content: '' },
		],
		templates: [
			{ key: 'tpl-home', type: 'page', page: 'home', title: 'شهدینه — صفحه‌ی اصلی' },
			{ key: 'tpl-home-2', type: 'page', page: 'home-2', title: 'شهدینه — صفحه‌ی اصلی، مدل دوم' },
			{ key: 'tpl-about', type: 'page', page: 'about', title: 'شهدینه — داستان ما' },
			{ key: 'tpl-contact', type: 'page', page: 'contact', title: 'شهدینه — تماس با ما' },
			{ key: 'tpl-stack', type: 'section', page: 'home', index: 4, title: 'شهدینه — از کندو تا خانه (کارت‌های پشته‌ای)' },
			{ key: 'tpl-zoom', type: 'section', page: 'home', index: 5, title: 'شهدینه — زوم با اسکرول روی موم' },
			{ key: 'tpl-tabs', type: 'section', page: 'home-2', index: 1, title: 'شهدینه — انتخاب عسل با زبانه' },
			{ key: 'tpl-hscroll', type: 'section', page: 'home-2', index: 3, title: 'شهدینه — قفسه‌ی محصولات (اسکرول افقی)' },
			{ key: 'tpl-sub', type: 'section', page: 'home-2', index: 4, title: 'شهدینه — اشتراک ماهانه' },
		],
		menus: [
			{
				name: 'شهدینه — منوی اصلی', location: 'primary', items: [
					{ title: 'خانه', page: 'home', children: [{ title: 'خانه — مدل اول', page: 'home' }, { title: 'خانه — مدل دوم', page: 'home-2' }] },
					{ title: 'فروشگاه', url: '{{shop}}', children: [
						{ title: 'عسل', term: 'pcat-honey' },
						{ title: 'عسل موم‌دار', term: 'pcat-comb' },
						{ title: 'فرآورده‌های زنبور', term: 'pcat-bee' },
					] },
					{ title: 'داستان ما', page: 'about' },
					{ title: 'دفترچه‌ی عسل', page: 'blog' },
					{ title: 'تماس', page: 'contact' },
				],
			},
			{
				name: 'شهدینه — پابرگ', location: 'footer', items: [
					{ title: 'فروشگاه', url: '{{shop}}' },
					{ title: 'داستان ما', page: 'about' },
					{ title: 'دفترچه‌ی عسل', page: 'blog' },
					{ title: 'تماس', page: 'contact' },
				],
			},
		],
		options: {
			logo: '{{imgid:logo}}',
			logo_dark: '{{imgid:logo-dark}}',
			logo_height: 38,
			header_layout: 'centered',
			header_cta_text: '',
			footer_about: 'شهدینه عسل طبیعی کوهستان را مستقیم از دوازده خانواده‌ی زنبوردار به خانه‌ی شما می‌رساند؛ با برگه‌ی آزمایش برای هر برداشت.',
			footer_copyright: 'تمام حقوق برای شهدینه محفوظ است.',
			footer_social: [{ network: 'instagram', url: 'https://instagram.com/' }, { network: 'telegram', url: 'https://t.me/' }, { network: 'whatsapp', url: 'https://wa.me/989123305580' }],
			mobile_bar: true,
			mobile_bar_text: 'خرید عسل',
			mobile_bar_url: '{{shop}}',
			mobile_bar_whatsapp: '09123305580',
			shop_columns: 4,
		},
		woocommerce: { currency: 'IRT', decimals: 0, thousand_sep: '٬', currency_pos: 'right_space', pages: { shop: 'فروشگاه', cart: 'سبد خرید', checkout: 'تسویه حساب', myaccount: 'حساب کاربری' } },
		front_page: 'home',
		posts_page: 'blog',
	},
};
