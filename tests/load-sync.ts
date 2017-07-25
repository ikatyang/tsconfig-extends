import { load_config_sync, load_file_sync } from '../src/index';

const load_fixture = (name: string) =>
  load_file_sync(`./fixtures/${name}/tsconfig.json`);

const load_fixture_cwd = (name: string) =>
  load_file_sync(`../fixtures/${name}/tsconfig.json`, __dirname);

it('should return correclty (general)', () => {
  expect(load_fixture_cwd('general')).toMatchSnapshot();
});

it('should return correclty (empty)', () => {
  expect(load_fixture_cwd('empty')).toMatchSnapshot();
});

it('should return correctly (extends)', () => {
  expect(load_fixture_cwd('extends')).toMatchSnapshot();
});

it('should throw error (circular)', () => {
  expect(() => load_fixture_cwd('circular')).toThrowError();
});

it('should return correctly with filename and default cwd', () => {
  expect(load_fixture('general')).toMatchSnapshot();
});

it('should return correctly with tsconfig and default cwd', () => {
  expect(
    load_config_sync({
      extends: './fixtures/general/tsconfig.json',
      compilerOptions: {
        test: true,
      },
    }),
  ).toMatchSnapshot();
});
