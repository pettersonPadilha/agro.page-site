import { api } from "@/service/api";

interface Params {
  page: number;
  limit: number;
}

export const findManyAccountSocials = async (params: Params) => {
  const response = await api.get("/social-accounts", { params });
  return response.data;
};
