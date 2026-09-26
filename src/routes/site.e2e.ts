import { expect, test } from '@playwright/test';
import { projects } from '../lib/data/projects';

test('home page shows the name, every project and no console errors', async ({ page }) => {
	const errors: string[] = [];
	page.on('console', (msg) => {
		// Vercel serves the analytics script only in deployments, so it 404s in local preview.
		if (msg.type() === 'error' && !msg.location().url.includes('/_vercel/insights/')) {
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
