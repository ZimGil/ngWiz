import { Component, Output, EventEmitter } from '@angular/core';

import { AngularCliCommand } from '../../models/angular-cli-command.interface';
import { NgserveOptions } from '../../default-values/ng-serve-options';

@Component({
  selector: 'app-serve',
  templateUrl: './serve.component.html',
  styleUrls: ['./serve.component.css']
})
export class ServeComponent {

  private readonly MINIMUM_PORT = 1000;
  private readonly MAXIMUM_PORT = 99999;

  @Output() sendCommand = new EventEmitter<string>();
  command: AngularCliCommand;
  options = new NgserveOptions();

  runServer(): void {
    this.sendCommand.emit(this.options.createCommandString());
  }

  isPortValid(): boolean {
    const port = this.options.optionalFlags.port.params;
    return port >= this.MINIMUM_PORT && port <= this.MAXIMUM_PORT;
  }

  isHostnameValid(): boolean {
    return !!this.options.optionalFlags.host.params;
  }

  isAllInputsValid(): boolean {
    return this.isHostnameValid() && this.isPortValid();
  }

}
