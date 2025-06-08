import { Request, Response } from "express";
import axios from "axios";

const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
).toString("base64");

export const PaypalController = {
    async createOrder(req: Request, res: Response) {
        try {
            const auth = Buffer.from(
                `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
            ).toString("base64");
            const response = await axios.post(
                "https://api-m.sandbox.paypal.com/v2/checkout/orders",
                {
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            amount: {
                                currency_code: "BRL",
                                value: "100.00", // Substitua pelo subtotal real!
                            },
                        },
                    ],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${auth}`,
                    },
                },
            );

            res.json({ orderId: response.data.id });
        } catch (error) {
            console.error("Erro ao criar order:", error);
            res.status(500).json({ message: "Erro ao criar order no PayPal" });
        }
    },

    async captureOrder(req: Request, res: Response) {
        try {
            const { orderId } = req.body;
            const auth = Buffer.from(
                `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
            ).toString("base64");

            await axios.post(
                `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${auth}`,
                    },
                },
            );

            res.json({ status: "completed" });
        } catch (error) {
            console.error("Erro ao capturar order:", error);
            res.status(500).json({
                message: "Erro ao capturar order no PayPal",
            });
        }
    },
};
