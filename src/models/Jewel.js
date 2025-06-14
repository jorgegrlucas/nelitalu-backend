import { Schema, model } from "mongoose";

const JewelSchema = new Schema(
    {
        thumbnail: String,
        name: String,
        description: String,
        price: Number,
        active: Boolean,
        amount: { type: Number, required: true, default: 0 },
    },
    {
        toJSON: {
            virtuals: true,
        },
    },
);

JewelSchema.virtual("thumbnail_url").get(function () {
    return `http://localhost:3333/files/${this.thumbnail}`;
});

export default model("Jewel", JewelSchema);
