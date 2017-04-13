# mocha-suite
Define suite-level utilities and test structure for mocha tests

Save yourself the hassle of manually constucting suite definitions.
Bundle common logic (such as setting up sandboxes) and minimize the
number of `require()` statements in your test files.


## Example

```js
  // _suite.js

  const suite = require('mocha-suite');
  const sinon = require('sinon');
  const chai = require('chai');

  module.exports = suite((tests, options) => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => sandbox.restore());

    tests({
      spy: sandbox.spy,
      stub: sandbox.stub,
      expect: chai.expect
    });
  });
```

```js
  // app.spec.js

  const suite = require('./_suite');
  const MyApp = require('../src/app');

  suite('MyApp', ({ expect, spy }) => {

    describe('someFunc()', () => {
      it('should call spy', () => {
        const bootstrap = spy();

        const app = new MyApp(bootstrap);

        expect(bootstrap.called).to.be.true;
      });
    });
  });
```

## Usage

**suite(**`suiteDefinition`, `[describe]`**)**

Returns a `renderedSuite` function.

*   `suiteDefinition`: A function which accepts a test function which must be
    called in the suite definition in order to run your tests.
*   `describe`: An override for `describe()`. *Optional*

**renderedSuite(**`description`, `[options]`, `tests`**)**

*   `description`: Text to distinguish this suite from others, will be passed
    as the first parameter to `describe()`.
*   `options`: Any type of object or value representing options which will be
    passed as the second parameter to the provided suite definition. *Optional*
*   `tests`: A function that runs all of your suite's `describe()`s and `it()`s
    when called.

The returned `renderedSuite` has the properties `only` and `skip` which allows it
to operate like `mocha`'s `describe()`:

```js
  // isolated.spec.js

  const suite = require('./_suite');

  suite.only('Isolated', ({ expect, spy }) => {
    /* tests will be run exclusively */
  });
```

```js
  // skipped.spec.js

  const suite = require('./_suite');

  suite.skip('Skipped', ({ expect, spy }) => {
    /* tests will be skipped */
  });
```
