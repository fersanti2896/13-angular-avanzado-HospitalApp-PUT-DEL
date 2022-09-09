
/* Configuración de Mongoose */
const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect( process.env.DB_CNN );

        console.log('Base de Datos Online!')
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD, ver los logs!');
    }   
}

module.exports = {
    dbConnection
}