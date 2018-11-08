import { Injectable } from '@angular/core';
import { PopUpError } from './../../models/pop-up-error.interface';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  errors: PopUpError[] = [];

  addError(error: string) {
    this.errors.push({errorText: error})
  }
  
  addErrorWithOption(
    error: string,
    handleFunction: Function,
    callingObject: Object): void {

      this.errors.push({errorText: error,
        handleFunction: handleFunction,
        callingObject: callingObject});
  }

  getErrors(): PopUpError[] {
    return this.errors;
  }

  clearError(error: PopUpError): void {
    this.errors.splice(this.errors.indexOf(error),1);
  }

  isErrors(): boolean {
    return this.errors === [] ? false : true;
  }

  handleError(error: PopUpError): void {
    error.handleFunction.call(error.callingObject);
    this.clearError(error);
  }
}
