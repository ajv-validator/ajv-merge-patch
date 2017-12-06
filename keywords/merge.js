import { apply } from 'json-merge-patch';
import addKeyword from './add_keyword';

export default function (ajv) {
  addKeyword(ajv, '$merge', apply, {'type': 'object'});
}
