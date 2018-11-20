import { Component, OnInit } from '@angular/core';

import { interval, timer, empty } from 'rxjs';
import { exhaustMap, mergeMap } from 'rxjs/operators';

import { CommandService } from './services/command/command.service';
import { CommandRequest } from './models/angular-command-request';
import { AngularCliProcessStatus } from './models/angular-cli-process-status.enum';
import { ErrorService } from './services/error/error.service';
import { AngularCommandType } from './models/angular-command-type.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'ngWiz';
  isAngularProject: boolean;
  isReadyForWork = false;
  runningCommands = {};
  timedStatusCheck = interval(1000);
  KEEP_ALIVE_INTERVAL = 1000;
  subscription = {};
  serveCommandId: string;
  availableProjects: string[] = [];

  constructor(
    private commandService: CommandService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.keepAlive();
    this.checkAngularProject();
    this.loadCurrentServe();
  }

  checkAngularProject(): void {
    this.isReadyForWork = false;
    this.commandService.isAngularProject()
      .pipe(
        mergeMap(
          res => {
            this.isAngularProject = !!res;
            this.isReadyForWork = true;
            return this.isAngularProject ? empty() : this.commandService.getProjects();
        })
      )
      .subscribe((projects: string[]) => this.availableProjects = projects);
  }

  checkCommandStatus(commandId: string): void {
    this.commandService.checkCommandStatus(commandId)
      .subscribe(response => {
        this.runningCommands[commandId] = response;
      }, error => {
        if (error.status === 404) {
          console.log('command not found in server, stop checking');
          this.doneCheckingCommand(commandId);
        }
      });
  }

  doneCheckingCommand(commandId: string): void {
    this.subscription[commandId].unsubscribe();
    this.subscription[commandId] = null;
  }

  commandDone(commandId: string, commandType?: AngularCommandType): void {
    if (commandType === AngularCommandType.new) {
      this.checkAngularProject();
    }
    this.runningCommands[commandId] = null;
  }

  startCheckingCommand(commandId: string, commandType?: AngularCommandType): void {
    if (this.runningCommands[commandId]) {
      const status = this.runningCommands[commandId].status;

      if (status === AngularCliProcessStatus.done) {
        this.doneCheckingCommand(commandId);
        this.commandDone(commandId, commandType);
        if (commandType === AngularCommandType.serve) {
          this.serveCommandId = commandId;
          localStorage.setItem('ngServe', this.serveCommandId);
        }
      } else if (status === AngularCliProcessStatus.error) {
        this.doneCheckingCommand(commandId);
      } else if (status === AngularCliProcessStatus.working) {
        this.checkCommandStatus(commandId);
      }
    } else {
      this.checkCommandStatus(commandId);
    }
  }

  chooseProject(projectName: string) {
    this.commandService.chooseProject(projectName)
      .subscribe(
        res => this.isAngularProject = true,
        () => {
          this.errorService.addError({
            errorText: 'Could not choose this project',
            errorDescription: 'There was an error while trying to choose this project',
          });
          this.availableProjects.splice(this.availableProjects.indexOf(projectName));
        });
    }

  keepAlive(): void {
    this.subscription['TimedkeepAlive'] = timer(0, this.KEEP_ALIVE_INTERVAL)
      .pipe(
        exhaustMap(
          () => this.commandService.keepAlive()
        )
      )
      .subscribe(
        response => {},
        error => {
          this.errorService.addError({
            errorText: 'The server is offline',
            errorDescription: 'please run the server and restart the client'
          });
          this.subscription['TimedkeepAlive'].unsubscribe();
        }
      );
  }

  leaveProject(): void {
    this.commandService.leaveProject()
      .subscribe(
        res => this.isAngularProject = false,
        () => {
          this.errorService.addError({
            errorText: 'Unable to leave this project',
            errorDescription: 'To run ngWiz on another project or to create a new one, please run it in the apropriate project direcroty'
          });
        });
  }

  loadCurrentServe(): void {
    this.serveCommandId = localStorage.getItem('ngServe');
  }

  sendCommand(userCommand: string, commandType?: AngularCommandType): void {
    const request = new CommandRequest(userCommand);

    // TO-DO:
    // remove subscribe inside of subscribe
    this.commandService.sendCommand(request)
    .subscribe(commandId => {
      console.log('started working on command, ID:', commandId);
      this.subscription[commandId] = this.timedStatusCheck
        .subscribe(() => this.startCheckingCommand(commandId, commandType));
    });
  }

  sendServeCommand(serveCommand: string): void {
    this.sendCommand(serveCommand, AngularCommandType.serve);
  }

  sendNewCommand(newCommand: string): void {
    this.sendCommand(newCommand, AngularCommandType.new);
  }
}
