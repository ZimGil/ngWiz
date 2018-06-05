const express = require('express');
const path = require('path');
const compression = require('compression');
const childProcess = require('child_process');

const app = express();
const STATIC_FILES_LOCATION = path.join(__dirname, '..', '/dist/Angular-cli-ui');
const PORT = 3000;


app.use(compression());
app.use(express.static(STATIC_FILES_LOCATION));

app.get('/', function(req, res) {
  res.sendFile(`${STATIC_FILES_LOCATION}/index.html`);
});

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  const start = process.platform === 'darwin'? 'open': process.platform === 'win32'? 'start': 'xdg-open';

  console.log(`Listening on port ${PORT}!`);
  childProcess.exec(`${start} ${url}`);
});
