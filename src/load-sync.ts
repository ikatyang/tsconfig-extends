import * as fs from 'fs';
import * as path from 'path';

export interface TSConfig {
  extends?: string;
  compilerOptions?: CompilerOptions;
}

export interface CompilerOptions {
  [key: string]: any;
}

export function load_file_sync(filename: string, cwd: string = process.cwd()): CompilerOptions {
  const _filename = path.resolve(cwd, filename);
  const json = _load_json_sync(_filename);
  return load_config_sync(json, path.dirname(_filename));
}

export function load_config_sync(tsconfig: TSConfig, cwd: string = process.cwd()): CompilerOptions {
  return _load_config_sync(tsconfig, cwd);
}

function _load_json_sync(filename: string): TSConfig {
  const content = fs.readFileSync(filename, 'utf8');
  return /^\s*$/.test(content)
    ? {}
    : JSON.parse(content);
}

function _load_config_sync(tsconfig: TSConfig, cwd: string, stack: string[] = []): CompilerOptions {
  const {
    compilerOptions: compiler_options = {},
  } = tsconfig;

  if (tsconfig.extends === undefined) {
    return compiler_options;
  }

  const parent_filename = path.resolve(cwd, tsconfig.extends);
  if (stack.indexOf(parent_filename) !== -1) {
    throw new Error(`Circular dependency detected: ${stack.join(' -> ')}`);
  }

  const {
    extends: parent_extends,
    compilerOptions: parent_compiler_options,
  } = _load_json_sync(parent_filename);

  return _load_config_sync(
    {
      extends: parent_extends,
      compilerOptions: {
        ...parent_compiler_options,
        ...compiler_options,
      },
    },
    path.dirname(parent_filename),
    [...stack, parent_filename],
  );
}
