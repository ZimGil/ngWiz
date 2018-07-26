import { Component, OnInit } from '@angular/core';

import { interval } from 'rxjs';

import { CommandService } from './services/command/command.service';
import { CommandRequest } from './models/angular-command-request';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Angular CLI to UI';
  isAngularProject: boolean;
  runningCommands = {};
  timedStatusCheck = interval(1000);
  subscription = {};

  constructor(private commandService: CommandService) {}

  ngOnInit() {
    this.checkAngularProject();
  }

  checkAngularProject(): void {
    this.commandService.isAngularProject()
      .subscribe(response => this.isAngularProject = !!response);
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
    console.log('done');
    this.checkAngularProject();
    this.runningCommands[commandId] = null;
  }

  startCheckingCommand(commandId: string): void {
    if (this.runningCommands[commandId]) {
      const status = this.runningCommands[commandId].status;

      if (status === 'done') {
        this.doneCheckingCommand(commandId);
        this.commandDone(commandId);
      } else if (status === 'error') {
        this.doneCheckingCommand(commandId);
        console.log('error');
      } else if (status === 'working') {
        console.log('working');
        this.checkCommandStatus(commandId);
      }
    } else {
      this.checkCommandStatus(commandId);
    }
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
