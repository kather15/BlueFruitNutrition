import Orden from '../models/Ordenes.js';

// Obtener todas las órdenes
const getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find();
     console.log(ordenes);
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener órdenes' });
  }
};

// Crear nueva orden
const crearOrden = async (req, res) => {
  try {
    if (!req.body.productos || req.body.productos.length === 0) {
      return res.status(400).json({ mensaje: 'La orden debe tener al menos un producto.' });
    }

    const numeroOrden = Date.now().toString(); // O cualquier generador de ID
    const fecha = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const total = req.body.productos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    const items = req.body.productos.length;

    const nuevaOrden = new Orden({
      numeroOrden,
      fecha,
      total,
      items,
      estado: 'En proceso'
    });

    const ordenGuardada = await nuevaOrden.save();
    res.status(201).json(ordenGuardada);
  } catch (error) {
    console.error(error);
    res.status(400).json({ mensaje: 'Error al crear la orden' });
  }
};

// Obtener orden por ID
const getOrdenPorId = async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.id);
    if (!orden) return res.status(404).json({ mensaje: 'Orden no encontrada' });
    res.json(orden);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la orden' });
  }
};

// Eliminar orden
const eliminarOrden = async (req, res) => {
  try {
    await Orden.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Orden eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar orden' });
  }
};

// Exportar todo como un objeto
export default {
  getOrdenes,
  crearOrden,
  getOrdenPorId,
  eliminarOrden
};
