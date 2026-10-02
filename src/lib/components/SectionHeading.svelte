<script lang="ts">
	let { id, title, meta, index }: { id: string; title: string; meta?: string; index?: number } =
		$props();
</script>

<h2
	id="{id}-heading"
	class="mb-6 flex items-baseline gap-2 text-sm tracking-[0.2em] text-fg uppercase"
>
	<a
		href="#{id}"
		class="tracking-normal text-dim tabular-nums hover:text-accent"
		aria-label="Link to {title}"
		>{index === undefined ? '#' : `// ${String(index).padStart(2, '0')}`}</a
	>
	{title}
	{#if meta}<span class="tracking-normal text-dim normal-case">· {meta}</span>{/if}
</h2>
