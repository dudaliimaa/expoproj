import axios from "axios";

const api = axios.create({
  // Se o seu servidor espera que todas as chamadas comecem com /api, adicione aqui:
  baseURL: "http://192.168.1.7:3000/api", 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});


export default api;
