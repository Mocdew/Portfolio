import type { Component } from 'svelte';

// Each post's rendered body is a separate chunk, loaded only on its own page.
const bodies = import.meta.glob<Component>('/src/content/blog/*.md', { import: 'default' });

export const load = async ({ data }) => {
	const body = await bodies[`/src/content/blog/${data.post.slug}.md`]();
	return { ...data, body };
};
