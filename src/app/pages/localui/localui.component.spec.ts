import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocaluiComponent } from './localui.component';

describe('LocaluiComponent', () => {
  let component: LocaluiComponent;
  let fixture: ComponentFixture<LocaluiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocaluiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocaluiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
