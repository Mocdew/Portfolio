// Small pieces of shared UI state: the toast message and whether the command palette is open.

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
