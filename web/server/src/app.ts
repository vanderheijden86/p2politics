import { Request, Response } from "express";
import { Cors } from './setup/cors';
import { RegisterRoutes } from './routes';

let express = require('express');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');

// let passport = require('passport');
// let auth = require('./setup/auth');

let Rx = require('rx');

// let routes = require('./routes/index');
let app = express();

app.use('/docs', express.static(__dirname + '/swagger-ui'));
app.use('/swagger.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'swagger.json'));
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

// setup cors
app.use(Cors.allowCrossDomain);

// setup authentication
// app.use('/api', passport.initialize());
// app.use('/api', auth.authenticate);

// setup client routes (to serve the Angular app on Azure)
// require('./routes/clientRoutes').setupClientRoutes(app);

RegisterRoutes(app);

// app.use('/', routes);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: Function) => {
  let err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err: any, req: Request, res: Response, next: Function) {
    console.log(err);
    res.status(err.status || 500);
    res.send(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err: any, req: Request, res: Response, next: Function) {
  res.status(err.status || 500);
    console.log(err);
    res.send(err);
});


module.exports = app;
