
const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async( req, res = response ) => {
    const { email, password } = req.body;

    try {
        
        /* Verificar email */
        const usuarioDB = await Usuario.findOne({ email });

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no válido!'
            })
        }

        /* Verificar contraseña */
        const validPassword = bcryptjs.compareSync( password, usuarioDB.password );
        
        if( !validPassword ) {
            return res.status(404).json({
                ok: false,
                msg: 'Password no válido!'
            })
        }

        /* Generar el JWT */
        const token = await generarJWT( usuarioDB.id );

        return res.status(200).json({ 
            ok: true,
            token
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({ 
            ok: false,
            msg: 'Error inesperado!'
        })
    }
}

const googleSignIn = async(req, res = response) => {

    try {
        const { email, name, picture } = await googleVerify( req.body.token );
        const usuarioDB = await Usuario.findOne({ email });

        let usuario;

        if( !usuarioDB ) {
            usuario = new Usuario({
                nombre: name,
                email, 
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            usuario = usuarioDB;
            usuario.google = true;

            if ( !usuario.img ) {
                usuario.img = picture;
            }
        }

        /* Se guarda el usuario */
        await usuario.save();

        /* Generar el JWT */
        const token = await generarJWT( usuario.id );

        res.status(200).json({
            ok: true,
            name, 
            email,
            picture,
            token
        });
    } catch (error) {
        console.log(error);

        res.status(400).json({
            ok: false,
            msg: 'Token de Google no es correcto!'
        });
    } 

}

const renewToken = async(req, res = response) => {
    const uid = req.uid;

    /* Generar el JWT */
    const token = await generarJWT( uid );

    /* Obteniendo el usuario por el uid */
    const usuario = await Usuario.findById(uid);

    res.status(200).json({
        ok: true,
        token, 
        usuario
    });
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}