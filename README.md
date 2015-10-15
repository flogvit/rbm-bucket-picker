# rbm-bucket-picker

Easy way of picking buckets to put numbers in

[![Build Status](https://travis-ci.org/flogvit/rbm-bucket.picker.png)](https://travis-ci.org/flogvit/rbm-bucket-picker)

Usage:

```javascript
var picker = require('rbm-bucket-picker');
var bp = new picker.Picker(2);
console.log(bp.pick(300));

// 2

bp.setBucketCount(3);
console.log(bp.pick(300));

// 3
```
