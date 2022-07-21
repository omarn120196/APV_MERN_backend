import mongoose from "mongoose";

const pacientesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    propietario: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true, 
        default: Date.now() 
    },
    sintomas: {
        type: String,
        required: true
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veterinario'
    }
},{
    timestams: true
});

//Guardar el modelo
const Paciente = mongoose.model('Paciente', pacientesSchema);

//Exportar Modelo
export default Paciente;