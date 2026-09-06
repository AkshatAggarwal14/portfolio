import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const posts = await getCollection('posts');
const pages = Object.fromEntries(posts.map((post) => [post.id, { title: post.data.title, description: post.data.description }]));

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getSlug: (path) => path,
  getImageOptions: (_path, page) => ({
    title: (page as { title: string }).title,
    description: (page as { description?: string }).description,
    bgGradient: [[23, 24, 30]],
    border: { color: [64, 66, 80], width: 8 },
    padding: 80,
  }),
});
