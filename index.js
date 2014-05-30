var Tunnel = require('tunnel-ssh');
var mysql      = require('mysql');

var config = {
    remotePort: 3306, //localport
    localPort: 8181, //remoteport
    verbose: true, // dump information to stdout
    disabled: false, //set this to true to disable tunnel (useful to keep architecture for local connections)
    sshConfig: { //ssh2 configuration (https://github.com/mscdex/ssh2)
      host: 'mileschristi.org',
      port: 22,
      username: 'mcwebadmin',
      password: 'manresa1556'
    }
};

var tunnel = new Tunnel(config);
tunnel.connect(function (error) {
    console.log(error);
    //or start your remote connection here .... 
    //mongoose.connect(...);
    /*var connection = mysql.createConnection({
      host     : '127.0.0.1',
      database : 'mcwebadmin',
      user     : 'mcwebadmin',
      password : 'manresa1556',
      port     : 8181
    });*/

    var connection = mysql.createConnection({
      host     : '127.0.0.1',
      database : 'cmshost',
      user     : 'root',
      password : 'root',
      port     : 8889
    });

    connection.connect(function(err) {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }
      console.log('connected as id ' + connection.threadId);
    });


    //close tunnel to exit script 
    tunnel.close();
});