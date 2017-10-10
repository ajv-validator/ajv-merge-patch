'use strict';

module.exports = function generateMetaSchema(patchSchema) {
  return {
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
          { "$ref": "http://json-schema.org/draft-06/schema#" }
        ]
      },
      "with": patchSchema
    }
  };
};