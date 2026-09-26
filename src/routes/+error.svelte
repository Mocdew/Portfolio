<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head><title>{page.status} — not found</title></svelte:head>

<section class="py-24 text-sm">
	<p class="text-muted">
		<span class="text-accent">$</span> cd {page.url.pathname}
	</p>
	<p class="mt-2 text-fg">
		{page.status === 404 ? 'bash: no such file or directory' : (page.error?.message ?? 'error')}
	</p>
	<p class="cursor mt-8 text-muted">
		<a href="/" class="text-fg underline-offset-4 hover:underline">cd ~</a>
	</p>
</section>
