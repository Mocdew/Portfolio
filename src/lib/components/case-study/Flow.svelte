<script lang="ts">
	// A left-to-right pipeline on wide screens, top-to-bottom on phones.
	let { steps, caption }: { steps: { title: string; body: string }[]; caption: string } = $props();
</script>

<figure class="my-8">
	<ol
		class="flow grid gap-2 sm:gap-0"
		style:grid-template-columns="repeat({steps.length}, minmax(0, 1fr))"
	>
		{#each steps as step, i (step.title)}
			<li class="relative flex flex-col sm:flex-row">
				<div class="flex-1 rounded-md border border-hairline bg-panel p-3">
					<p class="text-[11px] text-dim tabular-nums">{String(i + 1).padStart(2, '0')}</p>
					<p class="mt-1 text-sm font-semibold text-fg">{step.title}</p>
					<p class="mt-1 font-sans text-xs leading-relaxed text-muted">{step.body}</p>
				</div>
				{#if i < steps.length - 1}
					<span
						class="flex items-center justify-center py-1 text-dim sm:w-5 sm:py-0"
						aria-hidden="true"
					>
						<span class="sm:hidden">↓</span><span class="hidden sm:inline">→</span>
					</span>
				{/if}
			</li>
		{/each}
	</ol>
	<figcaption class="mt-3 text-xs text-dim">{caption}</figcaption>
</figure>

<style>
	/* One column on phones; the inline column count only applies from the sm breakpoint. */
	@media (width < 40rem) {
		.flow {
			grid-template-columns: 1fr !important;
		}
	}
</style>
