import { Component, Output, EventEmitter } from '@angular/core';
import { AngularCliCommand } from '../../models/angular-cli-command.interface';

@Component({
  selector: 'app-serve',
  templateUrl: './serve.component.html',
  styleUrls: ['./serve.component.css']
})
export class ServeComponent {

  private readonly MINIMUM_PORT = 1000;
  private readonly MAXIMUM_PORT = 99999;

  @Output() sendCommand = new EventEmitter<AngularCliCommand>();
  command: AngularCliCommand;
  hostname = "localhost";
  port = 4200;
  isOpen = true;

  runServer(): void {
    this.command = {
      name: 'serve',
      params: [
        {hostname: this.hostname},
        {port: this.port},
        {isOpen: this.isOpen}
      ]
    }
    this.sendCommand.emit(this.command);
  }

  isPortValid(): boolean {
    return this.port >= this.MINIMUM_PORT && this.port <= this.MAXIMUM_PORT;
  }

  isHostnameValid(): boolean {
    return !!this.hostname;
  }

  isAllInputsValid(): boolean {
    return this.isHostnameValid() && this.isPortValid();
  }

}
