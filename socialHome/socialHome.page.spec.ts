import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SocialHomePage } from './socialHome.page';

describe('SocialHomePage', () => {
  let component: SocialHomePage;
  let fixture: ComponentFixture<SocialHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SocialHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
