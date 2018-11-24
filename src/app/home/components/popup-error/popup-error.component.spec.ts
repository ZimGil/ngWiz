import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupErrorComponent } from './popup-error.component';

describe('PopupErrorComponent', () => {
  let component: PopupErrorComponent;
  let fixture: ComponentFixture<PopupErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
