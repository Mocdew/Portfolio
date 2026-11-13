<script lang="ts">
	import { onMount } from 'svelte';
	import { site } from '$lib/data/site';

	const path = '/projects/lendtrial';

	onMount(() => {
		window.location.replace(path + window.location.search + window.location.hash);
	});
</script>

<svelte:head>
	<title>LendTrial | {site.name}</title>
	<link rel="canonical" href={new URL(path, site.url).href} />
</svelte:head>

<section class="py-24">
	<h1 class="text-2xl font-semibold">LendTrial</h1>
	<p class="mt-4 text-muted">
		The project has moved. <a href={path} class="text-accent underline"
			>Open the LendTrial case study</a
		>.
	</p>
</section>
