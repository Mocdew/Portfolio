<script lang="ts">
	let { label = 'Open to ML roles' }: { label?: string } = $props();
</script>

<span
	class="inline-flex items-center gap-2 rounded-full border border-hairline bg-panel px-3 py-1 text-xs text-muted"
>
	<span class="relative flex h-2 w-2" aria-hidden="true">
		<!-- The ping is motion-safe so it never fires under prefers-reduced-motion. -->
		<span
			class="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping"
		></span>
		<span class="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
	</span>
	{label}
</span>
