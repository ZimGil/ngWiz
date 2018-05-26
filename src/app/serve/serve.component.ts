import { Component } from '@angular/core';
import { timeout } from 'q';

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
  isForwardslash = false;

  runServer(): void {
    this.forwardSlashToBackslash();
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

  isRootFolderValid(): boolean {
    if (this.isFirstCharLetter() && this.rootFolder[1] == ":" && this.isBackslash()) {
      return true;
    }
    return false;
  }

  isFirstCharLetter(): boolean {
    return ((this.rootFolder[0] >= 'a' && this.rootFolder[0] <= 'z') || (this.rootFolder[0] >= 'A' && this.rootFolder[0] <= 'Z'));
  }

  isBackslash(): boolean {
    if ((this.rootFolder[2] == "/") || (this.rootFolder[2] == "\\")) {
      return true;
    }
    return false;
  }

  forwardSlashToBackslash() {
    this.rootFolder = this.rootFolder.replace(/\//g,"\\");
  }

  isAllInputsValid(): boolean {
    return this.isHostnameValid() && this.isPortValid() && this.isRootFolderValid();
  }

}
