
var client = require('twilio')(process.env.TWIL_KEY, process.env.TWIL_TOKEN);

  module.exports = function(app)  {
      app.post("/api/message/:phone", function(req,res)  {
        client.messages.create({
            from: "+19808888448",
            to: req.params.phone,
            body: "Your string job is finished and your racquet can be picked up."
          }).then((message) => res.json(message.id));
      })

      app.post('/api/message/:phone/:message', function(req,res)  {
        client.messages.create({
              from: "+19808888448",
              to: req.params.phone,
              body: req.params.message
          }).then((result) =>  {
              res.json(result.id)
              console.log(result);
            });
      })
  }
