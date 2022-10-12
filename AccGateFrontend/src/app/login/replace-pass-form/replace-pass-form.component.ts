import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import {AuthService} from "../../_services/auth.service";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-modal',
  templateUrl: './replace-pass-form.component.html',
  styleUrls: ['./replace-pass-form.component.css']
})
export class ReplacePassFormComponent {
  replacePassForm: FormGroup;
  isSuccessful = false;
  isSignUpFailed = false;
  submitted = false;
  errorMessage = '';
  empList: Array<String> = [];
  apiResponse = { message: '', error: false };
  errorFieldSubmitted: any = {};
  closeResult = '';

  constructor(public modalRef: MdbModalRef<ReplacePassFormComponent>,
              private authService: AuthService) {
    this.replacePassForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      oldPassword: new FormControl(null, Validators.minLength(1)),
      password: new FormControl('', Validators.minLength(3)),
      confirmPassword: new FormControl(null, Validators.minLength(3))
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.submitted = true;
    const { userName, oldPassword, password, confirmPassword } = this.replacePassForm.value;
    this.authService.replacePassForm(userName, oldPassword, password, confirmPassword).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.errorFieldSubmitted = {};
        this.apiResponse.error = false;
        this.apiResponse.message = 'Successful registration';
      },
      error => {
        const errorResponse = JSON.parse(error.error);
        this.apiResponse.error = true;
        this.apiResponse.message = 'Registration error';
        this.errorMessage = error.error.message;
        this.isSignUpFailed = true;
        if (errorResponse.error && errorResponse.message === 'VALIDATION_FAILED') {
          this.errorFieldSubmitted = errorResponse.data;
        }
      }, () => {this.modalRef.close()}
    );
  }



  get userName(): AbstractControl {
    return this.replacePassForm.get('userName')!;
  }

  get oldPassword(): AbstractControl {
    return this.replacePassForm.get('oldPassword')!;
  }

  get password(): AbstractControl {
    return this.replacePassForm.get('password')!;
  }

  get confirmPassword(): AbstractControl {
    return this.replacePassForm.get('confirmPassword')!;
  }

}
