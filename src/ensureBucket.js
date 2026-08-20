const { HeadBucketCommand, CreateBucketCommand } = require("@aws-sdk/client-s3");
const s3Client = require("./s3Client");
require("dotenv").config();

const bucketName = process.env.MINIO_BUCKET;

async function ensureBucket() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket "${bucketName}" já existe.`);
  } catch (err) {
    console.log(`Bucket "${bucketName}" não encontrado. Criando...`);
    await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket "${bucketName}" criado com sucesso.`);
  }
}

module.exports = ensureBucket;
