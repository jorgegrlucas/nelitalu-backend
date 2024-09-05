import { Router } from 'express';
import SessionController from './controllers/SessionController';
import JewelController from './controllers/JewelController';
import multer from 'multer';
import uploadConfig from './config/upload';
import DashboardController from './controllers/DashboardController'
import CartController from './controllers/CartController';

const routes = new Router();
const upload = multer(uploadConfig)

//CRUD sessão
routes.post('/sessions', SessionController.store)

//CRUD Jóias
routes.post('/jewels', upload.single('thumbnail'), JewelController.store)
routes.get('/jewels',  JewelController.index)
routes.put('/jewels/:jewel_id',  upload.single('thumbnail'), JewelController.update)
routes.delete('/jewels/', JewelController.destroy)

//CRUD Dashboard
routes.get('/dashboard',  DashboardController.show)

//Cart
routes.post('/cart/:jewel_id/add',  CartController.store)

export default routes;