import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilterswitcherPage } from './filterswitcher.page';

describe('FilterswitcherPage', () => {
  let component: FilterswitcherPage;
  let fixture: ComponentFixture<FilterswitcherPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterswitcherPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterswitcherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
