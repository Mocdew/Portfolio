import type { Action } from 'svelte/action';

/**
 * Fades a section up as it first scrolls into view. Progressive enhancement: it adds the hidden
 * state itself, so if the effect can't run (reduced motion, no IntersectionObserver, no JS) the
 * content simply stays visible. The classes live in layout.css. Actions run in the browser only.
 */
export const reveal: Action = (node) => {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
		return;
	}

	node.classList.add('reveal-init');
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				node.classList.add('reveal-in');
				io.unobserve(node);
			}
		},
		{ rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
	);
	io.observe(node);

	return {
		destroy() {
			io.disconnect();
		}
	};
};
