import { helper } from '@ember/component/helper';
import { debug } from '@ember/debug';

export default helper(function vGet(positional /*, named*/) {
  let result, path;
  debug(positional[0], positional[1], positional[2]);

  if (positional[0] && positional[1] && positional[2]) {
    path = 'validations.attrs.' + positional[1] + '.' + positional[2];
    result = positional[0].get(path);
    debug(path, result);
  } else {
    path = 'validations.' + positional[1];
    result = positional[0].get(path);
    debug(path, result);
  }
  return result;
});
