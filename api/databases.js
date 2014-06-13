define(['express'], function(express) {
  var app = express();

  /* GET databases listing. */
  app.get('/databases', function(req, res, next) {
    var databases = {};
    res.send({
      databases: databases
    });
  });

  return app;
});
