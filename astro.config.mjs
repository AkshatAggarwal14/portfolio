import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkGfm from 'remark-gfm';

export default defineConfig({
  site: process.env.SITE_URL || 'https://akshataggarwal.is-a.dev',
  output: 'static',
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'dracula' }, defaultColor: false }, processor: unified({ remarkPlugins: [remarkGfm] }) },
});
