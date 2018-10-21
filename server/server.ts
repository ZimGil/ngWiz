import express = require('express');
import path = require('path');
import compression = require('compression');
import fs = require('fs');
import childProcess = require('child_process');
//
import { ProcessRunner } from './process-runner';
import { AngularCliProcessStatus } from './models/angular-cli-process-status.enum';


const app = express();
const STATIC_FILES_LOCATION = path.join(__dirname, '..', '/dist/Angular-cli-ui');
const PORT = 3000;

let isOpenBrowser;

process.argv.forEach((val, index, array) => {
  if (val === '-o') {
    isOpenBrowser = true;
  }
});

const processRunner = new ProcessRunner();

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
  isAngularProject(res);
});

app.get('/projects', (req, res) => {
  let projects: string[] = [];
  const subDirs = fs.readdirSync(process.cwd());

  subDirs.forEach(dir => {
    const dirPath = process.cwd()+path.sep+dir;
    try {
      if (fs.statSync(dirPath).isDirectory()) {
        const file = `${dirPath}${path.sep}angular.json`;
        try {
          fs.accessSync(file);
          projects.push(dir);
        } catch {}
      }
    } catch {}
  })
  res.send(projects);
});

app.get('/status', (req, res) => {
  const id = req.query.id;

  if (processRunner.runningProcesses[id]) {
    const processStatus = processRunner.runningProcesses[id].status;
    res.send({status: processStatus});
    if (processStatus === AngularCliProcessStatus.done) {
      processRunner.runningProcesses[id] = null;
    }
  } else {
    res.sendStatus(404);
  }
});

app.post('/command', (req, res) => {
  try {

    const currentProcess = {
      id: ProcessRunner.guid(),
      params: req.body.command
    }
    
    processRunner.run(currentProcess);
    res.send(currentProcess.id);  
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

function isAngularProject(res) {
  console.log('checking if running inside an agular project')

  let testResult: boolean;
  let isReady = false;
  
  const callback = (err, stdout, stderr) => {};

  function isMainProjectFolder(res) {
    const file = 'angular.json';

    fs.access(file, fs.constants.F_OK, (err) => {
      if (err) {
        process.chdir('../');
        isMainProjectFolder(res);
      } else {
        console.log('running inside main folder of an angular project');
        res.send(true);
      }
    })
  }
  
  function catchError(error) {
    if (error.includes('Invalid options, "name" is required')) {
      console.log('not running inside an angular project');
      res.send(false);
    }
    else if (error.includes('This command can not be run inside of a CLI project')) {
      console.log('running inside an angular project, looking for main folder')
      isMainProjectFolder(res);
    }
  }
  
  const testProcess = childProcess.exec('ng new', callback);
  testProcess.stderr.on('data', (error) => catchError(error));
}
