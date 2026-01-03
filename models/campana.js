const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('campana', {
    id_campana: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_campana: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    objetivo_litros_campana: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    },
    fecha_inicio_campana: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_fin_campana: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    urgente_campana: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'campaña',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_campana" },
        ]
      },
    ]
  });
};
