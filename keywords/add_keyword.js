'use strict';

var url = require('url');

module.exports = function (ajv, keyword, jsonPatch, patchSchema) {
  if (!ajv._opts.v5)
    throw new Error('keyword ' + keyword + ' requires v5 option');
  ajv.addKeyword(keyword, {
    macro: function (schema, parentSchema, it) {
      var source = schema.source;
      var patch = schema.with;
      if (source.$ref) source = JSON.parse(JSON.stringify(getSchema(source.$ref)));
      if (patch.$ref) patch = getSchema(patch.$ref);
      jsonPatch.apply(source, patch, true);
      return source;

      function getSchema($ref) {
        var id = it.baseId && it.baseId != '#'
                  ? url.resolve(it.baseId, $ref)
                  : $ref;
        var validate = ajv.getSchema(id);
        if (validate) return validate.schema;
        var err = new Error('can\'t resolve reference ' + $ref + ' from id ' + it.baseId);
        err.missingRef = it.resolve.url(it.baseId, $ref);
        err.missingSchema = it.resolve.normalizeId(it.resolve.fullPath(err.missingRef));
        throw err;
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
