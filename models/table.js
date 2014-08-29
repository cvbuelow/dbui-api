define(['mongoose', 'mysql', 'q'], function(mongoose, mysql, q) {

  var Schema = mongoose.Schema;
  var Table = new Schema({
    databaseId: { type: Schema.Types.ObjectId, ref: 'Database' },
    name: String,
    displayName: String
  });

  return mongoose.model('Table', Table);
});