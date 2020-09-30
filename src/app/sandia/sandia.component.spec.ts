import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SandiaComponent } from './sandia.component';

describe('SandiaComponent', () => {
  let component: SandiaComponent;
  let fixture: ComponentFixture<SandiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SandiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SandiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
