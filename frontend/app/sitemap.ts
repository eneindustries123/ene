import type { MetadataRoute } from 'next';
import { getPublishedProjects } from '@/lib/projects-store';
import { getBlogSitemapEntries } from '@/lib/sanity/data';
import { absoluteSiteUrl } from '@/lib/site';

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '/', changeFrequency: 'monthly', priority: 1 },
  { path: '/about', changeFrequency: 'yearly', priority: 0.7 },
  { path: '/company-profile', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/solar-energy', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/trading-contracting', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/fabrication-design', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/solar-bill-analyzer', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/projects', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/products', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/blogs', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/request-a-quote', changeFrequency: 'yearly', priority: 0.7 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms-and-conditions', changeFrequency: 'yearly', priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteSiteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [projectsResult, blogsResult] = await Promise.allSettled([
    getPublishedProjects(),
    getBlogSitemapEntries(),
  ]);

  const projectEntries: MetadataRoute.Sitemap =
    projectsResult.status === 'fulfilled'
      ? projectsResult.value
          .filter((project) => typeof project.slug === 'string' && project.slug.length > 0)
          .map((project) => ({
            url: absoluteSiteUrl(`/projects/${project.slug}`),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
          }))
      : [];

  if (projectsResult.status === 'rejected') {
    console.error('Dynamic project URLs could not be added to the sitemap.', projectsResult.reason);
  }

  const blogEntries: MetadataRoute.Sitemap =
    blogsResult.status === 'fulfilled' && Array.isArray(blogsResult.value)
      ? blogsResult.value
          .filter((post) => post.slug && post._updatedAt)
          .map((post) => ({
            url: absoluteSiteUrl(`/blogs/${post.slug}`),
            lastModified: new Date(post._updatedAt),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          }))
      : [];

  if (blogsResult.status === 'rejected') {
    console.error('Published blog URLs could not be added to the sitemap.', blogsResult.reason);
  }

  return [...staticEntries, ...projectEntries, ...blogEntries];
}

