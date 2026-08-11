import { createClient } from 'next-sanity';
import { INITIAL_BLOG_POSTS, BlogPost } from '@/lib/data';

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'solix_sanity_demo' 
  ? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID 
  : 'solix-demo-id';
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2024-08-06';

export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion,
  useCdn: true,
});

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (sanityProjectId === 'solix-demo-id') {
    return INITIAL_BLOG_POSTS;
  }
  try {
    const posts = await sanityClient.fetch<BlogPost[]>(`
      *[_type == "post"] | order(publishedAt desc) {
        "id": _id,
        title,
        "slug": slug.current,
        excerpt,
        "publishDate": publishedAt,
        "featuredImage": mainImage.asset->url,
        "readTime": readTime,
        author->{
          name,
          role,
          "avatar": image.asset->url
        },
        "category": category->title
      }
    `);
    if (posts && posts.length > 0) return posts;
  } catch (error) {
    console.warn('Using Sanity fallback mock data layer:', error);
  }
  return INITIAL_BLOG_POSTS;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) || posts[0] || null;
}
