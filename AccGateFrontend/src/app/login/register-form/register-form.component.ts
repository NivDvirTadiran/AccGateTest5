import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { AuthService } from '../../_services/auth.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {
  validationForm: FormGroup;
  isSuccessful = false;
  isSignUpFailed = false;
  submitted = false;
  errorMessage = '';
  empList: Array<String> = [];
  apiResponse = { message: '', error: false };
  errorFieldSubmitted: any = {};
  closeResult = '';

  constructor(public modalRef: MdbModalRef<RegisterFormComponent>,
              private authService: AuthService) {
    this.validationForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      password: new FormControl('', Validators.minLength(1)),
      phone: new FormControl(null, Validators.pattern(new RegExp("[0-9 ]{12}")))
    });
    this.empList.push("admin");
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.submitted = true;
    const { userName, email, password, phone } = this.validationForm.value;
    this.authService.registerForm(userName, email, password, phone).subscribe(
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
      }, () => {console.log("Registration Complete");
                        this.modalRef.close("Registration Complete");}
    );
  }

  get userName(): AbstractControl {
    return this.validationForm.get('userName')!;
  }

  get email(): AbstractControl {
    return this.validationForm.get('email')!;
  }

  get password(): AbstractControl {
    return this.validationForm.get('password')!;
  }

  get phone(): AbstractControl {
    return this.validationForm.get('phone')!;
  }
}
