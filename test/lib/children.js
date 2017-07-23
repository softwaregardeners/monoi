const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { EventEmitter } = require('events');

const {
  promisifyChildProcess,
} = require('../../lib/children');

chai.use(chaiAsPromised);
chai.should();

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
