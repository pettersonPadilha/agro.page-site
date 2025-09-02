"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Loader, Modal, Empty, Switch } from "rizzui";
import { api } from "@/service/api";
import { FaTrashArrowUp } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { routes } from "@/config/route";
import { FormNewLinkBio } from "@/components/modal/new-link-bio/form";
import { FormNewMediaSocial } from "@/components/modal/new-media-social/form";

type Params = { id: string };

type UnifiedItem = {
  id: string;
  type: "social" | "link";
  providerName: string;
  url: string;
  orderId: string;
  sequence: number;
};

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
  const router = useRouter();
  const [handleModalIsOpen, setHandleModalIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<UnifiedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLinkActive, setIsLinkActive] = useState(false);

  const dragFromIndex = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

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

    // 🔥 Detecta se soltou na metade de cima ou baixo do item
    const bounding = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offset = e.clientY - bounding.top;
    let targetIndex = toIndex;

    if (offset < bounding.height / 2) {
      targetIndex = toIndex; // antes do item
    } else {
      targetIndex = toIndex + 1; // depois do item
    }

    const previous = items;
    const next = arrayMove(items, fromIndex, targetIndex);

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
        <div className="mt-10 flex justify-center items-center gap-2">
          <Button
            className=""
            onClick={() => setHandleModalIsOpen(true)}
            color="primary"
          >
            Adicionar
          </Button>

          <div>
            <Button
              onClick={() => router.push(routes.customTheme(params.id))}
              color="secondary"
              className="w-28"
            >
              Avançar
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 flex justify-center">
            <Loader size="lg" color="success" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex justify-center h-96 flex-col items-center">
            <Empty
              textClassName="mt-2 text-white text-center"
              alignment="center"
            />
            <p className="mt-2 text-white text-center text-sm">
              Clique em adicionar para incluir sua primeira rede social ou link!
            </p>
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
                      title={deleteLabel}
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
      </div>

      <Modal
        isOpen={handleModalIsOpen}
        overlayClassName="backdrop-blur"
        containerClassName="rounded-lg max-w-lg"
        onClose={() => setHandleModalIsOpen(false)}
      >
        <div className="m-auto px-2 pt-4 pb-8 w-full">
          <div className="flex justify-end w-full items-end">
            <button
              onClick={() => setHandleModalIsOpen(false)}
              className="bg-[#dbd9d9] rounded hover:bg-[#c5c5c5] text-black"
            >
              <IoMdClose size={19} />
            </button>
          </div>

          <div className="flex justify-center mb-4">
            <h2 className="text-lg font-semibold">Adicionar</h2>
          </div>

          <div className="flex items-center justify-center mb-6">
            <Switch
              variant="outline"
              label="Ative para adicionar links"
              size="sm"
              onChange={(e) => setIsLinkActive(e.target.checked)}
              checked={isLinkActive}
            />
          </div>

          <div>
            {isLinkActive ? (
              <FormNewLinkBio
                userId={params.id}
                getDataApi={getDataApi}
                handleModalIsOpen={setHandleModalIsOpen}
              />
            ) : (
              <FormNewMediaSocial
                userId={params.id}
                getDataApi={getDataApi}
                handleModalIsOpen={setHandleModalIsOpen}
              />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
