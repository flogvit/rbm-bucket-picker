/**
 * Created by flogvit on 2015-10-15.
 *
 * @copyright Cellar Labs AS, 2015, www.cellarlabs.com, all rights reserved
 * @file
 * @license MIT
 * @author Vegard Hanssen <Vegard.Hanssen@cellarlabs.com>
 *
 * I tried using primes to iterate over instead of checking all. For 100 buckets it was
 * 3 times slower, so I stuck with the easy version.
 */

var async = require('async');

/**
 *
 * @param count
 * @constructor
 */
function BucketPicker(count) {
  this.buckets = Number(count) !== null ? Number(count) : 1;
}

/**
 *
 * @param position
 * @constructor
 */

function Bucket(position) {
  this.bucket = Number(position) !== null ? Number(position) : 0;
  this.numbers = [];
}

BucketPicker.prototype.setBuckets = function(count) {
  this.buckets = count;
}

Bucket.prototype.addNumber = function(number) {
  this.numbers.push(number);
}

Bucket.prototype.setBucketCount = function(count, move, callback) {
  var bp = new BucketPicker(count);
  async.eachLimit(this.numbers, 1, function(number, cb) {
    if (bp.pick(number)!==this.bucket) {
      move(number, function(err) {
        if (err)
          cb(err)
        else
          cb();
      })
    } else cb();
  }, function(err) {
    callback(err);
  })
}


/**
 * Pick the bucket for a number
 *
 * This simple function does a smart job picking the correct bucket to put a number in.
 * It will try to keep as many numbers as possible in previous buckets.
 * So if you have 1 bucket and 10 numbers, it will, of course, pick bucket 1 for all.
 *
 * [1,2,3,4,5,6,7,8,9,10] numbers
 * [1,1,1,1,1,1,1,1,1,1,] buckets
 *
 * If you then add another bucket, it will move 50% (1/2) of the numbers to bucket 2
 * [1,2,3,4,5,6,7,8,9,10] numbers
 * [1,2,1,2,1,2,1,2,1,2]  buckets
 *
 * But when you add another buckets, so you have 3 buckets, it will only move the ones
 * related to 3. So it keeps 7/10 in their old bucket, so it only moves 30% (or more accurate
 * 1/3)
 *
 * [1,2,3,4,5,6,7,8,9,10] numbers
 * [1,2,3,2,1,3,1,2,3,2]  buckets
 *
 * And when you add another one, it will only move 1/4
 *
 * [1,2,3,4,5,6,7,8,9,10] numbers
 * [1,2,3,4,1,3,1,4,3,2]  buckets
 *
 * What happens if you remove bucket 2? Well, it does not work very well out of the box. But what
 * you should do is to delete 2, and move the last one to 2. This way you only need to move
 * entries from the last one and 2.
 *
 * When I created this function I needed it for picking loadbalancing nodes, but it can be
 * used for much more
 *
 * @param number
 * @param buckets
 * @returns number
 */

BucketPicker.prototype.pick = function(number) {
  for(var n=this.buckets;n>0;n--) {
    if (number%n===0) {
      return n;
    }
  }
}

exports.Picker = BucketPicker;
exports.Bucket = Bucket;
