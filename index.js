
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

/* Creando el servidor de express */
const app = express();

/* Configuración a CORS */
app.use( cors() );

/* Carpeta publica */
app.use( express.static('public') );

/* Lectura y parseo del body (al hacer la petición) */
app.use( express.json() );

/* Conexion a DB */
dbConnection();

/* Rutas con middlewere: Ruta | Archivo Router */
app.use( '/api/usuarios', require('./routes/usuariosRoutes') );
app.use( '/api/hospitales', require('./routes/hospitalesRoutes') );
app.use( '/api/medicos', require('./routes/medicosRoutes') );
app.use( '/api/login', require('./routes/authRoutes') );
app.use( '/api/todo', require('./routes/busquedaRoutes') );
app.use( '/api/uploads', require('./routes/uploadsRoutes') );

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en', process.env.PORT);
} );