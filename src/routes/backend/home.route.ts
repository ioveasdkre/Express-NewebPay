import express from 'express';
import { HomeController } from '@src/controllers/backend/home.controller';
import { handleErrorAsync } from '@src/middlewares/handle.middleware';
import Paths from './constants/paths';

const controller = new HomeController();
const homeRouter = express.Router();
const apiRouter = express.Router();

// 建立一筆訂單
homeRouter.post(Paths.Homes.CreateOrder, handleErrorAsync(controller.CreateOrder));

// 確認訂單
homeRouter.get(Paths.Homes.Order, handleErrorAsync(controller.GetOrder));

homeRouter.post(Paths.Homes.Notify, handleErrorAsync(controller.PostNotify));

apiRouter.use(Paths.Homes.Base, homeRouter);

export default apiRouter;
