var Tunnel = require('tunnel-ssh');
var mysql = require('mysql');

var config = {
    remotePort: 3306, 
    localPort: 8182, 
    verbose: true, // dump information to stdout
    sshConfig: {
      host: 'mileschristi.org',
      port: 22,
      username: 'mcwebadmin',
      password: 'manresa1556'
    }
};

var tunnel = new Tunnel(config);
tunnel.connect(function (error) {
    console.log(error);

    var connection = mysql.createConnection({
      host     : '127.0.0.1',
      database : 'mcwebadmin',
      user     : 'mcwebadmin',
      password : 'manresa1556',
      port     : config.localPort,
      insecureAuth: true
    });

    connection.connect(function(err) {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }
    });
    
    connection.query('SELECT 1 + 1 AS solution', function(err, rows) {
      if (err) throw err;
      console.log('The solution is: ', rows[0].solution);
    });
    
    connection.end(tunnel.close);

});