import { posts } from '$lib/server/posts';

export const load = () => ({ latestPosts: posts.slice(0, 3), postCount: posts.length });
