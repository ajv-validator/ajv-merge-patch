import Ajv from 'ajv';
import addKeywords from '../index';
import addMerge from '../keywords/merge';
import test from './test_validate';

describe('keyword $merge', function () {
  let ajvInstances;

  beforeEach(function () {
    ajvInstances = [new Ajv, new Ajv];
    addKeywords(ajvInstances[0]);
    addMerge(ajvInstances[1]);
  });

  it('should extend schema defined in $merge', function () {
    ajvInstances.forEach(testMerge);

    function testMerge (ajv) {
      const schema = {
        '$merge': {
          'source': {
            'type':                 'object',
            'properties':           {'p': {'type': 'string'}},
            'additionalProperties': false
          },
          'with':   {
            'properties': {'q': {'type': 'number'}}
          }
        }
      };

      const validate = ajv.compile(schema);
      test(validate, '$merge');
    }
  });

  it('should extend schema defined in $ref', function () {
    ajvInstances.forEach(testMerge);

    function testMerge (ajv) {
      const sourceSchema = {
        'id':                   'obj.json#',
        'type':                 'object',
        'properties':           {'p': {'type': 'string'}},
        'additionalProperties': false
      };

      ajv.addSchema(sourceSchema);

      const schema = {
        '$merge': {
          'source': {'$ref': 'obj.json#'},
          'with':   {
            'properties': {'q': {'type': 'number'}}
          }
        }
      };

      const validate = ajv.compile(schema);
      test(validate, '$merge');
    }
  });

  it('should extend schema defined with relative $ref', function () {
    ajvInstances.forEach(testMerge);

    function testMerge (ajv) {
      const schema = {
        'id':          'obj.json#',
        'definitions': {
          'source': {
            'type':                 'object',
            'properties':           {'p': {'type': 'string'}},
            'additionalProperties': false
          }
        },
        '$merge':      {
          'source': {'$ref': '#/definitions/source'},
          'with':   {
            'properties': {'q': {'type': 'number'}}
          }
        }
      };

      const validate = ajv.compile(schema);
      test(validate, '$merge');
    }
  });

  it('should extend schema with patch in $ref', function () {
    ajvInstances.forEach(testMerge);

    function testMerge (ajv) {
      const sourceSchema = {
        'type':                 'object',
        'properties':           {'p': {'type': 'string'}},
        'additionalProperties': false
      };

      const patchSchema = {
        'type':                 'object',
        'properties':           {'q': {'type': 'number'}},
        'additionalProperties': false
      };

      ajv.addSchema(sourceSchema, 'obj1.json#');
      ajv.addSchema(patchSchema, 'obj2.json#');

      const schema = {
        '$merge': {
          'source': {'$ref': 'obj1.json#'},
          'with':   {'$ref': 'obj2.json#'}
        }
      };

      const validate = ajv.compile(schema);
      test(validate, '$merge');
    }
  });

  it('should extend schema with patch defined with relative $ref', function () {
    ajvInstances.forEach(testMerge);

    function testMerge (ajv) {
      const sourceSchema = {
        'type':                 'object',
        'properties':           {'p': {'type': 'string'}},
        'additionalProperties': false
      };

      ajv.addSchema(sourceSchema, 'obj1.json#');

      const schema = {
        'id':          'obj2.json#',
        'definitions': {
          'patch': {
            'type':                 'object',
            'properties':           {'q': {'type': 'number'}},
            'additionalProperties': false
          }
        },
        '$merge':      {
          'source': {'$ref': 'obj1.json#'},
          'with':   {'$ref': '#/definitions/patch'}
        }
      };

      const validate = ajv.compile(schema);
      test(validate, '$merge');
    }
  });
});
