define(['express', 'database', 'role', 'user'], function(express, Database, Role, User) {
  var app = express();

  /* GET databases listing */
  app.get('/databases', function(req, res, next) {
    // Only return databases that user owns or has a role for
    // TODO: add or condition to check user roles
    Database.find({owner: req.user._id}).exec()
      .then(function(databases) {
        res.send(databases);
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
            if (err) { next(err); }
            res.send(201, {id: adminRole.database, user: owner});
          });
        });
    };

    req.body.owner = req.user._id;
    
    Database.create(req.body)
      .then(createRoles)
      .then(addAdminRoleToOwner, next);
    
  });

  /* GET single database */
  app.get('/databases/:id', function(req, res, next) {
    // Only return databases that user owns or has a role for
    // TODO: add or condition to check user roles
    var id = req.params.id;
    Database.findOne({owner: req.user._id, _id: id}).exec()
      .then(function(database) {
        res.send(database);
      }, next);
  });

  /* Update Database */
  app.put('/databases/:id', function(req, res, next) {
    // TODO: check user access
    var id = req.params.id;
    Database.findByIdAndUpdate(id, req.body).exec()
      .then(function() {
        res.send(200);
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
