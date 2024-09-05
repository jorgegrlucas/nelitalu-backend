import { Router } from 'express';
import SessionController from './controllers/SessionController';
import JewelController from './controllers/JewelController';
import multer from 'multer';
import uploadConfig from './config/upload';

const routes = new Router();
const upload = multer(uploadConfig)

// routes.get('/', (req, res) => {
//     return res.json({ ok : true});
// })

routes.post('/sessions', SessionController.store)
routes.post('/jewels', upload.single('thumbnail'), JewelController.store)
routes.get('/jewels',  JewelController.index)
routes.put('/jewels/:jewel_id',  upload.single('thumbnail'), JewelController.update)
routes.delete('/jewels/', JewelController.destroy)

export default routes;