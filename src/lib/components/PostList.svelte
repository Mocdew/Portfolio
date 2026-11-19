<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatDate, type Post } from '$lib/blog';

	let { posts, headingLevel = 3 }: { posts: Post[]; headingLevel?: 2 | 3 } = $props();
</script>

<ol class="divide-y divide-hairline border-y border-hairline">
	{#each posts as post (post.slug)}
		<li>
			<article class="group relative py-5">
				<p class="flex flex-wrap items-center gap-x-2 text-xs text-dim tabular-nums">
					<time datetime={post.date}>{formatDate(post.date)}</time>
					<span aria-hidden="true">·</span>
					<span>{post.minutes} min read</span>
					{#if post.draft}
						<span class="rounded border border-accent/40 px-1.5 text-accent">draft</span>
					{/if}
				</p>
				<svelte:element
					this={`h${headingLevel}`}
					class="mt-1.5 font-semibold text-fg group-hover:text-accent"
				>
					<!-- The link covers the whole row, so the full card is clickable. -->
					<a
						href={resolve('/blog/[slug]', { slug: post.slug })}
						class="after:absolute after:inset-0"
					>
						{post.title}
					</a>
				</svelte:element>
				<p class="mt-1.5 max-w-prose font-sans text-sm leading-relaxed text-muted">
					{post.description}
				</p>
				<ul class="mt-3 flex flex-wrap gap-1.5" aria-label="Tags">
					{#each post.tags as tag (tag)}
						<li class="rounded border border-hairline px-2 py-0.5 text-[11px] text-muted">
							{tag}
						</li>
					{/each}
				</ul>
			</article>
		</li>
	{/each}
</ol>
