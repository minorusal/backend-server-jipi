var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Material = require('../models/material');
// =======================================
// Obtener todos los Materiales
// =======================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Material.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, materiales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando material',
                        errors: err
                    });
                }
                Material.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        materiales: materiales,
                        total: conteo
                    });
                });
            });
});

// ========================================== 
// Obtener Material por ID 
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Material.findById(id)
        // .populate('departamento', 'nombre')
        .populate('proveedor')
        .populate('usuario', 'nombre img email')
        .exec((err, material) => {
            if (err) { return res.status(500).json({ ok: false, mensaje: 'Error al buscar material', errors: err }); }
            if (!material) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El material con el id ' + id + ' no existe',
                    errors: { message: 'No existe un material con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                material: material
            });
        });
});

// =======================================
// Crear un nuevo material
// =======================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var material = new Material({
        nombre: body.nombre,
        clave_corta: body.clave_corta,
        descripcion: body.descripcion,
        presentacion: body.presentacion,
        unidadPresentacion: body.unidadPresentacion,
        largo: body.largo,
        ancho: body.ancho,
        alto: body.alto,
        count_litros: body.count_litros,
        res_volumen: body.res_volumen,
        res_area: body.res_area,
        departamento: body.departamento,
        proveedor: body.proveedor,
        usuario: req.usuario._id
    });
    material.save((err, materialGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear material',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            material: materialGuardado
        });
    });
});

module.exports = app;