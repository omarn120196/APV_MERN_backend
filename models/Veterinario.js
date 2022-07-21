import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";

//Forma que van a tener los datos
const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        requiered: true, 
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

//hashear password--------------------------------------------------------
veterinarioSchema.pre('save', async function(next){
    //Un password que ya esta hasheado no lo vuelva a hashear
    if(!this.isModified('password')){
        next();
    }

    //Rondas de hasheo
    const salt = await bcrypt.genSalt();

    //Hashear password
    this.password = await bcrypt.hash(this.password, salt);
});

veterinarioSchema.methods.comprobarPassword = async function(passwordForm){
    return await bcrypt.compare(passwordForm, this.password);
}

//Registrar Modelo-------------------------------------------------------
const Veterinario = mongoose.model('Veterinario', veterinarioSchema);

//Exportar Modelo--------------------------------------------------------
export default Veterinario;