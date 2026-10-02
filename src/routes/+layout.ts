import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';
import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

// Every page is static content, so build it all to HTML at deploy time.
export const prerender = true;

injectAnalytics({ mode: dev ? 'development' : 'production' });
// Real-user Core Web Vitals, reported in the Vercel dashboard's Speed Insights tab.
injectSpeedInsights();
