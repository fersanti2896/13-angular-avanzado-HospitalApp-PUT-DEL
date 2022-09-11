/*
    Ruta: /api/medicos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getPhysicians, postPhysician, putPhysician, deletePhysician } = require('../controllers/medicosController');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

/* GET: Ruta | Controlador */
router.get( '/', getPhysicians );

/* POST: Ruta | Middlewere | Controlador */
router.post( '/', [
    validarJWT,
    check('nombre', 'El nombre del médico es obligatorio!').not().isEmpty(),
    check('hospital', 'El hospital id debe ser válido!').isMongoId(),
    validarCampos
], postPhysician );

/* PUT: Ruta | Controlador */
router.put( '/:id', [
    validarJWT,
    check('nombre', 'El nombre del médico es obligatorio!').not().isEmpty(),
    check('hospital', 'El hospital id debe ser válido!').isMongoId(),
    validarCampos
], putPhysician );

/* DELETE: Ruta */
router.delete( '/:id', validarJWT, deletePhysician );

module.exports = router;