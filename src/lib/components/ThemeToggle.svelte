<script lang="ts">
	import { onMount } from 'svelte';
	import { setTheme, theme, watchTheme, type ThemeChoice } from '$lib/ui.svelte';
	import Icon, { type IconName } from './Icon.svelte';

	// Same three-way switch as the Recoup console.
	const options: { value: ThemeChoice; label: string; icon: IconName }[] = [
		{ value: 'light', label: 'Light theme', icon: 'sun' },
		{ value: 'dark', label: 'Dark theme', icon: 'moon' },
		{ value: 'system', label: 'Match system theme', icon: 'monitor' }
	];

	onMount(watchTheme);
</script>

<div
	role="group"
	aria-label="Colour theme"
	class="inline-flex gap-0.5 rounded-lg border border-hairline bg-panel p-0.5"
>
	{#each options as option (option.value)}
		<button
			type="button"
			aria-pressed={theme.choice === option.value}
			aria-label={option.label}
			title={option.label}
			onclick={() => setTheme(option.value)}
			class="flex h-7 w-8 items-center justify-center rounded-md transition-colors {theme.choice ===
			option.value
				? 'bg-hairline text-fg'
				: 'text-dim hover:text-fg'}"
		>
			<Icon name={option.icon} size={14} />
		</button>
	{/each}
</div>
