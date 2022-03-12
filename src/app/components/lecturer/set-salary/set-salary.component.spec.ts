import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetSalaryComponent } from './set-salary.component';

describe('SetSalaryComponent', () => {
  let component: SetSalaryComponent;
  let fixture: ComponentFixture<SetSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetSalaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
