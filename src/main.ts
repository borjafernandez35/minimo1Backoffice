import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Importa HttpClientModule

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Proveedor de rutas
    importProvidersFrom(BrowserModule, RouterModule, HttpClientModule), provideAnimationsAsync() // Importa HttpClientModule
  ]
}).catch((err) => console.error(err));





