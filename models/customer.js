module.exports = function(sequelize, DataTypes) {
    var customers = sequelize.define("customers", {
      last: DataTypes.STRING,
      first: DataTypes.STRING,
      phone: DataTypes.STRING
    });

    customers.associate = function(models) {
      // Associating Author with Posts
      // When an Author is deleted, also delete any associated Posts
      customers.hasMany(models.StringLog, {
        onDelete: "cascade"
      });
    };
    return customers;
  };