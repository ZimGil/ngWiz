import { Component, Output, EventEmitter } from '@angular/core';
import { interval } from 'rxjs';

import { AngularCliCommand } from '../../models/angular-cli-command.interface';
import { NgNewOptions } from '../../default-values/ng-new-options';
import { CommandService } from '../../services/command/command.service';
import { CommandRequest } from '../../models/angular-command-request';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent {

  constructor(private commandService: CommandService) {}

  private readonly PROJECT_NAME_REGEX = /^[a-zA-Z][0-9a-zA-Z]*(?:-[a-zA-Z][0-9a-zA-Z]*)*$/;

  @Output() changeCommandStatus = new EventEmitter<boolean>();
  isCommandDone: boolean
  isAngularProject: boolean
  command: AngularCliCommand;
  options = new NgNewOptions();

  isNameValid(): boolean {
    const name = <string>this.options.mandatoryArgs.name;
    if (name) {
      return !!name.match(this.PROJECT_NAME_REGEX);
    }
    return false;
  }

  checkIfCommandDone(commandId: string): void {
    this.commandService.isCommandDone(commandId)
      .subscribe(response => {
        this.isCommandDone = !!response;
      });
  }

  checkAngularProject(): void {
    this.commandService.isAngularProject()
      .subscribe(response => this.isAngularProject = !!response);
  }

  createNewProject() {
    const requrst = new CommandRequest(this.options.createCommandString());
    this.commandService.sendCommand(requrst)
      .subscribe(commandId => {
        console.log('started generating new project, ID:', commandId);
        const timedStatusCheck = interval(1000)
        .subscribe(x => {
          if (this.isCommandDone) {
            console.log('done');
            this.changeCommandStatus.emit(this.isCommandDone);
            timedStatusCheck.unsubscribe();
          } else {
            this.checkIfCommandDone(commandId);
          }
        });
        this.checkAngularProject();
      });
  }
}
