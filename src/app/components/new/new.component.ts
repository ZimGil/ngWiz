import { Component, Output, EventEmitter } from '@angular/core';

import { AngularCliCommand } from "../../models/angular-cli-command.interface";
import { NgNewOptions } from '../../default-values/ng-new-options';
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent {

  @Output() sendCommand = new EventEmitter<string>();
  command: AngularCliCommand;
  options = new NgNewOptions();

  isNameValid(): boolean {
    return !!this.options.mandatoryArgs.name;
  }
  createNewProject(){
    this.sendCommand.emit(this.options.createCommandString());
  }
}
