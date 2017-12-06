import { resolve } from 'url';

export default function (ajv, keyword, jsonOperation, patchSchema) {
  ajv.addKeyword(keyword, {
    macro:      function (schema, parentSchema, it) {
      let source = schema.source;
      let patch = schema.with;
      if (source.$ref) source = JSON.parse(JSON.stringify(getSchema(source.$ref)));
      if (patch.$ref) patch = getSchema(patch.$ref);
      jsonOperation(source, patch, true);
      return source;

      function getSchema ($ref) {
        const id = it.baseId && it.baseId !== '#'
          ? resolve(it.baseId, $ref)
          : $ref;
        const validate = ajv.getSchema(id);
        if (validate) return validate.schema;
        throw new ajv.constructor.MissingRefError(it.baseId, $ref);
      }
    },
    metaSchema: {
      'type':                 'object',
      'required':             ['source', 'with'],
      'additionalProperties': false,
      'properties':           {
        'source': {
          'anyOf': [
            {
              'type':                 'object',
              'required':             ['$ref'],
              'additionalProperties': false,
              'properties':           {
                '$ref': {
                  'type':   'string',
                  'format': 'uri'
                }
              }
            },
            {'$ref': 'http://json-schema.org/draft-06/schema#'}
          ]
        },
        'with':   patchSchema
      }
    }
  });
}
