function requirePublicEnvironmentVariable(name: string, value: string | undefined): string {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(
      `[Sanity configuration] Missing ${name}. Add it to the frontend environment before building or starting the website.`
    );
  }

  return normalizedValue;
}

export const sanityConfig = {
  projectId: requirePublicEnvironmentVariable(
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  ),
  dataset: requirePublicEnvironmentVariable(
    'NEXT_PUBLIC_SANITY_DATASET',
    process.env.NEXT_PUBLIC_SANITY_DATASET
  ),
  apiVersion: requirePublicEnvironmentVariable(
    'NEXT_PUBLIC_SANITY_API_VERSION',
    process.env.NEXT_PUBLIC_SANITY_API_VERSION
  ),
};
