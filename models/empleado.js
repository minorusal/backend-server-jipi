var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmpleadoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre	es necesario'] },
    apellidos: { type: String, required: [true, 'Los apellidos son necesarios'] },
    alias: { type: String, required: [true, 'El alias es necesario'] },
    correo: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    nip: { type: Number, unique: false, required: [true, 'El nip es necesario'] },
    whatsapp: { type: String, unique: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'empleados' });
module.exports = mongoose.model('Empleado', EmpleadoSchema);