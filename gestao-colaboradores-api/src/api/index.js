// api/index.js - Adaptador Serverless para Vercel
import app from "../server.js"; // ajusta o caminho conforme sua estrutura
import { createServer } from "http";

export default async function handler(req, res) {
  return new Promise((resolve, reject) => {
    const server = createServer(app);

    server.emit("request", req, res);

    // Resolve a Promise quando a resposta terminar
    res.on("finish", resolve);
    res.on("close", resolve);
    res.on("error", reject);
  });
}
