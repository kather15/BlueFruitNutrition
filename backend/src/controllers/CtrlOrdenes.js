const Orden = require('../models/Orden');

// Obtener todas las órdenes
exports.getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find();
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener órdenes' });
  }
};

// Crear nueva orden
exports.crearOrden = async (req, res) => {
  try {
    const nuevaOrden = new Orden(req.body);
    const ordenGuardada = await nuevaOrden.save();
    res.status(201).json(ordenGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear la orden' });
  }
};

// Obtener orden por ID
exports.getOrdenPorId = async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.id);
    if (!orden) return res.status(404).json({ mensaje: 'Orden no encontrada' });
    res.json(orden);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la orden' });
  }
};

// Eliminar orden
exports.eliminarOrden = async (req, res) => {
  try {
    await Orden.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Orden eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar orden' });
  }
};
