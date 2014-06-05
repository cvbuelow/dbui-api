var Tunnel = require('tunnel-ssh');
var mysql = require('mysql');

var config = {
    remotePort: 3306, 
    verbose: true, // dump information to stdout
    sshConfig: {
      host: 'mileschristi.org',
      port: 22,
      username: 'mcwebadmin',
      password: 'manresa1556'
    }
};

var tunnel = new Tunnel(config);
tunnel.connect(function (error, port) {
    if (error) {
      console.log(error);
    }

    console.log(port);

    var connection = mysql.createConnection({
      host     : '127.0.0.1',
      database : 'mcwebadmin',
      user     : 'mcwebadmin',
      password : 'manresa1556',
      port     : port,
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