import { Component, Output, EventEmitter, Input } from '@angular/core';

import { AngularCliCommand } from '../../models/angular-cli-command.interface';
import { NgserveOptions } from '../../default-values/ng-serve-options';
import { CommandService } from './../../services/command/command.service';
import { ErrorService } from './../../services/error/error.service';

@Component({
  selector: 'app-serve',
  templateUrl: './serve.component.html',
  styleUrls: ['./serve.component.css']
})
export class ServeComponent {

  private readonly MINIMUM_PORT = 1000;
  private readonly MAXIMUM_PORT = 99999;

  @Output() sendCommand = new EventEmitter<string>();
  @Input() serveCommandId: string;
  command: AngularCliCommand;
  options = new NgserveOptions();

  constructor(
    private commandService: CommandService,
    private errorService: ErrorService
    ) {}

  startServing(): void {
    this.sendCommand.emit(this.options.createCommandString());
  }

  stopServing(): void {
    this.commandService.stopServing(this.serveCommandId)
    .subscribe(() => {},
    error => {
      this.errorService.addError({
        errorText: 'The "ng serve" command you\'re trying to stop was not found',
        errorDescription: 'The server is offline or have been restarted since you\'ve run this command'
      });
    });
    this.serveCommandId = null;
    localStorage.removeItem('ngServe');
  }

  isPortValid(): boolean {
    const port = this.options.optionalFlags.port.value;
    return port >= this.MINIMUM_PORT && port <= this.MAXIMUM_PORT;
  }

  isHostnameValid(): boolean {
    return !!this.options.optionalFlags.host.value;
  }

  isAllInputsValid(): boolean {
    return this.isHostnameValid() && this.isPortValid();
  }

}
