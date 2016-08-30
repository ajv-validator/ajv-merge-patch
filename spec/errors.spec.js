'use strict';

var Ajv = require('ajv');
var addKeywords = require('..');
var addMerge = require('../keywords/merge');
var addPatch = require('../keywords/patch');
var assert = require('assert');

describe('errors', function() {
  var ajv;

  describe('no v5 option', function() {
    beforeEach(function() {
      ajv = new Ajv;
    });

    it('adding $merge and $patch should throw without v5 option', function() {
      assert.throws(function() {
        addKeywords(ajv);
      });
    });

    it('adding $merge only should throw without v5 option', function() {
      assert.throws(function() {
        addMerge(ajv);
      });
    });

    it('adding $patch only should throw without v5 option', function() {
      assert.throws(function() {
        addPatch(ajv);
      });
    });
  });

  describe('missing $ref', function() {
    beforeEach(function() {
      ajv = new Ajv({ v5: true });
      addKeywords(ajv);
    });

    it('should throw exception if cannot resolve $ref', function() {
      var schema = {
        "$merge": {
          "source": { "$ref": "obj.json#" },
          "with": {
            "properties": { "q": { "type": "number" } }
          }
        }
      };

      assert.throws(function() {
        ajv.compile(schema);
      });
    });
  });
});
