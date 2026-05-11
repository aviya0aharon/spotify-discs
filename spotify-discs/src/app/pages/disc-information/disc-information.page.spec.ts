import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscInformationPage } from './disc-information.page';

describe('DiscInformationPage', () => {
  let component: DiscInformationPage;
  let fixture: ComponentFixture<DiscInformationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscInformationPage]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DiscInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
