import Orden from "../models/Ordenes.js";

const ordenesController = {};

// SELECT*******************************************************************
ordenesController.getOrdenes = async (req, res) => {
    try {
        const ordenes = await Orden.find();
        res.status(200).json(ordenes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener órdenes' });
        console.log("error: " + error);
    }
};

// INSERT*******************************************************************
ordenesController.crearOrden = async (req, res) => {
    try {
        const { numeroOrden, fecha, total, items, estado } = req.body;

        // Validar campos obligatorios
        if (!numeroOrden || !fecha || !total || !items || !estado) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        const nuevaOrden = new Orden(req.body);
        const ordenGuardada = await nuevaOrden.save();
        res.status(201).json(ordenGuardada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la orden' });
        console.log("error: " + error);
    }
};

// SELECT POR ID************************************************************
ordenesController.getOrdenPorId = async (req, res) => {
    try {
        const orden = await Orden.findById(req.params.id);
        if (!orden) return res.status(404).json({ mensaje: 'Orden no encontrada' });
        res.status(200).json(orden);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la orden' });
        console.log("error: " + error);
    }
};

// DELETE*******************************************************************
ordenesController.eliminarOrden = async (req, res) => {
    try {
        await Orden.findByIdAndDelete(req.params.id);
        res.status(200).json({ mensaje: 'Orden eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar orden' });
        console.log("error: " + error);
    }
};

// CONTADOR*****************************************************************
ordenesController.contarOrdenesEnProceso = async (req, res) => {
    try {
        const totalEnProceso = await Orden.countDocuments({ estado: 'En proceso' });
        res.status(200).json({ totalEnProceso });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al contar órdenes en proceso' });
        console.log("error: " + error);
    }
};

export default ordenesController;
