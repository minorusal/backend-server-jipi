var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// =======================================
// Busqueda por colección
// =======================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        default:
            res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla/colección no válido' }
            });
    }
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});

// =======================================
// Busqueda General
// =======================================
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });
});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'all')
            .populate({ path: 'hospital' })
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarMedicos3(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    if (medicos.length === 0) {
                        /* Inicia la busqueda de _id de hospital */
                        getIdHospital(regex)
                            .then(hospital => {
                                console.log(hospital);
                            });
                        /* Termina la busqueda de _id de hospital */
                    } else {
                        resolve(medicos);
                    }
                }
            });
    });
}

var encuentraMedicoByIdHospital = function(idHospital) {
        return new Promise((resolve, reject) => {
            Medico.find({ hospital: idHospital })
                .populate('usuario', 'all')
                .populate('hospital')
                .exec((err, medicos) => {
                    if (err) {
                        reject('Error al cargar medicos', err);
                    } else {
                        resolve(medicos);
                    }
                });
        });
    }
    /*
     * Función 
     * Parametros: hospital string
     * Return _id: string -- Id de Hospital --
     */
var getIdHospital = function(hospital) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: hospital })
            .populate('usuario', 'all')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}


function buscarMedicos2(busqueda, regex) {
    return Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex)
        ]).then(resp => resp)
        .catch(err => {
            console.log(err);
        });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}
module.exports = app;