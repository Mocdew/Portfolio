import { dev } from '$app/environment';
import type { Post, PostMeta } from '$lib/blog';

const WORDS_PER_MINUTE = 220;

/** Reading time from the raw Markdown, ignoring frontmatter, code fences and markup. */
export function readingMinutes(source: string): number {
	const text = source
		.replace(/^---[\s\S]*?\n---/, '')
		.replace(/```[\s\S]*?```/g, '')
		.replace(/<[^>]+>/g, '')
		.replace(/[#>*_`[\]()-]/g, ' ');
	const words = text.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Checks one post's frontmatter so a typo fails the build instead of shipping a broken page. */
function validate(slug: string, meta: Partial<PostMeta> | undefined): PostMeta {
	const fail = (problem: string): never => {
		throw new Error(`src/content/blog/${slug}.md: ${problem}`);
	};
	if (!meta) return fail('missing frontmatter');
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
		fail('file name must be lowercase words joined by hyphens');
	if (typeof meta.title !== 'string' || !meta.title.trim()) fail('missing title');
	if (typeof meta.description !== 'string' || !meta.description.trim()) fail('missing description');
	// YAML turns an unquoted date into a Date, which mdsvex then writes out as an ISO string.
	const date = new Date(meta.date ?? '');
	if (Number.isNaN(date.getTime())) fail(`date "${meta.date}" is not a valid YYYY-MM-DD date`);
	if (!Array.isArray(meta.tags) || meta.tags.some((t) => typeof t !== 'string'))
		fail('tags must be a list, e.g. [python, forecasting]');
	// Social sites don't all read WebP, so preview images must be PNG or JPG.
	if (meta.image !== undefined && !/^\/[\w/.-]+\.(png|jpe?g)$/.test(String(meta.image)))
		fail('image must be a .png or .jpg path under static/, starting with /');
	if (meta.image && (typeof meta.imageAlt !== 'string' || !meta.imageAlt.trim()))
		fail('imageAlt is required when image is set');
	return {
		title: meta.title!.trim(),
		description: meta.description!.trim(),
		date: date.toISOString().slice(0, 10),
		tags: meta.tags!.map((t) => t.toLowerCase()),
		draft: meta.draft === true,
		...(meta.image && { image: meta.image, imageAlt: meta.imageAlt!.trim() })
	};
}

/** Builds the post list from the Markdown modules, newest first. Exported for the unit tests. */
export function collectPosts(
	modules: Record<string, Partial<PostMeta> | undefined>,
	sources: Record<string, string>,
	{ includeDrafts = false } = {}
): Post[] {
	return Object.entries(modules)
		.map(([path, meta]) => {
			const slug = path.split('/').pop()!.replace(/\.md$/, '');
			return { ...validate(slug, meta), slug, minutes: readingMinutes(sources[path] ?? '') };
		})
		.filter((post) => includeDrafts || !post.draft)
		.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

// Only the frontmatter and raw text are loaded here; each post's rendered body is imported on
// its own page, so the list pages don't carry every post.
const modules = import.meta.glob<PostMeta>('/src/content/blog/*.md', {
	eager: true,
	import: 'metadata'
});
const sources = import.meta.glob<string>('/src/content/blog/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});

export const posts: Post[] = collectPosts(modules, sources, { includeDrafts: dev });
