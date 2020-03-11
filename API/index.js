// import the required dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
let app = express();

const PORT = 3000;
const routes = require('./routes');

app.use(cors());
app.use(express.json());

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use('/api', routes);


app.listen(PORT, console.log('listening on port 2' + PORT));
