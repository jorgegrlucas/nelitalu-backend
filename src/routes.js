import { Router } from "express";
import SessionController from "./controllers/SessionController";
import JewelController from "./controllers/JewelController";
import FavoriteController from "./controllers/FavoriteController";
// import multer from "multer";
// import uploadConfig from "./config/upload";
import DashboardController from "./controllers/DashboardController";
import CartController from "./controllers/CartController";
import ReserveController from "./controllers/ReserveController";
//USER
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { PaypalController } from "./controllers/PaypalController";

const routes = new Router();
// const upload = multer(uploadConfig);

//CRUD sessão
routes.post("/sessions", SessionController.store);

routes.post("/user", new CreateUserController().handle);
routes.post("/auth", new AuthUserController().handle);

//CRUD Jóias
routes.post(
    "/product",
    isAuthenticated,
    // upload.single("thumbnail"),
    JewelController.store,
);
routes.get("/products", isAuthenticated, JewelController.index); //teste rota
routes.put(
    // "/jewels/:jewel_id",
    "/product/edit",
    isAuthenticated,
    // upload.single("thumbnail"),
    JewelController.update,
);
routes.delete("/product/delete/:product_id", JewelController.destroy);

//CRUD Dashboard
routes.get("/dashboard", DashboardController.show);

//Cart
routes.post("/cart/add", isAuthenticated, CartController.store);
routes.get("/cart", isAuthenticated, CartController.index);
routes.post(
    "/cart/update-quantity",
    isAuthenticated,
    CartController.updateQuantity,
);
routes.delete("/cart/:cartItemId", isAuthenticated, CartController.destroy);

//Reserva
routes.post("/jewels/:jewel_id/reserve", ReserveController.store);
routes.get("/reserves", ReserveController.index);
routes.delete("/reserves/cancel", ReserveController.destroy);

//Favoritos
routes.post("/favorites/add", isAuthenticated, FavoriteController.add);
routes.post("/favorites/remove", isAuthenticated, FavoriteController.remove);
routes.get(
    "/favorites/user/:userId",
    isAuthenticated,
    FavoriteController.listByUser,
);

//PayPal
routes.post("/paypal/create-order", PaypalController.createOrder);
routes.post("/paypal/capture-order", PaypalController.captureOrder);

export default routes;
