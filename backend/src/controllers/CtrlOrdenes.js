import Orden from "../models/Ordenes.js";

// Obtener todas las órdenes
const getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find();
    res.status(200).json(ordenes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener órdenes' });
    console.log("error: " + error);
  }
};

// Crear nueva orden
const crearOrden = async (req, res) => {
  try {
    const { numeroOrden, fecha, total, items, estado, productos } = req.body;

    if (!numeroOrden || !fecha || !total || !items || !estado) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    if (!productos || productos.length === 0) {
      return res.status(400).json({ mensaje: 'La orden debe tener al menos un producto.' });
    }

    const nuevaOrden = new Orden(req.body);
    const ordenGuardada = await nuevaOrden.save();
    res.status(201).json(ordenGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear la orden' });
    console.log("error: " + error);
  }
};

// Obtener orden por ID
const getOrdenPorId = async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.id);
    if (!orden) return res.status(404).json({ mensaje: 'Orden no encontrada' });
    res.status(200).json(orden);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la orden' });
    console.log("error: " + error);
  }
};

// Eliminar orden
const eliminarOrden = async (req, res) => {
  try {
    await Orden.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: 'Orden eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar orden' });
    console.log("error: " + error);
  }
};

// Contar órdenes en proceso
const contarOrdenesEnProceso = async (req, res) => {
  try {
    const totalEnProceso = await Orden.countDocuments({ estado: 'En proceso' });
    res.status(200).json({ totalEnProceso });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al contar órdenes en proceso' });
    console.log("error: " + error);
  }
};

export default {
  getOrdenes,
  crearOrden,
  getOrdenPorId,
  eliminarOrden,
  contarOrdenesEnProceso
};
