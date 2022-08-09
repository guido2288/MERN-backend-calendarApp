// Rutas de Usuarios / Auth
// host + /api/events

const { Router } = require("express");
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt')
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');


const router = Router();

// Validar token para todas las rutas
router.use(validarJWT);


// Obtener eventos
router.get('/', getEventos);


// Crear Eventos
router.post(
  '/',
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria').custom(isDate),
    validarCampos
  ],
  crearEvento);


// Actualizar evento
router.put('/:id', actualizarEvento);


// Borrar evento route/delete
router.delete('/:id', eliminarEvento);



module.exports = router;