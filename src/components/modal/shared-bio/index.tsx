"use client";

import { Button, Modal, Tooltip } from "rizzui";
import { IoMdClose } from "react-icons/io";
import { TbCopy } from "react-icons/tb";
import { CiWarning } from "react-icons/ci";
import Link from "next/link";
import { useCallback, useState } from "react";
import { IoCopy } from "react-icons/io5";
import toast from "react-hot-toast";

interface ModalProps {
  isOpen: boolean;
  handleModalIsOpen: (value: boolean) => void;
  bioUrl: string;
}

export const SharedBio: React.FC<ModalProps> = ({
  handleModalIsOpen,
  isOpen,
  bioUrl,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyBioLink = useCallback(() => {
    navigator.clipboard.writeText(bioUrl);

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [bioUrl]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => handleModalIsOpen(false)}
        overlayClassName="backdrop-blur"
        size="sm"
        containerClassName=""
      >
        <div className="m-auto px-2 pt-4 pb-8 w-full">
          <div className="flex justify-end w-full items-end">
            <button
              onClick={() => handleModalIsOpen(false)}
              className="bg-[#dbd9d9]  rounded hover:bg-[#c5c5c5] text-black"
            >
              <IoMdClose size={19} />
            </button>
          </div>
          <div className="flex justify-center flex-col items-center text-center">
            <h2 className="text-lg font-semibold">Compartilhar bio</h2>
            {isCopied && (
              <p className="text-sm text-orange mt-1">Link copiado!</p>
            )}
          </div>
          <hr className="my-4 border-dashed border-[#c5c5c5]" />

          <div className=" mt-4">
            <div className="border p-1 py-2 px-3 hover:border-orange rounded text-black mb-2 flex justify-between items-center cursor-pointer hover:brightness-90 transition">
              <p>{bioUrl}</p>

              <Tooltip
                color="secondary"
                content={isCopied ? "Copiado!" : "Copiar"}
              >
                <button onClick={() => handleCopyBioLink()}>
                  {isCopied ? (
                    <>
                      {" "}
                      <IoCopy size={20} />
                    </>
                  ) : (
                    <TbCopy size={20} />
                  )}
                </button>
              </Tooltip>
            </div>
          </div>

          <div>
            <p className="text-sm text-center">
              Criar seu link na bio no{" "}
              <span className="font-black">agro.page</span>{" "}
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <Button
                color="secondary"
                onClick={() =>
                  (window.location.href =
                    "https://agro-page-site.vercel.app/inicio")
                }
              >
                Criar minha bio grátis
              </Button>
              <Button
                color="secondary"
                onClick={() =>
                  (window.location.href =
                    "https://agro-page-painel-clientes-agropage.vercel.app/")
                }
              >
                Entrar
              </Button>
              {/* <Button color="secondary">Download</Button> */}
            </div>
          </div>

          <hr className="my-4 border-dashed border-[#c5c5c5]" />

          <div className="flex justify-center">
            <Link
              target="_blank"
              href="https://agro.page/denuncia"
              className="flex items-center gap-1 hover:text-orange-500 transition"
            >
              <CiWarning /> Denuncie esse link
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
};
