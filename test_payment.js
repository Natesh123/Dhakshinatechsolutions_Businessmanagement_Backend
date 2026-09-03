const http = require('http');

const data = JSON.stringify({
  invoiceId: 1,
  paymentDate: "2026-05-15",
  amount: 40000,
  paymentMode: "Bank Transfer"
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/payments/1',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
