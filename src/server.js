//para baixar package-lock.json usa o comando "npm init -y"  E  "npm i express mysql2 dotenv multer"
import 'dotenv/config';
import express from 'express';
import routes from './routes/routes.js';

const app = express();
app.use(express.json());
app.use('/', routes);


app.listen(process.env.SERVER_PORT, () => {
    console.log(`servidor rodando em: http://localhost:${process.env.SERVER_PORT}`);
})