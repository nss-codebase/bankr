'use strict';

var Account = require('../models/account');
var moment  = require('moment');
var _       = require('lodash');

exports.new = function(req, res){
  res.render('accounts/new');
};

exports.index = function(req, res){
  Account.all(function(err, accounts){
    res.render('accounts/index', {accounts:accounts, moment:moment});
  });
};

exports.create = function(req, res){
  Account.create(req.body, function(){
    res.redirect('/accounts');
  });
};

exports.show = function(req, res){
  Account.all(function(err, accounts){
    Account.findById(req.params.id, function(err, account){
      res.render('accounts/show', {accounts:accounts, account:account, moment:moment, _:_});
    }, true);
  });
};

exports.transaction = function(req, res){
  Account.findById(req.params.id, function(err, account){
    res.render('accounts/transaction', {account:account});
  });
};

exports.transfer = function(req, res){
  Account.findById(req.params.id, function(err, account){
    Account.all(function(err, accounts){
      res.render('accounts/transfer', {account:account, accounts:accounts});
    });
  });
};

exports.addTransaction = function(req, res){
  Account.findById(req.params.id, function(err, account){
    account.transaction(req.body, function(){
      res.redirect('/accounts/' + req.params.id);
    });
  });
};

exports.addTransfer = function(req, res){
  Account.findById(req.params.id, function(err, account){
    account.transfer(req.body, function(){
      res.redirect('/accounts/' + req.params.id);
    });
  });
};

