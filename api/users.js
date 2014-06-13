define(['express', 'passport', 'user'], function(express, passport, User) {
  var app = express();

  app.post('/login', passport.authenticate('local'), function(req, res) {
    res.cookie('user', JSON.stringify(req.user));
    res.send(req.user);
  });

  app.get('/logout', function(req, res, next) {
    req.logout();
    res.send(200);
  });

  app.post('/users', function(req, res, next) {
    var user = new User({
      email: req.body.email,
      password: req.body.password
    });
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      res.send(200);
    });
  });

  return app;
});
