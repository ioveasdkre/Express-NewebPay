import express from 'express';
import Paths from './constants/paths';

const homeRouter = express.Router();
const apiRouter = express.Router();

homeRouter.get(Paths.Homes.Index, (_req, res) => {
  // 渲染並回傳 EJS 視圖檔案
  res.render('index');
});

// 卻認訂單
homeRouter.get(Paths.Homes.Check, (_req, res) => {
  // 渲染並回傳 EJS 視圖檔案
  res.render('check');
});

homeRouter.post(Paths.Homes.Notify, (_req, res) => {
  // 渲染並回傳 EJS 視圖檔案
  res.render('spgateway_notify');
});

homeRouter.post(Paths.Homes.Return, (_req, res) => {
  // 渲染並回傳 EJS 視圖檔案
  res.render('spgateway_return');
});

apiRouter.use(Paths.Homes.Base, homeRouter);

export default apiRouter;
