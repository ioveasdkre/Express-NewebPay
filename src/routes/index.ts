import { Router } from 'express';
import homefeRouter from './frontend/home.route';
import homeBeRouter from './backend/home.route';
import Paths from '@src/routes/backend/constants/paths';

const feRouter = Router();
const beRouter = Router();

feRouter.use(homefeRouter);
beRouter.use(Paths.Base, homeBeRouter);

export { beRouter, feRouter };
