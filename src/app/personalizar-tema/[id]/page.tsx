"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { ProgressBar } from "@/components/progressBar";
import { IoColorPaletteOutline } from "react-icons/io5";
import { findManyThemes } from "@/store/theme";
import { Avatar, Button, Loader } from "rizzui";
import { api } from "@/service/api";
import { routes } from "@/config/route";

type Params = {
  id: string;
};

interface ThemeProps {
  id: string;
  backgroundColor: string;
  textColor: string;
}

interface FormValues {
  themeId: string;
}

function isLightTheme(hexColor: string): boolean {
  if (!hexColor) return false;
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

const Index: React.FC<{ params: Params }> = ({ params }) => {
  const [loasding, setLoading] = useState(true);
  const [dataUser, setDataUser] = useState<any>(null);
  const [themes, setThemes] = useState<ThemeProps[]>([]);
  const router = useRouter();

  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: { themeId: "" },
  });

  const selectedThemeId = watch("themeId");
  const selectedTheme = themes.find((t) => t.id === selectedThemeId);

  const getDataApiThemes = useCallback(async () => {
    const response = await findManyThemes({ page: 1, limit: 40 });
    setThemes(response.data);
  }, []);

  const getDataApiUser = useCallback(async () => {
    setLoading(true);
    const response = await api.get(`/user/${params.id}`);
    if (response.status === 200) {
      setDataUser(response.data);
    }
    setLoading(false);
  }, [params.id]);

  useEffect(() => {
    getDataApiUser();
  }, [getDataApiUser]);

  useEffect(() => {
    getDataApiThemes();
  }, [getDataApiThemes]);

  const onSubmit = async (data: FormValues) => {
    const selected = themes.find((t) => t.id === data.themeId);

    if (!selected) return;

    const response = await api.post("custom-theme", {
      userId: params.id,
      themeId: selected.id,
    });

    if (response.status !== 201) return;

    router.push(routes.bio(dataUser.username));
  };

  const isLight = selectedTheme?.backgroundColor
    ? isLightTheme(selectedTheme.backgroundColor)
    : false;

  const backgroundColor = selectedTheme?.backgroundColor || "#052E16";
  const textColor = isLight ? "#000" : "#fff";

  return (
    <>
      {loasding ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader color="secondary" size="lg" />
        </div>
      ) : (
        <div
          className="min-h-screen p-4"
          style={{
            backgroundColor: backgroundColor,
            color: textColor,
          }}
        >
          <header className="flex flex-col items-center justify-center mt-20">
            <img
              src={
                isLight
                  ? "/img/assets/agro.page.black.png"
                  : "/img/assets/agro.page.white.png"
              }
              alt="Agro Page Logo"
              className="h-8 object-cover"
            />
          </header>

          <div className="container mx-auto md:max-w-4xl max-w-full">
            {/* <ProgressBar /> */}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 flex flex-col items-center bg-opacity-100"
            >
              <Avatar
                src={dataUser?.avatarUrl}
                name={dataUser?.name || "Usuário"}
                customSize={90}
                className="text-2xl"
              />

              <div className="mt-4 flex items-center gap-1 font-semibold">
                <p>Escolha o tema de sua preferência </p>
                <IoColorPaletteOutline size={20} />
              </div>

              <Controller
                name="themeId"
                control={control}
                render={({ field }) => (
                  <div className="mt-6 flex items-center gap-4">
                    {themes.map((theme) => {
                      const isLight = isLightTheme(theme.backgroundColor);

                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => field.onChange(theme.id)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${
                            field.value === theme.id ? "scale-110" : ""
                          }`}
                          style={{
                            backgroundColor: theme.backgroundColor,
                            borderColor:
                              field.value === theme.id
                                ? isLight
                                  ? "black"
                                  : "white"
                                : "transparent",
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              />

              <div className="mt-10 flex justify-end w-full">
                <Button
                  className="w-28"
                  color="secondary"
                  type="submit"
                  disabled={!selectedThemeId}
                >
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
