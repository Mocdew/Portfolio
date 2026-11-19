import { error } from '@sveltejs/kit';
import { posts } from '$lib/server/posts';

// Prerender every post, even one nothing links to yet.
export const entries = () => posts.map(({ slug }) => ({ slug }));

export const load = ({ params }) => {
	const i = posts.findIndex((p) => p.slug === params.slug);
	if (i === -1) error(404, 'Post not found');
	// The list is newest first, so the next-newer post sits one place earlier.
	return { post: posts[i], newer: posts[i - 1] ?? null, older: posts[i + 1] ?? null };
};
