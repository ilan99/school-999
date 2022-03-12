import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetGradeComponent } from './set-grade.component';

describe('SetGradeComponent', () => {
  let component: SetGradeComponent;
  let fixture: ComponentFixture<SetGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetGradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
