import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//
import { Observable } from 'rxjs';
//
import { CommandRequest } from '../../models/angular-command-request';
import { CommandStatusResponse } from '../../models/command-status-response.interface';


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

  getProjects() {
    return this.http.get(`${this.BASE_URL}:${this.PORT}/projects`);
  }

  checkCommandStatus(commandId: string): Observable<CommandStatusResponse> {
    return this.http.get<CommandStatusResponse>(`${this.BASE_URL}:${this.PORT}/status?id=${commandId}`);
  }

  chooseProject(projectName: string) {
    return this.http.get(`${this.BASE_URL}:${this.PORT}/chooseProject?name=${projectName}`);
  }

  keepAlive() {
    return this.http.get(`${this.BASE_URL}:${this.PORT}/keepAlive`);
  }

  stopServing() {
    return this.http.get(`${this.BASE_URL}:${this.PORT}/stopServing`);
  }

  isServing(): Observable<boolean> {
    return this.http.get<boolean>(`${this.BASE_URL}:${this.PORT}/isServing`);
  }

  leaveProject() {
    return this.http.get(`${this.BASE_URL}:${this.PORT}/leaveProject`);
  }

  sendCommand(command: CommandRequest) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.BASE_URL}:${this.PORT}/command`, command, {headers: headers, responseType: 'text'});
  }
}
