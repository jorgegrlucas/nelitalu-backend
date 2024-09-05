import { json } from "express";
import Jewel from "../models/Jewel";

class JewelController{

    async index(req,res){
        const {active} = req.query;

        const jewels = await Jewel.find({active})

        return res.json(jewels)

    }

    async update(req, res){
        const {filename} = req.file;
        const {jewel_id} = req.params;
        const {description, name, price, active} = req.body

        await Jewel.updateOne({ _id: jewel_id}, {
            thumbnail: filename,
            description: description,
            name: name,
            price: price,
            active: active
        })


        return res.send()
    }

    async store(req, res){

        const {filename} = req.file
        const {description, name, price, active} = req.body

        const jewel = await Jewel.create({
            thumbnail: filename,
            description: description,
            name: name,
            price: price,
            active: active
        })

        return res.json(jewel)
    }

    async destroy(req,res){
        const {jewel_id} = req.body
        await Jewel.findByIdAndDelete({_id: jewel_id})

        return res.json({message: "excluido"})
    }
}

export default new JewelController();