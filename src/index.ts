// tslint:disable max-line-length
import * as mocha from 'mocha';

declare const describe: mocha.IContextDefinition;

// tslint:disable-next-line variable-name
function Suite<T, U>(suite: (tests: Suite.Tests<T>, opts?: U) => void, _describe: mocha.IContextDefinition = describe) {
  return Suite.build<T, U>((modifier: Suite.Modifier) => (description: string, opts: U | Suite.Tests<T>, tests?: Suite.Tests<T>) => {
    // tslint:disable-next-line no-sparse-arrays
    Suite.run(modifier, _describe, description, () => suite(<Suite.Tests<T>>(tests || opts), <U>(tests && opts)));
  });
}

namespace Suite {
  export type Builder = <T, U>(modifier?: Suite.Modifier) => ContextDescription<T, U>;
  export type BuildDescription = <T, U>(builder: Suite.Builder) => ModifiedDescription<T, U>;
  export type Tests<T> = (utils: T) => void;
  export type Modifier = 'only' | 'skip';
  export interface ContextDescription<T, U> {
    (description: string, tests: Suite.Tests<T>): void;
    (description: string, opts: U, tests: Suite.Tests<T>): void;
  }
  export interface ModifiedDescription<T, U> extends ContextDescription<T, U> {
    only: ContextDescription<T, U>;
    skip: ContextDescription<T, U>;
  }
  export namespace Modifier {
    export const ONLY: Modifier = 'only';
    export const SKIP: Modifier = 'skip';
  }

  export const build: BuildDescription = (builder) =>
    Object.assign(builder(), { only: builder(Modifier.ONLY), skip: builder(Modifier.SKIP) });

  // tslint:disable-next-line variable-name
  export const run = (modifier: Suite.Modifier, _describe: mocha.IContextDefinition, description: string, suite: () => void) =>
    (modifier ? _describe[modifier] : _describe)(description, suite);
}

export = Suite;
