(self["webpackChunkaccGate"] = self["webpackChunkaccGate"] || []).push([["main"],{

/***/ 98255:
/*!*******************************************************!*\
  !*** ./$_lazy_route_resources/ lazy namespace object ***!
  \*******************************************************/
/***/ (function(module) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 98255;
module.exports = webpackEmptyAsyncContext;

/***/ }),

/***/ 19230:
/*!**********************************************!*\
  !*** ./src/app/_helpers/auth.interceptor.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuthInterceptor": function() { return /* binding */ AuthInterceptor; },
/* harmony export */   "authInterceptorProviders": function() { return /* binding */ authInterceptorProviders; }
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ 91841);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 26215);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 40205);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 5304);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 43190);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 45435);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ 15257);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _services_token_storage_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/token-storage.service */ 93590);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/auth.service */ 88368);






const TOKEN_HEADER_KEY = 'Authorization'; // for Spring Boot back-end
//const TOKEN_HEADER_KEY = 'x-access-token';   // for Node.js Express back-end
class AuthInterceptor {
    constructor(tokenService, authService) {
        this.tokenService = tokenService;
        this.authService = authService;
        this.isRefreshing = false;
        this.refreshTokenSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject(null);
    }
    intercept(req, next) {
        let authReq = req;
        const token = this.tokenService.getToken();
        if (token != null) {
            authReq = this.addTokenHeader(req, token);
            // for Spring Boot back-end
            // authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
            // for Node.js Express back-end
            //authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, token) });
        }
        return next.handle(authReq).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
            if (error instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpErrorResponse && !authReq.url.includes('auth/signin') && error.status === 401) {
                return this.handle401Error(authReq, next);
            }
            return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(error);
        }));
    }
    handle401Error(request, next) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            const token = this.tokenService.getRefreshToken();
            if (token)
                return this.authService.refreshToken(token).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.switchMap)((token) => {
                    this.isRefreshing = false;
                    this.tokenService.saveToken(token.accessToken);
                    this.tokenService.saveRefreshToken(token.refreshToken);
                    this.refreshTokenSubject.next(token.accessToken);
                    return next.handle(this.addTokenHeader(request, token.accessToken));
                }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)((err) => {
                    this.isRefreshing = false;
                    this.tokenService.signOut();
                    return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(err);
                }));
        }
        return this.refreshTokenSubject.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.filter)(token => token !== null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.switchMap)((token) => next.handle(this.addTokenHeader(request, token))));
    }
    addTokenHeader(request, token) {
        /* for Spring Boot back-end */
        return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
        /* for Node.js Express back-end */
        //return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token) });
    }
    /*
      public forseRefreshToken2() {
        const token = this.tokenService.getRefreshToken();
        if (token)
          this.authService.refreshToken(token).pipe(
            switchMap((token: any) => {
              this.isRefreshing = false;
              this.tokenService.saveToken(token.accessToken);
              this.refreshTokenSubject.next(token.accessToken);
    
              filter(token => token !== null),
                take(1),
                switchMap((token) => next.handle(this.addTokenHeader(request, token)))
            }),
            catchError((err) => {
              this.isRefreshing = false;
    
              this.tokenService.signOut();
              return throwError(err);
            })
          );
      }
    */
    forseRefreshToken() {
        const token = this.tokenService.getRefreshToken();
        if (token)
            this.authService.refreshToken(token).subscribe(data => {
                this.isRefreshing = false;
                this.tokenService.saveToken(data.accessToken);
                this.refreshTokenSubject.next(data.accessToken);
            }, (err) => {
                this.isRefreshing = false;
                this.tokenService.signOut();
                return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(err);
            });
    }
}
AuthInterceptor.ɵfac = function AuthInterceptor_Factory(t) { return new (t || AuthInterceptor)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵinject"](_services_token_storage_service__WEBPACK_IMPORTED_MODULE_0__.TokenStorageService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵinject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_1__.AuthService)); };
AuthInterceptor.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineInjectable"]({ token: AuthInterceptor, factory: AuthInterceptor.ɵfac });
const authInterceptorProviders = [
    { provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];


/***/ }),

/***/ 88368:
/*!*******************************************!*\
  !*** ./src/app/_services/auth.service.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuthService": function() { return /* binding */ AuthService; }
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 91841);
/* harmony import */ var _app_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app.config */ 49670);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37716);




const AUTH_API = _app_config__WEBPACK_IMPORTED_MODULE_0__.AppConfig.accServer.ACCWEBServers + '/accGate/auth/';
const httpOptions = {
    headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpHeaders({ 'Content-Type': 'application/json' })
};
class AuthService {
    constructor(http) {
        this.http = http;
    }
    login(username, password) {
        return this.http.post(AUTH_API + 'signin', {
            username,
            password
        }, httpOptions);
    }
    registerForm(username, email, password, phone) {
        return this.http.post(AUTH_API + 'register-form', {
            username,
            email,
            password,
            phone,
        }, { responseType: 'text' });
    }
    replacePassForm(username, oldPassword, password, confirmPassword) {
        return this.http.post(AUTH_API + 'replace-pass-form', {
            username,
            oldPassword,
            password,
            confirmPassword,
        }, { responseType: 'text' });
    }
    register(username, email, password, roles) {
        return this.http.post(AUTH_API + 'signup', {
            username,
            email,
            password,
            roles,
        }, httpOptions);
    }
    getToken(url, username, email, password) {
        return this.http.post(url, {
            username,
            email,
            password
        }, httpOptions);
    }
    // login, register
    refreshToken(token) {
        return this.http.post(AUTH_API + 'refreshtoken', {
            refreshToken: token
        }, httpOptions);
    }
    // login, register
    webapptab(token, webapp) {
        return this.http.post(AUTH_API + 'webapptab', {
            refreshToken: token,
            webApp: webapp
        }, httpOptions).toPromise();
    }
}
AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient)); };
AuthService.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ 93590:
/*!****************************************************!*\
  !*** ./src/app/_services/token-storage.service.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TokenStorageService": function() { return /* binding */ TokenStorageService; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37716);

const TOKEN_KEY = 'token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const USER_KEY = 'user';
class TokenStorageService {
    constructor() { }
    signOut() {
        window.sessionStorage.clear();
    }
    saveToken(token) {
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.setItem(TOKEN_KEY, token);
        const user = this.getUser();
        if (user.id) {
            this.saveUser(Object.assign(Object.assign({}, user), { accessToken: token }));
        }
    }
    getToken() {
        return window.sessionStorage.getItem(TOKEN_KEY);
    }
    saveRefreshToken(token) {
        window.sessionStorage.removeItem(REFRESHTOKEN_KEY);
        window.sessionStorage.setItem(REFRESHTOKEN_KEY, token);
        const user = this.getUser();
        if (user.id) {
            user.refreshToken = token;
            this.saveUser(user);
        }
    }
    getRefreshToken() {
        return window.sessionStorage.getItem(REFRESHTOKEN_KEY);
    }
    saveUser(user) {
        window.sessionStorage.removeItem(USER_KEY);
        window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    getUser() {
        const user = window.sessionStorage.getItem(USER_KEY);
        if (user) {
            return JSON.parse(user);
        }
        return {};
    }
}
TokenStorageService.ɵfac = function TokenStorageService_Factory(t) { return new (t || TokenStorageService)(); };
TokenStorageService.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: TokenStorageService, factory: TokenStorageService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ 55089:
/*!*******************************************!*\
  !*** ./src/app/_services/user.service.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UserService": function() { return /* binding */ UserService; }
/* harmony export */ });
/* harmony import */ var _app_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app.config */ 49670);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 91841);



const API_URL = _app_config__WEBPACK_IMPORTED_MODULE_0__.AppConfig.accServer.ACCWEBServers + '/accGate/test/';
class UserService {
    constructor(http) {
        this.http = http;
    }
    getPublicContent() {
        return this.http.get(API_URL + 'all', { responseType: 'text' });
    }
    getAccVersion() {
        return this.http.get(API_URL + 'accversion', { responseType: 'text' });
    }
    getUserBoard() {
        return this.http.get(API_URL + 'user', { responseType: 'text' });
    }
    getModeratorBoard() {
        return this.http.get(API_URL + 'mod', { responseType: 'text' });
    }
    getAdminBoard() {
        return this.http.get(API_URL + 'admin', { responseType: 'text' });
    }
}
UserService.ɵfac = function UserService_Factory(t) { return new (t || UserService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient)); };
UserService.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: UserService, factory: UserService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ 98097:
/*!**********************************************!*\
  !*** ./src/app/_shared/event-bus.service.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventBusService": function() { return /* binding */ EventBusService; }
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 79765);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ 45435);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 88002);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37716);



class EventBusService {
    constructor() {
        this.subject$ = new rxjs__WEBPACK_IMPORTED_MODULE_0__.Subject();
    }
    emit(event) {
        this.subject$.next(event);
    }
    on(eventName, action) {
        return this.subject$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_1__.filter)((e) => e.name === eventName), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)((e) => e["value"])).subscribe(action);
    }
}
EventBusService.ɵfac = function EventBusService_Factory(t) { return new (t || EventBusService)(); };
EventBusService.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({ token: EventBusService, factory: EventBusService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ 90158:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppRoutingModule": function() { return /* binding */ AppRoutingModule; }
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 39895);
/* harmony import */ var _register_register_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./register/register.component */ 29087);
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./login/login.component */ 98458);
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./home/home.component */ 45067);
/* harmony import */ var _profile_profile_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./profile/profile.component */ 96630);
/* harmony import */ var _board_user_board_user_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./board-user/board-user.component */ 14652);
/* harmony import */ var _board_moderator_board_moderator_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./board-moderator/board-moderator.component */ 49586);
/* harmony import */ var _board_admin_board_admin_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./board-admin/board-admin.component */ 5838);
/* harmony import */ var _page_page_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./page/page.component */ 61527);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 37716);











const routes = [
    { path: 'page', component: _page_page_component__WEBPACK_IMPORTED_MODULE_7__.default },
    { path: 'home', component: _home_home_component__WEBPACK_IMPORTED_MODULE_2__.HomeComponent },
    { path: 'login', component: _login_login_component__WEBPACK_IMPORTED_MODULE_1__.LoginComponent },
    { path: 'register', component: _register_register_component__WEBPACK_IMPORTED_MODULE_0__.RegisterComponent },
    { path: 'profile', component: _profile_profile_component__WEBPACK_IMPORTED_MODULE_3__.ProfileComponent /*, canActivate: [AppRoutingGuard] */ },
    { path: 'user', component: _board_user_board_user_component__WEBPACK_IMPORTED_MODULE_4__.BoardUserComponent },
    { path: 'mod', component: _board_moderator_board_moderator_component__WEBPACK_IMPORTED_MODULE_5__.BoardModeratorComponent },
    { path: 'admin', component: _board_admin_board_admin_component__WEBPACK_IMPORTED_MODULE_6__.BoardAdminComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadChildren: () => Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./app.module */ 36747)).then(m => m.AppModule), },
    { path: '**', redirectTo: 'home', },
];
class AppRoutingModule {
}
AppRoutingModule.ɵfac = function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); };
AppRoutingModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule.forRoot(routes, { useHash: true })], _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule] }); })();


/***/ }),

/***/ 55041:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppComponent": function() { return /* binding */ AppComponent; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _services_token_storage_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_services/token-storage.service */ 93590);
/* harmony import */ var _shared_event_bus_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_shared/event-bus.service */ 98097);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 39895);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 38583);





function AppComponent_li_13_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "li", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "a", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "Admin Board");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function AppComponent_li_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "li", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "a", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "Moderator Board");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function AppComponent_a_16_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "a", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "User");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function AppComponent_ul_17_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ul", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "li", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "a", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Sign Up");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "li", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "a", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Login");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function AppComponent_ul_18_Template(rf, ctx) { if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ul", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "li", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "a", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "li", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "a", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function AppComponent_ul_18_Template_a_click_5_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r6); const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r5.logout(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "LogOut");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r4.username);
} }
class AppComponent {
    constructor(tokenStorageService, eventBusService) {
        this.tokenStorageService = tokenStorageService;
        this.eventBusService = eventBusService;
        this.roles = [];
        this.isLoggedIn = false;
        this.showAdminBoard = false;
        this.showModeratorBoard = false;
    }
    ngOnInit() {
        this.isLoggedIn = !!this.tokenStorageService.getToken();
        if (this.isLoggedIn) {
            const user = this.tokenStorageService.getUser();
            this.roles = user.roles;
            this.showAdminBoard = (this.roles.includes('Admin') || this.roles.includes('SupervisorAdmin'));
            this.showModeratorBoard = this.roles.includes('SupervisorMonitor');
            this.username = user.username;
        }
        this.eventBusSub = this.eventBusService.on('logout', () => {
            this.logout();
        });
    }
    ngOnDestroy() {
        if (this.eventBusSub)
            this.eventBusSub.unsubscribe();
    }
    logout() {
        this.tokenStorageService.signOut();
        this.isLoggedIn = false;
        this.roles = [];
        this.showAdminBoard = false;
        this.showModeratorBoard = false;
        //window.location.reload();
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_token_storage_service__WEBPACK_IMPORTED_MODULE_0__.TokenStorageService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_shared_event_bus_service__WEBPACK_IMPORTED_MODULE_1__.EventBusService)); };
AppComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 21, vars: 5, consts: [["id", "app"], [1, "navbar", "navbar-expand", "navbar-dark", "bg-dark"], ["href", "#", 1, "navbar-brand"], ["_ngcontent-c0", "accGate", "srcset", "./assets/images/TadiranTelecom2.webp", "width", "56", "height", "56", 1, "nav-img"], ["routerLinkActive", "active", 1, "navbar-nav", "mr-auto"], [1, "nav-item"], ["href", "/page", "routerLink", "page", 1, "nav-link"], ["href", "/home", "routerLink", "home", 1, "nav-link"], ["class", "nav-item", 4, "ngIf"], ["href", "/user", "class", "nav-link", "routerLink", "user", 4, "ngIf"], ["class", "navbar-nav ml-auto", 4, "ngIf"], [1, "container"], ["href", "/admin", "routerLink", "admin", 1, "nav-link"], ["href", "/mod", "routerLink", "mod", 1, "nav-link"], ["href", "/user", "routerLink", "user", 1, "nav-link"], [1, "navbar-nav", "ml-auto"], ["href", "/register", "routerLink", "register", 1, "nav-link"], ["href", "/login", "routerLink", "login", 1, "nav-link"], ["href", "/profile", "routerLink", "profile", 1, "nav-link"], ["href", "", 1, "nav-link", 3, "click"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "nav", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "label");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "accGate");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "ul", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "li", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, "Page ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "li", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "a", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12, "Home ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](13, AppComponent_li_13_Template, 3, 0, "li", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](14, AppComponent_li_14_Template, 3, 0, "li", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](15, "li", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](16, AppComponent_a_16_Template, 2, 0, "a", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](17, AppComponent_ul_17_Template, 7, 0, "ul", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](18, AppComponent_ul_18_Template, 7, 1, "ul", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](20, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.showAdminBoard);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.showModeratorBoard);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isLoggedIn);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.isLoggedIn);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isLoggedIn);
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLinkActive, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLinkWithHref, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterOutlet], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcHAuY29tcG9uZW50LmNzcyJ9 */"] });


/***/ }),

/***/ 49670:
/*!*******************************!*\
  !*** ./src/app/app.config.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "APP_CONFIG": function() { return /* binding */ APP_CONFIG; },
/* harmony export */   "AppConfig": function() { return /* binding */ AppConfig; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37716);

// parse ful url to ip,port, params
var parsedUrl = new URL(window.location.href);
var url = parsedUrl.hostname;
var port = parsedUrl.port;
var protocol = parsedUrl.protocol;
const AUTH_API = protocol + "//" + url + ":" + port;
let APP_CONFIG = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('app.config');
const AppConfig = {
    accServer: {
        ACCWEBServers: AUTH_API //'https://172.28.8.245:8445'
    },
    endpoints: {
        TOKEN_KEY: 'token',
        REFRESHTOKEN_KEY: 'auth-refreshtoken',
        USER_KEY: 'user'
    }
};


/***/ }),

/***/ 36747:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppModule": function() { return /* binding */ AppModule; }
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/platform-browser */ 39075);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/forms */ 3679);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/common/http */ 91841);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app-routing.module */ 90158);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ 55041);
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./login/login.component */ 98458);
/* harmony import */ var _register_register_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./register/register.component */ 29087);
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./home/home.component */ 45067);
/* harmony import */ var _profile_profile_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./profile/profile.component */ 96630);
/* harmony import */ var _board_admin_board_admin_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./board-admin/board-admin.component */ 5838);
/* harmony import */ var _board_moderator_board_moderator_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./board-moderator/board-moderator.component */ 49586);
/* harmony import */ var _board_user_board_user_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./board-user/board-user.component */ 14652);
/* harmony import */ var _helpers_auth_interceptor__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./_helpers/auth.interceptor */ 19230);
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ 72075);
/* harmony import */ var mdb_angular_ui_kit_accordion__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! mdb-angular-ui-kit/accordion */ 60415);
/* harmony import */ var mdb_angular_ui_kit_carousel__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! mdb-angular-ui-kit/carousel */ 41692);
/* harmony import */ var mdb_angular_ui_kit_checkbox__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! mdb-angular-ui-kit/checkbox */ 85176);
/* harmony import */ var mdb_angular_ui_kit_collapse__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! mdb-angular-ui-kit/collapse */ 82785);
/* harmony import */ var mdb_angular_ui_kit_dropdown__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! mdb-angular-ui-kit/dropdown */ 90210);
/* harmony import */ var mdb_angular_ui_kit_forms__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! mdb-angular-ui-kit/forms */ 95095);
/* harmony import */ var mdb_angular_ui_kit_modal__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! mdb-angular-ui-kit/modal */ 25303);
/* harmony import */ var mdb_angular_ui_kit_popover__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! mdb-angular-ui-kit/popover */ 69147);
/* harmony import */ var mdb_angular_ui_kit_radio__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! mdb-angular-ui-kit/radio */ 38754);
/* harmony import */ var mdb_angular_ui_kit_range__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! mdb-angular-ui-kit/range */ 10434);
/* harmony import */ var mdb_angular_ui_kit_ripple__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! mdb-angular-ui-kit/ripple */ 7116);
/* harmony import */ var mdb_angular_ui_kit_scrollspy__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! mdb-angular-ui-kit/scrollspy */ 74803);
/* harmony import */ var mdb_angular_ui_kit_tabs__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! mdb-angular-ui-kit/tabs */ 78141);
/* harmony import */ var mdb_angular_ui_kit_tooltip__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! mdb-angular-ui-kit/tooltip */ 64433);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! @angular/platform-browser/animations */ 75835);
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! angular-bootstrap-md */ 49260);
/* harmony import */ var _login_register_form_register_form_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./login/register-form/register-form.component */ 70996);
/* harmony import */ var _login_replace_pass_form_replace_pass_form_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./login/replace-pass-form/replace-pass-form.component */ 4959);
/* harmony import */ var _pipes_api_error_message_pipe__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./pipes/api-error-message.pipe */ 81582);
/* harmony import */ var _pipes_login_error_message_pipe__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./pipes/login-error-message.pipe */ 74164);
/* harmony import */ var _login_button_button_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./login/button/button.component */ 32838);
/* harmony import */ var _login_button2_button2_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./login/button2/button2.component */ 83353);
/* harmony import */ var _page_page_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./page/page.component */ 61527);
/* harmony import */ var _login_button3_button3_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./login/button3/button3.component */ 79325);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/core */ 37716);





































//import  HeaderComponent  from './page/header.component';



class AppModule {
}
AppModule.ɵfac = function AppModule_Factory(t) { return new (t || AppModule)(); };
AppModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent] });
AppModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdefineInjector"]({ providers: [_helpers_auth_interceptor__WEBPACK_IMPORTED_MODULE_9__.authInterceptorProviders], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_19__.BrowserModule,
            _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_20__.FormsModule,
            _angular_common_http__WEBPACK_IMPORTED_MODULE_21__.HttpClientModule,
            _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_22__.NgbDatepickerModule,
            mdb_angular_ui_kit_accordion__WEBPACK_IMPORTED_MODULE_23__.MdbAccordionModule,
            mdb_angular_ui_kit_carousel__WEBPACK_IMPORTED_MODULE_24__.MdbCarouselModule,
            mdb_angular_ui_kit_checkbox__WEBPACK_IMPORTED_MODULE_25__.MdbCheckboxModule,
            mdb_angular_ui_kit_collapse__WEBPACK_IMPORTED_MODULE_26__.MdbCollapseModule,
            mdb_angular_ui_kit_dropdown__WEBPACK_IMPORTED_MODULE_27__.MdbDropdownModule,
            mdb_angular_ui_kit_forms__WEBPACK_IMPORTED_MODULE_28__.MdbFormsModule,
            mdb_angular_ui_kit_modal__WEBPACK_IMPORTED_MODULE_29__.MdbModalModule,
            mdb_angular_ui_kit_popover__WEBPACK_IMPORTED_MODULE_30__.MdbPopoverModule,
            mdb_angular_ui_kit_radio__WEBPACK_IMPORTED_MODULE_31__.MdbRadioModule,
            mdb_angular_ui_kit_range__WEBPACK_IMPORTED_MODULE_32__.MdbRangeModule,
            mdb_angular_ui_kit_ripple__WEBPACK_IMPORTED_MODULE_33__.MdbRippleModule,
            mdb_angular_ui_kit_scrollspy__WEBPACK_IMPORTED_MODULE_34__.MdbScrollspyModule,
            mdb_angular_ui_kit_tabs__WEBPACK_IMPORTED_MODULE_35__.MdbTabsModule,
            mdb_angular_ui_kit_tooltip__WEBPACK_IMPORTED_MODULE_36__.MdbTooltipModule,
            //MdbValidationModule,
            _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_37__.BrowserAnimationsModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_20__.ReactiveFormsModule,
            angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_38__.ModalModule,
            angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_38__.ButtonsModule,
            angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_38__.MDBBootstrapModule.forRoot(),
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent,
        _login_login_component__WEBPACK_IMPORTED_MODULE_2__.LoginComponent,
        _register_register_component__WEBPACK_IMPORTED_MODULE_3__.RegisterComponent,
        _home_home_component__WEBPACK_IMPORTED_MODULE_4__.HomeComponent,
        _profile_profile_component__WEBPACK_IMPORTED_MODULE_5__.ProfileComponent,
        _board_admin_board_admin_component__WEBPACK_IMPORTED_MODULE_6__.BoardAdminComponent,
        _board_moderator_board_moderator_component__WEBPACK_IMPORTED_MODULE_7__.BoardModeratorComponent,
        _board_user_board_user_component__WEBPACK_IMPORTED_MODULE_8__.BoardUserComponent,
        _login_register_form_register_form_component__WEBPACK_IMPORTED_MODULE_10__.RegisterFormComponent,
        _login_replace_pass_form_replace_pass_form_component__WEBPACK_IMPORTED_MODULE_11__.ReplacePassFormComponent,
        _pipes_api_error_message_pipe__WEBPACK_IMPORTED_MODULE_12__.ApiErrorMessagePipe,
        _pipes_login_error_message_pipe__WEBPACK_IMPORTED_MODULE_13__.LoginErrorMessagePipe,
        _login_button_button_component__WEBPACK_IMPORTED_MODULE_14__.ButtonComponent,
        _login_button2_button2_component__WEBPACK_IMPORTED_MODULE_15__.Button2Component,
        _page_page_component__WEBPACK_IMPORTED_MODULE_16__.default,
        //  HeaderComponent,
        _login_button3_button3_component__WEBPACK_IMPORTED_MODULE_17__.Button3Component], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_19__.BrowserModule,
        _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule,
        _angular_forms__WEBPACK_IMPORTED_MODULE_20__.FormsModule,
        _angular_common_http__WEBPACK_IMPORTED_MODULE_21__.HttpClientModule,
        _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_22__.NgbDatepickerModule,
        mdb_angular_ui_kit_accordion__WEBPACK_IMPORTED_MODULE_23__.MdbAccordionModule,
        mdb_angular_ui_kit_carousel__WEBPACK_IMPORTED_MODULE_24__.MdbCarouselModule,
        mdb_angular_ui_kit_checkbox__WEBPACK_IMPORTED_MODULE_25__.MdbCheckboxModule,
        mdb_angular_ui_kit_collapse__WEBPACK_IMPORTED_MODULE_26__.MdbCollapseModule,
        mdb_angular_ui_kit_dropdown__WEBPACK_IMPORTED_MODULE_27__.MdbDropdownModule,
        mdb_angular_ui_kit_forms__WEBPACK_IMPORTED_MODULE_28__.MdbFormsModule,
        mdb_angular_ui_kit_modal__WEBPACK_IMPORTED_MODULE_29__.MdbModalModule,
        mdb_angular_ui_kit_popover__WEBPACK_IMPORTED_MODULE_30__.MdbPopoverModule,
        mdb_angular_ui_kit_radio__WEBPACK_IMPORTED_MODULE_31__.MdbRadioModule,
        mdb_angular_ui_kit_range__WEBPACK_IMPORTED_MODULE_32__.MdbRangeModule,
        mdb_angular_ui_kit_ripple__WEBPACK_IMPORTED_MODULE_33__.MdbRippleModule,
        mdb_angular_ui_kit_scrollspy__WEBPACK_IMPORTED_MODULE_34__.MdbScrollspyModule,
        mdb_angular_ui_kit_tabs__WEBPACK_IMPORTED_MODULE_35__.MdbTabsModule,
        mdb_angular_ui_kit_tooltip__WEBPACK_IMPORTED_MODULE_36__.MdbTooltipModule,
        //MdbValidationModule,
        _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_37__.BrowserAnimationsModule,
        _angular_forms__WEBPACK_IMPORTED_MODULE_20__.ReactiveFormsModule,
        angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_38__.ModalModule,
        angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_38__.ButtonsModule, angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_38__.MDBRootModule] }); })();


