'use strict';

var Ajv = require('ajv');
var addKeywords = require('..');
var addMerge = require('../keywords/merge');
var test = require('./test_validate');

describe('keyword $merge', function() {
  var ajvInstances;

  beforeEach(function() {
    ajvInstances = [ new Ajv({v5: true}), new Ajv({v5: true}) ];
    addKeywords(ajvInstances[0]);
    addMerge(ajvInstances[1]);
  });

  it('should extend schema defined in $merge', function() {
    ajvInstances.forEach(testMerge);

    function testMerge(ajv) {
      var schema = {
        "$merge": {
          "source": {
            "type": "object",
            "properties": { "p": { "type": "string" } },
            "additionalProperties": false
          },
          "with": {
            "properties": { "q": { "type": "number" } }
          }
        }
      };

      var validate = ajv.compile(schema);
      test(validate, '$merge');
    }
  });

  it('should extend schema defined in $ref', function() {
    ajvInstances.forEach(testMerge);

    function testMerge(ajv) {
      var sourceSchema = {
        "id": "obj.json#",
        "type": "object",
        "properties": { "p": { "type": "string" } },
        "additionalProperties": false
      };

      ajv.addSchema(sourceSchema);

      var schema = {
        "$merge": {
          "source": { "$ref": "obj.json#" },
          "with": {
            "properties": { "q": { "type": "number" } }
          }
        }
      };

      var validate = ajv.compile(schema);
      test(validate, '$merge');
    }
  });
});
