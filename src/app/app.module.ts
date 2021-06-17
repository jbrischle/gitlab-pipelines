import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';

@NgModule({
              declarations: [
                  AppComponent,
              ],
              imports:      [
                  BrowserModule,
                  BrowserAnimationsModule,
                  HttpClientModule,
                  FormsModule,
                  MatFormFieldModule,
                  MatInputModule,
                  MatButtonModule,
                  MatTableModule,
                  MatCardModule,
              ],
              providers:    [],
              bootstrap:    [AppComponent]
          })
export class AppModule {
}
