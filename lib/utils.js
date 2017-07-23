const {
  isFunction,
  reduce,
} = require('lodash/fp');

const series = reduce((f, g) => f.then(value => (isFunction(g) ? g(value) : g)))(Promise.resolve());

module.exports = {
  series,
};
