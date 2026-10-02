<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/data/site';

	let { title, description = site.description }: { title?: string; description?: string } =
		$props();

	const fullTitle = $derived(title ? `${title} — ${site.name}` : `${site.name} — ${site.role}`);
	const canonical = $derived(new URL(page.url.pathname, site.url).href);
	// Regenerate with `pnpm og` (scripts/og-image.ts) when the name or description changes.
	const image = new URL('/og.png', site.url).href;
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta name="author" content={site.name} />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="{site.name} — {site.role}" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
</svelte:head>
