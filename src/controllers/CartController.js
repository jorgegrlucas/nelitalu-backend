// import Cart from "../models/Cart";

class CartController{
    async store(req,res){
        return res.json({ok: true})
    }
}

export default new CartController();
