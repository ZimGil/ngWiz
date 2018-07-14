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
  areRunningCommandsDone = {};

  constructor(private commandService: CommandService) {}

  ngOnInit() {
    this.checkAngularProject();
  }

  checkAngularProject(): void {
    this.commandService.isAngularProject()
      .subscribe(response => this.isAngularProject = !!response);
  }

  checkIfCommandDone(commandId: string): void {
    this.commandService.isCommandDone(commandId)
      .subscribe(response => {
        this.areRunningCommandsDone[commandId] = !!response;
      });
  }

  sendCommand(userCommand: string): void {
    const request = new CommandRequest(userCommand);
    this.commandService.sendCommand(request)
    .subscribe(commandId => {
      console.log('started working on command, ID:', commandId);
      const timedStatusCheck = interval(1000)
      .subscribe(x => {
        if (this.areRunningCommandsDone[commandId]) {
          console.log('done');
          timedStatusCheck.unsubscribe();
        } else {
          this.checkIfCommandDone(commandId);
        }
      });
      this.checkAngularProject();
    });
  }

  changeAngularProjectStatus(): void {
    this.checkAngularProject();
  }
}
