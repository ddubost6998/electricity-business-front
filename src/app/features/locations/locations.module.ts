import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocationListComponent} from './components/location-list/location-list.component';
import {LocationAddComponent} from './components/location-add/location-add.component';
import {LocationEditComponent} from './components/location-edit/location-edit.component';
import {LocationDetailsComponent} from './components/location-details/location-details.component';


@NgModule({
  declarations: [
    LocationListComponent,
    LocationAddComponent,
    LocationEditComponent,
    LocationDetailsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class LocationsModule {
}
