import { Router } from 'express';
import SessionController from './controllers/SessionController';
import JewelController from './controllers/JewelController';
import multer from 'multer';
import uploadConfig from './config/upload';
import DashboardController from './controllers/DashboardController'
import CartController from './controllers/CartController';
import ReserveController from './controllers/ReserveController';

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

//Reserva
routes.post('/jewels/:jewel_id/reserve', ReserveController.store)
routes.get('/reserves', ReserveController.index);
routes.delete('/reserves/cancel', ReserveController.destroy);

export default routes;