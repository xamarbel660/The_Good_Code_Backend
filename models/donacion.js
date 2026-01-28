const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('donacion', {
    id_donacion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_campana: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'campaña',
        key: 'id_campana'
      }
    },
    nombre_donante: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    peso_donante: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    },
    fecha_donacion: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    es_primera_vez: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    grupo_sanguineo: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    URL_image: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'donacion',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_donacion" },
        ]
      },
      {
        name: "fk_campana_donacion",
        using: "BTREE",
        fields: [
          { name: "id_campana" },
        ]
      },
    ]
  });
};
