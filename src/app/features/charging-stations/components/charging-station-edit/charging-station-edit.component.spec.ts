import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargingStationEditComponent } from './charging-station-edit.component';

describe('ChargingStationEditComponent', () => {
  let component: ChargingStationEditComponent;
  let fixture: ComponentFixture<ChargingStationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChargingStationEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChargingStationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
