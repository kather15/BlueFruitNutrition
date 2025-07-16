const distributorsController = {};
import distributosModel from "../models/Distributors.js";

//SELECT*******************************************************************
distributorsController.getDistributors = async (req, res) => {
    try {
        const distributor = await distributosModel.find();

        res.json(distributor)


    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log("error: " + error)
    }

}

//INSERT*******************************************************************
distributorsController.postDistributors = async (req, res) => {
    try {
        const { companyName, email, password, address, phone, status, taxId, isVerified } = req.body;
        const newDistributor = new distributosModel({ companyName, email, password, address, phone, status, taxId, isVerified })
        await newDistributor.save();

        res.json({ message: "Distributor saved" })
        res.status(200).json({ message: "distrubutor saved" })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log("error: " + error)
        
    }

}

//DELETE*******************************************************************
distributorsController.deleteDistributors = async (req, res) => {
    try {
        await distributosModel.findByIdAndDelete(req.params.id)

        res.json({ message: "Distributor deleted" })
        res.status(200).json({ message: "distrubutor deleted" })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log("error: " + error)
    }

}

//UPDATE*******************************************************************
distributorsController.putDistributors = async (req, res) => {
    try {
        const { companyName, email, password, address, phone, status, taxId, isVerified } = req.body;
        const updateDistributor = await distributosModel.findByIdAndUpdate(req.params.id, {
            companyName, email, password,
            address, phone, status, taxId, isVerified
        }, { new: true })
        res.status(200).json({ message: "distrubutor updated" })
        res.json({ message: "Distributor updated" })


    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log("error: " + error)
    }


    res.json({ message: "Distributor updated" })
}

export default distributorsController;