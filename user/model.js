var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pacienteSchema = Schema({
    rut: String,
    nombre: String,
    edad: Number,
    sexo: String,
    fotoPersona: String,
    fechaIngreso: {type:Date,default:Date.now},
    enfermedad: String,
    revisado: {type:Boolean,default:false}
});

module.exports=mongoose.model('Paciente',pacienteSchema)
