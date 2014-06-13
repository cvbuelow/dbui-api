var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname,
    nodeRequire: require,
    paths: {
        app: 'app',
        users: 'models/user',
        index: 'api/index',
        databases: 'api/databases'
    }
});

requirejs(['app', 'index', 'databases'], function(app, index, databases) {
    
  app.use(index);
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