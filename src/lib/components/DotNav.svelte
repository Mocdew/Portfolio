<script lang="ts">
	import { onMount } from 'svelte';

	let { sections }: { sections: { id: string; label: string }[] } = $props();
	let active = $state('');
	let progress = $state(0);

	// Sections after the first are numbered to match their // 01 headings.
	const current = $derived.by(() => {
		const i = sections.findIndex((s) => s.id === active);
		return i > 0 ? { number: String(i).padStart(2, '0'), label: sections[i].label } : null;
	});

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) active = entry.target.id;
				}
			},
			// A section counts as current once it crosses the middle band of the viewport.
			{ rootMargin: '-45% 0px -45% 0px' }
		);
		for (const { id } of sections) {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		}

		let frame = 0;
		const onScroll = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const max = document.documentElement.scrollHeight - innerHeight;
				progress = max > 0 ? Math.min(1, scrollY / max) : 0;
			});
		};
		onScroll();
		addEventListener('scroll', onScroll, { passive: true });

		return () => {
			observer.disconnect();
			removeEventListener('scroll', onScroll);
			cancelAnimationFrame(frame);
		};
	});
</script>

<!-- Phones and tablets: a slim bar naming the current section, with reading progress. -->
<div
	class="nav-glass fixed inset-x-0 top-0 z-50 border-b border-hairline transition-transform duration-200 lg:hidden
		{current ? 'translate-y-0' : '-translate-y-full'}"
	aria-hidden="true"
>
	<a
		href="#hero"
		tabindex="-1"
		class="flex items-center gap-2 px-4 py-2 text-xs tracking-[0.2em] uppercase"
	>
		<span class="tracking-normal text-dim tabular-nums">// {current?.number}</span>
		<span class="text-fg">{current?.label}</span>
		<span class="ml-auto tracking-normal text-dim normal-case">top ↑</span>
	</a>
	<span
		class="absolute bottom-0 left-0 h-px w-full origin-left bg-accent"
		style:transform="scaleX({progress})"
	></span>
</div>

<nav
	aria-label="Sections"
	class="nav-glass fixed top-1/2 right-5 z-50 hidden -translate-y-1/2 flex-col items-center gap-4 rounded-full border border-hairline px-3 py-6 lg:flex"
>
	{#each sections as { id, label } (id)}
		<a
			href="#{id}"
			class="group relative flex h-3 w-3 items-center justify-center"
			aria-current={active === id ? 'location' : undefined}
		>
			<span
				class="h-1.5 w-1.5 rounded-full transition-all duration-200 group-hover:scale-150 group-hover:bg-fg
					{active === id ? 'scale-150 bg-fg' : 'bg-dim'}"
			></span>
			<span
				class="pointer-events-none absolute right-6 rounded border border-hairline bg-panel px-2 py-1 text-xs whitespace-nowrap text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
			>
				{label}
			</span>
		</a>
	{/each}
</nav>

<style>
	.nav-glass {
		background: rgb(12 11 11 / 0.6);
		backdrop-filter: blur(10px);
	}
</style>
