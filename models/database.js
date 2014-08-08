define(['mongoose', 'tunnel-ssh', 'mysql'], function(mongoose, Tunnel, mysql) {

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

    tunnel.connect(function (error, port) {
      if (error) {
        console.log('error', error);
      }

      console.log('port', port);

      var connection = mysql.createConnection({
        host: db.hostname,
        database: db.name,
        user: db.username,
        password: db.password,
        port: port,
        insecureAuth: true
      });

      connection.connect(function(err) {
        if (err) {
          console.error('error connecting: ' + err.stack);
          return;
        }
      });

      connection.query('SELECT * FROM `breakfast-registrations`', function(err, rows) {
        if (err) throw err;
        rows.forEach(function(row) {
          console.log(row.fname);
        });
        connection.end(function() {
          console.log('ended mysql');
        });
        console.log(this.server);
        tunnel.close();
      });

    });
  };

  return mongoose.model('Database', Database);
});