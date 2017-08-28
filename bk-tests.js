// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by bk.js.
import { name as packageName } from "meteor/a-kyma:bk";

// Write your tests here!
// Here is an example.
Tinytest.add('bk - example', function (test) {
  test.equal(packageName, "bk");
});
