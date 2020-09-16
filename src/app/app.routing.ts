import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { ViewBookingsComponent } from './view-bookings/view-bookings.component';
import { BookGameComponent } from './book-game/book-game.component';
import { AuthGuard } from './_helpers';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'bookGame', component: BookGameComponent },
    { path: 'myBookings', component: ViewBookingsComponent },
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);