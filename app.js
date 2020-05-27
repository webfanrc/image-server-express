const express = require('express');
const app = express();
const port = 4001;


const middleware = require('./middleware');
const photo = require('./photo');



app.use(middleware.setHeader);

app.post('/photo/upload', photo.upload);

app.use(express.static('public'));

app.listen(port, () => console.log(`App listening on port ${port}!`));