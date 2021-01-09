const express = require('express');
const path = require('path');
const router = require('./routes/');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api', router);

app.use(express.static(path.join(__dirname, 'client/build')));

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`);
});