import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { appRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { AlertComponent } from './_components';
import { ViewBookingsComponent } from './view-bookings/view-bookings.component';
import { BookGameComponent } from './book-game/book-game.component';


@NgModule({
    imports: [
        BrowserModule, 
        FormsModule ,
        ReactiveFormsModule,
        HttpClientModule,
        appRoutingModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        AlertComponent,
        ViewBookingsComponent,
        BookGameComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };