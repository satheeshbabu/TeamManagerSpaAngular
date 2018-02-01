import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from './user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;


@Injectable()
export class AuthService {

  private token: string;
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  getToken() {
    return this.token;
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  login(user: User) {
     const body = new HttpParams().set('email', user.email).set('password', user.password);
     this.http.post(API_URL + "/users/login",body.toString(),{
     headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')}).subscribe((res) => {
       console.log("Response : Succesfuly" +  JSON.stringify(res));
       this.loggedIn.next(true);
       this.router.navigate(['/']);
     },(err) => {
       const errBody = err.json();
       console.log("Response : ErrorBody" +  JSON.stringify(errBody));
       console.log("Response : ErrorBody" +  JSON.stringify(err));
     });
    // subscribe((response: Response) => {
    //           console.log("resp: " +  JSON.stringify(response) );
    //           this.loggedIn.next(true);
    //           this.router.navigate(['/']);
    //       const token = response && response.token;
    //       if (token) {
    //           // store username and jwt token in local storage to keep user logged in between page refreshes
    //           localStorage.setItem('userToken', token);
    //           this.loggedIn.next(true);
    //           this.router.navigate(['/']);
    //           return true;
    //       } else {
    //           return false;
    //       }
    //     } );
  }


  signup (user: User) {
    const body = new HttpParams()
    .set('first_name', user.first_name)
    .set('last_name',  user.last_name)
    .set('email',      user.email)
    .set('password',   user.password)
    .set('role',       user.role)
    .set('team_name',  user.team_name);

    console.log('[AuthServices] :: Body' + JSON.stringify(body));

    this.http.post(API_URL + "/users/signup", body.toString(), {
       headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).subscribe((res) => {
        console.log("Response: " +  JSON.stringify(res));
        this.router.navigate(['/login']);
    }, (err) => {
        console.log("Response: " +  JSON.stringify(err));
    });
  }

  private handleError (error: Response | any) {
    console.error('AuthService::handleError', error);
    return Observable.throw(error);
  }

  logout() {
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
  
}//AuthService