import addMerge from './keywords/merge';
import addPatch from './keywords/patch';

/**
 * Defines keywords $merge and $patch in Ajv instance
 * @param  {Ajv} ajv validator instance
 */
export default function addKeywords(ajv) {
  addMerge(ajv);
  addPatch(ajv);
}
