import axios from "axios";

const BASE_URL =
  "https://g759939ddfbfc89-af7wprgz6oymigsh.adb.sa-saopaulo-1.oraclecloudapps.com/ords/treinamento/chat/";

export default axios.create({
  baseURL: BASE_URL,
});
