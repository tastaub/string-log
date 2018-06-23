const db = require("../models");

module.exports = (app) =>  {
    app.post("/api/string", function(req, res) {
        db.StringLog.create(req.body).then(function(dbPost) {
          res.json(dbPost);
        });
      });

    app.get("/api/string/:customerId", function(req,res)  {
        db.StringLog.findAll({
            include: [db.customers],
            where: {
                customerId: req.params.customerId
            }
        }).then((result) =>  {
            res.json(result);
        })
    })
}