import { Schema, model } from "mongoose";

const ReserveSchema = new Schema({
    date: String
    , user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    jewel:{
        type: Schema.Types.ObjectId,
        ref: 'Jewel'
    }
});

export default model('Reserve', ReserveSchema)