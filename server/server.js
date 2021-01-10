require('newrelic');
const express = require('express');
const path = require('path');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
const PORT = 3000;

app.use('/', express.static(path.join(__dirname, '../public')));

app.use('/api', createProxyMiddleware({
  target: 'http://54.219.195.213:3004/'
}))

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
