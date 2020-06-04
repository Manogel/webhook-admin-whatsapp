import axios from "axios";
import whatsappConfig from "../config/whatsapp";

const whatsapp = axios.create({
  baseURL: whatsappConfig.url,
});

whatsapp.defaults.headers.Authorization = `Bearer ${whatsappConfig.token}`;

export default whatsapp;
