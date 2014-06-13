var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname,
    nodeRequire: require,
    paths: {
        app: 'app',
        user: 'models/user',
        index: 'api/index',
        users: 'api/users',
        databases: 'api/databases'
    }
});

requirejs(['app', 'index', 'users', 'databases'], function(app, index, users, databases) {
    
  app.use(function(req, res, next) {
    if (req.user) {
      res.cookie('user', JSON.stringify(req.user));
    }
    next();
  });

  app.use(index);
  app.use(users);
  app.use(databases);

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, { message: err.message });
  });

  app.set('port', process.env.PORT || 3000);

  app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });
});