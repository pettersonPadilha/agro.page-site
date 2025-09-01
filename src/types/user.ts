export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: string;
  role: string;
  bioUrl: string;
  createdAt: string;
  updatedAt: string;
  theme: Theme;
  order: Order[];
}

interface Order {
  id: string;
  userId: string;
  socialMediaId: string | null;
  linkId: string | null;
  sequence: number;
  createdAt: string;
  updatedAt: string;
  link: LinkItem | null;
  socialMedia: SocialMedia | null;
}

interface LinkItem {
  id: string;
  userId: string;
  name: string;
  url: string;
  createdAt: string;
}

interface SocialMedia {
  id: string;
  providerName: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  username?: string;
}

interface Theme {
  id: string;
  backgroundColor: string;
  textColor: string;
  createdAt: string;
  updatedAt: string;
}
