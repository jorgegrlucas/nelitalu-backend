import Jewel from "../models/Jewel";

class DashboardController{
    async show(req, res){

        const jewels = await Jewel.find({})
        return res.json({ok: jewels})
    }
}

export default new DashboardController();
