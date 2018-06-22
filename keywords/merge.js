'use strict';

var addKeyword = require('./add_keyword');
var applyPatch = require('json-merge-patch').apply;

module.exports = function(ajv) {
  addKeyword(ajv, '$merge', applyPatch, { "type": "object" });
};
