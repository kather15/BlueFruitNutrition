const customersController = {};
import customersModel from "../models/Customers.js";

//SELECT*******************************************************************
customersController.getCustomers = async (req, res) => {
    try {
        const customer = await customersModel.find();
        res.status(200).json(customer)

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log("error: " + error)

    }

}

//INSERT*******************************************************************
//este insert no es necesario, usar el register
customersController.postCustomers = async (req, res) => {
    try {
        const { name, lastName, email, password, phone, weight, dateBirth, height, address, gender, idSports, isVerified } = req.body;
        //validar campos obligatorios
        if(!name || !lastName || !email || !password || !dateBirth){
              return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        const newCustomer = new customersModel({ name, lastName, email, password, phone, weight, dateBirth, height, address, gender, idSports, isVerified })
        await newCustomer.save();
        res.status(200).json({ message: "customer saved" })
        
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log("error: " + error)
    }

}

//DELETE*******************************************************************
customersController.deleteCustomers = async (req, res) => {
    try {
        await customersModel.findByIdAndDelete(req.params.id)
        res.json({message: "customer deleted"})
        res.status(200).json({ message: "customer deleted" })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log("error: " + error)
    }
}

//UPDATE*******************************************************************
customersController.putCustomers = async (req, res) => {

    try {
        const { name, lastName, email, password, phone, weight, dateBirth, height, address, gender, idSports, isVerified } = req.body;
        const updateCustomer = await customersModel.findByIdAndUpdate(req.params.id, {
            name, lastName, email, password, phone, weight, dateBirth, height,
            address, gender, idSports, isVerified
        }, { new: true })
    
        res.status(200).json({ message: "customer updated" })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log("error: " + error)
    }


}

export default customersController;