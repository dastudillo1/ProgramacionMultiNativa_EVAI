var validator = require('validator');
var Paciente = require('./model');
var fs = require('fs');
var path = require('path');

var controllers = { 
    createPaciente: async function(req, res) {
        var params = req.body
        try{
            var rutVal = !validator.isEmpty(params.rut);
            var nombreVal = !validator.isEmpty(params.nombre);
            var edadVal = !validator.isEmpty(params.edad);
            var sexoVal = !validator.isEmpty(params.sexo);
            var enfVal = !validator.isEmpty(params.enfermedad);
 
        }catch(err){
            return res.status(400).send({
                status: 'error',
                message: 'No hay suficiente información'
            })
        }

        if(rutVal && nombreVal && edadVal && sexoVal && enfVal){
            var user = new Paciente()
            user.rut = params.rut;
			user.nombre = params.nombre;
            user.edad = params.edad;
            user.sexo = params.sexo;
            user.enfermedad = params.enfermedad;

            if(params.fotoPersona){
                user.fotoPersona = params.fotoPersona
            }else{
                user.fotoPersona = null
            }

            const userStored = await user.save();
                if (!userStored) {
                return res.status(404).send({
                    status: 'error',
                    message: 'El usuario no se ha guardado'
                });
            }

                return res.status(200).send({
                    status: 'success',
                    user
                })
            }
        else{
            return res.status(400).send({
                status: 'error',
                message: 'Data is not valid'
            })
        }
    },

    /*update: async function(req, res) {    
        var userId = req.params.id;
        var params = req.body;
        try {
            var rutVal = !validator.isEmpty(params.rut);
            var nombreVal = !validator.isEmpty(params.nombre);
    
            if (rutVal || nombreVal) {
                const userUpdated = await Paciente.findByIdAndUpdate(userId, params, { new: true });
                if (!userUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El usuario no se ha actualizado'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    user: userUpdated
                });
            } else {
                return res.status(400).send({
                    status: 'error',
                    message: 'Los datos no son válidos'
                });
            }
        } catch (err) {
            return res.status(400).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }
    },*/
    update: async function(req, res) {    
        var userId = req.params.id;
        var params = req.body;
        
        try {
            const userToUpdate = await Paciente.findById(userId);
    
            if (!userToUpdate) {
                return res.status(404).send({
                    status: 'error',
                    message: 'El usuario no existe'
                });
            }
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined) {
                    if (!validator.isEmpty(params[key])) {
                        userToUpdate[key] = params[key];
                    }
                }
            });    
            const userUpdated = await userToUpdate.save();    
            return res.status(200).send({
                status: 'success',
                user: userUpdated
            });
        } catch (err) {
            return res.status(400).send({
                status: 'error',
                message: 'Ha ocurrido un error al actualizar el usuario'
            });
        }
    },    
    delete: async function(req, res) {
        var userId = req.params.id;
        try {
            const userRemoved = await Paciente.findByIdAndDelete(userId);
            if (!userRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'El usuario no se ha eliminado'
                });
            }
            return res.status(200).send({
                status: 'Usuario eliminado exitosamente',
                user: userRemoved
            });
        } catch (err) {
            return res.status(400).send({
                status: 'error',
                message: 'Ocurrió un error al intentar eliminar el usuario'
            });
        }
    },
    getPaciente: function(req, res) {
        var id = req.params.id;
        if (!id || id == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el usuario'
            });
        }
    
        Paciente.findById(id)
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el usuario'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    user
                });
            })
            .catch(err => {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al buscar el usuario'
                });
            });
    },
    getPacientes: function(req, res) {
        var query = Paciente.find({});
        var getLastUsers = req.params.last;
        
        if (getLastUsers || getLastUsers != undefined) {
            query.limit(5);
        }
    
        query.sort('-_id').then((users) => {
            if (!users || users.length === 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay usuarios para mostrar'
                });
            }
            return res.status(200).send({
                status: 'success',
                users
            });
        }).catch((err) => {
            return res.status(500).send({
                status: 'error',
                message: 'Error al devolver los usuarios',
                error: err.message
            });
        });
    },
    search: function(req, res) {
        var searchString = req.params.search;
        Paciente.find({
            "$or": [
                { "rut": { "$regex": searchString, "$options": "i" } },
                { "nombre": { "$regex": searchString, "$options": "i" } },
            ]
        })
        .sort([['createdAt', 'desc']])
        .exec()
        .then(users => {
            if (!users || users.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Sin usuarios encontrados con el criterio: ' + searchString
                });
            }
            return res.status(200).send({
                status: 'success',
                users
            });
        })
        .catch(err => {
            return res.status(500).send({
                status: 'error',
                message: 'Error en la petición'
            });
        });
    },
    upload: function(req, res) {
        const file = req.file;
        var id = req.params.id;
    
        if (!file) {
            return res.status(404).send({
                status: 'error',
                message: 'No se ha subido ninguna imagen'
            });
        }
    
        var tempFilename = file.originalname; 
    
        if (id) {
            Paciente.findByIdAndUpdate(id, { fotoPersona: tempFilename }, { new: true })
                .then(userUpdated => {
                    if (!userUpdated) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'No se ha subido ninguna imagen con id:' + id
                        });
                    }
                    return res.status(200).send({
                        status: 'success',
                        message: 'Archivo subido y foto de usuario actualizada correctamente',
                        filename: file.originalname, 
                        user: userUpdated
                    });
                })
                .catch(err => {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al subir el archivo y actualizar la foto del usuario'
                    });
                });
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Archivo subido exitosamente',
                tempFilename
            });
        }
    },
    getPhoto: function(req, res) {
        var file = req.params.filename;
        var pathFile = './uploads/' + file;

        if(fs.exists = fs.existsSync(pathFile)){
            return res.sendFile(path.resolve(pathFile));
        }else{
            return res.status(404).send({
                status: 'error',
                message: 'La imagen'+file+'no existe'
            });
        }
    }
}

module.exports = controllers;