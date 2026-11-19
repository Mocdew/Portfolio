<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/data/site';

	let {
		title,
		description = site.description,
		type = 'website',
		published,
		image
	}: {
		title?: string;
		description?: string;
		type?: 'website' | 'article';
		/** YYYY-MM-DD, for articles. */
		published?: string;
		/** A 1200×630 PNG or JPG under /static. Defaults to the site-wide card. */
		image?: { src: string; alt: string };
	} = $props();

	const fullTitle = $derived(title ? `${title} | ${site.name}` : `${site.name} | ${site.role}`);
	const canonical = $derived(new URL(page.url.pathname, site.url).href);
	// The default card: regenerate with `pnpm og` (scripts/og-image.ts) when the name or
	// description changes.
	const card = $derived({
		src: new URL(image?.src ?? '/og.png', site.url).href,
		alt: image?.alt ?? `${site.name}, ${site.role}`
	});
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta name="author" content={site.name} />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content={type} />
	{#if type === 'article' && published}
		<meta property="article:published_time" content={published} />
		<meta property="article:author" content={site.name} />
	{/if}
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={card.src} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={card.alt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={card.src} />
	<meta name="twitter:image:alt" content={card.alt} />
</svelte:head>
