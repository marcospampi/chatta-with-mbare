import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadmeViewComponent } from './readme-view.component';

describe('ReadmeComponent', () => {
  let component: ReadmeViewComponent;
  let fixture: ComponentFixture<ReadmeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadmeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadmeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
