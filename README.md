Monoi
=====

Monoi is a process launcher / restarted that does not take itself too seriously.
It comes with sane default and is designed to play well with docker.

Usage
-----

Build then run once

```js
const run = require('@softwaregardeners/monoi');
run(['yarn build', 'node dist/index.js']);
```

Build then run and watch for changes in the `src` directory

```js
const run = require('@softwaregardeners/monoi');
run(['yarn build', 'node dist/index.js'], { watch: 'src/' });
```


FAQ
---

### Should I use it? Is it battle-tested?
Probably not. Nope. But we do use it on a couple of side-projects.

### What's the point? I mean there's already pm2 and nodemon?
You could probably do exactly the same with pm2/nodemon/XYZ. In fact you should probably. That being said, monoi is design as an api, not a script (to be fair nodemon is as well), and allows you to configure which signals to pass through to your commands and which signal to use in order to restart.
