import assert from 'assert';

export default function (validate, keyword) {
  assert.strictEqual(validate({p: 'abc', q: 1}), true);
  assert.strictEqual(validate({p: 'foo', q: 'bar'}), false);
  const errs = validate.errors;
  assert.equal(errs.length, 2);
  assert.equal(errs[0].keyword, 'type');
  assert.equal(errs[0].dataPath, '.q');
  assert.equal(errs[0].schemaPath, '#/properties/q/type');
  assert.equal(errs[1].keyword, keyword);
  assert.equal(errs[1].dataPath, '');
  assert.equal(errs[1].schemaPath, '#/' + keyword);
}
