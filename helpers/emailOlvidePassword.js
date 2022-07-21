import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const {nombre, email, token} = datos;

    const info = await transporter.sendMail({
        from: 'APV - Administrador de Pacientes de Veterinaria',
        to: email,
        subject: 'Reestablece tu Password en APV',
        text: 'Reestablece tu Password en APV',
        html: `<p>Hola: ${nombre}, has solicitado reestablecer tu password.</p>
            <p>Sigue el siguiente enlace para generar un nuevo password:
            <a href="${process.env.FONTEND_URL}/recuperar-password/${token}">Reestablecer Password</a> </p>

            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    }); 

    console.log('Mensaje Enviado: %s', info.messageId);
}

export default emailOlvidePassword;