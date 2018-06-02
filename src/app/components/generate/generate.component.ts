import { Component, Output, EventEmitter, OnInit } from '@angular/core';

import { AngularClass } from '../../models/angular-class.enum';
import { AngularClassOptions } from '../../models/angular-class-options.interface';
import { AngularCliCommand } from '../../models/angular-cli-command.interface';
import { NgOptions } from './../../models/angular-options';
import { AngularCommandOptions } from '../../models/angular-command-options.interface';
import { NgGenerateComponentOptions } from '../../default-values/ng-generate-component-options';
import { NgGenerateServiceOptions } from '../../default-values/ng-generate-service-options';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent implements OnInit {

  @Output() sendCommand = new EventEmitter<string>();

  command: AngularCliCommand;
  options: NgOptions;
  previousName: string;

  optionalTypes: AngularClassOptions[] = [
    {id: AngularClass.component, displayName: 'Component'},
    {id: AngularClass.service, displayName: 'Service'}
  ];
  angularClass = AngularClass;

  ngOnInit() {
    this.options = new NgGenerateComponentOptions();
  }

  generateAngularClass(): void {
    this.sendCommand.emit(this.options.createCommandString());
  }

  changeType(type: AngularClass): void {
    this.previousName = <string>this.options.mandatoryArgs.name;
    this.options = this.NgOptionsFactory(type);
  }

  NgOptionsFactory(type: AngularClass): NgOptions {
    switch (+type) {
      case AngularClass.component:
        return new NgGenerateComponentOptions(this.previousName);
      case AngularClass.service:
        return new NgGenerateServiceOptions(this.previousName);
    }
  }
}
