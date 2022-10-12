import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import {HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => { TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [UserService]
  });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    //const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });

  it('should have getData function', () => {
    //const service: UserService = TestBed.get(UserService);
    expect(service.getUserBoard).toBeTruthy();
  });
});
