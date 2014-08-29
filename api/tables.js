define(['express', 'database', 'table', 'user'], function(express, Database, Table, User) {
  var app = express();

  /* GET tables listing */
  app.get('/databases/:id/tables', function(req, res, next) {
    
    var getDatabase = function(hasAccess) {
      return Database.find(hasAccess).exec();
    };

    var getTables = function(database) {
      return Table.find({ databaseId: database._id }).exec();
    };

    User.getDatabaseAccessQuery(req.user)
      .then(getDatabase)
      .then(getTables)
      .then(res.send.bind(res), next);
  });


  return app;
});
