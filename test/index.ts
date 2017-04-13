import { expect } from 'chai';
import * as sinon from 'sinon';
import * as suite from '../src';

describe('suite', () => {
  const DESCRIPTION = 'My Suite';
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  it('should return a suite function', () => {
    const testSuite = suite((tests) => tests({}));

    expect(testSuite).to.be.a('function');
  });

  it('should call suite.build()', () => {
    const build = sandbox.stub(suite, 'build');

    suite(() => null);

    expect(build.calledWith(sinon.match.func)).to.be.true;
  });

  it('should return a suite function', () => {
    const built = sinon.spy();
    const tests = () => null;
    sandbox.stub(suite, 'build').returns(built);

    const builtSuite = suite(() => null);

    expect(builtSuite).to.be.a('function');

    builtSuite(DESCRIPTION, tests);

    expect(built.calledWith(DESCRIPTION, tests)).to.be.true;
  });

  it('should call provided suite setup', () => {
    const suiteSetup = sinon.spy();
    const tests = () => null;
    const run = sandbox.stub(suite, 'run');
    sandbox.stub(suite, 'build').callsFake((rawSuite) => rawSuite());

    suite(suiteSetup)(DESCRIPTION, tests);

    expect(run.calledWith(undefined, describe, DESCRIPTION, sinon.match((func) => {
      func();
      return expect(suiteSetup.calledWith(tests)).to.be.true;
    }))).to.be.true;
  });

  it('should pass through options', () => {
    const suiteSetup = sinon.spy();
    const tests = () => null;
    const opts = { a: 'b' };
    const run = sandbox.stub(suite, 'run');
    sandbox.stub(suite, 'build').callsFake((rawSuite) => rawSuite());

    suite(suiteSetup)(DESCRIPTION, opts, tests);

    expect(run.calledWith(undefined, describe, DESCRIPTION, sinon.match((func) => {
      func();
      return expect(suiteSetup.calledWith(tests, opts)).to.be.true;
    }))).to.be.true;
  });

  it('should allow overriding describe', () => {
    const suiteSetup = sinon.spy();
    const tests = () => null;
    const fakeDescribe: any = () => null;
    const run = sandbox.stub(suite, 'run');
    sandbox.stub(suite, 'build').callsFake((rawSuite) => rawSuite());

    suite(() => null, fakeDescribe)(DESCRIPTION, tests);

    expect(run.calledWith(undefined, fakeDescribe, DESCRIPTION)).to.be.true;
  });

  describe('build()', () => {
    it('should add only and skip properties', () => {
      const stub = sinon.stub().returns(() => null);
      const built = suite.build(stub);

      expect(built).to.have.property('only');
      expect(built).to.have.property('skip');
      expect(stub.calledThrice).to.be.true;
      expect(stub.calledWith(suite.Modifier.ONLY)).to.be.true;
      expect(stub.calledWith(suite.Modifier.ONLY)).to.be.true;
      expect(stub.calledWith(suite.Modifier.SKIP)).to.be.true;
    });
  });

  describe('run()', () => {
    const TESTS = () => null;

    it('should select the basic describe', () => {
      const describeSpy: any = sinon.spy();

      suite.run(undefined, describeSpy, DESCRIPTION, TESTS);

      expect(describeSpy.calledWith(DESCRIPTION, TESTS)).to.be.true;
    });

    it('should select describe.only', () => {
      const only: any = sinon.spy();

      suite.run(suite.Modifier.ONLY, <any>{ only }, DESCRIPTION, TESTS);

      expect(only.calledWith(DESCRIPTION, TESTS)).to.be.true;
    });

    it('should select describe.skip', () => {
      const skip: any = sinon.spy();

      suite.run(suite.Modifier.SKIP, <any>{ skip }, DESCRIPTION, TESTS);

      expect(skip.calledWith(DESCRIPTION, TESTS)).to.be.true;
    });
  });
});
