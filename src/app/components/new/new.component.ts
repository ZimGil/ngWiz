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

  @Output() sendCommand = new EventEmitter<string>();
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

  checkIfCommandDone(commandId: string): boolean {
    console.log('is command done (in function)', this.isAngularProject);
    this.commandService.isCommandDone(commandId)
      .subscribe(response => {
        if (response == 'working') {
          return false;
        } else if (response == 'done') {
          return true;
        }
      });
    return false;
  }

  checkAngularProject(): void {
    this.commandService.isAngularProject()
      .subscribe(response => this.isAngularProject = !!response);
  }

  createNewProject() {
    let isCommandDone = false;
    const requrst = new CommandRequest(this.options.createCommandString());
    this.commandService.sendCommand(requrst)
      .subscribe(commandId => {
        console.log(`response`, commandId);
          interval(1000).subscribe(x => {
            console.log('is command done (in while)', isCommandDone);
            isCommandDone = this.checkIfCommandDone(commandId);
          });
        console.log('outof while');
        this.checkAngularProject();
      });
    // this.sendCommand.emit(this.options.createCommandString());
  }
}
