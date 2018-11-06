import { Component, OnInit } from '@angular/core';

import { interval } from 'rxjs';

import { CommandService } from './services/command/command.service';
import { CommandRequest } from './models/angular-command-request';
import { AngularCliProcessStatus } from './models/angular-cli-process-status.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Angular CLI to UI';
  isAngularProject: boolean;
  isReadyForWork = false;
  runningCommands = {};
  timedStatusCheck = interval(1000);
  subscription = {};
  isAlive = true;
  isProjectLeavable = true;

  constructor(private commandService: CommandService) {}

  ngOnInit() {
    this.keepAlive();
    this.checkAngularProject();
  }

  checkAngularProject(): void {
    this.isReadyForWork = false;
    this.commandService.isAngularProject()
      .subscribe(response => {
        this.isAngularProject = !!response;
        this.isReadyForWork = true;
      });
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

  commandDone(commandId: string): void {
    this.checkAngularProject();
    this.runningCommands[commandId] = null;
  }

  startCheckingCommand(commandId: string): void {
    if (this.runningCommands[commandId]) {
      const status = this.runningCommands[commandId].status;

      if (status === AngularCliProcessStatus.done) {
        this.doneCheckingCommand(commandId);
        this.commandDone(commandId);
      } else if (status === AngularCliProcessStatus.error) {
        this.doneCheckingCommand(commandId);
      } else if (status === AngularCliProcessStatus.working) {
        this.checkCommandStatus(commandId);
      }
    } else {
      this.checkCommandStatus(commandId);
    }
  }

  keepAlive(): void {
    this.subscription['keepAlive'] = this.timedStatusCheck
      .subscribe(() => {
        this.commandService.keepAlive()
          .subscribe( response => {
            this.isAlive = true;
          }, error => {
            this.isAlive = false;
            this.subscription['keepAlive'].unsubscribe();
          });
      });
    }

  leaveProject(): void {
    this.commandService.leaveProject()
      .subscribe(
        () => this.checkAngularProject(),
        () => this.isProjectLeavable = false
      );
  }

  sendCommand(userCommand: string): void {
    const request = new CommandRequest(userCommand);
    this.commandService.sendCommand(request)
    .subscribe(commandId => {
      console.log('started working on command, ID:', commandId);
      this.subscription[commandId] = this.timedStatusCheck
        .subscribe(() => this.startCheckingCommand(commandId));
    });
  }

}
