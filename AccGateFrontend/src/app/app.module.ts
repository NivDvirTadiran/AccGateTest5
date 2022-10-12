import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardUserComponent } from './board-user/board-user.component';

import { authInterceptorProviders, AuthInterceptor } from './_helpers/auth.interceptor';
import {NgbDatepickerModule} from "@ng-bootstrap/ng-bootstrap";
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule, MdbErrorDirective, MdbSuccessDirective } from 'mdb-angular-ui-kit/validation';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdbInputDirective  } from 'mdb-angular-ui-kit/forms';
import { ModalModule, TooltipModule, PopoverModule, ButtonsModule, MDBBootstrapModule } from 'angular-bootstrap-md';
import { RegisterFormComponent } from './login/register-form/register-form.component';
import {ReplacePassFormComponent} from "./login/replace-pass-form/replace-pass-form.component";
import {ApiErrorMessagePipe} from "./pipes/api-error-message.pipe";
import {LoginErrorMessagePipe} from "./pipes/login-error-message.pipe";
import { ButtonComponent } from "./login/button/button.component";
import { Button2Component } from "./login/button2/button2.component";
import  Page2Component  from './page/page.component';
//import  HeaderComponent  from './page/header.component';
import { Button3Component } from './login/button3/button3.component';
import { LanguageIconComponent } from './page/language-icon/language-icon.component';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        HomeComponent,
        ProfileComponent,
        BoardAdminComponent,
        BoardModeratorComponent,
        BoardUserComponent,
        RegisterFormComponent,
        ReplacePassFormComponent,
        ApiErrorMessagePipe,
        LoginErrorMessagePipe,
        ButtonComponent,
        Button2Component,
      Page2Component,
      //  HeaderComponent,
        Button3Component,
      LanguageIconComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbDatepickerModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    //MdbValidationModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ModalModule,
    ButtonsModule,
    MDBBootstrapModule.forRoot(),

  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
