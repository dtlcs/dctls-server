import { TestBed, inject } from '@angular/core/testing';

import { ManageUsersService } from './manage-users.service';

describe('ManageUsersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageUsersService]
    });
  });

  it('should be created', inject([ManageUsersService], (service: ManageUsersService) => {
    expect(service).toBeTruthy();
  }));
});
