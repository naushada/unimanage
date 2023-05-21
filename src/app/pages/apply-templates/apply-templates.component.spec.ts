import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyTemplatesComponent } from './apply-templates.component';

describe('ApplyTemplatesComponent', () => {
  let component: ApplyTemplatesComponent;
  let fixture: ComponentFixture<ApplyTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyTemplatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
