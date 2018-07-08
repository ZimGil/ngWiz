const express = require('express');
const path = require('path');
const compression = require('compression');
const childProcess = require('child_process');
const fs = require('fs');

const app = express();
const STATIC_FILES_LOCATION = path.join(__dirname, '..', '/dist/Angular-cli-ui');
const PORT = 3000;

let isOpenBrowser;

process.argv.forEach((val, index, array) => {
  if (val === '-o') {
    isOpenBrowser = true;
  }
});

app.use(compression());
app.use(express.static(STATIC_FILES_LOCATION));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.sendFile(`${STATIC_FILES_LOCATION}/index.html`);
});

app.get('/isAngularProject', (req, res) => {
  const file = 'angular.json';
  
  fs.access(file, fs.constants.F_OK, (err) => {
    res.send(err ? false : true);
  });
});

app.post('/command', (req, res) => {
  try {
    const commandEvent = childProcess.exec(req.body.command, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
    });

    commandEvent.stdout.on('data', (data) => {
      console.log(data); 
    });
  
    commandEvent.stdout.on('close', () => {
      console.log("###################################################################################");
      if (req.body.command.toString().includes(' new ')){
        const commandValues = req.body.command.toString().split(' ');
        const projectName = commandValues[2];
        process.chdir(`${process.cwd()}\\${projectName}`);
      }
    })
    
    res.send('thanks for this data');  
  }
  catch(error) {
    console.log(error);
    res.status(400).end();
  }
});

//this function will help us in development using Postman to change the working directory
app.post('/DEVchangeDir', (req, res) => {
  process.chdir(req.body.folder);
  res.send(`Working directory chaged to: ${process.cwd()}`);
})

app.listen(PORT, () => {
  console.clear();
  console.log(`Listening on port ${PORT}!`);
  if (isOpenBrowser) {
    openBrowser(PORT);
  }
});

function openBrowser(port) {
  const url = `http://localhost:${port}`;
  const start = process.platform === 'darwin'? 'open': process.platform === 'win32'? 'start': 'xdg-open';

  childProcess.exec(`${start} ${url}`);
}
