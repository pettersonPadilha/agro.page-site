export const routes = {
  register: (slug: string) => `/cadastro/${slug}`,
  customAvatar: (id: string) => `/personalizar-avatar/${id}`,
  customSocial: (id: string) => `/personalizar-social/${id}`,
  customTheme: (id: string, username: string) => `/personalizar-tema/${id}`,
  bio: (username: string) => `/${username}`,
};
