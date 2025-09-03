"use client";

export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import { ProgressBar } from "@/components/progressBar";
import Link from "next/link";
import { Button, Input } from "rizzui";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { findUserByUsername } from "@/store/user";
import toast from "react-hot-toast";
import { createLocalStorageKey } from "@/utils/localStorage";
import { routes } from "@/config/route";
import { useRef, useState, useEffect } from "react";

interface IFormsProps {
  username: string;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .matches(/^[a-z0-9_-]+$/, "Nome de usuário inválido")
    .required("Usuário é obrigatório"),
});

const PREFIX = "agro.page//";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ClientPage />
    </Suspense>
  );
}

function ClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IFormsProps>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      username: searchParams.get("username") || "", // 👈 pega da URL
    },
  });

  const username = watch("username");

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
    if (e.key === " ") e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (!value.startsWith(PREFIX)) {
      value = PREFIX;
    }

    const rawUsername = value.slice(PREFIX.length);
    const sanitized = rawUsername.replace(/\s+/g, "").toLowerCase();

    setValue("username", sanitized, { shouldValidate: true });
  };

  const handleSelect = () => {
    const input = inputRef.current;
    if (!input) return;

    const minPos = PREFIX.length;
    if (input.selectionStart! < minPos) {
      input.setSelectionRange(minPos, minPos);
    }
    if (input.selectionEnd! < minPos) {
      input.setSelectionRange(minPos, minPos);
    }
  };

  // 🔮 Gerar sugestões automáticas
  useEffect(() => {
    const generateSuggestions = async () => {
      if (!username.includes(".")) {
        setSuggestions([]);
        return;
      }

      const parts = username.split(".");
      const joined = parts.join("");

      let candidates = [parts.join("-"), parts.join("_"), joined].filter(
        (v, i, arr) => arr.indexOf(v) === i
      );

      const final: string[] = [];

      for (let cand of candidates) {
        let suggestion = cand;
        let counter = 1;

        while (await findUserByUsername(suggestion)) {
          suggestion = `${cand}${counter}`;
          counter++;
        }

        final.push(suggestion);
        if (final.length >= 3) break;
      }

      setSuggestions(final);
    };

    generateSuggestions();
  }, [username]);

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

        <form className="mt-10 px-4" onSubmit={handleSubmit(onSubmitForm)}>
          <Input
            ref={inputRef}
            value={PREFIX + username}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onSelect={handleSelect}
            error={errors.username?.message}
            className="text-white"
            autoComplete="off"
          />

          {suggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() =>
                    setValue("username", sug, { shouldValidate: true })
                  }
                  className="rounded bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

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
