const {
  castArray,
  defaults,
  debounce,
  zip,
} = require('lodash/fp');
const nodeWatch = require('node-watch');

const { series } = require('./utils');
const {
  execCommand,
  promisifyChildProcess,
} = require('./children');

const defaultOptions = {
  restartSignal: 'SIGUSR2',
  signals: ['SIGINT', 'SIGTERM'],
  watch: [],
};

function runCommand(command, signals, options) {
  return promisifyChildProcess(execCommand(command, { signals, options }));
}

function start(commands, signals, spawnOptions) {
  const promises = zip(commands, spawnOptions)
    .map(([command, options]) => () => runCommand(command, signals, options));
  return series(promises);
}

function watchAndReload(fn, files, restartSignal) {
  return nodeWatch(files, { recursive: true }, () => {
    process.kill(process.pid, restartSignal);
    fn();
  });
}

function main(commands, options = {}) {
  const {
    signals,
    watch,
    restartSignal,
    spawnOptions,
  } = defaults(defaultOptions)(options);

  const fn = () => start(commands, [restartSignal].concat(signals), spawnOptions);
  if (watch.length) {
    const watcher = watchAndReload(debounce(1000)(fn), castArray(watch), restartSignal);
    process.on('SIGINT', watcher.close);
    process.on('SIGTERM', watcher.close);
  }
  fn();
}

module.exports = main;
