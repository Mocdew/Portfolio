// Small pieces of shared UI state: the toast message, whether the command palette is open,
// and the colour theme.

let message = $state<{ text: string; ok: boolean } | null>(null);
let timer: ReturnType<typeof setTimeout> | undefined;

export const toast = {
	get message() {
		return message;
	},
	show(text: string, ok = true) {
		message = { text, ok };
		clearTimeout(timer);
		timer = setTimeout(() => (message = null), 2400);
	}
};

export const palette = $state({ open: false });

/** Copies text and confirms with a toast; falls back to showing the text if copying is blocked. */
export async function copy(text: string, what: string) {
	try {
		await navigator.clipboard.writeText(text);
		toast.show(`${what} copied`);
	} catch {
		toast.show(`Couldn't copy — ${text}`, false);
	}
}

export type ThemeChoice = 'light' | 'dark' | 'system';

const THEME_KEY = 'theme';
const systemLight = () => matchMedia('(prefers-color-scheme: light)').matches;

/** The visitor's choice. Following the OS is the default; app.html applies it before first paint. */
export const theme = $state({ choice: 'system' as ThemeChoice });

function apply() {
	const light = theme.choice === 'light' || (theme.choice === 'system' && systemLight());
	if (light) document.documentElement.setAttribute('data-theme', 'light');
	else document.documentElement.removeAttribute('data-theme');
	document
		.querySelector('meta[name="theme-color"]')
		?.setAttribute('content', light ? '#f6f6f3' : '#050404');
}

export function setTheme(choice: ThemeChoice) {
	theme.choice = choice;
	try {
		if (choice === 'system') localStorage.removeItem(THEME_KEY);
		else localStorage.setItem(THEME_KEY, choice);
	} catch {
		// Storage blocked: the choice still applies for this visit.
	}
	apply();
}

/** Reads the saved choice and keeps "system" in step with the OS. Call once from onMount. */
export function watchTheme() {
	try {
		const saved = localStorage.getItem(THEME_KEY);
		if (saved === 'light' || saved === 'dark') theme.choice = saved;
	} catch {
		// Storage blocked: stay on the default.
	}
	apply();
	const mq = matchMedia('(prefers-color-scheme: light)');
	const onChange = () => theme.choice === 'system' && apply();
	mq.addEventListener('change', onChange);
	return () => mq.removeEventListener('change', onChange);
}
