import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpmChartComponent } from './ppm-chart.component';

describe('PpmChartComponent', () => {
  let component: PpmChartComponent;
  let fixture: ComponentFixture<PpmChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpmChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpmChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
