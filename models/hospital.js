
/* Modelo de Mongoose */
const { Schema, model } = require('mongoose');

const HospitalSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, { collection: 'hospitales' });

/* Es para efectos visuales, no afecta la BD */
HospitalSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();

    return object;
});

module.exports = model('Hospital', HospitalSchema);