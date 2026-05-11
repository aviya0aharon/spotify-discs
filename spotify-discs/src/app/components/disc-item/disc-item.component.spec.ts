import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscItemComponent } from './disc-item.component';

describe('DiscItemComponent', () => {
  let component: DiscItemComponent;
  let fixture: ComponentFixture<DiscItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
