import { Subscription } from 'rxjs';

import { User } from '../_models';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '../_services';
import { HttpClient, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-view-bookings',
  templateUrl: './view-bookings.component.html',
  styleUrls: ['./view-bookings.component.css']
})
export class ViewBookingsComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;
  myBookings: any;
  deleteGamesList: any = [];
  loading = false;
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
    this.currentUser = user;
    });
    this.getMyBookings();
  }
  getMyBookings(){
    let params = new HttpParams().set('username',this.currentUser.userName);
    this.http.get<any>(`http://localhost:8080/myGame/viewMyBookings`, {params})
    .pipe(first())
    .subscribe(
        data => {
          this.myBookings =  Object.entries(data);
          if (data == null || data == "") {
            this.alertService.success('No Bookings available for you', false);
          }
        },
        error => {
          this.alertService.error('Something went wrong');
        });
  }
  ngOnInit(): void {
  }
  onDelete(id){
      this.loading = false;
      let params = new HttpParams().set('id',id);
      let formData: FormData =  new FormData();
      formData.append('id', id);
      this.http.delete(`http://localhost:8080/myGame/deleteBookings`, {params})
      .pipe(first())
      .subscribe(
          data => { 
            this.loading = false;
            this.getMyBookings();
          },
          error => {
            this.loading = false;
          });
  }
}
