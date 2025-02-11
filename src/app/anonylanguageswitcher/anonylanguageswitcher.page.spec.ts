import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnonylanguageswitcherPage } from './anonylanguageswitcher.page';

describe('AnonylanguageswitcherPage', () => {
  let component: AnonylanguageswitcherPage;
  let fixture: ComponentFixture<AnonylanguageswitcherPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnonylanguageswitcherPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnonylanguageswitcherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
