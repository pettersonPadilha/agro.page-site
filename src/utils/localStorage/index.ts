export function createLocalStorageKey(username: string) {
  const key = process.env.NEXT_PUBLIC_AGROPAGE_SITE as string;

  const user = {
    username: username.toLowerCase(),
  };

  localStorage.setItem(key, JSON.stringify(user));
}
