"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profit_1 = __importDefault(require("../../models/profit"));
const checkuser_1 = require("../../checkuser");
const router = express_1.default.Router();
// Get today's profit
router.get("/today", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const profitRecord = yield profit_1.default.findOne({
            date: today,
            creater_id: req.userId
        });
        res.json({
            todayProfit: profitRecord ? profitRecord.totalProfit : 0
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching profit", error: error.message });
    }
}));
// Get all profit history (useful if we want a chart later)
router.get("/history", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const history = yield profit_1.default.find({ creater_id: req.userId }).sort({ date: -1 });
        res.json({ data: history });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching profit history", error: error.message });
    }
}));
exports.default = router;
