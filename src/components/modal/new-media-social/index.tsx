"use client";

import { useState } from "react";
import { Modal } from "rizzui";
import { IoMdClose } from "react-icons/io";
import { FormNewMediaSocial } from "./form";
import { formatPhone } from "@/utils/format";

interface ModalProps {
  isOpen: boolean;
  handleModalIsOpen: (value: boolean) => void;
  userId: string;
  getDataApi: () => Promise<void>;
}

export const ModalNewMediaSocial: React.FC<ModalProps> = ({
  handleModalIsOpen,
  isOpen,
  userId,
  getDataApi,
}) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => handleModalIsOpen(false)}
        overlayClassName="backdrop-blur"
        containerClassName=" rounded-lg max-w-lg"
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
          <div className="flex justify-center">
            <h2 className="text-lg font-semibold">
              Adicionar nova rede social
            </h2>
          </div>
          <hr className="my-4 border-dashed border-[#c5c5c5]" />

          <div>
            <FormNewMediaSocial
              handleModalIsOpen={handleModalIsOpen}
              userId={userId}
              getDataApi={getDataApi}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
