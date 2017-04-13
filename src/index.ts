import * as mocha from 'mocha';

declare var describe: mocha.IContextDefinition;

// tslint:disable-next-line max-line-length variable-name
function Suite<T>(suite: (tests: (utils: T) => void, opts?: any) => void, _describe: mocha.IContextDefinition = describe) {
  return Suite.build((modifier) => (description, opts, tests?) => {
    [opts, tests] = tests ? [opts, tests] : [, opts];
    Suite.run(modifier, _describe, description, () => suite(tests, opts));
  });
};

namespace Suite {
  // tslint:disable-next-line max-line-length
  export type Builder = (modifier?: Suite.Modifier) => <T>(description: string, optsOrTests: any | Suite.Tests, tests?: Suite.Tests) => void;
  export type Tests = <T>(utils: T) => void;
  export type Modifier = 'only' | 'skip';
  export namespace Modifier {
    export const ONLY: Modifier = 'only';
    export const SKIP: Modifier = 'skip';
  }

  export const build = (builder: Suite.Builder) =>
    Object.assign(builder(), { only: builder(Modifier.ONLY), skip: builder(Modifier.SKIP) });

  // tslint:disable-next-line max-line-length variable-name
  export const run = (modifier: Suite.Modifier, _describe: mocha.IContextDefinition, description: string, suite: () => void) =>
    (modifier ? _describe[modifier] : _describe)(description, suite);
}

export default Suite;
