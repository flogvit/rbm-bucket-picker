/**
 * Created by flogvit on 2015-10-15.
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
var picker = new bucketpicker.Picker();

describe('Checking Picker', function() {
  var its = [
    {
      text: 'Initial test',
      buckets: 1,
      numbers: [1,2,3,4,5,6,7,8,9,10],
      answers: [1,1,1,1,1,1,1,1,1,1]
    },
    {
      text: '2 buckets',
      buckets: 2,
      numbers: [1,2,3,4,5,6,7,8,9,10],
      answers: [1,2,1,2,1,2,1,2,1,2]
    },
    {
      text: '3 buckets',
      buckets: 3,
      numbers: [1,2,3,4,5,6,7,8,9,10],
      answers: [1,2,3,2,1,3,1,2,3,2]
    },
    {
      text: '4 buckets',
      buckets: 4,
      numbers: [1,2,3,4,5,6,7,8,9,10],
      answers: [1,2,3,4,1,3,1,4,3,2]
    }
  ]

  its.forEach(function(entry) {
    it('should do '+entry.text, function(done) {
      if ('numbers' in entry) {
        picker.setBucketCount(entry.buckets);
        for (var pos = 0; pos < entry.numbers.length; pos++) {
          picker.pick(entry.numbers[pos]).should.equal(entry.answers[pos]);
        }
        done();
      }
    })
  });
})
