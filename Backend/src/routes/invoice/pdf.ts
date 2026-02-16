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
    gst_table: {
        basic_amount: {
            amount_1: number;
            amount_2: number;
            amount_3: number;
            amount_4: number;
            amount_5: number;
        },
        cgst_amount: {
            amount_1: number;
            amount_2: number;
            amount_3: number;
            amount_4: number;
            amount_5: number;
        },
        sgst_amount: {
            amount_1: number;
            amount_2: number;
            amount_3: number;
            amount_4: number;
            amount_5: number;
        },
        igst_amount: {
            amount_1: number;
            amount_2: number;
            amount_3: number;
            amount_4: number;
            amount_5: number;
        }
    },
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
    }[];
    Subtotal: number;
    charge: number;
}


// Generate invoice PDF and return output file path
export async function generateInvoicePdf(data: data): Promise<string> {

    console.log("1", data);

    const amount_word1 = numberToWord.toWords(data.Subtotal);

    console.log("2", amount_word1);

    const outputPart = path.resolve(__dirname, `../files/invoice.pdf`);
    const inputPart = path.resolve(__dirname, `../files/tax-bill.pdf`);

    console.log(data);

    const replaceText = async () => {
        const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPart);
        await pdfdoc.initSecurityHandler();
        const replacer = await PDFNet.ContentReplacer.create();
        const page = await pdfdoc.getPage(1);

        await replacer.addString('bill_number', `${data.invoice_number}`)
        await replacer.addString('date', `${new Date(data.invoice_date).toLocaleDateString('en-GB')}`)
        // await replacer.addString('d_date', `${new Date(data.due_date).toLocaleDateString('en-GB')}`)
        await replacer.addString('d_date', ` `)
        await replacer.addString('customer_name', `${data.customer_id.name}`)
        await replacer.addString('customer_name1', `${data.customer_id.name}`)
        await replacer.addString('amount_word', `${amount_word1}`)
        await replacer.addString('mobile_number', `${data.customer_id.phone_number}`)
        await replacer.addString('mobile_number1', `${data.customer_id.phone_number}`)
        await replacer.addString('gst', `${data.customer_id.gst}`)

        for (let i = 0; i < data.items.length; i++) {
            await replacer.addString(`no${i}`, `${i + 1}`)
            await replacer.addString(`item_name${i}`, `${data.items[i].name}`)
            await replacer.addString(`qty${i}`, `${data.items[i].qty}`)
            await replacer.addString(`rate${i}`, `${data.items[i].price}`)
            await replacer.addString(`amont${i}`, `${new Intl.NumberFormat('en-IN').format(data.items[i].amount)} ₹`);
            await replacer.addString(`c${i}`, `${data.items[i].cgst} %`);
            await replacer.addString(`s${i}`, `${data.items[i].sgst} %`);
            await replacer.addString(`t${i}`, `${data.items[i].igst} %`);
            await replacer.addString(`tamont${i}`, `${new Intl.NumberFormat('en-IN').format(data.items[i].tamount)} ₹`);
        }
        for (let i = data.items.length; i < 20; i++) {
            await replacer.addString(`no${i}`, ``)
            await replacer.addString(`item_name${i}`, ``)
            await replacer.addString(`qty${i}`, ``)
            await replacer.addString(`rate${i}`, ``)
            await replacer.addString(`amont${i}`, ``)
            await replacer.addString(`c${i}`, ``);
            await replacer.addString(`s${i}`, ``);
            await replacer.addString(`t${i}`, ``);
            await replacer.addString(`tamont${i}`, ``);

        }

        if ("" == data.customer_id.customer_billing_address.area) {
            await replacer.addString(`customer_address`, ``)
            await replacer.addString(`customer_address1`, ``)
        } else {
            await replacer.addString(`customer_address`, `${data.customer_id.customer_billing_address.street_address} , ${data.customer_id.customer_billing_address.area} , ${data.customer_id.customer_billing_address.city} , ${data.customer_id.customer_billing_address.state} - ${data.customer_id.customer_billing_address.pincode}    `)
            await replacer.addString(`customer_address1`, `${data.customer_id.customer_billing_address.street_address} , ${data.customer_id.customer_billing_address.area} , ${data.customer_id.customer_billing_address.city} , ${data.customer_id.customer_billing_address.state} - ${data.customer_id.customer_billing_address.pincode}    `)
        }

        await replacer.addString('charge', `₹ 0`)
        // await replacer.addString('charge', `₹ ${data.charge}`)
        await replacer.addString('total', `₹ ${new Intl.NumberFormat('en-IN').format(data.Subtotal - data.gst.sgst - data.gst.cgst - data.gst.igst)}`)
        await replacer.addString('sgst', `₹ ${data.gst.sgst}`)
        await replacer.addString('cgst', `₹ ${data.gst.cgst}`)
        await replacer.addString('igst', `₹ ${data.gst.igst}`)

        await replacer.addString('t_total', `₹ ${new Intl.NumberFormat('en-IN').format(data.Subtotal)}`)

        for (let i = 1; i <= 5; i++) {
            await replacer.addString(`ba${i}`, `${data.gst_table.basic_amount[`amount_${i}` as keyof typeof data.gst_table.basic_amount] ? data.gst_table.basic_amount[`amount_${i}` as keyof typeof data.gst_table.basic_amount] : "0.00 "}` + "₹")
            await replacer.addString(`cg${i}`, `${data.gst_table.cgst_amount[`amount_${i}` as keyof typeof data.gst_table.cgst_amount] ? data.gst_table.cgst_amount[`amount_${i}` as keyof typeof data.gst_table.cgst_amount] : "0.00 "}` + "₹")
            await replacer.addString(`sg${i}`, `${data.gst_table.sgst_amount[`amount_${i}` as keyof typeof data.gst_table.sgst_amount] ? data.gst_table.sgst_amount[`amount_${i}` as keyof typeof data.gst_table.sgst_amount] : "0.00 "}` + "₹")
            await replacer.addString(`ig${i}`, `${data.gst_table.igst_amount[`amount_${i}` as keyof typeof data.gst_table.igst_amount] ? data.gst_table.igst_amount[`amount_${i}` as keyof typeof data.gst_table.igst_amount] : "0.00 "}` + "₹")
        }

        for (let i = 1; i <= 6; i++) {
            await replacer.addString(`ob${i}`, ``)
            await replacer.addString(`oba${i}`, ``)
        }

        await replacer.addString('company_name', ``)
        await replacer.addString('ifsc', ``)
        await replacer.addString('bnumber', ``)
        await replacer.addString('bname', ``)

        await replacer.process(page);

        await pdfdoc.save(outputPart, PDFNet.SDFDoc.SaveOptions.e_linearized);
    };

    await PDFNet.runWithCleanup(replaceText);

    return outputPart;
}