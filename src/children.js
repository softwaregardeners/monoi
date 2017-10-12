/* eslint no-use-before-define: 0 */

function spawn(...args) {
  // this is to allow stubbing spawn in tests
  /* eslint-disable global-require */
  return require('child_process').spawn(...args);
  /* eslint-enable global-require */
}

function execCommand(command, { signals = [], options = {} } = {}) {
  const [bin, ...args] = command.split(' ');
  const child = spawn(bin, args, { stdio: 'inherit', ...options });
  signals.forEach(signal => passSignalThrough(child, signal));

  return child;
}

function passSignalThrough(child, signal) {
  const kill = () => child.kill(signal);
  process.on(signal, kill);
  child.on('close', () => process.removeListener(signal, kill));
}

function promisifyChildProcess(child) {
  return new Promise((resolve, reject) => {
    child.on('close', resolve);
    child.on('error', reject);
  });
}

module.exports = {
  execCommand,
  passSignalThrough,
  promisifyChildProcess,
};
