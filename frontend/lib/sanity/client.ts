import { createClient } from '@sanity/client';
import { sanityConfig } from './env';

export const BLOG_REVALIDATE_SECONDS = 300;
export const BLOG_QUERY_TAG = 'sanity:blog';

export const sanityClient = createClient({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  apiVersion: sanityConfig.apiVersion,
  perspective: 'published',
  useCdn: true,
});

type SanityFetchOptions = {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
  revalidate?: number | false;
};

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [BLOG_QUERY_TAG],
  revalidate = BLOG_REVALIDATE_SECONDS,
}: SanityFetchOptions): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    perspective: 'published',
    next: {
      revalidate,
      tags,
    },
  });
}
