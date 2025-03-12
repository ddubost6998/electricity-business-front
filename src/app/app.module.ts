import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './features/auth/auth.module';
import { HomeModule } from './features/home/home.module';
import { ProfileComponent } from './features/user/components/profile/profile.component';
import { ChargingStationItemComponent } from './components/charging-station-item/charging-station-item.component';
import { ReservationListComponent } from './features/reservation/components/reservation-list/reservation-list.component';
import { ReservationDetailsComponent } from './features/reservation/components/reservation-details/reservation-details.component';
import { ReservationCreateComponent } from './features/reservation/components/reservation-create/reservation-create.component';

@NgModule({
  declarations: [AppComponent, ProfileComponent, ChargingStationItemComponent, ReservationListComponent, ReservationDetailsComponent, ReservationCreateComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    AuthModule,
    HomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})

export class AppModule {
}
