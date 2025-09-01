"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DropZone from "@/components/DropZone";
import { Button } from "rizzui";
import { HiPhoto } from "react-icons/hi2";
import { ProgressBar } from "@/components/progressBar";
import { updateAvatar } from "@/store/user";
import { routes } from "@/config/route";

type Params = {
  id: string;
};

interface ImageState {
  file: File | null;
  uri: string | null;
}

const Index: React.FC<{ params: Params }> = ({ params }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [image, setImage] = useState<ImageState>({
    file: null,
    uri: null,
  });

  const setNewImage = useCallback((file: File) => {
    setImage({
      file,
      uri: URL.createObjectURL(file),
    });
  }, []);

  const handleDropZoneThumb = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setNewImage(file);
      }
    },
    [setNewImage]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setNewImage(file);
      }
    },
    [setNewImage]
  );

  const handleUpload = useCallback(async () => {
    if (!image.file) return;
    await updateAvatar(image.file, params.id);
    router.push(routes.customSocial(params.id));
  }, [image.file, params.id, router]);

  return (
    <div>
      {/* HEADER */}
      <header className="flex flex-col items-center justify-center mt-20">
        <img
          src="/img/assets/agro.page.white.png"
          alt="Agro Page Logo"
          className="h-8 object-cover"
        />
      </header>

      <div className="container mx-auto md:max-w-4xl max-w-full">
        {/* <ProgressBar /> */}

        <div className="mt-8 flex flex-col items-center bg-opacity-100">
          {image.uri ? (
            <img
              src={image.uri}
              alt="Preview"
              className="w-40 h-40 rounded-full object-cover"
            />
          ) : (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-40 h-40 rounded-full bg-[#f7f7f731] cursor-pointer"
              >
                <div className="flex justify-center items-center h-full">
                  <HiPhoto size={60} color="#FFFFFF" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/jpeg,image/png"
              />
            </>
          )}

          {/* DropZone */}
          <div className="mt-8 w-full px-4 md:px-0">
            <DropZone
              accept="image/jpeg,image/png"
              onDropAccepted={handleDropZoneThumb}
              multiple={false}
              isAccept="Solte aqui seu arquivo"
              isReject="Esse formato de arquivo não é aceito"
              isActive="Clique para adicionar"
              isLarge="O arquivo é muito grande. Tamanho máximo:"
            />
          </div>
        </div>

        <div className="text-white mt-28 flex items-center justify-end px-4 gap-3">
          <Button
            onClick={() => router.push(routes.customSocial(params.id))}
            color="secondary"
            type="button"
            className="w-28"
          >
            Pular
          </Button>
          <Button
            onClick={handleUpload}
            color="secondary"
            type="button"
            className="w-28"
            disabled={!image.file}
          >
            Avançar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
