'use strict';

var assert = require('assert');

module.exports = function (validate, keyword) {
  assert.strictEqual(validate({ p: 'abc', q: 1 }), true);

  // In ajv <= v7 the property is dataPath, while on ajv >= v8 is instancePath.
  var assertDataOrInstancePath = function (err, expectedValue) {
    assert.equal(
      'dataPath' in err
        ? err.dataPath
        : err.instancePath,
      expectedValue
    );
  };

  // property q should be a number
  assert.strictEqual(validate({ p: 'foo', q: 'bar' }), false);
  var errs = validate.errors;
  assert.equal(errs.length, 2);
  assert.equal(errs[0].keyword, 'type');
  assert.equal(errs[0].schemaPath, '#/' + keyword + '/properties/q/type');
  assertDataOrInstancePath(errs[0], '/q');
  assert.equal(errs[1].keyword, keyword);
  assertDataOrInstancePath(errs[1], '');
  assert.equal(errs[1].schemaPath, '#/' + keyword);

  // an object without q should fail
  assert.strictEqual(validate({ p: 'foo' }), false);
  errs = validate.errors;
  assert.equal(errs.length, 2);
  assert.equal(errs[0].keyword, 'required');
  assert.equal(errs[0].schemaPath, '#/' + keyword + '/required');
  assert.deepEqual(errs[0].params, { missingProperty: 'q' });
  assertDataOrInstancePath(errs[0], '');
  assert.equal(errs[1].keyword, keyword);
  assert.equal(errs[1].schemaPath, '#/' + keyword);
  assertDataOrInstancePath(errs[1], '');
};
