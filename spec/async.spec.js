import Ajv from 'ajv';
import assert from 'assert';
import addKeywords from '../index';
import test from './test_validate';

describe('async schema loading', function () {
  var ajv, loadCount;

  beforeEach(function () {
    ajv = new Ajv({loadSchema: loadSchema});
    addKeywords(ajv);
    loadCount = 0;
  });

  describe('$merge', function () {
    it('should load missing schemas', function () {
      const schema = {
        '$merge': {
          'source': {'$ref': 'obj.json#'},
          'with':   {
            'properties': {'q': {'type': 'number'}}
          }
        }
      };

      return testAsync(schema, '$merge');
    });
  });

  describe('$patch', function () {
    it('should load missing schemas', function () {
      const schema = {
        '$patch': {
          'source': {'$ref': 'obj.json#'},
          'with':   [
            {'op': 'add', 'path': '/properties/q', 'value': {'type': 'number'}}
          ]
        }
      };

      return testAsync(schema, '$patch');
    });
  });

  function testAsync (schema, keyword) {
    return ajv
      .compileAsync(schema)
      .then(function (validate) {
        assert.strictEqual(loadCount, 1);
        test(validate, keyword);
      });
  }

  function loadSchema (ref) {
    if (ref === 'obj.json') {
      loadCount++;
      const schema = {
        'id':                   'obj.json#',
        'type':                 'object',
        'properties':           {'p': {'type': 'string'}},
        'additionalProperties': false
      };
      return Promise.resolve(schema);
    }
    return Promise.reject(new Error('404: ' + ref));
  }
});
