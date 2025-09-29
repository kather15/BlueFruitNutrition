import Orden from '../models/Ordenes.js';

// Obtener todas las órdenes
const getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find();
    res.status(200).json(ordenes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener órdenes' });
  }
};

// Crear nueva orden
const crearOrden = async (req, res) => {
  try {
    if (!req.body.productos || req.body.productos.length === 0) {
      return res.status(400).json({ mensaje: 'La orden debe tener al menos un producto.' });
    }

    const numeroOrden = Date.now().toString(); // Generador de ID simple
    const fecha = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const total = req.body.productos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    const items = req.body.productos.reduce((acc, p) => acc + p.cantidad, 0);
    const estado = 'En proceso';

    const nuevaOrden = new Orden({
      numeroOrden,
      fecha,
      total,
      items,
      estado,
      productos: req.body.productos,
      usuario: req.body.usuario || null // si quieres guardar info del usuario
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
    res.status(200).json(orden);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener la orden' });
  }
};

// Eliminar orden
const eliminarOrden = async (req, res) => {
  try {
    await Orden.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: 'Orden eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar orden' });
  }
};

// Contar órdenes en proceso
const contarOrdenesEnProceso = async (req, res) => {
  try {
    const totalEnProceso = await Orden.countDocuments({ estado: 'En proceso' });
    res.status(200).json({ totalEnProceso });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al contar órdenes en proceso' });
  }
};

// Actualizar orden por ID (estado)
const actualizarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['Pendiente', 'En proceso', 'Completada', 'Cancelada'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ mensaje: 'Estado no válido' });
    }

    const ordenActualizada = await Orden.findByIdAndUpdate(id, { estado }, { new: true });

    if (!ordenActualizada) {
      return res.status(404).json({ mensaje: 'Orden no encontrada' });
    }

    res.status(200).json(ordenActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar la orden' });
  }
};

// Obtener órdenes por usuario
const getOrdenesPorUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    const ordenes = await Orden.find({ "usuario.id": userId }); // ajusta según cómo guardes el userId
    res.status(200).json(ordenes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener órdenes del usuario' });
  }
};

export default {
  getOrdenes,
  crearOrden,
  getOrdenPorId,
  eliminarOrden,
  contarOrdenesEnProceso,
  actualizarOrden,
  getOrdenesPorUsuario
};
