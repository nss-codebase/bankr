'use strict';

var Mongo = require('mongodb');

function Account(o){
  this.name    = o.name;
  this.color   = o.color;
  this.photo   = o.photo;
  this.pin     = o.pin;
  this.type    = o.type;
  this.balance = parseFloat(o.balance);
  this.opened  = new Date(o.opened);
}

Object.defineProperty(Account, 'collection', {
  get: function(){return global.mongodb.collection('accounts');}
});

Account.create = function(o, cb){
  var a = new Account(o);
  Account.collection.save(a, cb);
};

Account.all = function(cb){
  Account.collection.find().toArray(cb);
};

Account.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Account.collection.findOne({_id:_id}, cb);
};

module.exports = Account;

