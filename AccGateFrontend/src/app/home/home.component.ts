import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public ACC_VERSION: string = 'ACC_VERSION';
  content?: string = 'Aeonix | Tadiran Telecom';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe(
      data => { this.content = data; },
      err => { this.content = JSON.parse(err.error).message; }
    );
    this.userService.getAccVersion().subscribe(
      data => { this.ACC_VERSION = data; },
      err => { this.ACC_VERSION = JSON.parse(err.error).message; }
    );
  }
}
