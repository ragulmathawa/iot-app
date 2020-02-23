import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableExpandableDevicesComponent } from './table-expandable-devices.component';

describe('TableExpandableDevicesComponent', () => {
  let component: TableExpandableDevicesComponent;
  let fixture: ComponentFixture<TableExpandableDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableExpandableDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableExpandableDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
