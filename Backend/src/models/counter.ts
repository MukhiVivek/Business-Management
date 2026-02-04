import mongoose, { Schema } from "mongoose";

const counterSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    seq: {
        type: Number,
        default: 0
    }
});

export const Counter = mongoose.model("counter", counterSchema);
