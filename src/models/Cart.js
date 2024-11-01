import { Schema,  model } from "mongoose";

const CartSchema = new Schema({
    email: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    jewel:{
        type: Schema.Types.ObjectId,
        ref: 'Jewel'
    }
});

export default model('Cart', CartSchema)
