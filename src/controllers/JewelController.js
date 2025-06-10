import Jewel from "../models/Jewel";
import * as Yup from "yup";

class JewelController {
    async index(req, res) {
        const { active } = req.query;

        let filter = {};
        if (active !== undefined) {
            filter.active = active === "true" || active === true;
        }

        const jewels = await Jewel.find(filter);
        return res.json(jewels);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            description: Yup.string().required(),
            name: Yup.string().required(),
            price: Yup.number().required(),
            // active: Yup.boolean().required(),
            amount: Yup.number().required(),
        });

        // const { filename } = req.file;
        const { description, name, price, amount, product_id } = req.body;

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Falha na validacao" });
        }

        await Jewel.updateOne(
            { _id: product_id },
            {
                // thumbnail: filename,
                description: description,
                name: name,
                price: price,
                amount: amount,
            },
        );

        return res.send();
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            description: Yup.string().required(),
            name: Yup.string().required(),
            price: Yup.number().required(),
            // active: Yup.boolean().required(),
            amount: Yup.number().required(),
        });

        // const { filename } = req.file;
        const { description, name, price, amount } = req.body;

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Falha na validacao" });
        }

        const jewel = await Jewel.create({
            // thumbnail: filename,
            description: description,
            name: name,
            price: price,
            // active: active,
            amount: amount,
        });

        return res.json(jewel);
    }

    async destroy(req, res) {
        const { product_id } = req.params;
        await Jewel.findByIdAndDelete({ _id: product_id });

        return res.json({ message: "excluido" });
    }

    async check(productId, amount) {
        return await Jewel.findById(productId)
            .then((user) => {
                if (user) {
                    return amount <= user.amount;
                }
                return false;
            })
            .catch(() => {
                return false;
            });
    }
}

export default new JewelController();
