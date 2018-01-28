'use strict';

var url = require('url');
module.exports = function getSchema(ajv, it, $ref) {
  var id = it.baseId && it.baseId != '#'
            ? url.resolve(it.baseId, $ref)
            : $ref;
  var validate = ajv.getSchema(id);
  if (validate) return validate.schema;
  throw new ajv.constructor.MissingRefError(it.baseId, $ref);
};