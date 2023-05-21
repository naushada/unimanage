import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FwupdateComponent } from './fwupdate.component';

describe('FwupdateComponent', () => {
  let component: FwupdateComponent;
  let fixture: ComponentFixture<FwupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FwupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FwupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
