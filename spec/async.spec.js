'use strict';

var Ajv = require('ajv');
var addKeywords = require('..');
var test = require('./test_validate');
var assert = require('assert');

describe('async schema loading', function() {
  var ajv, loadCount;

  beforeEach(function() {
    ajv = new Ajv({v5: true, loadSchema: loadSchema});
    addKeywords(ajv);
    loadCount = 0;
  });

  describe('$merge', function() {
    it('should load missing schemas', function (done) {
      var schema = {
        "$merge": {
          "source": { "$ref": "obj.json#" },
          "with": {
            "properties": { "q": { "type": "number" } }
          }
        }
      };

      testAsync(schema, '$merge', done);
    });
  });

  describe('$patch', function() {
    it('should load missing schemas', function (done) {
      var schema = {
        "$patch": {
          "source": { "$ref": "obj.json#" },
          "with": [
            { "op": "add", "path": "/properties/q", "value": { "type": "number" } }
          ]
        }
      };

      testAsync(schema, '$patch', done);
    });
  });

  function testAsync(schema, keyword, done) {
    ajv.compileAsync(schema, function (err, validate) {
      if (err) done(err);
      assert.strictEqual(loadCount, 1);
      test(validate, keyword);
      done();
    });
  }

  function loadSchema(ref, callback) {
    if (ref == 'obj.json') {
      loadCount++;
      return callback(null, {
        "id": "obj.json#",
        "type": "object",
        "properties": { "p": { "type": "string" } },
        "additionalProperties": false
      });
    }
    callback(new Error('404: ' + ref));
  }
});
