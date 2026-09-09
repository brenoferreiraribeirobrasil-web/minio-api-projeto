const express = require("express");
const {
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand
} = require("@aws-sdk/client-s3");

const s3Client = require("../s3Client");
require("dotenv").config();

const router = express.Router();
const bucketName = process.env.MINIO_BUCKET;


// GET /files -> lista todos os arquivos do bucket
router.get("/", async (req, res) => {
  try {
    const data = await s3Client.send(
      new ListObjectsV2Command({ Bucket: bucketName })
    );

   const files = await Promise.all(
  (data.Contents || []).map(async (item) => {
    const metadata = await s3Client.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: item.Key,
      })
    );

    return {
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
      contentType: metadata.ContentType,
    };
  })
);

    return res.json({ bucket: bucketName, total: files.length, files });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar arquivos.", details: err.message });
  }
});

// GET /files/:key -> baixa/visualiza um arquivo específico
router.get("/:key", async (req, res) => {
  try {
    const data = await s3Client.send(
      new GetObjectCommand({ Bucket: bucketName, Key: req.params.key })
    );

    res.setHeader("Content-Type", data.ContentType || "application/octet-stream");
    data.Body.pipe(res);
  } catch (err) {
    console.error(err);
    return res.status(404).json({ error: "Arquivo não encontrado.", details: err.message });
  }
});

// DELETE /files/:key -> remove um arquivo do bucket
router.delete("/:key", async (req, res) => {
  try {
    await s3Client.send(
      new DeleteObjectCommand({ Bucket: bucketName, Key: req.params.key })
    );
    return res.json({ message: `Arquivo "${req.params.key}" removido com sucesso.` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao remover arquivo.", details: err.message });
  }
});

module.exports = router;
