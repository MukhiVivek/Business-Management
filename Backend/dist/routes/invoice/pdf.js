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
exports.generateInvoicePdf = generateInvoicePdf;
const pdfnet_node_1 = require("@pdftron/pdfnet-node");
const path_1 = __importDefault(require("path"));
const number_to_words_1 = __importDefault(require("number-to-words"));
// Generate invoice PDF and return output file path
function generateInvoicePdf(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("1", data);
        const amount_word1 = number_to_words_1.default.toWords(data.Subtotal);
        console.log("2", amount_word1);
        const outputPart = path_1.default.resolve(__dirname, `../files/invoice.pdf`);
        const inputPart = path_1.default.resolve(__dirname, `../files/tax-bill.pdf`);
        console.log(data);
        const replaceText = () => __awaiter(this, void 0, void 0, function* () {
            const pdfdoc = yield pdfnet_node_1.PDFNet.PDFDoc.createFromFilePath(inputPart);
            yield pdfdoc.initSecurityHandler();
            const replacer = yield pdfnet_node_1.PDFNet.ContentReplacer.create();
            const page = yield pdfdoc.getPage(1);
            yield replacer.addString('bill_number', `${data.invoice_number}`);
            yield replacer.addString('date', `${new Date(data.invoice_date).toLocaleDateString('en-GB')}`);
            // await replacer.addString('d_date', `${new Date(data.due_date).toLocaleDateString('en-GB')}`)
            yield replacer.addString('d_date', ` `);
            yield replacer.addString('customer_name', `${data.customer_id.name}`);
            yield replacer.addString('customer_name1', `${data.customer_id.name}`);
            yield replacer.addString('amount_word', `${amount_word1}`);
            yield replacer.addString('mobile_number', `${data.customer_id.phone_number}`);
            yield replacer.addString('mobile_number1', `${data.customer_id.phone_number}`);
            yield replacer.addString('gst', `${data.customer_id.gst}`);
            for (let i = 0; i < data.items.length; i++) {
                yield replacer.addString(`no${i}`, `${i + 1}`);
                yield replacer.addString(`item_name${i}`, `${data.items[i].name}`);
                yield replacer.addString(`qty${i}`, `${data.items[i].qty} Kg`);
                yield replacer.addString(`rate${i}`, `${data.items[i].price}`);
                yield replacer.addString(`amont${i}`, `${new Intl.NumberFormat('en-IN').format(data.items[i].amount)} ₹`);
                yield replacer.addString(`c${i}`, `${data.items[i].cgst} %`);
                yield replacer.addString(`s${i}`, `${data.items[i].sgst} %`);
                yield replacer.addString(`t${i}`, `${data.items[i].igst} %`);
                yield replacer.addString(`tamont${i}`, `${new Intl.NumberFormat('en-IN').format(data.items[i].tamount)} ₹`);
            }
            for (let i = data.items.length; i < 20; i++) {
                yield replacer.addString(`no${i}`, ``);
                yield replacer.addString(`item_name${i}`, ``);
                yield replacer.addString(`qty${i}`, ``);
                yield replacer.addString(`rate${i}`, ``);
                yield replacer.addString(`amont${i}`, ``);
                yield replacer.addString(`c${i}`, ``);
                yield replacer.addString(`s${i}`, ``);
                yield replacer.addString(`t${i}`, ``);
                yield replacer.addString(`tamont${i}`, ``);
            }
            if ("" == data.customer_id.customer_billing_address.area) {
                yield replacer.addString(`customer_address`, ``);
                yield replacer.addString(`customer_address1`, ``);
            }
            else {
                yield replacer.addString(`customer_address`, `${data.customer_id.customer_billing_address.street_address} , ${data.customer_id.customer_billing_address.area} , ${data.customer_id.customer_billing_address.city} , ${data.customer_id.customer_billing_address.state} - ${data.customer_id.customer_billing_address.pincode}    `);
                yield replacer.addString(`customer_address1`, `${data.customer_id.customer_billing_address.street_address} , ${data.customer_id.customer_billing_address.area} , ${data.customer_id.customer_billing_address.city} , ${data.customer_id.customer_billing_address.state} - ${data.customer_id.customer_billing_address.pincode}    `);
            }
            yield replacer.addString('charge', `₹ 0`);
            // await replacer.addString('charge', `₹ ${data.charge}`)
            yield replacer.addString('total', `₹ ${new Intl.NumberFormat('en-IN').format(data.Subtotal - data.gst.sgst - data.gst.cgst - data.gst.igst)}`);
            yield replacer.addString('sgst', `₹ ${data.gst.sgst}`);
            yield replacer.addString('cgst', `₹ ${data.gst.cgst}`);
            yield replacer.addString('igst', `₹ ${data.gst.igst}`);
            yield replacer.addString('t_total', `₹ ${new Intl.NumberFormat('en-IN').format(data.Subtotal)}`);
            for (let i = 1; i <= 5; i++) {
                yield replacer.addString(`ba${i}`, `${data.gst_table.basic_amount[`amount_${i}`] ? data.gst_table.basic_amount[`amount_${i}`] : "0.00 "}` + "₹");
                yield replacer.addString(`cg${i}`, `${data.gst_table.cgst_amount[`amount_${i}`] ? data.gst_table.cgst_amount[`amount_${i}`] : "0.00 "}` + "₹");
                yield replacer.addString(`sg${i}`, `${data.gst_table.sgst_amount[`amount_${i}`] ? data.gst_table.sgst_amount[`amount_${i}`] : "0.00 "}` + "₹");
                yield replacer.addString(`ig${i}`, `${data.gst_table.igst_amount[`amount_${i}`] ? data.gst_table.igst_amount[`amount_${i}`] : "0.00 "}` + "₹");
            }
            for (let i = 1; i <= 6; i++) {
                yield replacer.addString(`ob${i}`, ``);
                yield replacer.addString(`oba${i}`, ``);
            }
            yield replacer.addString('company_name', ``);
            yield replacer.addString('ifsc', ``);
            yield replacer.addString('bnumber', ``);
            yield replacer.addString('bname', ``);
            yield replacer.process(page);
            yield pdfdoc.save(outputPart, pdfnet_node_1.PDFNet.SDFDoc.SaveOptions.e_linearized);
        });
        yield pdfnet_node_1.PDFNet.runWithCleanup(replaceText);
        return outputPart;
    });
}
