var express = require('express');
var router = express.Router();

/* GET databases listing. */
router.get('/', function(req, res) {
  var db = req.db;
  var databases = db.get('databases');
  res.send({
    databases: databases
  });
});

module.exports = router;
