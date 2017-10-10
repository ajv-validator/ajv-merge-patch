'use strict';

var generateMetaSchema = require('./generateMetaSchema');
var getSchema = require('./getSchema');
var jsonPatch = require('fast-json-patch/src/json-patch');

module.exports = function (ajv) {
  ajv.addKeyword('$patch', {
    macro: function (schema, parentSchema, it) {
      var source = schema.source;
      var patch = schema.with;
      if (source.$ref) source = JSON.parse(JSON.stringify(getSchema(ajv, it, source.$ref)));
      if (patch.$ref) patch = getSchema(ajv, it, patch.$ref);
      jsonPatch.applyPatch(source, patch, true);
      return source;
    },
    metaSchema: generateMetaSchema({
      "type": "array",
      "items": {
        "type": "object",
        "required": [ "op", "path" ],
        "properties": {
          "op": { "type": "string" },
          "path": { "type": "string", "format": "json-pointer" }
        },
        "anyOf": [
          {
            "properties": { "op": { "enum": [ "add", "replace", "test" ] } },
            "required": [ "value" ]
          },
          {
            "properties": { "op": { "enum": [ "remove" ] } }
          },
          {
            "properties": {
              "op": { "enum": [ "move", "copy" ] },
              "from": { "type": "string", "format": "json-pointer" }
            },
            "required": [ "from" ]
          }
        ]
      }
    })
  });
};