/***/ }),

/***/ 5838:
/*!******************************************************!*\
  !*** ./src/app/board-admin/board-admin.component.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BoardAdminComponent": function() { return /* binding */ BoardAdminComponent; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/user.service */ 55089);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/auth.service */ 88368);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 38583);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 3679);





function BoardAdminComponent_form_7_div_7_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Username is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function BoardAdminComponent_form_7_div_7_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Username must be at least 3 characters ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function BoardAdminComponent_form_7_div_7_div_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Username must be at most 20 characters ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function BoardAdminComponent_form_7_div_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, BoardAdminComponent_form_7_div_7_div_1_Template, 2, 0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, BoardAdminComponent_form_7_div_7_div_2_Template, 2, 0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, BoardAdminComponent_form_7_div_7_div_3_Template, 2, 0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", _r3.errors.required);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", _r3.errors.minlength);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", _r3.errors.maxlength);
} }
function BoardAdminComponent_form_7_div_13_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Email is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function BoardAdminComponent_form_7_div_13_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Email must be a valid email address ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function BoardAdminComponent_form_7_div_13_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, BoardAdminComponent_form_7_div_13_div_1_Template, 2, 0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, BoardAdminComponent_form_7_div_13_div_2_Template, 2, 0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", _r5.errors.required);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", _r5.errors.email);
} }
function BoardAdminComponent_form_7_div_19_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Password is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function BoardAdminComponent_form_7_div_19_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Password must be at least 6 characters ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function BoardAdminComponent_form_7_div_19_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, BoardAdminComponent_form_7_div_19_div_1_Template, 2, 0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, BoardAdminComponent_form_7_div_19_div_2_Template, 2, 0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", _r7.errors.required);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", _r7.errors.minlength);
} }
function BoardAdminComponent_form_7_div_40_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Signup failed!");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](2, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("", ctx_r10.errorMessage, " ");
} }
function BoardAdminComponent_form_7_Template(rf, ctx) { if (rf & 1) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "form", 7, 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngSubmit", function BoardAdminComponent_form_7_Template_form_ngSubmit_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r19); const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1); const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return _r2.form.valid && ctx_r18.onSubmit(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "label", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Username");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "input", 11, 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function BoardAdminComponent_form_7_Template_input_ngModelChange_5_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r19); const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r20.form.username = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, BoardAdminComponent_form_7_div_7_Template, 4, 3, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "label", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, "Email");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "input", 15, 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function BoardAdminComponent_form_7_Template_input_ngModelChange_11_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r19); const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r21.form.email = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](13, BoardAdminComponent_form_7_div_13_Template, 3, 2, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](15, "label", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](16, "Password");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "input", 18, 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function BoardAdminComponent_form_7_Template_input_ngModelChange_17_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r19); const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r22.form.password = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](19, BoardAdminComponent_form_7_div_19_Template, 3, 2, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](20, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "label", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](22, "Privilege Level");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](23, "select", 21, 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function BoardAdminComponent_form_7_Template_select_ngModelChange_23_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r19); const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r23.form.roles = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](25, "option", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](26, "--Please choose an option--");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](27, "option", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](28, "Admin");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](29, "option", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](30, "Moderator");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](31, "option", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](32, "User");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](33, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](34, "button", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](35, "Sign Up");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](36, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](37, " Roles: ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](38, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](39);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](40, BoardAdminComponent_form_7_div_40_Template, 4, 1, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](6);
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](12);
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](18);
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx_r0.form.username);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", _r3.errors && _r2.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx_r0.form.email);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", _r5.errors && _r2.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx_r0.form.password);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", _r7.errors && _r2.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx_r0.form.roles);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("", ctx_r0.rolesList.toString(), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", _r2.submitted && ctx_r0.isSignUpFailed);
} }
function BoardAdminComponent_div_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Your registration is successful! ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
class BoardAdminComponent {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
        this.form = {
            username: null,
            email: null /*new FormControl('', Validators.email)*/,
            password: null,
            roles: null,
        };
        this.isSuccessful = false;
        this.isSignUpFailed = false;
        this.errorMessage = '';
        this.rolesList = [];
    }
    ngOnInit() {
        this.userService.getAdminBoard().subscribe(data => {
            this.content = data;
        }, err => {
            this.content = JSON.parse(err.error).message;
        });
    }
    onSubmit() {
        const { username, email, password, roles } = this.form;
        this.rolesList.push(roles);
        this.authService.register(username, email, password, this.rolesList).subscribe(data => {
            console.log(data);
            this.isSuccessful = true;
            this.isSignUpFailed = false;
        }, err => {
            this.errorMessage = err.error.message;
            this.isSignUpFailed = true;
        });
    }
}
BoardAdminComponent.ɵfac = function BoardAdminComponent_Factory(t) { return new (t || BoardAdminComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_user_service__WEBPACK_IMPORTED_MODULE_0__.UserService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_1__.AuthService)); };
BoardAdminComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: BoardAdminComponent, selectors: [["app-board-admin"]], decls: 9, vars: 3, consts: [[1, "container"], [1, "jumbotron"], [1, "col-md-12"], [1, "card", "card-container"], ["id", "profile-img", "src", "//ssl.gstatic.com/accounts/ui/avatar_2x.png", 1, "profile-img-card"], ["name", "form", "novalidate", "", 3, "ngSubmit", 4, "ngIf"], ["class", "alert alert-success", 4, "ngIf"], ["name", "form", "novalidate", "", 3, "ngSubmit"], ["f", "ngForm"], [1, "form-group"], ["for", "username"], ["type", "text", "name", "username", "required", "", "minlength", "3", "maxlength", "20", 1, "form-control", 3, "ngModel", "ngModelChange"], ["username", "ngModel"], ["class", "alert-danger", 4, "ngIf"], ["for", "email"], ["type", "email", "name", "email", "required", "", "email", "", 1, "form-control", 3, "ngModel", "ngModelChange"], ["email", "ngModel"], ["for", "password"], ["type", "password", "name", "password", "required", "", "minlength", "6", 1, "form-control", 3, "ngModel", "ngModelChange"], ["password", "ngModel"], ["for", "privilege"], ["type", "privilege", "name", "privilege", "id", "pet-select", "required", "", 1, "form-control", 3, "ngModel", "ngModelChange"], ["roles", "ngModel"], ["value", ""], ["value", "admin"], ["value", "mod"], ["value", "user"], [1, "btn", "btn-primary", "btn-block"], [1, "alert", "alert-warning"], ["class", "alert alert-warning", 4, "ngIf"], [1, "alert-danger"], [4, "ngIf"], [1, "alert", "alert-success"]], template: function BoardAdminComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "header", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](6, "img", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, BoardAdminComponent_form_7_Template, 41, 9, "form", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](8, BoardAdminComponent_div_8_Template, 2, 0, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx.content);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.isSuccessful);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isSuccessful);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgForm, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.EmailValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgSelectMultipleOption"]], styles: ["label[_ngcontent-%COMP%] {\r\n  display: block;\r\n  margin-top: 10px;\r\n}\r\n\r\n.card-container.card[_ngcontent-%COMP%] {\r\n  max-width: 400px !important;\r\n  padding: 40px 40px;\r\n}\r\n\r\n.card[_ngcontent-%COMP%] {\r\n  background-color: #f7f7f7;\r\n  padding: 20px 25px 30px;\r\n  margin: 0 auto 25px;\r\n  margin-top: 50px;\r\n  border-radius: 2px;\r\n  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n.profile-img-card[_ngcontent-%COMP%] {\r\n  width: 96px;\r\n  height: 96px;\r\n  margin: 0 auto 10px;\r\n  display: block;\r\n  border-radius: 50%;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJvYXJkLWFkbWluLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxjQUFjO0VBQ2QsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsMkJBQTJCO0VBQzNCLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6Qix1QkFBdUI7RUFDdkIsbUJBQW1CO0VBQ25CLGdCQUFnQjtFQUdoQixrQkFBa0I7RUFHbEIsMENBQTBDO0FBQzVDOztBQUVBO0VBQ0UsV0FBVztFQUNYLFlBQVk7RUFDWixtQkFBbUI7RUFDbkIsY0FBYztFQUdkLGtCQUFrQjtBQUNwQiIsImZpbGUiOiJib2FyZC1hZG1pbi5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsibGFiZWwge1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIG1hcmdpbi10b3A6IDEwcHg7XHJcbn1cclxuXHJcbi5jYXJkLWNvbnRhaW5lci5jYXJkIHtcclxuICBtYXgtd2lkdGg6IDQwMHB4ICFpbXBvcnRhbnQ7XHJcbiAgcGFkZGluZzogNDBweCA0MHB4O1xyXG59XHJcblxyXG4uY2FyZCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y3ZjdmNztcclxuICBwYWRkaW5nOiAyMHB4IDI1cHggMzBweDtcclxuICBtYXJnaW46IDAgYXV0byAyNXB4O1xyXG4gIG1hcmdpbi10b3A6IDUwcHg7XHJcbiAgLW1vei1ib3JkZXItcmFkaXVzOiAycHg7XHJcbiAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAycHg7XHJcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xyXG4gIC1tb3otYm94LXNoYWRvdzogMHB4IDJweCAycHggcmdiYSgwLCAwLCAwLCAwLjMpO1xyXG4gIC13ZWJraXQtYm94LXNoYWRvdzogMHB4IDJweCAycHggcmdiYSgwLCAwLCAwLCAwLjMpO1xyXG4gIGJveC1zaGFkb3c6IDBweCAycHggMnB4IHJnYmEoMCwgMCwgMCwgMC4zKTtcclxufVxyXG5cclxuLnByb2ZpbGUtaW1nLWNhcmQge1xyXG4gIHdpZHRoOiA5NnB4O1xyXG4gIGhlaWdodDogOTZweDtcclxuICBtYXJnaW46IDAgYXV0byAxMHB4O1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIC1tb3otYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gIC13ZWJraXQtYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcclxufVxyXG4iXX0= */"] });


/***/ }),

/***/ 49586:
/*!**************************************************************!*\
  !*** ./src/app/board-moderator/board-moderator.component.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BoardModeratorComponent": function() { return /* binding */ BoardModeratorComponent; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/user.service */ 55089);


class BoardModeratorComponent {
    constructor(userService) {
        this.userService = userService;
    }
    ngOnInit() {
        this.userService.getModeratorBoard().subscribe(data => {
            this.content = data;
        }, err => {
            this.content = JSON.parse(err.error).message;
        });
    }
}
BoardModeratorComponent.ɵfac = function BoardModeratorComponent_Factory(t) { return new (t || BoardModeratorComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_user_service__WEBPACK_IMPORTED_MODULE_0__.UserService)); };
BoardModeratorComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: BoardModeratorComponent, selectors: [["app-board-moderator"]], decls: 4, vars: 1, consts: [[1, "container"], [1, "jumbotron"]], template: function BoardModeratorComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "header", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.content);
    } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJib2FyZC1tb2RlcmF0b3IuY29tcG9uZW50LmNzcyJ9 */"] });


/***/ }),

/***/ 14652:
/*!****************************************************!*\
  !*** ./src/app/board-user/board-user.component.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BoardUserComponent": function() { return /* binding */ BoardUserComponent; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/user.service */ 55089);



class BoardUserComponent {
    constructor(userService /*, private eventBusService: EventBusService*/) {
        this.userService = userService;
        this.user = null;
        this.onLogin = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
        this.onLogout = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
        this.onCreateAccount = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
    }
    ngOnInit() {
        this.userService.getUserBoard().subscribe(data => {
            this.content = data;
        }, err => {
            this.content = err.error.message || err.error || err.message;
            /*if (err.status === 403)
              this.eventBusService.emit(new EventData('logout', null));*/
        });
    }
}
BoardUserComponent.ɵfac = function BoardUserComponent_Factory(t) { return new (t || BoardUserComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_user_service__WEBPACK_IMPORTED_MODULE_0__.UserService)); };
BoardUserComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: BoardUserComponent, selectors: [["app-board-user"]], inputs: { user: "user" }, outputs: { onLogin: "onLogin", onLogout: "onLogout", onCreateAccount: "onCreateAccount" }, decls: 23, vars: 0, consts: [[1, "container"], [1, "background", "jumbotron"], [1, "font_0"], [1, "", 2, "font-size", "44px"], ["type", "text/html", "src", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtrustConstantResourceUrl"] `https://www.tadirantele.com/`, "height", "300px", "width", "100%"], ["src", "https://localhost:8445/accRealTime", "sandbox", "allow-top-navigation-by-user-activation allow-same-origin allow-scripts allow-popups allow-forms", "name", "iframe_a", "height", "300px", "width", "100%", "title", "Iframe Example"], ["href", "https://172.28.8.245:8443/aeonix/mainForm.jsf", "target", "iframe_a"], ["href", "https://en.wikipedia.org/wiki/Avocado", "id", "testid", "target", "iframe_a"], ["href", "https://172.28.1.130:8445/accRealTime", "target", "iframe_a"]], template: function BoardUserComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "header", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "h1", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "span", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "content");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "embed", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "Iframe - Target for a Link");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "\n. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](11, "iframe", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14, "aeonix");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "a", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, "wikipedia");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "a", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "accRealTime");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "When the target attribute of a link matches the name of an iframe, the link will open in the iframe.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } }, styles: [".wrapper[_ngcontent-%COMP%] {\r\n  font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;\r\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1);\r\n  padding: 15px 20px;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n}\r\n\r\nsvg[_ngcontent-%COMP%] {\r\n  display: inline-block;\r\n  vertical-align: top;\r\n}\r\n\r\nh1[_ngcontent-%COMP%] {\r\n  font-weight: 900;\r\n  font-size: 20px;\r\n  line-height: 1;\r\n  margin: 6px 0 6px 10px;\r\n  display: inline-block;\r\n  vertical-align: top;\r\n}\r\n\r\nbutton[_ngcontent-%COMP%]    + button[_ngcontent-%COMP%] {\r\n  margin-left: 10px;\r\n}\r\n\r\n.welcome[_ngcontent-%COMP%] {\r\n  color: #333;\r\n  font-size: 14px;\r\n  margin-right: 10px;\r\n}\r\n\r\n.font_0[_ngcontent-%COMP%] {\r\n  font-size:44px;\r\n  text-align:left;\r\n  color:#FFFFFF;\r\n}\r\n\r\n.alert[_ngcontent-%COMP%], .alert-success[_ngcontent-%COMP%] {\r\n  width: 50%;\r\n}\r\n\r\n.background[_ngcontent-%COMP%] {\r\n  background-size: cover;\r\n  background-origin: border-box;\r\n  background-image: url('Background.webp');\r\n  \r\n  background-repeat: no-repeat;\r\n  background-position: top left;\r\n\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJvYXJkLXVzZXIuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLDBFQUEwRTtFQUMxRSwyQ0FBMkM7RUFDM0Msa0JBQWtCO0VBQ2xCLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsOEJBQThCO0FBQ2hDOztBQUVBO0VBQ0UscUJBQXFCO0VBQ3JCLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixlQUFlO0VBQ2YsY0FBYztFQUNkLHNCQUFzQjtFQUN0QixxQkFBcUI7RUFDckIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsV0FBVztFQUNYLGVBQWU7RUFDZixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsZUFBZTtFQUNmLGFBQWE7QUFDZjs7QUFFQTtFQUNFLFVBQVU7QUFDWjs7QUFHQTtFQUNFLHNCQUFzQjtFQUN0Qiw2QkFBNkI7RUFDN0Isd0NBQWlFO0VBQ2pFLDJFQUEyRTtFQUMzRSw0QkFBNEI7RUFDNUIsNkJBQTZCOztBQUUvQjs7QUFFQTs7Ozs7Ozs7O0NBU0MiLCJmaWxlIjoiYm9hcmQtdXNlci5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLndyYXBwZXIge1xyXG4gIGZvbnQtZmFtaWx5OiAnTnVuaXRvIFNhbnMnLCAnSGVsdmV0aWNhIE5ldWUnLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xyXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMSk7XHJcbiAgcGFkZGluZzogMTVweCAyMHB4O1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbn1cclxuXHJcbnN2ZyB7XHJcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gIHZlcnRpY2FsLWFsaWduOiB0b3A7XHJcbn1cclxuXHJcbmgxIHtcclxuICBmb250LXdlaWdodDogOTAwO1xyXG4gIGZvbnQtc2l6ZTogMjBweDtcclxuICBsaW5lLWhlaWdodDogMTtcclxuICBtYXJnaW46IDZweCAwIDZweCAxMHB4O1xyXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xyXG59XHJcblxyXG5idXR0b24gKyBidXR0b24ge1xyXG4gIG1hcmdpbi1sZWZ0OiAxMHB4O1xyXG59XHJcblxyXG4ud2VsY29tZSB7XHJcbiAgY29sb3I6ICMzMzM7XHJcbiAgZm9udC1zaXplOiAxNHB4O1xyXG4gIG1hcmdpbi1yaWdodDogMTBweDtcclxufVxyXG5cclxuLmZvbnRfMCB7XHJcbiAgZm9udC1zaXplOjQ0cHg7XHJcbiAgdGV4dC1hbGlnbjpsZWZ0O1xyXG4gIGNvbG9yOiNGRkZGRkY7XHJcbn1cclxuXHJcbi5hbGVydCwgLmFsZXJ0LXN1Y2Nlc3Mge1xyXG4gIHdpZHRoOiA1MCU7XHJcbn1cclxuXHJcblxyXG4uYmFja2dyb3VuZCB7XHJcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcclxuICBiYWNrZ3JvdW5kLW9yaWdpbjogYm9yZGVyLWJveDtcclxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoLi4vX3NlcnZpY2VzL2Fzc2V0cy9pbWFnZXMvQmFja2dyb3VuZC53ZWJwKTtcclxuICAvKmxpbmVhci1ncmFkaWVudCh0byByaWdodCwgcmdiYSgzMCwgNzUsIDExNSwgMSksIHJnYmEoMjU1LCAyNTUsIDI1NSwgMCkpOyovXHJcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcclxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiB0b3AgbGVmdDtcclxuXHJcbn1cclxuXHJcbi8qXHJcbmlmcmFtZSB7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbn1cclxuXHJcbi5vdXRwdXQge1xyXG4gIGJhY2tncm91bmQ6ICNlZWU7XHJcbn1cclxuKi9cclxuIl19 */"] });


/***/ }),

/***/ 45067:
/*!****************************************!*\
  !*** ./src/app/home/home.component.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HomeComponent": function() { return /* binding */ HomeComponent; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/user.service */ 55089);


class HomeComponent {
    constructor(userService) {
        this.userService = userService;
        this.ACC_VERSION = 'ACC_VERSION';
        this.content = 'Aeonix | Tadiran Telecom';
    }
    ngOnInit() {
        this.userService.getPublicContent().subscribe(data => { this.content = data; }, err => { this.content = JSON.parse(err.error).message; });
        this.userService.getAccVersion().subscribe(data => { this.ACC_VERSION = data; }, err => { this.ACC_VERSION = JSON.parse(err.error).message; });
    }
}
HomeComponent.ɵfac = function HomeComponent_Factory(t) { return new (t || HomeComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_user_service__WEBPACK_IMPORTED_MODULE_0__.UserService)); };
HomeComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: HomeComponent, selectors: [["app-home"]], decls: 29, vars: 2, consts: [[1, "container"], [1, "background", "jumbotron"], [1, "font_0"], [1, "", 2, "font-size", "44px"], [1, "fa-pull-right", "bg-image", "card", "shadow-1-strong", "card-img"], [1, "card-body", "text-white"], [1, "card-title"], [1, "card-text"], ["href", "#!", 1, "btn", "btn-outline-light"], ["role", "alert", 1, "alert", "alert-success"], [1, "alert-heading"], [1, "mb-0"]], template: function HomeComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "header", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "h1", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "span", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "dl");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "dt");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "dd");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "aside");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "h5", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "Card title");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, " Some quick example text to build on the card title and make up the bulk of the card's content. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "a", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "Button");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "h4", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, "Well done!");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](25, "Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](26, "hr");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "p", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](28, "Whenever you need to, be sure to use margin utilities to keep things nice and tidy.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.content);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.ACC_VERSION);
    } }, styles: ["._1Q9if[_ngcontent-%COMP%], ._2Hij5[_ngcontent-%COMP%] {\r\n  word-wrap: break-word;\r\n  overflow-wrap: break-word;\r\n  text-align: start;\r\n  pointer-events: none;\r\n}\r\n\r\n._3SQN-[_ngcontent-%COMP%], ._3wnIc[_ngcontent-%COMP%] {\r\n  position: absolute;\r\n  top: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n\r\n.multi-bg-example[_ngcontent-%COMP%] {\r\n  width: 980px;\r\n  height: 289px;\r\n  -o-object-fit: cover;\r\n     object-fit: cover;\r\n  -o-object-position: 50% 50%;\r\n     object-position: 50% 50%;\r\n}\r\n\r\n.font_0[_ngcontent-%COMP%] {\r\n  font-size:44px;\r\n  text-align:left;\r\n  color:#FFFFFF;\r\n}\r\n\r\n.alert[_ngcontent-%COMP%], .alert-success[_ngcontent-%COMP%] {\r\n  width: 48%;\r\n}\r\n\r\n.background[_ngcontent-%COMP%] {\r\n  background-size: cover;\r\n  background-origin: border-box;\r\n  background-image: url('Background.webp');\r\n  \r\n  background-repeat: no-repeat;\r\n  background-position: top left;\r\n\r\n}\r\n\r\n.bg-image[_ngcontent-%COMP%] {\r\n  background-image: url('contact-center.jpg');\r\n  background-position: top right;\r\n  padding-bottom: 100px;\r\n}\r\n\r\naside[_ngcontent-%COMP%] {\r\n  width: 48%;\r\n  padding-left: .1rem;\r\n  margin-left: .1rem;\r\n  float: right;\r\n  box-shadow: inset 5px 0 5px -5px #29627e;\r\n  font-style: italic;\r\n  color: #29627e;\r\n\r\n}\r\n\r\naside[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%] {\r\n  margin: .20rem;\r\n}\r\n\r\np[_ngcontent-%COMP%] {\r\n  font-family: 'Fira Sans', sans-serif;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHFCQUFxQjtFQUNyQix5QkFBeUI7RUFDekIsaUJBQWlCO0VBQ2pCLG9CQUFvQjtBQUN0Qjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixNQUFNO0VBQ04sV0FBVztFQUNYLFlBQVk7QUFDZDs7QUFFQTtFQUNFLFlBQVk7RUFDWixhQUFhO0VBQ2Isb0JBQWlCO0tBQWpCLGlCQUFpQjtFQUNqQiwyQkFBd0I7S0FBeEIsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0UsY0FBYztFQUNkLGVBQWU7RUFDZixhQUFhO0FBQ2Y7O0FBRUE7RUFDRSxVQUFVO0FBQ1o7O0FBR0E7RUFDRSxzQkFBc0I7RUFDdEIsNkJBQTZCO0VBQzdCLHdDQUFpRTtFQUNqRSwyRUFBMkU7RUFDM0UsNEJBQTRCO0VBQzVCLDZCQUE2Qjs7QUFFL0I7O0FBRUE7RUFDRSwyQ0FBb0U7RUFDcEUsOEJBQThCO0VBQzlCLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLFVBQVU7RUFDVixtQkFBbUI7RUFDbkIsa0JBQWtCO0VBQ2xCLFlBQVk7RUFDWix3Q0FBd0M7RUFDeEMsa0JBQWtCO0VBQ2xCLGNBQWM7O0FBRWhCOztBQUNBO0VBQ0UsY0FBYztBQUNoQjs7QUFFQTtFQUNFLG9DQUFvQztBQUN0QyIsImZpbGUiOiJob21lLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuXzFROWlmLCAuXzJIaWo1IHtcclxuICB3b3JkLXdyYXA6IGJyZWFrLXdvcmQ7XHJcbiAgb3ZlcmZsb3ctd3JhcDogYnJlYWstd29yZDtcclxuICB0ZXh0LWFsaWduOiBzdGFydDtcclxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxufVxyXG5cclxuLl8zU1FOLSwgLl8zd25JYyB7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogMDtcclxuICB3aWR0aDogMTAwJTtcclxuICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuXHJcbi5tdWx0aS1iZy1leGFtcGxlIHtcclxuICB3aWR0aDogOTgwcHg7XHJcbiAgaGVpZ2h0OiAyODlweDtcclxuICBvYmplY3QtZml0OiBjb3ZlcjtcclxuICBvYmplY3QtcG9zaXRpb246IDUwJSA1MCU7XHJcbn1cclxuXHJcbi5mb250XzAge1xyXG4gIGZvbnQtc2l6ZTo0NHB4O1xyXG4gIHRleHQtYWxpZ246bGVmdDtcclxuICBjb2xvcjojRkZGRkZGO1xyXG59XHJcblxyXG4uYWxlcnQsIC5hbGVydC1zdWNjZXNzIHtcclxuICB3aWR0aDogNDglO1xyXG59XHJcblxyXG5cclxuLmJhY2tncm91bmQge1xyXG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XHJcbiAgYmFja2dyb3VuZC1vcmlnaW46IGJvcmRlci1ib3g7XHJcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKC4uL19zZXJ2aWNlcy9hc3NldHMvaW1hZ2VzL0JhY2tncm91bmQud2VicCk7XHJcbiAgLypsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsIHJnYmEoMzAsIDc1LCAxMTUsIDEpLCByZ2JhKDI1NSwgMjU1LCAyNTUsIDApKTsqL1xyXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XHJcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogdG9wIGxlZnQ7XHJcblxyXG59XHJcblxyXG4uYmctaW1hZ2Uge1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCguLi9fc2VydmljZXMvYXNzZXRzL2ltYWdlcy9jb250YWN0LWNlbnRlci5qcGcpO1xyXG4gIGJhY2tncm91bmQtcG9zaXRpb246IHRvcCByaWdodDtcclxuICBwYWRkaW5nLWJvdHRvbTogMTAwcHg7XHJcbn1cclxuXHJcbmFzaWRlIHtcclxuICB3aWR0aDogNDglO1xyXG4gIHBhZGRpbmctbGVmdDogLjFyZW07XHJcbiAgbWFyZ2luLWxlZnQ6IC4xcmVtO1xyXG4gIGZsb2F0OiByaWdodDtcclxuICBib3gtc2hhZG93OiBpbnNldCA1cHggMCA1cHggLTVweCAjMjk2MjdlO1xyXG4gIGZvbnQtc3R5bGU6IGl0YWxpYztcclxuICBjb2xvcjogIzI5NjI3ZTtcclxuXHJcbn1cclxuYXNpZGUgPiBwIHtcclxuICBtYXJnaW46IC4yMHJlbTtcclxufVxyXG5cclxucCB7XHJcbiAgZm9udC1mYW1pbHk6ICdGaXJhIFNhbnMnLCBzYW5zLXNlcmlmO1xyXG59XHJcbiJdfQ== */"] });


