const mongoose = require('mongoose');
const imagenSchema = new mongoose.Schema({
    url: String,
    public_id: String,
  });

  module.exports = mongoose.model("Imagen", imagenSchema);