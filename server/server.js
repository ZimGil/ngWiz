const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const STATIC_FILES_LOCATION = path.join(__dirname, '..', '/dist/Angular-cli-ui');

app.use(compression());
app.use(express.static(STATIC_FILES_LOCATION));

app.get('/', function(req, res) {
  res.sendFile(`${STATIC_FILES_LOCATION}/index.html`);
});

app.listen(3000, () => {
    console.log('Listening on port 3000!');
});
