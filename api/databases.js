define(['express', 'database', 'role', 'user'], function(express, Database, Role, User) {
  var app = express();

  /* GET databases listing. */
  app.get('/databases', function(req, res, next) {
    // Only return databases that user owns or has a role for
    // TODO: add or condition to check user roles
    Database.find({owner: req.user._id}, function(err, databases) {
      if (err) {
        return next(err);
      }
      res.send(databases);
    });
  });

  /* GET single database. */
  app.get('/databases/:id', function(req, res, next) {
    // Only return databases that user owns or has a role for
    // TODO: add or condition to check user roles
    var id = req.params.id;
    Database.findOne({owner: req.user._id, _id: id}, function(err, database) {
      if (err) {
        return next(err);
      }
      res.send(database);
    });
  });

  app.post('/databases', function(req, res, next) {
    req.body.owner = req.user._id;
    var db = new Database(req.body);
    
    db.save(function(err) {
      if (err) {
        return next(err);
      }

      // THIS IS MESSY...
      // Add 'admin' and 'user' roles for this db
      var adminRole = new Role({ name: 'admin', database: db._id});
      adminRole.save(function(err) {
        if (err) {
          return next(err);
        }
        // Give owner 'admin' role
        var user = new User(req.user);
        user.roles.push(adminRole);
        user.save(function(err) {
          if (err) {
            return next(err);
          }
        });
      });
      var userRole = new Role({ name: 'user', database: db._id});
      userRole.save(function(err) {
        if (err) {
          return next(err);
        }
      });

      res.send(200);
    });
  });

  return app;
});
