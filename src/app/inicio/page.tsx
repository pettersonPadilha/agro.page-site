"use client";

import { ProgressBar } from "@/components/progressBar";
import Link from "next/link";
import { Button, Input, Password } from "rizzui";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { findUserByUsername } from "@/store/user";
import toast from "react-hot-toast";
import { createLocalStorageKey } from "@/utils/localStorage";
import { routes } from "@/config/route";

interface IFormsProps {
  username: string;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .matches(/^[a-z0-9_-]+$/, "Nome de usuário inválido")
    .required("Usuário é obrigatório"),
});

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const usernameFromQuery = searchParams.get("username");

  const Defaultvalues = {
    username: usernameFromQuery || "",
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: Defaultvalues,
  });

  const onSubmitForm = async ({ username }: IFormsProps) => {
    const user = await findUserByUsername(username);

    if (user) {
      toast.error("Este nome de usuário já está em uso. Tente outro.");
      return;
    }

    createLocalStorageKey(username);
    router.push(routes.register(username));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("username", e.target.value.toLowerCase());
  };

  return (
    <div>
      <header className="flex flex-col items-center justify-center">
        <header className="mt-20">
          <div>
            <img
              src="../../../img/assets/agro.page.white.png"
              alt=""
              className="h-8 object-cover"
            />
          </div>
        </header>
      </header>

      <div className="container mx-auto md:max-w-4xl max-w-full">
        {/* <ProgressBar progress="" /> */}

        <div className="mt-8 flex justify-center items-center flex-col">
          <div className="flex md:flex-col md:items-start items-center gap-1 justify-center">
            <h1 className="text-white md:text-4xl text-2xl font-studioK">
              Simplifique, conecte, cresça!
            </h1>
          </div>
          <p className="text-white md:text-left text-center font-poppins font font-thin mt-2">
            Qual vai ser o nome do seu agro.page?
          </p>
        </div>

        {/* input */}
        <form className="mt-10 px-4" onSubmit={handleSubmit(onSubmitForm)}>
          <Input
            prefix="agro.page"
            placeholder="Digite seu nome"
            className=" text-white"
            {...register("username", {
              onChange: handleInputChange,
            })}
            onKeyDown={handleKeyDown}
            error={errors.username?.message}
            autoComplete="off"
          />

          <div className="mt-4 flex items-center justify-center gap-1">
            <p className="text-white font-poppins text-sm font-light">
              Já possui uma conta?
            </p>
            <Link
              href="https://cliente.agro.page"
              className="text-white font-poppins text-sm font-light"
            >
              <p className="underline">Faça o login</p>
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
