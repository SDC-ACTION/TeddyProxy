import http from 'k6/http';
import { Rate } from 'k6/metrics';

const myFailRate = new Rate('failed requests');

export let options = {
  stages: [
    { duration: '1m', target: 500, rps: 500},
    { duration: '5m', target: 500, rps: 500}
  ],
  thresholds: {
    'failed requests': ['rate<0.1']
  }
};

export default function () {
  const productId = Math.floor(Math.random() * 10000000);
  const res = http.get(`http://54.176.68.191:3000/api/products/${productId}`);
  // const res = http.get(`http://54.176.131.89:3004/api/products/${productId}`);
  myFailRate.add(res.status !== 200);
}