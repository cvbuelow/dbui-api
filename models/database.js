define(['mongoose', 'tunnel-ssh', 'mysql', 'q'], function(mongoose, Tunnel, mysql, q) {

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

  Database.methods.test = function() {
    return this.query('SHOW TABLES');
  };

  Database.methods.connect = function() {

    var db = this;

    var tunnel = new Tunnel({
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
        host: db.hostname,
        database: db.name,
        user: db.username,
        password: db.password,
        port: address.port,
        insecureAuth: true
      });

      return q.nfcall(connection.connect);
    };

    return tunnel.connect()
      .then(connectToMySQL)
      .finally(tunnel.close);
  };
  
  Database.methods.query = function(sql) {
    var defer = q.defer();

    var db = this;

    var tunnel = new Tunnel({
      remotePort: db.port,
      verbose: true, // dump information to stdout
      sshConfig: {
        host: db.sshHost,
        port: db.sshPort,
        username: db.sshUser,
        password: db.sshPass
      }
    });

    tunnel.connect(function (address) {

      var connection = mysql.createConnection({
        host: db.hostname,
        database: db.name,
        user: db.username,
        password: db.password,
        port: address.port,
        insecureAuth: true
      });

      connection.connect(function(err) {
        console.log('err', err);
        if (err) {
          tunnel.close();
          defer.reject(err);
        } else {
          connection.query(sql, function(err, rows) {
            if (err) defer.reject(err);

            connection.end(function(err) {
              console.log('ended mysql', err);
            });
            tunnel.close();
            defer.resolve(rows);
          });
        }
      });


    });

    return defer.promise;
  };

  return mongoose.model('Database', Database);
});