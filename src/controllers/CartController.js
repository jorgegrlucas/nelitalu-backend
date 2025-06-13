import Cart from "../models/Cart";
import User from "../models/User";
import Jewel from "../models/Jewel";
import JewelController from "./JewelController";
import fs from "fs";
import path from "path";

class CartController {
    async store(req, res) {
        const userId = req.userId;
        const { jewelId, quantity = 1 } = req.body;

        if (!jewelId) {
            return res
                .status(400)
                .json({ message: "É necessário o ID da jóia!" });
        }

        try {
            const existingItem = await Cart.findOne({
                user: userId,
                jewel: jewelId,
            });

            if (existingItem) {
                existingItem.quantity += quantity;
                await existingItem.save();

                return res.status(200).json(existingItem);
            }

            const newCartItem = await Cart.create({
                user: userId,
                jewel: jewelId,
                quantity: quantity,
            });

            return res.status(201).json(newCartItem);
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ message: "Erro ao adicionar ao carrinho." });
        }
    }

    async index(req, res) {
        const userId = req.userId;

        try {
            const cartItems = await Cart.find({ user: userId }).populate(
                "jewel",
            );
            return res.status(200).json(cartItems);
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ message: "Erro ao buscar o carrinho do usuário." });
        }
    }

    async updateQuantity(req, res) {
        const userId = req.userId;
        const { cartItemId, quantity } = req.body;

        if (!cartItemId || typeof quantity !== "number") {
            return res.status(400).json({ message: "Dados inválidos" });
        }

        try {
            const cartItem = await Cart.findOne({
                _id: cartItemId,
                user: userId,
            });

            if (!cartItem) {
                return res
                    .status(404)
                    .json({ message: "Item não encontrado no carrinho." });
            }

            if (quantity <= 0) {
                await Cart.deleteOne({ _id: cartItemId });
                return res
                    .status(200)
                    .json({ message: "Item removido do carrinho." });
            }

            const ok = await JewelController.check(cartItem.jewel, quantity);
            if (!ok) {
                return res.status(400).json({
                    message:
                        "Quantidade solicitada excede o estoque disponível.",
                });
            }

            cartItem.quantity = quantity;
            await cartItem.save();
            return res.status(200).json(cartItem);
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ message: "Erro ao atualizar quantidade." });
        }
    }

    async destroy(req, res) {
        const userId = req.userId;
        const { cartItemId } = req.params;

        try {
            const cartItem = await Cart.findOne({
                _id: cartItemId,
                user: userId,
            });

            if (!cartItem) {
                return res
                    .status(404)
                    .json({ message: "Item não encontrado no carrinho." });
            }

            await Cart.deleteOne({ _id: cartItemId });
            return res
                .status(200)
                .json({ message: "Item removido do carrinho." });
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ message: "Erro ao remover item do carrinho." });
        }
    }

    async clearCart(req, res) {
        try {
            const userId = req.userId;

            const itemsToDelete = await Cart.find({ user: userId }).lean();

            const timestamp = Date.now();
            const filename = `order-${userId}-${timestamp}.txt`;
            const filepath = path.join(__dirname, "..", "orders", filename);

            fs.mkdirSync(path.dirname(filepath), { recursive: true });

            var person = await User.find({ _id: userId });
            var personName = person[0].name;
            var personAddress = person[0].address;

            const items = [];
            const quantities = [];

            for (const element of itemsToDelete) {
                const jewelDoc = await Jewel.findById(element.jewel);
                items.push(jewelDoc.name);
                quantities.push(element.quantity);
            }

            let fileContent =
                `Enviar para: ${personName}\n` +
                `Endereço: ${personAddress}\n` +
                `Itens:\n`;

            items.forEach((item, idx) => {
                fileContent += `  - ${item}: ${quantities[idx]}\n`;
            });

            fs.writeFileSync(filepath, fileContent, "utf-8");

            const result = await Cart.deleteMany({ user: userId });

            return res.json({
                message: "Carrinho limpo com sucesso",
                deletedCount: result.deletedCount,
                logFile: filename,
            });
        } catch (err) {
            console.error("Erro a limpar carrinho:", err);
            return res
                .status(500)
                .json({ message: "Erro interno no servidor" });
        }
    }
}

export default new CartController();
