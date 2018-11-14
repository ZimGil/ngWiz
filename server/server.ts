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
  startingASCII();
  //will add version/build number here
  console.log('Listening on ', colors.grey(`http://localhost:${PORT}`));
  if (isOpenBrowser) {
    openBrowser(PORT);
  }
});

function startingASCII() {
  console.log();
  console.log(colors.yellow('                       oooooo   oooooo     oooo  o8o             '));
  console.log(colors.yellow('                        `888.    `888.     .8\'   `"\'             '));
  console.log(colors.yellow('ooo. .oo.    .oooooooo   `888.   .8888.   .8\'   oooo    oooooooo '));
  console.log(colors.yellow('`888P"Y88b  888\' `88b     `888  .8\'`888. .8\'    `888   d\'""7d8P  '));
  console.log(colors.yellow(' 888   888  888   888      `888.8\'  `888.8\'      888     .d8P\'   '));
  console.log(colors.yellow(' 888   888  `88bod8P\'       `888\'    `888\'       888   .d8P\'  .P '));
  console.log(colors.yellow('o888o o888o `8oooooo.        `8\'      `8\'       o888o d8888888P  '));
  console.log(colors.yellow('            d"     YD                                            '));
  console.log(colors.yellow('            "Y88888P\'                                            '));
  console.log();
}

function openBrowser(port) {
  const url = `http://localhost:${port}`;
  const start = process.platform === 'darwin'? 'open': process.platform === 'win32'? 'start': 'xdg-open';

  childProcess.exec(`${start} ${url}`);
}
