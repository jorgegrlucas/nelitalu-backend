import Cart from "../models/Cart";

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
}

export default new CartController();
