import express = require('express');
import path = require('path');
import compression = require('compression');
import fs = require('fs');
import childProcess = require('child_process');
import colors = require('colors/safe');
import { timer } from 'rxjs';
//
import { ProcessRunner } from './process-runner';
import { AngularCliProcessStatus } from './models/angular-cli-process-status.enum';
import { AngularProjectChecker } from './angular-project-checker';
import { printLogo } from './logo-printer.helper';
import { NgWizLogger } from './ngWizLogger';
import { CommandStatusResponse } from './models/command-status-response.interface';

const app = express();
const STATIC_FILES_LOCATION = path.join(__dirname, '../../..', '/dist/ngWiz');
const PORT = 3000;
const logger = new NgWizLogger('debug');

let isOpenBrowser;
let ngServeCommandId = null;

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
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(`${STATIC_FILES_LOCATION}/index.html`);
});

app.get('/isServing', (req, res) => {
  res.send(!!ngServeCommandId);
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
  if (processRunner.runningProcesses[ngServeCommandId]) {
    const port = processRunner.runningProcesses[ngServeCommandId].command.match(/\s([0-9]{4,5})\s?/g)[0].replace(/\s/g, '');
     const killProcess = {
      id: 'killer',
      params: `for /f "tokens=5" %a in ('netstat -ano ^| find "${port}" ^| find "LISTENING"') do taskkill /f /pid %a`
    };
    const ngServeStopper = timer(0, 500).subscribe(() => {
      if (processRunner.runningProcesses[ngServeCommandId].status === AngularCliProcessStatus.done) {
        processRunner.run(killProcess);
        processRunner.runningProcesses['killer'] = null;
        res.send();
        processRunner.runningProcesses[ngServeCommandId] = null;
        ngServeCommandId = null;
        ngServeStopper.unsubscribe();
      }
    });
  } else {
    res.sendStatus(404);
  }
});

app.get('/projects', (req, res) => {
  const projects: string[] = [];
  const folderContent = fs.readdirSync(process.cwd());

  folderContent.forEach(dirName => {
    const dirPath = process.cwd() + path.sep + dirName;
    try {
      if (fs.statSync(dirPath).isDirectory()) {
        const file = `${dirPath}${path.sep}angular.json`;
        fs.accessSync(file);
        projects.push(dirName);
      }
    } catch {
      console.error('Failed attempt to add an angular project to available projects array');
    }
  });
  res.send(projects);
});

app.get('/chooseProject', (req, res) => {
  const projectName = req.query.name;
  console.log('choosing project', projectName);
  try {
    process.chdir(projectName);
    res.send();
  } catch (error) {
    res.sendStatus(511);
  }
});

app.get('/keepAlive', (req, res) => {
  res.send(true);
});

app.get('/leaveProject', (req, res) => {
  try {
    const projectName = process.cwd().split(path.sep).pop();
    process.chdir('../');
    console.log(`leaving project "${projectName}", current directory ${process.cwd()}`);
    res.send();
  } catch {
    res.sendStatus(404);
  }
});

app.get('/status', (req, res) => {
  const id = req.query.id;

  if (processRunner.runningProcesses[id]) {
    const processStatus = processRunner.runningProcesses[id].status;
    res.send(<CommandStatusResponse>{id: id, status: processStatus});
    if (processStatus === AngularCliProcessStatus.done
      && !processRunner.runningProcesses[id].command.includes('ng serve ')) {
      processRunner.runningProcesses[id] = null;
    }
  } else {
    res.send(<CommandStatusResponse>{id: id, status: AngularCliProcessStatus.error});
  }
});

app.post('/command', (req, res) => {
  try {

    const currentProcess = {
      id: ProcessRunner.guid(),
      params: req.body.command
    };

    if (currentProcess.params.includes('ng serve')) {
      ngServeCommandId = currentProcess.id;
    }

    processRunner.run(currentProcess);
    res.send(currentProcess.id);

  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
});

// this function will help us in development using Postman to change the working directory
app.post('/DEVchangeDir', (req, res) => {
  process.chdir(req.body.folder);
  res.send(`Working directory chaged to: ${process.cwd()}`);
});

app.listen(PORT, () => {
  console.clear();
  printLogo();
  // TODO: Add version/build number here
  logger.log.debug(`Listening on ${colors.gray(`http://localhost:${PORT}`)}`);
  if (isOpenBrowser) {
    openBrowser(PORT);
  }
});

function openBrowser(port) {
  const url = `http://localhost:${port}`;
  const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';

  childProcess.exec(`${start} ${url}`);
}