/***/ }),

/***/ 83353:
/*!****************************************************!*\
  !*** ./src/app/login/button2/button2.component.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Button2Component": function() { return /* binding */ Button2Component; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 38583);



const _c0 = function (a0) { return { "background-color": a0 }; };
class Button2Component {
    constructor() {
        /**
         * Is this the principal call to action on the page?
         */
        this.primary = false;
        /**
         * How large should the button be?
         */
        this.size = 'medium';
        /**
         * Button contents
         *
         * @required
         */
        this.label = 'accGateButton2';
        /**
         * Optional click handler
         */
        this.onClick = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    }
    get classes() {
        const mode = this.primary ? 'storybook-button2--primary' : 'storybook-button2--secondary';
        return ['storybook-button2', `storybook-button2--${this.size}`, mode];
    }
}
Button2Component.ɵfac = function Button2Component_Factory(t) { return new (t || Button2Component)(); };
Button2Component.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: Button2Component, selectors: [["storybook-button2"]], inputs: { primary: "primary", backgroundColor: "backgroundColor", size: "size", label: "label" }, outputs: { onClick: "onClick" }, decls: 2, vars: 5, consts: [["type", "button", 3, "ngClass", "ngStyle", "click"]], template: function Button2Component_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function Button2Component_Template_button_click_0_listener($event) { return ctx.onClick.emit($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx.classes)("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](3, _c0, ctx.backgroundColor));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.label, " ");
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgStyle], styles: [".storybook-button2[_ngcontent-%COMP%] {\n  font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  font-weight: 700;\n  border: 0;\n  border-radius: 3em;\n  cursor: pointer;\n  display: inline-block;\n  line-height: 1;\n}\n.storybook-button2--primary[_ngcontent-%COMP%] {\n  color: white;\n  background-color: #1ea7fd;\n}\n.storybook-button2--secondary[_ngcontent-%COMP%] {\n  color: #333;\n  background-color: transparent;\n  box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;\n}\n.storybook-button2--small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  padding: 10px 16px;\n}\n.storybook-button2--medium[_ngcontent-%COMP%] {\n  font-size: 14px;\n  padding: 11px 20px;\n}\n.storybook-button2--large[_ngcontent-%COMP%] {\n  font-size: 16px;\n  padding: 12px 24px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1dHRvbjIuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsMEVBQTBFO0VBQzFFLGdCQUFnQjtFQUNoQixTQUFTO0VBQ1Qsa0JBQWtCO0VBQ2xCLGVBQWU7RUFDZixxQkFBcUI7RUFDckIsY0FBYztBQUNoQjtBQUNBO0VBQ0UsWUFBWTtFQUNaLHlCQUF5QjtBQUMzQjtBQUNBO0VBQ0UsV0FBVztFQUNYLDZCQUE2QjtFQUM3QixxREFBcUQ7QUFDdkQ7QUFDQTtFQUNFLGVBQWU7RUFDZixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGVBQWU7RUFDZixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGVBQWU7RUFDZixrQkFBa0I7QUFDcEIiLCJmaWxlIjoiYnV0dG9uMi5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuc3Rvcnlib29rLWJ1dHRvbjIge1xuICBmb250LWZhbWlseTogJ051bml0byBTYW5zJywgJ0hlbHZldGljYSBOZXVlJywgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgYm9yZGVyOiAwO1xuICBib3JkZXItcmFkaXVzOiAzZW07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBsaW5lLWhlaWdodDogMTtcbn1cbi5zdG9yeWJvb2stYnV0dG9uMi0tcHJpbWFyeSB7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzFlYTdmZDtcbn1cbi5zdG9yeWJvb2stYnV0dG9uMi0tc2Vjb25kYXJ5IHtcbiAgY29sb3I6ICMzMzM7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBib3gtc2hhZG93OiByZ2JhKDAsIDAsIDAsIDAuMTUpIDBweCAwcHggMHB4IDFweCBpbnNldDtcbn1cbi5zdG9yeWJvb2stYnV0dG9uMi0tc21hbGwge1xuICBmb250LXNpemU6IDEycHg7XG4gIHBhZGRpbmc6IDEwcHggMTZweDtcbn1cbi5zdG9yeWJvb2stYnV0dG9uMi0tbWVkaXVtIHtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBwYWRkaW5nOiAxMXB4IDIwcHg7XG59XG4uc3Rvcnlib29rLWJ1dHRvbjItLWxhcmdlIHtcbiAgZm9udC1zaXplOiAxNnB4O1xuICBwYWRkaW5nOiAxMnB4IDI0cHg7XG59XG4iXX0= */"] });


/***/ }),

/***/ 79325:
/*!****************************************************!*\
  !*** ./src/app/login/button3/button3.component.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Button3Component": function() { return /* binding */ Button3Component; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 38583);



const _c0 = function (a0) { return { "background-color": a0 }; };
class Button3Component {
    constructor() {
        /**
         * Is this the principal call to action on the page?
         */
        this.primary = false;
        /**
         * How large should the button be?
         */
        this.size = 'medium';
        /**
         * Button contents
         *
         * @required
         */
        this.label = 'accGateButton2';
        /**
         * Optional click handler
         */
        this.onClick = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    }
    get classes() {
        const mode = this.primary ? 'storybook-button3--primary' : 'storybook-button3--secondary';
        return ['storybook-button3', `storybook-button3--${this.size}`, mode];
    }
}
Button3Component.ɵfac = function Button3Component_Factory(t) { return new (t || Button3Component)(); };
Button3Component.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: Button3Component, selectors: [["storybook-button3"]], inputs: { primary: "primary", backgroundColor: "backgroundColor", size: "size", label: "label" }, outputs: { onClick: "onClick" }, decls: 2, vars: 5, consts: [["type", "button", 3, "ngClass", "ngStyle", "click"]], template: function Button3Component_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function Button3Component_Template_button_click_0_listener($event) { return ctx.onClick.emit($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx.classes)("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](3, _c0, ctx.backgroundColor));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.label, "\n");
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgStyle], styles: [".storybook-button3[_ngcontent-%COMP%] {\r\n  font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;\r\n  font-weight: 700;\r\n  border: 0;\r\n  border-radius: 3em;\r\n  cursor: pointer;\r\n  display: inline-block;\r\n  line-height: 1;\r\n}\r\n.storybook-button3--primary[_ngcontent-%COMP%] {\r\n  color: white;\r\n  background-color: #1ea7fd;\r\n}\r\n.storybook-button3--secondary[_ngcontent-%COMP%] {\r\n  color: #333;\r\n  background-color: transparent;\r\n  box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;\r\n}\r\n.storybook-button3--small[_ngcontent-%COMP%] {\r\n  font-size: 12px;\r\n  padding: 10px 16px;\r\n}\r\n.storybook-button3--medium[_ngcontent-%COMP%] {\r\n  font-size: 14px;\r\n  padding: 11px 20px;\r\n}\r\n.storybook-button3--large[_ngcontent-%COMP%] {\r\n  font-size: 16px;\r\n  padding: 12px 24px;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1dHRvbjMuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLDBFQUEwRTtFQUMxRSxnQkFBZ0I7RUFDaEIsU0FBUztFQUNULGtCQUFrQjtFQUNsQixlQUFlO0VBQ2YscUJBQXFCO0VBQ3JCLGNBQWM7QUFDaEI7QUFDQTtFQUNFLFlBQVk7RUFDWix5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLFdBQVc7RUFDWCw2QkFBNkI7RUFDN0IscURBQXFEO0FBQ3ZEO0FBQ0E7RUFDRSxlQUFlO0VBQ2Ysa0JBQWtCO0FBQ3BCO0FBQ0E7RUFDRSxlQUFlO0VBQ2Ysa0JBQWtCO0FBQ3BCO0FBQ0E7RUFDRSxlQUFlO0VBQ2Ysa0JBQWtCO0FBQ3BCIiwiZmlsZSI6ImJ1dHRvbjMuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5zdG9yeWJvb2stYnV0dG9uMyB7XHJcbiAgZm9udC1mYW1pbHk6ICdOdW5pdG8gU2FucycsICdIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7XHJcbiAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICBib3JkZXI6IDA7XHJcbiAgYm9yZGVyLXJhZGl1czogM2VtO1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgbGluZS1oZWlnaHQ6IDE7XHJcbn1cclxuLnN0b3J5Ym9vay1idXR0b24zLS1wcmltYXJ5IHtcclxuICBjb2xvcjogd2hpdGU7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogIzFlYTdmZDtcclxufVxyXG4uc3Rvcnlib29rLWJ1dHRvbjMtLXNlY29uZGFyeSB7XHJcbiAgY29sb3I6ICMzMzM7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcbiAgYm94LXNoYWRvdzogcmdiYSgwLCAwLCAwLCAwLjE1KSAwcHggMHB4IDBweCAxcHggaW5zZXQ7XHJcbn1cclxuLnN0b3J5Ym9vay1idXR0b24zLS1zbWFsbCB7XHJcbiAgZm9udC1zaXplOiAxMnB4O1xyXG4gIHBhZGRpbmc6IDEwcHggMTZweDtcclxufVxyXG4uc3Rvcnlib29rLWJ1dHRvbjMtLW1lZGl1bSB7XHJcbiAgZm9udC1zaXplOiAxNHB4O1xyXG4gIHBhZGRpbmc6IDExcHggMjBweDtcclxufVxyXG4uc3Rvcnlib29rLWJ1dHRvbjMtLWxhcmdlIHtcclxuICBmb250LXNpemU6IDE2cHg7XHJcbiAgcGFkZGluZzogMTJweCAyNHB4O1xyXG59XHJcbiJdfQ== */"] });


/***/ }),

/***/ 32838:
/*!**************************************************!*\
  !*** ./src/app/login/button/button.component.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ButtonComponent": function() { return /* binding */ ButtonComponent; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 38583);



const _c0 = function (a0) { return { "background-color": a0 }; };
class ButtonComponent {
    constructor() {
        /**
         * Is this the principal call to action on the page?
         */
        this.primary = false;
        /**
         * How large should the button be?
         */
        this.size = 'medium';
        /**
         * Button contents
         *
         * @required
         */
        this.label = 'accGateButton';
        /**
         * Optional click handler
         */
        this.onClick = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    }
    get classes() {
        const mode = this.primary ? 'storybook-button--primary' : 'storybook-button--secondary';
        return ['storybook-button', `storybook-button--${this.size}`, mode];
    }
}
ButtonComponent.ɵfac = function ButtonComponent_Factory(t) { return new (t || ButtonComponent)(); };
ButtonComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ButtonComponent, selectors: [["storybook-button"]], inputs: { primary: "primary", backgroundColor: "backgroundColor", size: "size", label: "label" }, outputs: { onClick: "onClick" }, decls: 2, vars: 5, consts: [["type", "button", 3, "ngClass", "ngStyle", "click"]], template: function ButtonComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ButtonComponent_Template_button_click_0_listener($event) { return ctx.onClick.emit($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx.classes)("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](3, _c0, ctx.backgroundColor));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.label, " ");
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgStyle], styles: [".storybook-button[_ngcontent-%COMP%] {\n  font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  font-weight: 700;\n  border: 0;\n  border-radius: 3em;\n  cursor: pointer;\n  display: inline-block;\n  line-height: 1;\n}\n.storybook-button--primary[_ngcontent-%COMP%] {\n  color: white;\n  background-color: #1ea7fd;\n}\n.storybook-button--secondary[_ngcontent-%COMP%] {\n  color: #333;\n  background-color: transparent;\n  box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;\n}\n.storybook-button--small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  padding: 10px 16px;\n}\n.storybook-button--medium[_ngcontent-%COMP%] {\n  font-size: 14px;\n  padding: 11px 20px;\n}\n.storybook-button--large[_ngcontent-%COMP%] {\n  font-size: 16px;\n  padding: 12px 24px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1dHRvbi5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsMEVBQTBFO0VBQzFFLGdCQUFnQjtFQUNoQixTQUFTO0VBQ1Qsa0JBQWtCO0VBQ2xCLGVBQWU7RUFDZixxQkFBcUI7RUFDckIsY0FBYztBQUNoQjtBQUNBO0VBQ0UsWUFBWTtFQUNaLHlCQUF5QjtBQUMzQjtBQUNBO0VBQ0UsV0FBVztFQUNYLDZCQUE2QjtFQUM3QixxREFBcUQ7QUFDdkQ7QUFDQTtFQUNFLGVBQWU7RUFDZixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGVBQWU7RUFDZixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGVBQWU7RUFDZixrQkFBa0I7QUFDcEIiLCJmaWxlIjoiYnV0dG9uLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuc3Rvcnlib29rLWJ1dHRvbiB7XG4gIGZvbnQtZmFtaWx5OiAnTnVuaXRvIFNhbnMnLCAnSGVsdmV0aWNhIE5ldWUnLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xuICBmb250LXdlaWdodDogNzAwO1xuICBib3JkZXI6IDA7XG4gIGJvcmRlci1yYWRpdXM6IDNlbTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGxpbmUtaGVpZ2h0OiAxO1xufVxuLnN0b3J5Ym9vay1idXR0b24tLXByaW1hcnkge1xuICBjb2xvcjogd2hpdGU7XG4gIGJhY2tncm91bmQtY29sb3I6ICMxZWE3ZmQ7XG59XG4uc3Rvcnlib29rLWJ1dHRvbi0tc2Vjb25kYXJ5IHtcbiAgY29sb3I6ICMzMzM7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBib3gtc2hhZG93OiByZ2JhKDAsIDAsIDAsIDAuMTUpIDBweCAwcHggMHB4IDFweCBpbnNldDtcbn1cbi5zdG9yeWJvb2stYnV0dG9uLS1zbWFsbCB7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgcGFkZGluZzogMTBweCAxNnB4O1xufVxuLnN0b3J5Ym9vay1idXR0b24tLW1lZGl1bSB7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgcGFkZGluZzogMTFweCAyMHB4O1xufVxuLnN0b3J5Ym9vay1idXR0b24tLWxhcmdlIHtcbiAgZm9udC1zaXplOiAxNnB4O1xuICBwYWRkaW5nOiAxMnB4IDI0cHg7XG59XG4iXX0= */"] });


/***/ }),

/***/ 98458:
/*!******************************************!*\
  !*** ./src/app/login/login.component.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LoginComponent": function() { return /* binding */ LoginComponent; }
/* harmony export */ });
/* harmony import */ var _register_form_register_form_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./register-form/register-form.component */ 70996);
/* harmony import */ var _replace_pass_form_replace_pass_form_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./replace-pass-form/replace-pass-form.component */ 4959);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_services/auth.service */ 88368);
/* harmony import */ var _services_token_storage_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_services/token-storage.service */ 93590);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 39895);
/* harmony import */ var mdb_angular_ui_kit_modal__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! mdb-angular-ui-kit/modal */ 25303);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ 38583);
/* harmony import */ var _button_button_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./button/button.component */ 32838);
/* harmony import */ var _button2_button2_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./button2/button2.component */ 83353);
/* harmony import */ var _button3_button3_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./button3/button3.component */ 79325);
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! angular-bootstrap-md */ 49260);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/forms */ 3679);
/* harmony import */ var mdb_angular_ui_kit_popover__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! mdb-angular-ui-kit/popover */ 69147);














