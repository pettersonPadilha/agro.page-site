import { api } from "@/service/api";

interface Params {
  page: number;
  limit: number;
}

export const findManyThemes = async (params: Params) => {
  const response = await api.get("/themes", { params });
  return response.data;
};
