const express = require('express');
const rutas = express.Router();
const ProductoModel = require('../models/Producto');

//LISTAR DATOS
rutas.get('/', async (req, res) => {
    try {
        const productos = await ProductoModel.find();
        console.log(productos);
        res.json(productos);
    }
    catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
});

//AGREGAR DATOS
rutas.post('/agregar', async (req, res) => {
    console.log(req.body);
    const nuevoProducto = new ProductoModel({
        codigo: req.body.codigo,
        descripcion: req.body.descripcion,
        precioCompra: req.body.precioCompra,
        precioVenta: req.body.precioVenta,
        stock: req.body.stock,
        medida: req.body.medida,
        categoria: req.body.categoria,
        foto: req.body.foto,
        activo: req.body.activo,
        fechaRegistro: req.body.fechaRegistro

    });
    try {
        const guardarProducto = await nuevoProducto.save();
        res.status(201).json(guardarProducto);

    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

//ACTUALIZACIÓN DE DATOS
rutas.put('/editar/:id', async (req, res) => {
    try {
        const actualizarProducto = await ProductoModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json(actualizarProducto);

    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

//ELIMINACIÓN DE REGISTRO
rutas.delete('/eliminar/:id', async (req, res) => {
    try {
        const eliminarProducto = await ProductoModel.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Registro eliminado correctamente' });

    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});


//CONSULTAS

//Consulta 1: Buscar por nombre de producto
rutas.get('/consulta1/:descripcion', async (req, res) => {
    try {
        const descripcion = await ProductoModel.find({ descripcion: req.params.descripcion });
        res.json(descripcion)
    }
    catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
});

//Consulta 2: Buscar por coincidencia de descripción de producto
rutas.get('/consulta2/:descripcion', async (req, res) => {
    try {
        const coincidencia = await ProductoModel.find({ $text: { $search: req.params.descripcion } })
        res.json(coincidencia);
    } catch (error) {
        res.status(404).json({ mensaje: error.mensaje })
    }
});

//Consulta 3: Búsqueda por id
rutas.get('/consulta3/:id', async (req, res) => {
    try {
        const citaId = await ProductoModel.findOne({ _id: req.params.id });
        res.json(citaId);
    } catch (error) {
        res.status(404).json({ mensaje: error.mensaje })
    }
});

//Consulta 4: Ordenar por codigo descendentemente
rutas.get('/consulta4', async (req, res) => {
    try {
        const registroDescendente = await ProductoModel.find().sort({ codigo: -1 });
        res.json(registroDescendente);
    } catch (error) {
        res.status(404).json({ mensaje: error.mensaje })
    }
});

//Consulta 5: Listar por  CATEGORIA
rutas.get('/consulta5/:categoria', async (req, res) => {
    try {
        const categoria = await ProductoModel.find({ categoria: req.params.categoria });
        res.json(categoria)
    }
    catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
});

//Consulta 6: listar por fecha de registro Descendente
rutas.get('/consulta6', async (req, res) => {
    try {
        const listaFecha = await ProductoModel.find().sort({ fechaRegistro: -1 });
        res.json(listaFecha);
    } catch (error) {
        res.status(404).json({ mensaje: error.mensaje })
    }
});

//Consulta 7: Buscar por fecha de registro
rutas.get('/consulta7/:fecha', async (req, res) => {
    try {
        const fechaReg = await ProductoModel.find({ fechaRegistro: req.params.fecha });
        res.json(fechaReg);
    } catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
});

//Consulta 8: Listar productos activos e inactivos
rutas.get('/consulta8/:activo', async (req, res) => {
    try {
        const activos = await ProductoModel.find({ activo: req.params.activo });
        res.json(activos);
    } catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
});

//Consulta 9: Listar productos con stock inferior a:
rutas.get('/consulta9/:cantidad', async (req, res) => {
    try {
        const producto = await ProductoModel.find({ stock: { $lte: req.params.cantidad } })
        res.json(producto);
    } catch (error) {
        res.status(404).json({ mensaje: error.mensaje })
    }
});

//Consulta 10: Listar productos por nombre
rutas.get('/consulta10', async (req, res) => {
    try {
        const productos = await ProductoModel.find().sort({ descripcion: 1 });
        res.json(productos);
    } catch (error) {
        res.status(404).json({ mensaje: error.mensaje })
    }
});

//Consulta 11: Listar productos con un rango de precios
rutas.get('/consulta11/:pMin/:pMax', async (req, res) => {
    try {
        const { pMin, pMax } = req.params;
        const productoRangoPrecio = await ProductoModel.find({
            precioVenta: {
                $gte: pMin,
                $lte: pMax
            }
        })
            .sort({ precioVenta: 1 })
            .select('codigo descripcion precioCompra precioVenta stock medida categoria foto activo fechaRegistro');
        if (productoRangoPrecio.length === 0) {
            return res.json({ mensaje: `No existe el ragon precios definidos ${pMin} - ${pMax}` });
        }
        res.json(productoRangoPrecio);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

//Consulta 12: Consulta de rango de fecha de registro de productos
rutas.get('/consulta12', async (req, res) => {
    try {
        const producto = await ProductoModel.find({
            fechaRegistro: {
                $gte: new Date("2024-04-01T00:00:00.000Z"),
                $lte: new Date("2024-04-30T00:00:00.000Z")
            }
        });
        res.json(producto);
    }
    catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
});

//Consulta 13: Buscar producto más caro en precio de venta
rutas.get('/consulta13', async (req, res) => {
    try {
        const masCaro = await ProductoModel.findOne().sort({ precioVenta: -1 });
        res.json(masCaro);
    }
    catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
});


//Consulta 14: Listar productos en un rango de fechas
rutas.get('/consulta14/:inicio/:final', async (req, res) => {
    try {
        const { inicio, final } = req.params;
        const rangoFecha = await ProductoModel.find({
            fechaRegistro: {
                $gte: inicio,
                $lte: final
            }
        })
            .sort({ fechaRegistro: 1 })
            .select('codigo descripcion precioCompra precioVenta stock medida categoria foto activo fechaRegistro');
        if (rangoFecha.length === 0) {
            return res.json({ mensaje: `Productos inexistentes en el rango de fechas definidas ${inicio} - ${final}` });
        }
        res.json(rangoFecha);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});





module.exports = rutas;
