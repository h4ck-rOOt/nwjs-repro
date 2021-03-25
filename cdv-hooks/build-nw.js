const spawn = require('cross-spawn');

module.exports = context => {
  if (!context.opts.platforms.includes('browser') || context.cmdLine.match(/--no-nw/g)) {
    return;
  }

  console.log('[CDV Hook] Building NW target');

  const options = context.cmdLine.match(/--\w+=\w+/g);
  const params = ['gulp', 'build:nw'].concat(options || []);

  return new Promise((resolve, reject) => {
    const gulp = spawn('npx', params, { stdio: [0, 1, 2], shell: true });

    gulp.on('exit', code => {
      if (code > 0) {
        reject(new Error(`[CDV Hook] Building NW target failed; code ${code}`));
      } else {
        resolve();
      }
    });
  });
};
