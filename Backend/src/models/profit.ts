import mongoose, { Schema } from "mongoose";

const profitSchema = new Schema({
    date: {
        type: String, // YYYY-MM-DD
        required: true,
        unique: true
    },
    totalProfit: {
        type: Number,
        default: 0
    },
    creater_id: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, {
    timestamps: true
});

const Profit = mongoose.model("profit", profitSchema);

export default Profit;
