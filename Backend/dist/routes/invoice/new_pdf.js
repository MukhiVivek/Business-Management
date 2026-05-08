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
exports.generateNewInvoicePdf = generateNewInvoicePdf;
const pdfnet_node_1 = require("@pdftron/pdfnet-node");
const path_1 = __importDefault(require("path"));
const number_to_words_1 = __importDefault(require("number-to-words"));
function generateNewInvoicePdf(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Generating New Design Invoice PDF...");
        console.log(data.items[1]);
        const outputPart = path_1.default.resolve(__dirname, `../files/invoice.pdf`);
        const inputPart = path_1.default.resolve(__dirname, `../files/tax-bill.pdf`);
        const replaceText = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const pdfdoc = yield pdfnet_node_1.PDFNet.PDFDoc.createFromFilePath(inputPart);
            yield pdfdoc.initSecurityHandler();
            const replacer = yield pdfnet_node_1.PDFNet.ContentReplacer.create();
            const page = yield pdfdoc.getPage(1);
            // Basic Info
            yield replacer.addString('bill_number', String(data.invoice_number));
            yield replacer.addString('date', new Date(data.invoice_date).toLocaleDateString('en-GB'));
            yield replacer.addString('d_date', "");
            yield replacer.addString('customer_name', String(((_a = data.customer_id) === null || _a === void 0 ? void 0 : _a.name) || ""));
            yield replacer.addString('mobile_number', String(((_b = data.customer_id) === null || _b === void 0 ? void 0 : _b.phone_number) || ""));
            const amount_word1 = number_to_words_1.default.toWords(data.Subtotal);
            yield replacer.addString('amount_word', `${amount_word1}`);
            // Address
            const addr = data.customer_id.customer_billing_address;
            let fullAddress = "";
            if (addr && addr.street_address) {
                fullAddress = `${addr.street_address}, ${addr.area}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
            }
            yield replacer.addString('customer_address', fullAddress);
            yield replacer.addString('gst', String(((_c = data.customer_id) === null || _c === void 0 ? void 0 : _c.gst) || ""));
            // Items
            for (let i = 0; i < 20; i++) {
                if (i < data.items.length) {
                    const item = data.items[i];
                    let tax_rate = item.igst + item.sgst + item.cgst;
                    yield replacer.addString(`no${i}`, "  " + String(i + 1));
                    yield replacer.addString(`item_name${i}`, " " + item.name);
                    yield replacer.addString(`hsn${i}`, item.hsn_code || " ");
                    yield replacer.addString(`qty${i}`, " " + String(item.qty) + ` PCS`);
                    yield replacer.addString(`rate${i}`, "    " + String(item.price));
                    yield replacer.addString(`amount${i}`, " " + `₹ ${new Intl.NumberFormat('en-IN').format(item.amount)}`);
                    yield replacer.addString(`g${i}`, "   " + `${String(tax_rate)} %`);
                    yield replacer.addString(`t${i}`, "  " + String(item.taxprice));
                    yield replacer.addString(`tamont${i}`, "   " + `₹ ${new Intl.NumberFormat('en-IN').format(item.tamount)}`);
                }
                else {
                    // Clear remaining slots (up to 20)
                    yield replacer.addString(`no${i}`, " ");
                    yield replacer.addString(`item_name${i}`, " ");
                    yield replacer.addString(`hsn${i}`, " ");
                    yield replacer.addString(`qty${i}`, " ");
                    yield replacer.addString(`rate${i}`, " ");
                    yield replacer.addString(`amount${i}`, " ");
                    yield replacer.addString(`g${i}`, " ");
                    yield replacer.addString(`t${i}`, " ");
                    yield replacer.addString(`tamont${i}`, " ");
                }
            }
            // Totals
            yield replacer.addString('charge', `₹ ${data.charge || 0}`);
            // Handle gst.sgst, gst.cgst, gst.igst
            const totalSgst = data.gst ? data.gst.sgst : 0;
            const totalCgst = data.gst ? data.gst.cgst : 0;
            const totalIgst = data.gst ? data.gst.igst : 0;
            // In the real data, 'Subtotal' actually holds the grand total (including tax).
            // The before-tax total is Subtotal - all taxes.
            const beforeTaxTotal = data.Subtotal - totalSgst - totalCgst - totalIgst;
            yield replacer.addString('total', `₹ ${new Intl.NumberFormat('en-IN').format(beforeTaxTotal)}`);
            yield replacer.addString('sgst', `₹ ${new Intl.NumberFormat('en-IN').format(totalSgst)}`);
            yield replacer.addString('cgst', `₹ ${new Intl.NumberFormat('en-IN').format(totalCgst)}`);
            yield replacer.addString('igst', `₹ ${new Intl.NumberFormat('en-IN').format(totalIgst)}`);
            // The total amount
            yield replacer.addString('t_total', `₹ ${new Intl.NumberFormat('en-IN').format(data.Subtotal)}`);
            yield replacer.process(page);
            yield pdfdoc.save(outputPart, pdfnet_node_1.PDFNet.SDFDoc.SaveOptions.e_linearized);
        });
        yield pdfnet_node_1.PDFNet.runWithCleanup(replaceText);
        return outputPart;
    });
}
