import { Component, Output, EventEmitter, OnInit } from '@angular/core';

import { AngularClass } from '../../models/angular-class.enum';
import { AngularClassOptions } from '../../models/angular-class-options.interface';
import { AngularCliCommand } from '../../models/angular-cli-command.interface';
import { NgOptions } from '../../models/angular-options';
import { NgGenerateComponentOptions } from '../../default-values/ng-generate-component-options';
import { NgGenerateServiceOptions } from '../../default-values/ng-generate-service-options';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent implements OnInit {

  @Output() sendCommand = new EventEmitter<string>();

  private readonly HTML_SELECTOR_REGEX = /^[a-zA-Z][0-9a-zA-Z]*(?:-[a-zA-Z][0-9a-zA-Z]*)*$/;

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
    this.options = this.ngOptionsFactory(type);
  }

  ngOptionsFactory(type: AngularClass): NgOptions {
    switch (+type) {
      case AngularClass.component:
        return new NgGenerateComponentOptions(this.previousName);
      case AngularClass.service:
        return new NgGenerateServiceOptions(this.previousName);
    }
  }

  isNameValid(): boolean {
    const name = <string>this.options.mandatoryArgs.name;
    if (name) {
      return !!name.match(this.HTML_SELECTOR_REGEX);
    }
    return false;
  }
}
