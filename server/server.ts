import express = require('express');
import path = require('path');
import compression = require('compression');
import fs = require('fs');
import childProcess = require('child_process');
import colors = require('colors/safe');
//
import { ProcessRunner } from './process-runner';
import { AngularCliProcessStatus } from './models/angular-cli-process-status.enum';
import { AngularProjectChecker } from './angular-project-checker';
import { printLogo } from './logo-printer.helper';

const app = express();
const STATIC_FILES_LOCATION = path.join(__dirname, '../../..', '/dist/Angular-cli-ui');
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
  const angularProjectChecker = new AngularProjectChecker();

  angularProjectChecker.check()
  .then(
    projectFolder => res.send(true),
    nonProjectFolder => res.send(false)
  );
});

app.get('/stopServing', (req, res) => {
  const id = req.query.id;
  if (processRunner.runningProcesses[id]) {
    const port = processRunner.runningProcesses[id].command.match(/\s([0-9]{4,5})\s?/g)[0].replace(/\s/g, '');
     const killProcess = {
      id: 'killer',
      params: `for /f "tokens=5" %a in ('netstat -ano ^| find "${port}" ^| find "LISTENING"') do taskkill /f /pid %a`
    };
    processRunner.run(killProcess);
    processRunner.runningProcesses['killer'] = null;
    res.send({id: req.query.id});
    processRunner.runningProcesses[id] = null;
  } else {
    res.sendStatus(404);
  }
});

app.get('/projects', (req, res) => {
  const projects: string[] = [];
  const folderContent = fs.readdirSync(process.cwd());
  console.log(`Looking for Angular Projects under ${cwdGrey()}`)

  folderContent.forEach(dirName => {
    const dirPath = process.cwd() + path.sep + dirName;
    try {
      if (fs.statSync(dirPath).isDirectory()) {
        console.log(`Attempting to acsses ${dirPath}`)
        const file = `${dirPath}${path.sep}angular.json`;
        fs.accessSync(file);
        projects.push(dirName);
      }
    } catch (error) {
      console.error(`Failed attempt to add ${dirName} to projects array`);
      console.error(error); 
    }
  });
  res.send(projects);
});

app.get('/chooseProject', (req, res) => {
  const projectName = req.query.name;
  try {
    process.chdir(projectName);
    console.log(`Joined project "${projectName}", current directory ${cwdGrey()}`);
    res.send();
  }
  catch (error) {
    console.error(`Unable to join project "${projectName}"`);
    console.error(error);
    res.sendStatus(511);
  }
});

app.get('/keepAlive', (req, res) => {
  res.send(true);
});

app.get('/leaveProject', (req, res) => {
  const projectName = process.cwd().split(path.sep).pop();
  try {
    process.chdir('../');
    console.log(`left project "${projectName}", current directory ${cwdGrey()}`);
    res.send();
  }
  catch (error) {
    console.error(`Unable to leave project "${projectName}"`)
    console.error(error);
    res.sendStatus(404);
  }
});

app.get('/status', (req, res) => {
  const id = req.query.id;

  if (processRunner.runningProcesses[id]) {
    const processStatus = processRunner.runningProcesses[id].status;
    console.log(`Command status check - process ID: ${id} status: ${processStatus}`);
    res.send({status: processStatus});
    if (processStatus === AngularCliProcessStatus.done
      && !processRunner.runningProcesses[id].command.includes('ng serve ')) {
      processRunner.runningProcesses[id] = null;
      console.log(`Process ID: ${id} removed for the server`)
    }
  } else {
    console.error(`Command status check failed - process ID ${id} not found`);
    res.sendStatus(404);
  }
});

app.post('/command', (req, res) => {
  try {

    const currentProcess = {
      id: ProcessRunner.guid(),
      params: req.body.command
    }
    
    console.log(`Running command: ${currentProcess.params} under ID: ${currentProcess.id}`);
    processRunner.run(currentProcess);
    res.send(currentProcess.id);  
  }
  catch(error) {
    console.error('Command failed:', error);
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
  printLogo();
  // TODO: Add version/build number here
  console.log('Listening on ', colors.grey(`http://localhost:${PORT}`));
  if (isOpenBrowser) {
    openBrowser(PORT);
  }
});

function cwdGrey() {
  return colors.grey(process.cwd());
}

function openBrowser(port) {
  const url = `http://localhost:${port}`;
  const start = process.platform === 'darwin'? 'open': process.platform === 'win32'? 'start': 'xdg-open';
  console.log('Opening a browser at', colors.cyan(`http://localhost:${PORT}`));
  childProcess.exec(`${start} ${url}`);
}
