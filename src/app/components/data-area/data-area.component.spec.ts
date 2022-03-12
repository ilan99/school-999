import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAreaComponent } from './data-area.component';

describe('DataAreaComponent', () => {
  let component: DataAreaComponent;
  let fixture: ComponentFixture<DataAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
