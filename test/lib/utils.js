const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const {
  series,
} = require('../../src/utils');

chai.use(chaiAsPromised);
chai.should();

describe('series', function () {
  before(function () {
    this.resolveOne = Promise.resolve(1);
    this.resolvePlusTwo = value => Promise.resolve(value + 2);
  });

  it('should resolve all promises if none reject', function () {
    const promises = [this.resolveOne, this.resolvePlusTwo];
    return series(promises).should.eventually.equal(3);
  });

  it('should reject if any of the promises reject (first)', function () {
    const promises = [Promise.reject('fuck'), this.resolvePlusTwo];
    return series(promises).should.be.rejectedWith('fuck');
  });

  it('should reject if any of the promises reject (second)', function () {
    const promises = [this.resolveOne, Promise.reject('fuck that')];
    return series(promises).should.be.rejectedWith('fuck that');
  });

  it('should resolve if no promise is specified', function () {
    return series([]).should.be.fulfilled;
  });
});
