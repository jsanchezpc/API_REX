const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Rex status: ✅ OK ');
});

// account
app.use(require('./account'));

// AI AGENT
app.use(require('./agent'));

module.exports = app;