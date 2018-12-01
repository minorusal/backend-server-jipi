var express = require('express');
var app = express();
var Usuario = require('../models/usuario');

var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('../pdfTest/test.html', 'utf8');
var options = { format: 'Letter' };

app.get('/', (req, res, next) => {
    pdf.create(html, options).toFile('./test.pdf', function(err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/app/businesscard.pdf' }
    });
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});
module.exports = app;