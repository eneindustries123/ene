import { BLOG_BY_SLUG_QUERY, BLOG_LIST_QUERY, BLOG_SITEMAP_QUERY } from './queries';
import { BLOG_QUERY_TAG, sanityFetch } from './client';
import type { BlogPost, BlogPostCard, BlogSitemapEntry } from './types';

export function getBlogPosts(): Promise<BlogPostCard[]> {
  return sanityFetch<BlogPostCard[]>({
    query: BLOG_LIST_QUERY,
    tags: [BLOG_QUERY_TAG, 'sanity:blog:list'],
  });
}

export function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return sanityFetch<BlogPost | null>({
    query: BLOG_BY_SLUG_QUERY,
    params: { slug },
    tags: [BLOG_QUERY_TAG, `sanity:blog:${slug}`],
  });
}

export function getBlogSitemapEntries(): Promise<BlogSitemapEntry[]> {
  return sanityFetch<BlogSitemapEntry[]>({
    query: BLOG_SITEMAP_QUERY,
    tags: [BLOG_QUERY_TAG, 'sanity:blog:sitemap'],
  });
}

