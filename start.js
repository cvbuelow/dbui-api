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

requirejs(['app', 'express-jwt', 'index', 'users', 'databases'], function(app, expressJwt, index, users, databases) {
  
  app.use('/databases', expressJwt({secret: 'secret'}));

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