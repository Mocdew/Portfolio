<script lang="ts">
	import type { Project } from '$lib/data/projects';
	import Icon from './Icon.svelte';

	let { project, index }: { project: Project; index: number } = $props();
	const number = $derived(String(index + 1).padStart(2, '0'));
	const links = $derived(
		(
			[
				['GitHub', project.links.github],
				['Live demo', project.links.demo],
				['Docs', project.links.docs]
			] as [string, string | undefined][]
		).filter((l): l is [string, string] => Boolean(l[1]))
	);
</script>

<article
	id={project.slug}
	class="group rounded-md border border-hairline bg-panel p-5 transition-colors hover:border-muted/40 sm:p-6"
>
	<header class="flex items-baseline gap-3">
		<span class="text-sm text-dim tabular-nums">{number}</span>
		<h3 class="text-lg font-semibold text-fg">{project.title}</h3>
		{#if project.private}
			<span class="rounded border border-hairline px-1.5 text-[11px] text-muted">private</span>
		{/if}
		<span class="ml-auto text-xs text-muted">{project.language}</span>
	</header>

	<p class="mt-3 font-sans font-medium text-fg">{project.hook}</p>
	<p class="mt-2 font-sans text-[0.93rem] leading-relaxed text-muted">{project.description}</p>

	{#if project.metrics.length}
		<ul class="mt-4 flex flex-wrap gap-2" aria-label="Results">
			{#each project.metrics as metric (metric)}
				<li class="rounded border border-accent/30 bg-accent/5 px-2 py-0.5 text-xs text-accent">
					{metric}
				</li>
			{/each}
		</ul>
	{/if}

	<div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
		<ul class="flex flex-wrap gap-1.5" aria-label="Tech">
			{#each project.tags as tag (tag)}
				<li class="rounded bg-hairline/60 px-2 py-0.5 text-[11px] text-muted">{tag}</li>
			{/each}
		</ul>
		{#if links.length}
			<div class="ml-auto flex gap-4 text-sm">
				{#each links as [label, href] (label)}
					<a
						{href}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-1 text-fg underline-offset-4 hover:underline"
					>
						{label}<Icon name="arrow-up-right" size={13} />
						<span class="sr-only">(opens in a new tab)</span>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</article>
