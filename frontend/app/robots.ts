import type { MetadataRoute } from 'next';
import { absoluteSiteUrl, getSiteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/project-admin/', '/api/'],
    },
    sitemap: absoluteSiteUrl('/sitemap.xml'),
    host: getSiteUrl(),
  };
}

