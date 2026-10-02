// Renders static/og.png, the 1200×630 card shown when the site is shared on LinkedIn, X, etc.
// Run after changing the name, role or description:  pnpm og
// Uses Playwright's Chromium; set PW_CHANNEL=chrome (or msedge) to use an installed browser.
import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { renderAscii } from '../src/lib/ascii.ts';
import { site } from '../src/lib/data/site.ts';

const font = (pkg: string, file: string) =>
	readFileSync(`node_modules/@fontsource-variable/${pkg}/files/${file}`).toString('base64');

const escape = (s: string) =>
	s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
	@font-face { font-family: 'Geist Mono'; src: url(data:font/woff2;base64,${font('geist-mono', 'geist-mono-latin-wght-normal.woff2')}); font-weight: 100 900; }
	@font-face { font-family: 'Geist'; src: url(data:font/woff2;base64,${font('geist', 'geist-latin-wght-normal.woff2')}); font-weight: 100 900; }
	* { margin: 0; box-sizing: border-box; }
	body {
		width: 1200px; height: 630px; padding: 64px 72px;
		background: #050404; color: #e4e0e0; font-family: 'Geist Mono', ui-monospace, Menlo, monospace;
		display: flex; flex-direction: column; justify-content: space-between;
		background-image: repeating-linear-gradient(to bottom, transparent 0 2px, rgb(255 255 255 / 0.025) 3px);
		border: 1px solid #1f1c1c;
	}
	.kicker { font-size: 20px; letter-spacing: 0.3em; text-transform: uppercase; color: #9a9494; }
	.kicker b { color: #f2b84b; font-weight: 500; }
	pre {
		font-family: Menlo, 'Geist Mono', monospace; font-size: 25px; line-height: 1.05;
		text-shadow: -2px 0 rgb(255 70 70 / 0.45), 2px 0 rgb(70 200 255 / 0.45);
	}
	.desc { font-family: 'Geist', sans-serif; font-size: 27px; line-height: 1.45; color: #cfcaca; max-width: 940px; }
	.foot { display: flex; justify-content: space-between; font-size: 20px; color: #5f5959; }
	.foot span:first-child { color: #9a9494; }
	.cursor { color: #f2b84b; }
</style></head><body>
	<div class="kicker">${escape(site.role)} <b>·</b> fintech</div>
	<pre>${escape(renderAscii(site.asciiName) ?? site.name)}</pre>
	<p class="desc">${escape(site.description)}</p>
	<div class="foot"><span>${escape(site.name)}<span class="cursor">▍</span></span><span>${escape(new URL(site.url).host)}</span></div>
</body></html>`;

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'static/og.png' });
await browser.close();
console.log('wrote static/og.png');
