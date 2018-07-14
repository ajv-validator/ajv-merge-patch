'use strict';

var addKeyword = require('./add_keyword');
var jsonMergePatch = require('json-merge-patch');

function merge(source, other, _, index) {
  if (!index)
    index = 0;

  if (!Array.isArray(other))
    return jsonMergePatch.apply(source, other);

  if (other.length - index == 1)
    return jsonMergePatch.apply(source, other[index]);

  return merge(jsonMergePatch.apply(source, other[index]), other, null, index + 1);
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
