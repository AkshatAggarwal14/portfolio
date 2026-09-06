import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const projects = await getCollection('projects');
const pages = Object.fromEntries(projects.map((project) => [project.id, { title: project.data.title, description: project.data.description }]));

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
