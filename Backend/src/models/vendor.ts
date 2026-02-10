import mongoose, { Schema } from "mongoose";

const vendorSchema = new Schema({
    name: String,
    company: String,
    work_phone_number: Number,
    phone_number: Number,
    vendor_type: String,
    display_name: String,
    email: String,
    balance: {
        type: Number,
        default: 0
    },
    location: String,
    vendor_billing_address: {
        street_address: String,
        state: String,
        pincode: Number,
        city: String,
        area: String,
    },
    gst: String,
    creater_id: {
        type: Schema.Types.ObjectId,
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

const Vendor = mongoose.model("vendor", vendorSchema);

export default Vendor;
