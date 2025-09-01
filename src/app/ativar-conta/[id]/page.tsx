"use client";

import { api } from "@/service/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Alert, Title, Text, Button } from "rizzui";
import * as yup from "yup";

type Params = {
  id: string;
};

export default function Page({ params }: { params: Params }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleActivateAccount = async () => {
    try {
      setLoading(true);

      const response = await api.post("active-account", {
        id: params.id,
        token: token,
      });

      if (response.status !== 201) return setLoading(false);

      toast.success("Conta ativada com sucesso!");

      // Simulate an API call
      setTimeout(() => {
        window.location.href = "http://localhost:3001";
        setLoading(false);
      }, 2000);
    } catch (error) {
      toast.error("Erro ao ativar conta. Tente novamente.");
      setLoading(false);
      return;
    }
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <header className="flex flex-col items-center justify-center space-y-6">
        <img
          src="../../../img/assets/agro.page.white.png"
          alt="Logo"
          className="h-8 object-cover"
        />
      </header>
      <div className="bg-white w-3/12 mt-8 p-3 rounded-md shadow-2xl">
        <Title as="h4" className="text-center mb-4">
          Ativar Conta
        </Title>

        <Alert color="warning" className="bg-yellow-200" variant="flat">
          <Text className="font-semibold">Atenção</Text>
          <Text>Para ativar sua conta, clique no botão logo abaixo:</Text>
        </Alert>

        <hr className="my-4 border-dashed border-[#c5c5c5]" />

        <div className="w-full space-y-2">
          <Button
            onClick={() => handleActivateAccount()}
            isLoading={loading}
            color="secondary"
            className="w-full"
          >
            Ativar minha conta
          </Button>
        </div>
      </div>
    </div>
  );
}
