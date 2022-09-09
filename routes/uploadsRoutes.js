/*
    Ruta: /api/uploads
*/
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { check } = require('express-validator');

const { fileUpload, returnImg } = require('../controllers/uploadsController');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.use( expressFileUpload() );

/* PUT: Ruta | Middleware | Controlador */
router.put( '/:tipo/:id', validarJWT, fileUpload );

/* GET: Ruta | Middleware | Controlador */
router.get( '/:tipo/:foto', validarJWT, returnImg );

module.exports = router;