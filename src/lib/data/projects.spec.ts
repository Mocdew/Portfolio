import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { renderAscii } from '$lib/ascii';
import { projects } from './projects';
import { site } from './site';

describe('projects', () => {
	it('has unique slugs, since they are used as page anchors', () => {
		const slugs = projects.map((p) => p.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it('only links to absolute https URLs', () => {
		for (const project of projects) {
			for (const href of Object.values(project.links)) {
				expect(new URL(href!).protocol, `${project.slug}: ${href}`).toBe('https:');
			}
		}
	});

	it('has a route for every project marked as a case study', () => {
		for (const p of projects.filter((p) => p.caseStudy)) {
			expect(existsSync(`src/routes/projects/${p.slug}/+page.svelte`), p.slug).toBe(true);
		}
	});

	it('fills in every text field', () => {
		for (const p of projects) {
			expect(p.title && p.hook && p.description && p.language, p.slug).toBeTruthy();
			expect(p.tags.length, p.slug).toBeGreaterThan(0);
		}
	});
});

describe('renderAscii', () => {
	it('renders the site name as six rows of equal width', () => {
		const art = renderAscii(site.asciiName);
		expect(art).not.toBeNull();
		const rows = art!.split('\n');
		expect(rows).toHaveLength(6);
		expect(new Set(rows.map((r) => [...r].length)).size).toBe(1);
	});

	it('returns null for letters without a glyph', () => {
		expect(renderAscii('XYZ')).toBeNull();
	});
});
