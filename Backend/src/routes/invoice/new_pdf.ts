import { PDFNet } from '@pdftron/pdfnet-node';
import path from 'path';
import numberToWord from 'number-to-words';

// PDFNet.initialize(process.env.PDFNET_LINK);

interface data {
    customer_id: {
        _id: string;
        name: string;
        phone_number: string;
        gst: string;
        customer_billing_address: {
            street_address: string;
            area: string;
            city: string;
            state: string;
            pincode: string;
        }
    };
    gst: {
        sgst: number;
        cgst: number;
        igst: number;
    };
    invoice_number: number;
    invoice_date: Date;
    due_date: Date;
    total: number;
    status: string;
    description: string;
    items: {
        id: number;
        name: string;
        qty: number;
        price: number;
        amount: number;
        cgst: number;
        sgst: number;
        igst: number;
        taxprice: number;
        tamount: number;
        hsn_code?: string;
    }[];
    Subtotal: number;
    charge: number;
}

export async function generateNewInvoicePdf(data: data): Promise<string> {
    console.log("Generating New Design Invoice PDF...");

    console.log(data.items[1]);


    const outputPart = path.resolve(__dirname, `../files/invoice.pdf`);
    const inputPart = path.resolve(__dirname, `../files/tax-bill.pdf`);

    const replaceText = async () => {
        const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPart);
        await pdfdoc.initSecurityHandler();
        const replacer = await PDFNet.ContentReplacer.create();
        const page = await pdfdoc.getPage(1);

        // Basic Info
        await replacer.addString('bill_number', String(data.invoice_number));
        await replacer.addString('date', new Date(data.invoice_date).toLocaleDateString('en-GB'));
        await replacer.addString('d_date', "");
        await replacer.addString('customer_name', String(data.customer_id?.name || ""));
        await replacer.addString('mobile_number', String(data.customer_id?.phone_number || ""));

        const amount_word1 = numberToWord.toWords(data.Subtotal);
        await replacer.addString('amount_word', `${amount_word1}`);

        // Address
        const addr = data.customer_id.customer_billing_address;
        let fullAddress = "";
        if (addr && addr.street_address) {
            fullAddress = `${addr.street_address}, ${addr.area}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
        }
        await replacer.addString('customer_address', fullAddress);
        await replacer.addString('gst', String(data.customer_id?.gst || ""));

        // Items
        for (let i = 0; i < 20; i++) {
            if (i < data.items.length) {
                const item = data.items[i];

                let tax_rate = item.igst + item.sgst + item.cgst;

                await replacer.addString(`no${i}`, "  " + String(i + 1));
                await replacer.addString(`item_name${i}`, " " + item.name);
                await replacer.addString(`hsn${i}`, item.hsn_code || " ");
                await replacer.addString(`qty${i}`, " " + String(item.qty) + ` PCS`);
                await replacer.addString(`rate${i}`, "    " + String(item.price));
                await replacer.addString(`amount${i}`, " " + `₹ ${new Intl.NumberFormat('en-IN').format(item.amount)}`);
                await replacer.addString(`g${i}`, "   " + `${String(tax_rate)} %`);
                await replacer.addString(`t${i}`, "  " + String(item.taxprice));
                await replacer.addString(`tamont${i}`, "   " + `₹ ${new Intl.NumberFormat('en-IN').format(item.tamount)}`);
            } else {
                // Clear remaining slots (up to 20)
                await replacer.addString(`no${i}`, " ");
                await replacer.addString(`item_name${i}`, " ");
                await replacer.addString(`hsn${i}`, " ");
                await replacer.addString(`qty${i}`, " ");
                await replacer.addString(`rate${i}`, " ");
                await replacer.addString(`amount${i}`, " ");
                await replacer.addString(`g${i}`, " ");
                await replacer.addString(`t${i}`, " ");
                await replacer.addString(`tamont${i}`, " ");
            }
        }

        // Totals
        await replacer.addString('charge', `₹ ${data.charge || 0}`);

        // Handle gst.sgst, gst.cgst, gst.igst
        const totalSgst = data.gst ? data.gst.sgst : 0;
        const totalCgst = data.gst ? data.gst.cgst : 0;
        const totalIgst = data.gst ? data.gst.igst : 0;

        // In the real data, 'Subtotal' actually holds the grand total (including tax).
        // The before-tax total is Subtotal - all taxes.
        const beforeTaxTotal = data.Subtotal - totalSgst - totalCgst - totalIgst;
        await replacer.addString('total', `₹ ${new Intl.NumberFormat('en-IN').format(beforeTaxTotal)}`);

        await replacer.addString('sgst', `₹ ${new Intl.NumberFormat('en-IN').format(totalSgst)}`);
        await replacer.addString('cgst', `₹ ${new Intl.NumberFormat('en-IN').format(totalCgst)}`);
        await replacer.addString('igst', `₹ ${new Intl.NumberFormat('en-IN').format(totalIgst)}`);

        // The total amount
        await replacer.addString('t_total', `₹ ${new Intl.NumberFormat('en-IN').format(data.Subtotal)}`);

        await replacer.process(page);

        await pdfdoc.save(outputPart, PDFNet.SDFDoc.SaveOptions.e_linearized);
    };

    await PDFNet.runWithCleanup(replaceText);

    return outputPart;
}
