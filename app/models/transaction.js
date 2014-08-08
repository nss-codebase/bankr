'use strict';

var Mongo = require('mongodb');

function Transaction(o){
  this.date      = new Date();
  this.type      = o.type;
  this.amount    = parseFloat(o.amount);
  this.fee       = parseFloat(o.fee);
  this.accountId = Mongo.ObjectID(o.accountId);
}

Object.defineProperty(Transaction, 'collection', {
  get: function(){return global.mongodb.collection('transactions');}
});

Transaction.create = function(o, cb){
  var a = new Transaction(o);
  Transaction.collection.save(a, cb);
};

Transaction.query = function(query, cb){
  query.accountId = Mongo.ObjectID(query.accountId);
  Transaction.collection.find(query).toArray(cb);
};

module.exports = Transaction;

