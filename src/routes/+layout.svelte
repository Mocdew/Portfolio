<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { site } from '$lib/data/site';
	import { palette } from '$lib/ui.svelte';

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

<div class="relative mx-auto flex min-h-screen max-w-3xl flex-col md:border-x md:border-hairline">
	<header class="absolute top-4 right-4 z-10 sm:right-8">
		<ThemeToggle />
	</header>

	<main id="main" class="flex-1 px-4 sm:px-8">
		{@render children()}
	</main>

	<footer
		class="flex flex-wrap justify-between gap-2 border-t border-hairline px-4 py-6 text-xs text-dim sm:px-8"
	>
		<span>© {new Date().getFullYear()} {site.name}</span>
		<span>Built with SvelteKit · hosted on Vercel</span>
		<button
			type="button"
			onclick={() => (palette.open = true)}
			class="inline-flex w-full items-center gap-1.5 hover:text-fg sm:w-auto"
		>
			<span class="sm:hidden">Quick menu →</span>
			<span class="hidden sm:inline"
				>Press <kbd class="rounded border border-hairline px-1 text-muted">⌘K</kbd> to jump anywhere</span
			>
		</button>
	</footer>
</div>

<CommandPalette />
<Toast />
