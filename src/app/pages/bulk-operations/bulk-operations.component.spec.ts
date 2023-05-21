import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkOperationsComponent } from './bulk-operations.component';

describe('BulkOperationsComponent', () => {
  let component: BulkOperationsComponent;
  let fixture: ComponentFixture<BulkOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkOperationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
