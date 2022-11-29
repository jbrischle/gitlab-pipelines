import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
              declarations: [
                  AppComponent
              ],
              imports:      [
                  BrowserModule,
                  BrowserAnimationsModule,
                  HttpClientModule,
                  MatCardModule,
                  MatTableModule,
                  MatSortModule,
                  MatRadioModule,
                  MatFormFieldModule,
                  FormsModule,
                  MatInputModule,
                  MatButtonModule,
                  MatDividerModule,
                  MatIconModule
              ],
              providers:    [],
              bootstrap:    [AppComponent]
          })
export class AppModule {
}
