const mongoose = require('mongoose');

const productoEsquema = new mongoose.Schema({
    codigo: Number,
    descripcion: String,
    precioCompra: Number,
    precioVenta: Number,
    stock: Number,
    medida: String,
    categoria: String,
    foto: String,
    activo: Number,
    fechaRegistro: Date
})

const ProductoModel = mongoose.model('Producto', productoEsquema, 'producto');
module.exports = ProductoModel;