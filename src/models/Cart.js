import { Schema, model } from "mongoose";

const CartSchema = new Schema({
    email: String, // opcional
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    jewel: {
        type: Schema.Types.ObjectId,
        ref: "Jewel",
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default model("Cart", CartSchema);
