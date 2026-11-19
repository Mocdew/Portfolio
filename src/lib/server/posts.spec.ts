import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { collectPosts, posts, readingMinutes } from './posts';

const meta = (overrides = {}) => ({
	title: 'A post',
	description: 'What it is about.',
	date: '2026-10-01',
	tags: ['Python'],
	...overrides
});

describe('collectPosts', () => {
	it('sorts newest first and takes the slug from the file name', () => {
		const list = collectPosts(
			{
				'/src/content/blog/older.md': meta({ date: '2026-01-01' }),
				'/src/content/blog/newer.md': meta({ date: '2026-02-01' })
			},
			{}
		);
		expect(list.map((p) => p.slug)).toEqual(['newer', 'older']);
	});

	it('leaves drafts out unless asked', () => {
		const modules = {
			'/src/content/blog/live.md': meta(),
			'/src/content/blog/wip.md': meta({ draft: true })
		};
		expect(collectPosts(modules, {}).map((p) => p.slug)).toEqual(['live']);
		expect(collectPosts(modules, {}, { includeDrafts: true })).toHaveLength(2);
	});

	it('normalises the ISO timestamp mdsvex writes for an unquoted YAML date', () => {
		const [post] = collectPosts(
			{ '/src/content/blog/a.md': meta({ date: '2026-10-01T00:00:00.000Z' }) },
			{}
		);
		expect(post.date).toBe('2026-10-01');
		expect(post.tags).toEqual(['python']);
	});

	it.each([
		['missing title', meta({ title: '' })],
		['missing description', meta({ description: undefined })],
		['not a valid', meta({ date: 'last week' })],
		['tags must be a list', meta({ tags: 'python' })]
	])('fails the build on bad frontmatter (%s)', (message, bad) => {
		expect(() => collectPosts({ '/src/content/blog/bad.md': bad }, {})).toThrow(message);
	});

	it('accepts a PNG or JPG preview image with alt text', () => {
		const [post] = collectPosts(
			{ '/src/content/blog/a.md': meta({ image: '/blog/a/preview.png', imageAlt: 'A chart' }) },
			{}
		);
		expect(post.image).toBe('/blog/a/preview.png');
		expect(post.imageAlt).toBe('A chart');
	});

	it.each([
		['must be a .png or .jpg', meta({ image: '/blog/a/preview.webp', imageAlt: 'A chart' })],
		['must be a .png or .jpg', meta({ image: 'blog/a/preview.png', imageAlt: 'A chart' })],
		['imageAlt is required', meta({ image: '/blog/a/preview.png' })]
	])('rejects a bad preview image (%s)', (message, bad) => {
		expect(() => collectPosts({ '/src/content/blog/bad.md': bad }, {})).toThrow(message);
	});

	it('rejects file names that would make awkward URLs', () => {
		expect(() => collectPosts({ '/src/content/blog/My Post.md': meta() }, {})).toThrow(
			'lowercase words'
		);
	});
});

describe('readingMinutes', () => {
	it('counts prose at about 220 words a minute, ignoring frontmatter and code', () => {
		const prose = Array(440).fill('word').join(' ');
		const code = '```python\n' + Array(1000).fill('x = 1').join('\n') + '\n```';
		expect(readingMinutes(`---\ntitle: t\n---\n${prose}\n${code}`)).toBe(2);
	});

	it('never says zero minutes', () => {
		expect(readingMinutes('Short.')).toBe(1);
	});
});

describe('published posts', () => {
	it('all have valid frontmatter and unique slugs', () => {
		expect(posts.length).toBeGreaterThan(0);
		expect(new Set(posts.map((p) => p.slug)).size).toBe(posts.length);
	});

	it('point at preview images that exist and are 1200×630', () => {
		for (const { slug, image } of posts.filter((p) => p.image)) {
			const file = `static${image}`;
			expect(existsSync(file), `${slug}: ${file}`).toBe(true);
			if (file.endsWith('.png')) {
				// A PNG stores its width and height as big-endian integers at bytes 16 and 20.
				const png = readFileSync(file);
				expect([png.readUInt32BE(16), png.readUInt32BE(20)], slug).toEqual([1200, 630]);
			}
		}
	});
});
