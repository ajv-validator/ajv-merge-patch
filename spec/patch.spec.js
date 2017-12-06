import Ajv from 'ajv';
import addKeywords from '../index';
import addPatch from '../keywords/patch';
import test from './test_validate';

describe('keyword $patch', function() {
  let ajvInstances;

  beforeEach(function() {
    ajvInstances = [ new Ajv, new Ajv ];
    addKeywords(ajvInstances[0]);
    addPatch(ajvInstances[1]);
  });

  it('should extend schema defined in $patch', function() {
    ajvInstances.forEach(testPatch);

    function testPatch(ajv) {
      const schema = {
        '$patch': {
          'source': {
            'type':                 'object',
            'properties':           {'p': {'type': 'string'}},
            'additionalProperties': false
          },
          'with':   [
            {'op': 'add', 'path': '/properties/q', 'value': {'type': 'number'}}
          ]
        }
      };

      const validate = ajv.compile(schema);
      test(validate, '$patch');
    }
  });

  it('should extend schema defined in $ref', function() {
    ajvInstances.forEach(testPatch);

    function testPatch(ajv) {
      const sourceSchema = {
        'id':                   'obj.json#',
        'type':                 'object',
        'properties':           {'p': {'type': 'string'}},
        'additionalProperties': false
      };

      ajv.addSchema(sourceSchema);

      const schema = {
        '$patch': {
          'source': {'$ref': 'obj.json#'},
          'with':   [
            {'op': 'add', 'path': '/properties/q', 'value': {'type': 'number'}}
          ]
        }
      };

      const validate = ajv.compile(schema);
      test(validate, '$patch');
    }
  });

  it('should extend schema defined with relative $ref', function() {
    ajvInstances.forEach(testPatch);

    function testPatch(ajv) {
      const schema = {
        'id':          'obj.json#',
        'definitions': {
          'source': {
            'type':                 'object',
            'properties':           {'p': {'type': 'string'}},
            'additionalProperties': false
          }
        },
        '$patch':      {
          'source': {'$ref': '#/definitions/source'},
          'with':   [
            {'op': 'add', 'path': '/properties/q', 'value': {'type': 'number'}}
          ]
        }
      };

      const validate = ajv.compile(schema);
      test(validate, '$patch');
    }
  });
});
