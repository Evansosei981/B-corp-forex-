import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/v1',
});

console.log(api.getUri({ url: '/uploads' }));
console.log(api.getUri({ url: 'uploads' }));
