import { Request, Response } from "express";
import axios from "axios";
const PAYPAL_API = "https://api-m.sandbox.paypal.com";

function getBasicAuthHeader() {
    const auth = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
    ).toString("base64");
    return `Basic ${auth}`;
}

export const PaypalController = {
    async createOrder(req: Request, res: Response) {
        try {
            const response = await axios.post(
                `${PAYPAL_API}/v2/checkout/orders`,
                {
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            amount: {
                                currency_code: "BRL",
                                value: req.body.subtotal,
                            },
                        },
                    ],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: getBasicAuthHeader(),
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
        const { orderId } = req.body;
        try {
            const captureResp = await axios.post(
                `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: getBasicAuthHeader(),
                    },
                },
            );

            const captureData = captureResp.data;
            const purchaseUnit = captureData.purchase_units?.[0];
            const capture = purchaseUnit?.payments?.captures?.[0];

            if (captureData.status !== "COMPLETED" || !capture) {
                return res
                    .status(400)
                    .json({ message: "Pagamento não concluído" });
            }

            //   const orderRecord = new OrderModel({
            //     paypalOrderId: orderId,
            //     payerId: captureData.payer?.payer_id,
            //     amount: capture.amount.value,
            //     currency: capture.amount.currency_code,
            //     status: capture.status,            // geralmente "COMPLETED"
            //     createTime: captureData.create_time,
            //     captureId: capture.id,
            //     captureTime: capture.create_time,
            //   });
            //   await orderRecord.save();

            res.json({ status: "completed" });
        } catch (error) {
            console.error(
                "Erro ao capturar order:",
                error.response?.data || error,
            );
            res.status(500).json({
                message: "Erro ao capturar order no PayPal",
            });
        }
    },
};
