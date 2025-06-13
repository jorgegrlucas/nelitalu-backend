import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    email: String,
    name: String,
    address: { type: String, required: true },
    contact: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

export default model("User", UserSchema);
