import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CommandRequest } from '../../models/angular-command-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  private readonly BASE_URL = 'http://localhost';
  private readonly PORT = 3000;

  constructor(private http: HttpClient) { }

  isAngularProject() {
    return this.http.get(`${this.BASE_URL}:${this.PORT}/isAngularProject`);  
  }

  sendCommand(command: CommandRequest) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.BASE_URL}:${this.PORT}/command`, command, {headers: headers, responseType: 'text'});
  }
}
