define(['express', 'database', 'role'], function(express, Database, Role) {
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
        req.user.roles.push(adminRole);
        req.user.save(function(err) {
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
