import Paciente from "../models/Paciente.js";

// Agregar Paciente----------------------------------------------------------
const agregarPaciente = async (req, res)=>{

    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario.id;

    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
}

// Obtener Pacientes----------------------------------------------------------
const obtenerPacientes = async (req, res)=>{
    const pacientes = await Paciente.find()
    .where('veterinario')
    .equals(req.veterinario);

    res.json(pacientes);
}

// Obtener Paciente----------------------------------------------------------
const obtenerPaciente = async (req, res)=>{
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg: 'Paciente no encontrado'});
    }
    
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: 'Acción no valida'});
    }

    res.json(paciente);
}

// Actualizar Paciente----------------------------------------------------------
const actualizarPaciente = async (req, res)=>{
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg: 'Paciente no encontrado'});
    }
    
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: 'Acción no valida'});
    }

    // Actualizar
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
}

// Eliminar Paciente----------------------------------------------------------
const eliminarPaciente = async (req, res)=>{
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.status(404).json({msg: 'Paciente no encontrado'});
    }
    
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: 'Acción no valida'});
    }

    try {
        await paciente.deleteOne();
        res.json({msg: 'Paciente Eliminado'});
    } catch (error) {
        console.log(error);
    }
}

export{
    agregarPaciente, 
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}