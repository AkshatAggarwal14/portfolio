import { generateOpenGraphImage } from 'astro-og-canvas';
import { site } from '../data/site';

export async function GET() {
  const image = await generateOpenGraphImage({
    title: site.name,
    description: site.description,
    bgGradient: [[23, 24, 30]],
    border: { color: [64, 66, 80], width: 8 },
    padding: 80,
  });
  return new Response(image, { headers: { 'Content-Type': 'image/png' } });
}
