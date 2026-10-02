<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { caseStudyHref, projects } from '$lib/data/projects';
	import { site } from '$lib/data/site';
	import { copy, palette } from '$lib/ui.svelte';

	type Command = { id: string; group: string; label: string; hint?: string; run: () => void };

	const external = (url: string) => () => window.open(url, '_blank', 'noopener');

	const commands: Command[] = [
		...[
			['projects', 'Projects'],
			['experience', 'Experience'],
			['toolkit', 'Toolkit'],
			['contact', 'Contact']
		].map(([id, label]) => ({
			id: `go-${id}`,
			group: 'Go to',
			label,
			run: () => goto(resolve(`/#${id}`))
		})),
		{
			id: 'go-why',
			group: 'Go to',
			label: 'Why hire me',
			run: () => goto(resolve('/why-hire-me'))
		},
		...projects
			.filter((p) => p.caseStudy)
			.map((p) => ({
				id: `case-${p.slug}`,
				group: 'Case studies',
				label: p.title,
				hint: p.hook,
				run: () => goto(resolve(caseStudyHref(p)))
			})),
		...projects.map((p) => ({
			id: `project-${p.slug}`,
			group: 'Projects',
			label: p.title,
			hint: p.category,
			run: () => goto(resolve(`/#${p.slug}`))
		})),
		{
			id: 'copy-email',
			group: 'Actions',
			label: 'Copy email address',
			hint: site.email,
			run: () => copy(site.email, 'Email address')
		},
		...(site.resume
			? [{ id: 'resume', group: 'Actions', label: 'Open résumé (PDF)', run: external(site.resume) }]
			: []),
		{ id: 'github', group: 'Actions', label: 'GitHub', run: external(site.socials.github) },
		{ id: 'linkedin', group: 'Actions', label: 'LinkedIn', run: external(site.socials.linkedin) }
	];

	let dialog = $state<HTMLDialogElement>();
	let input = $state<HTMLInputElement>();
	let query = $state('');
	let active = $state(0);

	const results = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return commands;
		return commands.filter((c) =>
			`${c.label} ${c.group} ${c.hint ?? ''}`.toLowerCase().includes(q)
		);
	});

	$effect(() => {
		if (!dialog) return;
		if (palette.open && !dialog.open) {
			query = '';
			active = 0;
			dialog.showModal();
			input?.focus();
		} else if (!palette.open && dialog.open) {
			dialog.close();
		}
	});

	// Keep the highlighted row valid as the list narrows.
	$effect(() => {
		if (active >= results.length) active = Math.max(0, results.length - 1);
	});

	function run(command: Command) {
		palette.open = false;
		command.run();
	}

	function onWindowKey(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			palette.open = !palette.open;
		} else if (e.key === '/' && !palette.open) {
			const target = e.target as HTMLElement;
			if (target.closest('input, textarea, [contenteditable="true"]')) return;
			e.preventDefault();
			palette.open = true;
		}
	}

	function onInputKey(e: KeyboardEvent) {
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
			const step = e.key === 'ArrowDown' ? 1 : -1;
			active = (active + step + results.length) % Math.max(results.length, 1);
			document.getElementById(`cmd-${results[active]?.id}`)?.scrollIntoView({ block: 'nearest' });
		} else if (e.key === 'Enter' && results[active]) {
			e.preventDefault();
			run(results[active]);
		}
	}
</script>

<svelte:window onkeydown={onWindowKey} />

<dialog
	bind:this={dialog}
	aria-label="Command menu"
	onclose={() => (palette.open = false)}
	onclick={(e) => {
		// A click on the backdrop lands on the dialog element itself.
		if (e.target === dialog) palette.open = false;
	}}
	class="palette mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-lg border border-hairline bg-panel p-0 text-fg shadow-2xl shadow-black/60"
>
	<div class="flex items-center gap-3 border-b border-hairline px-4">
		<span class="text-accent" aria-hidden="true">›</span>
		<input
			bind:this={input}
			bind:value={query}
			onkeydown={onInputKey}
			type="text"
			role="combobox"
			aria-expanded="true"
			aria-controls="cmd-list"
			aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
			aria-autocomplete="list"
			aria-label="Search pages, projects and actions"
			placeholder="Jump to a project, copy my email…"
			autocomplete="off"
			spellcheck="false"
			class="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-dim"
		/>
		<kbd class="rounded border border-hairline px-1.5 py-0.5 text-[10px] text-dim">esc</kbd>
	</div>

	<ul id="cmd-list" role="listbox" aria-label="Results" class="max-h-[50vh] overflow-y-auto p-2">
		{#each results as command, i (command.id)}
			{#if i === 0 || results[i - 1].group !== command.group}
				<li
					role="presentation"
					class="px-2 pt-3 pb-1 text-[10px] tracking-[0.2em] text-dim uppercase"
				>
					{command.group}
				</li>
			{/if}
			<!-- Options are driven from the search box (aria-activedescendant), so they take no focus. -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<li
				id="cmd-{command.id}"
				role="option"
				aria-selected={i === active}
				class="flex cursor-pointer items-baseline gap-3 rounded px-2 py-2 text-sm {i === active
					? 'bg-hairline text-fg'
					: 'text-muted'}"
				onclick={() => run(command)}
				onmousemove={() => (active = i)}
			>
				<span class="truncate">{command.label}</span>
				{#if command.hint}
					<span class="ml-auto truncate font-sans text-xs text-dim">{command.hint}</span>
				{/if}
			</li>
		{/each}
	</ul>
	{#if !results.length}
		<p class="px-4 pb-6 text-center text-sm text-dim">No matches for “{query}”.</p>
	{/if}

	<p class="flex gap-4 border-t border-hairline px-4 py-2 text-[10px] text-dim">
		<span><kbd>↑</kbd><kbd>↓</kbd> move</span>
		<span><kbd>↵</kbd> open</span>
		<span class="ml-auto"><kbd>⌘K</kbd> or <kbd>/</kbd> anywhere</span>
	</p>
</dialog>

<style>
	.palette::backdrop {
		background: rgb(0 0 0 / 0.6);
		backdrop-filter: blur(2px);
	}
	kbd {
		font-family: var(--font-mono);
	}
</style>
