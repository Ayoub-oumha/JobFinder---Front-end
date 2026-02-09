import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Candidatures } from './candidatures';

describe('Candidatures', () => {
  let component: Candidatures;
  let fixture: ComponentFixture<Candidatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Candidatures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Candidatures);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
