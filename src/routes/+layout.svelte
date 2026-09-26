<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { site } from '$lib/data/site';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#050404" />
</svelte:head>

<a
	href="#main"
	class="sr-only z-50 rounded bg-fg px-3 py-2 text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
>
	Skip to content
</a>

<div class="mx-auto flex min-h-screen max-w-3xl flex-col md:border-x md:border-hairline">
	<main id="main" class="flex-1 px-4 sm:px-8">
		{@render children()}
	</main>

	<footer
		class="flex flex-wrap justify-between gap-2 border-t border-hairline px-4 py-6 text-xs text-dim sm:px-8"
	>
		<span>© {new Date().getFullYear()} {site.name}</span>
		<span>Built with SvelteKit · hosted on Vercel</span>
	</footer>
</div>
