define(['mongoose'], function(mongoose) {

  var Schema = mongoose.Schema;
  var Database = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' }, //person who pays for it
    hostname: String,
    username: String,
    password: String,
    database: String,
    port: String,
    driver: String,
    charSet: String,
    collat: String,
    sshHost: String,
    sshPort: String,
    sshUser: String,
    sshPass: String,
    sshKey: String,
    displayName: String,
    config: String
  });

  return mongoose.model('Database', Database);
});