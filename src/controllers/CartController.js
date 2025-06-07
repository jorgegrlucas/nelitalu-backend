import Cart from "../models/Cart";

class CartController {
    async store(req, res) {
        const userId = req.userId; // vem do middleware JWT
        const { jewelId } = req.body;

        if (!jewelId) {
            return res
                .status(400)
                .json({ message: "É necessário o ID da jóia!" });
        }

        try {
            // Verifica se o produto já está no carrinho do usuário
            const exists = await Cart.findOne({ user: userId, jewel: jewelId });
            if (exists) {
                return res
                    .status(200)
                    .json({ message: "Produto já está no carrinho!" });
            }

            const newCartItem = await Cart.create({
                user: userId,
                jewel: jewelId,
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
            // Busca todos os itens do carrinho do usuário logado
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

    async destroy(req, res) {
        const userId = req.userId;
        const { cartItemId } = req.params;

        try {
            // Verifica se o item existe e pertence ao usuário
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

    // Adicione outras funções: exibir carrinho, remover item, etc.
}

export default new CartController();
