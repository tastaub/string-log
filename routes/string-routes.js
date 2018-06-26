const db = require("../models");

module.exports = (app) =>  {
    app.post("/api/string", function(req, res) {
        db.StringLog.create(req.body).then(function(dbPost) {
          res.json(dbPost);
        });
      });

    app.get("/api/string", function(req,res)  {
        db.StringLog.findAll({
          include: [db.customers],
          where: {
              isDone: false
          }
        }).then(function(data)  {
            res.json(data);
        })
    })

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

    app.get("/api/string/complete", function(req,res)  {
        db.StringLog.findAll({
            include: [db.customers],
            where: {
                isDone: true
            }
        }).then((result) =>  {
            res.json(result);
        })
    })

    app.put("/api/string/:id", function(req,res)  {
        db.StringLog.update({isDone: true}, {where: {id: req.params.id}}).then((result) =>  {
            console.log(result);
        })
    })
}