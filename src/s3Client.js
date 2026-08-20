const { S3Client } = require("@aws-sdk/client-s3");
require("dotenv").config();

// O MinIO é compatível com a API do S3, então usamos o mesmo SDK da AWS,
// apenas apontando o "endpoint" para o servidor MinIO local (rodando no Docker).
const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,
  region: process.env.MINIO_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // obrigatório para o MinIO funcionar corretamente com o SDK da AWS
});

module.exports = s3Client;
