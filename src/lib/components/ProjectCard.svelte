<script lang="ts">
	import { caseStudyHref, type Project } from '$lib/data/projects';
	import Icon from './Icon.svelte';

	let {
		project,
		index,
		featured = false
	}: { project: Project; index: number; featured?: boolean } = $props();
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

{#snippet figure(image: NonNullable<Project['image']>)}
	<figure class="overflow-hidden rounded border border-hairline bg-panel">
		<!-- With a light version, each theme shows its own; the hidden one is never downloaded. -->
		{#each image.srcLight ? [[image.src, 'dark-only'], [image.srcLight, 'light-only']] : [[image.src, '']] as [src, only] (src)}
			<a href={src} target="_blank" rel="noopener" class="block {only}" aria-label="Open full size">
				<img
					{src}
					alt={image.alt}
					width={image.width}
					height={image.height}
					loading="lazy"
					decoding="async"
					class="h-auto w-full object-contain {featured ? 'max-h-[28rem]' : 'max-h-72'}"
				/>
			</a>
		{/each}
	</figure>
{/snippet}

<article
	id={project.slug}
	class="flex h-full flex-col rounded-md border border-hairline bg-panel transition-colors hover:border-muted/40
		{featured ? 'p-5 sm:p-6' : 'p-4 sm:p-5'}"
>
	{#if featured && project.image}
		<div class="mb-5">{@render figure(project.image)}</div>
	{/if}

	<header class="flex items-baseline gap-3">
		<span class="text-sm text-dim tabular-nums">{number}</span>
		<h3 class="font-semibold text-fg {featured ? 'text-lg' : 'text-base'}">{project.title}</h3>
		{#if project.private}
			<span class="rounded border border-hairline px-1.5 text-[11px] text-muted">private</span>
		{/if}
		<span class="ml-auto text-xs whitespace-nowrap text-muted">{project.language}</span>
	</header>

	<p class="mt-3 font-sans font-medium text-fg {featured ? '' : 'text-[0.95rem]'}">
		{project.hook}
	</p>

	{#if project.metrics.length}
		<ul class="mt-4 flex flex-wrap gap-2" aria-label="Results">
			{#each project.metrics as metric (metric)}
				<li class="rounded border border-accent/30 bg-accent/5 px-2 py-0.5 text-xs text-accent">
					{metric}
				</li>
			{/each}
		</ul>
	{/if}

	<details class="group/details mt-4">
		<summary
			class="inline-flex cursor-pointer list-none items-center gap-1.5 text-xs tracking-wider text-muted uppercase select-none hover:text-fg [&::-webkit-details-marker]:hidden"
		>
			<span
				class="inline-block transition-transform group-open/details:rotate-90"
				aria-hidden="true">▸</span
			>
			How it works
		</summary>
		<p class="mt-3 font-sans text-[0.93rem] leading-relaxed text-muted">{project.description}</p>
		{#if !featured && project.image}
			<div class="mt-4">{@render figure(project.image)}</div>
		{/if}
		<ul class="mt-4 flex flex-wrap gap-1.5" aria-label="Tech">
			{#each project.tags as tag (tag)}
				<li class="rounded bg-hairline/60 px-2 py-0.5 text-[11px] text-muted">{tag}</li>
			{/each}
		</ul>
	</details>

	{#if links.length || project.caseStudy}
		<div class="mt-auto flex flex-wrap items-center justify-end gap-x-4 gap-y-2 pt-4 text-sm">
			{#if project.caseStudy}
				<a
					href={caseStudyHref(project)}
					class="mr-auto inline-flex items-center gap-1 font-semibold text-accent underline-offset-4 hover:underline"
				>
					Read the case study <span aria-hidden="true">→</span>
				</a>
			{/if}
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
</article>
