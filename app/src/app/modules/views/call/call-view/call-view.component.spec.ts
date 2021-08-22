import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallViewComponent } from './call-view.component';

describe('CallViewComponent', () => {
  let component: CallViewComponent;
  let fixture: ComponentFixture<CallViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
