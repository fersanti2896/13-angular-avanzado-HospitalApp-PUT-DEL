const { response } = require("express");
const Hospital = require('../models/hospital')

const getHospitals = async(req, res = response) => {
    const hospitales = await Hospital.find()
                                     .populate('usuario', 'nombre email');

    res.status(200).json({
        ok: true,
        hospitales
    });
}

const postHospital = async(req, res = response) => {
    const uid = req.uid;
    const hospital = new Hospital( {
        usuario: uid,
        ...req.body
    });
    
    try {
        const hospitalDB = await hospital.save();

        res.status(200).json({
            ok: true,
            hospital: hospitalDB
        });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs!'
        });
    }
}

const putHospital = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {
        const hospital = await Hospital.findById( id );

        if( !hospital ) {
           return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado dado el id!'
            });
        }

        /* Construimos el hospital a actualizar */
        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        /* Actualizamos el hospital, se manda id, el objeto actualizado y el que mostrara como respuesta*/
        const hospitalActualizado = await Hospital.findByIdAndUpdate( id, cambiosHospital, { new: true } );

        res.status(200).json({
            ok: true,
            hospital: hospitalActualizado
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs!'
        })
    }

    
}

const deleteHospital = (req, res = response) => {
    res.status(200).json({
        ok: true,
        msg: 'Eliminar Hospital'
    });
}

module.exports = {
    getHospitals,
    postHospital,
    putHospital,
    deleteHospital
}