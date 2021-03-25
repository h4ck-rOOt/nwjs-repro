/* eslint-disable no-console */
'use strict';

const spawn = require('cross-spawn');

module.exports = context => {
  console.log('[CDV Hook] Building Webapp');

  return new Promise((resolve, reject) => {
    const options = context.cmdLine.match(/--\w+=\w+/g);
    const params = ['gulp'].concat('build').concat(options || []);
    const gulp = spawn('npx', params, {
      // attach child process gulp to stdin, stdout and stderr
      stdio: [0, 1, 2],

      // run child process in a shell; needed for windows
      shell: true
    });

    gulp.on('exit', code => {
      if (code > 0) {
        reject(new Error(`[CDV Hook] Building Webapp failed; code ${code}`));
      } else {
        resolve();
      }
    });
  });
};
