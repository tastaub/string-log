module.exports = function(sequelize, DataTypes) {
    var customers = sequelize.define("customers", {
      last: DataTypes.STRING,
      first: DataTypes.STRING,
      phone: DataTypes.STRING
    });
    return customers;
  };