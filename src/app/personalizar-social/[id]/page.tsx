"use client";

import type React from "react";
import { ModalNewMediaSocial } from "@/components/modal/new-media-social";
import { ModalNewLinkBio } from "@/components/modal/new-link-bio";
import { ProgressBar } from "@/components/progressBar";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Loader, Modal } from "rizzui";
import { api } from "@/service/api";
import { FaTrashArrowUp } from "react-icons/fa6";
import { set } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { routes } from "@/config/route";

type Params = { id: string };

type UnifiedItem = {
  id: string;
  type: "social" | "link";
  providerName: string;
  url: string;
  orderId: string;
  sequence: number;
};

// heurística pra deduzir provider caso não venha no JSON
function guessProviderName(rawUrl: string): string {
  try {
    if (rawUrl.startsWith("mailto:")) return "Email";
    const url = rawUrl.startsWith("http")
      ? new URL(rawUrl)
      : new URL(`https://${rawUrl}`);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host.includes("instagram.com")) return "Instagram";
    if (host.includes("facebook.com")) return "Facebook";
    if (host === "x.com" || host.includes("twitter.com")) return "X";
    if (host.includes("wa.me") || host.includes("whatsapp.com"))
      return "WhatsApp";
    if (host.includes("youtube.com") || host === "youtu.be") return "YouTube";
    if (host.includes("linkedin.com")) return "LinkedIn";
    return host || "Link";
  } catch {
    return "Link";
  }
}

