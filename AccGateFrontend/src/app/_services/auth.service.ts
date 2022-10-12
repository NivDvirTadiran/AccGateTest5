import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AppConfig} from "../app.config";


const AUTH_API = AppConfig.accServer.ACCWEBServers+'/accGate/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  registerForm(username: string, email: string, password: string, phone: string): Observable<any> {
    return this.http.post(AUTH_API + 'register-form', {
      username,
      email,
      password,
      phone,
    }, {responseType: 'text'});
  }

  replacePassForm(username: string, oldPassword: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(AUTH_API + 'replace-pass-form', {
      username,
      oldPassword,
      password,
      confirmPassword,
    }, {responseType: 'text'});
  }

  register(username: string, email: string, password: string, roles: Array<String>): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password,
      roles,
    }, httpOptions);
  }

  getToken(url: string, username: string, email: string, password: string): Observable<any> {
    return this.http.post(url, {
      username,
      email,
      password
    }, httpOptions);
  }

  // login, register
  refreshToken(token: string): Observable<any>  {
    return this.http.post(AUTH_API + 'refreshtoken', {
      refreshToken: token
    }, httpOptions);
  }

  // login, register
  webapptab(token: string, webapp: string): Promise<any>  {
    return this.http.post(AUTH_API + 'webapptab', {
      refreshToken: token,
      webApp: webapp
    }, httpOptions).toPromise();
  }
}
