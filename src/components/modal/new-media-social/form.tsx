"use client";

import { findManyAccountSocials } from "@/store/account-social";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input } from "rizzui";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSocialMedia } from "@/store/social-media";
import { formatPhone } from "@/utils/format";

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
  socialId: z.string().min(1, "Selecione uma rede social"),
  username: z.string().min(1, "Usuário é obrigatório"),
});

type FormValues = z.infer<typeof schema>;

interface ModalProps {
  handleModalIsOpen: (value: boolean) => void;
  userId: string;
  getDataApi: () => Promise<void>;
}

// Função para limpar username/email/número
function sanitizeUsername(
  input: string,
  type: "whatsapp" | "email" | "linkedin" | "default" = "default"
): string {
  if (!input) return "";

  let value = input.trim();

  try {
    if (value.startsWith("http") || value.startsWith("www.")) {
      const url = new URL(
        value.startsWith("http") ? value : `https://${value}`
      );
      value = url.pathname.replace(/^\/+/, ""); // remove "/" inicial
      if (!value && url.searchParams.size > 0) {
        value = url.searchParams.values().next().value || "";
      }
    }
  } catch {
    // não era URL, mantém como está
  }

  if (type === "whatsapp") {
    let number = value.replace(/\D/g, "");
    if (number.startsWith("55")) {
      number = number.substring(2);
    }
    return number;
  }

  if (type === "email") {
    return value;
  }

  if (type === "linkedin") {
    const parts = value.split("/");
    return parts[parts.length - 1] || value;
  }

  return value.replace(/^@/, ""); // remove @ inicial
}

export function FormNewMediaSocial({
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
    control,
    resetField,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      socialId: "",
      username: "",
    },
  });

  // Detecta WhatsApp
  const isWhatsApp = useMemo(
    () => selectedLabel.toLowerCase().includes("whats"),
    [selectedLabel]
  );

  // Detecta Email
  const isEmail = useMemo(
    () => selectedLabel.toLowerCase() === "email",
    [selectedLabel]
  );

  // Detecta LinkedIn
  const isLinkedIn = useMemo(
    () => selectedLabel.toLowerCase().includes("linkedin"),
    [selectedLabel]
  );

  const getDataAccountSocial = useCallback(async () => {
    const response = await findManyAccountSocials({ limit: 20, page: 1 });

    setAccountSocials(
      response.data.map((item: ItemProps) => ({
        label: item.provider,
        value: item.id,
      }))
    );
  }, []);

  useEffect(() => {
    getDataAccountSocial();
  }, [getDataAccountSocial]);

  const onSubmit = async (data: FormValues) => {
    const sanitizedUsername = sanitizeUsername(
      data.username,
      isWhatsApp
        ? "whatsapp"
        : isEmail
        ? "email"
        : isLinkedIn
        ? "linkedin"
        : "default"
    );

    await createSocialMedia({
      userId: userId,
      socialAccountId: data.socialId,
      username: sanitizedUsername,
    });

    handleModalIsOpen(false);
    getDataApi();
  };

  const getPlaceholder = () => {
    if (isWhatsApp) return "(99) 99999-9999";
    if (isEmail) return "Digite seu e-mail";
    if (isLinkedIn) return "Cole seu perfil do LinkedIn ou username";
    return "Digite seu usuário";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Select da rede social */}
      <select
        {...register("socialId")}
        onChange={(e) => {
          const selected = accountSocials.find(
            (s) => s.value === e.target.value
          );
          setSelectedLabel(selected ? selected.label : "Rede social");
          resetField("username");
          setValue("socialId", e.target.value, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        className="w-full p-2 rounded outline-none border focus:border-green-500"
      >
        <option value="">Selecione...</option>
        {accountSocials.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors.socialId?.message && (
        <p className="text-red-600 text-sm">{errors.socialId.message}</p>
      )}

      <Controller
        control={control}
        name="username"
        render={({ field }) => (
          <Input
            {...field}
            type={isWhatsApp ? "tel" : isEmail ? "email" : "text"}
            placeholder={getPlaceholder()}
            className="w-full"
            error={errors.username ? errors.username.message : undefined}
            onChange={(e) => {
              const val = e.target.value;
              field.onChange(isWhatsApp ? formatPhone(val) : val);
            }}
          />
        )}
      />

      <Button type="submit" className="w-full" color="secondary">
        Salvar
      </Button>
    </form>
  );
}
