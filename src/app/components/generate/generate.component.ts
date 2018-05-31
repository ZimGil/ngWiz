import { Component, Output, EventEmitter } from '@angular/core';

import { AngularClass } from '../../models/angular-class.enum';
import { AngularClassOptions } from '../../models/angular-class-options.interface';
import { AngularCliCommand } from '../../models/angular-cli-command.interface'

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent {

  @Output() sendCommand = new EventEmitter<AngularCliCommand>();
  command: AngularCliCommand;
  name = 'Name';
  type = AngularClass.Component;
  optionalTypes: AngularClassOptions[] = [
    {id: AngularClass.Component, displayName: 'Component'},
    {id: AngularClass.Service, displayName: 'Service'}
  ];

  generateAngularClass(): void {
    this.command = {
      name: 'generate',
      params: [
        {name: this.name},
        {type: +this.type},
      ]
    }

    this.sendCommand.emit(this.command);
  }
}
