'use strict';

var Ajv = require('ajv');
var addKeywords = require('..');
var addPatch = require('../keywords/patch');
var test = require('./test_validate');

describe('keyword $patch', function() {
  var ajvInstances;

  beforeEach(function() {
    ajvInstances = [ new Ajv({v5: true}), new Ajv({v5: true}) ];
    addKeywords(ajvInstances[0]);
    addPatch(ajvInstances[1]);
  });

  it('should extend schema defined in $patch', function() {
    ajvInstances.forEach(testPatch);

    function testPatch(ajv) {
      var schema = {
        "$patch": {
          "source": {
            "type": "object",
            "properties": { "p": { "type": "string" } },
            "additionalProperties": false
          },
          "with": [
            { "op": "add", "path": "/properties/q", "value": { "type": "number" } }
          ]
        }
      };

      var validate = ajv.compile(schema);
      test(validate, '$patch');
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
        "$patch": {
          "source": { "$ref": "obj.json#" },
          "with": [
            { "op": "add", "path": "/properties/q", "value": { "type": "number" } }
          ]
        }
      };

      var validate = ajv.compile(schema);
      test(validate, '$patch');
    }
  });
});
