export const POST_CONFIG = {
  title: 'POST_TITLE',
  description: 'POST_DESCRIPTION',
  urlSlug: 'POST_URL_SLUG',
  date: 'POST_DATE',
  author: 'michael giba',
  siteName: "michael giba's blog",
} as const;

export const PROJECT_COLORS = {
  textColor: '#333',
  headingColor: '#111',
  linkColor: '#367588',
  linkHoverColor: '#2a5a6a',
  subtleTextColor: '#666',
  codeBgColor: '#f0f0f0',
  primaryVizColor: '#367588',
  secondaryVizColor: '#5F9EA0',
} as const;

export const getFullTitle = () =>
  `${POST_CONFIG.title} - ${POST_CONFIG.siteName}`;
export const getPageTitle = () => POST_CONFIG.title;
export const getMetaDescription = () => POST_CONFIG.description;
export const getCanonicalUrl = () =>
  `https://michaelgiba.com/${POST_CONFIG.urlSlug}`;
