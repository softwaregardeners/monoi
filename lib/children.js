
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
  passSignalThrough,
  promisifyChildProcess,
};
