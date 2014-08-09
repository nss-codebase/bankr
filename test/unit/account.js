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
        expect(account).to.be.instanceof(Account);
        expect(account.name).to.equal('Bob Jones');
        done();
      });
    });
  });

  describe('#transaction', function(){
    it('should create a transaction - deposit', function(done){
      Account.findById('000000000000000000000001', function(err, account){
        account.transaction({type:'deposit', pin:'1234', amount:'100'}, function(err, transaction){
          expect(account.balance).to.equal(8100);
          expect(transaction.date).to.be.instanceof(Date);
          expect(transaction.type).to.equal('deposit');
          expect(transaction.amount).to.equal(100);
          expect(transaction.fee).to.equal(0);
          expect(transaction.accountId).to.deep.equal(Mongo.ObjectID('000000000000000000000001'));
          done();
        });
      });
    });

    it('should not create a transaction - bad pin', function(done){
      Account.findById('000000000000000000000001', function(err, account){
        account.transaction({type:'deposit', pin:'2341', amount:'100'}, function(err, transaction){
          expect(transaction).to.be.undefined;
          done();
        });
      });
    });

    it('should create a transaction - withdraw', function(done){
      Account.findById('000000000000000000000001', function(err, account){
        account.transaction({type:'withdraw', pin:'1234', amount:'100'}, function(err, transaction){
          expect(account.balance).to.equal(7900);
          expect(transaction.amount).to.equal(100);
          expect(transaction.fee).to.equal(0);
          done();
        });
      });
    });

    it('should create a transaction - withdraw with fee', function(done){
      Account.findById('000000000000000000000001', function(err, account){
        account.transaction({type:'withdraw', pin:'1234', amount:'10000'}, function(err, transaction){
          expect(account.balance).to.equal(-2050);
          expect(transaction.amount).to.equal(10000);
          expect(transaction.fee).to.equal(50);
          done();
        });
      });
    });
  });

  describe('#transfer', function(){
    it('should transfer money - good - enough funds', function(done){
      Account.findById('000000000000000000000001', function(err, sender){
        sender.transfer({toId:'000000000000000000000002', pin:'1234', amount:'100'}, function(err, transfer){
          Account.findById('000000000000000000000002', function(err, receiver){
            expect(sender.balance).to.equal(7875);
            expect(receiver.balance).to.equal(5100);
            expect(transfer.date).to.be.instanceof(Date);
            expect(transfer.amount).to.equal(100);
            expect(transfer.fee).to.equal(25);
            expect(transfer.fromId).to.deep.equal(Mongo.ObjectID('000000000000000000000001'));
            expect(transfer.toId).to.deep.equal(Mongo.ObjectID('000000000000000000000002'));
            done();
          });
        });
      });
    });

    it('should transfer money - bad - bad pin', function(done){
      Account.findById('000000000000000000000001', function(err, sender){
        sender.transfer({toId:'000000000000000000000002', pin:'1231', amount:'100'}, function(err, transfer){
          expect(transfer).to.be.undefined;
          done();
        });
      });
    });

    it('should transfer money - bad - not enough money', function(done){
      Account.findById('000000000000000000000001', function(err, sender){
        sender.transfer({toId:'000000000000000000000002', pin:'1231', amount:'100000'}, function(err, transfer){
          expect(transfer).to.be.undefined;
          done();
        });
      });
    });
  });
});

