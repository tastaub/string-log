var db = require("../models");

module.exports = function(app) {
  app.get("/api/customers", function(req, res) {
    db.customers.findAll({
      include: [db.StringLog]
    }).then(function(dbCustomer) {
      console.log(dbCustomer);
      res.json(dbCustomer);
    });
  });

  app.get("/api/customers/:last", function(req,res)  {
    console.log(req.body);
    db.customers.findAll({
      include: [db.StringLog],
      where: {
        last: req.params.last
      }
    }).then((result) =>  {
      res.json(result);
    })
  })


  app.post("/api/customers", function(req, res) {
    db.customers.create(req.body).then(function(dbCustomer) {
      res.json(dbCustomer);
      console.log(dbCustomer);
    });
  });

//   app.delete("/api/authors/:id", function(req, res) {
//     db.Author.destroy({
//       where: {
//         id: req.params.id
//       }
//     }).then(function(dbAuthor) {
//       res.json(dbAuthor);
//     });
//   });

};