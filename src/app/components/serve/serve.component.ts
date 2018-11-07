import { Component, Output, EventEmitter, Input } from '@angular/core';

import { AngularCliCommand } from '../../models/angular-cli-command.interface';
import { NgserveOptions } from '../../default-values/ng-serve-options';
import { CommandService } from './../../services/command/command.service';

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

  constructor(private commandService: CommandService) {}

  startServing(): void {
    this.sendCommand.emit(this.options.createCommandString());
  }

  stopServing(): void {
    this.commandService.stopServing(this.serveCommandId)
    .subscribe(() => {
      this.serveCommandId = null;
    });
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
