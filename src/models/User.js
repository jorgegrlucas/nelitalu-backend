import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    email: String,
    name: String,
    password: { type: String, required: true }
});

export default model('User', UserSchema)
