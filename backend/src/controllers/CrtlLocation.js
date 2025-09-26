import Location from '../models/Location.js';

// GET all locations (con filtro opcional para activas)
export const getLocations = async (req, res) => {
  try {
    const { active } = req.query;
    const filter = active === 'true' ? { isActive: true } : {};
    
    const locations = await Location.find(filter).sort({ name: 1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single location by ID
export const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Ubicación no encontrada' });
    }
    res.json(location);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST new location
export const createLocation = async (req, res) => {
  const { name, lat, lng, address, openingHours } = req.body;

  try {
    // Validaciones básicas
    if (!name || !lat || !lng || !address) {
      return res.status(400).json({ 
        message: 'Nombre, latitud, longitud y dirección son obligatorios' 
      });
    }

    const newLocation = new Location({ 
      name, 
      lat, 
      lng, 
      address,
      openingHours: openingHours || "9:00 AM - 6:00 PM"
    });

    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Error de validación', 
        errors: err.errors 
      });
    }
    res.status(400).json({ message: err.message });
  }
};

// PUT update location
export const updateLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Ubicación no encontrada' });
    }

    const updated = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    res.json(updated);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Error de validación', 
        errors: err.errors 
      });
    }
    res.status(400).json({ message: err.message });
  }
};

// DELETE location
export const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Ubicación no encontrada' });
    }

    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ubicación eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};