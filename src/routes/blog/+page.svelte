<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/data/site';

	let { data } = $props();

	// Tags ordered by how many posts use them, then alphabetically.
	const tags = $derived.by(() => {
		const all = data.posts.flatMap((p) => p.tags);
		const count = (t: string) => all.filter((x) => x === t).length;
		return [...new Set(all)].sort((a, b) => count(b) - count(a) || a.localeCompare(b));
	});
	let tag = $state<string | null>(null);
	const shown = $derived(tag ? data.posts.filter((p) => p.tags.includes(tag!)) : data.posts);
</script>

<Seo
	title="Blog"
	description="Notes from {site.name} on building machine learning for fintech: what worked, what didn't, and how it was checked."
/>
<svelte:head>
	<link rel="alternate" type="application/rss+xml" title="{site.name}: Blog" href="/rss.xml" />
</svelte:head>

<section class="py-16 sm:py-24">
	<a href="/" class="text-sm text-muted hover:text-fg">← home</a>

	<div class="mt-8 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
		<h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Blog</h1>
		<a href="/rss.xml" class="text-xs text-muted underline-offset-4 hover:text-fg hover:underline">
			RSS feed
		</a>
	</div>
	<p class="mt-4 max-w-prose font-sans leading-relaxed text-muted">
		Write-ups of things I've built: the decisions behind them, the numbers, and the parts that
		didn't work. {data.posts.length}
		{data.posts.length === 1 ? 'post' : 'posts'} so far.
	</p>

	{#if tags.length > 1}
		<div class="mt-8 flex flex-wrap gap-2 text-xs" role="group" aria-label="Filter posts by tag">
			{#each [null, ...tags] as option (option)}
				<button
					type="button"
					aria-pressed={tag === option}
					onclick={() => (tag = option)}
					class="rounded-full border px-3 py-1 transition-colors {tag === option
						? 'border-fg bg-fg text-bg'
						: 'border-hairline text-muted hover:border-muted hover:text-fg'}"
				>
					{option ?? 'All'}
				</button>
			{/each}
		</div>
	{/if}

	<div class="mt-8">
		{#if shown.length}
			<PostList posts={shown} headingLevel={2} />
		{:else}
			<p class="text-sm text-muted">Nothing here yet. Check back soon.</p>
		{/if}
	</div>
</section>
