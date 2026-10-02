<script lang="ts">
	import AsciiName from '$lib/components/AsciiName.svelte';
	import DotNav from '$lib/components/DotNav.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { categories, projects, type Category } from '$lib/data/projects';
	import { education, experience, site, skills } from '$lib/data/site';

	const sections = [
		{ id: 'hero', label: 'Top' },
		{ id: 'projects', label: 'Projects' },
		{ id: 'experience', label: 'Experience' },
		{ id: 'toolkit', label: 'Toolkit' },
		{ id: 'contact', label: 'Contact' }
	];

	// Only offer filters that match at least one project.
	const filters = categories.filter((c) => projects.some((p) => p.category === c));
	let filter = $state<Category | null>(null);
	const shown = $derived(filter ? projects.filter((p) => p.category === filter) : projects);
	const featured = $derived(shown.filter((p) => p.featured));
	const rest = $derived(shown.filter((p) => !p.featured));
</script>

<Seo />
<DotNav {sections} />

<section id="hero" class="flex flex-col items-center pt-20 pb-16 text-center sm:pt-28">
	<h1 class="sr-only">{site.name} — {site.role}</h1>
	<AsciiName text={site.asciiName} />

	<p class="mt-6 text-xs tracking-[0.3em] text-muted uppercase">
		{site.role} <span class="text-dim">·</span> fintech
	</p>

	<div class="mt-6 space-y-1 text-sm leading-relaxed text-fg sm:text-[0.95rem]">
		<p>I build machine learning for fintech and ship it as software.</p>
		<p>APIs, tests and model cards — not just notebooks.</p>
		<p class="cursor text-muted">Don't take my word for it. Look below.</p>
	</div>

	<nav aria-label="Primary" class="mt-8 flex flex-wrap justify-center gap-x-2 gap-y-2 text-sm">
		<a href="/why-hire-me" class="font-semibold underline-offset-4 hover:underline">Why hire me</a>
		<span class="text-dim" aria-hidden="true">·</span>
		<a href="#projects" class="font-semibold underline-offset-4 hover:underline">Projects</a>
		{#if site.resume}
			<span class="text-dim" aria-hidden="true">·</span>
			<a href={site.resume} class="font-semibold underline-offset-4 hover:underline">Résumé</a>
		{/if}
	</nav>

	<ul class="mt-6 flex gap-5 text-muted" aria-label="Elsewhere">
		<li>
			<a href={site.socials.github} class="hover:text-fg" aria-label="GitHub">
				<Icon name="github" size={18} />
			</a>
		</li>
		<li>
			<a href={site.socials.linkedin} class="hover:text-fg" aria-label="LinkedIn">
				<Icon name="linkedin" size={18} />
			</a>
		</li>
		<li>
			<a href="mailto:{site.email}" class="hover:text-fg" aria-label="Email">
				<Icon name="mail" size={18} />
			</a>
		</li>
	</ul>
</section>

<section id="projects" aria-labelledby="projects-heading" class="py-12">
	<SectionHeading id="projects" title="Projects" meta={String(projects.length)} />

	<div class="rounded-md border border-dashed border-hairline p-5 text-sm leading-relaxed">
		<p class="mb-3 text-[11px] tracking-[0.2em] text-dim uppercase">Honest bit</p>
		<p class="font-sans text-fg">
			Everything below is real work with code you can read. Most of it ships with an API, tests, and
			a written list of its own limitations — a model that hides its weaknesses isn't one I'd trust
			with a loan decision.
		</p>
		<p class="mt-3 font-sans text-muted italic">
			The numbers are measured on data the model never trained on, or in simulation where it says
			so. Click through and check them.
		</p>
	</div>

	<div class="mt-8 flex flex-wrap gap-2 text-xs" role="group" aria-label="Filter projects">
		{#each [null, ...filters] as option (option)}
			<button
				type="button"
				aria-pressed={filter === option}
				onclick={() => (filter = option)}
				class="rounded-full border px-3 py-1 transition-colors {filter === option
					? 'border-fg bg-fg text-bg'
					: 'border-hairline text-muted hover:border-muted hover:text-fg'}"
			>
				{option ?? 'All'}
				<span class="ml-1 tabular-nums opacity-60"
					>{option ? projects.filter((p) => p.category === option).length : projects.length}</span
				>
			</button>
		{/each}
	</div>

	{#if featured.length}
		<h3 class="mt-8 mb-4 text-[11px] tracking-[0.2em] text-dim uppercase">Featured</h3>
		<ol class="space-y-5">
			{#each featured as project (project.slug)}
				<li><ProjectCard {project} index={projects.indexOf(project)} featured /></li>
			{/each}
		</ol>
	{/if}

	{#if rest.length}
		<h3 class="mt-10 mb-4 text-[11px] tracking-[0.2em] text-dim uppercase">
			{featured.length ? 'More projects' : 'Projects'}
		</h3>
		<ol class="grid gap-4 sm:grid-cols-2">
			{#each rest as project (project.slug)}
				<li><ProjectCard {project} index={projects.indexOf(project)} /></li>
			{/each}
		</ol>
	{/if}

	<p class="mt-8 text-right text-sm">
		<a href={site.socials.github} class="inline-flex items-center gap-1 text-muted hover:text-fg">
			More on GitHub <Icon name="arrow-up-right" size={13} />
		</a>
	</p>
</section>

<section id="experience" aria-labelledby="experience-heading" class="py-12">
	<SectionHeading id="experience" title="Experience" />
	<ol class="relative space-y-8 border-l border-hairline pl-6">
		{#each experience as job (job.org)}
			<li class="relative">
				<span
					class="absolute top-1.5 -left-[1.82rem] h-2.5 w-2.5 rounded-full border-2 border-bg bg-accent"
					aria-hidden="true"
				></span>
				<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
					<h3 class="font-semibold text-fg">
						{job.role} <span class="font-normal text-muted">— {job.org}</span>
					</h3>
					<span class="text-xs text-muted tabular-nums">{job.dates}</span>
				</div>
				<p class="mt-1 text-xs text-dim">{job.where}</p>
				<ul class="mt-3 space-y-2 font-sans text-[0.93rem] leading-relaxed text-muted">
					{#each job.highlights as point (point)}
						<li class="flex gap-2">
							<span class="text-dim" aria-hidden="true">–</span><span>{point}</span>
						</li>
					{/each}
				</ul>
				{#if job.project}
					<a
						href="#{job.project}"
						class="mt-3 inline-block text-sm text-fg underline-offset-4 hover:underline"
					>
						See the project ↑
					</a>
				{/if}
			</li>
		{/each}
		<li class="relative">
			<span
				class="absolute top-1.5 -left-[1.82rem] h-2.5 w-2.5 rounded-full border-2 border-bg bg-dim"
				aria-hidden="true"
			></span>
			<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
				<h3 class="font-semibold text-fg">
					{education.degree} <span class="font-normal text-muted">— {education.school}</span>
				</h3>
				<span class="text-xs text-muted tabular-nums">{education.dates}</span>
			</div>
		</li>
	</ol>
</section>

<section id="toolkit" aria-labelledby="toolkit-heading" class="py-12">
	<SectionHeading id="toolkit" title="Toolkit" />
	<dl class="grid gap-x-8 gap-y-5 sm:grid-cols-[12rem_1fr]">
		{#each skills as { group, items } (group)}
			<dt class="text-xs tracking-wider text-dim uppercase sm:pt-1">{group}</dt>
			<dd class="flex flex-wrap gap-1.5">
				{#each items as item (item)}
					<span class="rounded border border-hairline px-2 py-0.5 text-xs text-muted">{item}</span>
				{/each}
			</dd>
		{/each}
	</dl>
</section>

<section id="contact" aria-labelledby="contact-heading" class="py-12 pb-20">
	<SectionHeading id="contact" title="Contact" />
	<p class="font-sans text-fg">
		Looking for a machine learning role building reliable AI features for fintech and startup
		products.
	</p>
	<p class="mt-2 font-sans text-muted">Based in {site.location} — open to hybrid.</p>
	<div class="mt-6 flex flex-wrap gap-3 text-sm">
		<a
			href="mailto:{site.email}"
			class="inline-flex items-center gap-2 rounded border border-fg px-4 py-2 font-semibold text-fg transition-colors hover:bg-fg hover:text-bg"
		>
			<Icon name="mail" size={15} />
			{site.email}
		</a>
		<a
			href={site.socials.linkedin}
			class="inline-flex items-center gap-2 rounded border border-hairline px-4 py-2 text-muted hover:border-muted hover:text-fg"
		>
			<Icon name="linkedin" size={15} /> LinkedIn
		</a>
	</div>
</section>
