import { api } from "@/service/api";
import { use } from "react";
import toast from "react-hot-toast";

interface ItemProps {
  userId: string;
  name: string;
  url: string;
}

export const createLink = async (data: ItemProps) => {
  try {
    const response = await api.post("/links", {
      userId: data.userId,
      name: data.name,
      url: data.url,
    });

    toast.success("Link criado com sucesso");
    return response.data;
  } catch (err) {
    toast.error("Erro ao criar link");
  }
};
