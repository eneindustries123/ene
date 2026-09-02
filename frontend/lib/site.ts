const DEFAULT_SITE_URL = 'https://eneindustries.com';

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  return configuredUrl.replace(/\/$/, '');
}

export function absoluteSiteUrl(pathname: string): string {
  return new URL(pathname, `${getSiteUrl()}/`).toString();
}

