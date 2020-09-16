import { Subscription } from 'rxjs';
import { User } from '../_models';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../_services';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-book-game',
  templateUrl: './book-game.component.html',
  styleUrls: ['./book-game.component.css'],
  providers: [DatePipe]
})
export class BookGameComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;
  bookingForm: FormGroup;
  loading = false;
  submitted = false;
  currentBookingResults: any;
  systemDate = new Date();
  today: string;
  oneWeek: string;
  updatedDate: string;
  getLoading = false;
  locationList = ["Hyderabd", "Pune", "Bangalore"];
  games = ["Carroms", "TT"];
  
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
    this.currentUser = user;
    });
    this.today = this.datePipe.transform(this.systemDate, 'yyyy-MM-dd');
    this.oneWeek = this.datePipe.transform(this.systemDate.setDate(this.systemDate.getDate() + 7), 'yyyy-MM-dd');
  }

  ngOnInit() { 
    this.bookingForm = this.formBuilder.group({
        location: ['', [Validators.required]],
        game: ['', [Validators.required]],
        date: ['', [Validators.required]],
        startTime: ['', [Validators.required]],
        endTime: ['', [Validators.required]]
    });
    
        /*bufferStartTime: ['', []],
        bufferEndTime: ['', []]*/
  }

  get location() {
    return this.bookingForm.get('location');
  }
  get game() {
      return this.bookingForm.get('game');
  }
  get date() {
    return this.bookingForm.get('date');
  }
  get startTime() {
    return this.bookingForm.get('startTime');
  }
  get endTime() {
    return this.bookingForm.get('endTime');
  }
  /*get bufferStartTime() {
    return this.bookingForm.get('bufferStartTime');
  }
  get bufferEndTime() {
    return this.bookingForm.get('bufferEndTime');
  }*/

  get f() { return this.bookingForm.controls; }
  onLocationChange( target ) {
    this.viewCurrentBookings();
  }
  onGameChange( target ) {
    this.viewCurrentBookings();
  }
  onDateChange( target ) {
    this.updatedDate = target;
    this.viewCurrentBookings();
  }
  onStartTimeChange( target: string) {
    this.timeValidation("Start Time", target, this.bookingForm.get('endTime').value, 1);
  }
  onEndTimeChange( target: string ) {
    this.timeValidation("End Time", this.bookingForm.get('startTime').value, target, 1)
  }
  /*onBufferStartTimeChange( target: string ) {
    this.timeValidation("Buffer Start Time", target, this.bookingForm.get('bufferEndTime').value, 1);
  }
  onBufferEndTimeChange( target: string ) {
    this.timeValidation("Buffer End Time", this.bookingForm.get('bufferStartTime').value ,target, 1);
  }*/
  
  timeValidation(message: string, startTime:string, endTime: string, maxAllowedTime: number){
    let date = (this.updatedDate == "" || this.updatedDate == null) ? this.today : this.updatedDate;
    let currentTime = this.datePipe.transform(date, 'HH:mm');
    if (startTime != null && startTime != "" && startTime <= currentTime){
      this.alertService.error('Start must be greater than current system time.');
      return true;
    }
    else if (endTime != null && endTime != "" && endTime <= currentTime){
      this.alertService.error('End must be greater than current system time.');
      return true;
    }
    else if ((startTime != null && startTime != "" && endTime != null && endTime != "") && 
              startTime >= endTime){
      this.alertService.error('End Time must be greater than Start Time.');
      return true;
    }
    else{
      this.alertService.clear();
      return this.maxBookingTimeValidation(startTime, endTime, 1);
    }
  }

  maxBookingTimeValidation(startTime: string, endTime: string, maxAllowedTime: number) {
    let date = (this.updatedDate == "" || this.updatedDate == null) ? this.today : this.updatedDate;
    var tempStartHours = new Date(date+ " " + startTime).getHours();
    var tempStartMins = new Date(date+ " " + startTime).getMinutes();
    var tempEndHours = new Date(date+ " " + endTime).getHours();
    var tempEndMins = new Date(date+ " " + endTime).getMinutes();
    var difference = (tempEndHours*60+tempEndMins)/60 - (tempStartHours*60+tempStartMins)/60;
    if (difference > maxAllowedTime){
      this.alertService.error('Maximum allowed time for booking is '+maxAllowedTime*60+ ' minutes');
      return true;
    }
    else
      this.alertService.clear();
      return false;
  }

  viewCurrentBookings(){
    let location = this.bookingForm.get('location').value;
    let game = this.bookingForm.get('game').value;
    let date = this.bookingForm.get('date').value;
    if (location != "" && game != "" && date != "") {
      this.getLoading = true;
      let params = new HttpParams().set('location',location).set('game', game).set('date', date);
      this.http.get(`http://localhost:8080/myGame/viewCurrentBookings`, {params})
      .pipe(first())
      .subscribe(
          data => {
            this.currentBookingResults =  Object.entries(data);
            this.getLoading = false;
          },
          error => {
            this.getLoading = false;
          });
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.bookingForm.invalid ||
        this.timeValidation("Buffer Start Time", this.bookingForm.get('startTime').value, this.bookingForm.get('endTime').value, 1)){
        //this.timeValidation("Buffer Start Time", this.bookingForm.get('bufferStartTime').value, this.bookingForm.get('bufferEndTime').value, 1)) {
        return;
    }
    this.loading = true;
    
    let formData: FormData = new FormData();
    let gameDetails = {
        'user': this.currentUser,
        'location': this.bookingForm.value['location'],
        'game': this.bookingForm.value['game'],
        'date': this.bookingForm.value['date'],
        'startTime': this.bookingForm.value['startTime'],
        'endTime': this.bookingForm.value['endTime']
        }
        
    /*'bufferStartTime': this.bookingForm.value['bufferStartTime'],
    'bufferEndTime': this.bookingForm.value['bufferEndTime']*/

    formData.append('details', JSON.stringify(gameDetails));
    this.http.post(`http://localhost:8080/myGame/addGameDetails`, formData, { responseType: 'text'})
    .pipe(first())
    .subscribe(
        data => {
          console.log("test1a "+data);
          this.alertService.success('Booking successful', false);
          this.viewCurrentBookings();
          this.loading = false;
          this.router.navigate(['/bookGame']);
        },
        error => {
          console.log("test2a "+error);
          this.alertService.error(JSON.parse(error.error).message);
          this.router.navigate(['/bookGame']);
          this.loading = false;
        });
  }
  error(message) {
		return throwError({ error: { message } });
	}
}