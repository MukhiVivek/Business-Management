import mongoose, { Schema } from "mongoose";

const profitSchema = new Schema({
    date: {
        type: String, // YYYY-MM-DD
        required: true,
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

// Ensure a user can only have one profit record per date
profitSchema.index({ date: 1, creater_id: 1 }, { unique: true });

const Profit = mongoose.model("profit", profitSchema);

export default Profit;
