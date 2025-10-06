import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {AuthModule} from './features/auth/auth.module';
import {HomeModule} from './features/home/home.module';

import {ProfileComponent} from './features/user/components/profile/profile.component';
import {ReservationListComponent} from './features/reservation/components/reservation-list/reservation-list.component';
import {
    ReservationDetailsComponent
} from './features/reservation/components/reservation-details/reservation-details.component';
import {
    ReservationCreateComponent
} from './features/reservation/components/reservation-create/reservation-create.component';
import {FooterComponent} from "./shared/components/footer/footer.component";

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        ProfileComponent,
        ReservationListComponent,
        ReservationDetailsComponent,
        ReservationCreateComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        CoreModule,
        SharedModule,
        AuthModule,
        HomeModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            progressBar: true,
            closeButton: true,
        }),
        FooterComponent,
    ],
    providers: [],
})
export class AppModule {
}
