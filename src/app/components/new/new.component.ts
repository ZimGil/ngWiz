import { Component } from '@angular/core';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent {
  name: string;

  isNameValid(): boolean {
    return !!this.name;
  }
  createNewProject(){
    const request = {
      name: this.name
    }
    console.log('request', request);
  }
}
