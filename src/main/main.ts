/* tslint:disable: no-var-keyword */
(function (global) {
  var win: NWJS_Helpers.win;

  // check if we are running on node environment
  if (typeof global === 'undefined' || !global.process || !global.process.versions) {
    return;
  }

  // check if we are running on node-webkit environment
  if (!(global.process.versions as any)['nw'] && !(global.process.versions as any)['node-webkit']) {
    return;
  }

  // get main window
  win = nw.Window.get();

  if (process.listenerCount('uncaughtException') <= 0) {
    // Uncaught exceptions open developer tools on nw
    process.on('uncaughtException', function () {
      // don't change this handler, no console log or something
      // otherwise node-webkit crashes
      win.showDevTools();
    });
  }

  process.on('beforeExit', () => {
    nw.App.closeAllWindows();
    process.mainModule.exports.closeServer();
  });

  document.addEventListener('deviceready', () => {
    setTimeout(() => {
      if (location.href.includes('chrome-extension:')) {
        location.href = process.mainModule.exports.mainUrl;
      } else {
        const span = document.createElement('span') as HTMLSpanElement;
        span.style.position = 'absolute';
        span.style.left = '50%';
        span.style.top = '50%';
        span.style.transform = 'translate(-50%, -50%)';
        span.style.color = 'white';
        span.style.fontSize = 'xxx-large';
        span.textContent = 'open devtools and then reload app to see the issue!';
        document.body.appendChild(span);
      }
    });
  });
})(this);
