// controllers/directorController.js
const { logMensaje } = require("../utils/logger.js");
const campañaService = require("../services/campañaService.js");

class CampañaController {
  async getAllCampañas(req, res) {
    try {
      const campañas = await campañaService.getAllCampañas();
      return res.status(200).json({
        ok: true,
        datos: campañas,
        mensaje: "Campañas recuperadas correctamente",
      });
    } catch (err) {
      logMensaje("Error en getAllCampañas:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar campañas",
      });
    }
  }

  async getCampañaById(req, res) {
    const id_campana = req.params.id;
    try {
      const campaña = await campañaService.getCampañaById(id_campana);
      // campaña != null -- se ha encontrado la campaña
      if (campaña) {
        return res.status(200).json({
          ok: true,
          datos: campaña,
          mensaje: "Campaña recuperada correctamente",
        });
      } else {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Campaña no encontrada",
        });
      }
    } catch (err) {
      logMensaje("Error en getCampañaById:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar una campaña",
      });
    }
  }

  async createCampaña(req, res) {
    const campaña = req.body;

    try {
      const campañaNew = await campañaService.createCampaña(campaña);
      return res.status(201).json({
        ok: true,
        datos: campañaNew,
        mensaje: "Campaña creada correctamente",
      });

    } catch (err) {
      logMensaje("Error en createCampaña:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al crear una campaña",
      });
    }
  }

  async deleteCampaña(req, res) {
    const id_campana = req.params.id;

    try {
      const numFilas = await campañaService.deleteCampaña(id_campana);
      if (numFilas == 0) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "No encontrado: " + id_campana
        });
      } else {
        return res.status(204).send();
      }

    } catch (err) {
      logMensaje("Error :" + err);
      return res
        .status(500)
        .json({
          ok: false,
          datos: null,
          mensaje: `Error al eliminar los datos: ${req.originalUrl}`
        });
    }
  }

  async updateCampaña(req, res) {
    const campaña = req.body; // Recuperamos datos para actualizar
    const idCampaña = req.params.id; // dato de la ruta

    // Petición errónea, no coincide el id del plato de la ruta con el del objeto a actualizar
    if (idCampaña != campaña.id_campana) {
      return res
        .status(400)
        .json({
          ok: false,
          datos: null,
          mensaje: "El id de la campaña no coincide"
        });
    }

    try {
      const numFilas = await campañaService.updateCampaña(campaña);

      if (numFilas == 0) {
        // No se ha encontrado lo que se quería actualizar o no hay nada que cambiar
        return res
          .status(404)
          .json({
            ok: false,
            datos: null,
            mensaje: "No encontrado o no modificado: " + idCampaña
          });
      } else {
        // Al dar status 204 no se devuelva nada
        // res.status(204).json(Respuesta.exito(null, "Plato actualizado"));
        return res.status(204).send();
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json({
          ok: false,
          datos: null,
          mensaje: `Error al actualizar los datos: ${req.originalUrl}`
        });
    }
  }

}

module.exports = new CampañaController();
