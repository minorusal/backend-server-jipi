var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var presentacionesValidas = {
    values: ['LATA', 'CARRETE', 'ROLLO', 'PIEZA', 'LITRO', 'GALON', 'METRO', 'KILO'],
    message: '{VALUE} no es una presentación permitido'
}
var unidadesValidas = {
    values: ['METRO CUBICO', 'METRO CUADRADO', 'METRO LINEAL', 'CENTIMETRO CUBICO', 'CENTIMETRO CUADRADO', 'CENTIMETRO LINEAL', 'LITRO', 'PIEZA'],
    message: '{VALUE} no es una unidad permitido'
}
var materialSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre	es necesario'] },
    img: { type: String, required: false },
    clave_corta: { type: String, required: [true, 'La clave corta es necesaria'] },
    descripcion: { type: String, required: [true, 'La descripcion es necesaria'] },
    presentacion: { type: String, required: true, default: 'PIEZA', enum: presentacionesValidas },
    unidadPresentacion: { type: String, required: true, default: 'METRO LINEAL', enum: unidadesValidas },
    largo: { type: Number },
    ancho: { type: Number },
    alto: { type: Number },
    count_litros: { type: Number },
    res_volumen: { type: Number },
    res_area: { type: Number },
    departamento: { type: Schema.Types.ObjectId, ref: 'Departamento' },
    proveedor: { type: Schema.Types.ObjectId, ref: 'Proveedor' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'materiales' });
module.exports = mongoose.model('Material', materialSchema);