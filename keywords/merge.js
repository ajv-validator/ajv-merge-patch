'use strict';

var addKeyword = require('./add_keyword');
var jsonMergePatch = require('json-merge-patch');

function merge(source, merges) {
  if (!Array.isArray(merges))
    return jsonMergePatch.apply(source, merges);

  var merged = source;

  merges.forEach(function (m) {
    merged = jsonMergePatch.apply(source, m);
  });

  return merged;
}

module.exports = function (ajv) {
  addKeyword(ajv, '$merge', merge, {
    "oneOf": [
      {
        "type": "object"
      },
      {
        "type": "array",
        "items": {
          "type": "object"
        }
      }
    ]
  });
};
