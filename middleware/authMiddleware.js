import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const checkAuth = async (req, res, next)=>{

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            //Separar bearer del token
            token = req.headers.authorization.split(' ')[1];
            //Verificar el token con la variable de entorno
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //Buscar el id del token y guardarla en una variable de sesion
            req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado');

            return next();

        } catch (error) {
            const e = new Error('Token no valido');
            return res.status(403).json({msg: e.message});
        }
    }

    if(!token){
        const error = new Error('Token inexistente');
        res.status(403).json({msg: error.message});
    }
    
    next();
}

export default checkAuth;