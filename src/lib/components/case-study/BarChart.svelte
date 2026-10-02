<script lang="ts">
	// Horizontal bars drawn with CSS. Values are printed next to each bar, so the chart reads
	// the same to a screen reader as it does on screen.
	type Row = { label: string; value: number; highlight?: boolean; note?: string };

	let {
		rows,
		caption,
		format = (v: number) => String(v),
		max
	}: {
		rows: Row[];
		caption: string;
		format?: (v: number) => string;
		/** Scale ceiling; defaults to the largest value. */
		max?: number;
	} = $props();

	const top = $derived(max ?? Math.max(...rows.map((r) => r.value)));
</script>

<figure class="my-8 rounded-md border border-hairline bg-panel p-4 sm:p-5">
	<figcaption class="mb-4 font-sans text-sm text-fg">{caption}</figcaption>
	<ol class="space-y-3">
		{#each rows as row (row.label)}
			<li class="grid gap-1 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-4">
				<span class="text-xs {row.highlight ? 'text-fg' : 'text-muted'}">{row.label}</span>
				<span class="flex items-center gap-3">
					<span class="h-3 flex-1 overflow-hidden rounded-sm bg-hairline/50" aria-hidden="true">
						<span
							class="block h-full rounded-sm {row.highlight ? 'bg-accent' : 'bg-muted/50'}"
							style:width="{Math.max(0, (row.value / top) * 100)}%"
						></span>
					</span>
					<span
						class="w-20 shrink-0 text-right text-xs tabular-nums {row.highlight
							? 'text-accent'
							: 'text-muted'}"
					>
						{format(row.value)}
					</span>
				</span>
				{#if row.note}
					<span class="text-[11px] text-dim sm:col-start-2">{row.note}</span>
				{/if}
			</li>
		{/each}
	</ol>
</figure>
