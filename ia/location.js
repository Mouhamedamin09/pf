const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/receive-location', async (req, res) => {
  const locationData = req.body;
  

  try {
    // First API call to get the city name
    const geoResponse = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${locationData.coords.latitude}&longitude=${locationData.coords.longitude}&localityLanguage=en`);
    const city = geoResponse.data.city;
    console.log('City:', city);

    // Second API call to get the weather data
    const APIkey = "638bdc506f552e2390c7caa3153d36c9";
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIkey}`);
    const tempFahrenheit = weatherResponse.data.main.temp;
    const tempCelsius = (tempFahrenheit - 32) * 5 / 9;
    console.log('Weather in Fahrenheit:', tempFahrenheit);
    console.log('Weather in Celsius:', tempCelsius);

    // Send the city and the weather in Celsius back to the client
    res.json({ city, tempCelsius });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error in processing the request' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
