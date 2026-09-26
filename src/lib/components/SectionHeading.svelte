<script lang="ts">
	let { id, title, meta }: { id: string; title: string; meta?: string } = $props();
</script>

<h2
	id="{id}-heading"
	class="mb-6 flex items-baseline gap-2 text-sm tracking-[0.2em] text-fg uppercase"
>
	<a href="#{id}" class="text-dim hover:text-fg" aria-label="Link to {title}">#</a>
	{title}
	{#if meta}<span class="tracking-normal text-dim normal-case">· {meta}</span>{/if}
</h2>
