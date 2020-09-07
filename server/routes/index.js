const express = require('express');

const app = express();

app.use(require('./usuarios'));
app.use(require('./producto'));
app.use(require('./categoria'));
app.use(require('./upload'));
app.use(require('./images'));
app.use(require('./login'));

module.exports = app;