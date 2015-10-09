const fs = require('co-fs');
const path = require('path');
const koa = require('koa');
const app = koa();

const serve = require('koa-static');
const mount = require('koa-mount');

app
  .use(mount('/assets', serve(path.join(__dirname, '../assets/'))))
  .use(function *() {
    var html = yield fs.readFile(path.join(__dirname, './index.html'), 'utf-8');
    this.body = html;
  })
  .listen(8000);
