import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChargingStationAddComponent} from './components/charging-station-add/charging-station-add.component';
import {ChargingStationEditComponent} from './components/charging-station-edit/charging-station-edit.component';


@NgModule({
  declarations: [
    ChargingStationAddComponent,
    ChargingStationEditComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ChargingStationsModule {
}
