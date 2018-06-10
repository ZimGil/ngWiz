import { Component } from '@angular/core';

import { AngularCliCommand } from './models/angular-cli-command.interface';
import { CommandService } from './command.service';
import { CommandRequest } from './models/angular-command-request';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular CLI to UI';
  rootFolder = "C:\\";

  constructor(private commandService: CommandService) {}

  sendCommand(userCommand: string): void {
    const request = new CommandRequest(userCommand, this.rootFolder);
    this.commandService.sendCommand(request)
      .subscribe((response) => console.log('response', response));
  }
}
