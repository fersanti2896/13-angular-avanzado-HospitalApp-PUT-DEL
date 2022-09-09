const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const { actualizarImagen } = require("../helpers/actualizarImagen");

const fileUpload = (req, res = response) => {
    const { tipo, id } = req.params;
    const tiposValidos = [ 'hospitales', 'medicos', 'usuarios' ];

    if( !tiposValidos.includes(tipo) ) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un médico, usuarios u hospital!'
        });
    }

    /* Se válida que existe un archivo */
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo!'
        });
    }

    /* Procesando la imagen */
    const archivo = req.files.imagen;
    const archivoCortado = archivo.name.split('.');
    const extensionArchivo = archivoCortado[ archivoCortado.length - 1 ];

    /* Validando extension de archivo */
    const extensionValidas = [ 'jpg', 'png', 'gif', 'jpeg', 'PNG', 'JPG', 'jfif' ];
    
    if( !extensionValidas.includes(extensionArchivo) ) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión de imagen permitida'
        });
    }

    /* Generando el nombre del archivo */
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    /* Path para guardar la imagen */
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    /* Moviendo la imagen */
    archivo.mv(path, (err) => {
        if (err) {
            console.log(errr)
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }
        
        /* Actualizando la BD */
        actualizarImagen( tipo, id, nombreArchivo );
        
        res.status(200).json({
            ok: true,
            msg: 'Archivo cargado!',
            nombreArchivo
        });
    });   
}

const returnImg = (req, res = response) => {
    const { tipo, foto } = req.params;
    let pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }` );

    if( fs.existsSync(pathImg) ) {
        res.status(200).sendFile( pathImg );
    } else {
        pathImg = path.join( __dirname, `../uploads/no-img.jpg` );
        res.status(200).sendFile( pathImg );
    }
}

module.exports = {
    fileUpload,
    returnImg
}