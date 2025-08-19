import Subscription from '../models/Subscriptions.js';

// Obtener todas las suscripciones
export const getSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find();
    res.json(subs);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener suscripciones' });
  }
};

// Crear una suscripción desde pública
export const createSubscription = async (req, res) => {
  try {
    const { usuario, plan, precio } = req.body;

    if (!usuario || !plan || !precio) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const nueva = new Subscription({
      suscripcionId: Date.now().toString(),  // Genera un ID único
      fechaInicio: new Date().toISOString(), // Fecha actual
      usuario,
      precio,
      plan,
      estado: 'Activo'                        // Estado por defecto
    });

    await nueva.save();
    res.status(201).json(nueva);            // Devuelve la suscripción creada
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear suscripción', error: error.message });
  }
};

// Eliminar una suscripción
export const deleteSubscription = async (req, res) => {
  try {
    await Subscription.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar suscripción' });
  }
};

// Actualizar suscripción
export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Subscription.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'No encontrada' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar suscripción' });
  }
};
 