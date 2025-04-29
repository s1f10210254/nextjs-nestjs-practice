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

CORSの設定
```
// main.ts(NestJS)
app.enableCors({
  origin: 'http://localhost:3000', // Next.jsが動いてるURL
});
```

NESTJSライブラリ
```
npm install --save @nestjs/config
npm install --save @nestjs/typeorm typeorm pg
```