function LoginComponent_form_3_div_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Username is required! ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
} }
function LoginComponent_form_3_div_13_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "Password is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
} }
function LoginComponent_form_3_div_13_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Password must be at least 1 characters ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
} }
function LoginComponent_form_3_div_13_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](1, LoginComponent_form_3_div_13_div_1_Template, 2, 0, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](2, LoginComponent_form_3_div_13_div_2_Template, 2, 0, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", _r5.errors.required);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", _r5.errors.minlength);
} }
function LoginComponent_form_3_div_22_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" Login failed: ", ctx_r8.loginErrorMessage, " ");
} }
function LoginComponent_form_3_Template(rf, ctx) { if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "form", 12, 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngSubmit", function LoginComponent_form_3_Template_form_ngSubmit_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r12); const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](1); const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](); return _r2.form.valid && ctx_r11.onSubmit(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "label", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4, "Username");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "input", 16, 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function LoginComponent_form_3_Template_input_ngModelChange_5_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r12); const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](); return ctx_r13.form.username = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](7, LoginComponent_form_3_div_7_Template, 2, 0, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](8, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "label", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](10, "Password");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](11, "input", 20, 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function LoginComponent_form_3_Template_input_ngModelChange_11_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r12); const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](); return ctx_r14.form.password = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](13, LoginComponent_form_3_div_13_Template, 3, 2, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](14, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](15, "button", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](16, "Login");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](17, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](18, "a", 23, 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("mouseover", function LoginComponent_form_3_Template_a_mouseover_18_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r12); const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](19); return _r7.show(); })("mouseleave", function LoginComponent_form_3_Template_a_mouseleave_18_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r12); const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](19); return _r7.hide(); })("click", function LoginComponent_form_3_Template_a_click_18_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r12); const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](); return ctx_r17.openReplacePassword(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](20, " Forgot password? ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](21, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](22, LoginComponent_form_3_div_22_Template, 2, 1, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](1);
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](6);
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](12);
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngModel", ctx_r0.form.username);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", _r3.errors && _r2.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngModel", ctx_r0.form.password);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", _r5.errors && _r2.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", _r2.submitted && ctx_r0.isLoginFailed);
} }
function LoginComponent_div_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" Logged in as ", ctx_r1.roles, ". ");
} }
//import {  Router } from '@angular/router';
class LoginComponent {
    constructor(authService, tokenStorage, router, registerFormService, replacePassFormService) {
        this.authService = authService;
        this.tokenStorage = tokenStorage;
        this.router = router;
        this.registerFormService = registerFormService;
        this.replacePassFormService = replacePassFormService;
        this.registerFormRef = null;
        this.replacePassFormRef = null;
        this.form = {
            username: null,
            password: null //new FormControl('zaqwsx', Validators.min(2))
        };
        this.isLoggedIn = false;
        this.isLoginFailed = false;
        this.loginErrorMessage = '';
        this.roles = [];
        this.user = null;
    }
    doLogout() {
        this.user = null;
    }
    doLogin() {
        this.user = { name: 'Jane Doe' };
    }
    doCreateAccount() {
        this.user = { name: 'Jane Doe' };
    }
    ngOnInit() {
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
        this.openRegisterForm().then((val) => {
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
        }, (err) => console.error(err));
    }
    openRegisterForm() {
        return this.registerFormService.open(_register_form_register_form_component__WEBPACK_IMPORTED_MODULE_0__.RegisterFormComponent).onClose.toPromise();
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
        this.replacePassFormService.open(_replace_pass_form_replace_pass_form_component__WEBPACK_IMPORTED_MODULE_1__.ReplacePassFormComponent);
    }
    onSubmit() {
        const { username, password } = this.form;
        this.authService.login(username, password).subscribe(data => {
            this.tokenStorage.saveToken(data.accessToken);
            this.tokenStorage.saveRefreshToken(data.refreshToken);
            this.tokenStorage.saveUser(data);
            this.isLoginFailed = false;
            this.isLoggedIn = true;
            this.roles = this.tokenStorage.getUser().roles;
            this.reloadPage();
        }, err => {
            switch (err.error.message) {
                case "Error: A registry process should be made!":
                    //this.openRegisterForm().then(() => {this.openReplacePassword()});
                    //toPromise((data) => {this.openReplacePassword()});
                    this.openRegisterForm().then((val) => {
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
                    }, (err) => console.error(err));
                    break;
                default:
                    this.loginErrorMessage = err.error.message;
            }
            this.isLoginFailed = true;
        });
    }
    reloadPage() {
        //window.location.reload();
        this.router.navigate(['/profile']).then(() => { window.location.reload(); });
        //var URL = window.location.host+"/profile"; //'http://localhost:4200/user';
        ///window.open(URL);
        //this.router.navigate([]).then(result => {  window.open(window.location.toString(), 'user'); });
    }
}
LoginComponent.ɵfac = function LoginComponent_Factory(t) { return new (t || LoginComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_2__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_services_token_storage_service__WEBPACK_IMPORTED_MODULE_3__.TokenStorageService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_8__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](mdb_angular_ui_kit_modal__WEBPACK_IMPORTED_MODULE_9__.MdbModalService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](mdb_angular_ui_kit_modal__WEBPACK_IMPORTED_MODULE_9__.MdbModalService)); };
LoginComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({ type: LoginComponent, selectors: [["app-login"]], decls: 21, vars: 3, consts: [[1, "col-md-12"], ["id", "main-login-card", 1, "card", "card-container"], ["id", "profile-img", "src", "//ssl.gstatic.com/accounts/ui/avatar_2x.png", 1, "profile-img-card"], ["name", "form", "novalidate", "", 3, "ngSubmit", 4, "ngIf"], [3, "primary"], ["size", "small"], ["size", "large"], ["class", "alert alert-success", 4, "ngIf"], ["id", "tests", 1, "form-check-label", "white-text", "border-bottom-0"], ["for", "tests", 1, "form-check-label", "white-text", 2, "margin-bottom", "1px", "padding", "1px"], ["href", "#/login", 1, "green-text", "font-weight-bold", 3, "click"], ["href", "#/login", 1, "green-text", "font-weight-bold", "pl-2", 3, "click"], ["name", "form", "novalidate", "", 3, "ngSubmit"], ["f", "ngForm"], [1, "form-group"], ["for", "username"], ["type", "text", "name", "username", "placeholder", "ea2", "required", "", 1, "form-control", 3, "ngModel", "ngModelChange"], ["username", "ngModel"], ["class", "alert alert-danger", "role", "alert", 4, "ngIf"], ["for", "password"], ["type", "password", "name", "password", "placeholder", "e1996", "required", "", "minlength", "1", 1, "form-control", 3, "ngModel", "ngModelChange"], ["password", "ngModel"], [1, "btn", "btn-primary", "btn-block"], ["href", "#/login", "mdbPopoverTitle", "Account recovery", "mdbPopover", "To help keep your account safe, we will make sure that it\u2019s really you trying to sign in", 1, "form-check-label", "white-text", 3, "mouseover", "mouseleave", "click"], ["popover", "mdbPopover"], ["role", "alert", 1, "alert", "alert-danger"], [4, "ngIf"], [1, "alert", "alert-success"]], template: function LoginComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "img", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](3, LoginComponent_form_3_Template, 23, 5, "form", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](4, "storybook-button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](5, "storybook-button2", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](6, "storybook-button3", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](7, LoginComponent_div_7_Template, 2, 1, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](8, "mdb-card-footer", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "label", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](10, "R&D test: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](11, "a", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function LoginComponent_Template_a_click_11_listener() { return ctx.openRegisterForm(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](12, "RegistrationForm");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](13, "b");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](14, " ,");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](15, "a", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function LoginComponent_Template_a_click_15_listener() { return ctx.openReplacePassword(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](16, "ReplacePassForm");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](17, "b");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](18, " ,");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](19, "a", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function LoginComponent_Template_a_click_19_listener() { return ctx.test(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](20, "test");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", !ctx.isLoggedIn);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("primary", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.isLoggedIn);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_10__.NgIf, _button_button_component__WEBPACK_IMPORTED_MODULE_4__.ButtonComponent, _button2_button2_component__WEBPACK_IMPORTED_MODULE_5__.Button2Component, _button3_button3_component__WEBPACK_IMPORTED_MODULE_6__.Button3Component, angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_11__.MdbCardFooterComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_12__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_12__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.NgForm, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.MinLengthValidator, mdb_angular_ui_kit_popover__WEBPACK_IMPORTED_MODULE_13__.MdbPopoverDirective, angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_11__.PopoverDirective], styles: ["label[_ngcontent-%COMP%] {\r\n  display: block;\r\n  margin-top: 10px;\r\n}\r\n\r\n.card-container.card[_ngcontent-%COMP%] {\r\n  max-width: 400px !important;\r\n  padding: 10px 10px;\r\n\r\n}\r\n\r\n.card[_ngcontent-%COMP%] {\r\n  background-color: #f7f7f7;\r\n  padding: 20px 25px 30px;\r\n  margin: 0 auto 25px;\r\n  margin-top: 50px;\r\n  border-radius: 2px;\r\n  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n.profile-img-card[_ngcontent-%COMP%] {\r\n  width: 96px;\r\n  height: 96px;\r\n  margin: 0 auto 10px;\r\n  display: block;\r\n  border-radius: 50%;\r\n}\r\n\r\n._1Q9if[_ngcontent-%COMP%], ._2Hij5[_ngcontent-%COMP%] {\r\n  word-wrap: break-word;\r\n  overflow-wrap: break-word;\r\n  text-align: start;\r\n  pointer-events: none;\r\n}\r\n\r\n._3SQN-[_ngcontent-%COMP%], ._3wnIc[_ngcontent-%COMP%] {\r\n  position: absolute;\r\n  top: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n\r\n.multi-bg-example[_ngcontent-%COMP%] {\r\n  width: 980px;\r\n  height: 289px;\r\n  -o-object-fit: cover;\r\n     object-fit: cover;\r\n  -o-object-position: 50% 50%;\r\n     object-position: 50% 50%;\r\n}\r\n\r\n.font_0[_ngcontent-%COMP%] {\r\n  font-size:44px;\r\n  text-align:left;\r\n  color:#FFFFFF;\r\n}\r\n\r\n.alert[_ngcontent-%COMP%], .alert-success[_ngcontent-%COMP%] {\r\n  width: 50%;\r\n}\r\n\r\n.background[_ngcontent-%COMP%] {\r\n  background-size: cover;\r\n  background-origin: border-box;\r\n  background-image: url('Background.webp');\r\n  \r\n  background-repeat: no-repeat;\r\n  background-position: top left;\r\n\r\n}\r\n\r\n.card-footer[_ngcontent-%COMP%] {\r\n  padding-top: 0.1rem;\r\n  padding-right: 0.1rem;\r\n  padding-bottom: 0.1rem;\r\n  padding-left: 0.1rem;\r\n\r\n  border-top: 0.1rem solid rgba(0, 0, 0, 0.125);\r\n\r\n  border-bottom: 0.1rem;\r\n  background-color: rgba(0, 0, 0, 0.03);\r\n\r\n}\r\n\r\n.footer[_ngcontent-%COMP%]   ul.footer-menu[_ngcontent-%COMP%]   li.bold[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\r\n  font-weight: 700;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2luLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxjQUFjO0VBQ2QsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsMkJBQTJCO0VBQzNCLGtCQUFrQjs7QUFFcEI7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsdUJBQXVCO0VBQ3ZCLG1CQUFtQjtFQUNuQixnQkFBZ0I7RUFHaEIsa0JBQWtCO0VBR2xCLDBDQUEwQztBQUM1Qzs7QUFFQTtFQUNFLFdBQVc7RUFDWCxZQUFZO0VBQ1osbUJBQW1CO0VBQ25CLGNBQWM7RUFHZCxrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxxQkFBcUI7RUFDckIseUJBQXlCO0VBQ3pCLGlCQUFpQjtFQUNqQixvQkFBb0I7QUFDdEI7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsTUFBTTtFQUNOLFdBQVc7RUFDWCxZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxZQUFZO0VBQ1osYUFBYTtFQUNiLG9CQUFpQjtLQUFqQixpQkFBaUI7RUFDakIsMkJBQXdCO0tBQXhCLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFLGNBQWM7RUFDZCxlQUFlO0VBQ2YsYUFBYTtBQUNmOztBQUVBO0VBQ0UsVUFBVTtBQUNaOztBQUdBO0VBQ0Usc0JBQXNCO0VBQ3RCLDZCQUE2QjtFQUM3Qix3Q0FBaUU7RUFDakUsMkVBQTJFO0VBQzNFLDRCQUE0QjtFQUM1Qiw2QkFBNkI7O0FBRS9COztBQUVBO0VBQ0UsbUJBQW1CO0VBQ25CLHFCQUFxQjtFQUNyQixzQkFBc0I7RUFDdEIsb0JBQW9COztFQUVwQiw2Q0FBNkM7O0VBRTdDLHFCQUFxQjtFQUNyQixxQ0FBcUM7O0FBRXZDOztBQUVBO0VBQ0UsZ0JBQWdCO0FBQ2xCIiwiZmlsZSI6ImxvZ2luLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJsYWJlbCB7XHJcbiAgZGlzcGxheTogYmxvY2s7XHJcbiAgbWFyZ2luLXRvcDogMTBweDtcclxufVxyXG5cclxuLmNhcmQtY29udGFpbmVyLmNhcmQge1xyXG4gIG1heC13aWR0aDogNDAwcHggIWltcG9ydGFudDtcclxuICBwYWRkaW5nOiAxMHB4IDEwcHg7XHJcblxyXG59XHJcblxyXG4uY2FyZCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y3ZjdmNztcclxuICBwYWRkaW5nOiAyMHB4IDI1cHggMzBweDtcclxuICBtYXJnaW46IDAgYXV0byAyNXB4O1xyXG4gIG1hcmdpbi10b3A6IDUwcHg7XHJcbiAgLW1vei1ib3JkZXItcmFkaXVzOiAycHg7XHJcbiAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAycHg7XHJcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xyXG4gIC1tb3otYm94LXNoYWRvdzogMHB4IDJweCAycHggcmdiYSgwLCAwLCAwLCAwLjMpO1xyXG4gIC13ZWJraXQtYm94LXNoYWRvdzogMHB4IDJweCAycHggcmdiYSgwLCAwLCAwLCAwLjMpO1xyXG4gIGJveC1zaGFkb3c6IDBweCAycHggMnB4IHJnYmEoMCwgMCwgMCwgMC4zKTtcclxufVxyXG5cclxuLnByb2ZpbGUtaW1nLWNhcmQge1xyXG4gIHdpZHRoOiA5NnB4O1xyXG4gIGhlaWdodDogOTZweDtcclxuICBtYXJnaW46IDAgYXV0byAxMHB4O1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIC1tb3otYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gIC13ZWJraXQtYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcclxufVxyXG5cclxuLl8xUTlpZiwgLl8ySGlqNSB7XHJcbiAgd29yZC13cmFwOiBicmVhay13b3JkO1xyXG4gIG92ZXJmbG93LXdyYXA6IGJyZWFrLXdvcmQ7XHJcbiAgdGV4dC1hbGlnbjogc3RhcnQ7XHJcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbn1cclxuXHJcbi5fM1NRTi0sIC5fM3duSWMge1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICB0b3A6IDA7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgaGVpZ2h0OiAxMDAlO1xyXG59XHJcblxyXG4ubXVsdGktYmctZXhhbXBsZSB7XHJcbiAgd2lkdGg6IDk4MHB4O1xyXG4gIGhlaWdodDogMjg5cHg7XHJcbiAgb2JqZWN0LWZpdDogY292ZXI7XHJcbiAgb2JqZWN0LXBvc2l0aW9uOiA1MCUgNTAlO1xyXG59XHJcblxyXG4uZm9udF8wIHtcclxuICBmb250LXNpemU6NDRweDtcclxuICB0ZXh0LWFsaWduOmxlZnQ7XHJcbiAgY29sb3I6I0ZGRkZGRjtcclxufVxyXG5cclxuLmFsZXJ0LCAuYWxlcnQtc3VjY2VzcyB7XHJcbiAgd2lkdGg6IDUwJTtcclxufVxyXG5cclxuXHJcbi5iYWNrZ3JvdW5kIHtcclxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xyXG4gIGJhY2tncm91bmQtb3JpZ2luOiBib3JkZXItYm94O1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCguLi9fc2VydmljZXMvYXNzZXRzL2ltYWdlcy9CYWNrZ3JvdW5kLndlYnApO1xyXG4gIC8qbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCByZ2JhKDMwLCA3NSwgMTE1LCAxKSwgcmdiYSgyNTUsIDI1NSwgMjU1LCAwKSk7Ki9cclxuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xyXG4gIGJhY2tncm91bmQtcG9zaXRpb246IHRvcCBsZWZ0O1xyXG5cclxufVxyXG5cclxuLmNhcmQtZm9vdGVyIHtcclxuICBwYWRkaW5nLXRvcDogMC4xcmVtO1xyXG4gIHBhZGRpbmctcmlnaHQ6IDAuMXJlbTtcclxuICBwYWRkaW5nLWJvdHRvbTogMC4xcmVtO1xyXG4gIHBhZGRpbmctbGVmdDogMC4xcmVtO1xyXG5cclxuICBib3JkZXItdG9wOiAwLjFyZW0gc29saWQgcmdiYSgwLCAwLCAwLCAwLjEyNSk7XHJcblxyXG4gIGJvcmRlci1ib3R0b206IDAuMXJlbTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMDMpO1xyXG5cclxufVxyXG5cclxuLmZvb3RlciB1bC5mb290ZXItbWVudSBsaS5ib2xkIGEge1xyXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbn1cclxuIl19 */"] });


/***/ }),

/***/ 70996:
/*!****************************************************************!*\
  !*** ./src/app/login/register-form/register-form.component.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RegisterFormComponent": function() { return /* binding */ RegisterFormComponent; }
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 3679);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var mdb_angular_ui_kit_modal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! mdb-angular-ui-kit/modal */ 25303);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_services/auth.service */ 88368);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 38583);
/* harmony import */ var mdb_angular_ui_kit_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! mdb-angular-ui-kit/forms */ 95095);
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! angular-bootstrap-md */ 49260);
/* harmony import */ var _pipes_api_error_message_pipe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipes/api-error-message.pipe */ 81582);









