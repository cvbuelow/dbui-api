define(['events', 'mongoose', 'tunnel-ssh', 'mysql', 'q'], function(events, mongoose, Tunnel, mysql, q) {

  var eventEmitter = new events.EventEmitter();
  var Schema = mongoose.Schema;
  var Database = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' }, //person who pays for it
    hostname: { type: String, default: '127.0.0.1' },
    username: String,
    password: String,
    name: String,
    port: { type: String, default: '3306' },
    driver: String,
    charSet: String,
    collat: String,
    sshHost: String,
    sshPort: { type: String, default: '22' },
    sshUser: String,
    sshPass: String,
    sshKey: String,
    displayName: String,
    config: String
  });

  Database.methods.connect = function() {

    var db = this,
        connection;

    var tunnel = new Tunnel({
          remoteHost: db.hostname,
          remotePort: db.port,
          verbose: true, // dump information to stdout
          sshConfig: {
            host: db.sshHost,
            port: db.sshPort,
            username: db.sshUser,
            password: db.sshPass
          }
        });

    var connectToMySQL = function (address) {

      var connection = mysql.createConnection({
        host: address.address,  //not sure this is right...might need to be db.hostname
        database: db.name,
        user: db.username,
        password: db.password,
        port: address.port,
        insecureAuth: true
      });
      return q.ninvoke(connection, 'connect');
    };

    eventEmitter.on('close-tunnel', tunnel.close.bind(tunnel));

    return tunnel.connect()
      .then(connectToMySQL);
  };

  Database.methods.disconnect = function() {
    eventEmitter.emit('close-tunnel');
  };
  
  Database.methods.query = function(sql) {
    
    var queryMySQL = function() {
      return q.ninvoke(connection, 'query', sql);
      /*connection.query(sql, function(err, rows) {
        if (err) defer.reject(err);

        connection.end(function(err) {
          console.log('ended mysql', err);
        });
        tunnel.close();
        defer.resolve(rows);
      });*/
    };

    return this.connect()
      .then(queryMySQL);
  };

  return mongoose.model('Database', Database);
});