import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { caseStudyHref, projects } from '../lib/data/projects';

test('home page shows the name, every project and no console errors', async ({ page }) => {
	const errors: string[] = [];
	page.on('console', (msg) => {
		// Vercel serves the analytics scripts only in deployments, so they 404 in local preview.
		if (msg.type() === 'error' && !msg.location().url.includes('/_vercel/')) {
			errors.push(msg.text());
		}
	});

	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toContainText('Olumide Erinfolami');
	await expect(page.locator('#projects article')).toHaveCount(projects.length);
	expect(errors).toEqual([]);
});

test('résumé link serves the PDF', async ({ page, request }) => {
	await page.goto('/');
	const href = await page.getByRole('link', { name: 'Résumé' }).getAttribute('href');
	const res = await request.get(href!);
	expect(res.status()).toBe(200);
	expect(res.headers()['content-type']).toContain('application/pdf');
});

test('why-hire-me page links back to projects', async ({ page }) => {
	await page.goto('/why-hire-me');
	await expect(page.getByRole('heading', { level: 1, name: 'Why hire me' })).toBeVisible();
	await page.getByRole('link', { name: 'See the project →' }).first().click();
	await expect(page).toHaveURL(/\/#can-i-borrow$/);
});

test('page does not scroll sideways on a phone', async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto('/');
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth
	);
	expect(overflow).toBeLessThanOrEqual(0);
});

test('unknown routes show the 404 page', async ({ page }) => {
	const res = await page.goto('/does-not-exist');
	expect(res?.status()).toBe(404);
	await expect(page.getByText('no such file or directory')).toBeVisible();
});

test('category filter narrows the project list and All restores it', async ({ page }) => {
	await page.goto('/');
	const forecasting = projects.filter((p) => p.category === 'Forecasting').length;
	await page.getByRole('button', { name: /^Forecasting/ }).click();
	await expect(page.locator('#projects article')).toHaveCount(forecasting);
	await page.getByRole('button', { name: /^All/ }).click();
	await expect(page.locator('#projects article')).toHaveCount(projects.length);
});

test('social preview image is declared and served', async ({ page, request }) => {
	await page.goto('/');
	const og = await page.locator('meta[property="og:image"]').getAttribute('content');
	const res = await request.get(new URL(og!).pathname);
	expect(res.status()).toBe(200);
	expect(res.headers()['content-type']).toContain('image/png');
});

const pages = ['/', '/why-hire-me', ...projects.filter((p) => p.caseStudy).map(caseStudyHref)];

for (const theme of ['light', 'dark'] as const) {
	for (const path of pages) {
		test(`${path} has no axe accessibility violations (${theme})`, async ({ page }) => {
			// Light is the default; a saved choice is how a visitor gets dark.
			if (theme === 'dark') await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
			await page.goto(path);
			const { violations } = await new AxeBuilder({ page }).analyze();
			expect(violations.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([]);
		});
	}
}

test('command palette opens with the keyboard, searches and navigates', async ({ page }) => {
	await page.goto('/');
	const search = page.getByRole('combobox', { name: /search/i });
	// The shortcut listener attaches on hydration, so retry until the palette is open.
	await expect(async () => {
		if (!(await page.locator('dialog[open]').count())) await page.keyboard.press('ControlOrMeta+k');
		await expect(search).toBeFocused({ timeout: 1000 });
	}).toPass();
	const { violations } = await new AxeBuilder({ page }).include('dialog').analyze();
	expect(violations.map((v) => v.id)).toEqual([]);
	await search.fill('why hire');
	await page.keyboard.press('Enter');
	await expect(page).toHaveURL(/\/why-hire-me$/);
});

test('case study cards link to their write-ups', async ({ page }) => {
	await page.goto('/');
	await page
		.locator('#recoup')
		.getByRole('link', { name: /case study/i })
		.click();
	await expect(page.getByRole('heading', { level: 1, name: 'Recoup' })).toBeVisible();
});

test('light is the default, whatever the system prefers', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto('/');
	await expect(page.locator('html')).not.toHaveAttribute('data-theme');
	await expect(page.getByRole('button', { name: 'Light theme' })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
});

test('a picked theme survives a reload', async ({ page }) => {
	const html = page.locator('html');
	await page.goto('/');
	await page.getByRole('button', { name: 'Dark theme' }).click();
	await expect(html).toHaveAttribute('data-theme', 'dark');
	await page.reload();
	await expect(html).toHaveAttribute('data-theme', 'dark');
	await expect(page.getByRole('button', { name: 'Dark theme' })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await page.getByRole('button', { name: 'Light theme' }).click();
	await expect(html).not.toHaveAttribute('data-theme');
	await page.reload();
	await expect(html).not.toHaveAttribute('data-theme');
});

test('system theme follows the operating system', async ({ page }) => {
	const html = page.locator('html');
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto('/');
	await page.getByRole('button', { name: 'Match system theme' }).click();
	await expect(html).toHaveAttribute('data-theme', 'dark');
	await page.emulateMedia({ colorScheme: 'light' });
	await expect(html).not.toHaveAttribute('data-theme');
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.reload();
	await expect(html).toHaveAttribute('data-theme', 'dark');
});
