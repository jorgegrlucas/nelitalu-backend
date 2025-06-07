const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // ou String, conforme o id do usuário
        required: true,
        ref: "User",
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId, // ou String, conforme o id do produto
        required: true,
        ref: "Product",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Favorite", FavoriteSchema);
