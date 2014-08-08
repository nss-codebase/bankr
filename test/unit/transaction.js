/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect      = require('chai').expect;
var Transaction = require('../../app/models/transaction');
var dbConnect   = require('../../app/lib/mongodb');
var Mongo       = require('mongodb');
var cp          = require('child_process');
var db          = 'bankr-test';

describe('Transaction', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/freshdb.sh', [db], {cwd:__dirname + '/../scripts'}, function(){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new transaction object', function(){
      var o = {type:'deposit', amount:'50', fee:'25', accountId:'000000000000000000000001'};
      var t1 = new Transaction(o);

      expect(t1).to.be.instanceof(Transaction);
      expect(t1.date).to.be.instanceof(Date);
      expect(t1.type).to.equal('deposit');
      expect(t1.amount).to.equal(50);
      expect(t1.fee).to.equal(25);
      expect(t1.accountId).to.be.instanceof(Mongo.ObjectID);
    });
  });

  describe('.create', function(){
    it('should create an transaction', function(done){
      var o = {type:'deposit', amount:'50', fee:'25', accountId:'000000000000000000000001'};
      Transaction.create(o, function(err, transaction){
        expect(transaction._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.query', function(){
    it('should query for transactions', function(done){
      Transaction.query({accountId:'000000000000000000000001'}, function(err, transactions){
        expect(transactions).to.have.length(5);
        done();
      });
    });
  });
});

