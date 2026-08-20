# API Node.js + MinIO (Armazenamento de Objetos)

API que armazena e lista arquivos usando o conceito de object storage, com o **MinIO** rodando via Docker simulando o **AWS S3** localmente.

## Stack

- Node.js + Express
- Multer (upload de arquivos)
- AWS SDK v3 (`@aws-sdk/client-s3`) — compatível com MinIO
- MinIO (Docker)

## Passo a passo

### 1. Subir o MinIO com Docker

```bash
docker compose up -d
```

Isso sobe:
- API do MinIO em `http://localhost:9000`
- Console Web em `http://localhost:9001` (login: `minioadmin` / `minioadmin123`)

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

(No Windows: `copy .env.example .env`)

### 4. Rodar a API

```bash
npm run dev
```

A API sobe em `http://localhost:3000`. O bucket configurado no `.env` (`meus-arquivos`) é criado automaticamente se ainda não existir.

## Endpoints

| Método | Rota            | Descrição                          |
|--------|-----------------|-------------------------------------|
| GET    | `/`             | Verifica se a API está rodando      |
| POST   | `/files/upload` | Envia um arquivo (campo `file`)     |
| GET    | `/files`        | Lista todos os arquivos do bucket   |
| GET    | `/files/:key`   | Baixa/visualiza um arquivo          |
| DELETE | `/files/:key`   | Remove um arquivo                   |

## Testando

- **Postman/Insomnia**: para o upload, use `form-data` com o campo `file` do tipo "File".
- **REST Client (VS Code)**: use o arquivo `requests.http` incluído no projeto (upload precisa ser feito via Postman/Insomnia por causa do multipart/form-data).

## Estrutura do projeto

```
minio-api-project/
├── docker-compose.yml     # Sobe o MinIO
├── package.json
├── .env.example
├── requests.http          # Testes para REST Client
└── src/
    ├── server.js          # Ponto de entrada da API
    ├── s3Client.js        # Configuração do cliente S3/MinIO
    ├── ensureBucket.js     # Garante que o bucket existe
    └── routes/
        └── files.js       # Rotas de upload, listagem, download e delete
```
