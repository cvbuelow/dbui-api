define(['express', 'morgan', 'cookie-parser', 'body-parser', 'mongoose'],
  function(express, logger, cookieParser, bodyParser, mongoose) {
    
    mongoose.connect('mongodb://localhost/dbui');

    var app = express();

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(cookieParser());

    return app;
  });