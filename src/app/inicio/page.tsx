/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Button, Input } from "rizzui";
import { findUserByUsername } from "@/store/user";
import toast from "react-hot-toast";
import { createLocalStorageKey } from "@/utils/localStorage";
import { routes } from "@/config/route";
import { Suspense } from "react";

interface IFormsProps {
  username: string;
}

const PREFIX = "agro.page//";

export default function Page({
  searchParams,
}: {
  searchParams: { username?: string };
}) {
  const usernameFromUrl = searchParams.username ?? "";

  // handler de submit no client
  async function onSubmitForm(formData: FormData) {
    "use server"; // 🔹 habilita server action

    const username = (formData.get("username") as string) ?? "";

    const user = await findUserByUsername(username);
    if (user) {
      // toast não funciona server-side → pode redirecionar ou devolver erro
      throw new Error("Este nome de usuário já está em uso. Tente outro.");
    }

    createLocalStorageKey(username);
    return routes.register(username);
  }

  return (
    <div>
      <header className="flex flex-col items-center justify-center">
        <div className="mt-20">
          <img
            src="../../../img/assets/agro.page.white.png"
            alt="Logo Agro.page"
            className="h-8 object-cover"
          />
        </div>
      </header>

      <div className="container mx-auto md:max-w-4xl max-w-full">
        <div className="mt-8 flex flex-col items-center justify-center">
          <h1 className="text-white md:text-4xl text-2xl font-studioK">
            Simplifique, conecte, cresça!
          </h1>
          <p className="text-white md:text-left text-center font-poppins font-thin mt-2">
            Qual vai ser o nome do seu agro.page?
          </p>
        </div>

        <form className="mt-10 px-4" action={onSubmitForm}>
          <Input
            name="username"
            defaultValue={usernameFromUrl}
            className="text-white"
            autoComplete="off"
          />

          <div className="mt-4 flex items-center justify-center gap-1">
            <p className="text-white font-poppins text-sm font-light">
              Já possui uma conta?
            </p>
            <Link
              href="https://cliente.agro.page"
              className="text-white font-poppins text-sm font-light underline"
            >
              Faça o login
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mt-8">
            <p className="flex-1 text-white font-poppins text-sm font-light">
              Ao clicar em avançar, você concorda com os nossos{" "}
              <Link
                href="https://agro.page/termos-de-uso"
                className="text-white underline"
              >
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link
                href="https://agro.page/aviso-de-privacidade/"
                className="text-white underline"
              >
                Aviso de privacidade
              </Link>
            </p>
            <div className="mt-8 md:mt-0 w-full md:w-auto">
              <Button color="secondary" type="submit" className="w-full">
                Avançar
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
