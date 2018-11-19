// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// Body Parser
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Importar rutas
var usuarioRoutes = require('./routes/usuario');
// Inicio rutas de ejemplo
var appRoutes = require('./routes/app');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
// Fin rutas de ejemplo

// Inicio rutas AdminJIPI
var proveedorRoutes = require('./routes/proveedor');
var materialRoutes = require('./routes/material');
// Fin de rutas Admin JIPI 

var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
var loginRoutes = require('./routes/login');

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://jipiuser:jipiuser2018@ds029267.mlab.com:29267/adminjipi', { useNewUrlParser: true }, (err, res) => {
            mongoose.connection.openUri(, { useNewUrlParser: true }, (err, res) => {
                if (err) throw err;
                console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
            });
            mongoose.set('useCreateIndex', true);

            // Server index config
            // var serveIndex = require('serve-index');
            // app.use(express.static(__dirname + '/'))
            // app.use('/uploads', serveIndex(__dirname + '/uploads'));

            // Rutas
            app.use('/usuario', usuarioRoutes);
            // Inicio rutas de ejemplo
            app.use('/hospital', hospitalRoutes);
            app.use('/medico', medicoRoutes);
            // Fin rutas de ejemplo

            // Inicio rutas AdminJIPI
            app.use('/proveedor', proveedorRoutes);
            app.use('/material', materialRoutes);
            // Fin rutas AdminJIPI
            app.use('/upload', uploadRoutes);
            app.use('/img', imagenesRoutes);
            app.use('/login', loginRoutes);
            app.use('/busqueda', busquedaRoutes);
            app.use('/', appRoutes);

            app.set('port', process.env.PORT || 3000)

            // Escuchar peticiones
            app.listen(app.get('port'), () => {
                console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
            });