import { Component, Output, EventEmitter } from '@angular/core';

import { AngularCliCommand } from "../../models/angular-cli-command.interface";
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent {

  @Output() sendCommand = new EventEmitter<AngularCliCommand>();
  command: AngularCliCommand;
  name: string;

  isNameValid(): boolean {
    return !!this.name;
  }
  createNewProject(){
    this.command = {
      name: 'new',
      params: [
        {name: this.name}
      ]
    }
    this.sendCommand.emit(this.command);
  }
}
