import { Request, Response } from "express";
import mongoose from "mongoose";
import Favorite from "../models/Favotrite";

export default {
    async add(req: Request, res: Response) {
        const { productId } = req.body; // vem do Angular
        const userId = req.userId; // vem do middleware JWT

        if (!userId) {
            return res
                .status(401)
                .json({ message: "Usuário não autenticado." });
        }

        try {
            const exists = await Favorite.findOne({ userId, productId });
            if (exists) {
                return res
                    .status(200)
                    .json({ message: "Produto já favoritado!" });
            }

            const favorite = await Favorite.create({ userId, productId });
            return res.status(201).json(favorite);
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ message: "Erro ao adicionar favorito." });
        }
    },

    async remove(req: Request, res: Response) {
        const { productId } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res
                .status(401)
                .json({ message: "Usuário não autenticado." });
        }

        try {
            await Favorite.deleteOne({ userId, productId });
            return res
                .status(200)
                .json({ message: "Produto removido dos favoritos." });
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ message: "Erro ao remover favorito." });
        }
    },

    async listByUser(req: Request, res: Response) {
        const userId = req.userId; // vem do middleware JWT
        console.log("listByUser: ", userId);

        if (!userId) {
            return res
                .status(401)
                .json({ message: "Usuário não autenticado." });
        }

        try {
            const favorites = await Favorite.find({ userId });
            const productIds = favorites.map((fav) => fav.productId);
            return res.status(200).json(productIds);
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ message: "Erro ao buscar favoritos." });
        }
    },
};
