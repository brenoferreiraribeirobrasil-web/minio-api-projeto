const express = require("express");
require("dotenv").config();

const ensureBucket = require("./ensureBucket");
const filesRouter = require("./routes/files");
const uploadRouter = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "API rodando", docs: "Use /files para gerenciar arquivos" });
});

app.use("/upload", uploadRouter);
app.use("/files", filesRouter);

async function start() {
  try {
    await ensureBucket(); // garante que o bucket existe antes de subir a API
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err.message);
    process.exit(1);
  }
}

start();
