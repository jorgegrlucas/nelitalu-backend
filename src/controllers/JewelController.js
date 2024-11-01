import { json } from "express";
import Jewel from "../models/Jewel";
import * as Yup from 'yup';

class JewelController{

    async index(req,res){
        const {active} = req.query;

        const jewels = await Jewel.find({active})

        return res.json(jewels)

    }

    async update(req, res){
        const schema = Yup.object().shape({
            description: Yup.string().required(),
            name: Yup.string().required(),
            price: Yup.number().required(),
            active: Yup.boolean().required()
        })

        const {filename} = req.file;
        const {jewel_id} = req.params;
        const {description, name, price, active} = req.body
        
        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Falha na validacao'})
        }

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
        const schema = Yup.object().shape({
            description: Yup.string().required(),
            name: Yup.string().required(),
            price: Yup.number().required(),
            active: Yup.boolean().required()
        })

        const {filename} = req.file
        const {description, name, price, active} = req.body

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Falha na validacao'})
        }

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