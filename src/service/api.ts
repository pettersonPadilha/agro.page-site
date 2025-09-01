import axios from "axios";

const environment = {
  production: "https://agropage.crewalpha.dev",
  development: "http://localhost:3333",
};

const api = axios.create({
  baseURL: "https://hour-bookmarks-decline-printing.trycloudflare.com",
});

export { api };
