import express from 'express';
import path from 'path';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { setSecurityHeaders } from '@src/config/contentSecurityPolicy';
import { swaggerSpec } from '@src/config/swagger';
import {
  handle404Error,
  handleErrors,
  handleUncaughtException,
  handleUnhandledRejection,
} from './middlewares/error.middleware';
import { beRouter, feRouter } from '@src/routes/index';

export const app = express();

app.use(setSecurityHeaders);

if (process.env['ENV'] === 'dev') {
  app.use(morgan('dev'));
}

app.use(express.json());

// 設定視圖引擎為 EJS
app.set('view engine', 'ejs');

// 設定視圖檔案的目錄
app.set('views', path.join(__dirname, 'views'));

app.use(feRouter);
app.use(beRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(handle404Error);

app.use(handleErrors);

// 補捉程式錯誤
process.on('uncaughtException', handleUncaughtException);

// 補捉未處理的 catch
process.on('unhandledRejection', handleUnhandledRejection);

export default app;
