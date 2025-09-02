import axios from "axios";

const environment = {
  production: "https://agropage.crewalpha.dev",
  development: "http://localhost:3333",
};

const api = axios.create({
  baseURL: "http://164.92.79.198",
});

export { api };
