import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http"

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppStoreModule } from './app-store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@modules/shared/shared.module';
import { Pictures, PicturesService } from './services/pictures.service';
import { SessionManagerModule } from '@modules/session-manager';
import { DatabaseModule } from '@modules/database/database.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    AppStoreModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SessionManagerModule,
    SharedModule,
    DatabaseModule
    
  ],
  providers: [
    {
      provide: Pictures,
      deps: [ PicturesService ],
      useFactory: ( service: PicturesService ) => service.$
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
