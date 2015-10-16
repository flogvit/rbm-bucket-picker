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

var bucket = new picker.Bucket(2, 4);
bucket.add(2);
bucket.remove(2);
bucket.isMime(2);
bucket.has(2);
bucket.setBucketCount(5, function(number, cb), callback);
```

Bucket Picker is a module which can help you distribute load. You can use it to much more, but it
was designed to be a helper in the router of the RBM framework. So what does it do? It put numbers
in different buckets. In the RBM framework the buckets are background services which the router
sends the jobs to. 

Let's say you have 3 background jobs which holds the data in memory, and you get get a request to
do something about the data behind id 10. Which service do you send the data to? And when you add
another service, how do you distribute the data again? One way is to keep all the ids in the router
so it always knows where to send it. But when you get too many ids (billions), or the service does 
not tell the router when it is finished, you have a problem.

What does Bucket Picker do? It is an algorithm which the router can use to find which service has
the id. It is pretty fast, so calculating which service to send the data to is done quickly.
Lets say you have 1 service and the ids 1-10

```javascript
[1,2,3,4,5,6,7,8,9,10] // The numbers
[1,1,1,1,1,1,1,1,1,1]  // The service
```

All the numbers are in service/bucket 1. What happens if you add a service?

```javascript
[1,2,3,4,5,6,7,8,9,10] // The numbers
[1,2,1,2,1,2,1,2,1,2]  // The service
``

Now we have to move 50% of the ids from service 1 to service 2. But what happens if we add another one?

```javascript
[1,2,3,4,5,6,7,8,9,10] // The numbers
[1,2,3,2,1,3,1,2,3,2]  // The service
```

Now we only move 1/3 of the numbers. So adding services/buckets only need us to move 1/n of the numbers,
where n is the count of services.`

What do you do when you want to remove a service? Let's say you have 20 services and want to remove number 2.
What you do is move the last service to number 2, and move away the numbers from the last service and number 2.
