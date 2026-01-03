var DataTypes = require("sequelize").DataTypes;
var _campana = require("./campana");
var _donacion = require("./donacion");

function initModels(sequelize) {
  var campana = _campana(sequelize, DataTypes);
  var donacion = _donacion(sequelize, DataTypes);

  donacion.belongsTo(campana, { as: "id_campana_campaña", foreignKey: "id_campana"});
  campana.hasMany(donacion, { as: "donacions", foreignKey: "id_campana"});

  return {
    campana,
    donacion,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
