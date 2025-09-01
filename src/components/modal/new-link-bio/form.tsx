"use client";

import { findManyAccountSocials } from "@/store/account-social";
import { useCallback, useEffect, useState } from "react";
import { Button, Input } from "rizzui";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLink } from "@/store/link";

interface SocialOption {
  label: string;
  value: string;
}

interface ItemProps {
  id: string;
  provider: string;
  baseUrl: string;
  type: string;
}

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  url: z.string().min(1, "URL é obrigatória").url("URL inválida"),
});

type FormValues = z.infer<typeof schema>;

interface ModalProps {
  handleModalIsOpen: (value: boolean) => void;
  userId: string;
  getDataApi: () => Promise<void>;
}

export function FormNewLinkBio({
  handleModalIsOpen,
  userId,
  getDataApi,
}: ModalProps) {
  const [accountSocials, setAccountSocials] = useState<SocialOption[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string>("Rede social");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    await createLink({
      ...data,
      userId,
    });
    handleModalIsOpen(false);
    getDataApi();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        className="w-full"
        placeholder="Nome do link"
        {...register("name")}
        error={errors.name?.message}
      />
      <Input
        type="url"
        placeholder="Digite a URL"
        {...register("url")}
        error={errors.url?.message}
      />

      <Button type="submit" className="w-full" color="secondary">
        Salvar
      </Button>
    </form>
  );
}
