<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '$lib/components/Icon.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { formatDate } from '$lib/blog';
	import { site } from '$lib/data/site';
	import { copy } from '$lib/ui.svelte';

	let { data } = $props();
	const post = $derived(data.post);
	const Body = $derived(data.body);

	// Give every code block a copy button. Highlighting happens at build time, so the buttons are
	// added here rather than in the Markdown.
	function copyButtons(node: HTMLElement) {
		for (const pre of node.querySelectorAll('pre')) {
			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'copy-code';
			button.textContent = 'copy';
			button.setAttribute('aria-label', 'Copy code');
			const code = pre.querySelector('code') ?? pre;
			button.addEventListener('click', () => copy(code.textContent ?? '', 'Code'));
			pre.append(button);
		}
	}
</script>

<Seo title={post.title} description={post.description} type="article" published={post.date} />
<svelte:head>
	<link rel="alternate" type="application/rss+xml" title="{site.name}: Blog" href="/rss.xml" />
</svelte:head>

<article class="py-16 sm:py-20">
	<a href="/blog" class="text-sm text-muted hover:text-fg">← all posts</a>

	<p class="mt-10 flex flex-wrap items-center gap-x-2 text-xs text-dim tabular-nums">
		<time datetime={post.date}>{formatDate(post.date)}</time>
		<span aria-hidden="true">·</span>
		<span>{post.minutes} min read</span>
		{#if post.draft}
			<span class="rounded border border-accent/40 px-1.5 text-accent">draft</span>
		{/if}
	</p>
	<h1 class="mt-3 text-3xl font-semibold tracking-tight text-balance text-fg sm:text-4xl">
		{post.title}
	</h1>
	<p class="mt-4 max-w-prose font-sans text-lg leading-relaxed text-muted">{post.description}</p>
	<ul class="mt-5 flex flex-wrap gap-1.5" aria-label="Tags">
		{#each post.tags as tag (tag)}
			<li class="rounded border border-hairline px-2 py-0.5 text-[11px] text-muted">{tag}</li>
		{/each}
	</ul>

	{#key post.slug}
		<div class="post prose mt-12 max-w-none" {@attach copyButtons}>
			<Body />
		</div>
	{/key}

	<footer class="mt-16 border-t border-hairline pt-8">
		{#if data.newer || data.older}
			<nav aria-label="More posts" class="grid gap-4 sm:grid-cols-2">
				{#each [['Newer', data.newer], ['Older', data.older]] as const as [label, other] (label)}
					{#if other}
						<a
							href={resolve('/blog/[slug]', { slug: other.slug })}
							class="group rounded-md border border-hairline p-4 transition-colors hover:border-accent
								{label === 'Older' ? 'sm:col-start-2 sm:text-right' : ''}"
						>
							<span class="block text-[11px] tracking-[0.2em] text-dim uppercase">
								{label === 'Newer' ? '← Newer' : 'Older →'}
							</span>
							<span class="mt-1 block font-semibold text-fg group-hover:text-accent">
								{other.title}
							</span>
						</a>
					{/if}
				{/each}
			</nav>
		{/if}
		<div class="mt-8 flex flex-wrap gap-3 text-sm">
			<a
				href="mailto:{site.email}"
				class="inline-flex items-center gap-2 rounded border border-fg px-4 py-2 font-semibold text-fg transition-colors hover:bg-fg hover:text-bg"
			>
				<Icon name="mail" size={15} /> Talk to me about this
			</a>
			<a
				href="/#projects"
				class="inline-flex items-center rounded border border-hairline px-4 py-2 text-muted hover:border-muted hover:text-fg"
			>
				See the projects
			</a>
		</div>
	</footer>
</article>
