import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: { command: 'npm run build && npm run preview', port: 4173 },
	testMatch: '**/*.e2e.{ts,js}',
	// Set PW_CHANNEL=msedge (or chrome) to test against an installed browser
	// instead of downloading Playwright's bundled Chromium.
	use: { baseURL: 'http://localhost:4173', channel: process.env.PW_CHANNEL }
});
