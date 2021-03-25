import minimist from 'minimist';
import express from 'express';

import * as http from 'http';
import * as path from 'path';
import * as os from 'os';

const argv = minimist(process.argv.slice(2));
const app = express();

const internalServerPort = argv.port || process.env.PORT || 5000;

const serverBaseURL = `http://127.0.0.1:${internalServerPort}/`;
const mainHTMLURL = `${serverBaseURL}pkg_internal/index.html`;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.use('/', express.static(path.join(os.homedir(), '.demoapp')));
app.use('/pkg_internal', express.static(path.join(__dirname, '../webview')));

const server = http
  .createServer(app)
  .on('error', error => {
    console.log(`can not start server; because: ${error.message}`);
    exports.error = error;
  })
  .on('listening', () => {
    console.log(`server is running from: ${process.cwd()}`);
    console.log(`server running on: ${serverBaseURL}`);
    console.log(`main hosted on: ${mainHTMLURL}\n`);
    exports.baseUrl = serverBaseURL;
    exports.mainUrl = mainHTMLURL;
  })
  .listen(internalServerPort, '127.0.0.1');

export function closeServer() {
  if (server) {
    server.close();
  }
}