function RegisterFormComponent_form_11_mdb_error_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mdb-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " First name is required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function RegisterFormComponent_form_11_mdb_success_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mdb-success");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Looks good! ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function RegisterFormComponent_form_11_mdb_error_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mdb-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Email is required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function RegisterFormComponent_form_11_mdb_success_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mdb-success");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Looks good! ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function RegisterFormComponent_form_11_mdb_error_22_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mdb-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Password is required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function RegisterFormComponent_form_11_mdb_success_23_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mdb-success");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Looks good! ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function RegisterFormComponent_form_11_span_24_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "apiErrorMessage");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 1, ctx_r8.errorFieldSubmitted["password"]), " ");
} }
function RegisterFormComponent_form_11_mdb_error_31_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mdb-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Phone is required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function RegisterFormComponent_form_11_mdb_success_32_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mdb-success");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Looks good! ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function RegisterFormComponent_form_11_div_33_Template(rf, ctx) { if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "button", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function RegisterFormComponent_form_11_div_33_Template_button_click_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r13); const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2); return ctx_r12.onSubmit(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Register");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function RegisterFormComponent_form_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "form", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "mdb-form-control", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "input", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "label", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "UserName input");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](6, RegisterFormComponent_form_11_mdb_error_6_Template, 2, 0, "mdb-error", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, RegisterFormComponent_form_11_mdb_success_7_Template, 2, 0, "mdb-success", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](8, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "mdb-form-control", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](11, "input", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "label", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](13, "Email input");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](14, RegisterFormComponent_form_11_mdb_error_14_Template, 2, 0, "mdb-error", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](15, RegisterFormComponent_form_11_mdb_success_15_Template, 2, 0, "mdb-success", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](16, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "mdb-form-control", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](19, "input", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](20, "label", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](21, "Password input");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](22, RegisterFormComponent_form_11_mdb_error_22_Template, 2, 0, "mdb-error", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](23, RegisterFormComponent_form_11_mdb_success_23_Template, 2, 0, "mdb-success", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](24, RegisterFormComponent_form_11_span_24_Template, 5, 3, "span", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](25, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](26, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](27, "mdb-form-control", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](28, "input", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](29, "label", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](30, "Phone number input");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](31, RegisterFormComponent_form_11_mdb_error_31_Template, 2, 0, "mdb-error", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](32, RegisterFormComponent_form_11_mdb_success_32_Template, 2, 0, "mdb-success", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](33, RegisterFormComponent_form_11_div_33_Template, 4, 0, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx_r0.validationForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("mdbValidate", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (ctx_r0.userName == null ? null : ctx_r0.userName.invalid) && ((ctx_r0.userName == null ? null : ctx_r0.userName.dirty) || (ctx_r0.userName == null ? null : ctx_r0.userName.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (ctx_r0.userName == null ? null : ctx_r0.userName.valid) && ((ctx_r0.userName == null ? null : ctx_r0.userName.dirty) || (ctx_r0.userName == null ? null : ctx_r0.userName.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("mdbValidate", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (ctx_r0.email == null ? null : ctx_r0.email.invalid) && ((ctx_r0.email == null ? null : ctx_r0.email.dirty) || (ctx_r0.email == null ? null : ctx_r0.email.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (ctx_r0.email == null ? null : ctx_r0.email.valid) && ((ctx_r0.email == null ? null : ctx_r0.email.dirty) || (ctx_r0.email == null ? null : ctx_r0.email.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("mdbValidate", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (ctx_r0.password == null ? null : ctx_r0.password.invalid) && ((ctx_r0.password == null ? null : ctx_r0.password.dirty) || (ctx_r0.password == null ? null : ctx_r0.password.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (ctx_r0.password == null ? null : ctx_r0.password.valid) && ((ctx_r0.password == null ? null : ctx_r0.password.dirty) || (ctx_r0.password == null ? null : ctx_r0.password.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r0.submitted && ctx_r0.errorFieldSubmitted["password"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("mdbValidate", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (ctx_r0.phone == null ? null : ctx_r0.phone.invalid) && ((ctx_r0.phone == null ? null : ctx_r0.phone.dirty) || (ctx_r0.phone == null ? null : ctx_r0.phone.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (ctx_r0.phone == null ? null : ctx_r0.phone.valid) && ((ctx_r0.phone == null ? null : ctx_r0.phone.dirty) || (ctx_r0.phone == null ? null : ctx_r0.phone.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r0.isSuccessful);
} }
function RegisterFormComponent_div_12_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Your registration is successful! ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
class RegisterFormComponent {
    constructor(modalRef, authService) {
        this.modalRef = modalRef;
        this.authService = authService;
        this.isSuccessful = false;
        this.isSignUpFailed = false;
        this.submitted = false;
        this.errorMessage = '';
        this.empList = [];
        this.apiResponse = { message: '', error: false };
        this.errorFieldSubmitted = {};
        this.closeResult = '';
        this.validationForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroup({
            userName: new _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required),
            email: new _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.email),
            password: new _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControl('', _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.minLength(1)),
            phone: new _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.pattern(new RegExp("[0-9 ]{12}")))
        });
        this.empList.push("admin");
    }
    ngOnInit() {
    }
    onSubmit() {
        this.submitted = true;
        const { userName, email, password, phone } = this.validationForm.value;
        this.authService.registerForm(userName, email, password, phone).subscribe(data => {
            console.log(data);
            this.isSuccessful = true;
            this.isSignUpFailed = false;
            this.errorFieldSubmitted = {};
            this.apiResponse.error = false;
            this.apiResponse.message = 'Successful registration';
        }, error => {
            const errorResponse = JSON.parse(error.error);
            this.apiResponse.error = true;
            this.apiResponse.message = 'Registration error';
            this.errorMessage = error.error.message;
            this.isSignUpFailed = true;
            if (errorResponse.error && errorResponse.message === 'VALIDATION_FAILED') {
                this.errorFieldSubmitted = errorResponse.data;
            }
        }, () => {
            console.log("Registration Complete");
            this.modalRef.close("Registration Complete");
        });
    }
    get userName() {
        return this.validationForm.get('userName');
    }
    get email() {
        return this.validationForm.get('email');
    }
    get password() {
        return this.validationForm.get('password');
    }
    get phone() {
        return this.validationForm.get('phone');
    }
}
RegisterFormComponent.ɵfac = function RegisterFormComponent_Factory(t) { return new (t || RegisterFormComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](mdb_angular_ui_kit_modal__WEBPACK_IMPORTED_MODULE_4__.MdbModalRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService)); };
RegisterFormComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: RegisterFormComponent, selectors: [["app-modal"]], decls: 24, vars: 2, consts: [[1, "modal-header"], [1, "white-text", "mb-2", "mt-2", "font-weight-bold", "fas"], [1, "green-text", "font-weight-bold"], ["type", "button", "aria-label", "Close", 1, "btn-close", 3, "click"], [1, "modal-body", "py-4", "text-center", "expansionCard"], ["id", "profile-img", "src", "../../../AccGate/assets/images/T.png", "alt", "", 1, "profile-img-card"], [1, "text-white", "rgba-stylish-strong", "py-5", "px-5", "z-depth-2"], [3, "formGroup", 4, "ngIf"], ["class", "alert alert-success", 4, "ngIf"], ["hidden", "", 1, "list-group-horizontal", "mb-4", "col-md-12"], ["type", "button", 1, "fa-pull-left", "btn", "btn-primary"], [1, "modal-content"], [1, "modal-footer", "fal"], ["type", "checkbox", "id", "checkbox7", 1, "form-check-input"], ["for", "checkbox7", 1, "form-check-label", "white-text"], ["href", "#", 1, "green-text", "font-weight-bold"], [3, "formGroup"], [1, "form-outline"], ["mdbInput", "", "type", "text", "id", "typeText", "formControlName", "userName", "required", "", 1, "form-control", 3, "mdbValidate"], ["for", "typeText", 1, "form-label"], [4, "ngIf"], ["mdbInput", "", "type", "email", "id", "typeEmail", "formControlName", "email", "required", "", 1, "form-control", 3, "mdbValidate"], ["mdbLabel", "", "for", "typeEmail", 1, "form-label", "form-white"], ["mdbInput", "", "type", "password", "id", "typePassword", "formControlName", "password", "required", "", "minlength", "1", 1, "form-control", 3, "mdbValidate"], ["mdbLabel", "", "for", "typePassword", 1, "form-label", "form-white"], ["class", "text-danger error-input", "style", "white-space: pre-line;  font-size: 14px;", 4, "ngIf"], ["mdbInput", "", "type", "tel", "id", "typePhone", "formControlName", "phone", "required", "", 1, "form-control", 3, "mdbValidate"], ["mdbLabel", "", "for", "typePhone", 1, "form-label", "form-white"], ["class", "row d-flex align-items-lg-center ", 4, "ngIf"], [1, "text-danger", "error-input", 2, "white-space", "pre-line", "font-size", "14px"], [1, "row", "d-flex", "align-items-lg-center"], [1, "form-group", "text-center", "mb-2", "col-md-12"], ["type", "button", 1, "btn", "btn-success", "btn-block", "btn-rounded", "z-depth-1", "waves-effect", "waves-light", 3, "click"], [1, "alert", "alert-success"]], template: function RegisterFormComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "label", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "REGISTRATION");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, " FORM");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function RegisterFormComponent_Template_button_click_7_listener() { return ctx.modalRef.close("xbutton"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](9, "img", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](11, RegisterFormComponent_form_11_Template, 34, 15, "form", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](12, RegisterFormComponent_div_12_Template, 2, 0, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](15, "Save changes");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](16, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](19, "input", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](20, "label", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](21, "Subscribe to our ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](22, "a", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](23, " newsletter?");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.isSuccessful);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isSuccessful);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroupDirective, mdb_angular_ui_kit_forms__WEBPACK_IMPORTED_MODULE_6__.MdbFormControlComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, mdb_angular_ui_kit_forms__WEBPACK_IMPORTED_MODULE_6__.MdbInputDirective, angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_7__.MdbInput, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.RequiredValidator, angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_7__.MdbValidateDirective, mdb_angular_ui_kit_forms__WEBPACK_IMPORTED_MODULE_6__.MdbLabelDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MinLengthValidator, angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_7__.MdbErrorDirective, angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_7__.MdbSuccessDirective], pipes: [_pipes_api_error_message_pipe__WEBPACK_IMPORTED_MODULE_1__.ApiErrorMessagePipe], styles: [".fa[_ngcontent-%COMP%], .fab[_ngcontent-%COMP%], .fad[_ngcontent-%COMP%], .fal[_ngcontent-%COMP%], .far[_ngcontent-%COMP%], .fas[_ngcontent-%COMP%] {\r\n  -moz-osx-font-smoothing:grayscale;\r\n  -webkit-font-smoothing:antialiased;\r\n  display:inline-block;\r\n  font-style:normal;\r\n  font-feature-settings:normal;\r\n  font-variant:normal;\r\n  text-rendering:auto;line-height:1\r\n}\r\n\r\n.fa-lg[_ngcontent-%COMP%] {\r\n  font-size:1.33333em;\r\n  line-height:.75em;\r\n  vertical-align:-.0667em\r\n}\r\n\r\n\r\n\r\n.fa-xs[_ngcontent-%COMP%] {font-size:.75em}\r\n\r\n.fa-sm[_ngcontent-%COMP%] {font-size:.875em}\r\n\r\n.fa-1x[_ngcontent-%COMP%] {font-size:1em}\r\n\r\n.fa-2x[_ngcontent-%COMP%] {font-size:2em}\r\n\r\n.fa-3x[_ngcontent-%COMP%] {font-size:3em}\r\n\r\n.fa-4x[_ngcontent-%COMP%] {font-size:4em}\r\n\r\n.fa-5x[_ngcontent-%COMP%] {font-size:5em}\r\n\r\n.fa-6x[_ngcontent-%COMP%] {font-size:6em}\r\n\r\n.fa-7x[_ngcontent-%COMP%] {font-size:7em}\r\n\r\n.fa-8x[_ngcontent-%COMP%] {font-size:8em}\r\n\r\n.fa-9x[_ngcontent-%COMP%] {font-size:9em}\r\n\r\n.fa-10x[_ngcontent-%COMP%] {font-size:10em}\r\n\r\n.fa-fw[_ngcontent-%COMP%] {text-align:center;width:1.25em}\r\n\r\n.fa-ul[_ngcontent-%COMP%] {list-style-type:none;margin-left:2.5em;padding-left:0}\r\n\r\n.fa-ul[_ngcontent-%COMP%] > li[_ngcontent-%COMP%] {position:relative}\r\n\r\n.fa-li[_ngcontent-%COMP%] {left:-2em;position:absolute;text-align:center;width:2em;line-height:inherit}\r\n\r\n.fa-border[_ngcontent-%COMP%] {border:.08em solid #eee;border-radius:.1em;padding:.2em .25em .15em}\r\n\r\n.fa-pull-left[_ngcontent-%COMP%] {float:left}\r\n\r\n.fa-pull-right[_ngcontent-%COMP%] {float:right}\r\n\r\n.fa.fa-pull-left[_ngcontent-%COMP%], .fab.fa-pull-left[_ngcontent-%COMP%], .fal.fa-pull-left[_ngcontent-%COMP%], .far.fa-pull-left[_ngcontent-%COMP%], .fas.fa-pull-left[_ngcontent-%COMP%] {\r\n  margin-right:.3em\r\n}\r\n\r\n.input-with-pre-icon[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {left:36px;right:auto;right:initial}\r\n\r\n.fa.fa-pull-right[_ngcontent-%COMP%], .fab.fa-pull-right[_ngcontent-%COMP%], .fal.fa-pull-right[_ngcontent-%COMP%], .far.fa-pull-right[_ngcontent-%COMP%], .fas.fa-pull-right[_ngcontent-%COMP%] {\r\n  margin-left:.3em\r\n}\r\n\r\n.fa-spin[_ngcontent-%COMP%] {\r\n  animation:fa-spin 2s linear infinite\r\n}\r\n\r\n.fa[_ngcontent-%COMP%], .far[_ngcontent-%COMP%], .fas[_ngcontent-%COMP%] {\r\n  font-family: \"Font Awesome 5 Free\", serif\r\n}\r\n\r\n.fa[_ngcontent-%COMP%], .fas[_ngcontent-%COMP%] {\r\n  font-weight:900\r\n}\r\n\r\n.v-btn__content[_ngcontent-%COMP%] {\r\n  align-items: center;\r\n  color: inherit;\r\n  display: flex;\r\n  flex: 1 0 auto;\r\n  justify-content: inherit;\r\n  line-height: normal;\r\n  position: relative;\r\n  transition: inherit;\r\n}\r\n\r\n.form-outline[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]:focus    ~ .form-label[_ngcontent-%COMP%], .form-outline[_ngcontent-%COMP%]   .form-control.active[_ngcontent-%COMP%]    ~ .form-label[_ngcontent-%COMP%] {\r\n  transform: translateY(-1.5rem) translateY(0.1rem) scale(0.8);\r\n}\r\n\r\n\r\n\r\n.v-btn__content[_ngcontent-%COMP%] {\r\n  letter-spacing: normal;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlZ2lzdGVyLWZvcm0uY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBO0VBQ0UsaUNBQWlDO0VBQ2pDLGtDQUFrQztFQUNsQyxvQkFBb0I7RUFDcEIsaUJBQWlCO0VBQ2pCLDRCQUFtQjtFQUFuQixtQkFBbUI7RUFDbkIsbUJBQW1CLENBQUM7QUFDdEI7O0FBRUE7RUFDRSxtQkFBbUI7RUFDbkIsaUJBQWlCO0VBQ2pCO0FBQ0Y7O0FBQ0EsR0FBRzs7QUFDSCxRQUFRLGVBQWU7O0FBRXZCLFFBQVEsZ0JBQWdCOztBQUV4QixRQUFRLGFBQWE7O0FBRXJCLFFBQVEsYUFBYTs7QUFFckIsUUFBUSxhQUFhOztBQUVyQixRQUFRLGFBQWE7O0FBRXJCLFFBQVEsYUFBYTs7QUFFckIsUUFBUSxhQUFhOztBQUVyQixRQUFRLGFBQWE7O0FBRXJCLFFBQVEsYUFBYTs7QUFFckIsUUFBUSxhQUFhOztBQUVyQixTQUFTLGNBQWM7O0FBRXZCLFFBQVEsaUJBQWlCLENBQUMsWUFBWTs7QUFFdEMsUUFBUSxvQkFBb0IsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjOztBQUU3RCxXQUFXLGlCQUFpQjs7QUFFNUIsUUFBUSxTQUFTLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLG1CQUFtQjs7QUFFbkYsWUFBWSx1QkFBdUIsQ0FBQyxrQkFBa0IsQ0FBQyx3QkFBd0I7O0FBRS9FLGVBQWUsVUFBVTs7QUFFekIsZ0JBQWdCLFdBQVc7O0FBRTNCO0VBQ0U7QUFDRjs7QUFFQSw0QkFBNEIsU0FBUyxDQUFDLFVBQVksQ0FBWixhQUFhOztBQUduRDtFQUNFO0FBQ0Y7O0FBRUE7RUFFRTtBQUNGOztBQUlBO0VBQ0U7QUFDRjs7QUFFQTtFQUNFO0FBQ0Y7O0FBR0E7RUFDRSxtQkFBbUI7RUFDbkIsY0FBYztFQUNkLGFBQWE7RUFDYixjQUFjO0VBQ2Qsd0JBQXdCO0VBQ3hCLG1CQUFtQjtFQUNuQixrQkFBa0I7RUFDbEIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsNERBQTREO0FBQzlEOztBQUdBOzs7Ozs7O0NBT0M7O0FBQ0Q7RUFDRSxzQkFBc0I7QUFDeEIiLCJmaWxlIjoicmVnaXN0ZXItZm9ybS5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcblxyXG4uZmEsLmZhYiwuZmFkLC5mYWwsLmZhciwuZmFzIHtcclxuICAtbW96LW9zeC1mb250LXNtb290aGluZzpncmF5c2NhbGU7XHJcbiAgLXdlYmtpdC1mb250LXNtb290aGluZzphbnRpYWxpYXNlZDtcclxuICBkaXNwbGF5OmlubGluZS1ibG9jaztcclxuICBmb250LXN0eWxlOm5vcm1hbDtcclxuICBmb250LXZhcmlhbnQ6bm9ybWFsO1xyXG4gIHRleHQtcmVuZGVyaW5nOmF1dG87bGluZS1oZWlnaHQ6MVxyXG59XHJcblxyXG4uZmEtbGcge1xyXG4gIGZvbnQtc2l6ZToxLjMzMzMzZW07XHJcbiAgbGluZS1oZWlnaHQ6Ljc1ZW07XHJcbiAgdmVydGljYWwtYWxpZ246LS4wNjY3ZW1cclxufVxyXG4vKiovXHJcbi5mYS14cyB7Zm9udC1zaXplOi43NWVtfVxyXG5cclxuLmZhLXNtIHtmb250LXNpemU6Ljg3NWVtfVxyXG5cclxuLmZhLTF4IHtmb250LXNpemU6MWVtfVxyXG5cclxuLmZhLTJ4IHtmb250LXNpemU6MmVtfVxyXG5cclxuLmZhLTN4IHtmb250LXNpemU6M2VtfVxyXG5cclxuLmZhLTR4IHtmb250LXNpemU6NGVtfVxyXG5cclxuLmZhLTV4IHtmb250LXNpemU6NWVtfVxyXG5cclxuLmZhLTZ4IHtmb250LXNpemU6NmVtfVxyXG5cclxuLmZhLTd4IHtmb250LXNpemU6N2VtfVxyXG5cclxuLmZhLTh4IHtmb250LXNpemU6OGVtfVxyXG5cclxuLmZhLTl4IHtmb250LXNpemU6OWVtfVxyXG5cclxuLmZhLTEweCB7Zm9udC1zaXplOjEwZW19XHJcblxyXG4uZmEtZncge3RleHQtYWxpZ246Y2VudGVyO3dpZHRoOjEuMjVlbX1cclxuXHJcbi5mYS11bCB7bGlzdC1zdHlsZS10eXBlOm5vbmU7bWFyZ2luLWxlZnQ6Mi41ZW07cGFkZGluZy1sZWZ0OjB9XHJcblxyXG4uZmEtdWw+bGkge3Bvc2l0aW9uOnJlbGF0aXZlfVxyXG5cclxuLmZhLWxpIHtsZWZ0Oi0yZW07cG9zaXRpb246YWJzb2x1dGU7dGV4dC1hbGlnbjpjZW50ZXI7d2lkdGg6MmVtO2xpbmUtaGVpZ2h0OmluaGVyaXR9XHJcblxyXG4uZmEtYm9yZGVyIHtib3JkZXI6LjA4ZW0gc29saWQgI2VlZTtib3JkZXItcmFkaXVzOi4xZW07cGFkZGluZzouMmVtIC4yNWVtIC4xNWVtfVxyXG5cclxuLmZhLXB1bGwtbGVmdCB7ZmxvYXQ6bGVmdH1cclxuXHJcbi5mYS1wdWxsLXJpZ2h0IHtmbG9hdDpyaWdodH1cclxuXHJcbi5mYS5mYS1wdWxsLWxlZnQsLmZhYi5mYS1wdWxsLWxlZnQsLmZhbC5mYS1wdWxsLWxlZnQsLmZhci5mYS1wdWxsLWxlZnQsLmZhcy5mYS1wdWxsLWxlZnQge1xyXG4gIG1hcmdpbi1yaWdodDouM2VtXHJcbn1cclxuXHJcbi5pbnB1dC13aXRoLXByZS1pY29uIGxhYmVsIHtsZWZ0OjM2cHg7cmlnaHQ6aW5pdGlhbH1cclxuXHJcblxyXG4uZmEuZmEtcHVsbC1yaWdodCwuZmFiLmZhLXB1bGwtcmlnaHQsLmZhbC5mYS1wdWxsLXJpZ2h0LC5mYXIuZmEtcHVsbC1yaWdodCwuZmFzLmZhLXB1bGwtcmlnaHQge1xyXG4gIG1hcmdpbi1sZWZ0Oi4zZW1cclxufVxyXG5cclxuLmZhLXNwaW4ge1xyXG4gIC13ZWJraXQtYW5pbWF0aW9uOmZhLXNwaW4gMnMgbGluZWFyIGluZmluaXRlO1xyXG4gIGFuaW1hdGlvbjpmYS1zcGluIDJzIGxpbmVhciBpbmZpbml0ZVxyXG59XHJcblxyXG5cclxuXHJcbi5mYSwuZmFyLC5mYXMge1xyXG4gIGZvbnQtZmFtaWx5OiBcIkZvbnQgQXdlc29tZSA1IEZyZWVcIiwgc2VyaWZcclxufVxyXG5cclxuLmZhLC5mYXMge1xyXG4gIGZvbnQtd2VpZ2h0OjkwMFxyXG59XHJcblxyXG5cclxuLnYtYnRuX19jb250ZW50IHtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGNvbG9yOiBpbmhlcml0O1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleDogMSAwIGF1dG87XHJcbiAganVzdGlmeS1jb250ZW50OiBpbmhlcml0O1xyXG4gIGxpbmUtaGVpZ2h0OiBub3JtYWw7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIHRyYW5zaXRpb246IGluaGVyaXQ7XHJcbn1cclxuXHJcbi5mb3JtLW91dGxpbmUgLmZvcm0tY29udHJvbDpmb2N1cyB+IC5mb3JtLWxhYmVsLCAuZm9ybS1vdXRsaW5lIC5mb3JtLWNvbnRyb2wuYWN0aXZlIH4gLmZvcm0tbGFiZWwge1xyXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMS41cmVtKSB0cmFuc2xhdGVZKDAuMXJlbSkgc2NhbGUoMC44KTtcclxufVxyXG5cclxuXHJcbi8qXHJcbi5mb3JtLW91dGxpbmUgLmZvcm0tY29udHJvbCB+IC5mb3JtLW5vdGNoIGRpdiB7XHJcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbiAgYm9yZGVyOiAxcHggc29saWQ7XHJcbiAgYm9yZGVyLWNvbG9yOiAjMzljMGVkO1xyXG59XHJcblxyXG4qL1xyXG4udi1idG5fX2NvbnRlbnQge1xyXG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XHJcbn1cclxuIl19 */"] });


/***/ }),

/***/ 4959:
/*!************************************************************************!*\
  !*** ./src/app/login/replace-pass-form/replace-pass-form.component.ts ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ReplacePassFormComponent": function() { return /* binding */ ReplacePassFormComponent; }
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 3679);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var mdb_angular_ui_kit_modal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! mdb-angular-ui-kit/modal */ 25303);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_services/auth.service */ 88368);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 38583);
/* harmony import */ var mdb_angular_ui_kit_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! mdb-angular-ui-kit/forms */ 95095);
/* harmony import */ var angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! angular-bootstrap-md */ 49260);
/* harmony import */ var _pipes_login_error_message_pipe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pipes/login-error-message.pipe */ 74164);
/* harmony import */ var _pipes_api_error_message_pipe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pipes/api-error-message.pipe */ 81582);










function ReplacePassFormComponent_form_14_mdb_error_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mdb-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Username is required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} }
function ReplacePassFormComponent_form_14_mdb_success_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mdb-success");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Looks good! ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} }
function ReplacePassFormComponent_form_14_mdb_error_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mdb-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Current password is required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} }
function ReplacePassFormComponent_form_14_mdb_success_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mdb-success");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Looks good! ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} }
function ReplacePassFormComponent_form_14_span_16_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "loginErrorMessage");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 1, ctx_r6.errorFieldSubmitted["oldPassword"]), " ");
} }
function ReplacePassFormComponent_form_14_mdb_error_25_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mdb-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Password is required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} }
function ReplacePassFormComponent_form_14_mdb_success_26_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mdb-success");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Looks good! ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} }
function ReplacePassFormComponent_form_14_span_27_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "apiErrorMessage");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 1, ctx_r9.errorFieldSubmitted["password"]), " ");
} }
function ReplacePassFormComponent_form_14_mdb_error_34_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mdb-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Retype password is required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} }
function ReplacePassFormComponent_form_14_mdb_success_35_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mdb-success");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Looks good! ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} }
function ReplacePassFormComponent_form_14_span_36_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "apiErrorMessage");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 1, ctx_r12.errorFieldSubmitted["confirmPassword"]), " ");
} }
function ReplacePassFormComponent_form_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "form", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "mdb-form-control", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "input", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "label", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Username input");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](6, ReplacePassFormComponent_form_14_mdb_error_6_Template, 2, 0, "mdb-error", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, ReplacePassFormComponent_form_14_mdb_success_7_Template, 2, 0, "mdb-success", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](8, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "mdb-form-control", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](11, "input", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "label", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](13, "Current Password");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](14, ReplacePassFormComponent_form_14_mdb_error_14_Template, 2, 0, "mdb-error", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](15, ReplacePassFormComponent_form_14_mdb_success_15_Template, 2, 0, "mdb-success", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](16, ReplacePassFormComponent_form_14_span_16_Template, 5, 3, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](17, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](18, "hr", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](19, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](21, "mdb-form-control", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](22, "input", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](23, "label", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](24, "New Password");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](25, ReplacePassFormComponent_form_14_mdb_error_25_Template, 2, 0, "mdb-error", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](26, ReplacePassFormComponent_form_14_mdb_success_26_Template, 2, 0, "mdb-success", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](27, ReplacePassFormComponent_form_14_span_27_Template, 5, 3, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](28, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](29, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](30, "mdb-form-control", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](31, "input", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](32, "label", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](33, "Confirm Password");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](34, ReplacePassFormComponent_form_14_mdb_error_34_Template, 2, 0, "mdb-error", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](35, ReplacePassFormComponent_form_14_mdb_success_35_Template, 2, 0, "mdb-success", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](36, ReplacePassFormComponent_form_14_span_36_Template, 5, 3, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroup", ctx_r0.replacePassForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("mdbValidate", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", (ctx_r0.userName == null ? null : ctx_r0.userName.invalid) && ((ctx_r0.userName == null ? null : ctx_r0.userName.dirty) || (ctx_r0.userName == null ? null : ctx_r0.userName.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", (ctx_r0.userName == null ? null : ctx_r0.userName.valid) && ((ctx_r0.userName == null ? null : ctx_r0.userName.dirty) || (ctx_r0.userName == null ? null : ctx_r0.userName.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("mdbValidate", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", (ctx_r0.oldPassword == null ? null : ctx_r0.oldPassword.invalid) && ((ctx_r0.oldPassword == null ? null : ctx_r0.oldPassword.dirty) || (ctx_r0.oldPassword == null ? null : ctx_r0.oldPassword.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", (ctx_r0.oldPassword == null ? null : ctx_r0.oldPassword.valid) && ((ctx_r0.oldPassword == null ? null : ctx_r0.oldPassword.dirty) || (ctx_r0.oldPassword == null ? null : ctx_r0.oldPassword.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r0.submitted && ctx_r0.errorFieldSubmitted["oldPassword"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("mdbValidate", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", (ctx_r0.password == null ? null : ctx_r0.password.invalid) && ((ctx_r0.password == null ? null : ctx_r0.password.dirty) || (ctx_r0.password == null ? null : ctx_r0.password.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", (ctx_r0.password == null ? null : ctx_r0.password.valid) && ((ctx_r0.password == null ? null : ctx_r0.password.dirty) || (ctx_r0.password == null ? null : ctx_r0.password.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r0.submitted && ctx_r0.errorFieldSubmitted["password"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("mdbValidate", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", (ctx_r0.confirmPassword == null ? null : ctx_r0.confirmPassword.invalid) && ((ctx_r0.confirmPassword == null ? null : ctx_r0.confirmPassword.dirty) || (ctx_r0.confirmPassword == null ? null : ctx_r0.confirmPassword.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", (ctx_r0.confirmPassword == null ? null : ctx_r0.confirmPassword.valid) && ((ctx_r0.confirmPassword == null ? null : ctx_r0.confirmPassword.dirty) || (ctx_r0.confirmPassword == null ? null : ctx_r0.confirmPassword.touched)));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r0.submitted && ctx_r0.errorFieldSubmitted["confirmPassword"]);
} }
function ReplacePassFormComponent_div_15_Template(rf, ctx) { if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "button", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ReplacePassFormComponent_div_15_Template_button_click_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r14); const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r13.onSubmit(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3, "Replace Password");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} }
class ReplacePassFormComponent {
    constructor(modalRef, authService) {
        this.modalRef = modalRef;
        this.authService = authService;
        this.isSuccessful = false;
        this.isSignUpFailed = false;
        this.submitted = false;
        this.errorMessage = '';
        this.empList = [];
        this.apiResponse = { message: '', error: false };
        this.errorFieldSubmitted = {};
        this.closeResult = '';
        this.replacePassForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormGroup({
            userName: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required),
            oldPassword: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.minLength(1)),
            password: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormControl('', _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.minLength(3)),
            confirmPassword: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormControl(null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.minLength(3))
        });
    }
    ngOnInit() {
    }
    onSubmit() {
        this.submitted = true;
        const { userName, oldPassword, password, confirmPassword } = this.replacePassForm.value;
        this.authService.replacePassForm(userName, oldPassword, password, confirmPassword).subscribe(data => {
            console.log(data);
            this.isSuccessful = true;
            this.isSignUpFailed = false;
            this.errorFieldSubmitted = {};
            this.apiResponse.error = false;
            this.apiResponse.message = 'Successful registration';
        }, error => {
            const errorResponse = JSON.parse(error.error);
            this.apiResponse.error = true;
            this.apiResponse.message = 'Registration error';
            this.errorMessage = error.error.message;
            this.isSignUpFailed = true;
            if (errorResponse.error && errorResponse.message === 'VALIDATION_FAILED') {
                this.errorFieldSubmitted = errorResponse.data;
            }
        }, () => { this.modalRef.close(); });
    }
    get userName() {
        return this.replacePassForm.get('userName');
    }
    get oldPassword() {
        return this.replacePassForm.get('oldPassword');
    }
    get password() {
        return this.replacePassForm.get('password');
    }
    get confirmPassword() {
        return this.replacePassForm.get('confirmPassword');
    }
}
ReplacePassFormComponent.ɵfac = function ReplacePassFormComponent_Factory(t) { return new (t || ReplacePassFormComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](mdb_angular_ui_kit_modal__WEBPACK_IMPORTED_MODULE_5__.MdbModalRef), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService)); };
ReplacePassFormComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: ReplacePassFormComponent, selectors: [["app-modal"]], decls: 28, vars: 2, consts: [[1, "modal-header"], [1, "white-text", "mb-2", "mt-2", "font-weight-bold", "fas"], [1, "green-text", "font-weight-bold"], ["type", "button", "aria-label", "Close", 1, "btn", "btn-close", "white-text", 3, "click"], [1, "modal-body", "py-4", "text-center", "expansionCard"], [1, "figure"], ["aria-setsize", "20", "id", "profile-img", "src", "../../../AccGate/assets/images/T.png", "alt", "", 1, "profile-img-card", "img-fluid", "rounded"], [1, "figure-caption", "text-center", "text-capitalize"], [1, "text-white", "rgba-stylish-strong", "py-4", "px-5", "z-depth-2", 2, "border-bottom", "2rem"], [3, "formGroup", 4, "ngIf"], ["class", "row d-flex align-items-lg-center border-bottom-0 ", 4, "ngIf"], ["hidden", "", 1, "list-group-horizontal", "mb-4", "col-md-12"], ["type", "button", 1, "fa-pull-left", "btn", "btn-primary"], ["type", "button", 1, "fa-pull-right", "btn", "btn-secondary", 3, "click"], [1, "modal-content"], [1, "modal-footer", "fal"], ["type", "checkbox", "id", "checkbox7", 1, "form-check-input"], ["for", "checkbox7", 1, "form-check-label", "white-text"], ["href", "#", 1, "green-text", "font-weight-bold"], [3, "formGroup"], [1, "form-outline"], ["mdbInput", "", "type", "text", "id", "typeText", "formControlName", "userName", "required", "", 1, "form-control", 3, "mdbValidate"], ["for", "typeText", 1, "form-label"], [4, "ngIf"], ["mdbInput", "", "type", "password", "id", "typeOldPassword", "formControlName", "oldPassword", "required", "", "minlength", "1", 1, "form-control", 3, "mdbValidate"], ["for", "typeOldPassword", 1, "form-label"], ["class", "text-danger error-input", "style", "white-space: pre-line;  font-size: 14px;", 4, "ngIf"], [1, "my-1", "text-black-50"], [1, "form-outline", "text-black-50"], ["mdbInput", "", "type", "password", "id", "typePassword", "formControlName", "password", "required", "", "minlength", "3", 1, "form-control", 3, "mdbValidate"], ["mdbLabel", "", "for", "typePassword", 1, "form-label", "form-white"], ["mdbInput", "", "type", "password", "id", "typeConfirmPassword", "formControlName", "confirmPassword", "required", "", "minlength", "3", 1, "form-control", 3, "mdbValidate"], ["mdbLabel", "", "for", "typeConfirmPassword", 1, "form-label", "form-white"], [1, "text-danger", "error-input", 2, "white-space", "pre-line", "font-size", "14px"], [1, "row", "d-flex", "align-items-lg-center", "border-bottom-0"], [1, "text-center", "mb-2", "col-md-12", "border-bottom-0"], ["type", "button", 1, "btn", "btn-success", "btn-block", "btn-rounded", "z-depth-1", "waves-effect", "waves-light", "border-bottom-0", 2, "margin-bottom", "0", 3, "click"]], template: function ReplacePassFormComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "label", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3, "REPLACE PASSWORD");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, " FORM");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ReplacePassFormComponent_Template_button_click_7_listener() { return ctx.modalRef.close("xbutton"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "figure", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](10, "img", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "figcaption", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](12, "Tadiran Telecom");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](14, ReplacePassFormComponent_form_14_Template, 37, 16, "form", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](15, ReplacePassFormComponent_div_15_Template, 4, 0, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "button", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](18, "Save changes");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](19, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ReplacePassFormComponent_Template_button_click_19_listener() { return ctx.modalRef.close(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](20, "Close");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](21, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](23, "input", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "label", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](25, "Subscribe to our ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](26, "a", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](27, " newsletter?");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.isSuccessful);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.isSuccessful);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormGroupDirective, mdb_angular_ui_kit_forms__WEBPACK_IMPORTED_MODULE_7__.MdbFormControlComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.DefaultValueAccessor, mdb_angular_ui_kit_forms__WEBPACK_IMPORTED_MODULE_7__.MdbInputDirective, angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_8__.MdbInput, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.RequiredValidator, angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_8__.MdbValidateDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.MinLengthValidator, mdb_angular_ui_kit_forms__WEBPACK_IMPORTED_MODULE_7__.MdbLabelDirective, angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_8__.MdbErrorDirective, angular_bootstrap_md__WEBPACK_IMPORTED_MODULE_8__.MdbSuccessDirective], pipes: [_pipes_login_error_message_pipe__WEBPACK_IMPORTED_MODULE_1__.LoginErrorMessagePipe, _pipes_api_error_message_pipe__WEBPACK_IMPORTED_MODULE_2__.ApiErrorMessagePipe], styles: [".fa[_ngcontent-%COMP%], .fab[_ngcontent-%COMP%], .fad[_ngcontent-%COMP%], .fal[_ngcontent-%COMP%], .far[_ngcontent-%COMP%], .fas[_ngcontent-%COMP%] {\r\n  -moz-osx-font-smoothing:grayscale;\r\n  -webkit-font-smoothing:antialiased;\r\n  display:inline-block;\r\n  font-style:normal;\r\n  font-feature-settings:normal;\r\n  font-variant:normal;\r\n  text-rendering:auto;line-height:1\r\n}\r\n\r\n.fa-lg[_ngcontent-%COMP%] {\r\n  font-size:1.33333em;\r\n  line-height:.75em;\r\n  vertical-align:-.0667em\r\n}\r\n\r\n\r\n\r\n.fa-xs[_ngcontent-%COMP%] {font-size:.75em}\r\n\r\n.fa-sm[_ngcontent-%COMP%] {font-size:.875em}\r\n\r\n.fa-1x[_ngcontent-%COMP%] {font-size:1em}\r\n\r\n.fa-2x[_ngcontent-%COMP%] {font-size:2em}\r\n\r\n.fa-3x[_ngcontent-%COMP%] {font-size:3em}\r\n\r\n.fa-4x[_ngcontent-%COMP%] {font-size:4em}\r\n\r\n.fa-5x[_ngcontent-%COMP%] {font-size:5em}\r\n\r\n.fa-6x[_ngcontent-%COMP%] {font-size:6em}\r\n\r\n.fa-7x[_ngcontent-%COMP%] {font-size:7em}\r\n\r\n.fa-8x[_ngcontent-%COMP%] {font-size:8em}\r\n\r\n.fa-9x[_ngcontent-%COMP%] {font-size:9em}\r\n\r\n.fa-10x[_ngcontent-%COMP%] {font-size:10em}\r\n\r\n.fa-fw[_ngcontent-%COMP%] {text-align:center;width:1.25em}\r\n\r\n.fa-ul[_ngcontent-%COMP%] {list-style-type:none;margin-left:2.5em;padding-left:0}\r\n\r\n.fa-ul[_ngcontent-%COMP%] > li[_ngcontent-%COMP%] {position:relative}\r\n\r\n.fa-li[_ngcontent-%COMP%] {left:-2em;position:absolute;text-align:center;width:2em;line-height:inherit}\r\n\r\n.fa-border[_ngcontent-%COMP%] {border:.08em solid #eee;border-radius:.1em;padding:.2em .25em .15em}\r\n\r\n.fa-pull-left[_ngcontent-%COMP%] {float:left}\r\n\r\n.fa-pull-right[_ngcontent-%COMP%] {float:right}\r\n\r\n.fa.fa-pull-left[_ngcontent-%COMP%], .fab.fa-pull-left[_ngcontent-%COMP%], .fal.fa-pull-left[_ngcontent-%COMP%], .far.fa-pull-left[_ngcontent-%COMP%], .fas.fa-pull-left[_ngcontent-%COMP%] {\r\n  margin-right:.3em\r\n}\r\n\r\n.input-with-pre-icon[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {left:36px;right:auto;right:initial}\r\n\r\n.fa.fa-pull-right[_ngcontent-%COMP%], .fab.fa-pull-right[_ngcontent-%COMP%], .fal.fa-pull-right[_ngcontent-%COMP%], .far.fa-pull-right[_ngcontent-%COMP%], .fas.fa-pull-right[_ngcontent-%COMP%] {\r\n  margin-left:.3em\r\n}\r\n\r\n.fa-spin[_ngcontent-%COMP%] {\r\n  animation:fa-spin 2s linear infinite\r\n}\r\n\r\n.fa[_ngcontent-%COMP%], .far[_ngcontent-%COMP%], .fas[_ngcontent-%COMP%] {\r\n  font-family: \"Font Awesome 5 Free\", serif\r\n}\r\n\r\n.fa[_ngcontent-%COMP%], .fas[_ngcontent-%COMP%] {\r\n  font-weight:900\r\n}\r\n\r\n.v-btn__content[_ngcontent-%COMP%] {\r\n  align-items: center;\r\n  color: inherit;\r\n  display: flex;\r\n  flex: 1 0 auto;\r\n  justify-content: inherit;\r\n  line-height: normal;\r\n  position: relative;\r\n  transition: inherit;\r\n}\r\n\r\n.v-btn__content[_ngcontent-%COMP%] {\r\n  letter-spacing: normal;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlcGxhY2UtcGFzcy1mb3JtLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTtFQUNFLGlDQUFpQztFQUNqQyxrQ0FBa0M7RUFDbEMsb0JBQW9CO0VBQ3BCLGlCQUFpQjtFQUNqQiw0QkFBbUI7RUFBbkIsbUJBQW1CO0VBQ25CLG1CQUFtQixDQUFDO0FBQ3RCOztBQUVBO0VBQ0UsbUJBQW1CO0VBQ25CLGlCQUFpQjtFQUNqQjtBQUNGOztBQUNBLEdBQUc7O0FBQ0gsUUFBUSxlQUFlOztBQUV2QixRQUFRLGdCQUFnQjs7QUFFeEIsUUFBUSxhQUFhOztBQUVyQixRQUFRLGFBQWE7O0FBRXJCLFFBQVEsYUFBYTs7QUFFckIsUUFBUSxhQUFhOztBQUVyQixRQUFRLGFBQWE7O0FBRXJCLFFBQVEsYUFBYTs7QUFFckIsUUFBUSxhQUFhOztBQUVyQixRQUFRLGFBQWE7O0FBRXJCLFFBQVEsYUFBYTs7QUFFckIsU0FBUyxjQUFjOztBQUV2QixRQUFRLGlCQUFpQixDQUFDLFlBQVk7O0FBRXRDLFFBQVEsb0JBQW9CLENBQUMsaUJBQWlCLENBQUMsY0FBYzs7QUFFN0QsV0FBVyxpQkFBaUI7O0FBRTVCLFFBQVEsU0FBUyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxtQkFBbUI7O0FBRW5GLFlBQVksdUJBQXVCLENBQUMsa0JBQWtCLENBQUMsd0JBQXdCOztBQUUvRSxlQUFlLFVBQVU7O0FBRXpCLGdCQUFnQixXQUFXOztBQUUzQjtFQUNFO0FBQ0Y7O0FBRUEsNEJBQTRCLFNBQVMsQ0FBQyxVQUFZLENBQVosYUFBYTs7QUFHbkQ7RUFDRTtBQUNGOztBQUVBO0VBRUU7QUFDRjs7QUFJQTtFQUNFO0FBQ0Y7O0FBRUE7RUFDRTtBQUNGOztBQUdBO0VBQ0UsbUJBQW1CO0VBQ25CLGNBQWM7RUFDZCxhQUFhO0VBQ2IsY0FBYztFQUNkLHdCQUF3QjtFQUN4QixtQkFBbUI7RUFDbkIsa0JBQWtCO0VBQ2xCLG1CQUFtQjtBQUNyQjs7QUFHQTtFQUNFLHNCQUFzQjtBQUN4Qjs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0F5WEMiLCJmaWxlIjoicmVwbGFjZS1wYXNzLWZvcm0uY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuLmZhLC5mYWIsLmZhZCwuZmFsLC5mYXIsLmZhcyB7XHJcbiAgLW1vei1vc3gtZm9udC1zbW9vdGhpbmc6Z3JheXNjYWxlO1xyXG4gIC13ZWJraXQtZm9udC1zbW9vdGhpbmc6YW50aWFsaWFzZWQ7XHJcbiAgZGlzcGxheTppbmxpbmUtYmxvY2s7XHJcbiAgZm9udC1zdHlsZTpub3JtYWw7XHJcbiAgZm9udC12YXJpYW50Om5vcm1hbDtcclxuICB0ZXh0LXJlbmRlcmluZzphdXRvO2xpbmUtaGVpZ2h0OjFcclxufVxyXG5cclxuLmZhLWxnIHtcclxuICBmb250LXNpemU6MS4zMzMzM2VtO1xyXG4gIGxpbmUtaGVpZ2h0Oi43NWVtO1xyXG4gIHZlcnRpY2FsLWFsaWduOi0uMDY2N2VtXHJcbn1cclxuLyoqL1xyXG4uZmEteHMge2ZvbnQtc2l6ZTouNzVlbX1cclxuXHJcbi5mYS1zbSB7Zm9udC1zaXplOi44NzVlbX1cclxuXHJcbi5mYS0xeCB7Zm9udC1zaXplOjFlbX1cclxuXHJcbi5mYS0yeCB7Zm9udC1zaXplOjJlbX1cclxuXHJcbi5mYS0zeCB7Zm9udC1zaXplOjNlbX1cclxuXHJcbi5mYS00eCB7Zm9udC1zaXplOjRlbX1cclxuXHJcbi5mYS01eCB7Zm9udC1zaXplOjVlbX1cclxuXHJcbi5mYS02eCB7Zm9udC1zaXplOjZlbX1cclxuXHJcbi5mYS03eCB7Zm9udC1zaXplOjdlbX1cclxuXHJcbi5mYS04eCB7Zm9udC1zaXplOjhlbX1cclxuXHJcbi5mYS05eCB7Zm9udC1zaXplOjllbX1cclxuXHJcbi5mYS0xMHgge2ZvbnQtc2l6ZToxMGVtfVxyXG5cclxuLmZhLWZ3IHt0ZXh0LWFsaWduOmNlbnRlcjt3aWR0aDoxLjI1ZW19XHJcblxyXG4uZmEtdWwge2xpc3Qtc3R5bGUtdHlwZTpub25lO21hcmdpbi1sZWZ0OjIuNWVtO3BhZGRpbmctbGVmdDowfVxyXG5cclxuLmZhLXVsPmxpIHtwb3NpdGlvbjpyZWxhdGl2ZX1cclxuXHJcbi5mYS1saSB7bGVmdDotMmVtO3Bvc2l0aW9uOmFic29sdXRlO3RleHQtYWxpZ246Y2VudGVyO3dpZHRoOjJlbTtsaW5lLWhlaWdodDppbmhlcml0fVxyXG5cclxuLmZhLWJvcmRlciB7Ym9yZGVyOi4wOGVtIHNvbGlkICNlZWU7Ym9yZGVyLXJhZGl1czouMWVtO3BhZGRpbmc6LjJlbSAuMjVlbSAuMTVlbX1cclxuXHJcbi5mYS1wdWxsLWxlZnQge2Zsb2F0OmxlZnR9XHJcblxyXG4uZmEtcHVsbC1yaWdodCB7ZmxvYXQ6cmlnaHR9XHJcblxyXG4uZmEuZmEtcHVsbC1sZWZ0LC5mYWIuZmEtcHVsbC1sZWZ0LC5mYWwuZmEtcHVsbC1sZWZ0LC5mYXIuZmEtcHVsbC1sZWZ0LC5mYXMuZmEtcHVsbC1sZWZ0IHtcclxuICBtYXJnaW4tcmlnaHQ6LjNlbVxyXG59XHJcblxyXG4uaW5wdXQtd2l0aC1wcmUtaWNvbiBsYWJlbCB7bGVmdDozNnB4O3JpZ2h0OmluaXRpYWx9XHJcblxyXG5cclxuLmZhLmZhLXB1bGwtcmlnaHQsLmZhYi5mYS1wdWxsLXJpZ2h0LC5mYWwuZmEtcHVsbC1yaWdodCwuZmFyLmZhLXB1bGwtcmlnaHQsLmZhcy5mYS1wdWxsLXJpZ2h0IHtcclxuICBtYXJnaW4tbGVmdDouM2VtXHJcbn1cclxuXHJcbi5mYS1zcGluIHtcclxuICAtd2Via2l0LWFuaW1hdGlvbjpmYS1zcGluIDJzIGxpbmVhciBpbmZpbml0ZTtcclxuICBhbmltYXRpb246ZmEtc3BpbiAycyBsaW5lYXIgaW5maW5pdGVcclxufVxyXG5cclxuXHJcblxyXG4uZmEsLmZhciwuZmFzIHtcclxuICBmb250LWZhbWlseTogXCJGb250IEF3ZXNvbWUgNSBGcmVlXCIsIHNlcmlmXHJcbn1cclxuXHJcbi5mYSwuZmFzIHtcclxuICBmb250LXdlaWdodDo5MDBcclxufVxyXG5cclxuXHJcbi52LWJ0bl9fY29udGVudCB7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBjb2xvcjogaW5oZXJpdDtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXg6IDEgMCBhdXRvO1xyXG4gIGp1c3RpZnktY29udGVudDogaW5oZXJpdDtcclxuICBsaW5lLWhlaWdodDogbm9ybWFsO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICB0cmFuc2l0aW9uOiBpbmhlcml0O1xyXG59XHJcblxyXG5cclxuLnYtYnRuX19jb250ZW50IHtcclxuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xyXG59XHJcblxyXG5cclxuLypcclxuQHVzZSAnbWRiLWFuZ3VsYXItdWkta2l0L2Fzc2V0cy9zY3NzL2ZyZWUvZm9ybXMvX2Zvcm0tY29udHJvbCc7XHJcblxyXG5tZGItZm9ybS1jb250cm9sIHtcclxuICBkaXNwbGF5OiBibG9jaztcclxufVxyXG5cclxuXHJcblxyXG4uZm9ybS1jb250cm9sIHtcclxuICBtaW4taGVpZ2h0OiBhdXRvO1xyXG4gIHBhZGRpbmctdG9wOiA0cHg7XHJcbiAgcGFkZGluZy1ib3R0b206IDMuMjhweDtcclxuICB0cmFuc2l0aW9uOiBhbGwgMC4xcyBsaW5lYXI7XHJcblxyXG4gICY6Zm9jdXMge1xyXG4gICAgdHJhbnNpdGlvbjogYWxsIDAuMXMgbGluZWFyO1xyXG4gICAgYm9yZGVyLWNvbG9yOiAjMTI2NmYxO1xyXG4gICAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDAgMXB4ICMxMjY2ZjE7XHJcbiAgfVxyXG4gICYuZm9ybS1jb250cm9sLXNtIHtcclxuICAgIGZvbnQtc2l6ZTogMC43NzVyZW07XHJcbiAgICBsaW5lLWhlaWdodDogMS41O1xyXG4gIH1cclxuICAmLmZvcm0tY29udHJvbC1sZyB7XHJcbiAgICBsaW5lLWhlaWdodDogMi4xNTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDAuMjVyZW07XHJcbiAgfVxyXG59XHJcblxyXG4uc2VsZWN0IHtcclxuICB+IC5mb3JtLWxhYmVsIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMDtcclxuICAgIGxlZnQ6ICRmb3JtLWxhYmVsLWxlZnQ7XHJcbiAgICBwYWRkaW5nLXRvcDogJGZvcm0tbGFiZWwtcGFkZGluZy10b3A7XHJcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxuICAgIHRyYW5zZm9ybS1vcmlnaW46IDAgMDtcclxuICAgIHRyYW5zaXRpb246ICRmb3JtLWxhYmVsLXRyYW5zaXRpb247XHJcbiAgICBjb2xvcjogJGZvcm0tbGFiZWwtY29sb3I7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAwO1xyXG4gIH1cclxuICB+IC5mb3JtLW5vdGNoIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBtYXgtd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbiAgICBkaXYge1xyXG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxuICAgICAgYm9yZGVyOiAkYm9yZGVyLXdpZHRoIHNvbGlkO1xyXG4gICAgICBib3JkZXItY29sb3I6ICRmb3JtLW5vdGNoLWRpdi1ib3JkZXItY29sb3I7XHJcbiAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xyXG4gICAgfVxyXG4gICAgLmZvcm0tbm90Y2gtbGVhZGluZyB7XHJcbiAgICAgIGxlZnQ6IDA7XHJcbiAgICAgIHRvcDogMDtcclxuICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICB3aWR0aDogJGZvcm0tbm90Y2gtbGVhZGluZy13aWR0aDtcclxuICAgICAgYm9yZGVyLXJpZ2h0OiBub25lO1xyXG4gICAgICBib3JkZXItcmFkaXVzOiAkZm9ybS1ub3RjaC1sZWFkaW5nLWJvcmRlci1yYWRpdXMgMCAwICRmb3JtLW5vdGNoLWxlYWRpbmctYm9yZGVyLXJhZGl1cztcclxuICAgIH1cclxuICAgIC5mb3JtLW5vdGNoLW1pZGRsZSB7XHJcbiAgICAgIGZsZXg6IDAgMCBhdXRvO1xyXG4gICAgICB3aWR0aDogYXV0bztcclxuICAgICAgbWF4LXdpZHRoOiBjYWxjKDEwMCUgLSAjeyRmb3JtLW5vdGNoLW1pZGRsZS1tYXgtd2lkdGh9KTtcclxuICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICBib3JkZXItcmlnaHQ6IG5vbmU7XHJcbiAgICAgIGJvcmRlci1sZWZ0OiBub25lO1xyXG4gICAgfVxyXG4gICAgLmZvcm0tbm90Y2gtdHJhaWxpbmcge1xyXG4gICAgICBmbGV4LWdyb3c6IDE7XHJcbiAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgYm9yZGVyLWxlZnQ6IG5vbmU7XHJcbiAgICAgIGJvcmRlci1yYWRpdXM6IDAgJGZvcm0tbm90Y2gtdHJhaWxpbmctYm9yZGVyLXJhZGl1cyAkZm9ybS1ub3RjaC10cmFpbGluZy1ib3JkZXItcmFkaXVzIDA7XHJcbiAgICB9XHJcbiAgfVxyXG4gICYuZm9ybS1jb250cm9sOm5vdCgucGxhY2Vob2xkZXItYWN0aXZlKTo6cGxhY2Vob2xkZXIge1xyXG4gICAgb3BhY2l0eTogMDtcclxuICB9XHJcbiAgJiAuZm9ybS1jb250cm9sOmZvY3VzLFxyXG4gICYuYWN0aXZlIHtcclxuICAgICY6OnBsYWNlaG9sZGVyIHtcclxuICAgICAgb3BhY2l0eTogMTtcclxuICAgIH1cclxuICB9XHJcbiAgJiAuZm9ybS1jb250cm9sOmZvY3VzIHtcclxuICAgIGJveC1zaGFkb3c6IG5vbmUgIWltcG9ydGFudDtcclxuICB9XHJcbiAgLy8gJjpmb2N1cyB+IC5mb3JtLWxhYmVsLFxyXG4gICYuYWN0aXZlIH4gLmZvcm0tbGFiZWwge1xyXG4gICAgdHJhbnNmb3JtOiAkaW5wdXQtZm9jdXMtYWN0aXZlLWxhYmVsLXRyYW5zZm9ybTtcclxuICB9XHJcbiAgJiAuZm9ybS1jb250cm9sOmZvY3VzIH4gLmZvcm0tbGFiZWwge1xyXG4gICAgY29sb3I6ICRpbnB1dC1mb2N1cy1sYWJlbC1jb2xvcjtcclxuICB9XHJcbiAgJiAuZm9ybS1jb250cm9sOmZvY3VzIH4gLmZvcm0tbm90Y2ggLmZvcm0tbm90Y2gtbWlkZGxlLFxyXG4gICYgLmZvcm0tY29udHJvbC5hY3RpdmUgfiAuZm9ybS1ub3RjaCAuZm9ybS1ub3RjaC1taWRkbGUge1xyXG4gICAgYm9yZGVyLXRvcDogbm9uZTtcclxuICAgIGJvcmRlci1yaWdodDogbm9uZTtcclxuICAgIGJvcmRlci1sZWZ0OiBub25lO1xyXG4gICAgdHJhbnNpdGlvbjogJGlucHV0LXRyYW5zaXRpb247XHJcbiAgfVxyXG4gICY6Zm9jdXMgfiAuZm9ybS1ub3RjaCAuZm9ybS1ub3RjaC1taWRkbGUge1xyXG4gICAgYm9yZGVyLWJvdHRvbTogJGlucHV0LWZvY3VzLWJvcmRlci13aWR0aCBzb2xpZDtcclxuICAgIGJvcmRlci1jb2xvcjogJGlucHV0LWZvY3VzLWJvcmRlci1jb2xvcjtcclxuICB9XHJcbiAgJjpmb2N1cyB+IC5mb3JtLW5vdGNoIC5mb3JtLW5vdGNoLWxlYWRpbmcsXHJcbiAgJi5hY3RpdmUgfiAuZm9ybS1ub3RjaCAuZm9ybS1ub3RjaC1sZWFkaW5nIHtcclxuICAgIGJvcmRlci1yaWdodDogbm9uZTtcclxuICAgIHRyYW5zaXRpb246ICRpbnB1dC10cmFuc2l0aW9uO1xyXG4gIH1cclxuICAmOmZvY3VzIH4gLmZvcm0tbm90Y2ggLmZvcm0tbm90Y2gtbGVhZGluZyB7XHJcbiAgICBib3JkZXItdG9wOiAkaW5wdXQtZm9jdXMtYm9yZGVyLXdpZHRoIHNvbGlkICRpbnB1dC1mb2N1cy1ib3JkZXItY29sb3I7XHJcbiAgICBib3JkZXItYm90dG9tOiAkaW5wdXQtZm9jdXMtYm9yZGVyLXdpZHRoIHNvbGlkICRpbnB1dC1mb2N1cy1ib3JkZXItY29sb3I7XHJcbiAgICBib3JkZXItbGVmdDogJGlucHV0LWZvY3VzLWJvcmRlci13aWR0aCBzb2xpZCAkaW5wdXQtZm9jdXMtYm9yZGVyLWNvbG9yO1xyXG4gIH1cclxuICAmOmZvY3VzIH4gLmZvcm0tbm90Y2ggLmZvcm0tbm90Y2gtdHJhaWxpbmcsXHJcbiAgJi5hY3RpdmUgfiAuZm9ybS1ub3RjaCAuZm9ybS1ub3RjaC10cmFpbGluZyB7XHJcbiAgICBib3JkZXItbGVmdDogbm9uZTtcclxuICAgIHRyYW5zaXRpb246ICRpbnB1dC10cmFuc2l0aW9uO1xyXG4gIH1cclxuICAmOmZvY3VzIH4gLmZvcm0tbm90Y2ggLmZvcm0tbm90Y2gtdHJhaWxpbmcge1xyXG4gICAgYm9yZGVyLXRvcDogJGlucHV0LWZvY3VzLWJvcmRlci13aWR0aCBzb2xpZDtcclxuICAgIGJvcmRlci1ib3R0b206ICRpbnB1dC1mb2N1cy1ib3JkZXItd2lkdGggc29saWQ7XHJcbiAgICBib3JkZXItcmlnaHQ6ICRpbnB1dC1mb2N1cy1ib3JkZXItd2lkdGggc29saWQ7XHJcbiAgICBib3JkZXItY29sb3I6ICRpbnB1dC1mb2N1cy1ib3JkZXItY29sb3I7XHJcbiAgfVxyXG4gICY6ZGlzYWJsZWQsXHJcbiAgJi5kaXNhYmxlZCxcclxuICAmW3JlYWRvbmx5XSB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkaW5wdXQtZGlzYWJsZWQtYmFja2dyb3VuZC1jb2xvcjtcclxuICB9XHJcbiAgJi5mb3JtLWNvbnRyb2wtbGcge1xyXG4gICAgZm9udC1zaXplOiAkaW5wdXQtZm9udC1zaXplLWxnO1xyXG4gICAgbGluZS1oZWlnaHQ6ICRpbnB1dC1saW5lLWhlaWdodC1sZztcclxuICAgIHBhZGRpbmctbGVmdDogJGlucHV0LXBhZGRpbmctbGVmdC1sZztcclxuICAgIHBhZGRpbmctcmlnaHQ6ICRpbnB1dC1wYWRkaW5nLXJpZ2h0LWxnO1xyXG4gICAgfiAuZm9ybS1sYWJlbCB7XHJcbiAgICAgIHBhZGRpbmctdG9wOiAkZm9ybS1sYWJlbC1wYWRkaW5nLXRvcC1sZztcclxuICAgIH1cclxuICAgICY6Zm9jdXMgfiAuZm9ybS1sYWJlbCxcclxuICAgICYuYWN0aXZlIH4gLmZvcm0tbGFiZWwge1xyXG4gICAgICB0cmFuc2Zvcm06ICRpbnB1dC1mb2N1cy1hY3RpdmUtbGFiZWwtdHJhbnNmb3JtLWxnO1xyXG4gICAgfVxyXG4gIH1cclxuICAmLmZvcm0tY29udHJvbC1zbSB7XHJcbiAgICBwYWRkaW5nLWxlZnQ6ICRpbnB1dC1wYWRkaW5nLWxlZnQtc207XHJcbiAgICBwYWRkaW5nLXJpZ2h0OiAkaW5wdXQtcGFkZGluZy1yaWdodC1zbTtcclxuICAgIHBhZGRpbmctdG9wOiAkaW5wdXQtcGFkZGluZy10b3Atc207XHJcbiAgICBwYWRkaW5nLWJvdHRvbTogJGlucHV0LXBhZGRpbmctYm90dG9tLXNtO1xyXG4gICAgZm9udC1zaXplOiAkaW5wdXQtZm9udC1zaXplLXNtO1xyXG4gICAgbGluZS1oZWlnaHQ6ICRpbnB1dC1saW5lLWhlaWdodC1zbTtcclxuICAgIH4gLmZvcm0tbGFiZWwge1xyXG4gICAgICBwYWRkaW5nLXRvcDogJGZvcm0tbGFiZWwtcGFkZGluZy10b3Atc207XHJcbiAgICAgIGZvbnQtc2l6ZTogJGZvcm0tbGFiZWwtZm9udC1zaXplLXNtO1xyXG4gICAgfVxyXG4gICAgJjpmb2N1cyB+IC5mb3JtLWxhYmVsLFxyXG4gICAgJi5hY3RpdmUgfiAuZm9ybS1sYWJlbCB7XHJcbiAgICAgIHRyYW5zZm9ybTogJGlucHV0LWZvY3VzLWFjdGl2ZS1sYWJlbC10cmFuc2Zvcm0tc207XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4kZm9ybS1sYWJlbC1sZWZ0OiAxLjc1cmVtO1xyXG5cclxuXHJcbi5mb3JtLW91dGxpbmUge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbiAgLmZvcm0taGVscGVyIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgZm9udC1zaXplOiAwLjg3NWVtO1xyXG4gICAgY29sb3I6ICM3NTc1NzU7XHJcbiAgICAuZm9ybS1jb3VudGVyIHtcclxuICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAudHJhaWxpbmcge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgcmlnaHQ6IDEwcHg7XHJcbiAgICBsZWZ0OiBpbml0aWFsO1xyXG4gICAgdG9wOiA1MCU7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7XHJcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxuICB9XHJcblxyXG4gIC5mb3JtLWljb24tdHJhaWxpbmcge1xyXG4gICAgcGFkZGluZy1yaWdodDogMnJlbSAhaW1wb3J0YW50O1xyXG4gIH1cclxuXHJcbiAgLmZvcm0tY29udHJvbCB7XHJcbiAgICBtaW4taGVpZ2h0OiBhdXRvO1xyXG4gICAgcGFkZGluZy10b3A6ICRpbnB1dC1wYWRkaW5nLXRvcDtcclxuICAgIHBhZGRpbmctYm90dG9tOiAkaW5wdXQtcGFkZGluZy1ib3R0b207XHJcbiAgICBwYWRkaW5nLWxlZnQ6ICRpbnB1dC1wYWRkaW5nLWxlZnQ7XHJcbiAgICBwYWRkaW5nLXJpZ2h0OiAkaW5wdXQtcGFkZGluZy1yaWdodDtcclxuICAgIGJvcmRlcjogMDtcclxuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xyXG4gICAgdHJhbnNpdGlvbjogJGlucHV0LXRyYW5zaXRpb247XHJcbiAgICB+IC5mb3JtLWxhYmVsIHtcclxuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICB0b3A6IDA7XHJcbiAgICAgIG1heC13aWR0aDogOTAlO1xyXG4gICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG4gICAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcclxuICAgICAgbGVmdDogJGZvcm0tbGFiZWwtbGVmdDtcclxuICAgICAgcGFkZGluZy10b3A6ICRmb3JtLWxhYmVsLXBhZGRpbmctdG9wO1xyXG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxuICAgICAgdHJhbnNmb3JtLW9yaWdpbjogMCAwO1xyXG4gICAgICB0cmFuc2l0aW9uOiAkZm9ybS1sYWJlbC10cmFuc2l0aW9uO1xyXG4gICAgICBjb2xvcjogJGZvcm0tbGFiZWwtY29sb3I7XHJcbiAgICAgIG1hcmdpbi1ib3R0b206IDA7XHJcbiAgICB9XHJcbiAgICB+IC5mb3JtLW5vdGNoIHtcclxuICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICBsZWZ0OiAwO1xyXG4gICAgICB0b3A6IDA7XHJcbiAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICBtYXgtd2lkdGg6IDEwMCU7XHJcbiAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbiAgICAgIGRpdiB7XHJcbiAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbiAgICAgICAgYm9yZGVyOiAkYm9yZGVyLXdpZHRoIHNvbGlkO1xyXG4gICAgICAgIGJvcmRlci1jb2xvcjogJGZvcm0tbm90Y2gtZGl2LWJvcmRlci1jb2xvcjtcclxuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xyXG4gICAgICB9XHJcbiAgICAgIC5mb3JtLW5vdGNoLWxlYWRpbmcge1xyXG4gICAgICAgIGxlZnQ6IDA7XHJcbiAgICAgICAgdG9wOiAwO1xyXG4gICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICB3aWR0aDogJGZvcm0tbm90Y2gtbGVhZGluZy13aWR0aDtcclxuICAgICAgICBib3JkZXItcmlnaHQ6IG5vbmU7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogJGZvcm0tbm90Y2gtbGVhZGluZy1ib3JkZXItcmFkaXVzIDAgMCAkZm9ybS1ub3RjaC1sZWFkaW5nLWJvcmRlci1yYWRpdXM7XHJcbiAgICAgIH1cclxuICAgICAgLmZvcm0tbm90Y2gtbWlkZGxlIHtcclxuICAgICAgICBmbGV4OiAwIDAgYXV0bztcclxuICAgICAgICB3aWR0aDogYXV0bztcclxuICAgICAgICBtYXgtd2lkdGg6IGNhbGMoMTAwJSAtICN7JGZvcm0tbm90Y2gtbWlkZGxlLW1heC13aWR0aH0pO1xyXG4gICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICBib3JkZXItcmlnaHQ6IG5vbmU7XHJcbiAgICAgICAgYm9yZGVyLWxlZnQ6IG5vbmU7XHJcbiAgICAgIH1cclxuICAgICAgLmZvcm0tbm90Y2gtdHJhaWxpbmcge1xyXG4gICAgICAgIGZsZXgtZ3JvdzogMTtcclxuICAgICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgICAgYm9yZGVyLWxlZnQ6IG5vbmU7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMCAkZm9ybS1ub3RjaC10cmFpbGluZy1ib3JkZXItcmFkaXVzICRmb3JtLW5vdGNoLXRyYWlsaW5nLWJvcmRlci1yYWRpdXMgMDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgJjpub3QoLnBsYWNlaG9sZGVyLWFjdGl2ZSk6OnBsYWNlaG9sZGVyIHtcclxuICAgICAgb3BhY2l0eTogMDtcclxuICAgIH1cclxuICAgICY6Zm9jdXMsXHJcbiAgICAmLmFjdGl2ZSB7XHJcbiAgICAgICY6OnBsYWNlaG9sZGVyIHtcclxuICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAmOmZvY3VzIHtcclxuICAgICAgYm94LXNoYWRvdzogbm9uZSAhaW1wb3J0YW50O1xyXG4gICAgfVxyXG4gICAgJjpmb2N1cyB+IC5mb3JtLWxhYmVsLFxyXG4gICAgJi5hY3RpdmUgfiAuZm9ybS1sYWJlbCB7XHJcbiAgICAgIHRyYW5zZm9ybTogJGlucHV0LWZvY3VzLWFjdGl2ZS1sYWJlbC10cmFuc2Zvcm07XHJcbiAgICB9XHJcbiAgICAmOmZvY3VzIH4gLmZvcm0tbGFiZWwge1xyXG4gICAgICBjb2xvcjogJGlucHV0LWZvY3VzLWxhYmVsLWNvbG9yO1xyXG4gICAgfVxyXG4gICAgJjpmb2N1cyB+IC5mb3JtLW5vdGNoIC5mb3JtLW5vdGNoLW1pZGRsZSxcclxuICAgICYuYWN0aXZlIH4gLmZvcm0tbm90Y2ggLmZvcm0tbm90Y2gtbWlkZGxlIHtcclxuICAgICAgYm9yZGVyLXRvcDogbm9uZTtcclxuICAgICAgYm9yZGVyLXJpZ2h0OiBub25lO1xyXG4gICAgICBib3JkZXItbGVmdDogbm9uZTtcclxuICAgICAgdHJhbnNpdGlvbjogJGlucHV0LXRyYW5zaXRpb247XHJcbiAgICB9XHJcbiAgICAmOmZvY3VzIH4gLmZvcm0tbm90Y2ggLmZvcm0tbm90Y2gtbWlkZGxlIHtcclxuICAgICAgYm9yZGVyLWJvdHRvbTogJGlucHV0LWZvY3VzLWJvcmRlci13aWR0aCBzb2xpZDtcclxuICAgICAgYm9yZGVyLWNvbG9yOiAkaW5wdXQtZm9jdXMtYm9yZGVyLWNvbG9yO1xyXG4gICAgfVxyXG4gICAgJjpmb2N1cyB+IC5mb3JtLW5vdGNoIC5mb3JtLW5vdGNoLWxlYWRpbmcsXHJcbiAgICAmLmFjdGl2ZSB+IC5mb3JtLW5vdGNoIC5mb3JtLW5vdGNoLWxlYWRpbmcge1xyXG4gICAgICBib3JkZXItcmlnaHQ6IG5vbmU7XHJcbiAgICAgIHRyYW5zaXRpb246ICRpbnB1dC10cmFuc2l0aW9uO1xyXG4gICAgfVxyXG4gICAgJjpmb2N1cyB+IC5mb3JtLW5vdGNoIC5mb3JtLW5vdGNoLWxlYWRpbmcge1xyXG4gICAgICBib3JkZXItdG9wOiAkaW5wdXQtZm9jdXMtYm9yZGVyLXdpZHRoIHNvbGlkICRpbnB1dC1mb2N1cy1ib3JkZXItY29sb3I7XHJcbiAgICAgIGJvcmRlci1ib3R0b206ICRpbnB1dC1mb2N1cy1ib3JkZXItd2lkdGggc29saWQgJGlucHV0LWZvY3VzLWJvcmRlci1jb2xvcjtcclxuICAgICAgYm9yZGVyLWxlZnQ6ICRpbnB1dC1mb2N1cy1ib3JkZXItd2lkdGggc29saWQgJGlucHV0LWZvY3VzLWJvcmRlci1jb2xvcjtcclxuICAgIH1cclxuICAgICY6Zm9jdXMgfiAuZm9ybS1ub3RjaCAuZm9ybS1ub3RjaC10cmFpbGluZyxcclxuICAgICYuYWN0aXZlIH4gLmZvcm0tbm90Y2ggLmZvcm0tbm90Y2gtdHJhaWxpbmcge1xyXG4gICAgICBib3JkZXItbGVmdDogbm9uZTtcclxuICAgICAgdHJhbnNpdGlvbjogJGlucHV0LXRyYW5zaXRpb247XHJcbiAgICB9XHJcbiAgICAmOmZvY3VzIH4gLmZvcm0tbm90Y2ggLmZvcm0tbm90Y2gtdHJhaWxpbmcge1xyXG4gICAgICBib3JkZXItdG9wOiAkaW5wdXQtZm9jdXMtYm9yZGVyLXdpZHRoIHNvbGlkICRpbnB1dC1mb2N1cy1ib3JkZXItY29sb3I7XHJcbiAgICAgIGJvcmRlci1ib3R0b206ICRpbnB1dC1mb2N1cy1ib3JkZXItd2lkdGggc29saWQgJGlucHV0LWZvY3VzLWJvcmRlci1jb2xvcjtcclxuICAgICAgYm9yZGVyLXJpZ2h0OiAkaW5wdXQtZm9jdXMtYm9yZGVyLXdpZHRoIHNvbGlkICRpbnB1dC1mb2N1cy1ib3JkZXItY29sb3I7XHJcbiAgICB9XHJcbiAgICA6ZGlzYWJsZWQsXHJcbiAgICAmLmRpc2FibGVkLFxyXG4gICAgJltyZWFkb25seV0ge1xyXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkaW5wdXQtZGlzYWJsZWQtYmFja2dyb3VuZC1jb2xvcjtcclxuICAgIH1cclxuICAgICYuZm9ybS1jb250cm9sLWxnIHtcclxuICAgICAgZm9udC1zaXplOiAkaW5wdXQtZm9udC1zaXplLWxnO1xyXG4gICAgICBsaW5lLWhlaWdodDogJGlucHV0LWxpbmUtaGVpZ2h0LWxnO1xyXG4gICAgICBwYWRkaW5nLWxlZnQ6ICRpbnB1dC1wYWRkaW5nLWxlZnQtbGc7XHJcbiAgICAgIHBhZGRpbmctcmlnaHQ6ICRpbnB1dC1wYWRkaW5nLXJpZ2h0LWxnO1xyXG4gICAgICB+IC5mb3JtLWxhYmVsIHtcclxuICAgICAgICBwYWRkaW5nLXRvcDogJGZvcm0tbGFiZWwtcGFkZGluZy10b3AtbGc7XHJcbiAgICAgIH1cclxuICAgICAgJjpmb2N1cyB+IC5mb3JtLWxhYmVsLFxyXG4gICAgICAmLmFjdGl2ZSB+IC5mb3JtLWxhYmVsIHtcclxuICAgICAgICB0cmFuc2Zvcm06ICRpbnB1dC1mb2N1cy1hY3RpdmUtbGFiZWwtdHJhbnNmb3JtLWxnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAmLmZvcm0tY29udHJvbC1zbSB7XHJcbiAgICAgIHBhZGRpbmctbGVmdDogJGlucHV0LXBhZGRpbmctbGVmdC1zbTtcclxuICAgICAgcGFkZGluZy1yaWdodDogJGlucHV0LXBhZGRpbmctcmlnaHQtc207XHJcbiAgICAgIHBhZGRpbmctdG9wOiAkaW5wdXQtcGFkZGluZy10b3Atc207XHJcbiAgICAgIHBhZGRpbmctYm90dG9tOiAkaW5wdXQtcGFkZGluZy1ib3R0b20tc207XHJcbiAgICAgIGZvbnQtc2l6ZTogJGlucHV0LWZvbnQtc2l6ZS1zbTtcclxuICAgICAgbGluZS1oZWlnaHQ6ICRpbnB1dC1saW5lLWhlaWdodC1zbTtcclxuICAgICAgfiAuZm9ybS1sYWJlbCB7XHJcbiAgICAgICAgcGFkZGluZy10b3A6ICRmb3JtLWxhYmVsLXBhZGRpbmctdG9wLXNtO1xyXG4gICAgICAgIGZvbnQtc2l6ZTogJGZvcm0tbGFiZWwtZm9udC1zaXplLXNtO1xyXG4gICAgICB9XHJcbiAgICAgIDpmb2N1cyB+IC5mb3JtLWxhYmVsLFxyXG4gICAgICAmLmFjdGl2ZSB+IC5mb3JtLWxhYmVsIHtcclxuICAgICAgICB0cmFuc2Zvcm06ICRpbnB1dC1mb2N1cy1hY3RpdmUtbGFiZWwtdHJhbnNmb3JtLXNtO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAmLmZvcm0td2hpdGUge1xyXG4gICAgLmZvcm0tY29udHJvbCB7XHJcbiAgICAgIGNvbG9yOiAkZm9ybS13aGl0ZS1pbnB1dC1jb2xvcjtcclxuICAgICAgfiAuZm9ybS1sYWJlbCB7XHJcbiAgICAgICAgY29sb3I6ICRmb3JtLXdoaXRlLWxhYmVsLWNvbG9yO1xyXG4gICAgICB9XHJcbiAgICAgIH4gLmZvcm0tbm90Y2gge1xyXG4gICAgICAgIGRpdiB7XHJcbiAgICAgICAgICBib3JkZXItY29sb3I6ICRmb3JtLXdoaXRlLW5vdGNoLWRpdi1ib3JkZXItY29sb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgICY6Zm9jdXMgfiAuZm9ybS1sYWJlbCB7XHJcbiAgICAgICAgY29sb3I6ICRmb3JtLXdoaXRlLWlucHV0LWZvY3VzLWxhYmVsLWNvbG9yO1xyXG4gICAgICB9XHJcbiAgICAgICY6Zm9jdXMgfiAuZm9ybS1ub3RjaCAuZm9ybS1ub3RjaC1taWRkbGUge1xyXG4gICAgICAgIGJvcmRlci1jb2xvcjogJGZvcm0td2hpdGUtaW5wdXQtZm9jdXMtYm9yZGVyLWNvbG9yO1xyXG4gICAgICB9XHJcbiAgICAgICY6Zm9jdXMgfiAuZm9ybS1ub3RjaCAuZm9ybS1ub3RjaC1sZWFkaW5nIHtcclxuICAgICAgICBib3JkZXItdG9wOiAkaW5wdXQtZm9jdXMtYm9yZGVyLXdpZHRoIHNvbGlkICRmb3JtLXdoaXRlLWlucHV0LWZvY3VzLWJvcmRlci1jb2xvcjtcclxuICAgICAgICBib3JkZXItYm90dG9tOiAkaW5wdXQtZm9jdXMtYm9yZGVyLXdpZHRoIHNvbGlkICRmb3JtLXdoaXRlLWlucHV0LWZvY3VzLWJvcmRlci1jb2xvcjtcclxuICAgICAgICBib3JkZXItbGVmdDogJGlucHV0LWZvY3VzLWJvcmRlci13aWR0aCBzb2xpZCAkZm9ybS13aGl0ZS1pbnB1dC1mb2N1cy1ib3JkZXItY29sb3I7XHJcbiAgICAgIH1cclxuICAgICAgJjpmb2N1cyB+IC5mb3JtLW5vdGNoIC5mb3JtLW5vdGNoLXRyYWlsaW5nIHtcclxuICAgICAgICBib3JkZXItY29sb3I6ICRmb3JtLXdoaXRlLWlucHV0LWZvY3VzLWJvcmRlci1jb2xvcjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuKi9cclxuIl19 */"] });


/***/ }),

/***/ 61527:
/*!****************************************!*\
  !*** ./src/app/page/page.component.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Page2Component; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37716);

class Page2Component {
}
Page2Component.ɵfac = function Page2Component_Factory(t) { return new (t || Page2Component)(); };
Page2Component.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: Page2Component, selectors: [["storybook-page2"]], decls: 4, vars: 0, consts: [[1, "Frame-1"], [1, "Desktop-1Login-1"], ["src", "assets/images/icon-1.webp", "srcset", "/assets/images/icon-1@2x.webp 2x, /assets/images/icon-1@3x.webp 3x", "alt", "icon-1", 1, "icon-1"], ["src", "assets/images/icon-2.webp", "srcset", "/assets/images/icon-2@2x.webp 2x, /assets/images/icon-2@3x.webp 3x", "alt", "icon-2szd", 1, "icon-2"]], template: function Page2Component_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "img", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: [".Desktop-1Login-1[_ngcontent-%COMP%] {\n  width: 1920px;\n  height: 1080px;\n  background: linear-gradient(228.37deg, #EFF8FF 22.25%, #B0DCFF 88.18%);\n}\n\n.Frame-1[_ngcontent-%COMP%] {\n  width: 1920px;\n  height: 1080px;\n  flex-grow: 0;\n}\n\n.fa-pull-left[_ngcontent-%COMP%] {\n  float: left;\n}\n\n.fa-pull-right[_ngcontent-%COMP%] {\n  float: right;\n}\n\nimg.icon-1[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 305.7px;\n  height: 309px;\n  transform: rotate(0deg);\n  background-position: bottom;\n}\n\nimg.icon-2[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  width: 300px;\n  height: 250px;\n  margin-right: 1em;\n  -o-object-fit: none;\n     object-fit: none;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2UuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFDRSxhQUFBO0VBQ0EsY0FBQTtFQUNBLHNFQUFBO0FBQUY7O0FBR0E7RUFDRSxhQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7QUFBRjs7QUFHQTtFQUFlLFdBQUE7QUFDZjs7QUFDQTtFQUFnQixZQUFBO0FBR2hCOztBQURBO0VBQ0Usa0JBQUE7RUFDQSxjQUFBO0VBQ0EsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsMkJBQUE7QUFJRjs7QUFEQTtFQUNFLGtCQUFBO0VBQ0EsU0FBQTtFQUNBLFFBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtFQUNBLGlCQUFBO0VBQ0EsbUJBQUE7S0FBQSxnQkFBQTtBQUlGIiwiZmlsZSI6InBhZ2UuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLkRlc2t0b3AtMUxvZ2luLTEge1xyXG4gIHdpZHRoOiAxOTIwcHg7XHJcbiAgaGVpZ2h0OiAxMDgwcHg7XHJcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDIyOC4zN2RlZywgI0VGRjhGRiAyMi4yNSUsICNCMERDRkYgODguMTglKTtcclxufVxyXG5cclxuLkZyYW1lLTEge1xyXG4gIHdpZHRoOiAxOTIwcHg7XHJcbiAgaGVpZ2h0OiAxMDgwcHg7XHJcbiAgZmxleC1ncm93OiAwO1xyXG59XHJcblxyXG4uZmEtcHVsbC1sZWZ0IHtmbG9hdDpsZWZ0fVxyXG5cclxuLmZhLXB1bGwtcmlnaHQge2Zsb2F0OnJpZ2h0fVxyXG5cclxuaW1nLmljb24tMSB7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHdpZHRoOiAzMDUuN3B4O1xyXG4gIGhlaWdodDogMzA5cHg7XHJcbiAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XHJcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogYm90dG9tO1xyXG59XHJcblxyXG5pbWcuaWNvbi0yIHtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgYm90dG9tOiAwO1xyXG4gIHJpZ2h0OiAwO1xyXG4gIHdpZHRoOiAzMDBweDtcclxuICBoZWlnaHQ6IDI1MHB4O1xyXG4gIG1hcmdpbi1yaWdodDogMWVtO1xyXG4gIG9iamVjdC1maXQ6IG5vbmU7XHJcbn1cclxuXHJcblxyXG5cclxuIl19 */"] });


/***/ }),

