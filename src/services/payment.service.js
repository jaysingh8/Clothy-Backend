import Razorpay from "razorpay";
import { config } from "../config/config.js";

// Removed: const razorpay = new Razorpay(...)  ← was crashing at startup

export async function createOrder({ amount, currency = "INR" }) {
    const razorpay = new Razorpay({          // ← moved inside the function
        key_id: config.RAZORPAY_KEY_ID,
        key_secret: config.RAZORPAY_KEY_SECRET
    });

    const options = {
        amount: Math.round(amount * 100),
        currency,
    };

    const order = await razorpay.orders.create(options);
    return order;
}