import Ajv from 'ajv';
import addKeywords  from '../index';
import assert  from 'assert';

describe('errors', function() {
  let ajv;

  describe('missing $ref', function() {
    beforeEach(function() {
      ajv = new Ajv;
      addKeywords(ajv);
    });

    it('should throw exception if cannot resolve $ref', function() {
      const schema = {
        '$merge': {
          'source': {'$ref': 'obj.json#'},
          'with':   {
            'properties': {'q': {'type': 'number'}}
          }
        }
      };

      assert.throws(function() {
        ajv.compile(schema);
      });
    });
  });
});
