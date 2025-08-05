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
const customer_1 = __importDefault(require("../../models/customer"));
const checkuser_1 = require("../../checkuser");
const router = express_1.default.Router({ mergeParams: true });
// create : update , delete
// Done : data , add
router.get("/data", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const data = yield customer_1.default.find({ creater_id: req.userId });
        res.json({
            data
        });
    }
    catch (e) {
        res.status(403).json({
            message: "You are not logged in"
        });
    }
}));
router.post("/add", checkuser_1.checkuserlogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, work_phone_number, phone_number, customer_type, balance, location, customer_billing_address, display_name, email, gst } = req.body;
        const newCustomer = yield customer_1.default.create({
            name,
            gst,
            work_phone_number,
            display_name,
            phone_number,
            customer_type,
            email,
            balance,
            location,
            customer_billing_address,
            // @ts-ignore
            creater_id: req === null || req === void 0 ? void 0 : req.userId,
            createdAt: Date.now(),
        });
        res.status(201).json({
            message: "customer added"
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "customer already exists",
            error: e.message
        });
    }
}));
exports.default = router;
