// require('newrelic');
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const redis = require('redis');
const client = redis.createClient({port: 6379});
const app = express();
const axios = require('axios');
const PORT = 3000;
const cors = require('cors');

app.use(cors());
app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/products/:productId', express.static(path.join(__dirname, '../public')));

const getProductInfo = async (req, res) => {
  const { productId } = req.params;

  try {
    const getData = await axios.get(`http://52.53.207.31:3004/api/products/${productId}`);
    const productData = await JSON.stringify(getData.data);

    client.set(productId, productData);
    res.send(productData);
  } catch(err) {
    console.log(err);
    res.status(500);
  }
};

const checkCache = (req, res, next) => {
  const { productId } = req.params;

  client.get(productId, (err, data) => {
    if(err) {
      throw err;
    } else if (data !== null) {
      res.send(data);
    } else {
      next();
    }
  });
};

app.get('/api/products/:productId', checkCache, getProductInfo);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