/***/ 81582:
/*!*************************************************!*\
  !*** ./src/app/pipes/api-error-message.pipe.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApiErrorMessagePipe": function() { return /* binding */ ApiErrorMessagePipe; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37716);

class ApiErrorMessagePipe {
    transform(message, ...args) {
        const dataToArray = message.split(',').map(item => item.trim());
        // convert array to string replacing comma with new line
        return dataToArray.join('\n');
    }
}
ApiErrorMessagePipe.ɵfac = function ApiErrorMessagePipe_Factory(t) { return new (t || ApiErrorMessagePipe)(); };
ApiErrorMessagePipe.ɵpipe = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({ name: "apiErrorMessage", type: ApiErrorMessagePipe, pure: true });


/***/ }),

/***/ 74164:
/*!***************************************************!*\
  !*** ./src/app/pipes/login-error-message.pipe.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LoginErrorMessagePipe": function() { return /* binding */ LoginErrorMessagePipe; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37716);

class LoginErrorMessagePipe {
    transform(message, ...args) {
        const dataToArray = message.split(',').map(item => item.trim());
        // convert array to string replacing comma with new line
        return dataToArray.join('\n');
    }
}
LoginErrorMessagePipe.ɵfac = function LoginErrorMessagePipe_Factory(t) { return new (t || LoginErrorMessagePipe)(); };
LoginErrorMessagePipe.ɵpipe = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({ name: "loginErrorMessage", type: LoginErrorMessagePipe, pure: true });


