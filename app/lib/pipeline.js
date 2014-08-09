'use strict';

var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('express-method-override');
var home = require('../controllers/home');
var accounts = require('../controllers/accounts');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());

  app.get('/', home.index);
  app.get('/about', home.about);
  app.get('/faq', home.faq);
  app.get('/contact', home.contact);

  app.get('/accounts/new', accounts.new);
  app.post('/accounts', accounts.create);
  app.get('/accounts', accounts.index);
  app.get('/accounts/:id', accounts.show);
  app.get('/accounts/:id/transaction', accounts.transaction);
  app.get('/accounts/:id/transfer', accounts.transfer);
  app.post('/accounts/:id/transaction', accounts.addTransaction);
  app.post('/accounts/:id/transfer', accounts.addTransfer);

  console.log('Pipeline Configured');
};

