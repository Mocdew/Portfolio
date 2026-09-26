<script lang="ts">
	import { onMount } from 'svelte';

	let { sections }: { sections: { id: string; label: string }[] } = $props();
	let active = $state('');

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
		return () => observer.disconnect();
	});
</script>

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
