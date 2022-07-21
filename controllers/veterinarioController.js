import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

// Registrar Veterinario----------------------------------------------------------
const registrar = async (req, res)=>{

    const {email, nombre} = req.body;

    //Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email});

    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
        //Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //Enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });
        
        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }    
}

// Mostrar perfil------------------------------------------------------------
const perfil = (req, res)=>{

    const {veterinario} = req;

    res.json({
        veterinario
    });
}


// Confirmar veterinario--------------------------------------------------------
const confirmar = async (req, res)=>{
    const {token} = req.params;

    const usuariosConfirmar = await Veterinario.findOne({token});

    if(!usuariosConfirmar){
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message});
    }

    try {
        usuariosConfirmar.token = null;
        usuariosConfirmar.confirmado = true;

        await usuariosConfirmar.save();
        res.json({msg: 'Usuario Confirmado Correctamente'});

    } catch (error) {
        console.log(error);
    }
}

//Autenticar veterinario--------------------------------------------------------
const autenticar = async (req, res)=>{

    const {email, password} = req.body;
    
    //Comprobar si el usuario Existe
    const usuario = await Veterinario.findOne({email});

    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(403).json({msg: error.message});
    }

    //Comprobar si el usuario esta comprobado o no
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }

    //Revisar el password
    if(await usuario.comprobarPassword(password)){
        //Autenticar
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
        });
    }
    else{
        const error = new Error('El password es incorrecto');
        return res.status(403).json({msg: error.message});
    }
}

//Recuperar password------------------------------------------------
const recuperarPassword = async (req, res)=>{
    const {email} = req.body;

    // Buscar el primero que coincida con ese email
    const existeVeterinario = await Veterinario.findOne({email});

    if(!existeVeterinario){
        const error = new Error('El usuario no existe');
        return res.status(400).json({msg: error.message});
    }

    try {
        //Generar un token
        existeVeterinario.token = generarId();
        //Guardar el token
        await existeVeterinario.save();

        //Enviar email con instruciones
        emailOlvidePassword({
            nombre: existeVeterinario.nombre,
            email,
            token: existeVeterinario.token
        });

        res.json({msg: 'Hemos enviado un email con las instrucciones'})
    } catch (error) {
        console.log(error);
    }
}

//Comprobar token de password olvidado------------------------------
const comprobarToken = async (req, res)=>{
    const {token} = req.params;
    
    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido){
        //El toquen es valido el usuario existe
        res.json({msg: 'Token valido y el usuario existe'});
    }
    else{
        const error = new Error('Token no válido');
        return res.status(400).json({msg: error.message});
    }
}

//Crear nueva contraseña--------------------------------------------
const nuevoPassword = async (req, res)=>{
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});

    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password;

        await veterinario.save();
        res.json({msg: 'Password modificado Correctamente'});

    } catch (error) {
        console.log(error);
    }

}

const actualizarPerfil = async (req, res)=>{
    const veterinario = await Veterinario.findById(req.params.id);

    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    const {email} = req.body
    if(veterinario.email !== email){
        const existeEmail = await Veterinario.findOne({email})
        if(existeEmail){
            const error = new Error('El Email esta en uso');
            return res.status(400).json({msg: error.message});
        }
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);

    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res)=>{
    //Leer datos
    const {id} = req.veterinario;
    const {pwd_actual, pwd_nuevo} = req.body;

    //Comprobar el veterinario
    const veterinario = await Veterinario.findById(id);

    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    //Comprobar su password 
    if(await veterinario.comprobarPassword(pwd_actual)){
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        return res.status.json({msg: 'Password Almacenado Correctamente'});
    }
    else{
        const error = new Error('El password actual es incorecto');
        return res.status(400).json({msg: error.message});
    }

    //Almacenar el nuevo password
}

export {
    registrar,
    perfil, 
    confirmar, 
    autenticar,
    recuperarPassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}