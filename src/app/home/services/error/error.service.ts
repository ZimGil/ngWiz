import { Injectable } from '@angular/core';
import { PopUpError } from '../../models/pop-up-error.interface';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private errors: PopUpError[] = [];

  addError(error: PopUpError): void {
    this.errors.push(error);
  }

  getErrors(): PopUpError[] {
    return this.errors;
  }

  clearError(error: PopUpError): void {
    this.errors.splice(this.errors.indexOf(error), 1);
  }

  isErrors(): boolean {
    return !!this.errors.length;
  }

  handleError(error: PopUpError): void {
    if (error.handleFunction && typeof error.handleFunction === 'function') {
      error.handleFunction.call(error.callingScope);
    }
    this.clearError(error);
  }
}
