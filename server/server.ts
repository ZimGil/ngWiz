import express = require('express');
import path = require('path');
import compression = require('compression');
import fs = require('fs');
import childProcess = require('child_process');
//
import { ProcessRunner } from './process-runner';
import { AngularCliProcessStatus } from './models/angular-cli-process-status.enum';
import { AngularProjectChecker } from './angular-project-checker';
import { printLogo } from './logo-printer.helper';
import { NgWizLogger } from './ngWizLogger';

const app = express();
const STATIC_FILES_LOCATION = path.join(__dirname, '../../..', '/dist/Angular-cli-ui');
const PORT = 3000;
const logger = new NgWizLogger('debug');

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
  logger.log.debug('Request to check if running inside an Angular Project');

  new AngularProjectChecker().check()
  .then(
    projectFolder => res.send(true),
    nonProjectFolder => res.send(false)
  );
});

app.get('/stopServing', (req, res) => {
  const id = req.query.id;
  logger.log.debug(`Request to stop "ng serve" command, ID: ${id}`);

  if (processRunner.runningProcesses[id]) {
    const port = processRunner.runningProcesses[id].command.match(/\s([0-9]{4,5})\s?/g)[0].replace(/\s/g, '');
     const killProcess = {
      id: 'killer',
      params: `for /f "tokens=5" %a in ('netstat -ano ^| find "${port}" ^| find "LISTENING"') do taskkill /f /pid %a`
    };
    processRunner.run(killProcess);
    logger.log.debug(`Command killed, port: ${port} is now free to use`);
    processRunner.runningProcesses['killer'] = null;
    res.send({id: req.query.id});
    processRunner.runningProcesses[id] = null;
  } else {
    logger.log.error(`Could not find command with ID: ${id}`);
    res.sendStatus(404);
  }
});

app.get('/projects', (req, res) => {
  const projects: string[] = [];
  const folderContent = fs.readdirSync(process.cwd());
  logger.log.debug(`Looking for Angular Projects under ${process.cwd()}`)

  folderContent.forEach(dirName => {
    const dirPath = process.cwd() + path.sep + dirName;
    logger.log.debug(`Attempting to acsses ${dirPath}`);
    try {
      if (fs.statSync(dirPath).isDirectory()) {
        const file = `${dirPath}${path.sep}angular.json`;
        fs.accessSync(file);
        projects.push(dirName);
        logger.log.debug(`Added "${dirName}" to projects array`);
      }
    } catch (error) {
      logger.log.error(`Failed attempt to add "${dirName}" to projects array`);
    }
  });
  logger.log.info(`Available projects: [${projects.join(', ')}]`);
  res.send(projects);
});

app.get('/chooseProject', (req, res) => {
  const projectName = req.query.name;
  logger.log.debug(`Client ask to join project "${projectName}`);
  try {
    process.chdir(projectName);
    logger.log.debug(`Joined project "${projectName}", current directory ${process.cwd()}`);
    res.send();
  }
  catch (error) {
    logger.log.error(`Unable to join project "${projectName}"`);
    logger.log.error(error);
    res.sendStatus(511);
  }
});

app.get('/keepAlive', (req, res) => {
  res.send(true);
});

app.get('/leaveProject', (req, res) => {
  const projectName = process.cwd().split(path.sep).pop();
  logger.log.debug('Client ask to leave current project');
  try {
    process.chdir('../');
    logger.log.debug(`left project "${projectName}", current directory ${process.cwd()}`);
    res.send();
  }
  catch (error) {
    logger.log.error(`Unable to leave project "${projectName}"`)
    logger.log.error(error);
    res.sendStatus(404);
  }
});

app.get('/status', (req, res) => {
  const id = req.query.id;

  if (processRunner.runningProcesses[id]) {
    const processStatus = processRunner.runningProcesses[id].status;
    const printableStatus = AngularCliProcessStatus[processStatus].toLocaleUpperCase();
    logger.log.debug(`Command status check - process ID: ${id} status: ${printableStatus}`);
    res.send({status: processStatus});
    if (processStatus === AngularCliProcessStatus.done
      && !processRunner.runningProcesses[id].command.includes('ng serve ')) {
      processRunner.runningProcesses[id] = null;
      logger.log.info(`Process ID: ${id} removed for the server`)
    }
  } else {
    logger.log.error(`Command status check failed - process ID ${id} not found`);
    res.sendStatus(404);
  }
});

app.post('/command', (req, res) => {

  const currentProcess = {
    id: ProcessRunner.guid(),
    params: req.body.command
  }

  try {
    logger.log.debug(`Running command: "${currentProcess.params}" under ID: [${currentProcess.id}]`);
    processRunner.run(currentProcess);
    res.send(currentProcess.id);  
  }
  catch (error) {
    logger.log.error(`Command: "${currentProcess.params}" failed:`, error);
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
  logger.log.clearContext()
  printLogo();
  // TODO: Add version/build number here
  logger.log.debug(`Listening on http://localhost:${PORT}`);
  if (isOpenBrowser) {
    openBrowser(PORT);
  }
});

function openBrowser(port) {
  const url = `http://localhost:${port}`;
  const start = process.platform === 'darwin'? 'open': process.platform === 'win32'? 'start': 'xdg-open';
  logger.log.info(`Opening a browser at: http://localhost:${PORT}`);
  childProcess.exec(`${start} ${url}`);
}
