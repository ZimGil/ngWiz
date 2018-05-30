import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent {

  name: string;
  @Input() rootFolder: string;

  isNameValid(): boolean {
    return !!this.name;
  }
  createNewProject(){
    const request = {
      name: this.name,
      rootFolder: this.rootFolder
    }
    console.log('request', request);
  }
}
