const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001; // Choose a port for your server

app.use(cors());

app.get('/places', async (req, res) => {
  try {
    const input = req.query.input;
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${apiKey}`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching location suggestions:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});