import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router'; // Importez RouterModule
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [HeaderComponent, NotFoundComponent, LoadingSpinnerComponent],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [HeaderComponent, NotFoundComponent, LoadingSpinnerComponent],
})
export class SharedModule {
}
