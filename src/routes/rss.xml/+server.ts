import { site } from '$lib/data/site';
import { posts } from '$lib/server/posts';

export const prerender = true;

const escape = (text: string) =>
	text.replace(
		/[<>&'"]/g,
		(c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!
	);

export const GET = () => {
	const blog = new URL('/blog', site.url).href;
	const items = posts
		.map((post) => {
			const url = new URL(`/blog/${post.slug}`, site.url).href;
			return `
		<item>
			<title>${escape(post.title)}</title>
			<link>${url}</link>
			<guid isPermaLink="true">${url}</guid>
			<description>${escape(post.description)}</description>
			<pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
			${post.tags.map((t) => `<category>${escape(t)}</category>`).join('')}
		</item>`;
		})
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${escape(site.name)}: Blog</title>
		<link>${blog}</link>
		<description>${escape(site.description)}</description>
		<language>en</language>
		<atom:link href="${new URL('/rss.xml', site.url).href}" rel="self" type="application/rss+xml" />${items}
	</channel>
</rss>
`;
	return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
