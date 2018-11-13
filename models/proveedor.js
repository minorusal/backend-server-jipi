var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProveedorSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre	es necesario'] },
    img: { type: String, required: false },
    rfc: { type: String },
    correo: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    telefono: { type: String, unique: true, required: [true, 'El teléfono es necesario'] },
    whatsapp: { type: String, unique: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'proveedores' });
module.exports = mongoose.model('Proveedor', ProveedorSchema);