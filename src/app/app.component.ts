import { Component, OnInit } from '@angular/core';

import { CommandService } from './services/command/command.service';
import { CommandRequest } from './models/angular-command-request';
import { interval } from 'rxjs';

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
      });
  }

  commandStatusCheckingLoop(commandId: string): void {
    if (this.runningCommands[commandId]) {
      const status = this.runningCommands[commandId].status;

      if (status == 'done') {
        console.log('done');
        this.checkAngularProject();
        this.runningCommands[commandId] = null;
        this.subscription[commandId].unsubscribe();
        this.subscription[commandId] = null;
      } else if (status == 'error') {
        console.log('error')
        this.subscription[commandId].unsubscribe();
        this.subscription[commandId] = null;
      } else if (status == 'working') {
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
        .subscribe(() => this.commandStatusCheckingLoop(commandId));
    });
  }
}
