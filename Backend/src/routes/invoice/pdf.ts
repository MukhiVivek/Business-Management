import { PDFNet } from '@pdftron/pdfnet-node';
import path from 'path';
import numberToWord from 'number-to-words';

PDFNet.initialize(process.env.PDFNET_LINK);

interface data {
    customer_id: {
        _id: string;
        name: string;
        phone_number: string;
        customer_billing_address: {
            street_addres: string;
            area: string;
            city: string;
            state: string;
            pincode: string;
        }
    };
    invoice_number: number;
    invoice_date: Date;
    due_date: Date;
    Subtotal: number;
    status: string;
    description: string;
    items: {
        id: number;
        name: string;
        qty: number;
        price: number;
        amount: number;
    }[];
}


// Generate invoice PDF and return output file path
export async function generateInvoicePdf(data: data): Promise<string> {

    console.log(data);

    const amount_word1 = numberToWord.toWords(data.Subtotal);
    let total_qty = 0;

    // const inputPart = path.resolve(__dirname, `../files/invoicePdf.pdf`);
    const inputPart = path.resolve(__dirname, `../files/fullinvoice.pdf`);
    const outputPart = path.resolve(__dirname, `../files/invoice.pdf`);

    const replaceText = async () => {
        const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPart);
        await pdfdoc.initSecurityHandler();
        const replacer = await PDFNet.ContentReplacer.create();
        const page = await pdfdoc.getPage(1);

        await replacer.addString('bill_number', `${data.invoice_number}`)
        await replacer.addString('date', `${new Date(data.invoice_date).toLocaleDateString('en-GB')}`)
        await replacer.addString('customer_name', `${data.customer_id.name}`)
        await replacer.addString('customer_name1', `${data.customer_id.name}`)
        await replacer.addString('amount_word', `${amount_word1}`)
        await replacer.addString('mobile_number', `${data.customer_id.phone_number}`)
        await replacer.addString('mobile_number1', `${data.customer_id.phone_number}`)

        for (let i = 0; i < data.items.length; i++) {
            await replacer.addString(`no${i}`, `${i + 1}`)
            await replacer.addString(`item_name${i}`, `${data.items[i].name}`)
            await replacer.addString(`qty${i}`, `${data.items[i].qty}`)
            await replacer.addString(`rate${i}`, `${data.items[i].price}`)
            await replacer.addString(`amont${i}`, `${new Intl.NumberFormat('en-IN').format(data.items[i].amount)}`);
            total_qty = total_qty + data.items[i].qty;
        }
        for (let i = data.items.length; i < 23; i++) {
            await replacer.addString(`no${i}`, ``)
            await replacer.addString(`item_name${i}`, ``)
            await replacer.addString(`qty${i}`, ``)
            await replacer.addString(`rate${i}`, ``)
            await replacer.addString(`amont${i}`, ``)
        }

        if ("" == data.customer_id.customer_billing_address.area) {
            await replacer.addString(`customer_address`, ``)
            await replacer.addString(`customer_address1`, ``)
        } else {
            await replacer.addString(`customer_address`, `${data.customer_id.customer_billing_address.street_addres} , ${data.customer_id.customer_billing_address.area} , ${data.customer_id.customer_billing_address.city} , ${data.customer_id.customer_billing_address.state} - ${data.customer_id.customer_billing_address.pincode}    `)
            await replacer.addString(`customer_address1`, `${data.customer_id.customer_billing_address.street_addres} , ${data.customer_id.customer_billing_address.area} , ${data.customer_id.customer_billing_address.city} , ${data.customer_id.customer_billing_address.state} - ${data.customer_id.customer_billing_address.pincode}    `)
        }
        await replacer.addString('t_qty', `${total_qty}`)
        await replacer.addString('charge', "150")

        await replacer.addString('t_amount', `₹ ${new Intl.NumberFormat('en-IN').format(data.Subtotal)}`)
        await replacer.process(page);

        await pdfdoc.save(outputPart, PDFNet.SDFDoc.SaveOptions.e_linearized);
    };

    await PDFNet.runWithCleanup(replaceText);

    return outputPart;
}