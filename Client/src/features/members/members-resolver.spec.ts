import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { membersResolver } from './members-resolver';

describe('membersResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => membersResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
