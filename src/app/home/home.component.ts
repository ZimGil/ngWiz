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
import { IsAngularProjectResponse } from './models/is-angular-project-response.interface';
import { GetProjectsResponse } from './models/get-projects-response.interface';
import { NgWizConfig } from './../../../server/config/ng-wiz-config.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  title = 'ngWiz';
  isAngularProject: boolean;
  isReadyForWork = false;
  KEEP_ALIVE_INTERVAL = 1000;
  COMMAND_STATUS_CHECK_INTERVAL = 1000;
  isServing: boolean;
  availableProjects: string[] = [];
  isStoppingServeCommand = false;
  currentWorkingDir: string;
  config: NgWizConfig;

  constructor(
    private commandService: CommandService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.getConfig();
    this.keepAlive();
    this.checkIfRunningServeCommand();
  }

  getConfig(): void {
    this.commandService.getConfig().subscribe(config => {
      this.config = config;
      console.log('config: ', this.config);
    });
  }

  checkAngularProject(): void {
    this.isReadyForWork = false;
    this.commandService.isAngularProject().pipe(
      mergeMap((res: IsAngularProjectResponse) => {
        this.currentWorkingDir = res.path;
        this.isAngularProject = res.isAngularProject;
        this.isReadyForWork = true;
        return this.isAngularProject ? empty() : this.commandService.getProjects();
      })
    )
    .subscribe((result: GetProjectsResponse) => this.availableProjects = result.projects);
  }

  chooseProject(projectName: string) {
    this.commandService.chooseProject(projectName).pipe(
      catchError(() => {
        this.errorService.addError({
          errorText: 'Could not choose this project',
          errorDescription: 'There was an error while trying to choose this project',
        });
        this.availableProjects.splice(this.availableProjects.indexOf(projectName), 1);
        return empty();
      })
    ).subscribe((res: {path: string}) => {
      this.isAngularProject = true;
      this.currentWorkingDir = res.path;
    });
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
    .subscribe((res: GetProjectsResponse) => {
      this.availableProjects = res.projects;
      this.currentWorkingDir = res.path;

      if (this.isServing) {
        this.stopServing();
      }
    });
  }

  stopServing(): void {
    this.isStoppingServeCommand = true;
    this.commandService.stopServing()
    .subscribe(
      () => {
        this.isServing = false;
        this.isStoppingServeCommand = false;
      },
      error => {
        this.errorService.addError({
          errorText: 'The "ng serve" command you\'re trying to stop was not found',
          errorDescription: 'The server is offline or have been restarted since you\'ve run this command'
        });
      }
    );
  }

  checkIfRunningServeCommand(): void {
    this.commandService.isServing().subscribe(isServing => {
      this.isServing = isServing;
      if (isServing) {
        this.isAngularProject = true;
        this.isReadyForWork = true;
      } else {
        this.checkAngularProject();
      }
    });
  }

  sendCommand(userCommand: string, commandType?: AngularCommandType): void {
    const request = new CommandRequest(userCommand);

    this.commandService.sendCommand(request).pipe(
      mergeMap(commandId => timer(0, this.COMMAND_STATUS_CHECK_INTERVAL).pipe(
          mergeMap(() => this.commandService.checkCommandStatus(commandId)),
          filter(response => response.status !== AngularCliProcessStatus.working),
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
    }
  }

  sendServeCommand(serveCommand: string): void {
    this.sendCommand(serveCommand, AngularCommandType.serve);
    this.isServing = true;
  }

  sendNewCommand(newCommand: string): void {
    this.sendCommand(newCommand, AngularCommandType.new);
  }
}
