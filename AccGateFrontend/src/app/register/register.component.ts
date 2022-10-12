import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null/*new FormControl('', Validators.email)*/,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  empList: Array<String> = [];
  closeResult = '';


  constructor(private authService: AuthService) {
    this.empList.push("admin");
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { username, email, password } = this.form;



    this.authService.register(username, email, password, this.empList).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}
