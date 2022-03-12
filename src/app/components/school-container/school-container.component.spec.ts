import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolContainerComponent } from './school-container.component';

describe('SchoolContainerComponent', () => {
  let component: SchoolContainerComponent;
  let fixture: ComponentFixture<SchoolContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
