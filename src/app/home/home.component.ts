import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';
import { timer, empty, throwError } from 'rxjs';
import { exhaustMap, mergeMap, catchError, filter, take } from 'rxjs/operators';

import { CommandService } from './services/command/command.service';
import { CommandRequest } from './models/angular-command-request';
import { AngularCliProcessStatus } from './models/angular-cli-process-status.enum';
import { ErrorService } from './services/error/error.service';
import { AngularCommandType } from './models/angular-command-type.enum';
import { CommandStatusResponse } from './models/command-status-response.interface';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  title = 'ngWiz';
  isAngularProject: boolean;
  isReadyForWork = false;
  KEEP_ALIVE_INTERVAL = 1000;
  COMMAND_STATUS_CHECK_INTERVAL = 1000;
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

  chooseProject(projectName: string) {
    this.commandService.chooseProject(projectName).subscribe(
      res => this.isAngularProject = true,
      () => {
        this.errorService.addError({
          errorText: 'Could not choose this project',
          errorDescription: 'There was an error while trying to choose this project',
        });
        this.availableProjects.splice(this.availableProjects.indexOf(projectName));
      }
    );
  }

  keepAlive(): void {
    timer(0, this.KEEP_ALIVE_INTERVAL).pipe(
      exhaustMap(() => this.commandService.keepAlive()),
      catchError(error => throwError(error).pipe(take(1)))
    )
    .subscribe(
      _.noop,
      error => this.errorService.addError({
        errorText: 'The server is offline',
        errorDescription: 'please run the server and restart the client'
      })
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
    )
    .subscribe((projects: string[]) => {
      this.availableProjects = projects;
    });
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

    this.commandService.sendCommand(request).pipe(
      mergeMap(commandId => timer(0, this.COMMAND_STATUS_CHECK_INTERVAL)
        .pipe(
          mergeMap(() => this.commandService.checkCommandStatus(commandId)),
          filter((response: CommandStatusResponse) => response.status !== AngularCliProcessStatus.working),
          take(1)
        )
      )
    )
    .subscribe(response => {
      switch (response.status) {
        case AngularCliProcessStatus.done:
          this.commandDone(response, commandType);
          break;
        }
    });
  }

  commandDone(response: CommandStatusResponse, commandType?: AngularCommandType) {
    if (commandType === AngularCommandType.new) {
      this.checkAngularProject();
    } else if (commandType === AngularCommandType.serve) {
      this.serveCommandId = response.id;
    }
  }

  sendServeCommand(serveCommand: string): void {
    this.sendCommand(serveCommand, AngularCommandType.serve);
  }

  sendNewCommand(newCommand: string): void {
    this.sendCommand(newCommand, AngularCommandType.new);
  }
}
