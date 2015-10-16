/**
 * Created by flogvit on 2015-10-16.
 *
 * @copyright Cellar Labs AS, 2015, www.cellarlabs.com, all rights reserved
 * @file
 * @license Cellarlabs
 * @author Vegard Hanssen <Vegard.Hanssen@cellarlabs.com>
 *
 */

require('should');
require('assert');
var bucketpicker = require('../index.js');
var bucket = new bucketpicker.Bucket();

describe('Checking Bucket', function() {

  it('should add a number to bucket', function(done) {
    bucket.add(1);
    done();
  })

  it('should find the number in the bucket', function(done) {
    bucket.has(1).should.equal(true);
    done();
  })

  it('should not find number 2', function(done) {
    bucket.has(2).should.equal(false);
    done();
  })

  it('should add all numbers up to 10', function(done) {
    for(var i=2;i<=10;i++) {
      bucket.add(i);
    }
    for(var i=1;i<=10;i++) {
      bucket.has(i).should.equal(true);
    }
    done();
  })

  it('should create a bucket 2 of 4', function(done) {
    bucket = new bucketpicker.Bucket(2, 4);
    bucket.has(1).should.equal(false);
    done();
  })

  it('should add all numbers from 1 to 10', function(done) {
    for(var i=1;i<=10;i++) {
      bucket.add(i);
    }
    for(var i=1;i<=10;i++) {
      bucket.has(i).should.equal(true);
    }
    done();
  })

  it('should move away all numbers which should not be in bucket', function(done) {
    bucket.setBucketCount(4, function(number, cb) {
      console.log('Removing '+number);
      bucket.remove(number);
      cb();
    }, function(err) {
      for(var i=1;i<=10;i++) {
        if (i===2 || i===10) {
          bucket.has(i).should.equal(true);
        } else {
          bucket.has(i).should.equal(false);
        }
      }
      done();
    })
  })

  it('should check some number for isMime', function(done) {
    bucket = new bucketpicker.Bucket(3, 4);
    for(var i=1;i<=10;i++) {
      if (i===3 || i===6 || i===9) {
        bucket.isMine(i).should.equal(true);
      } else {
        bucket.isMine(i).should.equal(false);
      }
    }
    done();
  })
});
