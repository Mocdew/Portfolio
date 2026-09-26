import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';

// Every page is static content, so build it all to HTML at deploy time.
export const prerender = true;

injectAnalytics({ mode: dev ? 'development' : 'production' });
