/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect;
var Account   = require('../../app/models/account');
var dbConnect = require('../../app/lib/mongodb');
var Mongo     = require('mongodb');
var cp        = require('child_process');
var db        = 'bankr-test';

describe('Account', function(){
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
    it('should create a new Account object', function(){
      var o = {name:'charlie', color:'red', photo:'girl.jpg', pin:'5566', type:'savings', balance:'57'};
      var a1 = new Account(o);

      expect(a1).to.be.instanceof(Account);
      expect(a1.name).to.equal('charlie');
      expect(a1.color).to.equal('red');
      expect(a1.photo).to.equal('girl.jpg');
      expect(a1.pin).to.equal('5566');
      expect(a1.type).to.equal('savings');
      expect(a1.balance).to.equal(57);
      expect(a1.opened).to.be.instanceof(Date);
    });
  });

  describe('.create', function(){
    it('should create an account', function(done){
      var o = {name:'charlie', color:'red', photo:'girl.jpg', pin:'5566', type:'savings', balance:'57'};
      Account.create(o, function(err, account){
        expect(account._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.all', function(){
    it('should find all accounts', function(done){
      Account.all(function(err, accounts){
        expect(accounts).to.have.length(3);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find an account by its id', function(done){
      Account.findById('000000000000000000000001', function(err, account){
        expect(account.name).to.equal('Bob Jones');
        done();
      });
    });
  });
});

