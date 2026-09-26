<script lang="ts" module>
	// "ANSI Shadow" figlet glyphs. Each glyph is 6 rows of equal width.
	// Add letters here if the name changes (generate with: figlet -f "ANSI Shadow" X).
	const GLYPHS: Record<string, string[]> = {
		D: ['██████╗ ', '██╔══██╗', '██║  ██║', '██║  ██║', '██████╔╝', '╚═════╝ '],
		E: ['███████╗', '██╔════╝', '█████╗  ', '██╔══╝  ', '███████╗', '╚══════╝'],
		I: ['██╗', '██║', '██║', '██║', '██║', '╚═╝'],
		L: ['██╗     ', '██║     ', '██║     ', '██║     ', '███████╗', '╚══════╝'],
		M: ['███╗   ███╗', '████╗ ████║', '██╔████╔██║', '██║╚██╔╝██║', '██║ ╚═╝ ██║', '╚═╝     ╚═╝'],
		O: [' ██████╗ ', '██╔═══██╗', '██║   ██║', '██║   ██║', '╚██████╔╝', ' ╚═════╝ '],
		U: ['██╗   ██╗', '██║   ██║', '██║   ██║', '██║   ██║', '╚██████╔╝', ' ╚═════╝ ']
	};

	export function renderAscii(text: string): string | null {
		const letters = [...text.toUpperCase()];
		if (!letters.every((ch) => ch in GLYPHS)) return null;
		return Array.from({ length: 6 }, (_, row) =>
			letters.map((ch) => GLYPHS[ch][row]).join('')
		).join('\n');
	}
</script>

<script lang="ts">
	let { text }: { text: string } = $props();
	const art = $derived(renderAscii(text));
</script>

{#if art}
	<pre class="ascii" aria-hidden="true">{art}</pre>
{:else}
	<p class="ascii-fallback" aria-hidden="true">{text}</p>
{/if}

<style>
	.ascii {
		margin: 0;
		font-family: var(--font-mono);
		/* 56 columns × ~0.6em per column must fit the viewport minus the 16px gutters. */
		font-size: clamp(5px, calc((100vw - 2rem) / 36), 15px);
		line-height: 1.05;
		color: var(--color-fg);
		text-shadow:
			-1px 0 rgb(255 70 70 / 0.45),
			1px 0 rgb(70 200 255 / 0.45);
		animation: glitch 7s steps(1) infinite;
		overflow: hidden;
	}

	.ascii-fallback {
		font-size: clamp(2rem, 9vw, 4.5rem);
		font-weight: 800;
		letter-spacing: 0.08em;
	}

	@keyframes glitch {
		0%,
		91%,
		100% {
			transform: none;
			clip-path: none;
		}
		92% {
			transform: translateX(3px) skewX(-6deg);
			text-shadow:
				-3px 0 rgb(255 70 70 / 0.75),
				3px 0 rgb(70 200 255 / 0.75);
		}
		94% {
			transform: translateX(-2px);
			clip-path: inset(18% 0 42% 0);
		}
		96% {
			transform: translateX(1px);
			clip-path: inset(60% 0 8% 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ascii {
			animation: none;
		}
	}
</style>
