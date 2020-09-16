import { Subscription } from 'rxjs';
import { User } from '../_models';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit{
    currentUser: User;
    currentUserSubscription: Subscription;
    ngOnInit() {}
    constructor(
      private router: Router,
      private authenticationService: AuthenticationService
    ) { 
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }
}