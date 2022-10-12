import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import {AuthService} from "../_services/auth.service";

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  content?: string;
  form: any = {
    username: null,
    email: null/*new FormControl('', Validators.email)*/,
    password: null,
    roles: null,
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  rolesList: Array<String> = [];

  constructor(private userService: UserService, private authService: AuthService) {

  }


  ngOnInit(): void {
    this.userService.getAdminBoard().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

  onSubmit(): void {
    const { username, email, password, roles } = this.form;
    this.rolesList.push(roles);

    this.authService.register(username, email, password, this.rolesList).subscribe(
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
