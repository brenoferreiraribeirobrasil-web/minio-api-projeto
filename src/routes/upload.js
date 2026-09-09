const express = require("express");
const multer = require("multer");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = require("../s3Client");
require("dotenv").config();

const router = express.Router();
const bucketName = process.env.MINIO_BUCKET;

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Nenhum arquivo enviado. Use o campo 'file'.",
      });
    }

    const key = `${Date.now()}-${req.file.originalname}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    return res.status(201).json({
      message: "Arquivo enviado com sucesso.",
      filename: key,
      bucket: bucketName,
      contentType: req.file.mimetype,
      size: req.file.size,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Erro ao enviar arquivo.",
      details: err.message,
    });
  }
});

module.exports = router;