'use strict';

var generateMetaSchema = require('./generateMetaSchema');
var getSchema = require('./getSchema');
var jsonPatch = require('json-merge-patch');

module.exports = function merge(ajv) {
  ajv.addKeyword('$merge', {
    macro: function (schema, parentSchema, it) {
      var source = schema.source;
      var patches = schema.with instanceof Array ? schema.with : [schema.with];
      if (source.$ref) source = JSON.parse(JSON.stringify(getSchema(ajv, it, source.$ref)));
      patches.forEach(function(patch) {
        if (patch.$ref) patch = getSchema(ajv, it, patch.$ref);
        jsonPatch.apply(source, patch, true);
      });
      return source;
    },
    metaSchema: generateMetaSchema({
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
    })
  });
};
