define(['express', 'database', 'role', 'user'], function(express, Database, Role, User) {
  var app = express();

  /* GET databases listing */
  app.get('/databases', function(req, res, next) {
    // Only return databases that user owns or has a role for
    User.getDatabaseAccessQuery(req.user).then(function(hasAccess) {
      return Database.find(hasAccess).exec()
        .then(res.send.bind(res));
    }, next);
  });

  /* Test Database */
  app.post('/databases/test', function(req, res, next) {
    
    var db = new Database(req.body);
    db.connect().done(function() {
      res.send(200);
    }, next);
    
  });

  /* Create Database */
  app.post('/databases', function(req, res, next) {
    
      // Add 'admin' and 'user' roles for this db
    var createRoles = function(db) {
      return Role.create({ name: 'admin', database: db._id},
                  { name: 'user', database: db._id});
    };

    var addAdminRoleToOwner = function(adminRole) {
      return User.findById(req.user._id).exec()
        .then(function(owner) {
          owner.roles.push(adminRole);
          owner.save(function(err) {
            if (err) next(err);
            res.send(201, { id: adminRole.database });
          });
        });
    };

    req.body.owner = req.user._id;
    
    Database.create(req.body)
      .then( createRoles )
      .then( addAdminRoleToOwner, next );
    
  });

  /* GET remote tables */
  app.get('/databases/:id/remote-tables', function(req, res, next) {
    var id = req.params.id;
    
    var getDatabase = function(hasAccess) {
      return Database.findOne({ $and: [{ _id: id }, hasAccess]}).exec();
    };
    
    var getRemoteTables = function(database) {
      return database.query('SHOW TABLES');
    };

    User.getDatabaseAccessQuery(req.user, 'admin')
      .then( getDatabase )
      .then( getRemoteTables )
      .then( res.send.bind(res), next );
  });

  /* GET single database */
  app.get('/databases/:id', function(req, res, next) {
    var id = req.params.id;
    
    var getDatabase = function(hasAccess) {
      return Database.findOne({ $and: [{ _id: id }, hasAccess]}).exec();
    };
    
    User.getDatabaseAccessQuery(req.user, 'admin')
      .then( getDatabase )
      .then( res.send.bind(res), next );
  });

  /* Update Database */
  app.put('/databases/:id', function(req, res, next) {
    // TODO: check user access
    var id = req.params.id;
    Database.findByIdAndUpdate(id, req.body).exec()
      .then(function(result) {
        res.send(200, result);
      }, next);
  });

  /* Delete Database */
  app.delete('/databases/:id', function(req, res, next) {
    // TODO: check user access
    var id = req.params.id;
    Database.findByIdAndRemove(id).exec()
      .then(function() {
        // Remove roles, tables, fields, etc.

        res.send(200);
      }, next);
  });

  return app;
});
