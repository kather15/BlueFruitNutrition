const Location = require('../models/Location');

// GET all locations
const getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST new location
const createLocation = async (req, res) => {
  const { name, lat, lng } = req.body;
  try {
    const newLoc = new Location({ name, lat, lng });
    await newLoc.save();
    res.status(201).json(newLoc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT update location
const updateLocation = async (req, res) => {
  const { name, lat, lng } = req.body;
  try {
    const updated = await Location.findByIdAndUpdate(
      req.params.id,
      { name, lat, lng },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE location
const deleteLocation = async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ubicación eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation
};
