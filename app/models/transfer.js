'use strict';

var Mongo = require('mongodb');

function Transfer(o){
  this.date   = new Date();
  this.amount = parseFloat(o.amount);
  this.fee    = parseFloat(o.fee);
  this.fromId = Mongo.ObjectID(o.fromId);
  this.toId   = Mongo.ObjectID(o.toId);
}

Object.defineProperty(Transfer, 'collection', {
  get: function(){return global.mongodb.collection('transfers');}
});

Transfer.create = function(o, cb){
  var a = new Transfer(o);
  Transfer.collection.save(a, cb);
};

Transfer.query = function(query, cb){
  var property = Object.keys(query)[0];
  query[property] = Mongo.ObjectID(query[property]);
  Transfer.collection.find(query).toArray(cb);
};

module.exports = Transfer;

