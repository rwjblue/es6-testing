import log from './log';
import {foo, bar} from './has-named';

export default function(extra) {
  foo();
  return log('bar called! ' + extra);
}
