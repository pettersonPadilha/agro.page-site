import { isLightTheme } from "@/utils/isLightTheme";
import Link from "next/link";
import { IoMdMenu } from "react-icons/io";
import { Avatar, Button } from "rizzui";
import { SharedBio } from "../modal/shared-bio";
import { useCallback, useState } from "react";

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: string;
  role: string;
  createdAt: string;
  bioUrl: string;
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

interface Props {
  user: User | null;
}

type NormalizedItem = {
  id: string;
  label: string;
  url: string;
  sequence: number;
};

function normalizeOrder(order: Order[] | undefined): NormalizedItem[] {
  if (!order?.length) return [];
  return order
    .map<NormalizedItem | null>((item) => {
      if (item.socialMedia) {
        return {
          id: item.id,
          label: item.socialMedia.providerName,
          url: item.socialMedia.url,
          sequence: item.sequence,
        };
      }
      if (item.link) {
        return {
          id: item.id,
          label: item.link.name,
          url: item.link.url,
          sequence: item.sequence,
        };
      }
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => a!.sequence - b!.sequence) as NormalizedItem[];
}

export function UserBio({ user }: Props) {
  const [isModalShareBioOpen, setIsModalShareBioOpen] =
    useState<boolean>(false);

  const handleModalShareBioIsOpen = useCallback(() => {
    setIsModalShareBioOpen((state) => !state);
  }, []);

  if (!user) return null;

  const { theme } = user;
  const isLight = isLightTheme(theme.backgroundColor);

  const logo = isLight
    ? "https://storage.agro.page/logos/Isotipo%20-%20Preto.png"
    : "https://storage.agro.page/logos/Isotipo%20-%20agro.png";

  const items = normalizeOrder(user.order);

  return (
    <body
      className="h-screen flex pb-16 font-poppins"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="relative pt-14">
        <div id="background-img" className="absolute blur-3xl z-0 opacity-95" />
      </div>

      <div className="container mx-auto pt-8 md:max-w-2xl max-w-full">
        {/* header */}
        <header className="px-4 md:px-0 flex justify-between items-center">
          <Link href="/">
            <img src={logo} className="h-12 object-cover" alt="Logo" />
          </Link>
          <button
            onClick={() => handleModalShareBioIsOpen()}
            className="text-white bg-[#383838] p-1 rounded-md hover:brightness-90 transition"
          >
            <IoMdMenu size={20} />
          </button>
        </header>

        {/* main */}
        <main className="flex justify-center mt-20 px-4 md:px-0 w-full">
          <div className="flex flex-col items-center gap-4 w-full">
            <Avatar
              src={user.avatarUrl}
              name={user.name}
              customSize={90}
              className="text-2xl"
            />

            <p style={{ color: theme.textColor }}>{user.name}</p>

            <div className="flex flex-col items-center w-9/12 md:w-6/12 space-y-4 overflow-y-auto scrollbar-none  max-h-72">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <div
                    className="w-full rounded-md px-4 py-3 border hover:opacity-90 transition"
                    style={{
                      borderColor: isLight
                        ? "#e5e7eb"
                        : "rgba(255,255,255,0.15)",
                      background: isLight
                        ? "#ffffff"
                        : "rgba(255,255,255,0.06)",
                    }}
                  >
                    <p
                      className="truncate text-center"
                      style={{ color: theme.textColor }}
                      title={item.url}
                    >
                      {item.label}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-white mt-4 w-6/12">
              <div className="flex justify-center items-center gap-2">
                <img src={logo} alt="" className="h-6" />
                <Link
                  href="/inicio"
                  className="hover:text-orange-500"
                  target="_blank"
                >
                  <p>Associe ao agro.page</p>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      <SharedBio
        bioUrl={user.bioUrl}
        handleModalIsOpen={handleModalShareBioIsOpen}
        isOpen={isModalShareBioOpen}
      />
    </body>
  );
}
