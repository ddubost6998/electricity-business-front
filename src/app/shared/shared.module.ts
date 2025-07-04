import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {HeaderComponent} from './components/header/header.component';
import {RouterModule} from '@angular/router';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {LoadingSpinnerComponent} from './components/loading-spinner/loading-spinner.component';
import {FooterComponent} from './components/footer/footer.component';
import {AddressFormComponent} from './components/address-form/address-form.component';
import {LocationFormComponent} from './components/location-form/location-form.component';
import {
  ReservationConfirmationDialogComponent
} from './components/reservation-confirmation-dialog/reservation-confirmation-dialog.component';
import {ReservationItemComponent} from './components/reservation-item/reservation-item.component';
import {MapDisplayComponent} from './components/map-display/map-display.component';

@NgModule({
  declarations: [HeaderComponent, NotFoundComponent, LoadingSpinnerComponent, FooterComponent, AddressFormComponent, LocationFormComponent, ReservationConfirmationDialogComponent, ReservationItemComponent, MapDisplayComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
  ],
  exports: [HeaderComponent, NotFoundComponent, LoadingSpinnerComponent],
})

export class SharedModule {
}
