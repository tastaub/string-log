
var client = require('twilio')(
    "AC167bc81780158976408a371fce961ec4",
    "5586cdbb89875d41f6eac322181af125"
  );

  module.exports = function(app)  {
      app.post("/api/message", function(req,res)  {
        client.messages.create({
            from: "+19808888448",
            to: "+17049427072",
            body: "This is a test for the group project!"
          }).then((message) => res.json(message.id));
      })
  }
