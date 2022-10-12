import {Component, OnInit} from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import {  Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import {FormControl, Validators} from "@angular/forms";
import { RegisterFormComponent } from './register-form/register-form.component';
import {ReplacePassFormComponent} from "./replace-pass-form/replace-pass-form.component";
import {Observable} from "rxjs";
import {User} from "./User";
//import {  Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  registerFormRef: MdbModalRef<RegisterFormComponent> | null = null;
  replacePassFormRef: MdbModalRef<ReplacePassFormComponent> | null = null;
  form: any = {
    username: null, //new FormControl('ea2', Validators.min(2)),
    password: null  //new FormControl('zaqwsx', Validators.min(2))
  };
  public isLoggedIn = false;
  isLoginFailed = false;
  loginErrorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private router: Router,
              private registerFormService: MdbModalService,
              private replacePassFormService: MdbModalService) { }

  user: User | null = null;

  doLogout() {
    this.user = null;
  }

  doLogin() {
    this.user = { name: 'Jane Doe' };
  }

  doCreateAccount() {
    this.user = { name: 'Jane Doe' };
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  test() {
    console.log("test start");
    /*this.openRegisterForm().then(() => {
      this.openReplacePassword();
      console.log("test end");});*/

    this.openRegisterForm().then(
    (val) => {
      console.log(val);
      switch (val) {
        case "xbutton":
          break;
        case undefined:
          this.openReplacePassword();
          break;
        default:

      }
      return 'done2';
    },
      (err) => console.error(err));
  }

  openRegisterForm() {
    return this.registerFormService.open(RegisterFormComponent).onClose.toPromise();
    /*var promise = new Promise<void>((resolve, reject)  => {
      let newRegisterFormService = this.registerFormService.open(RegisterFormComponent);
      setTimeout(() => {
        console.log("Async Work Complete");
        newRegisterFormService.close();
        resolve();//() => {resolve();}
      }, 5000);
    });
    return promise;*/
  }

  openReplacePassword() {
    this.replacePassFormService.open(ReplacePassFormComponent);
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveRefreshToken(data.refreshToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      },
      err => {
        switch (err.error.message) {
          case "Error: A registry process should be made!":
            //this.openRegisterForm().then(() => {this.openReplacePassword()});
            //toPromise((data) => {this.openReplacePassword()});
            this.openRegisterForm().then(
              (val) => {
                console.log(val);
                switch (val) {
                  case "xbutton":
                    break;
                  case "Registration Complete":
                    this.openReplacePassword();
                    break;
                  case undefined:
                    this.openReplacePassword();
                    break;
                  default:
                }
                return 'done2';
              },
              (err) => console.error(err));
              break;
          default:
            this.loginErrorMessage = err.error.message;
        }


        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    //window.location.reload();
    this.router.navigate(['/profile']).then(() => {window.location.reload()});
    //var URL = window.location.host+"/profile"; //'http://localhost:4200/user';
    ///window.open(URL);
    //this.router.navigate([]).then(result => {  window.open(window.location.toString(), 'user'); });
  }
}
