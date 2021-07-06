import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalNewPostPage } from './modal-new-post.page';

describe('ModalNewPostPage', () => {
  let component: ModalNewPostPage;
  let fixture: ComponentFixture<ModalNewPostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewPostPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalNewPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
