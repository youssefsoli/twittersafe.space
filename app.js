const express = require('express');
const router = require('./routes/');
const app = express();
const port = process.env.DEVELOPMENT ? 3000 : 80;

app.use('/', router);

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`);
});