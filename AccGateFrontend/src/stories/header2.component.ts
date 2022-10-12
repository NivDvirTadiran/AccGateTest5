import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from './User';

@Component({
  selector: 'storybook-header2',
  template: `  <nav class="navbar navbar-expand navbar-dark bg-dark">

    <a href="#" class="navbar-brand">
      <img _ngcontent-c0="accGate" class="nav-img" srcset="./assets/images/TadiranTelecom2.webp"  width="56"
           height="56"><label>accGate</label>
    </a>
    <ul class="navbar-nav mr-auto" routerLinkActive="active">
      <li class="nav-item">
        <a href="/page" class="nav-link" routerLink="page">Page </a>
      </li>
      <li class="nav-item">
        <a href="/home" class="nav-link" routerLink="home">Home </a>
      </li>
      <li class="nav-item" *ngIf="showAdminBoard">
        <a href="/admin" class="nav-link" routerLink="admin">Admin Board</a>
      </li>
      <li class="nav-item" *ngIf="showModeratorBoard">
        <a href="/mod" class="nav-link" routerLink="mod">Moderator Board</a>
      </li>
      <li class="nav-item">
        <a href="/user" class="nav-link" *ngIf="isLoggedIn" routerLink="user">User</a>
      </li>
    </ul>

    <ul class="navbar-nav ml-auto" *ngIf="!isLoggedIn">
      <li class="nav-item">
        <a href="/register" class="nav-link" routerLink="register">Sign Up</a>
      </li>
      <li class="nav-item">
        <a href="/login" class="nav-link" routerLink="login">Login</a>
      </li>
    </ul>

    <ul class="navbar-nav ml-auto" *ngIf="isLoggedIn">
      <li class="nav-item">
        <a href="/profile" class="nav-link" routerLink="profile">{{ username }}</a>
      </li>
      <li class="nav-item">
        <a href class="nav-link" (click)="logout()">LogOut</a>
      </li>
    </ul>
  </nav>`,
  styleUrls: ['./header.css'],
})
export default class Header2Component {
  @Input()
  user: User | null = null;

  @Output()
  onLogin = new EventEmitter<Event>();

  @Output()
  onLogout = new EventEmitter<Event>();

  @Output()
  onCreateAccount = new EventEmitter<Event>();
}
