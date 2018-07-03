const db = require("../models");

module.exports = (app) =>  {
    
    //Create new job
    app.post("/api/string", function(req, res) {
        db.StringLog.create(req.body).then(function(response) {
            res.json(response);
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


    app.put("/api/string/:id", function(req,res)  {
        db.StringLog.update({isDone: true}, {where: {id: req.params.id}}).then((result) =>  {
            res.json(result);
        })
    })

    app.delete('/api/string/delete/:id', function(req,res)  {
        db.StringLog.destroy({
            where: {
                id: req.params.id
            }
        }).then((result) =>  {
            res.json(result);
        })
    })
}