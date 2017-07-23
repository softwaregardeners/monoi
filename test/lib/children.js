/* eslint no-underscore-dangle: 0 import/no-dynamic-require: 0 */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const rewire = require('rewire');
const sinon = require('sinon');

const { EventEmitter } = require('events');

const path = '../../lib/children';
const {
  promisifyChildProcess,
} = require(path);

chai.use(chaiAsPromised);
chai.should();

describe('execCommand', function () {
  before(function () {
    const module = rewire(path);
    this.stubbedSpawn = sinon.stub();
    this.stubbedPassSignalThrough = sinon.stub();
    this.revert = module.__set__({
      spawn: this.stubbedSpawn,
      passSignalThrough: this.stubbedPassSignalThrough,
    });
    this.uut = module.execCommand;
  });

  after(function () {
    this.revert();
  });

  afterEach(function () {
    this.stubbedSpawn.reset();
    this.stubbedPassSignalThrough.reset();
  });

  it('should call spawn and return its value', function () {
    const s = 'spoof';
    this.stubbedSpawn.returns(s);
    this.uut('plop').should.equal(s);
  });

  it('should call passSignalThrough with spawn result and any signal specified', function () {
    const s = 'spoof';
    const signals = ['SIG1', 'SIG2', 'SIG3'];
    this.stubbedSpawn.returns(s);
    this.uut('plop', { signals }).should.equal(s);
    this.stubbedPassSignalThrough.calledWith(s, 'SIG1').should.be.true;
    this.stubbedPassSignalThrough.calledWith(s, 'SIG3').should.be.true;
    this.stubbedPassSignalThrough.calledWith(s, 'SIG2').should.be.true;
  });
});

describe('promisifyChildProcess', function () {
  beforeEach(function () {
    this.child = new EventEmitter();
  });

  afterEach(function () {
    this.child.removeAllListeners();
  });

  it('should resolve when child emits the close event', function () {
    const promise = promisifyChildProcess(this.child);
    this.child.emit('close');
    return promise.should.be.fulfilled;
  });

  it('should reject when child emits the error event', function () {
    const promise = promisifyChildProcess(this.child);
    this.child.emit('error');
    return promise.should.be.rejected;
  });
});
