"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const purchaseSchema = new mongoose_1.Schema({
    vendor_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "vendor",
    },
    purchase_number: String,
    purchase_date: Date,
    due_date: Date,
    Subtotal: Number,
    status: {
        type: String,
        default: "Pending"
    },
    description: String,
    items: [{
            product_id: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "product"
            },
            name: String,
            qty: Number,
            price: Number,
            amount: Number,
            sgst: Number,
            cgst: Number,
            igst: Number,
            tax_purchase_price: Number,
            tamount: Number
        }],
    creater_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
const Purchase = mongoose_1.default.model("purchase", purchaseSchema);
exports.default = Purchase;
