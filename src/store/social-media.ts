import { api } from "@/service/api";
import toast from "react-hot-toast";

interface ItemProps {
  userId: string;
  socialAccountId: string;
  username: string;
}

export const createSocialMedia = async (data: ItemProps) => {
  try {
    const response = await api.post("/social-media", {
      userId: data.userId,
      socialAccountId: data.socialAccountId,
      username: data.username,
    });

    toast.success("Rede social criada com sucesso");
    return response.data;
  } catch (err) {
    toast.error("Erro ao criar rede social");
  }
};
