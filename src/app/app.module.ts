import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { UiModule } from './ui/ui.module';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CdsModule } from '@cds/angular';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    UiModule,
    ReactiveFormsModule,
    HttpClientModule,
    CdsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
