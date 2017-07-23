
function passSignalThrough(child, signal) {
  const kill = () => child.kill(signal);
  process.on(signal, kill);
  child.on('close', () => process.removeListener(signal, kill));
}

module.exports = {
  passSignalThrough,
};
