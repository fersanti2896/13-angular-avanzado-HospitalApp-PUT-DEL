
const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const getUsers = async(req, res = response) => {
    const desde = Number( req.query.desde ) || 0;

    /* const usuarios = await Usuario.find({}, 'nombre email role google')
                                  .skip( desde )
                                  .limit( 5 );

    const total = await Usuario.count(); */
    
    /* Al usar Promise.all se ejecutan las promesas de manera simultanea */
    const [ usuarios, total ] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
               .skip( desde )
               .limit( 5 ),
        Usuario.count()
    ]);

    res.status(200).json({
        ok: true,
        usuarios,
        total
    });
}

const postUser = async(req, res = response) => {
    /* Leyendo el body */
    const { nombre, password, email } = req.body;

    try {
        /* Validando si el usuario ya existe */
        const existeEmail = await Usuario.findOne({ email });

        if( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado!'
            })
        }

        const usuario = new Usuario( req.body );

        /* Encriptando contraseña */
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync( password, salt );

        /* Grabando en la BD */
        await usuario.save()

        /* Generar el JWT */
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs!'
        });
    }   
}

const putUser = async( req, res = response ) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese uid'
            });
        }

        /* Validar token y comprobar si el usuario es el correcto */

        /* Actualizando el usuario en DB */
        const { password, google, email, ...campos } = req.body;

        if( usuarioDB.email !== email ) {
            const existeEmail = await Usuario.findOne({ email });

            if( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuarioActualizado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado!'
        })
    }
}

const deleteUser = async( req, res = response ) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese uid'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado!'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado!'
        })
    }
} 

module.exports = {
    getUsers,
    postUser,
    putUser,
    deleteUser
}