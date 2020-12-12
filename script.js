import http from 'k6/http';
import { Rate } from 'k6/metrics';

const myFailRate = new Rate('failed requests');

export let options = {
  stages: [
    { duration: '2m', target: 100, rps: 100},
    { duration: '5m', target: 500, rps: 500},
    { duration: '5m', target: 1000, rps: 1000},
    { duration: '2m', target: 500, rps: 500}
  ],
  thresholds: {
    'failed requests': ['rate<0.1']
  }
};

export default function () {
  const productId = Math.floor(Math.random() * 10000000);
  const res = http.get(`http://localhost:3000/api/products/${productId}`);
  myFailRate.add(res.status !== 200);
}