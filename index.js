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

function Bucket(position, count) {
  this.bucket = position ? position : 1;
  this.numbers = [];
  this.bp = new BucketPicker(count ? count : 1);
}

/**
 * Set the bucket count
 * @param count
 */
BucketPicker.prototype.setBucketCount = function(count) {
  this.buckets = count;
}

/**
 * Add a number to the bucket, regardless of the bucket should own it
 * @param number
 */
Bucket.prototype.add = function(number) {
  this.numbers.push(number);
}

/**
 * Check if a number should fall into this bucket
 *
 * @param number
 * @returns {boolean}
 */
Bucket.prototype.isMine = function(number) {
  return this.bp.pick(number)===this.bucket;
}

/**
 * Remove a number from the bucket
 * @param number
 */
Bucket.prototype.remove = function(number) {
  var i = this.numbers.indexOf(number);
  if (i>-1)
    this.numbers.splice(i, 1);
}

/**
 * Set the count of buckets, so the bucket can move away the numbers
 * which is does not own
 *
 * @param count     The new count of buckets
 * @param move      The function to do the move. move(number, callback)
 * @param callback  Function to call when done with all the moves
 */
Bucket.prototype.setBucketCount = function(count, move, callback) {
  var self = this;
  var bp = new BucketPicker(count);
  // Make a copy of the number array, so .splice in .remove does not change it
  var numbers = this.numbers.slice(0);
  // Do not lock the process
  async.eachLimit(numbers, 1, function(number, cb) {
    if (bp.pick(number)!==self.bucket) {
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

Bucket.prototype.has = function(number) {
  return this.numbers.indexOf(number)>-1;
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
 * When I created this function I needed it for picking load balancing nodes, but it can be
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
