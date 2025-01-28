const fs = require('fs');
const path = require('path');
const soap = require('soap');
const http = require('http');
const serviceDefinition = require('./soap');

const wsdlFile = path.join(__dirname, 'trains.wsdl');
const wsdlXml = fs.readFileSync(wsdlFile, 'utf8');

const server = http.createServer((req, res) => {
  res.end('Train Booking SOAP Service');
});

server.listen(8000, () => {
  console.log('SOAP service running at http://localhost:8000/book?wsdl');
});

soap.listen(server, '/book', serviceDefinition, wsdlXml);
