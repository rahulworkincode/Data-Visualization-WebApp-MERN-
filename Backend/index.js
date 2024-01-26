const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { json } = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());

const uri = 'mongodb://0.0.0.0:27017/dvadata';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const User = mongoose.connection.collection('info');

app.get('/api/data', async (req, res) => {
  try {
    const { topic, country, sector, region, source, end_year } = req.query;

    const query = {};
    if (topic) query.topic = topic;
    if (country) query.country = country;
    if (sector) query.sector = sector;
    if (region) query.region = region;
    if (source) query.source = source;
    if (end_year) query.end_year = end_year;

    console.log(query)

    const result = await User.find(query).toArray();

    console.log(json(result))
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
