import { applyPatch } from 'fast-json-patch';
import addKeyword from './add_keyword';

export default function (ajv) {
  addKeyword(ajv, '$patch', applyPatch, {
    'type':  'array',
    'items': {
      'type':       'object',
      'required':   ['op', 'path'],
      'properties': {
        'op':   {'type': 'string'},
        'path': {'type': 'string', 'format': 'json-pointer'}
      },
      'anyOf':      [
        {
          'properties': {'op': {'enum': ['add', 'replace', 'test']}},
          'required':   ['value']
        },
        {
          'properties': {'op': {'enum': ['remove']}}
        },
        {
          'properties': {
            'op':   {'enum': ['move', 'copy']},
            'from': {'type': 'string', 'format': 'json-pointer'}
          },
          'required':   ['from']
        }
      ]
    }
  });
}
