import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('alice');
  const [password, setPassword] = useState('password123');
  const [token, setToken] = useState('');
  const [loginResponse, setLoginResponse] = useState('');


  // For searching
  const [departureStation, setDepartureStation] = useState('Évry-Courcouronnes');
  const [arrivalStation, setArrivalStation] = useState('Châtelet–Les Halles');
  const [travelDateTime, setTravelDateTime] = useState('2025-03-01T08:00:00');
  const [tickets, setTickets] = useState(2);
  const [travelClass, setTravelClass] = useState('Standard');
  const [searchResult, setSearchResult] = useState([]);
  const [searchResponse, setSearchResponse] = useState('');


  // For booking
  const [bookTrainIDs, setBookTrainIDs] = useState('1'); // comma-separated
  const [bookTickets, setBookTickets] = useState(1);
  const [bookClass, setBookClass] = useState('Standard');
  const [bookingResponse, setBookingResponse] = useState('');

  // SOAP endpoint
  const soapEndpoint = 'http://localhost:8002/api/soap';

  // Helper for making SOAP requests
  const callSoap = async (xmlString) => {
    try {
      const response = await fetch(soapEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml',
        },
        body: xmlString,
      });
      const text = await response.text();
      return text;
    } catch (err) {
      console.error('SOAP call error:', err);
      return null;
    }
  };

  const formatDateTime = (isoString) => {
    const options = { dateStyle: 'medium', timeStyle: 'short' };
    return new Date(isoString).toLocaleString(undefined, options);
  };

  const toISODateTime = (dateString) => {
    return new Date(dateString).toISOString();
  };
  

  // 1. Login Handler
  const handleLogin = async () => {
    const xml = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://example.com/trainBookingService">
        <soap:Body>
          <tns:login>
            <username>${username}</username>
            <password>${password}</password>
          </tns:login>
        </soap:Body>
      </soap:Envelope>
    `;
  
    const resp = await callSoap(xml);
    if (!resp) {
      setLoginResponse('Error: Login error (no response).');
      return;
    }
  
    console.log('Login response:', resp);
  
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(resp, 'text/xml');
  
      // Extract the token
      const tokenNode = xmlDoc.getElementsByTagNameNS('http://example.com/trainBookingService', 'token')[0];
      if (tokenNode) {
        const tokenValue = tokenNode.textContent;
        setToken(tokenValue);
        setLoginResponse('Login successful. Token set!');
      } else {
        setLoginResponse('Error: Login failed or token not found.');
      }
    } catch (error) {
      console.error('Error parsing login response:', error);
      setLoginResponse('Error: An error occurred while processing the login response.');
    }
  };
  

  // 2. Search Trains Handler
  const handleSearchTrains = async () => {
    if (!token) {
      setSearchResponse('Error: You must log in first!');
      return;
    }
  
    const xml = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://example.com/trainBookingService">
        <soap:Body>
          <tns:searchTrains>
            <departureStation>${departureStation}</departureStation>
            <arrivalStation>${arrivalStation}</arrivalStation>
            <travelDateTime>${travelDateTime}</travelDateTime>
            <tickets>${tickets}</tickets>
            <travelClass>${travelClass}</travelClass>
            <token>${token}</token>
          </tns:searchTrains>
        </soap:Body>
      </soap:Envelope>
    `;
  
    const resp = await callSoap(xml);
    if (!resp) {
      setSearchResponse('Error: No response from the search service.');
      return;
    }
  
    console.log('SearchTrains response:', resp);
  
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(resp, 'text/xml');
  
      // Extract train nodes
      const trainNodes = xmlDoc.getElementsByTagName('trains');
      const result = [];
  
      for (let i = 0; i < trainNodes.length; i++) {
        const trainNode = trainNodes[i];
        const id = trainNode.getElementsByTagName('id')[0]?.textContent;
        const departureStation = trainNode.getElementsByTagName('departureStation')[0]?.textContent;
        const arrivalStation = trainNode.getElementsByTagName('arrivalStation')[0]?.textContent;
        const departureTime = trainNode.getElementsByTagName('departureTime')[0]?.textContent;
        const arrivalTime = trainNode.getElementsByTagName('arrivalTime')[0]?.textContent;
        const seatsFirst = trainNode.getElementsByTagName('seatsFirst')[0]?.textContent;
        const seatsBusiness = trainNode.getElementsByTagName('seatsBusiness')[0]?.textContent;
        const seatsStandard = trainNode.getElementsByTagName('seatsStandard')[0]?.textContent;
        const fareFlexible = trainNode.getElementsByTagName('flexible')[0]?.textContent;
        const fareNotFlexible = trainNode.getElementsByTagName('notFlexible')[0]?.textContent;
  
        result.push({
          id,
          departureStation,
          arrivalStation,
          departureTime,
          arrivalTime,
          seatsFirst,
          seatsBusiness,
          seatsStandard,
          fareFlexible,
          fareNotFlexible,
        });
      }
  
      setSearchResult(result);
      setSearchResponse('Train search completed successfully!');
    } catch (error) {
      console.error('Error parsing train search response:', error);
      setSearchResponse('Error: An error occurred while processing the search response.');
    }
  };    

  // 3. Book Trains Handler
  const handleBookTrains = async () => {
    if (!token) {
      setBookingResponse('Error: You must log in first!');
      return;
    }

    const xml = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://example.com/trainBookingService">
        <soap:Body>
          <tns:bookTrains>
            <trainIDs>${bookTrainIDs}</trainIDs>
            <travelClass>${bookClass}</travelClass>
            <tickets>${bookTickets}</tickets>
            <token>${token}</token>
          </tns:bookTrains>
        </soap:Body>
      </soap:Envelope>
    `;

    const resp = await callSoap(xml);
    if (!resp) {
      setBookingResponse('Error: No response from the booking service');
      return;
    }

    console.log('BookTrains response:', resp);

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(resp, 'text/xml');

      // Extract result and reservation ID
      const resultNode = xmlDoc.getElementsByTagNameNS('http://example.com/trainBookingService', 'result')[0];
      const reservationIDNode = xmlDoc.getElementsByTagNameNS('http://example.com/trainBookingService', 'reservationID')[0];

      if (resultNode) {
        const resultText = resultNode.textContent;
        const reservationID = reservationIDNode?.textContent || 'N/A';
        setBookingResponse(
          `Booking Status: ${resultText}. Reservation ID: ${reservationID}`
        );
      } else {
        setBookingResponse('Error: Booking failed or unexpected response format.');
      }
    } catch (error) {
      console.error('Error parsing booking response:', error);
      setBookingResponse('Error: An error occurred while processing the booking response.');
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-5">Train Booking via SOAP (Tailwind Demo)</h1>

      {/* LOGIN FORM */}
      <div className="bg-white p-4 rounded-md shadow-md max-w-sm mb-4">
        <h2 className="text-xl font-semibold mb-2">Login</h2>
        <div className="mb-2">
          <label className="block font-medium">Username</label>
          <input
            className="border rounded w-full p-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Password</label>
          <input
            className="border rounded w-full p-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin} className="bg-blue-500 text-white px-3 py-1 rounded">
          Login
        </button>
        {loginResponse && (
          <div className={`mt-4 p-3 rounded-md ${loginResponse.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {loginResponse}
          </div>
        )}
      </div>


      {/* SEARCH TRAINS */}
      <div className="bg-white p-4 rounded-md shadow-md max-w-sm mb-4">
        <h2 className="text-xl font-semibold mb-2">Search Trains</h2>
        <div className="mb-2">
          <label className="block font-medium">Departure Station</label>
          <input
            className="border rounded w-full p-1"
            value={departureStation}
            onChange={(e) => setDepartureStation(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Arrival Station</label>
          <input
            className="border rounded w-full p-1"
            value={arrivalStation}
            onChange={(e) => setArrivalStation(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Travel Date/Time</label>
          <input
            className="border rounded w-full p-1"
            type="datetime-local"
            value={new Date(travelDateTime).toISOString().slice(0, 16)} // Prepopulate in correct format
            onChange={(e) => setTravelDateTime(toISODateTime(e.target.value))} // Convert user input to ISO
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Tickets</label>
          <input
            className="border rounded w-full p-1"
            type="number"
            value={tickets}
            onChange={(e) => setTickets(Number(e.target.value))}
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Class</label>
          <select
            className="border rounded w-full p-1"
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
          >
            <option>Standard</option>
            <option>Business</option>
            <option>First</option>
          </select>
        </div>
        <button onClick={handleSearchTrains} className="bg-green-500 text-white px-3 py-1 rounded">
          Search
        </button>
      </div>

      {/* SEARCH RESULTS */}
      <div className="bg-white p-4 rounded-md shadow-md mb-4 overflow-auto inline-block">
        <h2 className="text-xl font-semibold mb-2">Search Results</h2>
        {searchResponse && (
          <div className={`mb-4 p-3 rounded-md ${searchResponse.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {searchResponse}
          </div>
        )}
        {searchResult.length === 0 ? (
          <p>No trains found or no search yet.</p>
        ) : (
          <table className="border-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Train ID</th>
                <th className="border px-2 py-1">Dep. Station</th>
                <th className="border px-2 py-1">Arr. Station</th>
                <th className="border px-2 py-1">Dep. Time</th>
                <th className="border px-2 py-1">Arr. Time</th>
                <th className="border px-2 py-1">Seats (First)</th>
                <th className="border px-2 py-1">Seats (Business)</th>
                <th className="border px-2 py-1">Seats (Standard)</th>
                <th className="border px-2 py-1">Fare (Flexible)</th>
                <th className="border px-2 py-1">Fare (Not Flexible)</th>
              </tr>
            </thead>
            <tbody>
              {searchResult.map((train, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{train.id}</td>
                  <td className="border px-2 py-1">{train.departureStation}</td>
                  <td className="border px-2 py-1">{train.arrivalStation}</td>
                  <td className="border px-2 py-1">{formatDateTime(train.departureTime)}</td>
                  <td className="border px-2 py-1">{formatDateTime(train.arrivalTime)}</td>
                  <td className="border px-2 py-1">{train.seatsFirst}</td>
                  <td className="border px-2 py-1">{train.seatsBusiness}</td>
                  <td className="border px-2 py-1">{train.seatsStandard}</td>
                  <td className="border px-2 py-1">{train.fareFlexible}</td>
                  <td className="border px-2 py-1">{train.fareNotFlexible}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* BOOK TRAINS */}
      <div className="bg-white p-4 rounded-md shadow-md max-w-sm mb-4">
        <h2 className="text-xl font-semibold mb-2">Book Trains</h2>
        <div className="mb-2">
          <label className="block font-medium">Train IDs (comma separated)</label>
          <input
            className="border rounded w-full p-1"
            value={bookTrainIDs}
            onChange={(e) => setBookTrainIDs(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Tickets</label>
          <input
            className="border rounded w-full p-1"
            type="number"
            value={bookTickets}
            onChange={(e) => setBookTickets(Number(e.target.value))}
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Class</label>
          <select
            className="border rounded w-full p-1"
            value={bookClass}
            onChange={(e) => setBookClass(e.target.value)}
          >
            <option>Standard</option>
            <option>Business</option>
            <option>First</option>
          </select>
        </div>
        <button onClick={handleBookTrains} className="bg-purple-500 text-white px-3 py-1 rounded">
          Book
        </button>
        {bookingResponse && (
          <div className={`mt-4 p-3 rounded-md ${bookingResponse.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {bookingResponse}
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
