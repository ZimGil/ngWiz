import { Component } from '@angular/core';
import { PopUpError } from './../../models/pop-up-error.interface';
import { ErrorService } from './../../services/error/error.service';

@Component({
  selector: 'app-popup-error',
  templateUrl: './popup-error.component.html',
  styleUrls: ['./popup-error.component.css']
})
export class PopupErrorComponent {

  constructor(private errorService: ErrorService) {}

  isErrors(): boolean {
    return this.errorService.isErrors();
  }

  getErrors(): PopUpError[] {
    return this.errorService.getErrors();
  }

  handleError(error: PopUpError) {
    this.errorService.handleError(error);
  }

  clearError(error: PopUpError) {
    this.errorService.clearError(error);
  }
}
