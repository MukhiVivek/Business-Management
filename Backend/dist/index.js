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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//mongose 
const dburl = process.env.MONGO_URI;
main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(dburl);
    });
}
//routes
const user_1 = __importDefault(require("./routes/user/user"));
const customer_1 = __importDefault(require("./routes/customer/customer"));
const invoice_1 = __importDefault(require("./routes/invoice/invoice"));
const product_1 = __importDefault(require("./routes/produtct/product"));
const invoicepayment_1 = __importDefault(require("./routes/payment/invoicepayment"));
app.use("/api/v1/user", user_1.default);
app.use("/api/v1/customer", customer_1.default);
app.use("/api/v1/invoice", invoice_1.default);
app.use("/api/v1/product", product_1.default);
app.use("/api/v1/payment", invoicepayment_1.default);
app.get("/", (req, res) => {
    res.send("Server is on test-1");
});
app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});
