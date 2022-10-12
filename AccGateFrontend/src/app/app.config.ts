import {InjectionToken} from '@angular/core';
import { Router } from '@angular/router';

// parse ful url to ip,port, params
var parsedUrl = new URL(window.location.href);
var url = parsedUrl.hostname;
var port = parsedUrl.port;
var protocol = parsedUrl.protocol;
const AUTH_API = protocol + "//" + url + ":" + port;

export let APP_CONFIG = new InjectionToken('app.config');
export const AppConfig = {
  accServer: {
    ACCWEBServers: AUTH_API //'https://172.28.8.245:8445'
  },
  endpoints: {

    TOKEN_KEY: 'token',
    REFRESHTOKEN_KEY: 'auth-refreshtoken',
    USER_KEY: 'user'
  }
};
