import { Component } from '@angular/core';

@Component({
  selector: 'app-serve',
  templateUrl: './serve.component.html',
  styleUrls: ['./serve.component.css']
})
export class ServeComponent {

  private readonly MINIMUM_PORT = 1000;
  private readonly MAXIMUM_PORT = 99999;

  rootFolder = "C:\\Development";
  hostname = "localhost";
  port = 4200;
  isOpen = true;

  runServer(): void {
    const request = {
      hostname: this.hostname,
      port: this.port,
      isOpen: this.isOpen,
      rootFolder: this.rootFolder
    }
    console.log('request: ', request);
  }

  isPortValid(): boolean {
    return this.port >= this.MINIMUM_PORT && this.port <= this.MAXIMUM_PORT;
  }

  isHostnameValid(): boolean {
    return !!this.hostname;
  }

  isAllInputsValid(): boolean {
    return this.isHostnameValid() && this.isPortValid();
  }

}
