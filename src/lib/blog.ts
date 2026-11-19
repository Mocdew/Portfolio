// Shared by the blog pages and the server-side post loader in $lib/server/posts.ts.

/** Frontmatter at the top of every file in src/content/blog. */
export type PostMeta = {
	title: string;
	/** One or two sentences, shown in the post list and used as the social preview text. */
	description: string;
	/** Publication date, YYYY-MM-DD. */
	date: string;
	tags: string[];
	/** Drafts show up in `pnpm dev` but are left out of the build. */
	draft?: boolean;
	/** Link-preview image for LinkedIn, X etc.: a 1200×630 PNG or JPG under /static, e.g.
	 * /blog/<slug>/preview.png. Without one, the site-wide /og.png is used. */
	image?: string;
	/** Describes `image` for screen readers. Required when `image` is set. */
	imageAlt?: string;
};

export type Post = PostMeta & {
	/** The file name without `.md`, used as the URL: /blog/<slug>. */
	slug: string;
	/** Estimated reading time in whole minutes. */
	minutes: number;
};

export const formatDate = (date: string) =>
	new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC'
	});
