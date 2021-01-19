import { TestBed } from '@angular/core/testing';

import { LimbleTreeService } from './limble-tree.service';

describe('LimbleTreeService', () => {
  let service: LimbleTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LimbleTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
