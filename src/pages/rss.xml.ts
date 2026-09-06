import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../data/site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: `${site.name} — Blogs`,
    description: site.description,
    site: context.site ?? 'https://akshataggarwal.is-a.dev',
    items: posts
      .filter((post) => !post.data.sample)
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/blogs/${post.id}/`,
        categories: [post.data.category, ...post.data.tags],
      })),
  });
}
