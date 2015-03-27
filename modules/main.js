import bar from './bar';
import foo from './foo';
import reexport from './inner/relative-import-inner';
import lipsum from './large-file';

lipsum();

export {
  bar,
  foo,
  reexport,
  lipsum
}
