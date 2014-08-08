/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect;
var Transfer  = require('../../app/models/transfer');
var dbConnect = require('../../app/lib/mongodb');
var Mongo     = require('mongodb');
var cp        = require('child_process');
var db        = 'bankr-test';

describe('Transfer', function(){
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
    it('should create a new transfer object', function(){
      var o = {amount:'50', fee:'25', fromId:'100000000000000000000003', toId:'000000000000000000000001'};
      var t1 = new Transfer(o);

      expect(t1).to.be.instanceof(Transfer);
      expect(t1.date).to.be.instanceof(Date);
      expect(t1.amount).to.equal(50);
      expect(t1.fee).to.equal(25);
      expect(t1.fromId).to.be.instanceof(Mongo.ObjectID);
      expect(t1.toId).to.be.instanceof(Mongo.ObjectID);
    });
  });

  describe('.create', function(){
    it('should create an transfer', function(done){
      var o = {amount:'50', fee:'25', fromId:'100000000000000000000003', toId:'000000000000000000000001'};
      Transfer.create(o, function(err, transfer){
        expect(transfer._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.query', function(){
    it('should query for transfers - from', function(done){
      Transfer.query({fromId:'000000000000000000000001'}, function(err, transfers){
        expect(transfers).to.have.length(2);
        done();
      });
    });

    it('should query for transfers - to', function(done){
      Transfer.query({toId:'000000000000000000000002'}, function(err, transfers){
        expect(transfers).to.have.length(3);
        done();
      });
    });
  });
});