/***/ }),

/***/ 96630:
/*!**********************************************!*\
  !*** ./src/app/profile/profile.component.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ProfileComponent": function() { return /* binding */ ProfileComponent; }
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 26215);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 40205);
/* harmony import */ var _app_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app.config */ 49670);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _services_token_storage_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/token-storage.service */ 93590);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 39895);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_services/auth.service */ 88368);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 38583);







function ProfileComponent_div_0_li_40_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const role_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", role_r4, " ");
} }
function ProfileComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "header", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "h3", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7, "accessToken:");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11, "refreshToken:");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](13, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "button", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ProfileComponent_div_0_Template_button_click_14_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r6); const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r5.forseRefreshToken(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](15, "Refresh");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](16, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "button", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ProfileComponent_div_0_Template_button_click_17_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r6); const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r7.openNewTabForApp("GCCS", "/accGCCS/"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](18, "Open new tab for GCCS");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](19, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "button", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ProfileComponent_div_0_Template_button_click_20_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r6); const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r8.openNewWinForApp("AGENT", "/accAgent/"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](21, "Open new tab for Agent");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](22, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](23, "button", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ProfileComponent_div_0_Template_button_click_23_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r6); const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r9.openNewTabForApp("ACCREALTIME", "/accRealTime/"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](24, "Open new tab for WebRT");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](25, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](26, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](27, "Email:");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](28);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](29, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](30, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](31, "ID:");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](32);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](33, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](34, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](35, "Web App:");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](36);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](37, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](38, "Roles:");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](39, "ul");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](40, ProfileComponent_div_0_li_40_Template, 2, 1, "li", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](41, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](42, "a", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](43, "Tadiran Azure");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](44, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](45, "a", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](46, "aeonix4cloud");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](47, "iframe", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](48, "ul", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](49, "li", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](50, "a", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](51, "img", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](52, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](53, "h5", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](54, "aeonix - SERVER");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](55, " Aeonix is a software only communications solution that consolidates disparate business applications into a single, fault tolerant platform. The Aeonix Unified Communications platform, Aeonix Contact Center(ACC), and Aeonix Dispatch Console (ADC), all reside in one virtual instance or COTS server. Aeonix runs on any virtualization platform including VMware, Hyper-V and cloud platforms such as AWS, and can easily port from one platform to another. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](56, "li", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](57, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ProfileComponent_div_0_Template_button_click_57_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r6); const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r10.openapp(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](58, "img", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](59, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](60, "h5", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](61, "AccGCCS - SERVER");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](62, " Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](63, "li", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](64, "a", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](65, "img", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](66, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](67, "h5", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](68, "AccGCCS - LOCAL");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](69, " Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](70, "li", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](71, "a", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](72, "img", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](73, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](74, "h5", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](75, "AccWebRT - LOCAL");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](76, " Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](77, "li", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](78, "a", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](79, "img", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](80, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](81, "h5", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](82, "AccAgent - SERVER");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](83, " Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx_r0.currentUser.username, " Profile ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx_r0.accessToken, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx_r0.refreshToken, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx_r0.currentUser.email, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx_r0.currentUser.id, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx_r0.currentUser.webApp, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r0.currentUser.roles);
} }
function ProfileComponent_ng_template_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](0, " Please login.\n");
} }
class ProfileComponent {
    constructor(token, router, authService) {
        this.token = token;
        this.router = router;
        this.authService = authService;
        this.refreshTokenSubject = new rxjs__WEBPACK_IMPORTED_MODULE_4__.BehaviorSubject(null);
        this.isRefreshing = false;
        this.TOKEN_KEY = _app_config__WEBPACK_IMPORTED_MODULE_0__.AppConfig.endpoints.TOKEN_KEY;
    }
    ngOnInit() {
        this.currentUser = this.token.getUser();
        this.accessToken = this.currentUser.accessToken;
        this.refreshToken = this.currentUser.refreshToken;
    }
    openapp() {
        console.log('window.location.origin.toString():  ' + window.location.origin.toString());
        this.router.navigate([]).then(result => { this.windowObjectReference = window.open(_app_config__WEBPACK_IMPORTED_MODULE_0__.AppConfig.accServer.ACCWEBServers + '/accGCCS/' /*window.location.origin.toString()+"/profile"*/); });
        //console.log('window.location.origin.toString():  '+ this.windowObjectReference
        console.log('window.location.origin.toString():  ' + this.windowObjectReference.window.document.getElementById("profile_title").innerHTML);
        var promise = new Promise((resolve, reject) => { this.windowObjectReference.window.document.getElementById("profile_title").innerHTML = "new title"; });
        //this.windowObjectReference.window.document.getElementById("profile_title").innerHTML = "new title";
        //this.windowObjectReference.window.document.done.
        console.log('window.location.origin.toString():  ' + this.windowObjectReference.window.document.getElementById("profile_title").innerHTML);
        //let { username, password } = this.loginForm.value;
        //username = this.loginForm.get(['username'])?.value.toString();
        //let password = this.loginForm.get(['password'])?.value.toString();
        //this.authenticationService.logout();
    }
    forseRefreshToken() {
        //@Value("${bezkoder.app.jwtExpirationMs}")
        if (!this.isRefreshing) {
            const token = this.token.getRefreshToken();
            if (token)
                this.authService.refreshToken(token).subscribe(data => {
                    this.isRefreshing = false;
                    this.token.saveToken(data.accessToken);
                    this.token.saveRefreshToken(data.refreshToken);
                    this.refreshTokenSubject.next(data.accessToken);
                    this.currentUser = this.token.getUser();
                    this.accessToken = this.token.getToken();
                    this.refreshToken = this.token.getRefreshToken();
                }, (err) => {
                    this.isRefreshing = false;
                    this.token.signOut();
                    return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(err);
                });
        }
    }
    openNewTabForApp(webapp, webappURLPrefix) {
        var newAccessToken = "";
        var newRefreshToken = "";
        var newCurrentUser = "";
        if (!this.isRefreshing) {
            const token = this.token.getRefreshToken();
            if (token)
                this.authService.webapptab(token, webapp)
                    .then(data => {
                    this.isRefreshing = false;
                    newAccessToken = (data.accessToken);
                    newRefreshToken = (data.refreshToken);
                    newCurrentUser = (data);
                }, (reject) => { return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(reject.error); })
                    .then(() => {
                    this.router.navigate([])
                        .then(result => { this.windowObjectReference = window.open(_app_config__WEBPACK_IMPORTED_MODULE_0__.AppConfig.accServer.ACCWEBServers + webappURLPrefix); })
                        .then(result => {
                        this.windowObjectReference.window.sessionStorage.setItem(_app_config__WEBPACK_IMPORTED_MODULE_0__.AppConfig.endpoints.TOKEN_KEY, newAccessToken);
                        this.windowObjectReference.window.sessionStorage.setItem(_app_config__WEBPACK_IMPORTED_MODULE_0__.AppConfig.endpoints.REFRESHTOKEN_KEY, newRefreshToken);
                        this.windowObjectReference.window.sessionStorage.setItem(_app_config__WEBPACK_IMPORTED_MODULE_0__.AppConfig.endpoints.USER_KEY, JSON.stringify(newCurrentUser));
                    }, (err) => {
                        this.isRefreshing = false;
                        return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(err);
                    });
                });
        }
    }
    openNewWinForApp(webapp, webappURLPrefix) {
        var newAccessToken = "";
        var newRefreshToken = "";
        var newCurrentUser = "";
        if (!this.isRefreshing) {
            const token = this.token.getRefreshToken();
            if (token)
                this.authService.webapptab(token, webapp)
                    .then(data => {
                    this.isRefreshing = false;
                    newAccessToken = (data.accessToken);
                    newRefreshToken = (data.refreshToken);
                    newCurrentUser = (data);
                }, (reject) => { return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(reject.error); })
                    .then(result => {
                    this.windowObjectReference = window.open(_app_config__WEBPACK_IMPORTED_MODULE_0__.AppConfig.accServer.ACCWEBServers + webappURLPrefix + 'start.html', 'C-Sharpcorner', 'scrollbars=no');
                })
                    .then(result => {
                    this.windowObjectReference.window.sessionStorage.setItem(_app_config__WEBPACK_IMPORTED_MODULE_0__.AppConfig.endpoints.TOKEN_KEY, newAccessToken);
                    this.windowObjectReference.window.sessionStorage.setItem(_app_config__WEBPACK_IMPORTED_MODULE_0__.AppConfig.endpoints.REFRESHTOKEN_KEY, newRefreshToken);
                    this.windowObjectReference.window.sessionStorage.setItem(_app_config__WEBPACK_IMPORTED_MODULE_0__.AppConfig.endpoints.USER_KEY, JSON.stringify(newCurrentUser));
                }, (err) => {
                    this.isRefreshing = false;
                    return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(err);
                });
        }
    }
}
ProfileComponent.ɵfac = function ProfileComponent_Factory(t) { return new (t || ProfileComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_token_storage_service__WEBPACK_IMPORTED_MODULE_1__.TokenStorageService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_6__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_2__.AuthService)); };
ProfileComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: ProfileComponent, selectors: [["app-profile"]], decls: 3, vars: 2, consts: [["class", "container", 4, "ngIf", "ngIfElse"], ["loggedOut", ""], [1, "container"], [1, "background", "jumbotron"], ["id", "profile_title", 1, "font_0"], ["id", "forseRefreshToken", 2, "text-align", "left", "width", "auto", "cursor", "pointer", 3, "click"], ["id", "openNewGccsTab", 2, "text-align", "left", "width", "auto", "cursor", "pointer", 3, "click"], ["id", "openNewAgentTab", 2, "text-align", "left", "width", "auto", "cursor", "pointer", 3, "click"], ["id", "openNewWebRTTab", 2, "text-align", "left", "width", "auto", "cursor", "pointer", 3, "click"], [4, "ngFor", "ngForOf"], ["href", "http://tadiran2014.azurewebsites.net/en/products/unified-communications/aeonix/", "id", "testid2", "target", "iframe_a"], ["href", "https://www.tadirantele.com/aeonix4cloud", "id", "testid4", "target", "iframe_a"], ["src", "https://www.tadirantele.com/aeonix4cloud", "sandbox", "allow-same-origin allow-scripts allow-popups allow-forms", "name", "iframe_a", "height", "550px", "width", "100%", "title", "Iframe Example"], [1, "list-unstyled"], [1, "media"], ["href", "https://172.28.8.245:8443/aeonix/mainForm.jsf", "target", "_blank", "aria-current", "true", 1, "app-icon-wide"], ["src", "../../AccGate/assets/images/aeonix_logo_72.png", "alt", "Icon app number 1", 1, ""], [1, "media-body"], [1, "mt-0", "mb-1"], [1, "media", "my-4"], [1, "app-icon", 3, "click"], ["src", "../../AccGate/assets/images/dashboard.png", "alt", "Icon app number 2", 1, "app-icon"], ["href", "https://localhost:8445/accGCCS/", "id", "testid3", "target", "iframe_a", "rel", "noopener", "aria-current", "false"], ["src", "../../AccGate/assets/images/management.png", "alt", "Icon app number 3", 1, "app-icon"], ["href", "http://localhost:8080/accWebRT/", "id", "testid5", "target", "iframe_a", "rel", "noopener", "aria-current", "false"], ["src", "../../AccGate/assets/images/dashboard.png", "alt", "Icon app number 4", 1, "app-icon"], ["href", "https://172.28.8.245:8445/accAgent/", "id", "testid6", "target", "iframe_a", "rel", "noopener", "aria-current", "false"], ["src", "../../AccGate/assets/images/management.png", "alt", "Icon app number 5", 1, "app-icon"]], template: function ProfileComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](0, ProfileComponent_div_0_Template, 84, 7, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, ProfileComponent_ng_template_1_Template, 1, 0, "ng-template", null, 1, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
    } if (rf & 2) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.currentUser)("ngIfElse", _r1);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgForOf], styles: [".app-icon[_ngcontent-%COMP%] {\r\n  width: 64px;\r\n  height: 64px;\r\n}\r\n\r\n.app-icon-wide[_ngcontent-%COMP%] {\r\n  width: 181px;\r\n  height: 65px;\r\n}\r\n\r\n\r\n\r\n.media[_ngcontent-%COMP%] {margin:10px;}\r\n\r\n.media[_ngcontent-%COMP%], .media-body[_ngcontent-%COMP%] {overflow:hidden; _overflow:visible; zoom:1;}\r\n\r\n.media[_ngcontent-%COMP%]   .app-icon[_ngcontent-%COMP%] {float:left; margin-right: 20px;}\r\n\r\n.media[_ngcontent-%COMP%]   .app-icon-wide[_ngcontent-%COMP%] {float:left; margin-right: 10px;}\r\n\r\n.media[_ngcontent-%COMP%]   .app-icon[_ngcontent-%COMP%]   app-icon[_ngcontent-%COMP%]{display:block;}\r\n\r\n.media[_ngcontent-%COMP%]   .imgExt[_ngcontent-%COMP%]{float:right; margin-left: 10px;}\r\n\r\n.mr-2[_ngcontent-%COMP%] {\r\n  width: 64px;\r\n  height: 64px;\r\n  \r\n  background-repeat: round;\r\n  background-position: top left;\r\n  \r\n  alt: \"jh,hgj,hjk\";\r\n}\r\n\r\n.mr-3[_ngcontent-%COMP%] {\r\n  width: 64px;\r\n  height: 64px;\r\n  background-image: url('management.png');\r\n  background-repeat: round;\r\n  background-position: top left;\r\n  \r\n  alt: \"jh,hgj,hjk\";\r\n}\r\n\r\n.font_0[_ngcontent-%COMP%] {\r\n  font-size:44px;\r\n  text-align:center;\r\n  color:#FFFFFF;\r\n}\r\n\r\n.background[_ngcontent-%COMP%] {\r\n  background-size: cover;\r\n  background-origin: border-box;\r\n  background-image: url('Background.webp');\r\n  \r\n  background-repeat: no-repeat;\r\n  background-position: top left;\r\n\r\n}\r\n\r\na[_ngcontent-%COMP%]:link {\r\n  color: green;\r\n  background-color: transparent;\r\n  text-decoration: none;\r\n}\r\n\r\na[_ngcontent-%COMP%]:visited {\r\n  color: pink;\r\n  background-color: transparent;\r\n  text-decoration: none;\r\n}\r\n\r\na[_ngcontent-%COMP%]:hover {\r\n  color: red;\r\n  background-color: transparent;\r\n  text-decoration: underline;\r\n}\r\n\r\na[_ngcontent-%COMP%]:active {\r\n  color: yellow;\r\n  background-color: transparent;\r\n  text-decoration: underline;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFdBQVc7RUFDWCxZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxZQUFZO0VBQ1osWUFBWTtBQUNkOztBQUdBLHdCQUF3Qjs7QUFDeEIsUUFBUSxXQUFXLENBQUM7O0FBQ3BCLHFCQUFxQixlQUFlLEdBQUUsZ0JBQWlCLEVBQUUsTUFBTSxDQUFDOztBQUNoRSxrQkFBa0IsVUFBVSxFQUFFLGtCQUFrQixDQUFDOztBQUNqRCx1QkFBdUIsVUFBVSxFQUFFLGtCQUFrQixDQUFDOztBQUN0RCwwQkFBMEIsYUFBYSxDQUFDOztBQUN4QyxlQUFlLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQzs7QUFFOUM7RUFDRSxXQUFXO0VBQ1gsWUFBWTtFQUNaLDZEQUE2RDtFQUM3RCx3QkFBd0I7RUFDeEIsNkJBQTZCO0VBQzdCLCtDQUErQztFQUMvQyxpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsWUFBWTtFQUNaLHVDQUFnRTtFQUNoRSx3QkFBd0I7RUFDeEIsNkJBQTZCO0VBQzdCLCtDQUErQztFQUMvQyxpQkFBaUI7QUFDbkI7O0FBR0E7RUFDRSxjQUFjO0VBQ2QsaUJBQWlCO0VBQ2pCLGFBQWE7QUFDZjs7QUFJQTtFQUNFLHNCQUFzQjtFQUN0Qiw2QkFBNkI7RUFDN0Isd0NBQWlFO0VBQ2pFLDJFQUEyRTtFQUMzRSw0QkFBNEI7RUFDNUIsNkJBQTZCOztBQUUvQjs7QUFFQTtFQUNFLFlBQVk7RUFDWiw2QkFBNkI7RUFDN0IscUJBQXFCO0FBQ3ZCOztBQUNBO0VBQ0UsV0FBVztFQUNYLDZCQUE2QjtFQUM3QixxQkFBcUI7QUFDdkI7O0FBQ0E7RUFDRSxVQUFVO0VBQ1YsNkJBQTZCO0VBQzdCLDBCQUEwQjtBQUM1Qjs7QUFDQTtFQUNFLGFBQWE7RUFDYiw2QkFBNkI7RUFDN0IsMEJBQTBCO0FBQzVCIiwiZmlsZSI6InByb2ZpbGUuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5hcHAtaWNvbiB7XHJcbiAgd2lkdGg6IDY0cHg7XHJcbiAgaGVpZ2h0OiA2NHB4O1xyXG59XHJcblxyXG4uYXBwLWljb24td2lkZSB7XHJcbiAgd2lkdGg6IDE4MXB4O1xyXG4gIGhlaWdodDogNjVweDtcclxufVxyXG5cclxuXHJcbi8qID09PT09PSBtZWRpYSA9PT09PT0gKi9cclxuLm1lZGlhIHttYXJnaW46MTBweDt9XHJcbi5tZWRpYSwgLm1lZGlhLWJvZHkge292ZXJmbG93OmhpZGRlbjsgX292ZXJmbG93OnZpc2libGU7IHpvb206MTt9XHJcbi5tZWRpYSAuYXBwLWljb24ge2Zsb2F0OmxlZnQ7IG1hcmdpbi1yaWdodDogMjBweDt9XHJcbi5tZWRpYSAuYXBwLWljb24td2lkZSB7ZmxvYXQ6bGVmdDsgbWFyZ2luLXJpZ2h0OiAxMHB4O31cclxuLm1lZGlhIC5hcHAtaWNvbiBhcHAtaWNvbntkaXNwbGF5OmJsb2NrO31cclxuLm1lZGlhIC5pbWdFeHR7ZmxvYXQ6cmlnaHQ7IG1hcmdpbi1sZWZ0OiAxMHB4O31cclxuXHJcbi5tci0yIHtcclxuICB3aWR0aDogNjRweDtcclxuICBoZWlnaHQ6IDY0cHg7XHJcbiAgLypiYWNrZ3JvdW5kLWltYWdlOiB1cmwoLi4vLi4vYXNzZXRzL2ltYWdlcy9tYW5hZ2VtZW50LnBuZyk7Ki9cclxuICBiYWNrZ3JvdW5kLXJlcGVhdDogcm91bmQ7XHJcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogdG9wIGxlZnQ7XHJcbiAgLypiYWNrZ3JvdW5kLW9yaWdpbjogcGFkZGluZy1ib3gsIGNvbnRlbnQtYm94OyovXHJcbiAgYWx0OiBcImpoLGhnaixoamtcIjtcclxufVxyXG5cclxuLm1yLTMge1xyXG4gIHdpZHRoOiA2NHB4O1xyXG4gIGhlaWdodDogNjRweDtcclxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoLi4vX3NlcnZpY2VzL2Fzc2V0cy9pbWFnZXMvbWFuYWdlbWVudC5wbmcpO1xyXG4gIGJhY2tncm91bmQtcmVwZWF0OiByb3VuZDtcclxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiB0b3AgbGVmdDtcclxuICAvKmJhY2tncm91bmQtb3JpZ2luOiBwYWRkaW5nLWJveCwgY29udGVudC1ib3g7Ki9cclxuICBhbHQ6IFwiamgsaGdqLGhqa1wiO1xyXG59XHJcblxyXG5cclxuLmZvbnRfMCB7XHJcbiAgZm9udC1zaXplOjQ0cHg7XHJcbiAgdGV4dC1hbGlnbjpjZW50ZXI7XHJcbiAgY29sb3I6I0ZGRkZGRjtcclxufVxyXG5cclxuXHJcblxyXG4uYmFja2dyb3VuZCB7XHJcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcclxuICBiYWNrZ3JvdW5kLW9yaWdpbjogYm9yZGVyLWJveDtcclxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoLi4vX3NlcnZpY2VzL2Fzc2V0cy9pbWFnZXMvQmFja2dyb3VuZC53ZWJwKTtcclxuICAvKmxpbmVhci1ncmFkaWVudCh0byByaWdodCwgcmdiYSgzMCwgNzUsIDExNSwgMSksIHJnYmEoMjU1LCAyNTUsIDI1NSwgMCkpOyovXHJcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcclxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiB0b3AgbGVmdDtcclxuXHJcbn1cclxuXHJcbmE6bGluayB7XHJcbiAgY29sb3I6IGdyZWVuO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxufVxyXG5hOnZpc2l0ZWQge1xyXG4gIGNvbG9yOiBwaW5rO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxufVxyXG5hOmhvdmVyIHtcclxuICBjb2xvcjogcmVkO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xyXG59XHJcbmE6YWN0aXZlIHtcclxuICBjb2xvcjogeWVsbG93O1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xyXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xyXG59XHJcbiJdfQ== */"] });


