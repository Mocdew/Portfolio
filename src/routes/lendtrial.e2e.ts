import { expect, test } from '@playwright/test';

const path = '/projects/lendtrial';
const demoUrl = 'https://mocdew.github.io/LendTrial/';
const githubUrl = 'https://github.com/Mocdew/LendTrial';

test('old case study links retain their query and demo anchor', async ({ page }) => {
	await page.goto('/projects/limit-rehearsal?source=portfolio#try-it');
	await expect(page).toHaveURL(new RegExp(`${path}\\?source=portfolio#try-it$`));
	await expect(page.getByRole('heading', { name: 'LendTrial', exact: true })).toBeVisible();
	await expect(
		page.locator('#try-it').getByRole('link', { name: 'Open LendTrial' })
	).toHaveAttribute('href', demoUrl);
	await page.goto('/#limit-rehearsal');
	await expect(page.locator('#lendtrial')).toBeInViewport();
});

test('the project card and case study link to the standalone app and repository', async ({
	page
}) => {
	await page.goto('/');
	const card = page.locator('#lendtrial');
	await expect(card.getByRole('link', { name: /live demo/i })).toHaveAttribute('href', demoUrl);
	await expect(card.getByRole('link', { name: /github/i })).toHaveAttribute('href', githubUrl);
	await card.getByRole('link', { name: /case study/i }).click();
	await expect(page).toHaveURL(new RegExp(`${path}$`));
	await expect(page.getByRole('link', { name: /live demo/i })).toHaveAttribute('href', demoUrl);
	await expect(page.getByRole('link', { name: /github/i })).toHaveAttribute('href', githubUrl);
	await page.goto('/projects/can-i-borrow');
	await expect(page.getByRole('link', { name: 'Try LendTrial' })).toHaveAttribute('href', demoUrl);
});
