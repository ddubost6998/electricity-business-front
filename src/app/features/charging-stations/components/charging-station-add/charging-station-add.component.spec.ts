import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargingStationAddComponent } from './charging-station-add.component';

describe('ChargingStationAddComponent', () => {
  let component: ChargingStationAddComponent;
  let fixture: ComponentFixture<ChargingStationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChargingStationAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChargingStationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
