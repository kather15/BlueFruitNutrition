import Location from '../models/Location.js';

// GET all locations (con filtro opcional para activas)
export const getLocations = async (req, res) => {
  try {
    console.log('📥 GET /api/locations - Obteniendo ubicaciones');
    const { active } = req.query;
    const filter = active === 'true' ? { isActive: true } : {};
    
    const locations = await Location.find(filter).sort({ name: 1 });
    console.log(`✅ Encontradas ${locations.length} ubicaciones`);
    res.json(locations);
  } catch (err) {
    console.error('❌ Error en getLocations:', err);
    res.status(500).json({ message: err.message });
  }
};

// GET single location by ID
export const getLocationById = async (req, res) => {
  try {
    console.log(`📥 GET /api/locations/${req.params.id}`);
    const location = await Location.findById(req.params.id);
    if (!location) {
      console.log('⚠️ Ubicación no encontrada');
      return res.status(404).json({ message: 'Ubicación no encontrada' });
    }
    console.log('✅ Ubicación encontrada:', location.name);
    res.json(location);
  } catch (err) {
    console.error('❌ Error en getLocationById:', err);
    res.status(500).json({ message: err.message });
  }
};

// POST new location
export const createLocation = async (req, res) => {
  try {
    console.log('📥 POST /api/locations - Creando ubicación');
    console.log('📦 Body recibido:', req.body);
    
    const { name, lat, lng, address, openingHours } = req.body;

    // Validaciones básicas
    if (!name || !lat || !lng || !address) {
      console.log('⚠️ Faltan campos obligatorios');
      return res.status(400).json({ 
        message: 'Nombre, latitud, longitud y dirección son obligatorios',
        received: { name, lat, lng, address }
      });
    }

    // Validar coordenadas
    if (lat < -90 || lat > 90) {
      return res.status(400).json({ message: 'Latitud inválida (-90 a 90)' });
    }
    if (lng < -180 || lng > 180) {
      return res.status(400).json({ message: 'Longitud inválida (-180 a 180)' });
    }

    const newLocation = new Location({ 
      name: name.trim(), 
      lat: parseFloat(lat), 
      lng: parseFloat(lng), 
      address: address.trim(),
      openingHours: openingHours || "9:00 AM - 6:00 PM"
    });

    console.log('💾 Guardando ubicación:', newLocation);
    const savedLocation = await newLocation.save();
    console.log('✅ Ubicación guardada exitosamente:', savedLocation._id);
    
    res.status(201).json(savedLocation);
  } catch (err) {
    console.error('❌ Error en createLocation:', err);
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
    console.log(`📥 PUT /api/locations/${req.params.id}`);
    console.log('📦 Body recibido:', req.body);
    
    const location = await Location.findById(req.params.id);
    if (!location) {
      console.log('⚠️ Ubicación no encontrada para actualizar');
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
    
    console.log('✅ Ubicación actualizada:', updated._id);
    res.json(updated);
  } catch (err) {
    console.error('❌ Error en updateLocation:', err);
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
    console.log(`📥 DELETE /api/locations/${req.params.id}`);
    
    const location = await Location.findById(req.params.id);
    if (!location) {
      console.log('⚠️ Ubicación no encontrada para eliminar');
      return res.status(404).json({ message: 'Ubicación no encontrada' });
    }

    await Location.findByIdAndDelete(req.params.id);
    console.log('✅ Ubicación eliminada:', req.params.id);
    res.json({ message: 'Ubicación eliminada' });
  } catch (err) {
    console.error('❌ Error en deleteLocation:', err);
    res.status(500).json({ message: err.message });
  }
};