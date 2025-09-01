import toast from "react-hot-toast";
import { api } from "@/service/api";

export const findUserByUsername = async (username: string) => {
  try {
    const response = await api.post("/user", {
      username,
    });

    return response.data;
  } catch (err) {
    console.error("Error finding user by username:", err);
    throw err;
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    const response = await api.post("/user", {
      email,
    });

    return response.data;
  } catch (err) {
    console.error("Error finding user by email:", err);
    throw err;
  }
};

interface DataProps {
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
}

export const createUser = async (data: DataProps) => {
  try {
    const response = await api.post("/register", data);
    toast.success("Cadastro realizado com sucesso!");
    return response.data;
  } catch (err) {
    toast.error("Erro ao realizar cadastro. Tente novamente.");
  }
};

export const updateAvatar = async (file: File, userId: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);

  try {
    const response = await api.patch("/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Avatar atualizado com sucesso!");
    return response.data;
  } catch (err) {
    console.error("Error updating avatar:", err);
    toast.error("Erro ao atualizar avatar. Tente novamente.");
  }
};
