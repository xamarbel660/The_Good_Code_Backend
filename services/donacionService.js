// services/directorService.js
// Servicio para interactuar con el modelo Sequelize `donacion`

// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo director
const Donacion = models.donacion;

class DonacionService {
    async getAllDonaciones() {
        // Devuelve todos los directores. Ajusta atributos si tu modelo usa otros nombres.
        const result = await Donacion.findAll();
        return result;
    }

    async getDonacionById(id_donacion) {
        // Devuelve una donación por su id
        const result = await Donacion.findByPk(id_donacion);
        return result;
    }

    async createDonacion(donacion) {
        //Crea una donación
        const result = await Donacion.create(donacion);
        return result;
    }

    async deleteDonacion(id_donacion) {
        const result = await Donacion.destroy({
            where: {
                id_donacion: id_donacion,
            },
        });
        return result;
    }

    async updateDonacion(donacion) {
        const numFilas = await Donacion.update(donacion,
            {
                where:
                    { id_donacion: donacion.id_donacion, }
            });
        return numFilas;
    }
}

module.exports = new DonacionService();