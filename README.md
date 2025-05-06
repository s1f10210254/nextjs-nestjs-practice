```
mkdir client
cd client
npx create-next-app .
```

```
mkdir server
cd server
nest new .
```

CORS の設定

```
// main.ts(NestJS)
app.enableCors({
  origin: 'http://localhost:3000', // Next.jsが動いてるURL
});
```

NESTJS ライブラリ

```
npm install --save @nestjs/config
npm install --save @nestjs/typeorm typeorm pg
npm i --save class-validator class-transformer @nestjs/graphql
```

Docker 設定

docker-compose.yml

```
version: "3.9"
services:
  db:
    container_name: postgres_db
    image: postgres:latest
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - pgdata:/var/lib/postgresql/data

  vdb:
    container_name: vdb
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  pgdata:
  qdrant_data:
```