function arrayMove<T>(arr: T[], from: number, to: number) {
  const copy = [...arr];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
}

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function Page({ params }: { params: Params }) {
  const [loadingEmail, setLoadingEmail] = useState(false);
  const router = useRouter();
  const [handleModalIsOpen, setHandleModalIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenLinkBio, setModalIsOpenLinkBio] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<UnifiedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const dragFromIndex = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  const prevItemsRef = useRef<UnifiedItem[]>([]);

  const handleIsOpenModalAddNewSocialMedia = useCallback(() => {
    setModalIsOpen((prev) => !prev);
  }, []);

  const handleIsOpenModalAddNewLinkBio = useCallback(() => {
    setModalIsOpenLinkBio((prev) => !prev);
  }, []);

  const getDataApi = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/user/${params.id}`);

      setUser(response.data);

      const orderItems: UnifiedItem[] =
        response.data.order?.map((item: any) => {
          const isSocial = !!item.socialMedia;
          return {
            id: isSocial ? item.socialMedia.id : item.link.id,
            type: isSocial ? "social" : "link",
            providerName: isSocial
              ? item.socialMedia.providerName ??
                guessProviderName(item.socialMedia.url)
              : item.link.name ?? guessProviderName(item.link.url),
            url: isSocial ? item.socialMedia.url : item.link.url,
            sequence: item.sequence,
            orderId: item.id,
          };
        }) ?? [];

      const sortedItems = orderItems.sort((a, b) => a.sequence - b.sequence);
      setItems(sortedItems);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    getDataApi();
  }, [getDataApi]);

  const handleDelete = useCallback(
    async (item: UnifiedItem) => {
      try {
        if (item.type === "social") {
          await api.delete(`/social-media/${item.id}`);
        } else {
          await api.delete(`/links/${item.id}`);
        }
        await getDataApi();
      } catch (e) {
        console.error("Erro ao excluir:", e);
      }
    },
    [getDataApi]
  );

  const submitOrder = useCallback(
    async (order: UnifiedItem[]) => {
      const payload = order.map((it, idx) => ({
        id: it.orderId,
        sequence: idx + 1,
      }));
      await api.post(`/order/${params.id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
    },
    [params.id]
  );

  const onDragStart = (index: number) => (e: React.DragEvent) => {
    dragFromIndex.current = index;
    isDraggingRef.current = true;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(items[index].id));
  };

  const onDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (toIndex: number) => async (e: React.DragEvent) => {
    e.preventDefault();
    const fromIndex = dragFromIndex.current;
    dragFromIndex.current = null;

    if (fromIndex === null || fromIndex === toIndex) {
      isDraggingRef.current = false;
      return;
    }

    const previous = items;
    const next = arrayMove(items, fromIndex, toIndex);

    setItems(next);

    try {
      await submitOrder(next);
    } catch (err) {
      console.error("Falha ao salvar ordem, fazendo rollback:", err);
      setItems(previous);
    } finally {
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 0);
    }
  };

  const onDragEnd = () => {
    dragFromIndex.current = null;
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 0);
  };

  const guardLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleModalSendConfirmationEmail = useCallback(async () => {
    setLoadingEmail(true);
    if (!user) return;

    const response = await api.post("/users/email", {
      id: user.id,
    });

    toast.success("E-mail de confirmação enviado!");

    router.push(routes.customTheme(user.id, user.username));

    setLoadingEmail(false);

    setHandleModalIsOpen(false);
  }, [user, router]);

  return (
    <div>
      <header className="flex flex-col items-center justify-center">
        <header className="mt-20">
          <div>
            <img
              src="../../../img/assets/agro.page.white.png"
              alt="Logo"
              className="h-8 object-cover"
            />
          </div>
        </header>
      </header>

      <div className="container mx-auto md:max-w-4xl max-w-full">
        {/* <ProgressBar /> */}

        <div className="mt-10 flex flex-between items-center justify-between">
          <Button
            color="secondary"
            onClick={handleIsOpenModalAddNewSocialMedia}
          >
            Adicionar redes sociais
          </Button>
          <Button onClick={handleIsOpenModalAddNewLinkBio} color="secondary">
            Adicionar links
          </Button>
        </div>

        {loading ? (
          <div className="mt-10 flex justify-center">
            <Loader size="lg" color="success" />
          </div>
        ) : (
          <div className="mt-10 space-y-3 max-h-96 overflow-y-auto scrollbar-none">
            {items.map((item, index) => {
              const deleteLabel =
                item.type === "social" ? "Excluir rede social" : "Excluir link";

              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                  onClick={guardLinkClick}
                >
                  <div
                    className="flex items-center justify-between p-3 rounded-lg border border-green-700 hover:bg-green-900 transition-colors cursor-move"
                    draggable
                    onDragStart={onDragStart(index)}
                    onDragOver={onDragOver(index)}
                    onDrop={onDrop(index)}
                    onDragEnd={onDragEnd}
                    title="Arraste para reordenar"
                  >
                    <div className="flex flex-col">
                      <span className="font-normal text-white text-sm">
                        {item.providerName}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="text"
                      color="primary"
                      aria-label={deleteLabel}
                      className="text-white hover:text-green-600"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(item);
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <FaTrashArrowUp size={16} />
                    </Button>
                  </div>
                </a>
              );
            })}
          </div>
        )}
        <div className="mt-10 flex justify-end">
          <Button
            onClick={() => setHandleModalIsOpen((prev) => !prev)}
            color="secondary"
            className="w-28"
          >
            Avançar
          </Button>
        </div>
      </div>

      <ModalNewMediaSocial
        handleModalIsOpen={handleIsOpenModalAddNewSocialMedia}
        isOpen={modalIsOpen}
        userId={params.id}
        getDataApi={getDataApi}
      />

      <ModalNewLinkBio
        handleModalIsOpen={handleIsOpenModalAddNewLinkBio}
        isOpen={modalIsOpenLinkBio}
        userId={params.id}
        getDataApi={getDataApi}
      />

      <Modal
        isOpen={handleModalIsOpen}
        overlayClassName="backdrop-blur"
        containerClassName=" rounded-lg max-w-lg"
        onClose={() => setHandleModalIsOpen(false)}
      >
        <div className="m-auto px-2 pt-4 pb-8 w-full">
          <div className="flex justify-end w-full items-end">
            <button
              onClick={() => setHandleModalIsOpen(false)}
              className="bg-[#dbd9d9]  rounded hover:bg-[#c5c5c5] text-black"
            >
              <IoMdClose size={19} />
            </button>
          </div>
          <div className="flex justify-center">
            <h2 className="text-lg font-semibold">Olá, {user?.name}!</h2>
          </div>
          <p className="mt-4  text-sm text-justify">
            Enviamos um e-mail para <strong>{user?.email}</strong> na sua caixa
            de entrada. Abra esse e-mail e confirme seu endereço para liberar o
            acesso à nossa plataforma. Somente após a confirmação você poderá
            aproveitar todos os benefícios que a Agro.page oferece!
          </p>

          <Button
            isLoading={loadingEmail}
            color="secondary"
            onClick={() => handleModalSendConfirmationEmail()}
            className="mt-4 w-full"
          >
            Enviar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
