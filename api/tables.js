define(['express', 'database', 'table', 'user'], function(express, Database, Table, User) {
  var app = express();
  
  var getDatabase = function(id, hasAccess) {
    return Database.findOne({ $and: [{ _id: id }, hasAccess]}).exec();
  };

  /* GET tables listing */
  app.get('/databases/:id/tables', function(req, res, next) {
        
    var getTables = function(database) {
      return Table.find({ databaseId: database._id }).exec();
    };

    User.getDatabaseAccessQuery(req.user)
      .then(getDatabase.bind(null, req.params.id))
      .then(getTables)
      .then(res.send.bind(res), next);
  });

  /* Create Table */
  app.post('/databases/:id/tables', function(req, res, next) {
    
    var validateRemoteTable = function(database) {
      return database.query('SHOW TABLES LIKE ?', req.body.remoteTable)
        .then(function(result) {
          if (!result[0].length) {
            throw Error('Table does not exist');
          }
        });
    };

    var createTable = function() {
      return Table.create(req.body);
    };

    // Ignore databaseId value in request since that hasn't been validated
    req.body.databaseId = req.params.id;
    
    User.getDatabaseAccessQuery(req.user)
      .then(getDatabase.bind(null, req.params.id))
      .then(validateRemoteTable)
      .then(createTable)
      .then(res.send.bind(res), next);
  });

  return app;
});
