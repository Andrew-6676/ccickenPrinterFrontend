import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdFormComponent } from './prod-form.component';

describe('ProdFormComponent', () => {
  let component: ProdFormComponent;
  let fixture: ComponentFixture<ProdFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
