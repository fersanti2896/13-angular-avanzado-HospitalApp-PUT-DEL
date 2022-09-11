const { response } = require("express");
const Medico = require('../models/medico');

const getPhysicians = async(req, res = response) => {
    const medicos = await Medico.find()
                                .populate('usuario', 'nombre')
                                .populate('hospital', 'nombre');

    res.status(200).json({
        ok: true,
        medicos
    });
}

const postPhysician = async(req, res = response) => {
    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    })

    try {
        const medicoDB = await medico.save()

        res.status(200).json({
            ok: true,
            medico: medicoDB
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs!'
        })
    }

    
}

const putPhysician = async(req, res = response) => {
    const uid = req.uid;
    const idMedico = req.params.id;

    try {
        const medico = await Medico.findById( idMedico );

        if( !medico ) {
           return res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado dado el id!'
            });
        }

        /* Construimos el hospital a actualizar */
        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        /* Actualizamos el medico, se manda id, el objeto actualizado y el que mostrara como respuesta*/
        const medicoActualizado = await Medico.findByIdAndUpdate( idMedico, cambiosMedico, { new: true } );

        res.status(200).json({
            ok: true,
            medico: medicoActualizado
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs!'
        });
    }
}

const deletePhysician = async(req, res = response) => {
    const idMedico = req.params.id;

    try {
        const medico = await Medico.findById( idMedico );

        if( !medico ) {
           return res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado dado el id!'
            });
        }

        /* Eliminamos al médico */
        await Medico.findByIdAndDelete( idMedico );

        res.status(200).json({
            ok: true,
            msg: 'El médico fue eliminado'
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs!'
        });
    }
}

module.exports = {
    getPhysicians,
    postPhysician,
    putPhysician,
    deletePhysician
}