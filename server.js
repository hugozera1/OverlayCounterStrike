import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors()); // libera acesso do front-end

let lastData = {}; // armazena os dados mais recentes recebidos do GSI

app.post("/gsi", (req, res) => {
  lastData = req.body;
  console.log("Dados do CS recebidos:", lastData);
  res.sendStatus(200);
});

app.get("/data", (req, res) => {
  res.json(lastData);
});

app.listen(3000, "0.0.0.0", () => {
  console.log("GSI rodando na porta 3000...");
});
