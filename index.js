var mongoose = require('mongoose');
var app = require('./app');

var port = 3000;

mongoose.connect('mongodb+srv://dastudillo:dastudillo@cluster0.k5ht24j.mongodb.net/Hospital', { useNewUrlParser: true, useUnifiedTopology: true }).then(function(){
    console.log('Conexion a la base de datos MONGODB establecida con exito');
    app.listen(port, function(){
        console.log('Servidor corriendo en puerto: ' + port);
    });
})

