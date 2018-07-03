
var client = require('twilio')(
    "AC167bc81780158976408a371fce961ec4",
    "5586cdbb89875d41f6eac322181af125"
  );

  module.exports = function(app)  {
      app.post("/api/message/:phone", function(req,res)  {
        client.messages.create({
            from: "+19808888448",
            to: req.params.phone,
            body: "Your string job is finished and your racquet can be picked up."
          }).then((message) => res.json(message.id));
      })

      app.post('/api/message/to', function(req,res)  {
        console.log(req.body);  
        client.messages.create({
              from: "+19808888448",
              to: req.body.phone,
              body: req.body.message
          }).then((result) =>  {
              res.json(result.id)
              console.log(result);
            });
      })
  }
