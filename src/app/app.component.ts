import { Component } from '@angular/core';

import { AngularCliCommand } from './models/angular-cli-command.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular CLI to UI';
  rootFolder = "C:\\Development";

  sendCommand(userCommand: AngularCliCommand): void {
    const request = {
      rootFolder: this.rootFolder,
      command: userCommand
    }
    console.log('request', request);
  }
}
