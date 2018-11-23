import { Component, OnInit } from '@angular/core';

import { interval, timer, empty } from 'rxjs';
import { exhaustMap, mergeMap, catchError } from 'rxjs/operators';

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
    this.checkIfRunningServeCommand();
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
    this.commandService.leaveProject().pipe(
      catchError(() => {
        this.errorService.addError({
          errorText: 'Unable to leave this project',
          errorDescription: 'To run ngWiz on another project or to create a new one, please run it in the apropriate project direcroty'
        });
        return empty();
      }),
      mergeMap(res => {
          this.isAngularProject = false;
          return this.commandService.getProjects();
      })
    ).pipe(mergeMap((projects: string[]) => {
      this.availableProjects = projects;
      return this.commandService.stopServing(this.serveCommandId);
    })).subscribe(
      _.noop,
      error => {
        this.errorService.addError({
          errorText: 'The "ng serve" command you\'re trying to stop was not found',
          errorDescription: 'The server is offline or have been restarted since you\'ve run this command'
        });
      },
      () => {
        this.serveCommandId = null;
        localStorage.removeItem('ngServeCommandId');
      }
    );

    // .subscribe((projects: string[]) => {
    //   this.availableProjects = projects;
    // });
  }

  checkIfRunningServeCommand(): void {
    const savedCommandId = localStorage.getItem('ngServeCommandId');
    if (savedCommandId) {
      this.commandService.checkCommandStatus(savedCommandId).subscribe(status => {
        this.serveCommandId = savedCommandId;
        this.isAngularProject = true;
        this.isReadyForWork = true;
      }, error => {
        this.serveCommandId = null;
        this.checkAngularProject();
        localStorage.removeItem('ngServeCommandId');
      });
    } else {
      this.serveCommandId = null;
      this.checkAngularProject();
    }
  }

  sendCommand(userCommand: string, commandType?: AngularCommandType): void {
    const request = new CommandRequest(userCommand);

    // TO-DO:
    // remove subscribe inside of subscribe
    this.commandService.sendCommand(request)
    .subscribe(commandId => {
      if (commandType === AngularCommandType.serve) {
        localStorage.setItem('ngServeCommandId', commandId);
      }
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
