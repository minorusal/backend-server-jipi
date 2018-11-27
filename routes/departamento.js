var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Departamento = require('../models/departamento');
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Departamento.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, departamentos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando departamento',
                        errors: err
                    });
                }
                Departamento.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        departamentos: departamentos,
                        total: conteo
                    });
                });
            });
});

// ========================================== 
// Obtener Departamento por ID 
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Departamento.findById(id).populate('usuario', 'nombre img email').exec((err, departamento) => {
        if (err) { return res.status(500).json({ ok: false, mensaje: 'Error al buscar departamento', errors: err }); }
        if (!departamento) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El departamento con el id ' + id + ' no existe',
                errors: { message: 'No existe un departamento con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            despartamento: departamento
        });
    });
});

// =======================================
// Actualizar un nuevo Departamento
// =======================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Departamento.findById(id, (err, departamento) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar departamento',
                errors: err
            });
        }

        if (!departamento) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El departamento con el id ' + id + 'no existe',
                errors: { message: 'No existe el departamento con ese ID' }
            });
        }
        departamento.nombre = body.nombre;
        departamento.clave_corta = body.clave_corta;
        departamento.descripcion = body.descripcion;
        departamento.usuario = req.usuario._id;

        departamento.save((err, departamentoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar departamento',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                departamento: departamentoGuardado
            });
        });

    });
});

// =======================================
// Crear un nuevo departamento
// =======================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var departamento = new Departamento({
        nombre: body.nombre,
        clave_corta: body.clave_corta,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    departamento.save((err, pdepartamentoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear departamento',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            departamento: pdepartamentoGuardado
        });
    });
});


module.exports = app;