import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacePassFormComponent } from './replace-pass-form.component';

describe('ModalComponent', () => {
  let component: ReplacePassFormComponent;
  let fixture: ComponentFixture<ReplacePassFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplacePassFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacePassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
