import { Request, Response } from "express";
import Jewel from "../models/Jewel";

class SaleController {
    async store(req: Request, res: Response) {
        const { amount } = req.body;
        const productId = req.query.product_id as string;

        if (!productId) {
            return res
                .status(400)
                .json({ message: "ID do produto é obrigatório" });
        }
        if (typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({ message: "Quantidade inválida" });
        }

        try {
            const product = await Jewel.findById(productId);
            if (!product) {
                return res
                    .status(404)
                    .json({ message: "Produto não encontrado" });
            }

            if (product.amount < amount) {
                return res
                    .status(400)
                    .json({ message: "Estoque insuficiente para essa venda" });
            }

            product.amount -= amount;
            await product.save();

            return res.status(200).json({
                message: "Venda realizada com sucesso",
                product_id: productId,
                new_amount: product.amount,
            });
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ message: "Erro ao processar venda do produto" });
        }
    }
}

export default new SaleController();
