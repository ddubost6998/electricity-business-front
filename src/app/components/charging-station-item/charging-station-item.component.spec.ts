import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChargingStationItemComponent} from './charging-station-item.component';

describe('ChargingStationItemComponent', () => {
  let component: ChargingStationItemComponent;
  let fixture: ComponentFixture<ChargingStationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChargingStationItemComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChargingStationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
