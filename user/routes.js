var express = require('express');
var controllers = require('./controller');
var upload = require('./multer_config');
var router = express.Router();

router.get('/', function(req,res){return res.send('ruta de prueba')});
router.post('/paciente',controllers.createPaciente)
router.get('/pacientes/:last?',controllers.getPacientes)
router.get('/paciente/:id',controllers.getPaciente)
router.put('/paciente/:id',controllers.update)
router.delete('/paciente/:id',controllers.delete)
router.get('/paciente/search/:search',controllers.search)
router.post('/paciente/photo/:id?',upload,controllers.upload)
router.get('/paciente/photo/:filename',controllers.getPhoto)

module.exports = router;
