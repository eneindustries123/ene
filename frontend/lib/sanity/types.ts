import type { TypedObject } from '@portabletext/types';

export type SanityImageDimensions = {
  width?: number;
  height?: number;
  aspectRatio?: number;
};

export type SanityImageValue = {
  _key?: string;
  _type?: string;
  alt?: string;
  caption?: string;
  asset?: {
    _id?: string;
    _ref?: string;
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: SanityImageDimensions;
    };
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
};

export type BlogAuthor = {
  name: string;
  slug?: string;
  role?: string;
  bio?: string;
  linkedin?: string;
  avatar?: SanityImageValue;
};

export type BlogCategory = {
  title: string;
  slug?: string;
  description?: string;
};

export type BlogTableRow = {
  _key?: string;
  cells?: string[];
};

export type BlogTable = TypedObject & {
  _type: 'table';
  headers?: string[];
  rows?: BlogTableRow[];
};

export type BlogPostCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: SanityImageValue;
  author?: BlogAuthor;
  category?: BlogCategory;
  tags?: string[];
  publishedAt: string;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  noIndex?: boolean;
  readingText?: string;
};

export type BlogPost = Omit<BlogPostCard, 'readingText'> & {
  _updatedAt: string;
  body: TypedObject[];
  ogImage?: SanityImageValue;
  canonicalUrl?: string;
};

export type BlogSitemapEntry = {
  slug: string;
  _updatedAt: string;
};

