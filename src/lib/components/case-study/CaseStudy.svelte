<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { caseStudyHref, projects } from '$lib/data/projects';
	import { site } from '$lib/data/site';

	let {
		slug,
		summary,
		children
	}: {
		slug: string;
		/** Two or three plain-English sentences: what it is and why it matters. */
		summary: string;
		children: Snippet;
	} = $props();

	const project = $derived(projects.find((p) => p.slug === slug)!);
	const others = $derived(projects.filter((p) => p.caseStudy && p.slug !== slug));
	const links = $derived(
		(
			[
				['GitHub', project.links.github],
				['Live demo', project.links.demo]
			] as [string, string | undefined][]
		).filter((l): l is [string, string] => Boolean(l[1]))
	);
</script>

<Seo title="{project.title} — case study" description="{project.hook} {summary}" />

<article class="py-16 sm:py-20">
	<a href="/#{project.slug}" class="text-sm text-muted hover:text-fg">← all projects</a>

	<p class="mt-10 text-[11px] tracking-[0.2em] text-dim uppercase">
		Case study <span aria-hidden="true">·</span>
		{project.category}
	</p>
	<h1 class="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{project.title}</h1>
	<p class="mt-4 font-sans text-lg font-medium text-fg">{project.hook}</p>
	<p class="mt-3 max-w-prose font-sans leading-relaxed text-muted">{summary}</p>

	<ul class="mt-6 flex flex-wrap gap-2" aria-label="Results">
		{#each project.metrics as metric (metric)}
			<li class="rounded border border-accent/30 bg-accent/5 px-2 py-0.5 text-xs text-accent">
				{metric}
			</li>
		{/each}
	</ul>

	<div class="mt-6 flex flex-wrap gap-3 text-sm">
		{#each links as [label, href] (label)}
			<a
				{href}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 rounded border border-hairline px-3 py-1.5 text-fg hover:border-muted"
			>
				{label}<Icon name="arrow-up-right" size={13} />
				<span class="sr-only">(opens in a new tab)</span>
			</a>
		{/each}
	</div>

	<div class="case-study mt-14 space-y-14">
		{@render children()}
	</div>

	<footer class="mt-16 border-t border-hairline pt-8">
		{#if others.length}
			<p class="text-[11px] tracking-[0.2em] text-dim uppercase">Next case study</p>
			<ul class="mt-3 space-y-2">
				{#each others as other (other.slug)}
					<li>
						<a href={caseStudyHref(other)} class="group inline-flex items-baseline gap-2">
							<span class="font-semibold text-fg group-hover:underline">{other.title}</span>
							<span class="font-sans text-sm text-muted">— {other.hook}</span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
		<div class="mt-8 flex flex-wrap gap-3 text-sm">
			<a
				href="mailto:{site.email}"
				class="inline-flex items-center gap-2 rounded border border-fg px-4 py-2 font-semibold text-fg transition-colors hover:bg-fg hover:text-bg"
			>
				<Icon name="mail" size={15} /> Talk to me about this
			</a>
			<a
				href="/why-hire-me"
				class="inline-flex items-center rounded border border-hairline px-4 py-2 text-muted hover:border-muted hover:text-fg"
			>
				Why hire me
			</a>
		</div>
	</footer>
</article>
