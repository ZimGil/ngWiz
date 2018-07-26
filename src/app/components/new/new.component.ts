import { Component, Output, EventEmitter } from '@angular/core';

import { AngularCliCommand } from '../../models/angular-cli-command.interface';
import { NgNewOptions } from '../../default-values/ng-new-options';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent {

  private readonly PROJECT_NAME_REGEX = /^[a-zA-Z][0-9a-zA-Z]*(?:-[a-zA-Z][0-9a-zA-Z]*)*$/;

  @Output() sendCommand = new EventEmitter<string>();
  command: AngularCliCommand;
  options = new NgNewOptions();

  isNameValid(): boolean {
    const name = <string>this.options.mandatoryArgs.name;

    if (name) {
      return !!name.match(this.PROJECT_NAME_REGEX);
    }
    return false;
  }

  createNewProject() {
    this.sendCommand.emit(this.options.createCommandString());
  }
}
