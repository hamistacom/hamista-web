/**
 * Shared pieces for the one-page service demos (flights, currency payments,
 * social growth): sections that the menu scrolls to, and the blocks every one
 * of them has — how it works, prices, reviews, questions and contact.
 */
'use strict';

const L = require('./lib');
const { img, link, w, section, cols, heading } = L;

/** Give a section an anchor the menu can scroll to. */
const anchor = (id, el) => { el.settings._element_id = id; return el; };

/** Menu of anchors for a one-page site. */
const menu = (name, items) => ({ name, location: 'primary', items: items.map(([title, id]) => ({ title, url: '#' + id })) });

const steps = (eyebrow, title, items) => anchor('how', section({ space: 'lg', gap: 40 }, [
	heading({ eyebrow, title, header_align: 'center', title_size: 'lg' }),
	L.steps(items.map(([icon, t, text]) => ({ marker: '', icon, title: t, text })), { layout: 'h', cards: 'yes' }),
]));

const reviews = (eyebrow, title, items) => anchor('reviews', section({ space: 'lg', gap: 40 }, [
	L.textScrub(title, { eyebrow, size: 'md', align: 'center' }),
	w('hm-testimonial-wall', {
		look: 'columns', rating_label: 'امتیاز',
		items: items.map(([quote, name, role], i) => ({ quote, name, role, avatar: img('av-' + ((i % 4) + 1)), rating: '4.9', tone: ['light', 'dark', 'accent', 'light'][i % 4] })),
	}),
]));

const faq = (items) => anchor('faq', section({ space: 'lg', gap: 0 }, [
	cols({ widths: [38, 62], gap: 56, align: 'start' }, [
		[heading({ eyebrow: 'پرسش‌ها', title: 'پاسخ پرسش‌های\n*پرتکرار*', title_size: 'lg', desc: 'اگر پاسخ پرسشتان اینجا نیست، پشتیبانی هر روز از ۸ صبح تا ۱۲ شب پاسخ می‌دهد.' })],
		[L.faq(items, { style: 'cards' })],
	]),
]));

const contact = (eyebrow, title, lines, form) => anchor('contact', section({ space: 'lg', gap: 0 }, [
	cols({ widths: [40, 60], gap: 48, align: 'start' }, [
		[heading({ eyebrow, title, title_size: 'lg' }), L.contactInfo(lines.map(([icon, label, value, href]) => ({ icon, label, value, link: link(href || '') })), { map: '', map_image: '' })],
		[L.contactForm(Object.assign({ show_phone: 'yes', show_company: '', show_subject: 'yes', button: 'ارسال', success: 'پیامتان رسید؛ به‌زودی با شما تماس می‌گیریم.' }, form || {}))],
	]),
]));

module.exports = { anchor, menu, steps, reviews, faq, contact };
