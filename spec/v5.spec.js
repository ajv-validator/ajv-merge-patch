'use strict';

var Ajv = require('ajv');
var addKeywords = require('..');
var addMerge = require('../keywords/merge');
var addPatch = require('../keywords/patch');
var assert = require('assert');

describe('v5 option is required', function() {
  var ajv;

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
