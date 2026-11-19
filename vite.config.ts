import { escapeSvelte, mdsvex, type MdsvexOptions } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import { createHighlighter } from 'shiki';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import staticAdapter from '@sveltejs/adapter-static';
import vercelAdapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';

// Pages are prerendered either way. On Vercel, adapter-vercel serves them and renders the
// custom 404 for unknown routes. It can't build on Windows without Developer Mode (it
// symlinks node_modules), so local builds use adapter-static instead.
const adapter = process.env.VERCEL ? vercelAdapter() : staticAdapter({ fallback: '404.html' });

// Blog code blocks are highlighted at build time, so posts ship no highlighting JavaScript.
// Both themes are emitted as CSS variables; layout.css picks one to match the site theme.
// Add a language here before using it in a post; anything else renders as plain text.
const languages = ['python', 'sql', 'bash', 'typescript', 'json', 'yaml'];
const highlighter = await createHighlighter({
	themes: ['github-light-default', 'github-dark-default'],
	langs: languages
});

const markdown = mdsvex({
	extensions: ['.svx', '.md'],
	highlight: {
		highlighter(code, lang) {
			const html = highlighter.codeToHtml(code, {
				lang: lang && languages.includes(lang) ? lang : 'text',
				themes: { light: 'github-light-default', dark: 'github-dark-default' },
				defaultColor: false
			});
			return `{@html \`${escapeSvelte(html)}\`}`;
		}
	},
	// mdsvex is typed against an older unified; the current rehype plugins work fine at runtime.
	rehypePlugins: [
		rehypeSlug,
		[rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: ['anchor'] } }]
	] as unknown as MdsvexOptions['rehypePlugins']
});

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
				// mdsvex still writes `<script context="module">` for a post's frontmatter.
				warningFilter: (w) =>
					!(w.code === 'script_context_deprecated' && w.filename?.endsWith('.md'))
			},
			adapter,
			preprocess: [markdown],
			extensions: ['.svelte', '.svx', '.md']
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