/***/ }),

/***/ 29087:
/*!************************************************!*\
  !*** ./src/app/register/register.component.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RegisterComponent": function() { return /* binding */ RegisterComponent; }
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_services/auth.service */ 88368);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 38583);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 3679);




function RegisterComponent_form_3_div_7_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Username is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function RegisterComponent_form_3_div_7_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Username must be at least 3 characters ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function RegisterComponent_form_3_div_7_div_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Username must be at most 20 characters ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function RegisterComponent_form_3_div_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, RegisterComponent_form_3_div_7_div_1_Template, 2, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, RegisterComponent_form_3_div_7_div_2_Template, 2, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](3, RegisterComponent_form_3_div_7_div_3_Template, 2, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r3.errors.required);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r3.errors.minlength);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r3.errors.maxlength);
} }
function RegisterComponent_form_3_div_13_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Email is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function RegisterComponent_form_3_div_13_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Email must be a valid email address ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function RegisterComponent_form_3_div_13_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, RegisterComponent_form_3_div_13_div_1_Template, 2, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, RegisterComponent_form_3_div_13_div_2_Template, 2, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r5.errors.required);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r5.errors.email);
} }
function RegisterComponent_form_3_div_19_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Password is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function RegisterComponent_form_3_div_19_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Password must be at least 6 characters ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function RegisterComponent_form_3_div_19_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, RegisterComponent_form_3_div_19_div_1_Template, 2, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, RegisterComponent_form_3_div_19_div_2_Template, 2, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r7.errors.required);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r7.errors.minlength);
} }
function RegisterComponent_form_3_div_23_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Signup failed!");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", ctx_r9.errorMessage, " ");
} }
function RegisterComponent_form_3_Template(rf, ctx) { if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "form", 5, 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function RegisterComponent_form_3_Template_form_ngSubmit_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r18); const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](1); const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return _r2.form.valid && ctx_r17.onSubmit(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "label", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Username");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "input", 9, 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function RegisterComponent_form_3_Template_input_ngModelChange_5_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r18); const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r19.form.username = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, RegisterComponent_form_3_div_7_Template, 4, 3, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "label", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "Email");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "input", 13, 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function RegisterComponent_form_3_Template_input_ngModelChange_11_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r18); const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r20.form.email = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](13, RegisterComponent_form_3_div_13_Template, 3, 2, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "label", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "Password");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "input", 16, 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function RegisterComponent_form_3_Template_input_ngModelChange_17_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r18); const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r21.form.password = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](19, RegisterComponent_form_3_div_19_Template, 3, 2, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "Sign Up");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](23, RegisterComponent_form_3_div_23_Template, 4, 1, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](1);
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](6);
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](12);
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](18);
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r0.form.username);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r3.errors && _r2.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r0.form.email);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r5.errors && _r2.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r0.form.password);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r7.errors && _r2.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _r2.submitted && ctx_r0.isSignUpFailed);
} }
function RegisterComponent_div_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Your registration is successful! ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
class RegisterComponent {
    constructor(authService) {
        this.authService = authService;
        this.form = {
            username: null,
            email: null /*new FormControl('', Validators.email)*/,
            password: null
        };
        this.isSuccessful = false;
        this.isSignUpFailed = false;
        this.errorMessage = '';
        this.empList = [];
        this.closeResult = '';
        this.empList.push("admin");
    }
    ngOnInit() {
    }
    onSubmit() {
        const { username, email, password } = this.form;
        this.authService.register(username, email, password, this.empList).subscribe(data => {
            console.log(data);
            this.isSuccessful = true;
            this.isSignUpFailed = false;
        }, err => {
            this.errorMessage = err.error.message;
            this.isSignUpFailed = true;
        });
    }
}
RegisterComponent.ɵfac = function RegisterComponent_Factory(t) { return new (t || RegisterComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService)); };
RegisterComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: RegisterComponent, selectors: [["app-register"]], decls: 5, vars: 2, consts: [[1, "col-md-12"], [1, "card", "card-container"], ["id", "profile-img", "src", "//ssl.gstatic.com/accounts/ui/avatar_2x.png", 1, "profile-img-card"], ["name", "form", "novalidate", "", 3, "ngSubmit", 4, "ngIf"], ["class", "alert alert-success", 4, "ngIf"], ["name", "form", "novalidate", "", 3, "ngSubmit"], ["f", "ngForm"], [1, "form-group"], ["for", "username"], ["type", "text", "name", "username", "required", "", "minlength", "3", "maxlength", "20", 1, "form-control", 3, "ngModel", "ngModelChange"], ["username", "ngModel"], ["class", "alert-danger", 4, "ngIf"], ["for", "email"], ["type", "email", "name", "email", "required", "", "email", "", 1, "form-control", 3, "ngModel", "ngModelChange"], ["email", "ngModel"], ["for", "password"], ["type", "password", "name", "password", "required", "", "minlength", "6", 1, "form-control", 3, "ngModel", "ngModelChange"], ["password", "ngModel"], [1, "btn", "btn-primary", "btn-block"], ["class", "alert alert-warning", 4, "ngIf"], [1, "alert-danger"], [4, "ngIf"], [1, "alert", "alert-warning"], [1, "alert", "alert-success"]], template: function RegisterComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "img", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](3, RegisterComponent_form_3_Template, 24, 7, "form", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, RegisterComponent_div_4_Template, 2, 0, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.isSuccessful);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.isSuccessful);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgForm, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.EmailValidator], styles: ["label[_ngcontent-%COMP%] {\r\n  display: block;\r\n  margin-top: 10px;\r\n}\r\n\r\n.card-container.card[_ngcontent-%COMP%] {\r\n  max-width: 400px !important;\r\n  padding: 40px 40px;\r\n}\r\n\r\n.card[_ngcontent-%COMP%] {\r\n  background-color: #f7f7f7;\r\n  padding: 20px 25px 30px;\r\n  margin: 0 auto 25px;\r\n  margin-top: 50px;\r\n  border-radius: 2px;\r\n  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n.profile-img-card[_ngcontent-%COMP%] {\r\n  width: 96px;\r\n  height: 96px;\r\n  margin: 0 auto 10px;\r\n  display: block;\r\n  border-radius: 50%;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlZ2lzdGVyLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxjQUFjO0VBQ2QsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsMkJBQTJCO0VBQzNCLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6Qix1QkFBdUI7RUFDdkIsbUJBQW1CO0VBQ25CLGdCQUFnQjtFQUdoQixrQkFBa0I7RUFHbEIsMENBQTBDO0FBQzVDOztBQUVBO0VBQ0UsV0FBVztFQUNYLFlBQVk7RUFDWixtQkFBbUI7RUFDbkIsY0FBYztFQUdkLGtCQUFrQjtBQUNwQiIsImZpbGUiOiJyZWdpc3Rlci5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsibGFiZWwge1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIG1hcmdpbi10b3A6IDEwcHg7XHJcbn1cclxuXHJcbi5jYXJkLWNvbnRhaW5lci5jYXJkIHtcclxuICBtYXgtd2lkdGg6IDQwMHB4ICFpbXBvcnRhbnQ7XHJcbiAgcGFkZGluZzogNDBweCA0MHB4O1xyXG59XHJcblxyXG4uY2FyZCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y3ZjdmNztcclxuICBwYWRkaW5nOiAyMHB4IDI1cHggMzBweDtcclxuICBtYXJnaW46IDAgYXV0byAyNXB4O1xyXG4gIG1hcmdpbi10b3A6IDUwcHg7XHJcbiAgLW1vei1ib3JkZXItcmFkaXVzOiAycHg7XHJcbiAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAycHg7XHJcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xyXG4gIC1tb3otYm94LXNoYWRvdzogMHB4IDJweCAycHggcmdiYSgwLCAwLCAwLCAwLjMpO1xyXG4gIC13ZWJraXQtYm94LXNoYWRvdzogMHB4IDJweCAycHggcmdiYSgwLCAwLCAwLCAwLjMpO1xyXG4gIGJveC1zaGFkb3c6IDBweCAycHggMnB4IHJnYmEoMCwgMCwgMCwgMC4zKTtcclxufVxyXG5cclxuLnByb2ZpbGUtaW1nLWNhcmQge1xyXG4gIHdpZHRoOiA5NnB4O1xyXG4gIGhlaWdodDogOTZweDtcclxuICBtYXJnaW46IDAgYXV0byAxMHB4O1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIC1tb3otYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gIC13ZWJraXQtYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcclxufSJdfQ== */"] });


/***/ }),

/***/ 92340:
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "environment": function() { return /* binding */ environment; }
/* harmony export */ });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ 14431:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ 39075);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37716);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 36747);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ 92340);




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.production) {
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.enableProdMode)();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule)
    .catch(err => console.error(err));


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["vendor"], function() { return __webpack_exec__(14431); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main-es2017.js.map