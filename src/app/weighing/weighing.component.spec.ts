import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeighingComponent } from './weighing.component';

describe('WeighingComponent', () => {
  let component: WeighingComponent;
  let fixture: ComponentFixture<WeighingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeighingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeighingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
