var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Proveedor = require('../models/proveedor');
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Proveedor.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, proveedores) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando proveedor',
                        errors: err
                    });
                }
                Proveedor.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        proveedores: proveedores,
                        total: conteo
                    });
                });
            });
});

// ========================================== 
// Obtener Proveedor por ID 
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Proveedor.findById(id).populate('usuario', 'nombre img email').exec((err, proveedor) => {
        if (err) { return res.status(500).json({ ok: false, mensaje: 'Error al buscar proveedor', errors: err }); }
        if (!proveedor) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El proveedor con el id ' + id + ' no existe',
                errors: { message: 'No existe un proveedor con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            proveedor: proveedor
        });
    });
});

// =======================================
// Actualizar un nuevo Proveedor
// =======================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Proveedor.findById(id, (err, proveedor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar proveedor',
                errors: err
            });
        }

        if (!proveedor) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El proveedor con el id ' + id + 'no existe',
                errors: { message: 'No existe el proveedor con ese ID' }
            });
        }
        proveedor.nombre = body.nombre;
        proveedor.usuario = req.usuario._id;

        proveedor.save((err, proveedorGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar proveedor',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                proveedor: proveedorGuardado
            });
        });

    });
});

// =======================================
// Crear un nuevo proveedor
// =======================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var proveedor = new Proveedor({
        nombre: body.nombre,
        rfc: body.rfc,
        correo: body.correo,
        telefono: body.telefono,
        whatsapp: body.whatsapp,
        usuario: req.usuario._id
    });
    proveedor.save((err, proveedorGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear proveedor',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            proveedor: proveedorGuardado
        });
    });
});

// =======================================
// Borrar un proveedor por ID
// =======================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Proveedor.findByIdAndRemove(id, (err, proveedorBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar proveedor',
                errors: err
            });
        }

        if (!proveedorBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un proveedor con ese ID',
                errors: { message: 'No existe un proveedor con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            proveedor: proveedorBorrado
        });
    });
});
module.exports = app;