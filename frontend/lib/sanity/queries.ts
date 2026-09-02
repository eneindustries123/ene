import { defineQuery } from 'groq';

const PUBLIC_BLOG_FILTER = /* groq */ `
  _type == "blogPost" &&
  !(_id in path("drafts.**")) &&
  defined(slug.current) &&
  defined(publishedAt) &&
  publishedAt <= now()
`;

const IMAGE_FIELDS = /* groq */ `
  asset->{
    _id,
    url,
    metadata{
      lqip,
      dimensions{
        width,
        height,
        aspectRatio
      }
    }
  },
  alt,
  caption,
  crop,
  hotspot
`;

const AUTHOR_FIELDS = /* groq */ `
  name,
  "slug": slug.current,
  role,
  bio,
  linkedin,
  avatar{
    ${IMAGE_FIELDS}
  }
`;

const CATEGORY_FIELDS = /* groq */ `
  title,
  "slug": slug.current,
  description
`;

export const BLOG_LIST_QUERY = defineQuery(/* groq */ `
  *[${PUBLIC_BLOG_FILTER}]
  | order(publishedAt desc, _id asc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    featuredImage{
      ${IMAGE_FIELDS}
    },
    author->{
      ${AUTHOR_FIELDS}
    },
    category->{
      ${CATEGORY_FIELDS}
    },
    tags,
    publishedAt,
    isFeatured,
    seoTitle,
    seoDescription,
    noIndex,
    "readingText": pt::text(body)
  }
`);

export const BLOG_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[${PUBLIC_BLOG_FILTER} && slug.current == $slug][0]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    excerpt,
    author->{
      ${AUTHOR_FIELDS}
    },
    category->{
      ${CATEGORY_FIELDS}
    },
    tags,
    body[]{
      ...,
      _type == "articleImage" => {
        ${IMAGE_FIELDS}
      },
      _type == "table" => {
        _key,
        _type,
        headers,
        rows[]{
          _key,
          cells
        }
      }
    },
    featuredImage{
      ${IMAGE_FIELDS}
    },
    ogImage{
      ${IMAGE_FIELDS}
    },
    seoTitle,
    seoDescription,
    canonicalUrl,
    noIndex,
    publishedAt,
    isFeatured
  }
`);

export const BLOG_SITEMAP_QUERY = defineQuery(/* groq */ `
  *[${PUBLIC_BLOG_FILTER} && noIndex != true]
  | order(publishedAt desc){
    "slug": slug.current,
    _updatedAt
  }
`);
