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

const putHospital = (req, res = response) => {
    res.status(200).json({
        ok: true,
        msg: 'Actualizar Hospital'
    });
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