// "ANSI Shadow" figlet glyphs. Each glyph is 6 rows of equal width.
// Add letters here if the name changes (generate with: figlet -f "ANSI Shadow" X).
// Plain TS (no Svelte) so scripts/og-image.ts can import it too.
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
	return Array.from({ length: 6 }, (_, row) => letters.map((ch) => GLYPHS[ch][row]).join('')).join(
		'\n'
	);
}
