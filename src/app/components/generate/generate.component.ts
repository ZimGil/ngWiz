import { Component, Input } from '@angular/core';

import { AngularClass } from '../../models/angular-class.enum';
import { AngularClassOptions } from '../../models/angular-class-options.interface';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent {

  name = 'Name';
  @Input() rootFolder: string;
  type = AngularClass.Component;
  optionalTypes: AngularClassOptions[] = [
    {id: AngularClass.Component, displayName: 'Component'},
    {id: AngularClass.Service, displayName: 'Service'}
  ];

  generateAngularClass(): void {
    const request = {
      name: this.name,
      type: +this.type,
      rootFolder: this.rootFolder
    }

    console.log('request', request);
  }
}
