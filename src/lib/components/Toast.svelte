<script lang="ts">
	import { toast } from '$lib/ui.svelte';
</script>

<!-- The live region stays mounted so screen readers announce each new message. -->
<div
	role="status"
	aria-live="polite"
	class="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4"
>
	{#if toast.message}
		<p
			class="toast rounded border border-hairline bg-panel px-4 py-2 text-sm text-fg shadow-lg shadow-black/50"
		>
			{#if toast.message.ok}<span class="text-accent" aria-hidden="true">✓</span>{/if}
			{toast.message.text}
		</p>
	{/if}
</div>

<style>
	.toast {
		animation: rise 180ms ease-out;
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
</style>
