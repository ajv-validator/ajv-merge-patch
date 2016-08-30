'use strict';

var url = require('url');

function copy(o, to) {
  to = to || {};
  for (var key in o) to[key] = o[key];
  return to;
}

module.exports = function (ajv, keyword, jsonPatch, patchSchema) {
  if (!ajv._opts.v5)
    throw new Error('keyword ' + keyword + ' requires v5 option');
  ajv.addKeyword(keyword, {
    macro: function (schema, parentSchema, it) {
      var source = schema.source;
      var patch = schema.with;
      if (source.$ref) source = copy(getSchema(source.$ref));
      if (patch.$ref) patch = getSchema(patch.$ref);
      jsonPatch.apply(source, patch, true);
      return source;

      function getSchema($ref) {
        var id = it.baseId && it.baseId != '#'
                  ? url.resolve(it.baseId, $ref)
                  : $ref;
        var validate = ajv.getSchema(id);
        if (validate) return validate.schema;
        throw new Error('can\'t resolve reference ' + $ref + ' from id ' + it.baseId);
      }
    },
    metaSchema: {
      "type": "object",
      "required": [ "source", "with" ],
      "additionalProperties": false,
      "properties": {
        "source": {
          "anyOf": [
            {
              "type": "object",
              "required": [ "$ref" ],
              "additionalProperties": false,
              "properties": {
                "$ref": {
                  "type": "string",
                  "format": "uri"
                }
              }
            },
            { "$ref": "https://raw.githubusercontent.com/epoberezkin/ajv/master/lib/refs/json-schema-v5.json#" }
          ]
        },
        "with": patchSchema
      }
    }
  });
};
