module.exports = function(sequelize, DataTypes) {
    var StringLog = sequelize.define("StringLog", {
      string: DataTypes.STRING,
      gauge: DataTypes.INTEGER,
      tension: DataTypes.INTEGER,
      racquet: DataTypes.STRING,
      comment: DataTypes.TEXT,
      isDone: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    
    });

    StringLog.associate = function(models) {
        // We're saying that a Post should belong to an Author
        // A Post can't be created without an Author due to the foreign key constraint
        StringLog.belongsTo(models.customers, {
          foreignKey: {
            allowNull: false
          }
        });
      };
    return StringLog;
  };