const { response } = require("express");
const Hospital = require("../models/hospital");
const Medico = require("../models/medico");
const Usuario = require('../models/usuario');

const getSearch = async(req, res = response) => {
    const desde = Number( req.query.desde ) || 0;
    const busqueda = req.params.busqueda;  
    const regex = new RegExp( busqueda, 'i' );

    const [ usuarios, medicos, hospitales ] = await Promise.all([
        Usuario.find({ nombre: regex })
               .skip( desde )
               .limit( 5 ),
        Medico.find({ nombre: regex })
              .populate('usuario', 'nombre')
              .populate('hospital', 'nombre')
              .skip( desde )
              .limit( 5 ),
        Hospital.find({ nombre: regex })
                .populate('usuario', 'nombre email')
                .skip( desde )
                .limit( 5 )
    ]);

    res.status(200).json({ 
        ok: true,
        usuarios,
        medicos,
        hospitales
    });
}

const getDocumentsCollection = async(req, res = response) => {
    const desde = Number( req.query.desde ) || 0;
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;  
    const regex = new RegExp( busqueda, 'i' );
    let data = [];

    switch (tabla) {
        case 'hospitales': 
            data = await Hospital.find({ nombre: regex })
                                 .populate('usuario', 'nombre img')
                                 .skip( desde )
                                 .limit( 5 )
            break;
        case 'medicos': 
            data = await Medico.find({ nombre: regex })
                               .populate('usuario', 'nombre img')
                               .populate('hospital', 'nombre img')
                               .skip( desde )
                               .limit( 5 )
            break;
        case 'usuarios': 
            data = await Usuario.find({ nombre: regex })
                                .skip( desde )
                                .limit( 5 )
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La colección debe ser Médicos, Hospitales o Usuarios'
            })
    }

    res.status(200).json({
        ok: true,
        resultados: data
    });
}

module.exports = {
    getSearch,
    getDocumentsCollection
}