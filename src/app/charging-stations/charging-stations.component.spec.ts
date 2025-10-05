import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargingStationsComponent } from './charging-stations.component';

describe('ChargingStationsComponent', () => {
  let component: ChargingStationsComponent;
  let fixture: ComponentFixture<ChargingStationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChargingStationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChargingStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
