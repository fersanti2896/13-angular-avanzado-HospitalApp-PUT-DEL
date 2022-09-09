/*
    Ruta: /api/hospitales
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getHospitals, postHospital, putHospital, deleteHospital } = require('../controllers/hospitalesController');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

/* GET: Ruta | Controlador */
router.get( '/', getHospitals );

/* POST: Ruta | Middlewere | Controlador */
router.post( '/', [ 
    validarJWT,
    check('nombre', 'El nombre del hospital es necesario!').not().isEmpty(),
    validarCampos
], postHospital );

/* PUT: Ruta | Controlador */
router.put( '/:id', [
    validarJWT,
    check('nombre', 'El nombre del hospital es necesario!').not().isEmpty(),
    validarCampos
], putHospital );

/* DELETE: Ruta */
router.delete( '/:id', validarJWT, deleteHospital );

module.exports = router;