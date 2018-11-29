var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Empleado = require('../models/empleado');
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Empleado.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, empleados) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando empleados',
                        errors: err
                    });
                }
                Empleado.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        empleados: empleados,
                        total: conteo
                    });
                });
            });
});

// ========================================== 
// Obtener Empleado por ID 
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Empleado.findById(id).populate('usuario', 'nombre img email').exec((err, empleado) => {
        if (err) { return res.status(500).json({ ok: false, mensaje: 'Error al buscar empleado', errors: err }); }
        if (!empleado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El empleado con el id ' + id + ' no existe',
                errors: { message: 'No existe un empleado con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            empleado: empleado
        });
    });
});

// =======================================
// Actualizar un nuevo Empleado
// =======================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Empleado.findById(id, (err, empleado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar empleado',
                errors: err
            });
        }

        if (!empleado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El empleado con el id ' + id + 'no existe',
                errors: { message: 'No existe el empleado con ese ID' }
            });
        }
        empleado.nombre = body.nombre;
        empleado.apellidos = body.apellidos;
        empleado.alias = body.alias;
        empleado.correo = body.correo;
        empleado.nip = body.nip;
        empleado.whatsapp = body.whatsapp;
        empleado.usuario = req.usuario._id;

        empleado.save((err, empleadoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar empleado',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                empleado: empleadoGuardado
            });
        });

    });
});

// =======================================
// Crear un nuevo empleado
// =======================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var empleado = new Empleado({
        nombre: body.nombre,
        apellidos: body.apellidos,
        alias: body.alias,
        correo: body.correo,
        nip: body.nip,
        whatsapp: body.whatsapp,
        usuario: req.usuario._id
    });
    empleado.save((err, empleadoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear empleado',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            empleado: empleadoGuardado
        });
    });
});


module.exports = app;