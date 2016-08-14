'use strict';

function copy(o, to) {
  to = to || {};
  for (var key in o) to[key] = o[key];
  return to;
}

module.exports = function (ajv, keyword, jsonPatch, patchSchema) {
  if (!ajv._opts.v5)
    throw new Error('keyword ' + keyword + ' requires v5 option');
  ajv.addKeyword(keyword, {
    macro: function (schema, parentSchema) {
      var source = schema.source;
      var patch = schema.with;
      if (source.$ref)
        source = copy(ajv.getSchema(source.$ref).schema);

      jsonPatch.apply(source, patch, true);
      return source;
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
