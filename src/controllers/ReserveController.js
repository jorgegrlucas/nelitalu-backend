import Reserve from "../models/Reserve";
import User from "../models/User";
import Jewel from "../models/Jewel";

class ReserveController{
    async store(req, res){
        const { user_id } = req.headers
        const { jewel_id } = req.params
        const { date } = req.body

        const jewel = await Jewel.findById(jewel_id)
        if(!jewel){
            return res.status(400).json({ error: 'Essa jóia não existe'});
        }

        if(!jewel.active){
            return res.status(400).json({ error: 'Essa jóia não possui estoque'});
        }

        const reserve = await Reserve.create({
            user: user_id,
            jewel: jewel_id,
            date,
        });

        await(await reserve.populate('jewel')).populate('user');

        return res.json(reserve)
    }

    async index(req,res){

        const { user_id } = req.headers;

        const reserves = await Reserve.find({user: user_id}).populate('jewel');

        // await reserves.populate('jewel');

        return res.json(reserves); 

    }

    async destroy(req,res){
        const {reserve_id} = req.body
        const result = await Reserve.findByIdAndDelete({_id: reserve_id})

        if(!result) return res.json({message: "Essa reserva não existe"})        

        return res.json({message: "excluido"})
    }
}

export default new ReserveController();