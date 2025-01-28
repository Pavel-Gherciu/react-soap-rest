const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
const PORT = 8002; // Proxy port (different from React and SOAP service)

// Middleware to parse JSON and XML
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/xml' })); // Support raw XML payloads
app.use(cors()); // Use the cors middleware

// Proxy SOAP endpoint
app.post('/api/soap', async (req, res) => {
  const soapEndpoint = 'http://localhost:8000/book'; // SOAP service URL
  const xmlBody = req.body; // Raw XML sent from the frontend

  try {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;

    // Forward the request to the SOAP service
    const soapResponse = await fetch(soapEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml' },
      body: xmlBody,
    });

    const responseText = await soapResponse.text();
    res.send(responseText);
  } catch (err) {
    console.error('Error forwarding SOAP request:', err);
    res.status(500).send('Error forwarding SOAP request');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});