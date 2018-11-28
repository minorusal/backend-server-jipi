var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var departamentoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre	es necesario'] },
    clave_corta: { type: String, required: [true, 'La clave corta es necesaria'] },
    descripcion: { type: String, required: [true, 'La descripcion es necesaria'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'departamentos' });
module.exports = mongoose.model('Departamento', departamentoSchema);