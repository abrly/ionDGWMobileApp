import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewappointmentPage } from './newappointment.page';

describe('NewappointmentPage', () => {
  let component: NewappointmentPage;
  let fixture: ComponentFixture<NewappointmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewappointmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewappointmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
