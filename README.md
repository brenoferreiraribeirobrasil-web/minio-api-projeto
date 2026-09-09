# API REST com Node.js e MinIO

Projeto desenvolvido para demonstrar, na prática, o funcionamento do armazenamento de objetos (Object Storage).

A aplicação consiste em uma API REST desenvolvida com Node.js e Express, integrada ao MinIO por meio do AWS SDK para JavaScript. Todo o ambiente pode ser executado localmente utilizando Docker e Docker Compose.

## Tecnologias utilizadas

- Node.js
- Express
- Multer
- AWS SDK v3 (`@aws-sdk/client-s3`)
- MinIO
- Docker
- Docker Compose

## Funcionalidades

A API permite:

- Enviar arquivos para o MinIO
- Listar os arquivos armazenados
- Consultar nome, tamanho, data de modificação e Content-Type
- Visualizar ou baixar um arquivo
- Remover arquivos
- Criar automaticamente o bucket configurado caso ele ainda não exista

## Estrutura do projeto

```text
minio-api-project/
├── src/
│   ├── routes/
│   │   ├── files.js
│   │   └── upload.js
│   ├── ensureBucket.js
│   ├── s3Client.js
│   └── server.js
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── package-lock.json
├── README.md
└── requests.http
```

## Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/brenoferreiraribeirobrasil-web/minio-api-projeto.git
cd minio-api-projeto
```

### 2. Configurar as variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`.

Exemplo:

```env
PORT=3000

MINIO_API_PORT=9000
MINIO_CONSOLE_PORT=9001

MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=arquivos
MINIO_REGION=us-east-1
```

O arquivo `.env` não deve ser enviado ao GitHub.

### 3. Subir o ambiente com Docker

Execute:

```bash
docker compose up -d --build
```

Esse comando inicia a API Node.js e o servidor MinIO.

Para verificar os containers:

```bash
docker compose ps
```

## Serviços

Após iniciar o ambiente:

| Serviço | Endereço |
|---|---|
| API Node.js | `http://localhost:3000` |
| API MinIO | `http://localhost:9000` |
| Console MinIO | `http://localhost:9001` |

O bucket configurado em `MINIO_BUCKET` é criado automaticamente caso ainda não exista.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Verifica se a API está funcionando |
| POST | `/upload` | Envia um arquivo para o MinIO |
| GET | `/files` | Lista os arquivos armazenados |
| GET | `/files/:key` | Visualiza ou baixa um arquivo |
| DELETE | `/files/:key` | Remove um arquivo |

## Upload de arquivo

O endpoint:

```text
POST /upload
```

recebe arquivos utilizando `multipart/form-data`.

O campo deve possuir o nome:

```text
file
```

Exemplo utilizando curl:

```bash
curl -X POST http://localhost:3000/upload -F "file=@caminho/arquivo.jpg"
```

Exemplo de resposta:

```json
{
  "message": "Arquivo enviado com sucesso.",
  "filename": "arquivo-gerado.jpg",
  "bucket": "arquivos",
  "contentType": "image/jpeg",
  "size": 338815
}
```

## Listagem de arquivos

Para listar os objetos armazenados:

```text
GET /files
```

A resposta apresenta informações como:

- chave/nome do objeto
- tamanho
- data da última modificação
- Content-Type

Exemplo:

```json
{
  "bucket": "arquivos",
  "total": 1,
  "files": [
    {
      "key": "arquivo.jpg",
      "size": 338815,
      "lastModified": "2026-09-09T03:32:57.411Z",
      "contentType": "image/jpeg"
    }
  ]
}
```

## Recuperação de arquivo

Para visualizar ou baixar um arquivo:

```text
GET /files/:key
```

Exemplo:

```text
GET /files/arquivo.jpg
```

A API recupera o objeto armazenado no MinIO e envia o Content-Type correspondente na resposta HTTP.

## Remoção de arquivo

Para remover um objeto:

```text
DELETE /files/:key
```

## Testes

As rotas podem ser testadas utilizando:

- REST Client do VS Code
- Postman
- Insomnia
- curl

O projeto também possui o arquivo:

```text
requests.http
```

com requisições utilizadas para testar a API.

## Persistência dos dados

O MinIO utiliza um volume Docker:

```text
minio_data
```

Dessa forma, os objetos armazenados não são perdidos simplesmente ao parar e iniciar novamente os containers.

## Encerrar o ambiente

Para parar os containers:

```bash
docker compose down
```

Para iniciar novamente:

```bash
docker compose up -d
```

## Arquitetura

O fluxo principal da aplicação é:

```text
Cliente
   |
   | HTTP
   v
API REST - Node.js / Express
   |
   | AWS SDK / S3 API
   v
MinIO
   |
   v
Volume Docker
```

O MinIO fornece uma API compatível com o Amazon S3, permitindo que a aplicação utilize operações de armazenamento de objetos por meio do AWS SDK.