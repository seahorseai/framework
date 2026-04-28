import { TestBed } from '@angular/core/testing';
import { GetAccountUserStory } from './get-account.user-story';



describe('PrintAvatarService', () => {
  let service: GetAccountUserStory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAccountUserStory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
