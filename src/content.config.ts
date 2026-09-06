import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({ title: z.string(), description: z.string(), date: z.coerce.date(), category: z.string(), readTime: z.string(), sample: z.boolean().default(false), mediumUrl: z.url().optional() }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    repo: z.string(),
    url: z.string(),
    language: z.string().optional(),
    stars: z.number().optional(),
    demo: z.string().optional(),
    stack: z.array(z.string()).default([]),
    images: z.array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() })).optional(),
    order: z.number().default(99),
  }),
});
export const collections = { posts, projects };
