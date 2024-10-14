const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const { URL } = require('url');

// Load environment variables from .env file
require('dotenv').config();
const port = process.env.PORT || 3000;
const origin = process.env.ORIGIN || '*';
const dbURI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/nanoUrl';
const apiURL = process.env.API_URL || `http://127.0.0.1:${port}`;

const app = express();

mongoose
  .connect(dbURI)
  .then((v) => console.log(`Mongoose connected to > ${v.connection.name}`))
  .catch((e) => {
    console.error(`Mongoose failed to connect to ${dbURI}`, e);
    process.exit(1);
  });

const Url = mongoose.model(
  'Url',
  new mongoose.Schema(
    {
      ID: {
        type: String,
        unique: true,
        required: true,
        default: () => nanoid(8),
      },
      url: {
        type: String,
        required: (true, 'Url is required'),
      },
      clicks: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    { timestamps: true }
  )
);

app.use(express.static(path.join(__dirname, '/public')));

// mws
app.use(express.json());
app.use(helmet());
app.use(cors({ origin }));

// logger
app.use((req, res, next) => {
  console.log(req.method, '-', req.url, '-', req.path, '-', req.query || 'nil', '\n');
  next();
});

// routes
app.get('/', (req, res, next) => {
  try {
    res.status(200).sendFile('index.html', { root: path.join(__dirname, 'public/html') });
  } catch (error) {
    console.error(error);
    next(new Error('Failed to get home page'));
  }
});

app.get('/nanonize', async (req, res, next) => {
  try {
    // create new url
    const { u } = req.query;

    // validate null and bad inputs
    if (!u) return res.status(400).json({ message: 'Please enter URL to nanonize' });

    if (!isValidURL(u)) return res.status(400).json({ message: 'Invalid URL' });

    const doc = new Url({ url: u });
    const { ID, url } = await doc.save();
    // response with original url + nanonized url
    res.status(201).json({
      message: 'url nanonized successfully',
      data: { nano_url: `${apiURL}/${ID}`, long_url: url },
    });
  } catch (error) {
    console.error(error);
    next(new Error('Failed to nanonize url'));
  }
});

app.get('/:ID', async (req, res, next) => {
  try {
    const { ID } = req.params;
    // search for url using id
    const doc = await Url.findOne({ ID });

    // if not found return not found response
    if (!doc) return res.status(404).sendFile('404.html', { root: path.join(__dirname, 'public/html') });

    // else redirect to the original url and click++
    doc.clicks += 1;
    await doc.save();
    return res.status(301).redirect(doc.url);
  } catch (error) {
    console.error(error);
    next(new Error('Failed to get url'));
  }
});

// error handling

app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

// utils

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

app.listen(port, () => {
  console.log(`server running on port > ${port}`);
});
