const { response } = require('express');
const Evento = require('../models/Evento');
// {
//   ok: true,
//     msg: 'getEventos',
// }

const getEventos = async (req, res = response) => {

  const eventos = await Evento.find().populate('user', 'name');

  return res.status(400).json({
    ok: true,
    eventos
  })

};


const crearEvento = async (req, res = response) => {

  const evento = new Evento(req.body);

  try {

    evento.user = req.uid;

    const eventoDB = await evento.save();

    res.json({
      ok: true,
      evento: eventoDB
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador...'
    });
  }

};


const actualizarEvento = async (req, res = response) => {

  const eventoId = req.params.id;

  try {

    const evento = await Evento.findById(eventoId);
    const uid = req.uid;

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: 'Evento no existe con esa id...'
      })
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene permiso de editar este evento'
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: uid
    }

    const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

    res.json({
      ok: true,
      evento: eventoActualizado
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador...'
    });
  }

};

const eliminarEvento = async (req, res = response) => {

  const eventoId = req.params.id;


  try {

    const evento = await Evento.findById(eventoId);
    const uid = req.uid;

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: 'Evento no existe con esa id...'
      })
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene permiso de eliminar este evento'
      });
    }

    await Evento.findByIdAndDelete(eventoId);

    res.json({
      ok: true,
      msg: 'Evento eliminado correctamente'
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador...'
    });
  }

}





module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento
}