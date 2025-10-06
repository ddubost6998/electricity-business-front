import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './features/auth/components/login/login.component';
import {ChargingStationsComponent} from "./charging-stations/charging-stations.component";
import {RegisterComponent} from './features/auth/components/register/register.component';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';
import {HomeComponent} from "./features/home/components/home/home.component";
import authGuard from "./core/guards/auth.guard";

const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'auth/login', component: LoginComponent},
    {path: 'auth/register', component: RegisterComponent},
    {path: 'charging-stations', component: ChargingStationsComponent, canActivate: [authGuard]},
    {path: 'not-found', component: NotFoundComponent},
    {path: '**', component: NotFoundComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})

export class AppRoutingModule {
}
