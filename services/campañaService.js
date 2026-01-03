// services/directorService.js
// Servicio para interactuar con el modelo Sequelize `directors`

// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo director
const Camapaña = models.campana;

class CampañaService {
  async getAllCampañas() {
    // Devuelve todos los directores. Ajusta atributos si tu modelo usa otros nombres.
    const result = await Camapaña.findAll();
    return result;
  }

  async getCampañaById(id_campana) {
    // Devuelve una campana por su id
    const result = await Camapaña.findByPk(id_campana);
    return result;
  }

  async createCampaña(campana) {
    //Crea una campana
    const result = await Camapaña.create(campana);
    return result;
  }

    async deleteCampaña(id_campana) {
    const result = await Camapaña.destroy({
      where: {
        id_campana: id_campana,
      },
    });
    return result;
  }

  async updateCampaña(campana) {
    const numFilas = await Camapaña.update(campana,
      {
        where:
          { id_campana: campana.id_campana, }
      });
    return numFilas;
  }
}

module.exports = new CampañaService();
