// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by bk.js.
import { Bk } from "meteor/akyma:bk";

// Simple existence test
Tinytest.add('bk - example', function (test) {
  test.isTrue(!!Bk, 'Bk should be exported by the package');
});
