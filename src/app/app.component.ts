import { Component, OnInit } from '@angular/core';

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
  isCommandDone = false;

  constructor(private commandService: CommandService) {}

  ngOnInit() {
    this.checkAngularProject();
  }

  checkAngularProject(): void {
    this.commandService.isAngularProject()
      .subscribe(response => this.isAngularProject = !!response);
  }

  sendCommand(userCommand: string): void {
    const request = new CommandRequest(userCommand);
    this.commandService.sendCommand(request)
      .subscribe(response => {
        console.log('response', response);
      });
  }

  changeCommandStatus(status: boolean): void {
    this.isCommandDone = status;
    this.checkAngularProject();
  }
}
