"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const itemSchema = new Schema({
    name: String,
    unit: String,
    price: Number,
    item_type: String,
    display_name: String,
    description: String,
    image: String,
    creater_id: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    createdAt: Date,
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
const item = mongoose.model("item", itemSchema);
exports.default = item;
